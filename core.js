/* =========================================================
   Kantor Layanan Perasaan · inti bersama
   - Penyimpanan (satu kunci localStorage, aman kalau gagal)
   - Poin Sabar, jejak kunjungan, pendengar kejadian
   - Mesin suara sintetis (WebAudio, tanpa file audio)
   ========================================================= */
window.KLP = window.KLP || {};

(() => {
  "use strict";
  const KLP = window.KLP;
  const KUNCI = "klp-v2";

  const AWAL = () => ({
    versi: 2,
    poin: 0,
    poinTotal: 0,
    skor: {},          // skor tertinggi per game
    mainGame: 0,
    jejak: {},         // hitungan kejadian: { loketA: 2, game:rally: 1, ... }
    gosip: [],         // id gosip yang sudah terbuka
    gosipDibaca: [],
    barang: {},        // koperasi: { id: jumlah }
    absen: null,       // { tgl, level } absen perasaan harian (gelas teh)
    setelan: { volume: 2, kaget: true, tanyaKaget: false },
    l13: { bab: 0, selesai: [], inv: [], flag: {}, mulai: null, bukaSemua: false, langka: [] },
  });

  function gabung(dasar, isi) {
    if (!isi || typeof isi !== "object") return dasar;
    for (const k of Object.keys(dasar)) {
      const d = dasar[k], v = isi[k];
      if (v === undefined) continue;
      if (d && typeof d === "object" && !Array.isArray(d)) dasar[k] = gabung(d, v);
      else if (Array.isArray(d)) dasar[k] = Array.isArray(v) ? v : d;
      else dasar[k] = typeof v === typeof d || d === null ? v : d;
    }
    return dasar;
  }

  let data = AWAL();
  let bisaSimpan = true;
  try {
    const mentah = localStorage.getItem(KUNCI);
    if (mentah) data = gabung(AWAL(), JSON.parse(mentah));
  } catch { bisaSimpan = false; }

  let timerSimpan, beku = false;
  function simpan() {
    if (beku) return;
    clearTimeout(timerSimpan);
    timerSimpan = setTimeout(() => {
      try { localStorage.setItem(KUNCI, JSON.stringify(data)); bisaSimpan = true; }
      catch { bisaSimpan = false; }
    }, 120);
  }
  addEventListener("pagehide", () => { if (beku) return; try { localStorage.setItem(KUNCI, JSON.stringify(data)); } catch { /* tetap jalan */ } });

  /* ---------- Kejadian ---------- */
  const pendengar = {};
  function on(nama, fn) { (pendengar[nama] ||= []).push(fn); }
  function emit(nama, info) {
    (pendengar[nama] || []).forEach((fn) => { try { fn(info); } catch (e) { console.error(e); } });
    (pendengar["*"] || []).forEach((fn) => { try { fn(nama, info); } catch (e) { console.error(e); } });
  }
  function catat(nama, info) {
    data.jejak[nama] = (data.jejak[nama] || 0) + 1;
    simpan();
    emit(nama, info);
  }
  const pernah = (nama) => (data.jejak[nama] || 0) > 0;

  function tambahPoin(n) {
    n = Math.max(0, Math.round(n));
    if (!n) return 0;
    data.poin += n;
    data.poinTotal += n;
    simpan();
    emit("poin", data.poin);
    return n;
  }
  function pakaiPoin(n) {
    if (data.poin < n) return false;
    data.poin -= n;
    simpan();
    emit("poin", data.poin);
    return true;
  }

  const hariIni = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  /* ---------- Suara ---------- */
  // 0 = Mode Perpustakaan (bisu), 4 = Volume Pengumuman Pak Singa (tetap tidak melengking)
  const GAIN = [0, 0.05, 0.1, 0.16, 0.22];
  let ctx = null, master = null;
  function audio() {
    if (ctx) return ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try {
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = GAIN[data.setelan.volume] ?? 0.1;
      // filter lembut supaya tidak ada nada tajam
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass"; lp.frequency.value = 3200;
      master.connect(lp); lp.connect(ctx.destination);
    } catch { ctx = null; }
    return ctx;
  }
  const bangunkan = () => { const c = audio(); if (c && c.state === "suspended") c.resume(); };
  addEventListener("pointerdown", bangunkan, { passive: true });
  addEventListener("keydown", bangunkan);

  function nada(frek, mulai, durasi, { tipe = "square", vol = 0.5, ke = null, attack = 0.005 } = {}) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = tipe;
    o.frequency.setValueAtTime(frek, mulai);
    if (ke) o.frequency.exponentialRampToValueAtTime(ke, mulai + durasi);
    g.gain.setValueAtTime(0.0001, mulai);
    g.gain.exponentialRampToValueAtTime(vol, mulai + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, mulai + durasi);
    o.connect(g); g.connect(master);
    o.start(mulai); o.stop(mulai + durasi + 0.02);
  }
  function desis(mulai, durasi, vol = 0.4, frek = 1200) {
    const n = Math.floor(ctx.sampleRate * durasi);
    const buf = ctx.createBuffer(1, n, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const src = ctx.createBufferSource(), g = ctx.createGain(), f = ctx.createBiquadFilter();
    f.type = "bandpass"; f.frequency.value = frek; f.Q.value = 0.8;
    g.gain.value = vol;
    src.buffer = buf; src.connect(f); f.connect(g); g.connect(master);
    src.start(mulai);
  }

  const RESEP = {
    klik: (t) => nada(660, t, 0.05, { tipe: "square", vol: 0.25 }),
    pilih: (t) => { nada(520, t, 0.06, { vol: 0.3 }); nada(780, t + 0.05, 0.07, { vol: 0.3 }); },
    stempel: (t) => { desis(t, 0.09, 0.7, 300); nada(110, t, 0.12, { tipe: "triangle", vol: 0.6, ke: 60 }); },
    tingtong: (t) => { nada(784, t, 0.5, { tipe: "triangle", vol: 0.5 }); nada(587, t + 0.32, 0.7, { tipe: "triangle", vol: 0.5 }); },
    lift: (t) => nada(1046, t, 0.6, { tipe: "sine", vol: 0.4 }),
    poin: (t) => [523, 659, 784, 1046].forEach((f, i) => nada(f, t + i * 0.06, 0.09, { vol: 0.28 })),
    salah: (t) => nada(220, t, 0.22, { tipe: "square", vol: 0.3, ke: 140 }),
    pukul: (t) => { desis(t, 0.06, 0.6, 2400); nada(400, t, 0.06, { tipe: "triangle", vol: 0.4, ke: 900 }); },
    kertas: (t) => desis(t, 0.12, 0.35, 3000),
    tuang: (t) => desis(t, 0.25, 0.25, 900),
    kaget: (t) => { nada(300, t, 0.32, { tipe: "triangle", vol: 0.55, ke: 900 }); nada(900, t + 0.3, 0.3, { tipe: "triangle", vol: 0.4, ke: 250 }); },
    boing: (t) => nada(180, t, 0.35, { tipe: "sine", vol: 0.6, ke: 520 }),
    meong: (t) => { nada(700, t, 0.12, { tipe: "triangle", vol: 0.35, ke: 950 }); nada(950, t + 0.12, 0.22, { tipe: "triangle", vol: 0.35, ke: 520 }); },
    menang: (t) => [523, 659, 784, 659, 1046].forEach((f, i) => nada(f, t + i * 0.1, 0.14, { vol: 0.3 })),
    radio: (t) => desis(t, 0.18, 0.25, 1800),
  };

  function sfx(nama) {
    if (!data.setelan.volume) return;
    const c = audio();
    if (!c || !RESEP[nama]) return;
    if (c.state === "suspended") c.resume();
    try { RESEP[nama](c.currentTime + 0.01); } catch { /* abaikan */ }
  }
  function aturVolume(v) {
    data.setelan.volume = Math.max(0, Math.min(4, v));
    simpan();
    if (master) master.gain.setTargetAtTime(GAIN[data.setelan.volume], ctx.currentTime, 0.05);
    emit("setelan", data.setelan);
  }

  Object.assign(KLP, {
    data, simpan, on, emit, catat, pernah, tambahPoin, pakaiPoin, hariIni, sfx, aturVolume,
    get bisaSimpan() { return bisaSimpan; },
    hapusSemua() {
      beku = true; clearTimeout(timerSimpan);
      try { localStorage.removeItem(KUNCI); localStorage.removeItem("klp-semangat"); } catch { /* tidak apa-apa */ }
    },
  });
})();
