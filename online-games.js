/* =========================================================
   Kantor Layanan Perasaan · Game ringan versi berdua online
   Rally Online, Stempel Rebutan, Rebutan Kertas, Ngemil Berdua.
   Tuan rumah (pemain 1) menjalankan permainan dan mengirim
   keadaan ±15x per detik; tamu (pemain 2) mengirim gerakan.
   Grand Prix, Legenda Lantai 2, dan Kantor Royale punya mode
   berdua di berkasnya masing-masing.
   ========================================================= */
(() => {
  "use strict";
  const K = window.KLP;
  const { esc, px, sfx } = K;
  const acak = (a, b) => a + Math.random() * (b - a);
  const pilih = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const batas = (v, a, b) => Math.max(a, Math.min(b, v));
  const BIRU = "#3E78C4", ORANYE = "#E58B3A";
  const W = () => K.WOW;

  /* ---------- perkakas bersama ---------- */
  function sambung(api) {
    const o = api.online, host = o.host, aku = host ? 1 : 2, kamu = host ? 2 : 1;
    const nama = { [aku]: o.saya?.nama || "Kamu", [kamu]: o.teman?.nama || "Teman" };
    const sprite = { [aku]: o.saya?.sprite || "kapibara", [kamu]: o.teman?.sprite || "marmut" };
    let jedaKirim = 0, snap = null, umurSnap = 0, jedaMasuk = 0;
    const masukan = {};
    const peristiwa = [];
    if (host) { o.on("in", (m) => Object.assign(masukan, m)); o.on("ev", (m) => peristiwa.push(m)); }
    else { o.on("snap", (m) => { snap = m.s; umurSnap = 0; }); }
    return {
      host, aku, kamu, nama, sprite, masukan,
      get snap() { return snap; }, get umurSnap() { return umurSnap; },
      // tuan rumah: kirim keadaan beberapa kali per detik
      kirimSnap(dt, buat, hz = 15) { jedaKirim -= dt; if (jedaKirim <= 0) { jedaKirim = 1 / hz; o.kirim({ t: "snap", s: buat() }); } },
      tickTamu(dt) { umurSnap += dt; },
      // tamu: kirim masukan berkala
      kirimMasukan(dt, m, hz = 20) { jedaMasuk -= dt; if (jedaMasuk <= 0) { jedaMasuk = 1 / hz; o.kirim({ t: "in", ...m }); } },
      ev(m) { o.kirim({ t: "ev", ...m }); },
      ambilPeristiwa() { return peristiwa.splice(0); },
      onAkhir(fn) { o.on("akhir", fn); },
      akhir(m) { o.kirim({ t: "akhir", ...m }); },
    };
  }
  function teks(ctx, t, x, y, uk, warna = "#FFFDF6", rata = "center") {
    ctx.font = `${uk}px "Pixelify Sans", monospace`; ctx.textAlign = rata; ctx.textBaseline = "middle";
    ctx.lineWidth = Math.max(2, uk / 5); ctx.strokeStyle = "#2B2A26"; ctx.strokeText(t, x, y);
    ctx.fillStyle = warna; ctx.fillText(t, x, y);
  }
  // papan skor dua pemain di atas kanvas
  function papanSkor(ctx, Wd, j, skor, label = "") {
    ctx.fillStyle = "rgba(20,20,24,.75)"; ctx.fillRect(Wd / 2 - 120, 6, 240, 30);
    teks(ctx, `${j.nama[j.aku].slice(0, 8)} ${skor[j.aku]}`, Wd / 2 - 12, 21, 14, "#7FB2E0", "right");
    teks(ctx, "·", Wd / 2, 21, 14);
    teks(ctx, `${skor[j.kamu]} ${j.nama[j.kamu].slice(0, 8)}`, Wd / 2 + 12, 21, 14, "#F2A86B", "left");
    if (label) teks(ctx, label, Wd / 2, 46, 10, "#FFFDF6");
  }
  function hasilAkhir(api, j, skor, satuan, kali = 10) {
    const saya = skor[j.aku], dia = skor[j.kamu];
    const menang = saya > dia, seri = saya === dia;
    const nilai = saya * kali + (menang ? 80 : seri ? 40 : 15);
    const judul = menang ? `MENANG ${saya}–${dia}` : seri ? `SERI ${saya}–${dia}` : `KALAH ${saya}–${dia}`;
    const kata = menang ? ["badak", `Menang lawan ${j.nama[j.kamu]}. Kak Badak: Saya izinkan pamer, maksimal lima menit.`] : seri ? ["kapibara", `Seri sama ${j.nama[j.kamu]}. Bu Ratna: Adil ya. Tehnya dibagi dua.`] : ["kapibara", `${j.nama[j.kamu]} menang kali ini. Bu Ratna: Minta rematch itu sah. Tekan Kembali ke lobi.`];
    api.selesai(nilai, [kata[0], `${saya} ${satuan}. ${kata[1]}`], { menang, judul });
  }

  /* =========================================================
     1. RALLY ONLINE
     ========================================================= */
  function rally(api) {
    const { ctx } = api, j = sambung(api);
    const TARGET = 7;
    let skor = { 1: 0, 2: 0 }, kok = { ke: 1, t: 0, dur: 1.4, targetX: 180 }, jeda = 1.2, ayun = { 1: 0, 2: 0 }, selesai = false, efek = [];
    const lokal = { ...kok };
    let prediksi = 0;
    const d3 = api.buat3D({ lawan: j.sprite[j.kamu] });
    api.info(`Rally lawan ${j.nama[j.kamu]}. Ketuk layar saat kok masuk lingkaranmu. Duluan ${TARGET} poin menang.`);
    const zonaY = () => api.H() * 0.78;

    function pukulan(siapa, nilai) {
      ayun[siapa] = 0.25;
      kok = { ke: siapa === 1 ? 2 : 1, t: 0, dur: Math.max(0.55, kok.dur * 0.965), targetX: acak(80, 280) };
      api.online.kirim({ t: "fx", k: "pukul", siapa, nilai });
      fxPukul(siapa, nilai);
    }
    function fxPukul(siapa, nilai) {
      sfx("pukul");
      if (siapa === j.aku) {
        const p = W()?.dariKanvas(ctx.canvas, kok.targetX || 180, zonaY());
        if (p) W().ledak(p.x, p.y, nilai === 2 ? ["#F2C14E", "#FFFDF6"] : [BIRU, "#FFFDF6"], nilai === 2 ? 26 : 12);
        W()?.hp(nilai === 2 ? 40 : 20);
        efek.push({ t: nilai === 2 ? "SEMPURNA!" : "BAGUS", w: nilai === 2 ? "#F2C14E" : "#7FB2E0", umur: 0 });
      }
    }
    function poin(siapa) {
      skor[siapa]++;
      api.online.kirim({ t: "fx", k: "poin", siapa });
      fxPoin(siapa);
      if (skor[siapa] >= TARGET) { selesai = true; api.online.kirim({ t: "snap", s: buatSnap() }); setTimeout(() => { j.akhir({ skor }); hasilAkhir(api, j, skor, "poin"); }, 900); return; }
      kok = { ke: siapa === 1 ? 2 : 1, t: 0, dur: 1.35, targetX: acak(90, 270) }; jeda = 1.0;
    }
    function fxPoin(siapa) {
      if (siapa === j.aku) { sfx("menang"); W()?.teks("POIN!", "#7FD18B"); }
      else { sfx("salah"); W()?.getar(1.2, 0.3); W()?.hp(80); W()?.kilat("rgba(224,90,78,.35)"); }
    }
    const buatSnap = () => ({ skor, kok, jeda, ayun });
    if (!j.host) {
      api.online.on("fx", (m) => { if (m.k === "pukul" && m.siapa !== j.aku) { ayun[m.siapa] = 0.25; sfx("pukul"); } if (m.k === "poin") fxPoin(m.siapa); });
      j.onAkhir((m) => { selesai = true; skor = m.skor; setTimeout(() => hasilAkhir(api, j, skor, "poin"), 600); });
    }
    const ketuk = (e) => {
      e.preventDefault();
      if (selesai) return;
      const st = j.host ? kok : lokal;
      if (st.ke !== j.aku || jeda > 0) { sfx("klik"); return; }
      const selisih = Math.abs(1 - st.t) * st.dur;
      if (st.t < 0.55 || selisih > 0.16) { efek.push({ t: "kecepetan", w: "#CFC5AD", umur: 0 }); sfx("klik"); return; }
      const nilai = selisih < 0.06 ? 2 : 1;
      if (j.host) pukulan(1, nilai);
      else { j.ev({ a: "pukul", nilai }); ayun[2] = 0.25; Object.assign(lokal, { ke: 1, t: 0 }); prediksi = 0.7; fxPukul(2, nilai); }
    };
    ctx.canvas.addEventListener("pointerdown", ketuk);
    const stop = api.loop((dt, w) => {
      if (j.host) {
        for (const ev of j.ambilPeristiwa()) if (ev.a === "pukul" && kok.ke === 2 && kok.t > 0.45 && !selesai) pukulan(2, ev.nilai);
        if (!selesai) {
          if (jeda > 0) jeda -= dt;
          else {
            kok.t += dt / kok.dur;
            const tenggang = kok.ke === 2 ? 0.28 + (K.NET.ping || 0) / 1000 : 0.16;
            if (kok.t > 1 + tenggang / kok.dur) poin(kok.ke === 1 ? 2 : 1);
          }
        }
        j.kirimSnap(dt, buatSnap);
      } else {
        j.tickTamu(dt);
        const s = j.snap;
        if (s) {
          skor = s.skor; jeda = s.jeda; ayun[1] = Math.max(ayun[1], s.ayun[1]);
          if (prediksi > 0 && s.kok.ke === 2) { prediksi -= dt; lokal.t += dt / lokal.dur; }   // pukulan sendiri belum dikonfirmasi
          else { prediksi = 0; lokal.ke = s.kok.ke; lokal.dur = s.kok.dur; lokal.targetX = s.kok.targetX; lokal.t = s.kok.t + (jeda > 0 ? 0 : j.umurSnap / s.kok.dur); }
        }
      }
      for (const p of [1, 2]) if (ayun[p] > 0) ayun[p] -= dt;
      // tampilan dari sisi masing-masing: kok yang datang ke kita = "datang"
      const st = j.host ? kok : lokal;
      const fase = st.ke === j.aku ? (st.t > 1 ? "lewat" : "datang") : "balik";
      const t = jeda > 0 ? 0 : fase === "lewat" ? st.t - 1 : Math.min(1, st.t);
      const targetX = st.targetX;
      const Wd = api.W(), Hd = api.H();
      if (d3) { ctx.clearRect(0, 0, Wd, Hd); d3.gambar({ fase: jeda > 0 && st.ke !== j.aku ? "balik" : fase, t, targetX, ayun: ayun[j.aku] }, w); }
      else gambar2D(Wd, Hd, fase, t, targetX);
      papanSkor(ctx, Wd, j, skor, `duluan ${TARGET} poin`);
      if (jeda > 0 && !selesai) teks(ctx, st.ke === j.aku ? "Kok datang ke kamu..." : `${j.nama[j.kamu]} siap menerima...`, Wd / 2, Hd * 0.5, 14);
      for (let i = efek.length - 1; i >= 0; i--) { const e = efek[i]; e.umur += dt; if (e.umur > 0.9) { efek.splice(i, 1); continue; } ctx.globalAlpha = 1 - e.umur / 0.9; teks(ctx, e.t, targetX, zonaY() - 50 - e.umur * 30, 18, e.w); ctx.globalAlpha = 1; }
    });
    function gambar2D(Wd, Hd, fase, t, targetX) {
      ctx.fillStyle = "#7FA868"; ctx.fillRect(0, 0, Wd, Hd);
      ctx.strokeStyle = "#FFFDF6"; ctx.lineWidth = 3; ctx.strokeRect(20, 20, Wd - 40, Hd - 40);
      ctx.fillStyle = "#2B2A26"; ctx.fillRect(10, Hd * 0.45 - 4, Wd - 20, 8);
      api.alat.gambarSprite(ctx, j.sprite[j.kamu], Wd / 2, Hd * 0.13, 56);
      ctx.strokeStyle = fase === "datang" && t > 0.6 ? "#F2C14E" : "rgba(255,253,246,.8)"; ctx.lineWidth = 4; ctx.setLineDash([6, 6]);
      ctx.beginPath(); ctx.arc(targetX, zonaY(), 34, 0, 7); ctx.stroke(); ctx.setLineDash([]);
      const y0 = Hd * 0.13, y1 = zonaY();
      let x, y;
      if (fase === "balik") { x = targetX + (Wd / 2 - targetX) * t; y = y1 + (y0 - y1) * t - Math.sin(t * Math.PI) * 36; }
      else if (fase === "lewat") { x = targetX; y = y1 + t * 120; }
      else { x = Wd / 2 + (targetX - Wd / 2) * t; y = y0 + (y1 - y0) * t - Math.sin(t * Math.PI) * 26; }
      ctx.fillStyle = "#FFFDF6"; ctx.beginPath(); ctx.moveTo(x, y + 6); ctx.lineTo(x - 9, y - 10); ctx.lineTo(x + 9, y - 10); ctx.closePath(); ctx.fill(); ctx.strokeStyle = "#2B2A26"; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = "#B5443A"; ctx.beginPath(); ctx.arc(x, y + 7, 4.5, 0, 7); ctx.fill();
    }
    return () => { stop(); ctx.canvas.removeEventListener("pointerdown", ketuk); };
  }

  /* =========================================================
     2. STEMPEL REBUTAN
     ========================================================= */
  const BERKAS = {
    setuju: ["Izin rebahan 15 menit", "Makan siang tepat waktu", "Cuti karena hujan enak buat tidur", "Tidur lebih awal", "Izin tidak membuka grup chat", "Tambahan teh manis"],
    tolak: ["Lembur hari Minggu", "Rapat jam 4 sore hari Jumat", "Rapat yang bisa jadi email", "Revisi ke-17 (final_final_banget)", "Begadang demi tugas yang belum dibuka"],
    nanti: ["Balas chat grup 300 pesan", "Beres-beres lemari", "Memikirkan masa depan 10 tahun lagi", "Belajar bahasa baru mulai Senin"],
  };
  const NAMA_CAP = { setuju: "DISETUJUI", tolak: "DITOLAK", nanti: "NANTI AJA" };
  function stempel(api) {
    const j = sambung(api);
    const DURASI = 45;
    let sisa = DURASI, kartu = [], idBaru = 0, jedaSpawn = 0.4, skor = { 1: 0, 2: 0 }, combo = { 1: 0, 2: 0 }, selesai = false;
    api.dom.innerHTML = `<div class="stempel-jalur" id="stJalur"><div class="stempel-garis-bawah">batas meja</div></div>`;
    const jalur = api.dom.querySelector("#stJalur");
    api.kontrol.innerHTML = ["setuju", "tolak", "nanti"].map((c) => `<button class="cap-btn ${c}" type="button" data-cap="${c}">${NAMA_CAP[c]}</button>`).join("");
    api.info(`Stempel rebutan lawan ${j.nama[j.kamu]}. Berkas yang sama untuk berdua: cap yang benar paling cepat. Jangan cap Oyen.`);
    const el = new Map();
    function terapkan(siapa, id, pilihan) {
      const k = kartu.find((c) => c.id === id && !c.oleh);
      if (!k) return;
      k.oleh = siapa; k.cap = pilihan;
      if (k.jenis === "oyen") { skor[siapa] -= 3; combo[siapa] = 0; k.benar = false; }
      else if (k.jenis === pilihan) { skor[siapa] += 2; combo[siapa]++; k.benar = true; if (combo[siapa] % 5 === 0) skor[siapa] += 3; }
      else { skor[siapa] -= 1; combo[siapa] = 0; k.benar = false; }
      api.online.kirim({ t: "fx", k: "cap", siapa, benar: k.benar, combo: combo[siapa] });
      fx(siapa, k.benar, combo[siapa]);
    }
    function fx(siapa, benar, c) {
      sfx("stempel");
      if (siapa === j.aku) {
        if (benar) { W()?.hp(20); if (c && c % 5 === 0) { W()?.teks(`COMBO x${c}!`, "#F2C14E", "+3 bonus"); sfx("poin"); const r = jalur.getBoundingClientRect(); W()?.ledak(r.left + r.width / 2, r.top + r.height * 0.7, ["#F2C14E", BIRU, "#FFFDF6"], 24); } }
        else { W()?.getar(0.8, 0.2); W()?.hp(60); }
      }
    }
    function capSaya(pilihan) {
      if (selesai) return;
      const bawah = kartu.filter((c) => !c.oleh).sort((a, b) => b.y - a.y)[0];
      if (!bawah) { sfx("klik"); return; }
      if (j.host) terapkan(1, bawah.id, pilihan);
      else { j.ev({ a: "cap", id: bawah.id, pilihan }); bawah.oleh = 2; bawah.cap = pilihan; bawah.tunggu = true; sfx("stempel"); }
    }
    const klik = (e) => { const b = e.target.closest("[data-cap]"); if (b) capSaya(b.dataset.cap); };
    api.kontrol.addEventListener("click", klik);
    if (!j.host) {
      api.online.on("fx", (m) => { if (m.k === "cap") fx(m.siapa, m.benar, m.combo); });
      j.onAkhir((m) => { selesai = true; skor = m.skor; setTimeout(() => hasilAkhir(api, j, skor, "poin", 5), 500); });
    }
    function gambarKartu() {
      const ada = new Set();
      for (const k of kartu) {
        ada.add(k.id);
        let e = el.get(k.id);
        if (!e) {
          e = document.createElement("div");
          e.className = `st-kartu${k.jenis === "oyen" ? " st-oyen" : ""}`;
          e.innerHTML = k.jenis === "oyen" ? `<span class="st-sprite">${px("oyen")}</span><span>(Oyen tidur di atas berkas ini)</span>` : `<span class="st-no mono">No. ${String(k.id).padStart(3, "0")}</span><span>${esc(k.teks)}</span>`;
          e.style.left = `${k.kiri}%`;
          jalur.appendChild(e); el.set(k.id, e);
        }
        e.style.top = `${Math.min(1.05, k.y) * 82}%`;
        if (k.oleh && !e.dataset.dicap) {
          e.dataset.dicap = "1";
          const c = document.createElement("b");
          c.className = `st-cap ${k.cap}`; c.textContent = NAMA_CAP[k.cap];
          c.style.color = k.oleh === j.aku ? BIRU : ORANYE; c.style.borderColor = k.oleh === j.aku ? BIRU : ORANYE;
          e.appendChild(c);
          const tanda = document.createElement("small"); tanda.className = "st-oleh"; tanda.textContent = k.oleh === j.aku ? "kamu" : j.nama[j.kamu];
          tanda.style.background = k.oleh === j.aku ? BIRU : ORANYE; e.appendChild(tanda);
        }
        if (k.benar === false) e.classList.add("keliru");
      }
      for (const [id, e] of el) if (!ada.has(id)) { e.classList.add("pergi"); setTimeout(() => e.remove(), 400); el.delete(id); }
    }
    const stop = api.loop((dt) => {
      if (j.host) {
        for (const ev of j.ambilPeristiwa()) if (ev.a === "cap") terapkan(2, ev.id, ev.pilihan);
        if (!selesai) {
          sisa -= dt;
          jedaSpawn -= dt;
          if (jedaSpawn <= 0) {
            const oyen = Math.random() < 0.12, jenis = oyen ? "oyen" : pilih(["setuju", "tolak", "nanti"]);
            kartu.push({ id: ++idBaru, jenis, teks: oyen ? "" : pilih(BERKAS[jenis]), y: 0, v: 1 / batas(5 - (DURASI - sisa) * 0.06, 2.4, 5), kiri: acak(4, 30), oleh: 0 });
            jedaSpawn = batas(1.6 - (DURASI - sisa) * 0.02, 0.7, 1.6);
          }
          for (const k of kartu) if (!k.oleh) k.y += k.v * dt;
          kartu = kartu.filter((k) => (k.oleh ? (k.umurCap = (k.umurCap || 0) + dt) < 0.6 : k.y < 1.05));
          if (sisa <= 0) { selesai = true; api.online.kirim({ t: "snap", s: { kartu: [], skor, sisa: 0 } }); j.akhir({ skor }); setTimeout(() => hasilAkhir(api, j, skor, "poin", 5), 500); }
        }
        j.kirimSnap(dt, () => ({ kartu: kartu.map((k) => ({ id: k.id, jenis: k.jenis, teks: k.teks, y: +k.y.toFixed(3), v: k.v, kiri: k.kiri, oleh: k.oleh, cap: k.cap, benar: k.benar })), skor, sisa }));
      } else {
        j.tickTamu(dt);
        const s = j.snap;
        if (s) {
          skor = s.skor; sisa = s.sisa;
          const lokal = new Map(kartu.map((k) => [k.id, k]));
          kartu = s.kartu.map((k) => { const l = lokal.get(k.id); const y = k.oleh ? k.y : k.y + k.v * j.umurSnap; if (l && l.tunggu && !k.oleh) return { ...k, oleh: 2, cap: l.cap, tunggu: true, y }; return { ...k, y }; });
        }
      }
      gambarKartu();
      api.skor(skor[j.aku]);
      document.getElementById("hudWaktu").textContent = `${Math.max(0, Math.ceil(sisa))} dtk · ${j.nama[j.kamu].slice(0, 6)} ${skor[j.kamu]}`;
    });
    return () => { stop(); api.kontrol.removeEventListener("click", klik); };
  }

  /* =========================================================
     3. REBUTAN KERTAS
     ========================================================= */
  function kertas(api) {
    const { ctx } = api, j = sambung(api);
    const DURASI = 45;
    let sisa = DURASI, skor = { 1: 0, 2: 0 }, waktu = 0, idBaru = 0, jeda = 0.4, selesai = false;
    const map = { 1: { x: 120, tx: 120, getar: 0 }, 2: { x: 240, tx: 240, getar: 0 } };
    let kertas = [];
    const efek = [];
    const mapY = () => api.H() - 70;
    const d3 = api.buat3D({});
    api.info(`Rebutan kertas lawan ${j.nama[j.kamu]}. Map biru punyamu, oranye punya teman. Hindari undangan rapat jam 4 sore.`);
    const gerak = (e) => { const r = ctx.canvas.getBoundingClientRect(); const x = batas((e.clientX - r.left) / (r.width / 360), 40, 320); map[j.aku].tx = x; };
    ctx.canvas.addEventListener("pointerdown", gerak); ctx.canvas.addEventListener("pointermove", gerak);
    function tangkap(siapa, k) {
      if (k.jenis === "rapat") { skor[siapa] -= 2; map[siapa].getar = 0.3; }
      else if (k.jenis === "emas") skor[siapa] += 3; else skor[siapa] += 1;
      api.online.kirim({ t: "fx", k: "tangkap", siapa, jenis: k.jenis, x: k.x, y: k.y });
      fx(siapa, k.jenis, k.x, k.y);
    }
    function fx(siapa, jenis, x, y) {
      const saya = siapa === j.aku;
      efek.push({ t: jenis === "rapat" ? "-2 rapat" : jenis === "emas" ? "+3" : "+1", x, y, w: jenis === "rapat" ? "#E05A4E" : saya ? "#7FB2E0" : "#F2A86B", umur: 0 });
      if (saya) {
        sfx(jenis === "rapat" ? "salah" : jenis === "emas" ? "poin" : "kertas");
        if (jenis === "emas") { const p = W()?.dariKanvas(ctx.canvas, x, y); if (p) W().ledak(p.x, p.y, ["#F2C14E", "#FFFDF6"], 22); W()?.hp(30); }
        if (jenis === "rapat") { W()?.getar(1, 0.25); W()?.hp(70); }
      }
    }
    if (!j.host) {
      api.online.on("fx", (m) => { if (m.k === "tangkap") fx(m.siapa, m.jenis, m.x, m.y); });
      j.onAkhir((m) => { selesai = true; skor = m.skor; setTimeout(() => hasilAkhir(api, j, skor, "berkas", 6), 500); });
    }
    const objTamu = new Map();
    const stop = api.loop((dt) => {
      waktu += dt;
      const Wd = api.W(), Hd = api.H();
      let sudut = Math.sin(waktu * 0.9) * 0.75;
      if (j.host) {
        if (j.masukan.x != null) map[2].tx = j.masukan.x;
        if (!selesai) {
          sisa -= dt;
          const angin = Math.sin(sudut) * 95;
          jeda -= dt;
          if (jeda <= 0) {
            const r = Math.random();
            kertas.push({ id: ++idBaru, x: Wd / 2 + acak(-30, 30), y: 70, vx: acak(-20, 20), vy: acak(26, 40), rot: acak(0, 6), vr: acak(-3, 3), jenis: r < 0.07 ? "emas" : r < 0.27 ? "rapat" : "baik", fase: acak(0, 6) });
            jeda = batas(0.6 - (DURASI - sisa) * 0.006, 0.32, 0.6);
          }
          for (let i = kertas.length - 1; i >= 0; i--) {
            const k = kertas[i];
            k.vx += (angin - k.vx) * dt * 0.9; k.x += (k.vx + Math.sin(waktu * 3 + k.fase) * 30) * dt;
            k.vy = Math.min(k.vy + 8 * dt, 95); k.y += k.vy * dt; k.rot += k.vr * dt;
            if (k.x < 10 || k.x > Wd - 10) { k.vx *= -0.6; k.x = batas(k.x, 10, Wd - 10); }
            let kena = 0;
            for (const p of [1, 2]) if (k.y > mapY() - 12 && k.y < mapY() + 14 && Math.abs(k.x - map[p].x) < 40) { kena = p; break; }
            if (kena) { kertas.splice(i, 1); tangkap(kena, k); }
            else if (k.y > Hd + 20) kertas.splice(i, 1);
          }
          if (sisa <= 0) { selesai = true; j.akhir({ skor }); setTimeout(() => hasilAkhir(api, j, skor, "berkas", 6), 500); }
        }
        j.kirimSnap(dt, () => ({ kertas: kertas.map((k) => ({ id: k.id, x: Math.round(k.x), y: Math.round(k.y), vx: Math.round(k.vx), vy: Math.round(k.vy), rot: +k.rot.toFixed(2), jenis: k.jenis, fase: +k.fase.toFixed(2) })), map: { 1: Math.round(map[1].x), 2: Math.round(map[2].x) }, skor, sisa, waktu }));
      } else {
        j.tickTamu(dt);
        j.kirimMasukan(dt, { x: Math.round(map[2].tx) });
        const s = j.snap;
        if (s) {
          skor = s.skor; sisa = s.sisa; waktu = s.waktu + j.umurSnap; sudut = Math.sin(waktu * 0.9) * 0.75;
          map[1].x += (s.map[1] - map[1].x) * Math.min(1, dt * 12);
          kertas = s.kertas.map((k) => { let o = objTamu.get(k.id); if (!o) { o = {}; objTamu.set(k.id, o); } Object.assign(o, k); o.x = k.x + k.vx * j.umurSnap; o.y = k.y + k.vy * j.umurSnap; return o; });
          const ada = new Set(s.kertas.map((k) => k.id)); for (const id of objTamu.keys()) if (!ada.has(id)) objTamu.delete(id);
        }
      }
      map[j.aku].x += (map[j.aku].tx - map[j.aku].x) * Math.min(1, dt * 14);
      if (j.host) map[2].x += (map[2].tx - map[2].x) * Math.min(1, dt * 14);
      for (const p of [1, 2]) if (map[p].getar > 0) map[p].getar -= dt;
      if (d3) { ctx.clearRect(0, 0, Wd, Hd); d3.gambar({ sudut, mapX: map[j.aku].x, mapX2: map[j.kamu].x, mapY: mapY(), getar: map[j.aku].getar, kertas }, waktu); }
      else gambar2D(Wd, Hd, sudut);
      papanSkor(ctx, Wd, j, skor, `${Math.max(0, Math.ceil(sisa))} detik`);
      for (let i = efek.length - 1; i >= 0; i--) { const e = efek[i]; e.umur += dt; if (e.umur > 0.9) { efek.splice(i, 1); continue; } ctx.globalAlpha = 1 - e.umur / 0.9; teks(ctx, e.t, e.x, e.y - 20 - e.umur * 30, 15, e.w); ctx.globalAlpha = 1; }
    });
    function gambar2D(Wd, Hd, sudut) {
      ctx.fillStyle = "#F0EADB"; ctx.fillRect(0, 0, Wd, Hd);
      ctx.save(); ctx.translate(Wd / 2, 46); ctx.rotate(sudut); ctx.fillStyle = "#FFFDF6"; ctx.strokeStyle = "#2B2A26"; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(0, 0, 30, 16, 0, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore();
      for (const k of kertas) {
        ctx.save(); ctx.translate(k.x, k.y); ctx.rotate(Math.sin(k.rot) * 0.6);
        ctx.fillStyle = k.jenis === "emas" ? "#F2D28A" : "#FFFDF6"; ctx.strokeStyle = "#2B2A26"; ctx.lineWidth = 2; ctx.fillRect(-11, -14, 22, 28); ctx.strokeRect(-11, -14, 22, 28);
        if (k.jenis === "rapat") { ctx.fillStyle = "#B5443A"; ctx.fillRect(-11, -14, 22, 5); }
        ctx.restore();
      }
      for (const p of [j.kamu, j.aku]) {
        ctx.save(); ctx.translate(map[p].x, mapY());
        ctx.fillStyle = p === j.aku ? BIRU : ORANYE; ctx.strokeStyle = "#2B2A26"; ctx.lineWidth = 3; ctx.fillRect(-40, -8, 80, 30); ctx.strokeRect(-40, -8, 80, 30);
        teks(ctx, p === j.aku ? "kamu" : j.nama[j.kamu].slice(0, 8), 0, 7, 10);
        ctx.restore();
      }
    }
    return () => { stop(); ctx.canvas.removeEventListener("pointerdown", gerak); ctx.canvas.removeEventListener("pointermove", gerak); };
  }

  /* =========================================================
     4. NGEMIL BERDUA
     ========================================================= */
  function ngemil(api) {
    const { ctx } = api, j = sambung(api);
    const DURASI = 45;
    let sisa = DURASI, keadaan = "presentasi", sisaKeadaan = acak(1.8, 3), waktu = 0, selesai = false, kedip = 0;
    const pm = { 1: { skor: 0, nyawa: 3, tahan: false, lepasDulu: false, gigit: 0, potongan: 0, menoleh: 0 }, 2: { skor: 0, nyawa: 3, tahan: false, lepasDulu: false, gigit: 0, potongan: 0, menoleh: 0 } };
    const d3 = api.buat3D({ teman: j.sprite[j.kamu] });
    api.info(`Ngemil bareng ${j.nama[j.kamu]}. Tahan layar untuk ngemil, lepas saat Oyen menoleh. Ketahuan 3 kali, gorenganmu disita.`);
    const tekan = (e) => { e.preventDefault(); pm[j.aku].tahan = true; if (!j.host) j.ev({ a: "tahan", v: true }); };
    const lepas = () => { pm[j.aku].tahan = false; pm[j.aku].lepasDulu = false; if (!j.host) j.ev({ a: "tahan", v: false }); };
    const c = ctx.canvas;
    c.addEventListener("pointerdown", tekan); c.addEventListener("pointerup", lepas); c.addEventListener("pointerleave", lepas); c.addEventListener("pointercancel", lepas);
    function fx(siapa, jenis) {
      if (siapa !== j.aku) return;
      if (jenis === "ketahuan") { sfx("meong"); kedip = 0.5; W()?.getar(1.4, 0.35); W()?.hp(120); W()?.teks("KETAHUAN!", "#E05A4E", "Oyen: ...Diketahui."); }
      else if (jenis === "nyam") { sfx("kertas"); W()?.hp(10); }
    }
    if (!j.host) {
      api.online.on("fx", (m) => { if (m.k === "ngemil") fx(m.siapa, m.jenis); });
      j.onAkhir((m) => { selesai = true; const skor = { 1: m.skor[1], 2: m.skor[2] }; setTimeout(() => hasilAkhir(api, j, skor, "gorengan", 3), 500); });
    }
    const stop = api.loop((dt) => {
      waktu += dt;
      if (j.host) {
        for (const ev of j.ambilPeristiwa()) if (ev.a === "tahan") { pm[2].tahan = ev.v; if (!ev.v) pm[2].lepasDulu = false; }
        if (!selesai) {
          sisa -= dt; sisaKeadaan -= dt;
          if (sisaKeadaan <= 0) {
            if (keadaan === "presentasi") { keadaan = "curiga"; sisaKeadaan = acak(0.45, 0.75); }
            else if (keadaan === "curiga") { keadaan = "menoleh"; sisaKeadaan = acak(1.0, 1.8); pm[1].menoleh = pm[2].menoleh = 0; }
            else { keadaan = "presentasi"; sisaKeadaan = acak(1.3, 3.2); }
          }
          for (const p of [1, 2]) {
            const s = pm[p];
            if (s.nyawa <= 0) continue;
            if (keadaan === "menoleh") s.menoleh += dt;
            const tenggang = p === 2 ? 0.18 + (K.NET.ping || 0) / 2000 : 0.08;
            if (s.tahan && !s.lepasDulu) {
              if (keadaan === "menoleh" && s.menoleh > tenggang) { s.nyawa--; s.lepasDulu = true; api.online.kirim({ t: "fx", k: "ngemil", siapa: p, jenis: "ketahuan" }); fx(p, "ketahuan"); }
              else if (keadaan !== "menoleh") { s.gigit += dt; if (s.gigit >= 0.3) { s.gigit = 0; s.skor++; s.potongan = (s.potongan + 1) % 3; api.online.kirim({ t: "fx", k: "ngemil", siapa: p, jenis: "nyam" }); fx(p, "nyam"); } }
            } else s.gigit = 0;
          }
          if (sisa <= 0 || (pm[1].nyawa <= 0 && pm[2].nyawa <= 0)) { selesai = true; const skor = { 1: pm[1].skor, 2: pm[2].skor }; j.akhir({ skor }); setTimeout(() => hasilAkhir(api, j, skor, "gorengan", 3), 500); }
        }
        j.kirimSnap(dt, () => ({ keadaan, sisa, pm: { 1: { ...pm[1] }, 2: { ...pm[2] } } }));
      } else {
        j.tickTamu(dt);
        const s = j.snap;
        if (s) { keadaan = s.keadaan; sisa = s.sisa; for (const p of [1, 2]) { const tahan = pm[p].tahan; Object.assign(pm[p], s.pm[p]); if (p === j.aku) pm[p].tahan = tahan; } }
      }
      if (kedip > 0) kedip -= dt;
      const saya = pm[j.aku], dia = pm[j.kamu];
      const Wd = api.W(), Hd = api.H();
      const makan = saya.tahan && !saya.lepasDulu && keadaan !== "menoleh" && saya.nyawa > 0;
      if (d3) { ctx.clearRect(0, 0, Wd, Hd); d3.gambar({ keadaan, makan, potongan: saya.potongan, temanMakan: dia.tahan && keadaan !== "menoleh" }, waktu); }
      else gambar2D(Wd, Hd, makan);
      papanSkor(ctx, Wd, j, { [j.aku]: saya.skor, [j.kamu]: dia.skor }, `${Math.max(0, Math.ceil(sisa))} detik`);
      ctx.fillStyle = "rgba(43,42,38,.6)"; ctx.fillRect(Wd / 2 - 100, Hd - 40, 200, 30);
      teks(ctx, saya.nyawa <= 0 ? "gorenganmu disita" : makan ? "ngemil..." : saya.lepasDulu ? "lepas dulu" : "tahan untuk ngemil", Wd / 2, Hd - 25, 14);
      teks(ctx, `nyawa ${"●".repeat(saya.nyawa)}${"○".repeat(3 - saya.nyawa)}`, 20, Hd - 60, 12, "#7FB2E0", "left");
      teks(ctx, `${j.nama[j.kamu].slice(0, 8)} ${"●".repeat(dia.nyawa)}${"○".repeat(Math.max(0, 3 - dia.nyawa))}`, Wd - 20, Hd - 60, 12, "#F2A86B", "right");
      if (kedip > 0) { ctx.fillStyle = `rgba(181,68,58,${kedip * 0.5})`; ctx.fillRect(0, 0, Wd, Hd); }
    });
    function gambar2D(Wd, Hd, makan) {
      ctx.fillStyle = "#E9E2D0"; ctx.fillRect(0, 0, Wd, Hd);
      ctx.fillStyle = "#FFFDF6"; ctx.strokeStyle = "#2B2A26"; ctx.lineWidth = 3; ctx.fillRect(40, 60, Wd - 80, Hd * 0.26); ctx.strokeRect(40, 60, Wd - 80, Hd * 0.26);
      api.alat.gambarSprite(ctx, keadaan === "menoleh" ? "oyen" : "oyenBelakang", Wd * 0.68, 60 + Hd * 0.3, 72);
      if (keadaan === "curiga") teks(ctx, "!", Wd * 0.68 + 30, 60 + Hd * 0.3 - 44, 26, "#B5443A");
      ctx.fillStyle = "#9C6B43"; ctx.fillRect(0, Hd * 0.62, Wd, Hd * 0.38);
      api.alat.gambarSprite(ctx, j.sprite[j.kamu], Wd * 0.22, Hd * 0.56 + (pm[j.kamu].tahan ? Math.sin(waktu * 30) * 3 : 0), 54);
      for (let i = 0; i < 3; i++) api.alat.gambarSprite(ctx, "gorengan", Wd / 2 - 34 + i * 34, Hd * 0.78 + (makan ? 6 : 0), 44);
    }
    return () => { stop(); c.removeEventListener("pointerdown", tekan); c.removeEventListener("pointerup", lepas); c.removeEventListener("pointerleave", lepas); c.removeEventListener("pointercancel", lepas); };
  }

  K.ONLINE_MAIN = { rally, stempel, kertas, ngemil };
  K.ONLINE_SAMBUNG = sambung;
})();
