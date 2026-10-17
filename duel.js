/* =========================================================
   Kantor Layanan Perasaan · Mode Duel (2 pemain, satu HP)
   HP ditaruh di meja, dua pemain duduk hadap-hadapan:
   Pemain 1 di bawah (biru), Pemain 2 di atas (oranye, tampilan diputar).
   Turnamen beberapa ronde dari 4 game, atau lawan bot Pak Satpam.
   ========================================================= */
(() => {
  "use strict";
  const K = window.KLP;
  const { $, esc, px, sfx, memo, NAMA } = K;
  const acak = (a, b) => a + Math.random() * (b - a);
  const batas = (v, a, b) => Math.max(a, Math.min(b, v));
  const WARNA = { 1: "#3E78C4", 2: "#E58B3A" };
  const WARNA_MUDA = { 1: "#CFE0F5", 2: "#FBE0C4" };
  const KARAKTER = ["kapibara", "kura", "marmut", "kukang", "oyen", "badak", "rakun", "berang", "singa", "gajah", "hantu", "beruang"];
  const FONT = (n) => `${n}px "Pixelify Sans", monospace`;

  /* ---------- gambar sprite di kanvas ---------- */
  const GAMBAR = {};
  function sp(nama) {
    if (!GAMBAR[nama]) { const i = new Image(); i.src = window.SPRITE.png(nama, 8); GAMBAR[nama] = i; }
    return GAMBAR[nama];
  }

  /* ---------- daftar game duel ---------- */
  const DUEL_GAME = {
    hoki: { nama: "Hoki Meja Rapat", ikon: "cangkir", cara: "Geser tatakan gelasmu untuk memukul donat ke gawang lawan. Yang duluan 4 gol, menang." },
    cap: { nama: "Cap Duluan", ikon: "berkas", cara: "Tunggu sampai lampu jadi hijau bertuliskan CAP, lalu ketuk sisimu secepatnya. Ketuk kecepetan = poin buat lawan. Hati-hati lampu palsu. Duluan 3 poin, menang." },
    tarik: { nama: "Tarik Map", ikon: "dokumen", cara: "Ketuk sisimu secepat mungkin untuk menarik map ke arahmu. Rebut gelas kopi yang muncul untuk tarikan dua kali lipat." },
    kabel: { nama: "Kabel Kusut", ikon: "radio", cara: "Kabelmu jalan terus. Ketuk kiri atau kanan di sisimu untuk belok. Jangan menabrak kabel siapa pun atau dinding. Duluan menang 2 kali." },
  };
  K.DUEL_GAME = DUEL_GAME;

  /* =========================================================
     LAPISAN, KANVAS, SENTUHAN
     ========================================================= */
  const lapis = document.createElement("div");
  lapis.className = "duel"; lapis.id = "duel"; lapis.hidden = true;
  lapis.setAttribute("role", "dialog"); lapis.setAttribute("aria-modal", "true"); lapis.setAttribute("aria-label", "Mode Duel dua pemain");
  lapis.innerHTML = `
    <canvas id="duelKanvas" hidden></canvas>
    <div class="duel-panel" id="duelPanel"></div>
    <button class="duel-keluar" id="duelKeluar" type="button" aria-label="Keluar dari Mode Duel">✕</button>`;
  document.body.appendChild(lapis);
  const kanvas = $("#duelKanvas"), ctx = kanvas.getContext("2d"), panel = $("#duelPanel");
  let W = 360, H = 640, skala = 1;
  function siapkanKanvas() {
    const r = lapis.getBoundingClientRect();
    const cssW = Math.min(r.width, 520), cssH = r.height;
    const dpr = Math.min(2, devicePixelRatio || 1);
    kanvas.style.width = `${cssW}px`; kanvas.style.height = `${cssH}px`;
    kanvas.width = Math.round(cssW * dpr); kanvas.height = Math.round(cssH * dpr);
    skala = cssW / 360; W = 360; H = cssH / skala;
    ctx.setTransform(dpr * skala, 0, 0, dpr * skala, 0, 0);
    ctx.imageSmoothingEnabled = false;
  }
  addEventListener("resize", () => { if (!lapis.hidden && !kanvas.hidden) siapkanKanvas(); });

  // sentuhan: tiap jari dicatat pemiliknya (setengah bawah = P1, atas = P2)
  const jari = new Map();
  let pendengar = null;
  const titik = (e) => { const r = kanvas.getBoundingClientRect(); return { x: (e.clientX - r.left) / skala, y: (e.clientY - r.top) / skala }; };
  kanvas.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    const t = titik(e), p = t.y >= H / 2 ? 1 : 2;
    if (p === 2 && sesi?.bot) return;
    jari.set(e.pointerId, { p, ...t });
    try { kanvas.setPointerCapture(e.pointerId); } catch { /* tidak apa-apa */ }
    pendengar?.tekan?.(p, t.x, t.y, e.pointerId);
  });
  kanvas.addEventListener("pointermove", (e) => {
    const j = jari.get(e.pointerId);
    if (!j) return;
    const t = titik(e); j.x = t.x; j.y = t.y;
    pendengar?.geser?.(j.p, t.x, t.y, e.pointerId);
  });
  const lepas = (e) => { const j = jari.get(e.pointerId); if (!j) return; jari.delete(e.pointerId); pendengar?.lepas?.(j.p, e.pointerId); };
  kanvas.addEventListener("pointerup", lepas);
  kanvas.addEventListener("pointercancel", lepas);
  kanvas.addEventListener("contextmenu", (e) => e.preventDefault());

  /* ---------- perkakas gambar ---------- */
  // tulisan untuk pemain 2 diputar 180° supaya terbaca dari seberang meja
  function tulis(teks, x, y, ukuran, warna = "#2B2A26", p = 1, rata = "center") {
    ctx.save(); ctx.translate(x, y); if (p === 2) ctx.rotate(Math.PI);
    ctx.font = FONT(ukuran); ctx.fillStyle = warna; ctx.textAlign = rata; ctx.textBaseline = "middle";
    ctx.fillText(teks, 0, 0); ctx.restore();
  }
  function sprite(nama, x, y, uk, p = 1) {
    const i = sp(nama);
    if (!i.complete) return;
    ctx.save(); ctx.translate(x, y); if (p === 2) ctx.rotate(Math.PI);
    ctx.drawImage(i, -uk / 2, -uk / 2, uk, uk); ctx.restore();
  }
  function lingkaran(x, y, r, isi, garis = "#2B2A26", tebal = 3) {
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
    if (isi) { ctx.fillStyle = isi; ctx.fill(); }
    if (garis) { ctx.lineWidth = tebal; ctx.strokeStyle = garis; ctx.stroke(); }
  }
  // papan skor kecil di masing-masing sisi
  function skorSisi(p, nilai, maks, label) {
    const y = p === 1 ? H - 24 : 24;
    ctx.save(); ctx.translate(W - 46, y); if (p === 2) ctx.rotate(Math.PI);
    ctx.fillStyle = "rgba(43,42,38,.78)"; ctx.fillRect(-40, -15, 80, 30);
    ctx.font = FONT(16); ctx.fillStyle = WARNA_MUDA[p]; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(`${label ?? ""}${nilai}${maks ? `/${maks}` : ""}`, 0, 1);
    ctx.restore();
  }
  function loop(fn) {
    let jalan = true, lalu = performance.now(), raf = 0;
    const putar = (now) => {
      if (!jalan) return;
      const dt = Math.min(0.04, (now - lalu) / 1000); lalu = now;
      if (!document.hidden) fn(dt, now / 1000);
      raf = requestAnimationFrame(putar);
    };
    raf = requestAnimationFrame(putar);
    return () => { jalan = false; cancelAnimationFrame(raf); };
  }
  const kilat = [];
  let komentar = "", umurKomentar = 0;
  function pasangKomentar(t) { komentar = t; umurKomentar = 2.2; }
  function tambahKilat(teks, x, y, warna, p = 1) { kilat.push({ teks, x, y, warna, p, umur: 0 }); }
  function gambarKilat(dt) {
    for (let i = kilat.length - 1; i >= 0; i--) {
      const k = kilat[i]; k.umur += dt;
      if (k.umur > 1) { kilat.splice(i, 1); continue; }
      ctx.globalAlpha = 1 - k.umur;
      tulis(k.teks, k.x, k.y + (k.p === 1 ? -1 : 1) * k.umur * 30, 20, k.warna, k.p);
    }
    ctx.globalAlpha = 1;
    // komentator: pita kecil di tengah, terbaca dari dua sisi
    if (umurKomentar > 0) {
      umurKomentar -= dt;
      ctx.globalAlpha = Math.min(1, umurKomentar * 2);
      ctx.fillStyle = "rgba(43,42,38,.82)"; ctx.fillRect(0, H / 2 - 30, W, 60);
      ctx.font = FONT(12); const pendek = komentar.length > 52 ? `${komentar.slice(0, 50)}…` : komentar;
      tulis(pendek, W / 2, H / 2 + 14, 12, "#F2C14E", 1); tulis(pendek, W / 2, H / 2 - 14, 12, "#F2C14E", 2);
      ctx.globalAlpha = 1;
    }
  }

  /* =========================================================
     GAME DUEL
     ========================================================= */
  const MAIN = {};

  /* ---------- 1. Hoki Meja Rapat ---------- */
  MAIN.hoki = (g) => {
    const TARGET = 4, RP = 26, RD = 13, MULUT = 116, TEPI = 10;
    const skor = { 1: 0, 2: 0 };
    const pad = { 1: { x: W / 2, y: H - 80, vx: 0, vy: 0, tx: W / 2, ty: H - 80 }, 2: { x: W / 2, y: 80, vx: 0, vy: 0, tx: W / 2, ty: 80 } };
    const donat = { x: W / 2, y: H / 2, vx: 0, vy: 0 };
    let jeda = 0.9, waktu = 0, selesai = false, getar = 0, sisa = 75;
    const batasY = (p, y) => (p === 1 ? batas(y, H / 2 + RP, H - TEPI - RP) : batas(y, TEPI + RP, H / 2 - RP));
    pendengar = {
      tekan(p, x, y) { pad[p].tx = batas(x, TEPI + RP, W - TEPI - RP); pad[p].ty = batasY(p, y); },
      geser(p, x, y) { pad[p].tx = batas(x, TEPI + RP, W - TEPI - RP); pad[p].ty = batasY(p, y); },
    };
    lapis._uji = { donat, pad, skor };          // untuk pengujian otomatis
    function taruh(untuk) { donat.x = W / 2; donat.y = untuk === 1 ? H / 2 + 60 : untuk === 2 ? H / 2 - 60 : H / 2; donat.vx = donat.vy = 0; jeda = 0.9; }
    function gol(p) {
      skor[p]++; sfx("menang"); getar = 0.35;
      tambahKilat("GOL!", W / 2, p === 1 ? H * 0.72 : H * 0.28, WARNA[p], p);
      g.komentar(`Pak Singa: PERHATIAN. Gol untuk ${g.nama[p]}. ${skor[1]}–${skor[2]}.`);
      if (skor[p] >= TARGET) { selesai = true; setTimeout(() => g.selesai(p, `${skor[1]}–${skor[2]}`), 900); }
      else taruh(p === 1 ? 2 : 1);
    }
    function botGerak(dt) {
      const lv = g.bot.level, laju = [250, 360, 500][lv] * dt;
      const b = pad[2];
      let tx, ty;
      const jangkau = donat.y < H / 2 + RP + RD - 6 && (donat.vy < 160 || donat.y < b.y + 10);
      if (jangkau) {
        // ambil ancang-ancang di belakang donat, lalu sodok ke arah gawang lawan
        const sejajar = Math.abs(b.x - donat.x) < 14 + lv * 4 && b.y < donat.y - 18;
        if (sejajar) { tx = donat.x + (W / 2 - donat.x) * 0.15; ty = donat.y + 40; }
        else { tx = donat.x - (W / 2 - donat.x) * 0.1; ty = Math.max(TEPI + RP, donat.y - RP - RD - 16); }
      } else { tx = W / 2 + (donat.x - W / 2) * 0.55; ty = 70; }
      tx += Math.sin(waktu * 2) * [22, 12, 4][lv];
      b.tx = b.x + batas(tx - b.x, -laju, laju) * 6; b.ty = b.y + batas(ty - b.y, -laju, laju) * 6;
      b.tx = batas(b.tx, TEPI + RP, W - TEPI - RP); b.ty = batasY(2, b.ty);
    }
    return loop((dt) => {
      waktu += dt;
      if (!selesai && jeda <= 0) {
        sisa -= dt;
        if (sisa <= 0) {
          selesai = true; sfx("tingtong");
          const p = skor[1] > skor[2] ? 1 : skor[2] > skor[1] ? 2 : 0;
          g.komentar(`Pak Singa: Waktu habis. ${skor[1]}–${skor[2]}.`);
          setTimeout(() => g.selesai(p, `${skor[1]}–${skor[2]}, waktu habis`), 900);
        }
      }
      if (g.bot && !selesai) botGerak(dt);
      for (const p of [1, 2]) {
        const q = pad[p], nx = q.x + (q.tx - q.x) * Math.min(1, dt * 22), ny = q.y + (q.ty - q.y) * Math.min(1, dt * 22);
        q.vx = (nx - q.x) / dt; q.vy = (ny - q.y) / dt; q.x = nx; q.y = ny;
      }
      if (jeda > 0) jeda -= dt;
      else if (!selesai) {
        const langkah = 4, h = dt / langkah;
        for (let s = 0; s < langkah; s++) {
          donat.x += donat.vx * h; donat.y += donat.vy * h;
          // dinding samping
          if (donat.x < TEPI + RD) { donat.x = TEPI + RD; donat.vx = Math.abs(donat.vx) * 0.92; sfx("klik"); }
          if (donat.x > W - TEPI - RD) { donat.x = W - TEPI - RD; donat.vx = -Math.abs(donat.vx) * 0.92; sfx("klik"); }
          const diMulut = Math.abs(donat.x - W / 2) < MULUT / 2 - 4;
          if (donat.y < TEPI + RD && !diMulut) { donat.y = TEPI + RD; donat.vy = Math.abs(donat.vy) * 0.92; sfx("klik"); }
          if (donat.y > H - TEPI - RD && !diMulut) { donat.y = H - TEPI - RD; donat.vy = -Math.abs(donat.vy) * 0.92; sfx("klik"); }
          if (donat.y < -RD) { gol(1); break; }
          if (donat.y > H + RD) { gol(2); break; }
          // tatakan
          for (const p of [1, 2]) {
            const q = pad[p], dx = donat.x - q.x, dy = donat.y - q.y, jarak = Math.hypot(dx, dy);
            if (jarak < RP + RD && jarak > 0.01) {
              const nx = dx / jarak, ny = dy / jarak;
              donat.x = q.x + nx * (RP + RD); donat.y = q.y + ny * (RP + RD);
              const rvx = donat.vx - q.vx, rvy = donat.vy - q.vy, vn = rvx * nx + rvy * ny;
              if (vn < 0) { donat.vx -= 1.85 * vn * nx; donat.vy -= 1.85 * vn * ny; sfx("pukul"); }
              donat.vx += q.vx * 0.12; donat.vy += q.vy * 0.12;
            }
          }
          const v = Math.hypot(donat.vx, donat.vy), MAKS = 1000;
          if (v > MAKS) { donat.vx *= MAKS / v; donat.vy *= MAKS / v; }
        }
        const gesek = Math.pow(0.85, dt); donat.vx *= gesek; donat.vy *= gesek;
      }
      if (getar > 0) getar -= dt;
      // gambar meja rapat
      ctx.save();
      if (getar > 0) ctx.translate(Math.sin(waktu * 90) * 3, 0);
      ctx.fillStyle = "#6B4A2E"; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#9C6B43"; ctx.fillRect(TEPI, TEPI, W - TEPI * 2, H - TEPI * 2);
      ctx.fillStyle = "rgba(0,0,0,.06)"; for (let y = TEPI; y < H; y += 26) ctx.fillRect(TEPI, y, W - TEPI * 2, 2);
      ctx.fillStyle = WARNA[2]; ctx.fillRect(W / 2 - MULUT / 2, 0, MULUT, TEPI);
      ctx.fillStyle = WARNA[1]; ctx.fillRect(W / 2 - MULUT / 2, H - TEPI, MULUT, TEPI);
      ctx.strokeStyle = "rgba(255,253,246,.55)"; ctx.lineWidth = 3; ctx.setLineDash([10, 10]);
      ctx.beginPath(); ctx.moveTo(TEPI, H / 2); ctx.lineTo(W - TEPI, H / 2); ctx.stroke(); ctx.setLineDash([]);
      lingkaran(W / 2, H / 2, 46, null, "rgba(255,253,246,.55)", 3);
      [1, 2].forEach((p) => { const y = p === 1 ? H - TEPI : TEPI; ctx.beginPath(); ctx.arc(W / 2, y, 64, p === 1 ? Math.PI : 0, p === 1 ? Math.PI * 2 : Math.PI); ctx.strokeStyle = "rgba(255,253,246,.4)"; ctx.stroke(); });
      // donat
      ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.beginPath(); ctx.ellipse(donat.x + 3, donat.y + 4, RD, RD * 0.8, 0, 0, 7); ctx.fill();
      lingkaran(donat.x, donat.y, RD, "#E0A458"); lingkaran(donat.x, donat.y, RD - 4, "#7A4B2A", null);
      lingkaran(donat.x, donat.y, 4, "#9C6B43", "#2B2A26", 2);
      // tatakan gelas
      for (const p of [1, 2]) {
        const q = pad[p];
        ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.beginPath(); ctx.ellipse(q.x + 3, q.y + 5, RP, RP * 0.85, 0, 0, 7); ctx.fill();
        lingkaran(q.x, q.y, RP, WARNA[p]); lingkaran(q.x, q.y, RP - 9, WARNA_MUDA[p], "#2B2A26", 2);
        sprite(g.karakter[p], q.x, q.y, 26, p);
      }
      ctx.restore();
      skorSisi(1, skor[1], TARGET, "GOL "); skorSisi(2, skor[2], TARGET, "GOL ");
      const jam = `${Math.floor(Math.max(0, sisa) / 60)}:${String(Math.ceil(Math.max(0, sisa)) % 60).padStart(2, "0")}`;
      tulis(jam, W - 40, H / 2 + 18, 13, "rgba(255,253,246,.8)", 1); tulis(jam, W - 40, H / 2 - 18, 13, "rgba(255,253,246,.8)", 2);
      if (jeda > 0 && !selesai) { tulis("siap...", W / 2, H / 2 + 74, 14, "#FFFDF6", 1); tulis("siap...", W / 2, H / 2 - 74, 14, "#FFFDF6", 2); }
      gambarKilat(dt);
    });
  };

  /* ---------- 2. Cap Duluan (refleks) ---------- */
  MAIN.cap = (g) => {
    const TARGET = 3;
    const skor = { 1: 0, 2: 0 };
    let keadaan = "jeda", sisa = 1.2, waktuCap = 0, palsu = "", catatan = "", waktu = 0, selesai = false, botTunda = 0, terakhir = { 1: null, 2: null };
    const PALSU = [["lampu", "CAP?"], ["oyen", "Oyen lewat..."], ["lampu", "C...AP?"], ["dimas", "Dimas bersin"]];
    function ronde() { keadaan = "tunggu"; sisa = acak(1.4, 3.4); palsu = ""; botTunda = 0; }
    function poin(p, alasan) {
      skor[p]++; catatan = alasan; keadaan = "jeda"; sisa = 1.6;
      sfx(alasan.includes("kecepetan") ? "salah" : "stempel");
      if (skor[p] >= TARGET) { selesai = true; keadaan = "akhir"; setTimeout(() => g.selesai(p, `${skor[1]}–${skor[2]}`), 1200); }
    }
    function ketuk(p, kapan) {
      if (selesai) return;
      const lawan = p === 1 ? 2 : 1;
      if (keadaan === "tunggu" || keadaan === "palsu") { poin(lawan, `${g.nama[p]} kecepetan. Poin buat ${g.nama[lawan]}.`); return; }
      if (keadaan === "cap") {
        const ms = Math.round((kapan - waktuCap) * 1000);
        terakhir[p] = ms;
        poin(p, `${g.nama[p]} duluan: ${ms} ms.`);
        g.komentar(ms < 250 ? `Pak Singa: ${ms} MILIDETIK. Itu bukan tangan, itu kilat.` : `Pak Singa: Cap sah untuk ${g.nama[p]}.`);
      }
    }
    pendengar = { tekan(p) { ketuk(p, waktu); } };
    sisa = 1.0;
    return loop((dt) => {
      waktu += dt;
      if (!selesai) {
        sisa -= dt;
        if (keadaan === "jeda" && sisa <= 0) ronde();
        else if (keadaan === "tunggu" && sisa <= 0) {
          if (!palsu && Math.random() < 0.38) { keadaan = "palsu"; palsu = PALSU[Math.floor(Math.random() * PALSU.length)]; sisa = 0.9; sfx("klik"); }
          else { keadaan = "cap"; waktuCap = waktu; sfx("tingtong"); if (g.bot) botTunda = [0.52, 0.4, 0.3][g.bot.level] + acak(-0.07, 0.09); }
        } else if (keadaan === "palsu" && sisa <= 0) {
          keadaan = "tunggu"; sisa = acak(0.6, 1.6);
          if (g.bot && Math.random() < [0.16, 0.08, 0.03][g.bot.level]) ketuk(2, waktu);
        }
        if (keadaan === "cap" && g.bot && waktu - waktuCap >= botTunda) ketuk(2, waktu);
      }
      // gambar
      const hijau = keadaan === "cap";
      ctx.fillStyle = hijau ? "#3E6B4F" : keadaan === "palsu" ? "#9A7224" : "#2E2A3A"; ctx.fillRect(0, 0, W, H);
      [1, 2].forEach((p) => {
        const y0 = p === 1 ? H / 2 : 0;
        ctx.fillStyle = hijau ? "rgba(255,253,246,.12)" : `${WARNA[p]}33`; ctx.fillRect(0, y0, W, H / 2);
        sprite(g.karakter[p], W / 2, p === 1 ? H * 0.8 : H * 0.2, 64, p);
        tulis(g.nama[p], W / 2, p === 1 ? H * 0.8 + 46 : H * 0.2 - 46, 14, WARNA_MUDA[p], p);
        if (terakhir[p] !== null) tulis(`terakhir: ${terakhir[p]} ms`, W / 2, p === 1 ? H - 30 : 30, 12, "#EDE7D6", p);
        tulis(hijau ? "KETUK!" : "tunggu lampu hijau", W / 2, p === 1 ? H * 0.62 : H * 0.38, hijau ? 30 : 15, hijau ? "#FFFDF6" : "#CFC5AD", p);
      });
      // lampu stempel di tengah
      const r = 44 + (hijau ? Math.sin(waktu * 30) * 2 : 0);
      lingkaran(W / 2, H / 2, r + 8, "#2B2A26", null);
      lingkaran(W / 2, H / 2, r, hijau ? "#7FD18B" : keadaan === "palsu" ? "#F2C14E" : "#5D5A50", "#FFFDF6", 4);
      const teksTengah = hijau ? "CAP!" : keadaan === "palsu" ? palsu[1] : keadaan === "jeda" || keadaan === "akhir" ? "" : "...";
      if (keadaan === "palsu" && palsu[0] !== "lampu") sprite(palsu[0] === "oyen" ? "oyen" : "marmut", W / 2 + Math.sin(waktu * 3) * 90, H / 2, 40, 1);
      if (teksTengah) { tulis(teksTengah, W / 2, H / 2 + 12, hijau ? 26 : 14, "#2B2A26", 1); tulis(teksTengah, W / 2, H / 2 - 12, hijau ? 26 : 14, "#2B2A26", 2); }
      if (catatan && (keadaan === "jeda" || keadaan === "akhir")) { tulis(catatan, W / 2, H / 2 + 72, 13, "#FFFDF6", 1); tulis(catatan, W / 2, H / 2 - 72, 13, "#FFFDF6", 2); }
      skorSisi(1, skor[1], TARGET); skorSisi(2, skor[2], TARGET);
      gambarKilat(dt);
    });
  };

  /* ---------- 3. Tarik Map ---------- */
  MAIN.tarik = (g) => {
    const BATAS_WAKTU = 18;
    let pos = 0, waktu = 0, sisa = BATAS_WAKTU, selesai = false, kopi = null, jedaKopi = acak(3, 5), turbo = { 1: 0, 2: 0 }, botJeda = 0, botKopi = 0;
    const ketukan = { 1: 0, 2: 0 }, goyang = { 1: 0, 2: 0 };
    function tarik(p) {
      if (selesai) return;
      const kuat = 0.034 * (turbo[p] > 0 ? 2 : 1);
      pos += p === 1 ? kuat : -kuat;
      ketukan[p]++; goyang[p] = 0.12;
      if (ketukan[p] % 4 === 0) sfx("kertas");
      if (Math.abs(pos) >= 1) akhiri(pos > 0 ? 1 : 2);
    }
    function akhiri(p) {
      if (selesai) return;
      selesai = true; sfx("menang");
      setTimeout(() => g.selesai(p, p ? `${ketukan[1]} vs ${ketukan[2]} ketukan` : "seri"), 900);
    }
    pendengar = {
      tekan(p, x, y) {
        if (kopi && Math.hypot(x - kopi.x, y - kopi.y) < 34) { turbo[p] = 2.4; kopi = null; sfx("poin"); tambahKilat("TARIKAN x2!", W / 2, p === 1 ? H * 0.7 : H * 0.3, WARNA[p], p); g.komentar(`Pak Singa: ${g.nama[p]} merebut kopi. Tenaga dua kali lipat.`); return; }
        tarik(p);
      },
    };
    return loop((dt) => {
      waktu += dt;
      if (!selesai) {
        sisa -= dt;
        if (sisa <= 0) akhiri(Math.abs(pos) < 0.04 ? 0 : pos > 0 ? 1 : 2);
        jedaKopi -= dt;
        if (!kopi && jedaKopi <= 0) { kopi = { x: acak(60, W - 60), y: H / 2 + acak(-H * 0.18, H * 0.18), umur: 2.2 }; jedaKopi = acak(4, 6); botKopi = [0.9, 0.6, 0.38][g.bot?.level ?? 0] + acak(0, 0.3); }
        if (kopi) { kopi.umur -= dt; if (kopi.umur <= 0) kopi = null; }
        for (const p of [1, 2]) { if (turbo[p] > 0) turbo[p] -= dt; if (goyang[p] > 0) goyang[p] -= dt; }
        if (g.bot) {
          botJeda -= dt;
          if (botJeda <= 0) { tarik(2); botJeda = 1 / ([5.5, 7.5, 9.5][g.bot.level] + acak(-1, 1)); }
          if (kopi) { botKopi -= dt; if (botKopi <= 0 && kopi && kopi.y < H / 2 + 40) pendengar.tekan(2, kopi.x, kopi.y); }
        }
      }
      // gambar
      ctx.fillStyle = "#E9E2D0"; ctx.fillRect(0, 0, W, H);
      [1, 2].forEach((p) => { ctx.fillStyle = `${WARNA[p]}22`; ctx.fillRect(0, p === 1 ? H / 2 : 0, W, H / 2); });
      ctx.fillStyle = "#B5443A"; ctx.fillRect(0, H / 2 - 2, W, 4);
      // garis kemenangan
      const garisY = (p) => (p === 1 ? H / 2 + H * 0.32 : H / 2 - H * 0.32);
      [1, 2].forEach((p) => { ctx.setLineDash([8, 6]); ctx.strokeStyle = WARNA[p]; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(20, garisY(p)); ctx.lineTo(W - 20, garisY(p)); ctx.stroke(); ctx.setLineDash([]); });
      const tengahY = H / 2 + pos * H * 0.32;
      // tali (rantai klip kertas)
      ctx.strokeStyle = "#2B2A26"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(W / 2, H * 0.08); ctx.lineTo(W / 2, H * 0.92); ctx.stroke();
      ctx.strokeStyle = "#CFC5AD"; ctx.lineWidth = 3; ctx.setLineDash([6, 6]); ctx.beginPath(); ctx.moveTo(W / 2, H * 0.08); ctx.lineTo(W / 2, H * 0.92); ctx.stroke(); ctx.setLineDash([]);
      // map di tengah tali
      ctx.save(); ctx.translate(W / 2, tengahY); ctx.rotate(Math.sin(waktu * 10) * 0.05);
      ctx.fillStyle = "#E0B84A"; ctx.strokeStyle = "#2B2A26"; ctx.lineWidth = 3; ctx.fillRect(-34, -24, 68, 48); ctx.strokeRect(-34, -24, 68, 48);
      ctx.fillStyle = "#FFFDF6"; ctx.fillRect(-24, -14, 48, 6); ctx.fillRect(-24, -2, 36, 6);
      ctx.restore();
      [1, 2].forEach((p) => {
        const y = p === 1 ? H * 0.9 : H * 0.1, gy = goyang[p] > 0 ? (p === 1 ? 4 : -4) : 0;
        sprite(g.karakter[p], W / 2 + (goyang[p] > 0 ? Math.sin(waktu * 60) * 3 : 0), y + gy, 56, p);
        if (turbo[p] > 0) tulis("x2", W / 2 + 46, y, 18, WARNA[p], p);
        tulis("KETUK CEPAT!", W * 0.25, p === 1 ? H * 0.62 : H * 0.38, 13, WARNA[p], p);
      });
      if (kopi) { lingkaran(kopi.x, kopi.y, 30, "rgba(242,193,78,.35)", "#9A7224", 2); sprite("cangkir", kopi.x, kopi.y, 40, 1); }
      tulis(`${Math.max(0, Math.ceil(sisa))}`, 26, H / 2 + 18, 18, "#2B2A26", 1); tulis(`${Math.max(0, Math.ceil(sisa))}`, 26, H / 2 - 18, 18, "#2B2A26", 2);
      skorSisi(1, ketukan[1], 0, "x"); skorSisi(2, ketukan[2], 0, "x");
      gambarKilat(dt);
    });
  };

  /* ---------- 4. Kabel Kusut ---------- */
  MAIN.kabel = (g) => {
    const SEL = 9, TARGET = 2;
    const kol = Math.floor(W / SEL), bar = Math.floor(H / SEL);
    const ox = (W - kol * SEL) / 2, oy = (H - bar * SEL) / 2;
    const skor = { 1: 0, 2: 0 };
    const ARAH = [[0, -1], [1, 0], [0, 1], [-1, 0]];        // atas, kanan, bawah, kiri
    let grid, ul, waktu = 0, tik = 0, interval = 0.09, keadaan = "jeda", sisaJeda = 1.2, catatan = "", selesai = false;
    function rondeBaru() {
      grid = new Uint8Array(kol * bar);
      ul = {
        1: { x: Math.floor(kol * 0.35), y: bar - 4, a: 0, antre: [], hidup: true },
        2: { x: Math.floor(kol * 0.65), y: 3, a: 2, antre: [], hidup: true },
      };
      for (const p of [1, 2]) grid[ul[p].y * kol + ul[p].x] = p;
      interval = 0.09; keadaan = "jeda"; sisaJeda = 1.1;
    }
    const kosong = (x, y) => x >= 0 && y >= 0 && x < kol && y < bar && grid[y * kol + x] === 0;
    // belok relatif terhadap arah hadap pemain; pemain 2 melihat layar terbalik
    pendengar = {
      tekan(p, x) {
        if (keadaan !== "jalan" || !ul[p].hidup) return;
        let kiri = x < W / 2;
        if (p === 2) kiri = !kiri;
        if (ul[p].antre.length < 2) ul[p].antre.push(kiri ? -1 : 1);
        sfx("klik");
      },
    };
    function botPikir() {
      const b = ul[2], lv = g.bot.level;
      const nilai = (a) => {
        let x = b.x, y = b.y, n = 0;
        for (let i = 0; i < 14; i++) { x += ARAH[a][0]; y += ARAH[a][1]; if (!kosong(x, y)) break; n++; }
        return n + Math.random() * [6, 3, 1][lv];
      };
      const pilihan = [0, -1, 1].map((d) => ({ d, a: (b.a + d + 4) % 4 })).map((o) => ({ ...o, v: nilai(o.a) }));
      if (Math.random() < [0.07, 0.03, 0.0][lv]) return;      // kadang melamun
      pilihan.sort((m, n) => n.v - m.v);
      if (pilihan[0].d !== 0 && pilihan[0].v > pilihan.find((o) => o.d === 0).v + 0.5) b.antre = [pilihan[0].d];
    }
    function langkah() {
      if (g.bot) botPikir();
      const tujuan = {};
      for (const p of [1, 2]) {
        const u = ul[p];
        if (u.antre.length) u.a = (u.a + u.antre.shift() + 4) % 4;
        tujuan[p] = { x: u.x + ARAH[u.a][0], y: u.y + ARAH[u.a][1] };
      }
      const tabrak = { 1: !kosong(tujuan[1].x, tujuan[1].y), 2: !kosong(tujuan[2].x, tujuan[2].y) };
      if (tujuan[1].x === tujuan[2].x && tujuan[1].y === tujuan[2].y) tabrak[1] = tabrak[2] = true;
      for (const p of [1, 2]) if (!tabrak[p]) { ul[p].x = tujuan[p].x; ul[p].y = tujuan[p].y; grid[ul[p].y * kol + ul[p].x] = p; }
      if (tabrak[1] || tabrak[2]) {
        sfx("salah");
        if (tabrak[1] && tabrak[2]) { catatan = "Dua-duanya nabrak. Ronde diulang."; }
        else { const p = tabrak[1] ? 2 : 1; skor[p]++; catatan = `${g.nama[p === 1 ? 2 : 1]} kusut. Poin buat ${g.nama[p]}.`; ul[p === 1 ? 2 : 1].hidup = false; }
        keadaan = "jeda"; sisaJeda = 1.5;
        const juara = skor[1] >= TARGET ? 1 : skor[2] >= TARGET ? 2 : 0;
        if (juara) { selesai = true; keadaan = "akhir"; setTimeout(() => g.selesai(juara, `${skor[1]}–${skor[2]}`), 1300); }
        else setTimeout(() => { if (!selesai) rondeBaru(); }, 1400);
      }
    }
    rondeBaru();
    return loop((dt) => {
      waktu += dt;
      if (keadaan === "jeda" && !selesai && grid) { sisaJeda -= dt; if (sisaJeda <= 0 && ul[1].hidup && ul[2].hidup) { keadaan = "jalan"; catatan = ""; sfx("tingtong"); } }
      if (keadaan === "jalan") {
        tik += dt; interval = Math.max(0.055, interval - dt * 0.002);
        while (tik >= interval && keadaan === "jalan") { tik -= interval; langkah(); }
      }
      // gambar ruang server
      ctx.fillStyle = "#1C1F26"; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "rgba(127,152,180,.09)";
      for (let i = 0; i <= kol; i++) ctx.fillRect(ox + i * SEL, oy, 1, bar * SEL);
      for (let j = 0; j <= bar; j++) ctx.fillRect(ox, oy + j * SEL, kol * SEL, 1);
      ctx.strokeStyle = "#7F98B4"; ctx.lineWidth = 3; ctx.strokeRect(ox, oy, kol * SEL, bar * SEL);
      for (let i = 0; i < grid.length; i++) {
        if (!grid[i]) continue;
        ctx.fillStyle = WARNA[grid[i]];
        ctx.fillRect(ox + (i % kol) * SEL + 1, oy + Math.floor(i / kol) * SEL + 1, SEL - 2, SEL - 2);
      }
      for (const p of [1, 2]) {
        const u = ul[p];
        lingkaran(ox + u.x * SEL + SEL / 2, oy + u.y * SEL + SEL / 2, SEL, WARNA_MUDA[p], WARNA[p], 3);
        if (keadaan !== "jalan") sprite(g.karakter[p], ox + u.x * SEL + SEL / 2, oy + u.y * SEL + SEL / 2 + (p === 1 ? 26 : -26), 30, p);
      }
      // petunjuk kiri/kanan di sisi masing-masing
      ctx.globalAlpha = keadaan === "jalan" ? 0.18 : 0.5;
      [1, 2].forEach((p) => {
        const y = p === 1 ? H - 44 : 44;
        tulis("◀ kiri", p === 1 ? W * 0.22 : W * 0.78, y, 14, WARNA_MUDA[p], p);
        tulis("kanan ▶", p === 1 ? W * 0.78 : W * 0.22, y, 14, WARNA_MUDA[p], p);
      });
      ctx.globalAlpha = 1;
      if (keadaan !== "jalan" && catatan) { tulis(catatan, W / 2, H / 2 + 22, 13, "#FFFDF6", 1); tulis(catatan, W / 2, H / 2 - 22, 13, "#FFFDF6", 2); }
      if (keadaan === "jeda" && !catatan) { tulis("siap...", W / 2, H / 2 + 22, 16, "#FFFDF6", 1); tulis("siap...", W / 2, H / 2 - 22, 16, "#FFFDF6", 2); }
      skorSisi(1, skor[1], TARGET); skorSisi(2, skor[2], TARGET);
      gambarKilat(dt);
    });
  };

  /* =========================================================
     TURNAMEN: pengaturan, antar-ronde, podium
     ========================================================= */
  let sesi = null, berhenti = null;
  const D = () => K.data.progres.duel;

  function buka() {
    document.body.classList.add("layar-penuh");
    lapis.hidden = false;
    layarAtur();
  }
  function tutup() {
    berhenti?.(); berhenti = null; pendengar = null; jari.clear();
    lapis.hidden = true; kanvas.hidden = true;
    document.body.classList.remove("layar-penuh");
    sesi = null;
    K.segarkanIstirahat?.();
  }
  $("#duelKeluar").addEventListener("click", () => { sfx("klik"); tutup(); });
  K.bukaDuel = buka;

  /* ---------- layar pengaturan ---------- */
  function layarAtur() {
    kanvas.hidden = true; berhenti?.(); berhenti = null; pendengar = null;
    const simpanan = D().atur || {};
    const atur = {
      lawan: simpanan.lawan || "teman", level: simpanan.level ?? 1, format: simpanan.format || 3,
      nama: { 1: (simpanan.nama1 || NAMA).slice(0, 10), 2: (simpanan.nama2 || "Teman").slice(0, 10) },
      karakter: { 1: simpanan.kar1 || "kapibara", 2: simpanan.kar2 || "marmut" },
    };
    const gambar = () => {
      const bot = atur.lawan === "bot";
      panel.innerHTML = `
        <div class="duel-atur">
          <h2 class="duel-judul">Mode Duel</h2>
          <p class="muted small">Taruh HP di meja di antara kalian. Pemain 1 pegang sisi bawah, Pemain 2 sisi atas.</p>
          <div class="da-bagian">
            <p class="ap-label">Lawan</p>
            <div class="pilih-tampilan">
              <button type="button" class="chip${!bot ? " dipilih" : ""}" data-lawan="teman">Teman (2 pemain)</button>
              <button type="button" class="chip${bot ? " dipilih" : ""}" data-lawan="bot">Bot Pak Satpam</button>
            </div>
            ${bot ? `<div class="pilih-tampilan">${["Santai", "Normal", "Lembur"].map((n, i) => `<button type="button" class="chip${atur.level === i ? " dipilih" : ""}${i === 2 ? " chip-lembur" : ""}" data-level="${i}">${n}</button>`).join("")}</div>` : ""}
          </div>
          ${[2, 1].map((p) => `
            <div class="da-pemain p${p}${p === 2 && bot ? " bot" : ""}">
              <p class="ap-label"><b class="da-titik" style="background:${WARNA[p]}"></b>Pemain ${p} · sisi ${p === 1 ? "bawah" : "atas"}</p>
              ${p === 2 && bot ? `<p class="da-bot"><span class="avatar avatar-sm">${px("kura")}</span>Pak Satpam (bot, tingkat ${["Santai", "Normal", "Lembur"][atur.level]}). "Siap. Saya tidak akan mengalah. Itu prosedur."</p>` : `
              <input class="da-nama" type="text" maxlength="10" data-nama="${p}" value="${esc(atur.nama[p])}" aria-label="Nama pemain ${p}">
              <div class="da-karakter" role="radiogroup" aria-label="Karakter pemain ${p}">
                ${KARAKTER.map((k) => `<button type="button" class="da-kar${atur.karakter[p] === k ? " dipilih" : ""}" data-kar="${p}:${k}" aria-label="${k}">${px(k)}</button>`).join("")}
              </div>`}
            </div>`).join("")}
          <div class="da-bagian">
            <p class="ap-label">Format</p>
            <div class="pilih-tampilan">
              ${[3, 5].map((n) => `<button type="button" class="chip${atur.format === n ? " dipilih" : ""}" data-format="${n}">Turnamen ${n} ronde</button>`).join("")}
            </div>
            <div class="pilih-tampilan">
              ${Object.entries(DUEL_GAME).map(([id, gm]) => `<button type="button" class="chip${atur.format === id ? " dipilih" : ""}" data-format="${id}">${esc(gm.nama)} saja</button>`).join("")}
            </div>
          </div>
          ${rekorHtml(atur)}
          <div class="actions"><button class="btn primary" type="button" id="duelMulai">Mulai ${typeof atur.format === "number" ? "turnamen" : "duel"}</button></div>
        </div>`;
    };
    gambar();
    panel.onclick = (e) => {
      const t = e.target.closest("button");
      if (!t) return;
      if (t.dataset.lawan) { atur.lawan = t.dataset.lawan; sfx("pilih"); gambar(); }
      else if (t.dataset.level) { atur.level = Number(t.dataset.level); sfx("pilih"); gambar(); }
      else if (t.dataset.format) { atur.format = /^\d$/.test(t.dataset.format) ? Number(t.dataset.format) : t.dataset.format; sfx("pilih"); gambar(); }
      else if (t.dataset.kar) { const [p, k] = t.dataset.kar.split(":"); atur.karakter[p] = k; sfx("pilih"); gambar(); }
      else if (t.id === "duelMulai") {
        panel.querySelectorAll("[data-nama]").forEach((i) => { atur.nama[i.dataset.nama] = (i.value.trim() || `Pemain ${i.dataset.nama}`).slice(0, 10); });
        D().atur = { lawan: atur.lawan, level: atur.level, format: atur.format, nama1: atur.nama[1], nama2: atur.nama[2], kar1: atur.karakter[1], kar2: atur.karakter[2] };
        K.simpan();
        mulaiTurnamen(atur);
      }
    };
    panel.oninput = (e) => { const i = e.target.closest("[data-nama]"); if (i) atur.nama[i.dataset.nama] = i.value.slice(0, 10); };
  }
  const kunciRekor = (atur) => (atur.lawan === "bot" ? `${atur.nama[1]} vs Bot` : `${atur.nama[1]} vs ${atur.nama[2]}`).toLowerCase();
  function rekorHtml(atur) {
    const r = D().rekor[kunciRekor(atur)];
    if (!r) return "";
    return `<p class="da-rekor mono">Rekor ${esc(atur.nama[1])} vs ${esc(atur.lawan === "bot" ? "Pak Satpam" : atur.nama[2])}: ${r[0]}–${r[1]}</p>`;
  }

  function mulaiTurnamen(atur) {
    const bot = atur.lawan === "bot";
    let urutan;
    if (typeof atur.format === "number") {
      const semua = Object.keys(DUEL_GAME).sort(() => Math.random() - 0.5);
      urutan = Array.from({ length: atur.format }, (_, i) => semua[i % semua.length]);
    } else urutan = [atur.format];
    sesi = {
      atur, bot: bot ? { level: atur.level } : null, urutan, ronde: 0, menang: { 1: 0, 2: 0 }, hasil: [],
      nama: { 1: atur.nama[1], 2: bot ? "Pak Satpam" : atur.nama[2] },
      karakter: { 1: atur.karakter[1], 2: bot ? "kura" : atur.karakter[2] },
    };
    layarAntara();
  }

  /* ---------- layar antar-ronde: dua sisi, masing-masing tekan SIAP ---------- */
  function layarAntara() {
    kanvas.hidden = true; pendengar = null;
    const id = sesi.urutan[sesi.ronde], gm = DUEL_GAME[id];
    const siap = { 1: false, 2: !!sesi.bot };
    const separuh = (p) => `
      <div class="duel-separuh p${p}" style="--warna:${WARNA[p]}">
        <div class="ds-skor"><span>${esc(sesi.nama[1])} <b>${sesi.menang[1]}</b></span><span class="mono">ronde ${sesi.ronde + 1}/${sesi.urutan.length}</span><span><b>${sesi.menang[2]}</b> ${esc(sesi.nama[2])}</span></div>
        <p class="ds-game"><span class="avatar avatar-sm">${px(gm.ikon)}</span>${esc(gm.nama)}</p>
        <p class="ds-cara">${esc(gm.cara)}</p>
        ${p === 2 && sesi.bot ? `<p class="ds-siap-bot">Pak Satpam: "Siap."</p>` : `<button type="button" class="ds-siap" data-siap="${p}"><span class="avatar avatar-sm">${px(sesi.karakter[p])}</span>${esc(sesi.nama[p])}: SIAP</button>`}
      </div>`;
    panel.innerHTML = `<div class="duel-antara">${separuh(2)}<div class="ds-garis" aria-hidden="true">VS</div>${separuh(1)}</div>`;
    panel.onclick = (e) => {
      const b = e.target.closest("[data-siap]");
      if (!b || siap[b.dataset.siap]) return;
      siap[b.dataset.siap] = true; b.classList.add("ok"); b.textContent = "SIAP ✓"; sfx("pilih");
      if (siap[1] && siap[2]) hitungMundur(id);
    };
    panel.oninput = null;
  }
  async function hitungMundur(id) {
    panel.innerHTML = `<div class="duel-hitung"><span class="dh-angka" id="dhAngka">3</span><span class="dh-angka atas" id="dhAngka2">3</span></div>`;
    for (const t of ["3", "2", "1", "MULAI"]) {
      if (!sesi) return;
      $("#dhAngka").textContent = t; $("#dhAngka2").textContent = t;
      sfx(t === "MULAI" ? "tingtong" : "klik");
      await new Promise((r) => setTimeout(r, K.kurangiGerak ? 150 : 550));
    }
    if (!sesi) return;
    panel.innerHTML = "";
    kanvas.hidden = false; siapkanKanvas(); kilat.length = 0; jari.clear(); umurKomentar = 0;
    const g = {
      nama: sesi.nama, karakter: sesi.karakter, bot: sesi.bot,
      komentar: pasangKomentar,
      selesai(p, ringkas) { selesaiRonde(id, p, ringkas); },
    };
    berhenti = MAIN[id](g);
  }

  function selesaiRonde(id, p, ringkas) {
    if (!sesi) return;
    berhenti?.(); berhenti = null; pendengar = null;
    if (p) sesi.menang[p]++;
    sesi.hasil.push({ id, p, ringkas });
    D().ronde++;
    const poin = K.tambahPoin(3);
    const prog = K.progres ? K.progres.lapor({ jenis: "duel", game: id, pemenang: p }) : null;
    if (prog?.naikPangkat) setTimeout(() => K.progres.rayakanPangkat(prog.naikPangkat), 400);
    K.catat("duel"); K.catat(`duel:${id}`);
    void poin;
    sesi.ronde++;
    const sisa = sesi.urutan.length - sesi.ronde;
    const perlu = Math.floor(sesi.urutan.length / 2) + 1;
    const ditentukan = sesi.urutan.length > 1 && (sesi.menang[1] >= perlu || sesi.menang[2] >= perlu);
    if (sisa > 0 && !ditentukan) { layarHasilRonde(id, p, ringkas, false); return; }
    // seri di akhir turnamen: tambah ronde penentuan
    if (sesi.menang[1] === sesi.menang[2]) { sesi.urutan.push("cap"); layarHasilRonde(id, p, ringkas, true); return; }
    layarPodium();
  }
  function layarHasilRonde(id, p, ringkas, penentuan) {
    kanvas.hidden = true;
    const teks = p ? `${sesi.nama[p]} menang ronde ini (${ringkas}).` : `Seri (${ringkas}).`;
    const ejek = p ? ["Pak Singa: PERHATIAN. Ronde dicatat.", "Bu Ratna: Minum dulu ya, dua-duanya.", "Dimas: SERU BANGET— eh, maaf. Seru."][Math.floor(Math.random() * 3)] : "Oyen: Seri. Tidak ada yang dapat gula.";
    const separuh = (q) => `
      <div class="duel-separuh p${q}" style="--warna:${WARNA[q]}">
        <p class="ds-hasil${p === q ? " menang" : ""}">${p === q ? "Ronde ini milikmu." : p ? "Ronde berikutnya masih terbuka." : "Seri."}</p>
        <p class="ds-cara">${esc(teks)} ${esc(ejek)}${penentuan ? " Skor imbang, jadi ada ronde penentuan: Cap Duluan." : ""}</p>
        <div class="ds-skor"><span>${esc(sesi.nama[1])} <b>${sesi.menang[1]}</b></span><span class="mono">skor turnamen</span><span><b>${sesi.menang[2]}</b> ${esc(sesi.nama[2])}</span></div>
      </div>`;
    panel.innerHTML = `<div class="duel-antara">${separuh(2)}<div class="ds-garis" aria-hidden="true">VS</div>${separuh(1)}</div>
      <div class="ds-lanjut"><button class="btn primary" type="button" id="dsLanjut">Ronde berikutnya →</button></div>`;
    panel.onclick = (e) => { if (e.target.closest("#dsLanjut")) { sfx("pilih"); layarAntara(); } };
  }

  function layarPodium() {
    kanvas.hidden = true;
    const juara = sesi.menang[1] > sesi.menang[2] ? 1 : 2, kalah = juara === 1 ? 2 : 1;
    D().turnamen++;
    const k = kunciRekor(sesi.atur);
    const r = D().rekor[k] || [0, 0];
    r[juara - 1]++; D().rekor[k] = r;
    const bonus = K.tambahPoin(10);
    K.simpan();
    sfx("menang"); K.konfetiKertas?.(1.4);
    const KATA_JUARA = ["Juara turnamen. Namamu akan diumumkan Pak Singa besok pagi, kencang.", "Juara. Oyen mengangguk satu kali. Itu penghargaan tertinggi.", "Juara. Piala ini dari koperasi. Jangan dibalik, ada harga di bawahnya."];
    const KATA_KALAH = ["Kalah tipis. Minta rematch itu hak asasi.", "Hari ini belum. Pak Satpam juga butuh 212 kali latihan.", "Kalah, tapi gaya mainnya dicatat Bu Ratna sebagai 'berani'."];
    panel.innerHTML = `
      <div class="duel-podium">
        <p class="dp-cap mono">HASIL TURNAMEN</p>
        <div class="dp-panggung">
          <div class="dp-kursi dua"><span class="avatar">${px(sesi.karakter[kalah])}</span><b>${esc(sesi.nama[kalah])}</b><span class="dp-tiang">2</span></div>
          <div class="dp-kursi satu" style="--warna:${WARNA[juara]}"><span class="dp-piala">${px("berkas")}</span><span class="avatar">${px(sesi.karakter[juara])}</span><b>${esc(sesi.nama[juara])}</b><span class="dp-tiang">1</span></div>
        </div>
        <p class="dp-skor mono">${sesi.menang[1]} – ${sesi.menang[2]}</p>
        <p>${esc(sesi.nama[juara])}: ${esc(KATA_JUARA[Math.floor(Math.random() * KATA_JUARA.length)])}</p>
        <p class="muted">${esc(sesi.nama[kalah])}: ${esc(KATA_KALAH[Math.floor(Math.random() * KATA_KALAH.length)])}</p>
        <ol class="dp-ronde">${sesi.hasil.map((h) => `<li><span>${esc(DUEL_GAME[h.id].nama)}</span><span class="mono">${h.p ? esc(sesi.nama[h.p]) : "seri"} · ${esc(h.ringkas)}</span></li>`).join("")}</ol>
        <p class="da-rekor mono">Rekor ${esc(sesi.nama[1])} vs ${esc(sesi.nama[2])}: ${r[0]}–${r[1]} · +${bonus + sesi.hasil.length * 3} Poin Sabar</p>
        <div class="actions">
          <button class="btn primary" type="button" id="dpRematch">Rematch</button>
          <button class="btn" type="button" id="dpAtur">Ganti pengaturan</button>
          <button class="btn ghost" type="button" id="dpKeluar">Keluar</button>
        </div>
      </div>`;
    panel.onclick = (e) => {
      if (e.target.closest("#dpRematch")) { sfx("pilih"); mulaiTurnamen(sesi.atur); }
      else if (e.target.closest("#dpAtur")) { sfx("pilih"); layarAtur(); }
      else if (e.target.closest("#dpKeluar")) tutup();
    };
  }
})();
