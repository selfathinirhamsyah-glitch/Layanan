/* =========================================================
   Kantor Layanan Perasaan · Legenda Lantai 2
   MOBA 3 lawan 3 ala game hero arena: satu lane vertikal,
   menara & inti markas, gelombang minion, jungle + bos,
   gold, level, beli item, skill + ultimate, respawn, MVP.
   Hero = pegawai kantor. Logika di sini; tampilan 3D memakai
   ADEGAN.arena (games3d.js), cadangan 2D dari arena.js.
   ========================================================= */
(() => {
  "use strict";
  const K = window.KLP;
  const { sfx } = K;
  const A = () => K.ARENA;
  const acak = (a, b) => a + Math.random() * (b - a);
  const d2 = (a, b) => (a.x - b.x) ** 2 + (a.z - b.z) ** 2;
  const WARNA_TIM = { 1: "#3E78C4", 2: "#E05A4E", 0: "#C9A06A" };

  /* ---------- hero ---------- */
  const HERO = {
    badak: { nama: "Kak Badak", peran: "Tank", sprite: "badak", hp: 1300, atk: 52, jangkau: 2.4, laju: 6.1, cd: 1.0, tahan: 0.72,
      skill: [
        { nama: "Seruduk", cd: 8, jangkau: 7, ket: "Menyeruduk ke depan, lawan yang tertabrak pusing." },
        { nama: "Badan Kebal", cd: 12, jangkau: 0, ket: "Pelindung besar 3 detik." },
        { nama: "Izin Semangat", cd: 34, jangkau: 4.5, ket: "Hentakan besar: lawan di sekitar terlempar dan pusing." }],
      build: ["sepatu", "rompi", "jas", "kopi"] },
    kura: { nama: "Pak Satpam", peran: "Fighter", sprite: "kura", hp: 1080, atk: 68, jangkau: 2.4, laju: 6.4, cd: 0.95, tahan: 0.85,
      skill: [
        { nama: "Peluit", cd: 7, jangkau: 4.2, ket: "Tiupan peluit: kerusakan dan melambatkan lawan di depan." },
        { nama: "Putar Tempurung", cd: 10, jangkau: 3, ket: "Berputar 2 detik, melukai lawan di sekitar." },
        { nama: "Patroli Kilat", cd: 30, jangkau: 8, ket: "Tiga kali melesat menghantam lawan." }],
      build: ["sepatu", "stapler", "rompi", "pena"] },
    kukang: { nama: "Mas Kukang", peran: "Mage", sprite: "kukang", hp: 780, atk: 42, jangkau: 7, laju: 5.8, cd: 1.1, tahan: 1, jarakJauh: true,
      skill: [
        { nama: "Sinar Fotokopi", cd: 6, jangkau: 10, ket: "Sinar lurus yang menembus jauh." },
        { nama: "Kertas Berserakan", cd: 9, jangkau: 8, ket: "Hujan kertas di satu area, lawan melambat." },
        { nama: "Mode Lambat", cd: 32, jangkau: 8, ket: "Area besar: kerusakan besar, lawan melambat sekali." }],
      build: ["sepatu", "kopi", "pena", "jas"] },
    oyen: { nama: "Oyen", peran: "Assassin", sprite: "oyen", hp: 840, atk: 76, jangkau: 2.2, laju: 7.1, cd: 0.9, tahan: 0.95,
      skill: [
        { nama: "Terkam", cd: 6, jangkau: 7, ket: "Melompat ke lawan terdekat." },
        { nama: "Menatap Tembok", cd: 14, jangkau: 0, ket: "Tak terlihat 3 detik dan lebih cepat." },
        { nama: "Cakar Dasi", cd: 26, jangkau: 4, ket: "Serangan pamungkas, makin sakit kalau darah lawan tinggal sedikit." }],
      build: ["stapler", "sepatu", "pena", "kopi"] },
    marmut: { nama: "Dimas", peran: "Marksman", sprite: "marmut", hp: 740, atk: 62, jangkau: 8, laju: 6.0, cd: 0.72, tahan: 1, jarakJauh: true,
      skill: [
        { nama: "Lempar Map", cd: 7, jangkau: 10, ket: "Map terbang yang melambatkan lawan." },
        { nama: "Lari Panik", cd: 10, jangkau: 0, ket: "Melesat menjauh dan menyerang lebih cepat." },
        { nama: "Rentetan Berkas", cd: 30, jangkau: 9, ket: "Enam berkas beruntun ke lawan di sekitar." }],
      build: ["sepatu", "stapler", "pena", "kopi"] },
    kapibara: { nama: "Bu Ratna", peran: "Support", sprite: "kapibara", hp: 940, atk: 45, jangkau: 6, laju: 6.0, cd: 1.1, tahan: 0.9, jarakJauh: true,
      skill: [
        { nama: "Teh Hangat", cd: 8, jangkau: 7, ket: "Memulihkan teman yang paling terluka (atau diri sendiri)." },
        { nama: "Lempar Teko", cd: 10, jangkau: 9, ket: "Teko terbang membuat lawan pusing." },
        { nama: "Rehat Bersama", cd: 40, jangkau: 9, ket: "Semua teman di sekitar pulih dan terlindungi." }],
      build: ["sepatu", "rompi", "kopi", "jas"] },
  };
  const ITEM = {
    sepatu: { nama: "Sepatu Kantor", harga: 300, sprite: "kaus", laju: 0.12 },
    stapler: { nama: "Stapler Tajam", harga: 450, sprite: "penghapus", atk: 28 },
    rompi: { nama: "Rompi Map Tebal", harga: 500, sprite: "dokumen", hp: 350, tahan: 0.9 },
    kopi: { nama: "Kopi Pahit", harga: 600, sprite: "cangkir", cdr: 0.2 },
    pena: { nama: "Pena Emas", harga: 800, sprite: "kartu", atk: 40, kecepatan: 0.15 },
    jas: { nama: "Jas Hujan Ajaib", harga: 900, sprite: "payung", hp: 600, regen: 6 },
  };
  K.MOBA = { HERO, ITEM };

  /* ---------- peta ---------- */
  function buatPeta() {
    const R = [];
    const dinding = (x, z, w, d, warna = "#9AA2AA", h = 2.6) => R.push({ x, z, w, d, h, warna });
    // tepi
    dinding(0, -92, 56, 2); dinding(0, 92, 56, 2); dinding(-28, 0, 2, 186); dinding(28, 0, 2, 186);
    // dinding jungle (simetris)
    for (const s of [1, -1]) for (const t of [1, -1]) {
      dinding(s * 16, t * 18, 7, 3, "#B9B4AA"); dinding(s * 13.5, t * 48, 3, 9, "#B9B4AA"); dinding(s * 21, t * 70, 6, 3, "#B9B4AA");
      R.push({ x: s * 10.5, z: t * 30, w: 3.5, d: 7, h: 1.1, warna: "#5E8C6A", semak: true, tembus: true, rendah: true });
      R.push({ x: s * 10.5, z: t * 64, w: 3.5, d: 6, h: 1.1, warna: "#5E8C6A", semak: true, tembus: true, rendah: true });
      R.push({ x: s * 22, z: t * 38, w: 6, d: 4, h: 1.1, warna: "#5E8C6A", semak: true, tembus: true, rendah: true });
    }
    for (let k = 0; k < 10; k++) for (const s of [1, -1]) R.push({ x: s * acak(18, 25), z: acak(-86, 86), w: 1.4, d: 1.4, h: 4, pohon: true, warna: "#4F6E5E" });
    const dunia = {
      x0: -27, x1: 27, z0: -91, z1: 91, warnaTanah: "#9DB07A", warnaLuar: "#5E7D52", langit: "#BFD8E8", kabut: [55, 120],
      lantai: [
        { x: 0, z: 0, w: 15, d: 182, warna: "#C9B48E" },
        { x: 0, z: 84, w: 18, d: 14, warna: "#CFE0F5" }, { x: 0, z: -84, w: 18, d: 14, warna: "#F5D0CB" },
        { x: -17, z: 0, w: 9, d: 9, warna: "#8A7A63" },
      ],
      rintangan: R, lebarPandang: 20, kamera: { tinggi: 25, mundur: 14, maju: 3 },
      hiasan: [{ teks: "TIM BIRU", x: 0, z: 88, w: 8, h: 1.4, latar: "#3E78C4" }, { teks: "TIM MERAH", x: 0, z: -88, w: 8, h: 1.4, latar: "#E05A4E" }],
    };
    return dunia;
  }

  // putar dunia 180° (untuk tamu di tim merah) dan tukar warna markas
  function balikDunia(d, balik) {
    if (!balik) return d;
    const b = (o) => ({ ...o, x: -o.x, z: -o.z });
    const tukar = { "#CFE0F5": "#F5D0CB", "#F5D0CB": "#CFE0F5" };
    return {
      ...d, rintangan: d.rintangan.map(b), lantai: d.lantai.map((l) => ({ ...b(l), warna: tukar[l.warna] || l.warna })),
      hiasan: (d.hiasan || []).map((h) => ({ ...b(h), teks: h.teks === "TIM BIRU" ? "TIM MERAH" : h.teks === "TIM MERAH" ? "TIM BIRU" : h.teks, latar: h.latar === "#3E78C4" ? "#E05A4E" : h.latar === "#E05A4E" ? "#3E78C4" : h.latar })),
    };
  }

  /* =========================================================
     PERTANDINGAN
     ========================================================= */
  function mainOnline(api) {
    const on = K.ONLINE_SAMBUNG(api);
    if (on.host) return main(api, null, on);
    let dalam = null, batal = false;
    // kumpulkan semua "unit baru" sejak awal: snapshot bisa datang sebelum/di sela meta
    const baru = [];
    api.online.on("snap", (m) => { if (Array.isArray(m.s?.baru) && m.s.baru.length) baru.push(...m.s.baru); });
    const minta = setInterval(() => api.online.kirim({ t: "mintaMeta" }), 700);
    api.online.kirim({ t: "mintaMeta" });
    api.online.on("mobaMeta", (m) => { if (dalam || batal) return; clearInterval(minta); dalam = main(api, { ...m, _baru: baru }, on); api.ukurUlang?.(); });
    const tunggu = api.loop(() => { if (dalam) return; const c = api.ctx; c.fillStyle = "#5E7D52"; c.fillRect(0, 0, api.W(), api.H()); c.fillStyle = "#FFFDF6"; c.font = '16px "Pixelify Sans", monospace'; c.textAlign = "center"; c.fillText("Menunggu arena dari teman...", api.W() / 2, api.H() / 2); });
    return () => { batal = true; clearInterval(minta); tunggu(); dalam?.(); };
  }

  function main(api, meta = null, on = null) {
    if (api.online && !on) return mainOnline(api);
    const tamu = !!meta, hostOnline = !!(on && on.host);
    const modeLawan = (api.online?.opsi?.mode || "tim") === "lawan";
    const { ctx } = api;
    const AR = A();
    // tamu di tim lawan: dunia diputar 180° dan warna tim ditukar supaya markas sendiri tetap di bawah
    const balik = tamu && meta.balik;
    const dunia = tamu ? balikDunia(meta.dunia, balik) : buatPeta();
    const kotak = dunia.rintangan.filter((b) => !b.tembus && !b.pohon);
    const semak = dunia.rintangan.filter((b) => b.semak);
    const pilihan = K.data.setelan.moba && HERO[K.data.setelan.moba] ? K.data.setelan.moba : "kura";
    const kuatBot = { santai: 0.82, normal: 0.95, lembur: 1.08 }[api.tingkat] || 0.95;

    const unit = [], proyektil = [], efek = [], angka = [], tertunda = [];
    let nid = 0, waktu = 0, selesai = null, gelombang = 0, jedaGelombang = 4, umumSuper = false;
    const skorTim = { 1: 0, 2: 0 }, menaraJatuh = { 1: 0, 2: 0 };
    const umpan = AR.umpan(), umum = AR.pengumum();

    /* ---------- pembuat unit ---------- */
    function buatHero(id, tim, pemain) {
      const h = HERO[id];
      const u = {
        id: nid++, jenis: pemain ? "pemain" : "hero", hero: id, h, tim, pemain, nama: pemain ? api.nama : h.nama, sprite: h.sprite,
        x: 0, z: tim === 1 ? 84 : -84, r: 0.75, hpMaks: h.hp, hp: h.hp, atk: h.atk, jangkau: h.jangkau, laju: h.laju, cdDasar: h.cd,
        tahan: h.tahan, level: 1, xp: 0, gold: 300, item: [], cdSerang: 0, cdSkill: [0, 0, 0], slow: 0, slowSisa: 0, pusing: 0,
        perisai: 0, perisaiSisa: 0, gaib: 0, cepat: 0, mati: false, bangkit: 0, kill: 0, matiN: 0, assist: 0, beruntun: 0, pemukul: new Map(),
        regen: 0, cdr: 0, kecepatanSerang: 0, warna: WARNA_TIM[tim], skor: 0, kerusakan: 0, macet: 0, lx: 0, lz: 0, mundur: false,
      };
      u.x = (unit.filter((v) => v.tim === tim && v.h).length - 1) * 2.5;
      unit.push(u); return u;
    }
    function buatMenara(tim, z, jenis, hp, urut) {
      const u = { id: nid++, jenis, tim, x: 0, z, r: jenis === "inti" ? 2.4 : 1.5, hp, hpMaks: hp, atk: jenis === "inti" ? 160 : 150, jangkau: 8.5, cdSerang: 0, warna: WARNA_TIM[tim], urut, panas: 0, mati: false, bangunan: true };
      unit.push(u); return u;
    }
    function buatMinion(tim, jarakJauh, kuat = 1, lord = false) {
      const s = 1 + gelombang * 0.06;
      const u = {
        id: nid++, jenis: "minion", tim, minion: true, lord, x: (jarakJauh ? 0 : acak(-2, 2)), z: tim === 1 ? 76 : -76, r: lord ? 1.3 : 0.55,
        hp: (lord ? 2600 : jarakJauh ? 300 : 420) * s * kuat, atk: (lord ? 110 : jarakJauh ? 32 : 26) * s * kuat, jangkau: jarakJauh ? 6 : lord ? 2.6 : 1.8,
        laju: lord ? 4.6 : 4.2, cdDasar: jarakJauh ? 1.3 : 1.1, cdSerang: 0, sprite: lord ? "kopi" : jarakJauh ? "tinta" : "dokumen", skala: lord ? 1.2 : 0.9,
        warna: WARNA_TIM[tim], jarakJauh, slow: 0, slowSisa: 0, pusing: 0, mati: false, tahan: 1, pemukul: new Map(),
      };
      u.hpMaks = u.hp; unit.push(u); return u;
    }
    function buatMonster(x, z, bos) {
      const u = {
        id: nid++, jenis: "monster", tim: 0, monster: true, bos, x, z, x0: x, z0: z, r: bos ? 1.8 : 0.9, hp: bos ? 3800 : 900, atk: bos ? 120 : 40,
        jangkau: bos ? 3.4 : 2, laju: 4, cdDasar: 1.4, cdSerang: 0, sprite: bos ? "kopi" : "tinta", skala: bos ? 1.6 : 1, warna: WARNA_TIM[0],
        slow: 0, slowSisa: 0, pusing: 0, mati: false, tahan: bos ? 0.8 : 1, pemukul: new Map(), bangkit: 0, nama: bos ? "Mesin Fotokopi Purba" : "Printer Liar",
      };
      u.hpMaks = u.hp; unit.push(u); return u;
    }

    // tim: pemain + 2 teman bot vs 3 bot
    let pemain, teman = null;
    if (tamu) { pemain = { h: HERO[meta.hero], hero: meta.hero, pemain: true, cdSkill: [0, 0, 0], item: [], gold: 0, level: 1, kill: 0, matiN: 0, assist: 0, bangkit: 0, x: 0, z: 85, mati: false }; }
    else {
      const heroTeman = hostOnline && HERO[api.online.teman?.hero] && api.online.teman.hero !== pilihan ? api.online.teman.hero : null;
      const sisa = Object.keys(HERO).filter((k) => k !== pilihan && k !== heroTeman).sort(() => Math.random() - 0.5);
      pemain = buatHero(pilihan, 1, true);
      if (hostOnline) {
        const ht = heroTeman || sisa.shift();
        if (modeLawan) { buatHero(sisa[0], 1, false); buatHero(sisa[1], 1, false); teman = buatHero(ht, 2, false); buatHero(sisa[2], 2, false); buatHero(sisa[3], 2, false); }
        else { teman = buatHero(ht, 1, false); buatHero(sisa[0], 1, false); buatHero(sisa[1], 2, false); buatHero(sisa[2], 2, false); buatHero(sisa[3], 2, false); }
        teman.remote = true; teman.nama = api.online.teman?.nama || "Teman"; teman.pulangSisa = 0;
      } else { buatHero(sisa[0], 1, false); buatHero(sisa[1], 1, false); buatHero(sisa[2], 2, false); buatHero(sisa[3], 2, false); buatHero(sisa[4], 2, false); }
    }
    if (!tamu) for (const t of [1, 2]) { const s = t === 1 ? 1 : -1; buatMenara(t, s * 40, "menara", 1800, 0); buatMenara(t, s * 62, "menara", 2100, 1); buatMenara(t, s * 80, "inti", 2700, 2); }
    if (!tamu) { for (const s of [1, -1]) { buatMonster(18, s * 28, false); buatMonster(-19, s * 56, false); } buatMonster(-17, 0, true); }

    /* ---------- kendali ---------- */
    const h = tamu ? HERO[meta.hero] : HERO[pilihan];
    const IKON = { badak: ["badak", "tempurung", "stiker"], kura: ["peluit", "tempurung", "senter"], kukang: ["tinta", "dokumen", "jam"], oyen: ["oyen", "kaus", "kunci"], marmut: ["berkas", "kaus", "dokumen"], kapibara: ["cangkir", "toples", "bantal"] }[tamu ? meta.hero : pilihan];
    const kend = AR.kendali(api, [
      { id: "serang", dx: 58, dy: 66, r: 36, label: "SERANG", ikon: h.sprite, warna: "#F2C14E" },
      { id: "s1", dx: 128, dy: 44, r: 24, label: h.skill[0].nama.split(" ")[0], ikon: IKON[0] },
      { id: "s2", dx: 122, dy: 112, r: 24, label: h.skill[1].nama.split(" ")[0], ikon: IKON[1] },
      { id: "ult", dx: 60, dy: 146, r: 27, label: "ULT", ikon: IKON[2], warna: "#C38AF2" },
    ]);
    kend.cdMaks = { s1: h.skill[0].cd, s2: h.skill[1].cd, ult: h.skill[2].cd };
    api.kontrol.innerHTML = `<div class="moba-bar"><button type="button" class="moba-btn" data-m="beli"></button><button type="button" class="moba-btn" data-m="pulang">Pulang ke markas</button><button type="button" class="moba-btn kecil" data-m="info">${h.nama} · ${h.peran}</button></div>`;
    const tombolBeli = api.kontrol.querySelector('[data-m="beli"]');
    let pulang = 0;
    const klikBar = (e) => {
      const b = e.target.closest("[data-m]");
      if (!b) return;
      if (tamu && b.dataset.m !== "info") { on.ev({ a: b.dataset.m }); sfx("pilih"); return; }
      if (b.dataset.m === "beli") beli(pemain, true);
      else if (b.dataset.m === "pulang" && !pemain.mati) { pulang = 3; sfx("pilih"); }
      else if (b.dataset.m === "info") umum.umumkan(h.nama, h.skill.map((s) => s.nama).join(" · "), "#FFFDF6");
    };
    api.kontrol.addEventListener("click", klikBar);

    /* ---------- statistik efektif ---------- */
    const lajuEfektif = (u) => u.laju * (1 - (u.slowSisa > 0 ? u.slow : 0)) * (1 + (u.cepat > 0 ? 0.3 : 0) + (u.bonusLaju || 0));
    const musuh = (a, b) => b.tim !== a.tim && !b.mati;
    function terdekat(u, jarak, saring = () => true) {
      let t = null, m = jarak * jarak;
      for (const v of unit) {
        if (!musuh(u, v) || !saring(v)) continue;
        if (v.gaib > 0 && v.tim !== u.tim) continue;
        if (v.h && v.tim !== u.tim && AR.diSemak(v, semak) && !semak.some((s) => Math.abs(u.x - s.x) < s.w / 2 + 2 && Math.abs(u.z - s.z) < s.d / 2 + 2) && d2(u, v) > 9) continue;
        const dd = d2(u, v) - (v.r || 0) ** 2;
        if (dd < m) { m = dd; t = v; }
      }
      return t;
    }
    const lindung = (v) => !v.bangunan || bisaDiserang(v);
    function bisaDiserang(b) { // menara harus dijatuhkan berurutan
      if (!b.bangunan) return true;
      return !unit.some((o) => o.bangunan && o.tim === b.tim && !o.mati && o.urut < b.urut);
    }

    /* ---------- kerusakan & kematian ---------- */
    function pukul(src, t, dmg, opsi = {}) {
      if (!t || t.mati) return;
      if (t.bangunan && !bisaDiserang(t)) return;
      if (t.tim === 0 && src.tim) t.marah = src;
      let n = dmg * (t.tahan || 1) * (src.h ? 0.9 + src.level * 0.07 : 1);
      if (t.bangunan && src.minion) n *= 1.5;
      if (t.bangunan && src.h) n *= 2;
      if (t.perisaiSisa > 0 && t.perisai > 0) { const serap = Math.min(t.perisai, n); t.perisai -= serap; n -= serap; }
      t.hp -= n;
      if (src.h) { src.kerusakan += n; t.pemukul?.set(src.id, waktu); }
      if (src.gaib > 0) src.gaib = 0;
      if (opsi.slow) { t.slow = opsi.slow; t.slowSisa = opsi.lama || 2; }
      if (opsi.pusing && !t.bangunan) t.pusing = Math.max(t.pusing || 0, opsi.pusing);
      if (n > 0 && (t.pemain || src.pemain || t.h)) angka.push({ x: t.x + acak(-0.4, 0.4), z: t.z, teks: Math.round(n), warna: t.pemain ? "#FF8A7A" : src.pemain ? "#FFE08A" : "#FFFDF6", umur: 0 });
      if (t.hp <= 0) tewas(t, src);
    }
    function sembuh(t, n) { if (t.mati) return; t.hp = Math.min(t.hpMaks, t.hp + n); angka.push({ x: t.x, z: t.z, teks: `+${Math.round(n)}`, warna: "#7FD18B", umur: 0 }); }
    function beriGold(u, g, xp) { if (!u.h) return; u.gold += g; u.xp += xp; while (u.level < 10 && u.xp >= 120 + u.level * 90) { u.xp -= 120 + u.level * 90; naikLevel(u); } }
    function naikLevel(u) {
      u.level++; const r = u.hp / u.hpMaks;
      u.hpMaks = Math.round(u.h.hp * (1 + (u.level - 1) * 0.09) + itemJumlah(u, "hp")); u.hp = u.hpMaks * r;
      u.atk = u.h.atk * (1 + (u.level - 1) * 0.07) + itemJumlah(u, "atk");
      if (u.pemain) { sfx("poin"); umpan.tambah(`Naik ke level ${u.level}`, "#F2C14E"); }
      if (u.remote) kabar({ k: "umpan", t: `Naik ke level ${u.level}`, w: "#F2C14E", b: "poin" });
    }
    const itemJumlah = (u, k) => u.item.reduce((a, id) => a + (ITEM[id][k] || 0), 0);
    const KATA_BERUNTUN = { 2: "DOUBLE KILL!", 3: "TRIPLE KILL!", 4: "TAK TERHENTIKAN!", 5: "LEGENDARIS!" };
    let takedownPertama = false;
    function tewas(t, src) {
      t.mati = true; t.hp = 0;
      if (t.h) {
        t.matiN++; t.beruntun = 0; t.bangkit = 5 + t.level * 1.6; t.perisai = 0; t.gaib = 0;
        const pembunuh = src.h ? src : [...t.pemukul.entries()].filter(([, w]) => waktu - w < 8).map(([id]) => unit.find((v) => v.id === id)).find(Boolean);
        if (pembunuh && pembunuh.h) {
          pembunuh.kill++; pembunuh.beruntun++; skorTim[pembunuh.tim]++;
          beriGold(pembunuh, 220 + t.level * 15, 160 + t.level * 20);
          for (const [id, w] of t.pemukul) { const a = unit.find((v) => v.id === id); if (a && a !== pembunuh && a.tim === pembunuh.tim && waktu - w < 10) { a.assist++; beriGold(a, 90, 80); } }
          umpan.tambah(`${pembunuh.nama} ➜ ${t.nama}`, WARNA_TIM[pembunuh.tim]);
          kabar({ k: "umpan", t: `${pembunuh.nama} ➜ ${t.nama}`, tim: pembunuh.tim });
          if (pembunuh.pemain || pembunuh.remote) { if (pembunuh.pemain) { K.WOW?.getar(1, 0.25); K.WOW?.hp(50); K.WOW?.kilat("rgba(242,193,78,.3)"); } else kabar({ k: "wow", jenis: "kill" }); }
          if (!takedownPertama) { takedownPertama = true; umum.umumkan("TAKEDOWN PERTAMA!", `${pembunuh.nama} membuka skor`, WARNA_TIM[pembunuh.tim]); kabar({ k: "umum", a: "TAKEDOWN PERTAMA!", b: `${pembunuh.nama} membuka skor`, tim: pembunuh.tim }); }
          else if (KATA_BERUNTUN[Math.min(5, pembunuh.beruntun)] && (pembunuh.pemain || pembunuh.remote || pembunuh.beruntun >= 3)) { umum.umumkan(KATA_BERUNTUN[Math.min(5, pembunuh.beruntun)], pembunuh.nama, WARNA_TIM[pembunuh.tim]); kabar({ k: "umum", a: KATA_BERUNTUN[Math.min(5, pembunuh.beruntun)], b: pembunuh.nama, tim: pembunuh.tim }); }
          if (pembunuh.pemain) sfx("menang");
        }
        t.pemukul.clear();
        if (t.pemain) { sfx("salah"); umum.umumkan("Kamu tumbang", "Duduk sebentar di markas. Teh sudah disiapkan.", "#FF8A7A"); pulang = 0; K.WOW?.getar(1.6, 0.4); K.WOW?.hp(150); K.WOW?.kilat("rgba(181,68,58,.45)", 400); }
        if (t.remote) { t.pulangSisa = 0; kabar({ k: "tumbang" }); }
        efek.push({ x: t.x, z: t.z, r: 3, warna: "#FFFDF6", umur: 0, maks: 0.6 });
      } else if (t.bangunan) {
        menaraJatuh[t.tim]++;
        unit.filter((v) => v.h && v.tim !== t.tim).forEach((v) => beriGold(v, 250, 120));
        umpan.tambah(`Menara ${t.tim === 1 ? "biru" : "merah"} runtuh`, WARNA_TIM[t.tim === 1 ? 2 : 1]);
        kabar({ k: "menara", tim: t.tim, inti: t.jenis === "inti" });
        if (t.tim === 2) { K.WOW?.getar(1.2, 0.35); K.WOW?.hp(80); }
        efek.push({ x: t.x, z: t.z, r: 6, warna: "#F2C14E", umur: 0, maks: 1 });
        sfx("kaget");
        if (t.jenis === "inti") akhiri(t.tim === 1 ? 2 : 1);
        else umum.umumkan(t.tim === 1 ? "MENARA KITA RUNTUH" : "MENARA LAWAN RUNTUH", "", t.tim === 1 ? "#FF8A7A" : "#7FD18B");
      } else if (t.monster) {
        t.bangkit = t.bos ? 90 : 40;
        if (src.h || src.tim) {
          const tim = src.tim;
          unit.filter((v) => v.h && v.tim === tim && d2(v, t) < 300).forEach((v) => beriGold(v, t.bos ? 220 : 70, t.bos ? 200 : 70));
          if (t.bos) { umum.umumkan("MESIN FOTOKOPI PURBA DIKALAHKAN", `Tim ${tim === 1 ? "biru" : "merah"} dapat Fotokopi Raksasa`, WARNA_TIM[tim]); kabar({ k: "bos", tim }); buatMinion(tim, false, 1, true); }
        }
      } else if (t.minion) {
        const dekat = unit.filter((v) => v.h && v.tim !== t.tim && !v.mati && d2(v, t) < 110);
        if (src.h) beriGold(src, 34, 45);
        dekat.forEach((v) => { if (v !== src) beriGold(v, 12, 45); });
      }
    }

    /* ---------- skill ---------- */
    function arahKe(u, t) { const dx = t.x - u.x, dz = t.z - u.z, l = Math.hypot(dx, dz) || 1; return { x: dx / l, z: dz / l }; }
    function arahHadap(u) { return { x: Math.cos(u.hadap || -Math.PI / 2), z: Math.sin(u.hadap || -Math.PI / 2) }; }
    function areaRusak(src, x, z, r, dmg, opsi) { for (const v of unit) if (musuh(src, v) && (v.x - x) ** 2 + (v.z - z) ** 2 < (r + (v.r || 0)) ** 2) pukul(src, v, dmg, opsi); efek.push({ x, z, r, warna: opsi?.warna || "#F2C14E", umur: 0, maks: 0.5 }); }
    function tembak(src, opsi) { proyektil.push({ x: src.x, z: src.z, y: 1.1, dari: src, ...opsi, tempuh: 0 }); }
    function pakaiSkill(u, i) {
      if (u.mati || u.pusing > 0 || u.cdSkill[i] > 0) return false;
      const s = u.h.skill[i], L = u.level;
      const sasaran = s.jangkau ? (terdekat(u, s.jangkau + 1, (v) => v.h) || terdekat(u, s.jangkau + 1, lindung)) : null;
      const arah = sasaran ? arahKe(u, sasaran) : arahHadap(u);
      const kunci = `${u.hero}:${i}`;
      switch (kunci) {
        case "badak:0": u.dash = { x: arah.x, z: arah.z, sisa: 0.35, laju: 22, kena: new Set(), dmg: 80 + L * 9, pusing: 0.8 }; break;
        case "badak:1": u.perisai = 260 + L * 30; u.perisaiSisa = 3; efek.push({ x: u.x, z: u.z, r: 2, warna: "#7FC8F2", umur: 0, maks: 0.6 }); break;
        case "badak:2": areaRusak(u, u.x, u.z, 4.5, 170 + L * 16, { pusing: 1.2, warna: "#C38AF2" }); break;
        case "kura:0": areaRusak(u, u.x + arah.x * 2.2, u.z + arah.z * 2.2, 2.8, 95 + L * 9, { slow: 0.4, lama: 2 }); break;
        case "kura:1": for (let k = 0; k < 4; k++) tertunda.push({ t: waktu + k * 0.5, fn: () => !u.mati && areaRusak(u, u.x, u.z, 3, 42 + L * 4, { warna: "#7FB2D9" }) }); break;
        case "kura:2": if (!sasaran) return false; for (let k = 0; k < 3; k++) tertunda.push({ t: waktu + k * 0.28, fn: () => { if (u.mati || sasaran.mati) return; const a = arahKe(sasaran, u); u.x = sasaran.x + a.x * 1.3; u.z = sasaran.z + a.z * 1.3; pukul(u, sasaran, 120 + L * 10); efek.push({ x: sasaran.x, z: sasaran.z, r: 1.6, warna: "#F2C14E", umur: 0, maks: 0.3 }); } }); break;
        case "kukang:0": tembak(u, { vx: arah.x, vz: arah.z, laju: 26, jarak: 11, dmg: 150 + L * 16, tembus: true, warna: "#7FC8F2", r: 0.45, kenaSet: new Set() }); break;
        case "kukang:1": { const tx = sasaran ? sasaran.x : u.x + arah.x * 5, tz = sasaran ? sasaran.z : u.z + arah.z * 5; efek.push({ x: tx, z: tz, r: 3.5, warna: "#FFFDF6", umur: 0, maks: 0.6 }); tertunda.push({ t: waktu + 0.6, fn: () => areaRusak(u, tx, tz, 3.5, 125 + L * 12, { slow: 0.5, lama: 2 }) }); break; }
        case "kukang:2": { const tx = sasaran ? sasaran.x : u.x + arah.x * 5, tz = sasaran ? sasaran.z : u.z + arah.z * 5; efek.push({ x: tx, z: tz, r: 6, warna: "#C38AF2", umur: 0, maks: 1 }); tertunda.push({ t: waktu + 0.8, fn: () => areaRusak(u, tx, tz, 6, 300 + L * 26, { slow: 0.7, lama: 3, warna: "#C38AF2" }) }); break; }
        case "oyen:0": if (!sasaran) return false; { const a = arahKe(sasaran, u); u.x = sasaran.x + a.x * 1.2; u.z = sasaran.z + a.z * 1.2; pukul(u, sasaran, 110 + L * 11); } break;
        case "oyen:1": u.gaib = 3; u.cepat = 3; break;
        case "oyen:2": if (!sasaran) return false; pukul(u, sasaran, 220 + L * 18 + (sasaran.hpMaks - sasaran.hp) * 0.3); efek.push({ x: sasaran.x, z: sasaran.z, r: 2, warna: "#C38AF2", umur: 0, maks: 0.5 }); break;
        case "marmut:0": tembak(u, { vx: arah.x, vz: arah.z, laju: 22, jarak: 11, dmg: 120 + L * 12, slow: 0.3, warna: "#E0B84A", r: 0.4 }); break;
        case "marmut:1": { const ancam = terdekat(u, 8, (v) => v.h); const a = ancam ? arahKe(ancam, u) : arahHadap(u); u.dash = { x: a.x, z: a.z, sisa: 0.22, laju: 22, kena: null }; u.cepat = 3; break; }
        case "marmut:2": for (let k = 0; k < 6; k++) tertunda.push({ t: waktu + k * 0.2, fn: () => { if (u.mati) return; const t2 = terdekat(u, 9.5, (v) => v.h) || terdekat(u, 9.5, lindung); if (t2) tembak(u, { target: t2, laju: 28, dmg: 70 + L * 7, warna: "#F2C14E", r: 0.32 }); } }); break;
        case "kapibara:0": { const teman = unit.filter((v) => v.h && v.tim === u.tim && !v.mati && d2(v, u) < 50).sort((a, b) => a.hp / a.hpMaks - b.hp / b.hpMaks)[0] || u; sembuh(teman, 160 + L * 14); efek.push({ x: teman.x, z: teman.z, r: 1.8, warna: "#7FD18B", umur: 0, maks: 0.6 }); break; }
        case "kapibara:1": tembak(u, { vx: arah.x, vz: arah.z, laju: 20, jarak: 10, dmg: 90 + L * 9, pusing: 1, warna: "#B9B4AA", r: 0.45 }); break;
        case "kapibara:2": unit.filter((v) => v.h && v.tim === u.tim && !v.mati && d2(v, u) < 81).forEach((v) => { sembuh(v, 250 + L * 15); v.perisai = 150 + L * 10; v.perisaiSisa = 3; }); efek.push({ x: u.x, z: u.z, r: 9, warna: "#7FD18B", umur: 0, maks: 0.8 }); break;
        default: return false;
      }
      u.cdSkill[i] = s.cd * (1 - u.cdr);
      if (u.pemain) sfx(i === 2 ? "tingtong" : "pilih");
      if (sasaran) u.hadap = Math.atan2(sasaran.z - u.z, sasaran.x - u.x);
      return true;
    }
    function serangDasar(u, t) {
      if (u.cdSerang > 0 || !t || u.pusing > 0) return false;
      u.cdSerang = u.cdDasar / (1 + (u.kecepatanSerang || 0) + (u.cepat > 0 && u.hero === "marmut" ? 0.4 : 0));
      u.hadap = Math.atan2(t.z - u.z, t.x - u.x);
      if (u.jarakJauh || u.h?.jarakJauh) tembak(u, { target: t, laju: 24, dmg: u.atk, warna: u.minion ? WARNA_TIM[u.tim] : "#FFFDF6", r: 0.25 });
      else { pukul(u, t, u.atk); u.lompat = 0.18; }
      if (u.pemain) sfx("pukul");
      return true;
    }
    function beli(u, dariPemain) {
      const id = u.h.build.find((k) => !u.item.includes(k));
      if (!id) return;
      const it = ITEM[id];
      if (u.gold < it.harga) { if (dariPemain) sfx("salah"); return; }
      u.gold -= it.harga; u.item.push(id);
      if (it.hp) { u.hpMaks += it.hp; u.hp += it.hp; }
      if (it.atk) u.atk += it.atk;
      if (it.tahan) u.tahan *= it.tahan;
      if (it.laju) u.bonusLaju = (u.bonusLaju || 0) + it.laju;
      if (it.cdr) u.cdr += it.cdr;
      if (it.kecepatan) u.kecepatanSerang += it.kecepatan;
      if (it.regen) u.regen += it.regen;
      if (dariPemain) { sfx("poin"); umpan.tambah(`Membeli ${it.nama}`, "#F2C14E"); }
    }

    /* ---------- otak bot hero ---------- */
    const MARKAS = { 1: { x: 0, z: 85 }, 2: { x: 0, z: -85 } };
    function otakHero(u, dt) {
      if (u.gold >= 300) beli(u, false);
      const markas = MARKAS[u.tim], arahLawan = u.tim === 1 ? -1 : 1;
      if (u.hp / u.hpMaks < 0.28) u.mundur = true;
      if (u.mundur) { if (u.hp / u.hpMaks > 0.9) u.mundur = false; else { const ancam = terdekat(u, 4, (v) => v.h); if (ancam && u.cdSerang <= 0) serangDasar(u, ancam); return markas; } }
      const lawan = terdekat(u, 9, (v) => v.h);
      if (lawan) {
        // pakai skill bila lawan dalam jangkau
        for (let i = 2; i >= 0; i--) {
          const s = u.h.skill[i];
          if (u.cdSkill[i] > 0) continue;
          if (u.hero === "kapibara" && i === 0) { const teman = unit.find((v) => v.h && v.tim === u.tim && !v.mati && v.hp / v.hpMaks < 0.6 && d2(v, u) < 50); if (teman && Math.random() < dt * 3) pakaiSkill(u, 0); continue; }
          if (s.jangkau === 0) { if (Math.random() < dt * 1.5) pakaiSkill(u, i); continue; }
          if (d2(u, lawan) < (s.jangkau + 0.5) ** 2 && Math.random() < dt * (i === 2 ? 1.2 : 2.5) * kuatBot) pakaiSkill(u, i);
        }
        const jarak = Math.sqrt(d2(u, lawan));
        // jangan masuk jangkauan menara lawan sendirian
        const menaraLawan = unit.find((v) => v.bangunan && v.tim !== u.tim && !v.mati && d2(v, lawan) < 72);
        const temanMinion = unit.filter((v) => v.minion && v.tim === u.tim && !v.mati && menaraLawan && d2(v, menaraLawan) < 72).length;
        if (menaraLawan && temanMinion === 0 && lawan.hp / lawan.hpMaks > 0.25) return { x: u.x, z: menaraLawan.z - arahLawan * 11 };
        if (jarak <= u.jangkau + lawan.r + 0.2) { serangDasar(u, lawan); return null; }
        return lawan;
      }
      // ambil bos/monster kalau dekat dan aman
      const monster = unit.find((v) => v.monster && !v.mati && d2(v, u) < 81);
      if (monster && (monster.marah === u || !monster.bos || waktu > 150)) {
        if (Math.sqrt(d2(u, monster)) <= u.jangkau + monster.r + 0.2) { serangDasar(u, monster); return null; }
        return monster;
      }
      // tidak ada lawan terlihat: dorong menara lawan bila darah cukup
      const menaraIncar = unit.filter((v) => v.bangunan && v.tim !== u.tim && !v.mati && bisaDiserang(v)).sort((a, b) => d2(a, u) - d2(b, u))[0];
      const lawanHidup = unit.filter((v) => v.h && v.tim !== u.tim && !v.mati).length, kawanHidup = unit.filter((v) => v.h && v.tim === u.tim && !v.mati).length;
      if (menaraIncar && u.hp / u.hpMaks > 0.5 && (lawanHidup < kawanHidup || unit.some((v) => v.minion && v.tim === u.tim && !v.mati && d2(v, menaraIncar) < 90))) {
        if (Math.sqrt(d2(u, menaraIncar)) <= u.jangkau + menaraIncar.r + 0.3) { serangDasar(u, menaraIncar); return null; }
        return menaraIncar;
      }
      // dorong lane: berdiri di belakang minion terdepan
      const minionKita = unit.filter((v) => v.minion && v.tim === u.tim && !v.mati);
      const target = terdekat(u, u.jangkau + 1.2, lindung);
      if (target) { serangDasar(u, target); return null; }
      let depan = null;
      for (const m of minionKita) if (!depan || m.z * arahLawan > depan.z * arahLawan) depan = m;
      if (depan) return { x: depan.x + (u.id % 3 - 1) * 1.8, z: depan.z - arahLawan * (u.h.jarakJauh ? 4 : 2) };
      const menaraKita = unit.filter((v) => v.bangunan && v.tim === u.tim && !v.mati).sort((a, b) => a.urut - b.urut)[0];
      return menaraKita ? { x: (u.id % 3 - 1) * 2, z: menaraKita.z + arahLawan * 4 } : markas;
    }

    /* ---------- gerak unit ---------- */
    function gerakKe(u, tujuan, dt, berhentiJarak = 0.2) {
      if (!tujuan) return;
      const dx = tujuan.x - u.x, dz = tujuan.z - u.z, l = Math.hypot(dx, dz);
      if (l < berhentiJarak) return;
      const v = lajuEfektif(u) * dt;
      u.x += (dx / l) * Math.min(v, l); u.z += (dz / l) * Math.min(v, l);
      u.hadap = Math.atan2(dz, dx);
    }
    function lepasMacet(u, dt) {
      const pindah = Math.hypot(u.x - u.lx, u.z - u.lz);
      u.macet = pindah < lajuEfektif(u) * dt * 0.25 ? (u.macet || 0) + dt : 0;
      if (u.macet > 0.4) { u.x += (u.id % 2 ? 1 : -1) * 0.25; u.macet = 0; }
      u.lx = u.x; u.lz = u.z;
    }

    /* ---------- akhir ---------- */
    function akhiri(pemenang, alasan = "inti") {
      if (selesai) return;
      const menang = pemenang === 1;
      selesai = { pemenang, sisa: 4 };
      sfx(menang ? "menang" : "salah");
      if (menang) K.konfetiKertas?.(1.4);
      const semua = unit.filter((v) => v.h);
      semua.forEach((v) => { v.skor = v.kill * 3 + v.assist * 1.5 - v.matiN * 1 + v.kerusakan / 900 + (v.tim === pemenang ? 2 : 0); });
      selesai.mvp = semua.slice().sort((a, b) => b.skor - a.skor)[0];
      selesai.alasan = alasan;
      const sebab = alasan === "waktu" ? (menang ? "Waktu habis, menara kita lebih banyak bertahan" : "Waktu habis, lawan unggul") : menang ? "Inti markas lawan runtuh" : "Inti markas kita runtuh";
      umum.umumkan(menang ? "KEMENANGAN" : "KEKALAHAN", sebab, menang ? "#7FD18B" : "#FF8A7A");
      if (menang) { K.WOW?.hujan(); K.WOW?.hp(200); }
      if (hostOnline) api.online.kirim({ t: "akhir", pemenang, alasan, mvp: selesai.mvp.id, hero: unit.filter((v) => v.h).map((v) => ({ id: v.id, nama: v.nama, tim: v.tim, k: v.kill, m: v.matiN, a: v.assist, skor: v.skor })), teman: { kill: teman.kill, mati: teman.matiN, assist: teman.assist }, menara: menaraJatuh });
    }
    function kirimHasil() {
      const menang = selesai.pemenang === 1, mvp = selesai.mvp === pemain;
      const skor = (menang ? 160 : 60) + pemain.kill * 12 + pemain.assist * 6 + menaraJatuh[2] * 8 + (mvp ? 25 : 0);
      api.catatStat("menang", menang ? 1 : 0); api.catatStat("kill", pemain.kill); api.catatStat("mvp", mvp ? 1 : 0);
      api.selesai(skor, [menang ? "badak" : "kapibara", `${menang ? "KEMENANGAN" : "Kalah tipis"} · KDA ${pemain.kill}/${pemain.matiN}/${pemain.assist}${mvp ? " · MVP" : ""}. ${menang ? (selesai.alasan === "waktu" ? "Kak Badak: Menang angka. Menara kita lebih tahan banting." : "Kak Badak: Inti markas lawan runtuh. Saya mengizinkan semangat sebanyak-banyaknya.") : "Bu Ratna: Kalah itu bagian dari main. Tehnya masih hangat, mau ronde lagi?"}`], api.online ? { menang, judul: `${menang ? "KEMENANGAN" : "KEKALAHAN"}${modeLawan ? " lawan teman" : " bareng teman"}` } : undefined);
    }

    /* ---------- berdua online ---------- */
    function kabar(m) { if (hostOnline) api.online.kirim({ t: "fx", ...m }); }
    const r2 = (v) => Math.round(v * 100) / 100;
    const terkirim = new Set();
    if (hostOnline) api.online.on("mintaMeta", () => { terkirim.clear(); api.online.kirim({ t: "mobaMeta", dunia, balik: modeLawan, hero: teman.hero, id: teman.id }); });
    function buatSnap() {
      const baru = [];
      for (const u of unit) if (!terkirim.has(u.id)) { terkirim.add(u.id); baru.push({ id: u.id, jenis: u.jenis === "pemain" ? "hero" : u.jenis, tim: u.tim, sprite: u.sprite, nama: u.nama, r: u.r, skala: u.skala, hero: u.hero, bangunan: !!u.bangunan, monster: !!u.monster, bos: !!u.bos, minion: !!u.minion, urut: u.urut }); }
      return {
        baru, w: r2(waktu), skor: skorTim,
        u: unit.map((u) => [u.id, r2(u.x), r2(u.z), Math.round(u.hp), Math.round(u.hpMaks), u.mati ? 1 : 0, u.level || 0, u.perisaiSisa > 0 ? Math.round(u.perisai) : 0, u.gaib > 0 ? 1 : 0, u.pusing > 0 ? 1 : 0, u.lompat > 0 ? 1 : 0]),
        p: proyektil.map((q) => [r2(q.x), r2(q.z), q.warna, q.r || 0.25, q.y ?? 1]),
        e: efek.map((ef) => [r2(ef.x), r2(ef.z), ef.r, ef.warna, r2(ef.umur), ef.maks]),
        me: { gold: Math.floor(teman.gold), level: teman.level, cd: teman.cdSkill.map(r2), kill: teman.kill, mati: teman.matiN, assist: teman.assist, bangkit: r2(teman.bangkit || 0), pulang: r2(teman.pulangSisa || 0), item: teman.item },
      };
    }
    function kendaliTeman(dt) {
      for (const ev of on.ambilPeristiwa()) {
        if (teman.mati) continue;
        if (ev.a === "s1" || ev.a === "s2" || ev.a === "ult") { if (pakaiSkill(teman, { s1: 0, s2: 1, ult: 2 }[ev.a])) teman.pulangSisa = 0; }
        else if (ev.a === "serang") { const t = terdekat(teman, teman.jangkau + 1.4, (v) => v.h) || terdekat(teman, teman.jangkau + 1.4, lindung) || terdekat(teman, teman.jangkau + 1.4); if (t) serangDasar(teman, t); teman.pulangSisa = 0; }
        else if (ev.a === "beli") { const n = teman.item.length; beli(teman, false); if (teman.item.length > n) kabar({ k: "umpan", t: `Membeli ${ITEM[teman.item[teman.item.length - 1]].nama}`, w: "#F2C14E", b: "poin" }); else kabar({ k: "bunyi", b: "salah" }); }
        else if (ev.a === "pulang") teman.pulangSisa = 3;
      }
      const m = on.masukan;
      if (teman.mati) return;
      if (m.serang && teman.cdSerang <= 0) { const t = terdekat(teman, teman.jangkau + 1.2, (v) => v.h) || terdekat(teman, teman.jangkau + 1.2, lindung) || terdekat(teman, teman.jangkau + 1.2); if (t) serangDasar(teman, t); }
      const gx = +m.gx || 0, gz = +m.gz || 0;
      if ((gx || gz) && teman.pusing <= 0 && !teman.dash) { teman.x += gx * lajuEfektif(teman) * dt; teman.z += gz * lajuEfektif(teman) * dt; teman.hadap = Math.atan2(gz, gx); teman.pulangSisa = 0; }
      if (teman.pulangSisa > 0) { teman.pulangSisa -= dt; if (teman.pulangSisa <= 0) { teman.x = 0; teman.z = MARKAS[teman.tim].z; kabar({ k: "bunyi", b: "tingtong" }); } }
    }
    // tamu: susun ulang unit dari kiriman tuan rumah
    const peta = new Map(), pelTamu = [], efTamu = [];
    const sgn = balik ? -1 : 1, timLokal = (t) => (balik && t ? 3 - t : t);
    function terapkanSnap(dt) {
      const sn = on.snap;
      if (!sn) return;
      const daftarBaru = meta._baru || sn.baru;
      for (const b of daftarBaru) if (!peta.has(b.id)) {
        const tim = timLokal(b.tim);
        const o = { ...b, tim, warna: WARNA_TIM[tim], h: b.hero ? HERO[b.hero] : null, jenis: b.id === meta.id ? "pemain" : b.jenis, pemain: b.id === meta.id, x: 0, z: 0, hp: 1, hpMaks: 1, kill: 0, matiN: 0, assist: 0 };
        peta.set(b.id, o);
        if (o.pemain) { Object.assign(o, { cdSkill: [0, 0, 0], item: [], gold: 0, level: 1, bangkit: 0 }); pemain = o; }
      }
      if (meta._baru) meta._baru.length = 0;
      unit.length = 0;
      for (const d of sn.u) {
        const o = peta.get(d[0]);
        if (!o) continue;
        const tx = d[1] * sgn, tz = d[2] * sgn, lompat = (o.x - tx) ** 2 + (o.z - tz) ** 2 > 36 || !o.siap;
        o.x = lompat ? tx : o.x + (tx - o.x) * Math.min(1, dt * 15); o.z = lompat ? tz : o.z + (tz - o.z) * Math.min(1, dt * 15); o.siap = true;
        o.hp = d[3]; o.hpMaks = d[4]; o.mati = !!d[5]; o.level = d[6]; o.perisai = d[7]; o.perisaiSisa = d[7] ? 1 : 0; o.gaib = d[8] ? 1 : 0; o.pusing = d[9] ? 1 : 0; o.lompat = d[10] ? 0.1 : 0;
        unit.push(o);
      }
      proyektil.length = 0; sn.p.forEach((q, i) => { const o = pelTamu[i] || (pelTamu[i] = {}); o.x = q[0] * sgn; o.z = q[1] * sgn; o.warna = q[2]; o.r = q[3]; o.y = q[4]; proyektil.push(o); });
      efek.length = 0; sn.e.forEach((q, i) => { const o = efTamu[i] || (efTamu[i] = {}); o.x = q[0] * sgn; o.z = q[1] * sgn; o.r = q[2]; o.warna = q[3]; o.umur = q[4]; o.maks = q[5]; efek.push(o); });
      skorTim[1] = sn.skor[balik ? 2 : 1]; skorTim[2] = sn.skor[balik ? 1 : 2]; waktu = sn.w;
      Object.assign(pemain, { gold: sn.me.gold, level: sn.me.level, cdSkill: sn.me.cd, kill: sn.me.kill, matiN: sn.me.mati, assist: sn.me.assist, bangkit: sn.me.bangkit, item: sn.me.item });
      pulang = sn.me.pulang;
      kend.cd = { s1: pemain.cdSkill[0], s2: pemain.cdSkill[1], ult: pemain.cdSkill[2], serang: 0 };
      // kirim kemudi (dibalik lagi ke arah dunia tuan rumah)
      on.kirimMasukan(dt, { gx: r2(kend.gerak.x * sgn), gz: r2(kend.gerak.z * sgn), serang: !!kend.tahan.serang });
      for (const a of kend.ambil()) on.ev({ a });
    }
    if (tamu) {
      const timTeks = (t) => (timLokal(t) === 1 ? "kita" : "lawan");
      api.online.on("fx", (m) => {
        if (m.b) sfx(m.b);
        if (m.k === "umpan") umpan.tambah(m.t, m.tim ? WARNA_TIM[timLokal(m.tim)] : m.w);
        else if (m.k === "umum") umum.umumkan(m.a, m.b, m.tim ? WARNA_TIM[timLokal(m.tim)] : "#F2C14E");
        else if (m.k === "menara") { const kita = timLokal(m.tim) === 1; umum.umumkan(kita ? "MENARA KITA RUNTUH" : "MENARA LAWAN RUNTUH", "", kita ? "#FF8A7A" : "#7FD18B"); sfx("kaget"); if (!kita) { K.WOW?.getar(1.2, 0.35); K.WOW?.hp(80); } }
        else if (m.k === "bos") umum.umumkan("MESIN FOTOKOPI PURBA DIKALAHKAN", `Tim ${timTeks(m.tim)} dapat Fotokopi Raksasa`, WARNA_TIM[timLokal(m.tim)]);
        else if (m.k === "tumbang") { sfx("salah"); umum.umumkan("Kamu tumbang", "Duduk sebentar di markas. Teh sudah disiapkan.", "#FF8A7A"); K.WOW?.getar(1.6, 0.4); K.WOW?.hp(150); K.WOW?.kilat("rgba(181,68,58,.45)", 400); }
        else if (m.k === "wow") { sfx("menang"); K.WOW?.getar(1, 0.25); K.WOW?.hp(50); K.WOW?.kilat("rgba(242,193,78,.3)"); }
      });
      api.online.on("akhir", (m) => {
        const pemenangLokal = timLokal(m.pemenang);
        for (const hh of m.hero) { const o = peta.get(hh.id); if (o) Object.assign(o, { kill: hh.k, matiN: hh.m, assist: hh.a, skor: hh.skor }); }
        selesai = { pemenang: pemenangLokal, sisa: 4, mvp: peta.get(m.mvp), alasan: m.alasan, data: m };
        const menang = pemenangLokal === 1;
        sfx(menang ? "menang" : "salah");
        umum.umumkan(menang ? "KEMENANGAN" : "KEKALAHAN", "", menang ? "#7FD18B" : "#FF8A7A");
        if (menang) { K.WOW?.hujan(); K.WOW?.hp(200); }
      });
    }
    function kirimHasilTamu() {
      const menang = selesai.pemenang === 1, mvp = selesai.mvp === pemain;
      const runtuh = selesai.data.menara[balik ? 1 : 2];
      const skor = (menang ? 160 : 60) + pemain.kill * 12 + pemain.assist * 6 + runtuh * 8 + (mvp ? 25 : 0);
      api.catatStat("menang", menang ? 1 : 0); api.catatStat("kill", pemain.kill);
      api.selesai(skor, [menang ? "badak" : "kapibara", `${menang ? "KEMENANGAN" : "Kalah tipis"} · KDA ${pemain.kill}/${pemain.matiN}/${pemain.assist}${mvp ? " · MVP" : ""}.`], { menang, judul: `${menang ? "KEMENANGAN" : "KEKALAHAN"}${modeLawan ? " lawan teman" : " bareng teman"}` });
    }

    ctx.canvas._uji = { unit, get pemain() { return pemain; }, akhiri: (t) => akhiri(t), get waktu() { return waktu; } };   // untuk pengujian otomatis

    /* ---------- 3D ---------- */
    const d3 = api.buat3D(dunia);
    const tampil = d3 || AR.render2D(api, dunia);
    api.info(`Legenda Lantai 2 · kamu main ${h.nama} (${h.peran}). Hancurkan inti markas merah di atas.`);
    umum.umumkan("SELAMAT DATANG", "di Legenda Lantai 2", "#F2C14E");
    sfx("tingtong");

    /* ---------- loop ---------- */
    const stop = api.loop((dt) => {
      waktu += dt;
      if (tamu) {
        if (!selesai) terapkanSnap(dt);
        else { selesai.sisa -= dt; if (selesai.sisa <= 0) { stop2(); kirimHasilTamu(); return; } }
      } else if (!selesai) {
        // gelombang minion
        jedaGelombang -= dt;
        if (jedaGelombang <= 0) { gelombang++; jedaGelombang = 20; for (const t of [1, 2]) { buatMinion(t, false); buatMinion(t, false); buatMinion(t, true); if (waktu > 160) buatMinion(t, false, 2.2); }
          if (waktu > 160 && !umumSuper) { umumSuper = true; umum.umumkan("MINION SUPER MUNCUL", "Gelombang berikutnya lebih kuat", "#F2C14E"); } if (gelombang === 1) umpan.tambah("Minion telah muncul", "#FFFDF6"); }
        for (let i = tertunda.length - 1; i >= 0; i--) if (waktu >= tertunda[i].t) { const f = tertunda[i].fn; tertunda.splice(i, 1); f(); }
        // pemain
        const aksi = kend.ambil();
        if (!pemain.mati) {
          for (const a of aksi) {
            if (a === "serang") { const t = terdekat(pemain, pemain.jangkau + 1.4, (v) => v.h) || terdekat(pemain, pemain.jangkau + 1.4, lindung) || terdekat(pemain, pemain.jangkau + 1.4); if (t) serangDasar(pemain, t); pulang = 0; }
            if (a === "s1") { if (pakaiSkill(pemain, 0)) pulang = 0; }
            if (a === "s2") { if (pakaiSkill(pemain, 1)) pulang = 0; }
            if (a === "ult") { if (pakaiSkill(pemain, 2)) pulang = 0; }
          }
          if (kend.tahan.serang && pemain.cdSerang <= 0) { const t = terdekat(pemain, pemain.jangkau + 1.2, (v) => v.h) || terdekat(pemain, pemain.jangkau + 1.2, lindung) || terdekat(pemain, pemain.jangkau + 1.2); if (t) serangDasar(pemain, t); }
          const gx = kend.gerak.x, gz = kend.gerak.z;
          if ((gx || gz) && pemain.pusing <= 0 && !pemain.dash) { pemain.x += gx * lajuEfektif(pemain) * dt; pemain.z += gz * lajuEfektif(pemain) * dt; pemain.hadap = Math.atan2(gz, gx); pulang = 0; }
          if (pulang > 0) { pulang -= dt; if (pulang <= 0) { pemain.x = 0; pemain.z = 85; sfx("tingtong"); } }
        }
        kend.cd = { s1: pemain.cdSkill[0], s2: pemain.cdSkill[1], ult: pemain.cdSkill[2], serang: 0 };
        if (hostOnline) kendaliTeman(dt);
        // semua unit
        for (const u of unit) {
          if (u.mati) {
            if ((u.h || u.monster) && u.bangkit > 0) {
              u.bangkit -= dt;
              if (u.bangkit <= 0) { u.mati = false; u.hp = u.hpMaks; if (u.h) { u.x = (u.id % 3 - 1) * 2; u.z = MARKAS[u.tim].z; if (u.pemain) umum.umumkan("Kamu bangkit lagi", "", "#7FD18B"); } else { u.x = u.x0; u.z = u.z0; u.marah = null; } }
            }
            continue;
          }
          if (u.cdSerang > 0) u.cdSerang -= dt;
          if (u.cdSkill) for (let i = 0; i < 3; i++) if (u.cdSkill[i] > 0) u.cdSkill[i] -= dt;
          if (u.slowSisa > 0) u.slowSisa -= dt;
          if (u.pusing > 0) u.pusing -= dt;
          if (u.perisaiSisa > 0) { u.perisaiSisa -= dt; if (u.perisaiSisa <= 0) u.perisai = 0; }
          if (u.gaib > 0) u.gaib -= dt;
          if (u.cepat > 0) u.cepat -= dt;
          if (u.lompat > 0) u.lompat = Math.max(0, u.lompat - dt);
          if (u.h) {
            if (u.regen) u.hp = Math.min(u.hpMaks, u.hp + u.regen * dt);
            u.gold += 2.2 * dt;
            if (d2(u, MARKAS[u.tim]) < 60) u.hp = Math.min(u.hpMaks, u.hp + u.hpMaks * 0.12 * dt);
            if (u.dash) {
              u.x += u.dash.x * u.dash.laju * dt; u.z += u.dash.z * u.dash.laju * dt; u.dash.sisa -= dt;
              if (u.dash.kena) for (const v of unit) if (musuh(u, v) && !u.dash.kena.has(v) && d2(u, v) < (1.4 + (v.r || 0)) ** 2) { u.dash.kena.add(v); pukul(u, v, u.dash.dmg, { pusing: u.dash.pusing }); }
              if (u.dash.sisa <= 0) u.dash = null;
            } else if (!u.pemain && !u.remote && u.pusing <= 0) {
              const tujuan = otakHero(u, dt);
              gerakKe(u, tujuan, dt, tujuan && tujuan.hp !== undefined ? u.jangkau + (tujuan.r || 0) : 0.4);
              lepasMacet(u, dt);
            }
          } else if (u.minion && u.pusing <= 0) {
            const t = terdekat(u, u.lord ? 7 : 5.5, lindung);
            if (t && Math.sqrt(d2(u, t)) <= u.jangkau + (t.r || 0) + 0.2) serangDasar(u, t);
            else if (t) gerakKe(u, t, dt, u.jangkau + (t.r || 0));
            else gerakKe(u, { x: u.x * 0.98, z: u.tim === 1 ? -90 : 90 }, dt);
          } else if (u.monster && u.pusing <= 0) {
            const t = u.marah && !u.marah.mati && d2(u.marah, u) < 140 ? u.marah : null;
            if (t) { if (Math.sqrt(d2(u, t)) <= u.jangkau + 0.8) serangDasar(u, t); else gerakKe(u, t, dt, u.jangkau); }
            else { u.marah = null; gerakKe(u, { x: u.x0, z: u.z0 }, dt); u.hp = Math.min(u.hpMaks, u.hp + u.hpMaks * 0.1 * dt); }
          } else if (u.bangunan) {
            const tMinion = terdekat(u, u.jangkau, (v) => v.minion);
            const tHero = terdekat(u, u.jangkau, (v) => v.h);
            const t = tMinion || tHero;
            if (t && u.cdSerang <= 0) {
              u.cdSerang = 1.0;
              u.panas = u.target === t ? Math.min(u.panas + 0.3, 1.5) : 0; u.target = t;
              tembak(u, { target: t, laju: 30, dmg: u.atk * (t.h ? 1 + u.panas : 0.5), warna: WARNA_TIM[u.tim], r: 0.5, y: 4 });
            }
          }
          if (!u.bangunan) AR.tabrakKotak(u, kotak);
          u.x = AR.batas(u.x, -26, 26); u.z = AR.batas(u.z, -90, 90);
        }
        // proyektil
        for (let i = proyektil.length - 1; i >= 0; i--) {
          const q = proyektil[i];
          let hapus = false;
          if (q.target) {
            if (q.target.mati) { proyektil.splice(i, 1); continue; }
            const dx = q.target.x - q.x, dz = q.target.z - q.z, l = Math.hypot(dx, dz), v = q.laju * dt;
            if (l <= v + 0.4) { pukul(q.dari, q.target, q.dmg, q); hapus = true; }
            else { q.x += (dx / l) * v; q.z += (dz / l) * v; }
          } else {
            q.x += q.vx * q.laju * dt; q.z += q.vz * q.laju * dt; q.tempuh += q.laju * dt;
            for (const v of unit) {
              if (!musuh(q.dari, v) || (q.kenaSet && q.kenaSet.has(v))) continue;
              if (d2(q, v) < (0.6 + (v.r || 0)) ** 2) { pukul(q.dari, v, q.dmg, q); if (q.tembus) q.kenaSet.add(v); else { hapus = true; break; } }
            }
            if (q.tempuh > q.jarak || AR.terhalang(q.x - q.vx * 0.5, q.z - q.vz * 0.5, q.x, q.z, kotak)) hapus = true;
          }
          if (hapus) proyektil.splice(i, 1);
        }
        // minion yang sudah lama mati dibuang
        for (let i = unit.length - 1; i >= 0; i--) if (unit[i].mati && unit[i].minion) unit.splice(i, 1);
        if (waktu > 420) akhiri(menaraJatuh[2] > menaraJatuh[1] || (menaraJatuh[2] === menaraJatuh[1] && skorTim[1] >= skorTim[2]) ? 1 : 2, "waktu");
      } else {
        selesai.sisa -= dt;
        if (selesai.sisa <= 0) { stop2(); kirimHasil(); return; }
      }
      if (hostOnline) on.kirimSnap(dt, buatSnap, 12);
      for (let i = efek.length - 1; i >= 0; i--) { efek[i].umur += dt; if (efek[i].umur > efek[i].maks) efek.splice(i, 1); }
      for (let i = angka.length - 1; i >= 0; i--) { angka[i].umur += dt; if (angka[i].umur > 0.9) angka.splice(i, 1); }

      // ===== tampilan =====
      const W = api.W(), H = api.H();
      const entitas = unit.map((u) => {
        u.transparan = (u.gaib > 0) || (u.h && AR.diSemak(u, semak));
        u.tersembunyi = u.tim === 2 && u.h && ((u.gaib > 0) || (AR.diSemak(u, semak) && !unit.some((v) => v.tim === 1 && v.h && !v.mati && d2(v, u) < 9)));
        u.kedip = u.pusing > 0;
        return u;
      });
      const fokus = pemain.mati ? MARKAS[1] : pemain;
      if (d3) ctx.clearRect(0, 0, W, H);
      tampil.gambar({ fokus, entitas, proyektil, efek }, waktu);
      gambarHUD(W, H, dt);
    });

    /* ---------- HUD ---------- */
    function gambarHUD(W, H, dt) {
      const T = AR.teks;
      // bar HP di atas kepala
      for (const u of unit) {
        if (u.mati || u.tersembunyi) continue;
        if (Math.abs(u.z - (pemain.mati ? 85 : pemain.z)) > 26) continue;
        const tinggi = u.bangunan ? (u.jenis === "inti" ? 5.5 : 5.6) : u.r * 2.6 + 0.6;
        const p = tampil.proyeksi(u.x, tinggi, u.z);
        if (p.di === false || p.y < 30 || p.y > H) continue;
        const warna = u.pemain ? "#7FD18B" : u.tim === 1 ? "#5B9BE0" : u.tim === 2 ? "#E05A4E" : "#C9A06A";
        if (u.h) AR.barHp(ctx, p, 38, u.hp, u.hpMaks, warna, u.pemain ? null : u.nama, u.level);
        else AR.barHp(ctx, p, u.bangunan ? 46 : u.monster ? (u.bos ? 50 : 28) : 18, u.hp, u.hpMaks, warna);
        if (u.perisai > 0 && u.perisaiSisa > 0) { ctx.fillStyle = "#FFFDF6"; ctx.fillRect(p.x - 19, p.y - 3, 38 * Math.min(1, u.perisai / u.hpMaks), 2); }
      }
      for (const n of angka) { const p = tampil.proyeksi(n.x, 2.4 + n.umur * 1.6, n.z); ctx.globalAlpha = 1 - n.umur / 0.9; T(ctx, `${n.teks}`, p.x, p.y, 12, n.warna); ctx.globalAlpha = 1; }
      // papan skor atas
      ctx.fillStyle = "rgba(20,20,24,.75)"; ctx.fillRect(W / 2 - 62, 6, 124, 30);
      T(ctx, `${skorTim[1]}`, W / 2 - 34, 21, 18, "#7FB2E0"); T(ctx, "VS", W / 2, 21, 11, "#FFFDF6"); T(ctx, `${skorTim[2]}`, W / 2 + 34, 21, 18, "#FF8A7A");
      const mm = Math.floor(waktu / 60), ss = String(Math.floor(waktu % 60)).padStart(2, "0");
      T(ctx, `${mm}:${ss}`, W / 2, 44, 10, "#FFFDF6");
      // peta mini (kiri atas)
      const mx = 8, my = 8, mw = 42, mh = 132;
      ctx.fillStyle = "rgba(20,20,24,.7)"; ctx.fillRect(mx, my, mw, mh);
      ctx.fillStyle = "rgba(201,180,142,.5)"; ctx.fillRect(mx + mw / 2 - 6, my, 12, mh);
      const peta = (x, z) => [mx + ((x + 27) / 54) * mw, my + ((z + 91) / 182) * mh];
      for (const u of unit) {
        if (u.mati || u.tersembunyi) continue;
        const [a, b] = peta(u.x, u.z);
        ctx.fillStyle = u.pemain ? "#F2C14E" : WARNA_TIM[u.tim];
        const s = u.bangunan ? 4 : u.h ? (u.pemain ? 5 : 4) : 2;
        ctx.fillRect(a - s / 2, b - s / 2, s, s);
      }
      // gold, level, tombol beli
      const next = pemain.h.build.find((k) => !pemain.item.includes(k));
      const it = next && ITEM[next];
      tombolBeli.textContent = it ? `Beli ${it.nama} · ${it.harga}g` : "Build lengkap";
      tombolBeli.classList.toggle("bisa", !!it && pemain.gold >= it.harga);
      T(ctx, `${Math.floor(pemain.gold)} gold`, 60, H - 150, 12, "#F2C14E", "left");
      T(ctx, `Lv ${pemain.level}  KDA ${pemain.kill}/${pemain.matiN}/${pemain.assist}`, 60, H - 134, 11, "#FFFDF6", "left");
      if (pulang > 0) T(ctx, `Pulang ke markas... ${pulang.toFixed(1)}`, W / 2, H * 0.62, 13, "#7FC8F2");
      if (pemain.mati) T(ctx, `Bangkit dalam ${Math.ceil(pemain.bangkit)} detik`, W / 2, H * 0.45, 16, "#FFFDF6");
      umpan.gambar(ctx, W, 52, dt);
      umum.gambar(ctx, W, H, dt);
      if (!pemain.mati) kend.gambar(ctx);
      if (selesai && selesai.sisa < 3) {
        ctx.fillStyle = "rgba(20,20,24,.85)"; ctx.fillRect(16, H * 0.36, W - 32, 210);
        T(ctx, selesai.pemenang === 1 ? "KEMENANGAN" : "KEKALAHAN", W / 2, H * 0.36 + 24, 22, selesai.pemenang === 1 ? "#7FD18B" : "#FF8A7A");
        unit.filter((v) => v.h).sort((a, b) => a.tim - b.tim || b.skor - a.skor).forEach((v, i) => {
          const y = H * 0.36 + 54 + i * 24;
          T(ctx, `${v === selesai.mvp ? "MVP " : ""}${v.nama}`, 30, y, 12, v.tim === 1 ? "#7FB2E0" : "#FF8A7A", "left");
          T(ctx, `${v.kill}/${v.matiN}/${v.assist}`, W - 30, y, 12, "#FFFDF6", "right");
        });
      }
    }
    function stop2() { stop(); kend.hapus(); api.kontrol.removeEventListener("click", klikBar); }
    return stop2;
  }

  /* ---------- pilihan hero di panel sebelum main ---------- */
  function htmlPilihan() {
    const p = K.data.setelan.moba && HERO[K.data.setelan.moba] ? K.data.setelan.moba : "kura";
    return `
      <div class="ap-bagian moba-pilih">
        <p class="ap-label">Pilih hero</p>
        <div class="moba-hero">${Object.entries(HERO).map(([id, h]) => `
          <button type="button" class="moba-h${p === id ? " dipilih" : ""}" data-hero="${id}">
            <span class="avatar">${K.px(h.sprite)}</span><strong>${K.esc(h.nama)}</strong><small>${h.peran}</small>
          </button>`).join("")}</div>
        <p class="muted small" id="mobaKet">${K.esc(HERO[p].skill.map((s) => `${s.nama}: ${s.ket}`).join(" · "))}</p>
      </div>`;
  }
  function pasang(panel) {
    panel.querySelector(".moba-pilih")?.addEventListener("click", (e) => {
      const b = e.target.closest("[data-hero]");
      if (!b) return;
      K.data.setelan.moba = b.dataset.hero; K.simpan(); sfx("pilih");
      panel.querySelectorAll("[data-hero]").forEach((x) => x.classList.toggle("dipilih", x === b));
      panel.querySelector("#mobaKet").textContent = HERO[b.dataset.hero].skill.map((s) => `${s.nama}: ${s.ket}`).join(" · ");
    });
  }

  K.MOBA = { HERO, ITEM, main, htmlPilihan, pasang };
})();
