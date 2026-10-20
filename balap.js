/* =========================================================
   Kantor Layanan Perasaan · Grand Prix Kantor
   Balapan sirkuit 3 lap ala kart & MotoGP: drift + mini-turbo,
   kotak item, berkas emas, panah turbo, start roket, 6 pembalap.
   Logika ada di sini; tampilan 3D di games3d.js (ADEGAN.troli),
   tampilan 2D (atas-bawah) dan HUD digambar di sini.
   Id game tetap "troli" supaya rekor & misi lama tetap berlaku.
   ========================================================= */
(() => {
  "use strict";
  const K = window.KLP;
  const { esc, px, sfx } = K;
  const batas = (v, a, b) => Math.max(a, Math.min(b, v));
  const acak = (a, b) => a + Math.random() * (b - a);
  const bungkus = (a) => { while (a > Math.PI) a -= Math.PI * 2; while (a < -Math.PI) a += Math.PI * 2; return a; };
  const LAP = 3;

  /* ---------- kendaraan & karakter ---------- */
  const KENDARAAN = {
    troli: { nama: "Troli Arsip", ket: "Seimbang. Cocok untuk semua.", vmax: 30, aksel: 17, belok: 2.25, drift: 1, nilai: [3, 3, 3] },
    motor: { nama: "Motor Pak Satpam", ket: "Paling kencang, tapi beloknya berat. Miring kalau menikung.", vmax: 33.5, aksel: 14, belok: 1.85, drift: 0.9, nilai: [5, 2, 2] },
    kursi: { nama: "Kursi Putar", ket: "Belok dan drift paling lincah, kecepatan biasa saja.", vmax: 28.5, aksel: 21, belok: 2.7, drift: 1.25, nilai: [2, 4, 5] },
  };
  const KARAKTER = ["kapibara", "marmut", "kukang", "oyen", "badak", "rakun", "berang", "singa", "gajah", "hantu", "beruang", "kura"];
  const LAWAN = [
    { nama: "Pak Satpam", sprite: "kura", kendaraan: "motor", warna: "#2F4A6B" },
    { nama: "Dimas", sprite: "marmut", kendaraan: "troli", warna: "#B5443A" },
    { nama: "Kak Badak", sprite: "badak", kendaraan: "troli", warna: "#4F6E5E" },
    { nama: "Mas Kukang", sprite: "kukang", kendaraan: "kursi", warna: "#8A6B4F" },
    { nama: "Oyen", sprite: "oyen", kendaraan: "kursi", warna: "#E58B3A" },
  ];
  const CADANGAN = [{ nama: "Bang Rakun", sprite: "rakun" }, { nama: "Bang Berang", sprite: "berang" }, { nama: "Bu Ratna", sprite: "kapibara" }];
  const pilihan = () => {
    const s = K.data.setelan.balap || {};
    return { kendaraan: KENDARAAN[s.kendaraan] ? s.kendaraan : "troli", karakter: KARAKTER.includes(s.karakter) ? s.karakter : "kapibara" };
  };

  /* ---------- item ---------- */
  const ITEM = {
    turbo: { nama: "Teh Turbo", sprite: "cangkir" },
    pisang: { nama: "Kulit Pisang Goreng", sprite: "gorengan" },
    stempel: { nama: "Stempel Kejar", sprite: "berkas" },
    payung: { nama: "Payung Pelindung", sprite: "payung" },
    emas3: { nama: "Tiga Berkas Emas", sprite: "dokumen" },
  };
  // peluang item menurut posisi (makin belakang, makin bagus): kolom = posisi 1..6
  const PELUANG = {
    turbo: [1, 2, 3, 4, 5, 5], pisang: [5, 4, 3, 2, 1, 0], stempel: [1, 3, 4, 4, 4, 3], payung: [0, 0, 1, 2, 3, 4], emas3: [4, 3, 2, 1, 0, 0],
  };
  function undiItem(posisi) {
    const i = batas(posisi, 1, 6) - 1;
    const daftar = Object.entries(PELUANG).map(([id, w]) => [id, w[i]]);
    let r = Math.random() * daftar.reduce((a, [, w]) => a + w, 0);
    for (const [id, w] of daftar) { if ((r -= w) <= 0) return id; }
    return "turbo";
  }

  /* ---------- sirkuit: spline tertutup, disampel rata ---------- */
  function buatTrek() {
    const S = 1.6;
    const P = [[0, 0], [40, -4], [78, 6], [96, 30], [88, 58], [62, 66], [46, 52], [30, 40], [12, 46], [-6, 66], [-34, 70], [-58, 54], [-62, 26], [-48, 6], [-24, -2]].map(([x, z]) => [x * S, z * S]);
    const cr = (a, b, c, d, t) => { const t2 = t * t, t3 = t2 * t; return 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3); };
    const rapat = [];
    for (let i = 0; i < P.length; i++) {
      const p0 = P[(i - 1 + P.length) % P.length], p1 = P[i], p2 = P[(i + 1) % P.length], p3 = P[(i + 2) % P.length];
      for (let k = 0; k < 40; k++) { const t = k / 40; rapat.push([cr(p0[0], p1[0], p2[0], p3[0], t), cr(p0[1], p1[1], p2[1], p3[1], t)]); }
    }
    const kum = [0];
    for (let i = 1; i <= rapat.length; i++) { const a = rapat[i - 1], b = rapat[i % rapat.length]; kum.push(kum[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1])); }
    const panjang = kum[kum.length - 1], N = 640, pts = [];
    let j = 0;
    for (let i = 0; i < N; i++) {
      const s = (i / N) * panjang;
      while (kum[j + 1] < s) j++;
      const a = rapat[j], b = rapat[(j + 1) % rapat.length], t = (s - kum[j]) / (kum[j + 1] - kum[j] || 1);
      pts.push({ x: a[0] + (b[0] - a[0]) * t, z: a[1] + (b[1] - a[1]) * t });
    }
    pts.forEach((p, i) => {
      const n = pts[(i + 1) % N], m = pts[(i - 1 + N) % N];
      const dx = n.x - m.x, dz = n.z - m.z, l = Math.hypot(dx, dz) || 1;
      p.tx = dx / l; p.tz = dz / l; p.nx = -p.tz; p.nz = p.tx;
    });
    return { pts, N, halfW: 5.6, panjang };
  }

  /* =========================================================
     PERMAINAN
     ========================================================= */
  function main(api) {
    const { ctx } = api;
    const kanvas = ctx.canvas;
    const trek = buatTrek();
    const { pts, N, halfW } = trek;
    const titikDi = (i, off = 0) => { const p = pts[((Math.round(i) % N) + N) % N]; return { x: p.x + p.nx * off * halfW, z: p.z + p.nz * off * halfW, a: Math.atan2(p.tz, p.tx) }; };
    const pil = pilihan();
    const skill = { santai: 0.86, normal: 0.93, lembur: 0.99 }[api.tingkat] || 0.93;

    // pembalap: pemain di posisi start ke-5 dari 6
    const lawan = LAWAN.map((l) => ({ ...l }));
    const bentrok = lawan.findIndex((l) => l.sprite === pil.karakter);
    if (bentrok >= 0) Object.assign(lawan[bentrok], CADANGAN.find((c) => c.sprite !== pil.karakter));
    const urutGrid = [lawan[0], lawan[1], lawan[2], lawan[3], { pemain: true }, lawan[4]];
    const pembalap = urutGrid.map((l, i) => {
      const baris = Math.floor(i / 2), kolom = i % 2 ? 0.38 : -0.38;
      const t = titikDi(-8 - baris * 9, kolom);
      const kend = l.pemain ? pil.kendaraan : l.kendaraan;
      return {
        id: i, pemain: !!l.pemain, nama: l.pemain ? api.nama : l.nama, sprite: l.pemain ? pil.karakter : l.sprite,
        warna: l.pemain ? "#3E78C4" : l.warna, kendaraan: kend, st: KENDARAAN[kend],
        x: t.x, z: t.z, a: t.a, v: 0, idx: ((-8 - baris * 9) % N + N) % N, prog: -8 - baris * 9, lap: 0,
        item: null, roda: 0, putar: 0, spin: 0, kebal: 0, turbo: 0, koin: 0, koinTotal: 0, drift: 0, driftArah: 0, muatan: 0, miring: 0,
        finis: 0, waktuFinis: 0, lajurAI: acak(-0.35, 0.35), skillAI: skill * acak(0.97, 1.02), jedaItem: acak(1, 3), mundur: 0,
      };
    });
    const pemain = pembalap.find((r) => r.pemain);

    // benda di lintasan
    const kotak = [];
    [0.1, 0.34, 0.6, 0.84].forEach((f) => [-0.62, -0.21, 0.21, 0.62].forEach((off) => { const t = titikDi(f * N, off); kotak.push({ x: t.x, z: t.z, aktif: true, timer: 0 }); }));
    const koin = [];
    [[0.05, 0], [0.22, -0.45], [0.29, 0.5], [0.46, 0], [0.55, -0.5], [0.7, 0.45], [0.78, -0.2], [0.93, 0.3]].forEach(([f, off]) => {
      for (let k = 0; k < 4; k++) { const t = titikDi(f * N + k * 3, off); koin.push({ x: t.x, z: t.z, aktif: true, timer: 0 }); }
    });
    const pad = [[0.17, 0], [0.5, 0.3], [0.9, -0.25]].map(([f, off]) => { const t = titikDi(f * N, off); return { x: t.x, z: t.z, a: t.a }; });
    const pisang = [], stempel = [], efek = [];

    const sim = {
      trek, pembalap, pemain, kotak, koin, pad, pisang, stempel, efek,
      fase: "lampu", lampu: 0, waktu: 0, finisKe: 0, LAP, KENDARAAN, ITEM,
    };

    kanvas._sim = sim;                       // untuk pengujian otomatis

    /* ---------- kendali ---------- */
    const tekan = { kiri: false, kanan: false, drift: false };
    let mulaiDini = false, roketSiap = false;
    api.kontrol.innerHTML = `
      <div class="gp-kontrol">
        <button type="button" class="gp-btn gp-arah" data-k="kiri" aria-label="Belok kiri">◀</button>
        <button type="button" class="gp-btn gp-arah" data-k="kanan" aria-label="Belok kanan">▶</button>
        <span class="gp-sela"></span>
        <button type="button" class="gp-btn gp-item" data-k="item" aria-label="Pakai item">ITEM</button>
        <button type="button" class="gp-btn gp-drift" data-k="drift" aria-label="Drift (tahan)">DRIFT</button>
      </div>`;
    const turun = (k) => {
      if (k === "item") { pakaiItem(pemain); return; }
      tekan[k] = true;
      if (k === "drift") {
        if (sim.fase === "lampu") { if (sim.lampu >= 2.55) roketSiap = true; else if (sim.lampu > 0.6) mulaiDini = true; }
        else mulaiDrift(pemain, tekan.kanan ? 1 : tekan.kiri ? -1 : 0);
      }
    };
    const naik = (k) => {
      if (!(k in tekan)) return;
      tekan[k] = false;
      if (k === "drift") lepasDrift(pemain);
    };
    const kendaliTombol = new Map();
    const pd = (e) => { const b = e.target.closest("[data-k]"); if (!b) return; e.preventDefault(); kendaliTombol.set(e.pointerId, b.dataset.k); b.classList.add("ditekan"); try { b.setPointerCapture(e.pointerId); } catch { /* */ } turun(b.dataset.k); };
    const pu = (e) => { const k = kendaliTombol.get(e.pointerId); if (!k) return; kendaliTombol.delete(e.pointerId); api.kontrol.querySelector(`[data-k="${k}"]`)?.classList.remove("ditekan"); naik(k); };
    api.kontrol.addEventListener("pointerdown", pd);
    api.kontrol.addEventListener("pointerup", pu);
    api.kontrol.addEventListener("pointercancel", pu);
    api.kontrol.addEventListener("contextmenu", (e) => e.preventDefault());
    // sentuh layar: kiri/kanan untuk belok
    const sentuh = new Map();
    const kd = (e) => { e.preventDefault(); const r = kanvas.getBoundingClientRect(); const k = e.clientX - r.left < r.width / 2 ? "kiri" : "kanan"; sentuh.set(e.pointerId, k); tekan[k] = true; };
    const ku = (e) => { const k = sentuh.get(e.pointerId); if (!k) return; sentuh.delete(e.pointerId); if (![...sentuh.values()].includes(k) && ![...kendaliTombol.values()].includes(k)) tekan[k] = false; };
    kanvas.addEventListener("pointerdown", kd); kanvas.addEventListener("pointerup", ku); kanvas.addEventListener("pointercancel", ku); kanvas.addEventListener("pointerleave", ku);
    // papan ketik (laptop)
    const KEY = { ArrowLeft: "kiri", a: "kiri", A: "kiri", ArrowRight: "kanan", d: "kanan", D: "kanan", " ": "drift", Shift: "drift", x: "item", X: "item", Enter: "item", ArrowUp: "item" };
    const kbd = (e) => { const k = KEY[e.key]; if (!k || e.repeat) return; e.preventDefault(); turun(k); };
    const kbu = (e) => { const k = KEY[e.key]; if (!k) return; naik(k); };
    addEventListener("keydown", kbd); addEventListener("keyup", kbu);

    /* ---------- aksi ---------- */
    function mulaiDrift(r, arah) {
      if (r.spin > 0 || r.v < 12 || !arah) return;
      r.drift = 1; r.driftArah = arah; r.muatan = 0; r.loncat = 0.18;
      if (r.pemain) sfx("boing");
    }
    function levelMuatan(m) { return m >= 2.6 ? 3 : m >= 1.7 ? 2 : m >= 0.85 ? 1 : 0; }
    function lepasDrift(r) {
      if (!r.drift) return;
      const lv = levelMuatan(r.muatan);
      r.drift = 0; r.muatan = 0;
      if (lv) { r.turbo = Math.max(r.turbo, [0, 0.55, 0.95, 1.4][lv]); if (r.pemain) { sfx("poin"); api.tambah("miniturbo"); kilat(["", "MINI TURBO", "SUPER TURBO", "ULTRA TURBO"][lv], ["", "#7FC8F2", "#F2A14E", "#C38AF2"][lv]); } }
    }
    function kena(r, sebab) {
      if (r.kebal > 0 || r.spin > 0) return;
      r.spin = 1.05; r.drift = 0; r.muatan = 0; r.turbo = 0;
      if (r.koin > 0) r.koin--;
      if (r.pemain) { sfx("boing"); kilat(sebab === "stempel" ? "DICAP!" : "KEPLESET!", "#FFFDF6"); api.tambah("kena"); }
    }
    function posisiDari(r) { return urutan().indexOf(r) + 1; }
    function urutan() {
      return pembalap.slice().sort((a, b) => {
        if (a.finis && b.finis) return a.finis - b.finis;
        if (a.finis) return -1; if (b.finis) return 1;
        return b.prog - a.prog;
      });
    }
    function pakaiItem(r) {
      if (!r.item || r.item === "acak" || sim.fase !== "balap" || r.finis) return;
      const it = r.item; r.item = null;
      if (it === "turbo") { r.turbo = Math.max(r.turbo, 1.4); if (r.pemain) { sfx("tingtong"); kilat("TEH TURBO!", "#F2C14E"); } }
      else if (it === "payung") { r.kebal = 3.6; if (r.pemain) sfx("pilih"); }
      else if (it === "emas3") { r.koin = Math.min(10, r.koin + 3); r.koinTotal += 3; if (r.pemain) { sfx("poin"); api.catatStat("emas", r.koinTotal); } }
      else if (it === "pisang") { pisang.push({ x: r.x - Math.cos(r.a) * 2.4, z: r.z - Math.sin(r.a) * 2.4, pemilik: r.id, umur: 0 }); if (r.pemain) sfx("kertas"); }
      else if (it === "stempel") {
        const urut = urutan(), i = urut.indexOf(r);
        const target = i > 0 ? urut[i - 1] : null;
        stempel.push({ x: r.x + Math.cos(r.a) * 2, z: r.z + Math.sin(r.a) * 2, a: r.a, v: Math.max(r.v + 16, 40), target, pemilik: r.id, umur: 0, idx: r.idx });
        if (r.pemain) sfx("stempel");
        if (target?.pemain) kilat("AWAS STEMPEL!", "#B5443A");
      }
    }
    const kilatan = [];
    function kilat(teks, warna) { kilatan.push({ teks, warna, umur: 0 }); }

    /* ---------- fisika per pembalap ---------- */
    function cariIdx(r) {
      let terbaik = r.idx, jarak = Infinity;
      for (let d = -25; d <= 45; d++) {
        const i = (r.idx + d + N) % N, p = pts[i];
        const j = (p.x - r.x) ** 2 + (p.z - r.z) ** 2;
        if (j < jarak) { jarak = j; terbaik = i; }
      }
      let delta = terbaik - r.idx;
      if (delta > N / 2) delta -= N; if (delta < -N / 2) delta += N;
      r.idx = terbaik; r.prog += delta;
      r.mundur = delta < 0 ? r.mundur + 1 : 0;
      const p = pts[terbaik];
      r.lat = (r.x - p.x) * p.nx + (r.z - p.z) * p.nz;
      return p;
    }
    function gerak(r, belok, dt) {
      const st = r.st;
      let vmax = st.vmax + Math.min(10, r.koin) * 0.28;
      if (!r.pemain) vmax *= r.skillAI;
      if (r.kebal > 0) vmax *= 1.1;
      if (r.turbo > 0) vmax *= 1.38;
      const luar = Math.abs(r.lat || 0) > halfW;
      if (luar && r.turbo <= 0) vmax *= 0.55;
      if (r.spin > 0) {
        r.spin -= dt; r.putar += dt * 14; r.v *= Math.pow(0.25, dt);
      } else {
        r.putar = 0;
        if (r.v < vmax) r.v = Math.min(vmax, r.v + st.aksel * (r.turbo > 0 ? 2.2 : 1) * dt);
        else r.v = Math.max(vmax, r.v - (luar ? 40 : 12) * dt);
        const peka = batas(r.v / 12, 0.35, 1);
        if (r.drift) {
          const tekanArah = belok * r.driftArah;      // 1 = memperketat, -1 = melebarkan
          r.a += r.driftArah * st.belok * st.drift * (0.78 + 0.42 * tekanArah) * peka * dt;
          r.muatan += dt * st.drift * (1 + 0.7 * Math.max(0, tekanArah));
          if (r.v < 9) lepasDrift(r);
        } else r.a += belok * st.belok * peka * dt;
      }
      r.miring += ((r.drift ? r.driftArah * 0.9 : belok * 0.75) * (r.spin > 0 ? 0 : 1) - r.miring) * Math.min(1, dt * 7);
      if (r.turbo > 0) r.turbo -= dt;
      if (r.kebal > 0) r.kebal -= dt;
      if (r.loncat > 0) r.loncat -= dt;
      r.x += Math.cos(r.a) * r.v * dt; r.z += Math.sin(r.a) * r.v * dt;
      r.roda += r.v * dt;
      const p = cariIdx(r);
      // pagar ban di luar lintasan
      const BATAS = halfW + 4.2;
      if (Math.abs(r.lat) > BATAS) {
        const s = Math.sign(r.lat);
        r.x = p.x + p.nx * s * BATAS; r.z = p.z + p.nz * s * BATAS;
        r.v *= 0.6; r.drift = 0;
        const arahTrek = Math.atan2(p.tz, p.tx);
        r.a += bungkus(arahTrek - r.a) * 0.35;
        if (r.pemain && sim.waktu - (r.bentur || 0) > 0.5) { r.bentur = sim.waktu; sfx("salah"); }
      }
      // panah turbo
      for (const q of pad) if ((q.x - r.x) ** 2 + (q.z - r.z) ** 2 < 5.5) { if (r.turbo < 0.9) { r.turbo = 1.0; if (r.pemain) { sfx("pilih"); kilat("PANAH TURBO", "#F2C14E"); } } }
      // lap
      if (!r.finis) {
        const lapBaru = Math.floor(r.prog / N) + 1;
        if (lapBaru > r.lap) {
          r.lap = lapBaru;
          if (r.lap > LAP) {
            r.finis = ++sim.finisKe; r.waktuFinis = sim.waktu;
            if (r.pemain) selesaiPemain();
          } else if (r.pemain && r.lap === LAP) { sfx("tingtong"); kilat("LAP TERAKHIR!", "#F2C14E"); api.info("Pak Singa: PERHATIAN. Lap terakhir. Pegangan yang kencang."); }
          else if (r.pemain && r.lap > 1) { sfx("klik"); kilat(`LAP ${r.lap}/${LAP}`, "#FFFDF6"); }
        }
      }
    }
    function otakAI(r, dt) {
      const pnj = Math.round(10 + r.v * 0.45);
      // hindari kulit pisang di depan dengan pindah lajur
      for (const b of pisang) {
        const dx = b.x - r.x, dz = b.z - r.z, maju = dx * Math.cos(r.a) + dz * Math.sin(r.a);
        if (maju > 0 && maju < 14 && Math.abs(-dx * Math.sin(r.a) + dz * Math.cos(r.a)) < 2.2) r.lajurAI = batas(r.lajurAI + (r.lajurAI > 0 ? -0.6 : 0.6), -0.6, 0.6);
      }
      if (Math.random() < dt * 0.25) r.lajurAI = acak(-0.4, 0.4);
      const t = titikDi(r.idx + pnj, r.lajurAI);
      const beda = bungkus(Math.atan2(t.z - r.z, t.x - r.x) - r.a);
      // karet: tetap seru, tidak terlalu jauh
      const selisih = r.prog - pemain.prog;
      r.skillAI = skill * (selisih > 60 ? 0.93 : selisih < -90 ? 1.08 : 1) * (r.id % 2 ? 1.01 : 0.99);
      // item AI
      if (r.item && r.item !== "acak") {
        r.jedaItem -= dt;
        if (r.jedaItem <= 0) {
          const urut = urutan(), i = urut.indexOf(r);
          const belakang = urut[i + 1], depan = urut[i - 1];
          if (r.item === "pisang" && belakang && r.prog - belakang.prog < 25) pakaiItem(r);
          else if (r.item === "stempel" && depan && depan.prog - r.prog < 70) pakaiItem(r);
          else if (r.item === "turbo" || r.item === "emas3" || r.item === "payung") pakaiItem(r);
          r.jedaItem = acak(0.6, 2.2);
        }
      }
      return batas(beda * 2.6, -1, 1);
    }

    /* ---------- akhir ---------- */
    let akhir = null;
    function selesaiPemain() {
      const posisi = pemain.finis;
      sfx(posisi === 1 ? "menang" : "tingtong");
      kilat(posisi === 1 ? "JUARA 1!" : `FINIS KE-${posisi}`, posisi === 1 ? "#F2C14E" : "#FFFDF6");
      akhir = { sisa: 3.2, posisi };
    }
    function hentikanSemua() {
      api.kontrol.removeEventListener("pointerdown", pd); api.kontrol.removeEventListener("pointerup", pu); api.kontrol.removeEventListener("pointercancel", pu);
      kanvas.removeEventListener("pointerdown", kd); kanvas.removeEventListener("pointerup", ku); kanvas.removeEventListener("pointercancel", ku); kanvas.removeEventListener("pointerleave", ku);
      removeEventListener("keydown", kbd); removeEventListener("keyup", kbu);
    }
    function kirimHasil() {
      const posisi = pemain.finis || posisiDari(pemain);
      const skor = [0, 200, 150, 115, 90, 70, 55][posisi] + Math.min(20, pemain.koinTotal) * 6 + Math.min(15, api.stat.miniturbo || 0) * 4;
      api.catatStat("finis", posisi); api.catatStat("emas", pemain.koinTotal);
      const KOMENTAR = [null,
        ["badak", "JUARA SATU. Saya kalah, dan saya menerima dengan lapang dada. Dada saya lapang. Saya badak."],
        ["kura", "Siap. Juara dua. Motor saya kalah cepat dari keyakinan Anda."],
        ["marmut", "Podium! Tiga besar! Eh, saya nabrak tiang dua kali. *jangan bilang siapa-siapa."],
        ["kapibara", "Keempat ya. Drift-nya tadi bagus. Saya lihat dari pantry."],
        ["kukang", "...kelima. ...saya sampai garis finis besok. ...santai saja."],
        ["oyen", "Keenam. Sirkuit ini milik saya. Anda tamu. Silakan coba lagi."]];
      const [sp, kata] = KOMENTAR[posisi];
      api.selesai(skor, [sp, `Finis ke-${posisi} dari 6, ${pemain.koinTotal} berkas emas, ${api.stat.miniturbo || 0} mini turbo. ${kata}`]);
    }

    /* ---------- 3D bila tersedia ---------- */
    const d3 = api.buat3D(sim);
    api.info(`Pak Singa: Grand Prix Kantor, 3 lap. ${KENDARAAN[pil.kendaraan].nama}. Tahan DRIFT tepat saat lampu ke-3 untuk start roket.`);

    /* ---------- loop ---------- */
    const stop = api.loop((dt) => {
      sim.waktu += dt;
      if (sim.fase === "lampu") {
        const sebelum = Math.floor(sim.lampu);
        sim.lampu += dt;
        if (Math.floor(sim.lampu) > sebelum && sim.lampu < 3.05) sfx("klik");
        if (sim.lampu >= 3) {
          sim.fase = "balap"; sfx("tingtong");
          if (roketSiap && tekan.drift && !mulaiDini) { pemain.turbo = 1.3; kilat("START ROKET!", "#F2C14E"); api.tambah("roket"); }
          else if (mulaiDini) { pemain.spin = 0.6; kilat("MESIN NGAMBEK", "#FFFDF6"); }
          pembalap.forEach((r) => { if (!r.pemain && Math.random() < 0.5) r.turbo = acak(0.3, 0.9); });
        }
      } else {
        // pembalap
        for (const r of pembalap) {
          let belok = 0;
          if (r.finis) belok = otakAI(r, dt) * 0.8;
          else if (r.pemain) belok = (tekan.kanan ? 1 : 0) - (tekan.kiri ? 1 : 0);
          else belok = otakAI(r, dt);
          if (r.pemain && tekan.drift && !r.drift && belok) mulaiDrift(r, belok);
          gerak(r, belok, dt);
        }
        // tabrakan antarpembalap
        for (let i = 0; i < pembalap.length; i++) for (let j = i + 1; j < pembalap.length; j++) {
          const a = pembalap[i], b = pembalap[j], dx = b.x - a.x, dz = b.z - a.z, d = Math.hypot(dx, dz);
          if (d < 1.5 && d > 0.01) {
            const nx = dx / d, nz = dz / d, dorong = (1.5 - d) / 2;
            a.x -= nx * dorong; a.z -= nz * dorong; b.x += nx * dorong; b.z += nz * dorong;
            const rata = (a.v + b.v) / 2; a.v = a.v * 0.7 + rata * 0.3; b.v = b.v * 0.7 + rata * 0.3;
            if (a.kebal > 0 && b.kebal <= 0) kena(b, "tabrak"); else if (b.kebal > 0 && a.kebal <= 0) kena(a, "tabrak");
            if ((a.pemain || b.pemain) && sim.waktu - (pemain.senggol || 0) > 0.6) { pemain.senggol = sim.waktu; sfx("klik"); }
          }
        }
        // kotak item
        for (const k of kotak) {
          if (!k.aktif) { k.timer -= dt; if (k.timer <= 0) k.aktif = true; continue; }
          for (const r of pembalap) {
            if ((k.x - r.x) ** 2 + (k.z - r.z) ** 2 < 3.2) {
              k.aktif = false; k.timer = 3;
              if (!r.item && !r.finis) {
                r.item = "acak"; r.rolet = 1.0;
                if (r.pemain) sfx("pilih");
              }
              break;
            }
          }
        }
        for (const r of pembalap) if (r.item === "acak") { r.rolet -= dt; if (r.rolet <= 0) { r.item = undiItem(posisiDari(r)); r.jedaItem = acak(0.8, 2.5); if (r.pemain) sfx("klik"); } }
        // berkas emas
        for (const c of koin) {
          if (!c.aktif) { c.timer -= dt; if (c.timer <= 0) c.aktif = true; continue; }
          for (const r of pembalap) if ((c.x - r.x) ** 2 + (c.z - r.z) ** 2 < 2.6) {
            c.aktif = false; c.timer = 35;
            r.koin = Math.min(10, r.koin + 1); r.koinTotal++;
            if (r.pemain) { sfx("poin"); api.catatStat("emas", r.koinTotal); }
            break;
          }
        }
        // kulit pisang
        for (let i = pisang.length - 1; i >= 0; i--) {
          const b = pisang[i]; b.umur += dt;
          if (b.umur > 30) { pisang.splice(i, 1); continue; }
          for (const r of pembalap) {
            if (r.id === b.pemilik && b.umur < 0.8) continue;
            if ((b.x - r.x) ** 2 + (b.z - r.z) ** 2 < 1.7) { kena(r, "pisang"); pisang.splice(i, 1); break; }
          }
        }
        // stempel kejar
        for (let i = stempel.length - 1; i >= 0; i--) {
          const s = stempel[i]; s.umur += dt;
          let tujuan;
          if (s.target && !s.target.finis && s.umur > 0.25) tujuan = { x: s.target.x, z: s.target.z };
          else { s.idx = cariIdxBenda(s); tujuan = titikDi(s.idx + 14, 0); }
          s.a += batas(bungkus(Math.atan2(tujuan.z - s.z, tujuan.x - s.x) - s.a), -4 * dt, 4 * dt);
          s.x += Math.cos(s.a) * s.v * dt; s.z += Math.sin(s.a) * s.v * dt;
          let habis = s.umur > 6;
          for (const r of pembalap) {
            if (r.id === s.pemilik && s.umur < 0.6) continue;
            if ((s.x - r.x) ** 2 + (s.z - r.z) ** 2 < 2.4) { kena(r, "stempel"); habis = true; break; }
          }
          if (habis) stempel.splice(i, 1);
        }
        if (akhir) { akhir.sisa -= dt; if (akhir.sisa <= 0) { akhir = null; berhenti(); kirimHasil(); return; } }
        else if (!pemain.finis && (sim.waktu > 240 || (sim.finisKe >= 5 && sim.waktu - pembalap.reduce((m, r) => Math.max(m, r.waktuFinis), 0) > 20))) {
          pemain.finis = posisiDari(pemain); selesaiPemain();
        }
      }
      for (let i = kilatan.length - 1; i >= 0; i--) { kilatan[i].umur += dt; if (kilatan[i].umur > 1.4) kilatan.splice(i, 1); }
      sim.posisi = posisiDari(pemain);

      // ===== gambar =====
      const W = api.W(), H = api.H();
      if (d3) { ctx.clearRect(0, 0, W, H); d3.gambar(sim, sim.waktu); }
      else gambar2D(W, H);
      gambarHUD(W, H);
      document.getElementById("hudWaktu").textContent = `Posisi ${sim.posisi}/6 · Lap ${batas(pemain.lap, 1, LAP)}/${LAP}`;
    });
    function cariIdxBenda(s) {
      let terbaik = s.idx, jarak = Infinity;
      for (let d = -10; d <= 30; d++) { const i = (s.idx + d + N) % N, p = pts[i], j = (p.x - s.x) ** 2 + (p.z - s.z) ** 2; if (j < jarak) { jarak = j; terbaik = i; } }
      return terbaik;
    }
    function berhenti() { stop(); hentikanSemua(); }

    /* ---------- tampilan 2D: dilihat dari atas, berputar mengikuti pemain ---------- */
    function gambar2D(W, H) {
      const S = 9;
      ctx.fillStyle = "#7FA868"; ctx.fillRect(0, 0, W, H);
      ctx.save();
      ctx.translate(W / 2, H * 0.68);
      ctx.rotate(-pemain.a - Math.PI / 2);
      ctx.scale(S, S);
      ctx.translate(-pemain.x, -pemain.z);
      const garisTrek = (lebar, warna, dash) => {
        ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.z) : ctx.moveTo(p.x, p.z))); ctx.closePath();
        ctx.lineWidth = lebar; ctx.strokeStyle = warna; ctx.setLineDash(dash || []); ctx.stroke(); ctx.setLineDash([]);
      };
      garisTrek(halfW * 2 + 9, "#6E9A5C"); garisTrek(halfW * 2 + 1.6, "#B5443A"); garisTrek(halfW * 2 + 1.6, "#FFFDF6", [1.5, 1.5]);
      garisTrek(halfW * 2, "#5C5A57"); garisTrek(0.25, "#E9E2D0", [2, 2]);
      const p0 = pts[0];
      for (let k = -4; k < 4; k++) { ctx.fillStyle = k % 2 ? "#2B2A26" : "#FFFDF6"; ctx.fillRect(p0.x + p0.nx * k * 1.4 - 0.7, p0.z + p0.nz * k * 1.4 - 0.7, 1.4, 1.4); }
      for (const q of pad) { ctx.fillStyle = "#F2C14E"; ctx.beginPath(); ctx.arc(q.x, q.z, 1.6, 0, 7); ctx.fill(); }
      for (const k of kotak) if (k.aktif) { ctx.fillStyle = "#7FC8F2"; ctx.fillRect(k.x - 0.7, k.z - 0.7, 1.4, 1.4); ctx.strokeStyle = "#2B2A26"; ctx.lineWidth = 0.2; ctx.strokeRect(k.x - 0.7, k.z - 0.7, 1.4, 1.4); }
      for (const c of koin) if (c.aktif) { ctx.fillStyle = "#F2C14E"; ctx.fillRect(c.x - 0.4, c.z - 0.5, 0.8, 1); }
      for (const b of pisang) { ctx.fillStyle = "#E0B84A"; ctx.beginPath(); ctx.arc(b.x, b.z, 0.7, 0, 7); ctx.fill(); }
      for (const s of stempel) { ctx.fillStyle = "#B5443A"; ctx.fillRect(s.x - 0.6, s.z - 0.6, 1.2, 1.2); }
      for (const r of pembalap) {
        ctx.save(); ctx.translate(r.x, r.z); ctx.rotate(r.a + r.putar + (r.drift ? r.driftArah * 0.35 : 0));
        if (r.kebal > 0) { ctx.fillStyle = "rgba(127,200,242,.35)"; ctx.beginPath(); ctx.arc(0, 0, 1.6, 0, 7); ctx.fill(); }
        ctx.fillStyle = r.warna; ctx.fillRect(-1, -0.6, 2, 1.2); ctx.strokeStyle = "#2B2A26"; ctx.lineWidth = 0.18; ctx.strokeRect(-1, -0.6, 2, 1.2);
        ctx.restore();
        ctx.save(); ctx.translate(r.x, r.z); ctx.rotate(pemain.a + Math.PI / 2);
        const i = api.alat.sp(r.sprite); if (i.complete) ctx.drawImage(i, -0.9, -1.9, 1.8, 1.8);
        ctx.restore();
      }
      ctx.restore();
    }

    /* ---------- HUD ---------- */
    const teks = (t, x, y, uk, warna = "#FFFDF6", rata = "center") => {
      ctx.font = `${uk}px "Pixelify Sans", monospace`; ctx.textAlign = rata; ctx.textBaseline = "middle";
      ctx.lineWidth = Math.max(2, uk / 6); ctx.strokeStyle = "#2B2A26"; ctx.strokeText(t, x, y);
      ctx.fillStyle = warna; ctx.fillText(t, x, y);
    };
    const IKON_ROLET = Object.keys(ITEM);
    function gambarHUD(W, H) {
      // kotak item
      ctx.fillStyle = "rgba(43,42,38,.78)"; ctx.fillRect(10, 10, 58, 58);
      ctx.strokeStyle = "#F2C14E"; ctx.lineWidth = 3; ctx.strokeRect(10, 10, 58, 58);
      const it = pemain.item === "acak" ? IKON_ROLET[Math.floor(sim.waktu * 14) % IKON_ROLET.length] : pemain.item;
      if (it) { const i = api.alat.sp(ITEM[it].sprite); if (i.complete) ctx.drawImage(i, 17, 17, 44, 44); }
      teks(pemain.item && pemain.item !== "acak" ? ITEM[pemain.item].nama : "ITEM", 39, 80, 9);
      // posisi & lap
      const pos = sim.posisi;
      teks(`${pos}`, W / 2 - 8, 34, 40, pos === 1 ? "#F2C14E" : "#FFFDF6");
      teks("/6", W / 2 + 22, 42, 14);
      teks(`LAP ${batas(pemain.lap, 1, LAP)}/${LAP}`, W / 2, 64, 13);
      // peta mini
      const mx = W - 74, my = 12, mw = 64, mh = 52;
      ctx.fillStyle = "rgba(43,42,38,.7)"; ctx.fillRect(mx - 4, my - 4, mw + 8, mh + 8);
      let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
      for (const p of pts) { minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x); minZ = Math.min(minZ, p.z); maxZ = Math.max(maxZ, p.z); }
      const sk = Math.min(mw / (maxX - minX), mh / (maxZ - minZ));
      const peta = (x, z) => [mx + (x - minX) * sk, my + (z - minZ) * sk];
      ctx.beginPath(); pts.forEach((p, i) => { const [a, b] = peta(p.x, p.z); i ? ctx.lineTo(a, b) : ctx.moveTo(a, b); }); ctx.closePath();
      ctx.strokeStyle = "#CFC5AD"; ctx.lineWidth = 3; ctx.stroke();
      for (const r of pembalap) { const [a, b] = peta(r.x, r.z); ctx.fillStyle = r.pemain ? "#F2C14E" : r.warna; ctx.fillRect(a - (r.pemain ? 3 : 2), b - (r.pemain ? 3 : 2), r.pemain ? 6 : 4, r.pemain ? 6 : 4); }
      // kecepatan & berkas emas
      teks(`${Math.round(pemain.v * 6)} km/j`, 12, H - 40, 13, "#FFFDF6", "left");
      teks(`berkas emas ${pemain.koin}/10`, 12, H - 20, 12, "#F2C14E", "left");
      // muatan drift
      if (pemain.drift) {
        const lv = levelMuatan(pemain.muatan);
        teks(["drift...", "MINI", "SUPER", "ULTRA"][lv], W / 2, H - 28, 16, ["#FFFDF6", "#7FC8F2", "#F2A14E", "#C38AF2"][lv]);
      }
      if (pemain.mundur > 40 && sim.fase === "balap") teks("ARAH TERBALIK", W / 2, H * 0.3, 20, "#B5443A");
      // lampu start
      if (sim.fase === "lampu") {
        ctx.fillStyle = "rgba(43,42,38,.85)"; ctx.fillRect(W / 2 - 78, H * 0.3 - 26, 156, 52);
        for (let i = 0; i < 3; i++) {
          ctx.beginPath(); ctx.arc(W / 2 - 46 + i * 46, H * 0.3, 18, 0, 7);
          ctx.fillStyle = sim.lampu >= i + 1 ? (i === 2 && sim.lampu >= 2.55 ? "#7FD18B" : "#E05A4E") : "#4A4744"; ctx.fill();
        }
        teks(sim.lampu < 2.55 ? "siap..." : "TAHAN DRIFT!", W / 2, H * 0.3 + 46, 14);
      }
      for (const k of kilatan) { ctx.globalAlpha = Math.min(1, 1.6 - k.umur); teks(k.teks, W / 2, H * 0.42 - k.umur * 20, 26, k.warna); ctx.globalAlpha = 1; }
      if (akhir) {
        const urut = urutan();
        ctx.fillStyle = "rgba(43,42,38,.85)"; ctx.fillRect(30, H * 0.48, W - 60, 6 * 22 + 20);
        urut.forEach((r, i) => teks(`${i + 1}. ${r.nama}`, 50, H * 0.48 + 20 + i * 22, 14, r.pemain ? "#F2C14E" : "#FFFDF6", "left"));
      }
    }
    return berhenti;
  }

  /* ---------- pilihan kendaraan & karakter di panel sebelum main ---------- */
  function htmlPilihan() {
    const p = pilihan();
    return `
      <div class="ap-bagian gp-pilih">
        <p class="ap-label">Kendaraan</p>
        <div class="gp-kendaraan">
          ${Object.entries(KENDARAAN).map(([id, k]) => `
            <button type="button" class="gp-kend${p.kendaraan === id ? " dipilih" : ""}" data-kendaraan="${id}">
              <strong>${esc(k.nama)}</strong><small>${esc(k.ket)}</small>
              ${["Kecepatan", "Akselerasi", "Belok"].map((n, i) => `<span class="gp-stat"><i>${n}</i><b>${"■".repeat(k.nilai[i])}${"□".repeat(5 - k.nilai[i])}</b></span>`).join("")}
            </button>`).join("")}
        </div>
        <p class="ap-label">Pembalap</p>
        <div class="gp-karakter">${KARAKTER.map((k) => `<button type="button" class="da-kar${p.karakter === k ? " dipilih" : ""}" data-pembalap="${k}" aria-label="${k}">${px(k)}</button>`).join("")}</div>
      </div>`;
  }
  function pasang(panel) {
    panel.querySelector(".gp-pilih")?.addEventListener("click", (e) => {
      const k = e.target.closest("[data-kendaraan]"), c = e.target.closest("[data-pembalap]");
      if (!k && !c) return;
      const s = (K.data.setelan.balap = { ...pilihan() });
      if (k) s.kendaraan = k.dataset.kendaraan;
      if (c) s.karakter = c.dataset.pembalap;
      K.simpan(); sfx("pilih");
      panel.querySelectorAll("[data-kendaraan]").forEach((b) => b.classList.toggle("dipilih", b.dataset.kendaraan === s.kendaraan));
      panel.querySelectorAll("[data-pembalap]").forEach((b) => b.classList.toggle("dipilih", b.dataset.pembalap === s.karakter));
    });
  }

  K.BALAP = { main, htmlPilihan, pasang, KENDARAAN, ITEM };
})();
