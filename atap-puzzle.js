/* =========================================================
   Kantor Layanan Perasaan · Atap Biru · mesin puzzle "Rapikan Atap"
   Puzzle cocok-tiga: geser satu benda ke sebelahnya, tiga sejajar beres.
   - 4 sejajar  → Sapu (membersihkan satu baris / kolom)
   - kotak 2×2  → Pesawat Kertas (terbang ke sasaran)
   - bentuk L/T → Ember Air (3×3)
   - 5 sejajar  → Bintang Biru (semua benda sewarna)
   Rintangan: debu (di bawah benda) dan kardus (menghalangi).
   Logika murni (tanpa DOM) + fungsi gambar ke kanvas 2D.
   ========================================================= */
(() => {
  "use strict";
  const K = (window.KLP = window.KLP || {});

  /* ---------- acak berbenih ---------- */
  function rng32(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ---------- benda ---------- */
  const JENIS = [
    { id: "buku", nama: "Buku", warna: "#3E78C4" },
    { id: "daun", nama: "Daun", warna: "#5FA35A" },
    { id: "lampu", nama: "Bohlam", warna: "#F2C14E" },
    { id: "cat", nama: "Kaleng Cat", warna: "#C8553D" },
    { id: "kertas", nama: "Pesawat Kertas", warna: "#E9E4D6" },
    { id: "kancing", nama: "Kancing", warna: "#8A6BBE" },
  ];
  const OL = "#2B2A26";
  const GRID = {
    buku: { p: { k: OL, b: "#3E78C4", B: "#A9C8EE", w: "#FFFDF6", d: "#2C5A97" }, g: [
      "..........",
      ".kkkkkkkk.",
      ".kbbbbbbwk",
      ".kbBBBBbwk",
      ".kbbbbbbwk",
      ".kbBBBbbwk",
      ".kbbbbbbwk",
      ".kddddddwk",
      ".kkkkkkkkk",
      ".........." ] },
    daun: { p: { k: OL, g: "#5FA35A", l: "#A8D59A", d: "#3E7A3A" }, g: [
      "......kkk.",
      "....kkgggk",
      "...kggglgk",
      "..kggglggk",
      "..kgglgggk",
      ".kgglgggk.",
      ".kglgggdk.",
      ".kkgggdk..",
      ".k.kkkk...",
      "k........." ] },
    lampu: { p: { k: OL, y: "#F2C14E", w: "#FFF3C4", g: "#8A8F96", d: "#C99A2E" }, g: [
      "...kkkk...",
      "..kyyyyk..",
      ".kywwyyyk.",
      ".kywyyyyk.",
      ".kyyyyydk.",
      "..kyyydk..",
      "...kyyk...",
      "...kggk...",
      "...kggk...",
      "....kk...." ] },
    cat: { p: { k: OL, r: "#C8553D", w: "#F2D0C0", d: "#93392A", s: "#8A8F96" }, g: [
      "...kkkk...",
      "..k....k..",
      ".kkkkkkkk.",
      ".ksssssk..",
      ".krwwrrrk.",
      ".krwrrrrk.",
      ".krrrrrrk.",
      ".krrrrrdk.",
      ".kkkkkkkk.",
      ".........." ] },
    kertas: { p: { k: OL, w: "#FFFDF6", g: "#C9C2B0", b: "#9FB8D8" }, g: [
      "k.........",
      "kwkk......",
      ".kwwkk....",
      ".kwwwwkk..",
      "..kwwwwwkk",
      "..kwgbbkk.",
      ".kwgkkk...",
      ".kgk......",
      "kkk.......",
      ".........." ] },
    kancing: { p: { k: OL, p: "#8A6BBE", P: "#B7A0DE", d: "#64489A" }, g: [
      "...kkkk...",
      "..kppppk..",
      ".kpPPpppk.",
      "kpPkppkppk",
      "kpPppppppk",
      "kppppppdpk",
      "kppkppkdpk",
      ".kpppppdk.",
      "..kppddk..",
      "...kkkk..." ] },
    bintang: { p: { k: OL, b: "#3E78C4", w: "#FFFDF6", c: "#7FC8F2" }, g: [
      "....kk....",
      "...kwck...",
      "kkkkccbkkk",
      "kwccbbbbbk",
      ".kcbbbbbk.",
      "..kbbbbk..",
      ".kbbkkbbk.",
      ".kbk..kbk.",
      "kkk....kkk",
      ".........." ] },
    kardus: { p: { k: OL, c: "#C9A06A", C: "#A57E4E", t: "#E8D9B0" }, g: [
      "kkkkkkkkkk",
      "kcccttccCk",
      "kcccttccCk",
      "kkkkkkkkkk",
      "kcccttccCk",
      "kcccttccCk",
      "kccccccCCk",
      "kccccccCCk",
      "kCCCCCCCCk",
      "kkkkkkkkkk" ] },
  };
  // prarender grid ke kanvas kecil (dipakai ulang tiap bingkai)
  const cacheGrid = {};
  function gambarGrid(nama, skala = 4) {
    const key = nama + skala;
    if (cacheGrid[key]) return cacheGrid[key];
    const s = GRID[nama];
    if (typeof document === "undefined") return null;
    const c = document.createElement("canvas");
    c.width = c.height = 10 * skala;
    const x = c.getContext("2d");
    s.g.forEach((row, y) => [...row].forEach((ch, i) => { if (ch === ".") return; x.fillStyle = s.p[ch]; x.fillRect(i * skala, y * skala, skala, skala); }));
    return (cacheGrid[key] = c);
  }

  /* ---------- bentuk papan ---------- */
  const BENTUK = [
    null,
    ["x.xxx.x", "xxxxxxx", "xxxxxxx", "xxxxxxx", "xxxxxxx", "xxxxxxx", "xxxxxxx", "x.xxx.x"],
    ["..xxx..", ".xxxxx.", "xxxxxxx", "xxxxxxx", "xxxxxxx", "xxxxxxx", ".xxxxx.", "..xxx.."],
    ["xxxxxxx", "xxxxxxx", "xx.x.xx", "xxxxxxx", "xxxxxxx", "xx.x.xx", "xxxxxxx", "xxxxxxx"],
    ["xxx.xxx", "xxx.xxx", "xxxxxxx", "xxxxxxx", "xxxxxxx", "xxxxxxx", "xxx.xxx", "xxx.xxx"],
    [".xxxxx.", "xxxxxxx", "xxxxxxx", "xxx.xxx", "xxx.xxx", "xxxxxxx", "xxxxxxx", ".xxxxx."],
  ];

  /* ---------- pembuat level ---------- */
  // tingkat: "santai" sedikit lebih banyak langkah
  function buatLevel(n, opsi = {}) {
    n = Math.max(1, n | 0);
    const r = rng32(n * 7919 + 13);
    const L = { n, kolom: 7, baris: 8, jenis: n <= 3 ? 4 : n <= 12 ? 5 : 6, langkah: 22, target: [], debu: [], kardus: [], bentuk: null, info: "" };
    const pilihJenis = (k) => { const a = [...Array(L.jenis).keys()]; const h = []; while (h.length < k) h.push(a.splice(Math.floor(r() * a.length), 1)[0]); return h; };
    const isiDebu = (r0, r1, lapis = 1, c0 = 0, c1 = 6) => { for (let y = r0; y <= r1; y++) for (let x = c0; x <= c1; x++) L.debu.push([y, x, lapis]); };
    const naik = Math.min(1, (n - 1) / 60);   // 0 → 1 sepanjang 60 level pertama
    if (n === 1) { L.target = [{ j: 0, n: 10 }]; L.langkah = 18; L.info = "Geser satu benda ke sebelahnya. Tiga sejajar langsung beres."; }
    else if (n === 2) { L.target = [{ j: 1, n: 12 }, { j: 2, n: 12 }]; L.langkah = 20; L.info = "Empat sejajar jadi Sapu: membersihkan satu baris penuh."; }
    else if (n === 3) { isiDebu(3, 5); L.target = [{ j: "debu" }]; L.langkah = 22; L.info = "Debu hilang kalau ada benda yang dicocokkan di atasnya."; }
    else if (n === 4) { L.target = [{ j: 3, n: 18 }]; L.langkah = 20; L.info = "Kotak 2×2 jadi Pesawat Kertas. Ia terbang sendiri ke tempat yang perlu."; }
    else if (n === 5) { for (let x = 0; x < 7; x++) L.kardus.push([7, x, 1]); L.target = [{ j: "kardus" }, { j: 4, n: 12 }]; L.langkah = 22; L.info = "Kardus rusak kalau ada cocokan di sebelahnya. Bentuk L atau T jadi Ember Air."; }
    else {
      const v = n % 5;
      const banyak = (a, b) => Math.round(a + (b - a) * naik);
      if (n >= 9 && n % 3 === 0) L.bentuk = BENTUK[1 + ((n / 3) % (BENTUK.length - 1))];
      if (v === 0) { L.target = pilihJenis(2).map((j) => ({ j, n: banyak(14, 30) })); L.langkah = banyak(22, 24); }
      else if (v === 1) {
        const tinggi = banyak(2, 3); const y0 = 7 - tinggi;
        isiDebu(y0, 7, 1);
        if (n >= 25) isiDebu(7, 7, 1, 2, 4);          // lapis kedua di tengah dasar
        if (n >= 20) isiDebu(2, 3, 1, 2, 4);
        L.target = [{ j: "debu" }]; L.langkah = banyak(25, 31);
      } else if (v === 2) {
        for (let x = 0; x < 7; x++) L.kardus.push([7, x, 1]);
        if (n >= 16) for (const x of [2, 3, 4]) L.kardus.push([4, x, n >= 24 ? 2 : 1]);
        L.target = [{ j: "kardus" }, { j: pilihJenis(1)[0], n: banyak(10, 20) }]; L.langkah = banyak(24, 27);
      } else if (v === 3) { L.target = pilihJenis(3).map((j) => ({ j, n: banyak(10, 22) })); L.langkah = banyak(22, 25); }
      else {
        isiDebu(5, 7, 1, 1, 5);
        for (const x of [0, 6]) { L.kardus.push([6, x, 1]); L.kardus.push([7, x, 1]); }
        if (n >= 18) for (const x of [2, 4]) L.kardus.push([4, x, n >= 30 ? 2 : 1]);
        L.target = [{ j: "debu" }, { j: "kardus" }]; L.langkah = banyak(25, 29);
      }
    }
    if (opsi.tingkat === "santai") L.langkah += 3;
    if (opsi.tingkat === "lembur") L.langkah -= 2;
    // jangan menaruh debu/kardus di lubang
    if (L.bentuk) { const ada = (y, x) => L.bentuk[y][x] === "x"; L.debu = L.debu.filter(([y, x]) => ada(y, x)); L.kardus = L.kardus.filter(([y, x]) => ada(y, x)); }
    L.debu = L.debu.filter(([y, x]) => !L.kardus.some(([a, b]) => a === y && b === x));
    return L;
  }

  /* =========================================================
     PAPAN
     ========================================================= */
  const TERBANG = 0.42, POP = 0.2, TUKAR = 0.15;
  function buat(level, opsi = {}) {
    const rnd = rng32(opsi.benih ?? level.n * 104729 + 7);
    const B = level.baris, C = level.kolom, NJ = level.jenis;
    const sel = [];
    for (let r = 0; r < B; r++) { sel.push([]); for (let c = 0; c < C; c++) sel[r].push({ ada: !level.bentuk || level.bentuk[r][c] === "x", debu: 0, kardus: 0, t: null }); }
    for (const [r, c, l] of level.debu) sel[r][c].debu = l;
    for (const [r, c, l] of level.kardus) sel[r][c].kardus = l;
    let uid = 1;
    const benda = (j, r, c, y = r) => ({ id: uid++, j, sp: null, r, c, x: c, y, vy: 0, pop: 0, mati: false, mendarat: 0 });

    const st = {
      level, langkah: level.langkah, skor: 0, fase: "diam", combo: 0, pilih: null, diam: 0, hint: null,
      target: level.target.map((t) => ({ ...t, sisa: t.j === "debu" ? hitungDebu() : t.j === "kardus" ? hitungKardus() : t.n })),
      efek: [], terbang: [], teks: [], partikel: [], getar: 0, tambahanDipakai: false, gerakan: 0, spesialDibuat: 0, comboMaks: 0,
    };
    function hitungDebu() { let n = 0; for (const row of sel) for (const s of row) if (s.ada) n += s.debu; return n; }
    function hitungKardus() { let n = 0; for (const row of sel) for (const s of row) if (s.ada) n += s.kardus; return n; }
    const kunci = (r, c) => r * 16 + c;
    const sah = (r, c) => r >= 0 && c >= 0 && r < B && c < C && sel[r][c].ada;
    const jenisDi = (r, c) => { if (!sah(r, c)) return -1; const s = sel[r][c]; if (s.kardus || !s.t || s.t.mati || s.t.sp === "bintang") return -1; return s.t.j; };

    // isi awal tanpa cocokan
    function isiAwal() {
      for (let r = 0; r < B; r++) for (let c = 0; c < C; c++) {
        const s = sel[r][c];
        if (!s.ada || s.kardus) continue;
        let j, coba = 0;
        do { j = Math.floor(rnd() * NJ); coba++; }
        while (coba < 20 && ((jenisDi(r, c - 1) === j && jenisDi(r, c - 2) === j) || (jenisDi(r - 1, c) === j && jenisDi(r - 2, c) === j) || (jenisDi(r - 1, c) === j && jenisDi(r, c - 1) === j && jenisDi(r - 1, c - 1) === j)));
        s.t = benda(j, r, c, r - B - 1);
      }
      if (!cariGerak()) acakUlang(false);
    }

    /* ---------- cari cocokan ---------- */
    function cariGrup() {
      const bentuk = [];
      for (let r = 0; r < B; r++) for (let c = 0; c < C;) {
        const j = jenisDi(r, c); let n = 1;
        if (j >= 0) while (jenisDi(r, c + n) === j) n++;
        if (j >= 0 && n >= 3) bentuk.push({ arah: "h", len: n, sel: Array.from({ length: n }, (_, i) => [r, c + i]), j });
        c += n;
      }
      for (let c = 0; c < C; c++) for (let r = 0; r < B;) {
        const j = jenisDi(r, c); let n = 1;
        if (j >= 0) while (jenisDi(r + n, c) === j) n++;
        if (j >= 0 && n >= 3) bentuk.push({ arah: "v", len: n, sel: Array.from({ length: n }, (_, i) => [r + i, c]), j });
        r += n;
      }
      for (let r = 0; r < B - 1; r++) for (let c = 0; c < C - 1; c++) {
        const j = jenisDi(r, c);
        if (j >= 0 && jenisDi(r, c + 1) === j && jenisDi(r + 1, c) === j && jenisDi(r + 1, c + 1) === j) bentuk.push({ arah: "kotak", len: 2, sel: [[r, c], [r, c + 1], [r + 1, c], [r + 1, c + 1]], j });
      }
      // gabungkan bentuk yang berbagi sel
      const induk = bentuk.map((_, i) => i);
      const akar = (i) => (induk[i] === i ? i : (induk[i] = akar(induk[i])));
      const pemilik = new Map();
      bentuk.forEach((b, i) => b.sel.forEach(([r, c]) => { const k = kunci(r, c); if (pemilik.has(k)) induk[akar(i)] = akar(pemilik.get(k)); else pemilik.set(k, i); }));
      const kumpul = new Map();
      bentuk.forEach((b, i) => { const a = akar(i); if (!kumpul.has(a)) kumpul.set(a, []); kumpul.get(a).push(b); });
      const grup = [];
      for (const bs of kumpul.values()) {
        const m = new Map(), hit = new Map();
        bs.forEach((b) => b.sel.forEach(([r, c]) => { const k = kunci(r, c); m.set(k, [r, c]); hit.set(k, (hit.get(k) || 0) + 1); }));
        const maks = Math.max(0, ...bs.filter((b) => b.arah !== "kotak").map((b) => b.len));
        const adaH = bs.some((b) => b.arah === "h"), adaV = bs.some((b) => b.arah === "v"), kotak = bs.some((b) => b.arah === "kotak");
        let sp = null;
        if (maks >= 5) sp = "bintang";
        else if (adaH && adaV) sp = "bom";
        else if (maks === 4) sp = bs.find((b) => b.len === 4).arah === "h" ? "sapuH" : "sapuV";
        else if (kotak) sp = "pesawat";
        let tengah = null, terbanyak = -1;
        for (const [k, rc] of m) { const h = hit.get(k) * 10 + rc[0]; if (h > terbanyak) { terbanyak = h; tengah = rc; } }
        grup.push({ sel: [...m.values()], sp, j: bs[0].j, tengah });
      }
      return grup;
    }

    // apakah ada gerakan? kembalikan pasangan untuk petunjuk
    function cariGerak() {
      for (let r = 0; r < B; r++) for (let c = 0; c < C; c++) {
        const s = sel[r][c];
        if (!s.ada || s.kardus || !s.t) continue;
        if (s.t.sp) return [[r, c], [r, c]];
        for (const [dr, dc] of [[0, 1], [1, 0]]) {
          const r2 = r + dr, c2 = c + dc;
          if (!sah(r2, c2) || sel[r2][c2].kardus || !sel[r2][c2].t) continue;
          tukarIsi(r, c, r2, c2);
          const ok = adaCocokDi(r, c) || adaCocokDi(r2, c2);
          tukarIsi(r, c, r2, c2);
          if (ok) return [[r, c], [r2, c2]];
        }
      }
      return null;
    }
    function adaCocokDi(r, c) {
      const j = jenisDi(r, c); if (j < 0) return false;
      let h = 1; for (let i = 1; jenisDi(r, c - i) === j; i++) h++; for (let i = 1; jenisDi(r, c + i) === j; i++) h++;
      if (h >= 3) return true;
      let v = 1; for (let i = 1; jenisDi(r - i, c) === j; i++) v++; for (let i = 1; jenisDi(r + i, c) === j; i++) v++;
      if (v >= 3) return true;
      for (const [a, b] of [[-1, -1], [-1, 0], [0, -1], [0, 0]]) if (jenisDi(r + a, c + b) === j && jenisDi(r + a, c + b + 1) === j && jenisDi(r + a + 1, c + b) === j && jenisDi(r + a + 1, c + b + 1) === j) return true;
      return false;
    }
    function tukarIsi(r1, c1, r2, c2) {
      const a = sel[r1][c1].t, b = sel[r2][c2].t;
      sel[r1][c1].t = b; sel[r2][c2].t = a;
      if (a) { a.r = r2; a.c = c2; } if (b) { b.r = r1; b.c = c1; }
    }
    function acakUlang(tampil = true) {
      const isi = [];
      for (let r = 0; r < B; r++) for (let c = 0; c < C; c++) { const s = sel[r][c]; if (s.ada && !s.kardus && s.t && !s.t.sp) isi.push(s.t); }
      for (let coba = 0; coba < 40; coba++) {
        for (const t of isi) t.j = Math.floor(rnd() * NJ);
        if (!cariGrup().length && cariGerak()) break;
      }
      if (tampil) { st.teks.push({ t: "Diacak ulang. Pak Satpam merapikan sebentar.", x: C / 2, y: B / 2, umur: 0, besar: true }); bunyi("kertas"); }
    }

    /* ---------- menghapus & ledakan ---------- */
    function sasaranPesawat(kecuali) {
      const kandidat = [];
      for (let r = 0; r < B; r++) for (let c = 0; c < C; c++) {
        const s = sel[r][c]; if (!s.ada || kecuali.has(kunci(r, c))) continue;
        let n = 0;
        if (s.kardus && st.target.some((t) => t.j === "kardus" && t.sisa > 0)) n = 5;
        else if (s.debu && st.target.some((t) => t.j === "debu" && t.sisa > 0)) n = 4;
        else if (s.t && !s.t.mati && st.target.some((t) => t.j === s.t.j && t.sisa > 0)) n = 3;
        else if (s.t && !s.t.mati) n = 1;
        if (n) kandidat.push([n + rnd(), r, c]);
      }
      kandidat.sort((a, b) => b[0] - a[0]);
      return kandidat[0] ? [kandidat[0][1], kandidat[0][2]] : null;
    }
    // ledakkan daftar sel; spesial ikut aktif berantai
    function ledakkan(awal, { cocok = null, besar = false } = {}) {
      const antre = awal.map(([r, c]) => [r, c, cocok && cocok.has(kunci(r, c))]);
      const sudah = new Set(), kardusKena = new Set();
      let n = 0;
      while (antre.length) {
        const [r, c, dariCocok] = antre.shift();
        if (!sah(r, c)) continue;
        const k = kunci(r, c);
        if (sudah.has(k)) continue;
        sudah.add(k);
        const s = sel[r][c];
        if (s.kardus) { if (!kardusKena.has(k)) { kardusKena.add(k); kenaKardus(r, c); } continue; }
        if (s.debu) { s.debu--; kurangiTarget("debu", r, c); partikelDi(r, c, "#B79F7A", 5); }
        const t = s.t;
        if (dariCocok) for (const [dr, dc] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) {
          const rr = r + dr, cc = c + dc;
          if (sah(rr, cc) && sel[rr][cc].kardus && !kardusKena.has(kunci(rr, cc))) { kardusKena.add(kunci(rr, cc)); kenaKardus(rr, cc); }
        }
        if (!t || t.mati) continue;
        t.mati = true; t.pop = 0; n++;
        if (t.sp !== "bintang") { kurangiTarget(t.j, r, c); partikelDi(r, c, JENIS[t.j].warna, 6); }
        st.skor += Math.round(10 * (1 + st.combo * 0.5));
        if (t.sp) aktifkan(t, r, c, antre, besar, sudah);
      }
      return n;
    }
    function aktifkan(t, r, c, antre, besar, sudah) {
      const tambah = (rr, cc) => { if (sah(rr, cc)) antre.push([rr, cc, false]); };
      const rad = besar ? 2 : 1;
      if (t.sp === "sapuH" || t.sp === "sapuV") {
        const lebar = besar ? [-1, 0, 1] : [0];
        for (const d of lebar) {
          if (t.sp === "sapuH") { for (let x = 0; x < C; x++) tambah(r + d, x); st.efek.push({ k: "garisH", r: r + d, umur: 0 }); }
          else { for (let y = 0; y < B; y++) tambah(y, c + d); st.efek.push({ k: "garisV", c: c + d, umur: 0 }); }
        }
        bunyi("pukul"); st.getar = Math.max(st.getar, 0.12);
      } else if (t.sp === "bom") {
        for (let y = -rad; y <= rad; y++) for (let x = -rad; x <= rad; x++) tambah(r + y, c + x);
        st.efek.push({ k: "ledak", r, c, rad, umur: 0 }); bunyi("tuang"); st.getar = Math.max(st.getar, 0.25); wow("ledak", r, c);
      } else if (t.sp === "pesawat") {
        for (const [dr, dc] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) tambah(r + dr, c + dc);
        const tuju = sasaranPesawat(sudah);
        if (tuju) {
          tambah(tuju[0], tuju[1]);
          if (besar) for (const [dr, dc] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) tambah(tuju[0] + dr, tuju[1] + dc);
          st.efek.push({ k: "pesawat", r, c, r2: tuju[0], c2: tuju[1], umur: 0 });
        }
        bunyi("kertas");
      } else if (t.sp === "bintang") {
        const j = t.sasaranJ ?? mayoritas();
        for (let y = 0; y < B; y++) for (let x = 0; x < C; x++) { const s = sel[y][x]; if (s.ada && s.t && !s.t.mati && (j === "semua" || s.t.j === j)) { if (t.ubahJadi && s.t.sp == null && j !== "semua") s.t.sp = t.ubahJadi; tambah(y, x); st.efek.push({ k: "sinar", r, c, r2: y, c2: x, umur: 0 }); } }
        bunyi("menang"); st.getar = Math.max(st.getar, 0.35); wow("bintang", r, c);
      }
    }
    function mayoritas() {
      const n = new Array(NJ).fill(0);
      for (const row of sel) for (const s of row) if (s.ada && s.t && !s.t.mati && !s.t.sp) n[s.t.j]++;
      return n.indexOf(Math.max(...n));
    }
    function kenaKardus(r, c) {
      const s = sel[r][c]; s.kardus--; kurangiTarget("kardus", r, c); partikelDi(r, c, "#C9A06A", 8); bunyi("kertas");
      st.efek.push({ k: "kardus", r, c, umur: 0 });
    }
    function kurangiTarget(j, r, c) {
      const t = st.target.find((x) => x.j === j && x.sisa > 0);
      if (!t) return;
      t.sisa--;
      st.terbang.push({ j, x: c, y: r, ke: st.target.indexOf(t), umur: 0 });
    }
    function partikelDi(r, c, warna, n) {
      if (opsi.ringan) return;
      for (let i = 0; i < n; i++) { const a = rnd() * Math.PI * 2, v = 1.5 + rnd() * 2.5; st.partikel.push({ x: c + 0.5, y: r + 0.5, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 1.5, umur: 0, warna }); }
    }
    const bunyi = (n) => opsi.bunyi?.(n);
    const wow = (n, r, c) => opsi.wow?.(n, r, c);

    /* ---------- satu putaran penyelesaian ---------- */
    let asalTukar = [];
    function selesaikan() {
      const grup = cariGrup();
      if (!grup.length) return false;
      const cocok = new Set(), semua = [], buatBaru = [];
      for (const g of grup) {
        for (const [r, c] of g.sel) { cocok.add(kunci(r, c)); semua.push([r, c]); }
        if (g.sp) {
          const asal = asalTukar.find(([r, c]) => g.sel.some(([a, b]) => a === r && b === c));
          const [r, c] = asal || g.tengah;
          buatBaru.push({ r, c, sp: g.sp, j: g.j });
        }
      }
      st.combo++;
      st.comboMaks = Math.max(st.comboMaks, st.combo);
      ledakkan(semua, { cocok });
      // benda spesial baru muncul di tempatnya
      for (const b of buatBaru) {
        const s = sel[b.r][b.c];
        if (!s.ada || s.kardus) continue;
        const t = benda(b.j, b.r, b.c); t.sp = b.sp; t.lahir = 0.01; t.mendarat = 0.2;
        s.tBaru = t; st.skor += 30; st.spesialDibuat++;
        bunyi("poin");
        st.teks.push({ t: { sapuH: "Sapu!", sapuV: "Sapu!", pesawat: "Pesawat kertas!", bom: "Ember air!", bintang: "BINTANG BIRU!" }[b.sp], x: b.c + 0.5, y: b.r, umur: 0 });
        if (b.sp === "bintang") wow("bintangBaru", b.r, b.c);
      }
      asalTukar = [];
      if (st.combo >= 3) {
        const kata = ["", "", "", "Rapi.", "Rapi sekali.", "Bu Ratna terharu.", "Pak Satpam memberi hormat.", "Oyen bangun untuk melihat.", "ATAPNYA BERKILAU."][Math.min(8, st.combo)];
        st.teks.push({ t: kata, x: C / 2, y: B * 0.42, umur: 0, besar: true });
        if (st.combo >= 4) wow("combo", B / 2, C / 2);
      }
      st.fase = "hapus"; st.timer = POP;
      return true;
    }
    function buangYangMati() {
      for (let r = 0; r < B; r++) for (let c = 0; c < C; c++) {
        const s = sel[r][c];
        if (s.t && s.t.mati) s.t = null;
        if (s.tBaru) { s.t = s.tBaru; s.tBaru = null; }
      }
    }
    function gravitasi() {
      for (let c = 0; c < C; c++) {
        // bagi kolom menjadi ruas yang dipisah kardus
        const ruas = []; let kini = [];
        for (let r = 0; r < B; r++) {
          const s = sel[r][c];
          if (!s.ada) continue;
          if (s.kardus) { if (kini.length) ruas.push(kini); kini = []; continue; }
          kini.push(r);
        }
        if (kini.length) ruas.push(kini);
        for (const rs of ruas) {
          const isi = [];
          for (let i = rs.length - 1; i >= 0; i--) { const t = sel[rs[i]][c].t; if (t) isi.push(t); sel[rs[i]][c].t = null; }
          let i = rs.length - 1;
          for (const t of isi) { const r = rs[i--]; sel[r][c].t = t; t.r = r; t.c = c; }
          let lahir = 0;
          for (; i >= 0; i--) { const r = rs[i]; lahir++; const t = benda(Math.floor(rnd() * NJ), r, c, rs[0] - lahir - 0.2); sel[r][c].t = t; }
        }
      }
      st.fase = "jatuh";
    }
    function semuaDiam() {
      for (const row of sel) for (const s of row) if (s.t && (Math.abs(s.t.y - s.t.r) > 0.001 || Math.abs(s.t.x - s.t.c) > 0.001)) return false;
      return true;
    }
    const menang = () => st.target.every((t) => t.sisa <= 0);
    function akhirGiliran() {
      st.combo = 0;
      if (menang()) { mulaiBonus(); return; }
      if (st.langkah <= 0) { st.fase = "kalah"; opsi.saatSelesai?.({ menang: false, skor: st.skor }); return; }
      if (!cariGerak()) acakUlang(true);
      st.fase = "diam"; st.diam = 0; st.hint = null;
      opsi.saatUbah?.(st);
    }

    /* ---------- bonus: sisa langkah jadi kembang api ---------- */
    let bonusTimer = 0, bonusDaftar = [];
    function mulaiBonus() {
      st.fase = "bonus"; bonusTimer = 0.35; bonusDaftar = [];
      st.teks.push({ t: st.langkah > 0 ? "BONUS ATAP!" : "BERES!", x: C / 2, y: B * 0.4, umur: 0, besar: true, lama: 1.4 });
      wow("menang", B / 2, C / 2); bunyi("menang");
    }
    function langkahBonus(dt) {
      bonusTimer -= dt;
      if (bonusTimer > 0) return;
      if (st.langkah > 0 && bonusDaftar.length < 12) {
        const calon = [];
        for (const row of sel) for (const s of row) if (s.ada && !s.kardus && s.t && !s.t.sp && !s.t.mati) calon.push(s.t);
        if (calon.length) {
          const t = calon[Math.floor(rnd() * calon.length)];
          t.sp = ["sapuH", "sapuV", "bom", "pesawat"][Math.floor(rnd() * 4)]; t.lahir = 0.01; bonusDaftar.push(t);
          st.langkah--; st.skor += 60; bunyi("klik");
          bonusTimer = 0.12; return;
        }
      }
      // ledakkan semua spesial yang tersisa di papan
      const sp = [];
      for (let r = 0; r < B; r++) for (let c = 0; c < C; c++) { const s = sel[r][c]; if (s.ada && s.t && s.t.sp && !s.t.mati) sp.push([r, c]); }
      st.skor += st.langkah * 60; st.langkah = 0;
      if (sp.length) { ledakkan(sp, { cocok: null }); st.fase = "hapus"; st.timer = POP; st.setelahBonus = true; return; }
      st.fase = "menang";
      opsi.saatSelesai?.({ menang: true, skor: st.skor, comboMaks: st.comboMaks, spesial: st.spesialDibuat });
    }

    /* ---------- masukan pemain ---------- */
    function bisaMain() { return st.fase === "diam"; }
    function coba(r1, c1, r2, c2) {
      if (!bisaMain() || !sah(r1, c1) || !sah(r2, c2)) return false;
      if (Math.abs(r1 - r2) + Math.abs(c1 - c2) !== 1) return false;
      const a = sel[r1][c1], b = sel[r2][c2];
      if (a.kardus || b.kardus || !a.t || !b.t) return false;
      tukarIsi(r1, c1, r2, c2);
      const ta = a.t, tb = b.t;   // ta sekarang di (r1,c1) = benda yang semula di (r2,c2)
      const spesial = ta.sp || tb.sp;
      const valid = spesial || adaCocokDi(r1, c1) || adaCocokDi(r2, c2);
      st.tukar = { r1, c1, r2, c2, t: 0, valid, ta, tb };
      st.fase = "tukar"; st.pilih = null; st.hint = null; st.diam = 0;
      bunyi(valid ? "klik" : "salah");
      return valid;
    }
    function setelahTukar() {
      const { r1, c1, r2, c2, valid, ta, tb } = st.tukar;
      st.tukar = null;
      if (!valid) { tukarIsi(r1, c1, r2, c2); st.fase = "batal"; return; }
      st.langkah--; st.gerakan++;
      asalTukar = [[r2, c2], [r1, c1]];
      opsi.saatGerak?.(st);
      // spesial yang ditukar langsung aktif
      const aktif = [];
      if (ta.sp === "bintang" && tb.sp === "bintang") { ta.sasaranJ = "semua"; aktif.push([r1, c1]); }
      else if (ta.sp === "bintang" || tb.sp === "bintang") {
        const [bin, lain, rb, cb] = ta.sp === "bintang" ? [ta, tb, r1, c1] : [tb, ta, r2, c2];
        bin.sasaranJ = lain.j; if (lain.sp) bin.ubahJadi = lain.sp; aktif.push([rb, cb]);
      } else {
        if (ta.sp) aktif.push([r1, c1]);
        if (tb.sp) aktif.push([r2, c2]);
      }
      if (aktif.length) {
        st.combo = 1;
        ledakkan(aktif, { besar: !!(ta.sp && tb.sp) });
        // cocokan biasa dari benda yang tidak ikut terhapus tetap diproses sesudah jatuh
        st.fase = "hapus"; st.timer = POP;
        return;
      }
      if (!selesaikan()) akhirGiliran();
    }
    function ketukSpesial(r, c) {
      if (!bisaMain() || !sah(r, c)) return false;
      const t = sel[r][c].t;
      if (!t || !t.sp) return false;
      st.langkah--; st.gerakan++; st.combo = 1; st.pilih = null;
      opsi.saatGerak?.(st);
      ledakkan([[r, c]]);
      st.fase = "hapus"; st.timer = POP;
      return true;
    }
    function tambahLangkah(n) { st.langkah += n; st.tambahanDipakai = true; st.fase = "diam"; st.diam = 0; }

    /* ---------- waktu ---------- */
    function tick(dt) {
      // animasi benda
      for (const row of sel) for (const s of row) {
        const t = s.t; if (!t) continue;
        if (st.fase !== "tukar") {
          if (t.y < t.r) { t.vy += 38 * dt; t.y = Math.min(t.r, t.y + t.vy * dt); if (t.y >= t.r) { t.vy = 0; t.mendarat = 0.12; } }
          else if (t.y > t.r) { t.y = Math.max(t.r, t.y - 9 * dt); }
          if (t.x !== t.c) { const d = t.c - t.x; t.x += Math.sign(d) * Math.min(Math.abs(d), 9 * dt); }
        }
        if (t.mendarat > 0) t.mendarat -= dt;
        if (t.mati) t.pop += dt;
        if (t.lahir) t.lahir = Math.min(1, t.lahir + dt * 4);
      }
      for (const row of sel) for (const s of row) if (s.tBaru && s.tBaru.lahir) s.tBaru.lahir = Math.min(1, s.tBaru.lahir + dt * 4);
      if (st.fase === "tukar") {
        const w = st.tukar; w.t = Math.min(1, w.t + dt / TUKAR);
        const e = w.t * w.t * (3 - 2 * w.t);
        w.ta.x = w.c2 + (w.c1 - w.c2) * e; w.ta.y = w.r2 + (w.r1 - w.r2) * e;
        w.tb.x = w.c1 + (w.c2 - w.c1) * e; w.tb.y = w.r1 + (w.r2 - w.r1) * e;
        if (w.t >= 1) setelahTukar();
      } else if (st.fase === "batal") {
        if (semuaDiam()) { st.fase = "diam"; }
      } else if (st.fase === "hapus") {
        st.timer -= dt;
        if (st.timer <= 0) { buangYangMati(); gravitasi(); }
      } else if (st.fase === "jatuh") {
        if (semuaDiam()) {
          if (selesaikan()) return;
          if (st.setelahBonus) { st.setelahBonus = false; st.fase = "bonus"; bonusTimer = 0.2; return; }
          akhirGiliran();
        }
      } else if (st.fase === "bonus") langkahBonus(dt);
      else if (st.fase === "diam") {
        st.diam += dt;
        if (st.diam > 5 && !st.hint) st.hint = cariGerak();
      }
      // efek
      for (const arr of [st.efek, st.terbang, st.teks]) for (let i = arr.length - 1; i >= 0; i--) { arr[i].umur += dt; if (arr[i].umur > (arr[i].lama || (arr === st.terbang ? TERBANG : arr === st.teks ? 0.95 : 0.4))) arr.splice(i, 1); }
      for (let i = st.partikel.length - 1; i >= 0; i--) { const p = st.partikel[i]; p.umur += dt; p.vy += 9 * dt; p.x += p.vx * dt; p.y += p.vy * dt; if (p.umur > 0.6) st.partikel.splice(i, 1); }
      if (st.getar > 0) st.getar = Math.max(0, st.getar - dt);
    }

    /* =========================================================
       GAMBAR
       ========================================================= */
    let tata = null;
    function aturTata(W, H, atas = 74) {
      const sisiW = W - 16, sisiH = H - atas - 14;
      const uk = Math.floor(Math.min(sisiW / C, sisiH / B));
      tata = { uk, x: Math.round((W - uk * C) / 2), y: Math.round(atas + (sisiH - uk * B) / 2), W, H, atas };
      return tata;
    }
    const FONT = (n) => `${n}px "Pixelify Sans", "Courier New", monospace`;
    function teks(ctx, t, x, y, n, warna, align = "center") {
      ctx.font = FONT(n); ctx.textAlign = align; ctx.textBaseline = "middle";
      ctx.lineWidth = Math.max(2, n / 5); ctx.strokeStyle = OL; ctx.strokeText(t, x, y);
      ctx.fillStyle = warna; ctx.fillText(t, x, y);
    }
    function ikonTarget(ctx, j, x, y, uk) {
      if (j === "debu") { ctx.fillStyle = "#B79F7A"; ctx.fillRect(x, y, uk, uk); ctx.fillStyle = "#8E7756"; for (let i = 0; i < 5; i++) ctx.fillRect(x + (i * 7 % uk), y + ((i * 11) % uk), 3, 3); ctx.strokeStyle = OL; ctx.lineWidth = 2; ctx.strokeRect(x, y, uk, uk); return; }
      const g = gambarGrid(j === "kardus" ? "kardus" : JENIS[j].id);
      if (g) ctx.drawImage(g, x, y, uk, uk);
    }
    function gambar(ctx, W, H, waktu = 0) {
      if (!tata || tata.W !== W || tata.H !== H) aturTata(W, H, opsi.atas ?? 74);
      const { uk, x: ox0, y: oy0 } = tata;
      const gx = st.getar > 0 ? (Math.random() - 0.5) * st.getar * 18 : 0, gy = st.getar > 0 ? (Math.random() - 0.5) * st.getar * 18 : 0;
      const ox = ox0 + gx, oy = oy0 + gy;
      ctx.imageSmoothingEnabled = false;
      // papan
      for (let r = 0; r < B; r++) for (let c = 0; c < C; c++) {
        const s = sel[r][c]; if (!s.ada) continue;
        const x = ox + c * uk, y = oy + r * uk;
        ctx.fillStyle = (r + c) % 2 ? "#DCE8F2" : "#EAF2F8";
        ctx.fillRect(x, y, uk, uk);
        if (s.debu) {
          ctx.fillStyle = s.debu > 1 ? "#A88D63" : "#C9B48E"; ctx.fillRect(x + 1, y + 1, uk - 2, uk - 2);
          ctx.fillStyle = s.debu > 1 ? "#7E6646" : "#A88D63";
          for (let i = 0; i < 6; i++) ctx.fillRect(x + ((i * 13 + r * 5) % (uk - 6)) + 2, y + ((i * 17 + c * 7) % (uk - 6)) + 2, 3, 3);
        }
      }
      // bingkai papan
      ctx.strokeStyle = OL; ctx.lineWidth = 3;
      for (let r = 0; r < B; r++) for (let c = 0; c < C; c++) {
        if (!sel[r][c].ada) continue;
        const x = ox + c * uk, y = oy + r * uk;
        ctx.beginPath();
        if (!sah(r - 1, c)) { ctx.moveTo(x, y); ctx.lineTo(x + uk, y); }
        if (!sah(r + 1, c)) { ctx.moveTo(x, y + uk); ctx.lineTo(x + uk, y + uk); }
        if (!sah(r, c - 1)) { ctx.moveTo(x, y); ctx.lineTo(x, y + uk); }
        if (!sah(r, c + 1)) { ctx.moveTo(x + uk, y); ctx.lineTo(x + uk, y + uk); }
        ctx.stroke();
      }
      // petunjuk & pilihan
      const sorot = (r, c, warna, a = 1) => { ctx.globalAlpha = a; ctx.strokeStyle = warna; ctx.lineWidth = 3; ctx.strokeRect(ox + c * uk + 2, oy + r * uk + 2, uk - 4, uk - 4); ctx.globalAlpha = 1; };
      if (st.hint && st.fase === "diam") { const a = 0.5 + 0.5 * Math.sin(waktu * 6); for (const [r, c] of st.hint) sorot(r, c, "#F2C14E", a); }
      if (st.pilih) sorot(st.pilih[0], st.pilih[1], "#FFFDF6");
      // benda (dipotong di dalam papan agar yang jatuh dari atas tidak terlihat)
      ctx.save(); ctx.beginPath(); ctx.rect(ox, oy, uk * C, uk * B); ctx.clip();
      for (const row of sel) for (const s of row) {
        for (const t of [s.t, s.tBaru]) {
          if (!t) continue;
          let sk = 1;
          if (t.mati) sk = Math.max(0, 1 - t.pop / POP) * (1 + 0.3 * Math.min(1, t.pop / POP));
          if (t.lahir && t.lahir < 1) sk = t.lahir;
          if (t.mendarat > 0) sk *= 1 + t.mendarat * 0.8;
          if (sk <= 0) continue;
          const cx = ox + (t.x + 0.5) * uk, cy = oy + (t.y + 0.5) * uk;
          gambarBenda(ctx, t, cx, cy, uk * 0.86 * sk, waktu);
        }
      }
      ctx.restore();
      // kardus
      for (let r = 0; r < B; r++) for (let c = 0; c < C; c++) {
        const s = sel[r][c]; if (!s.ada || !s.kardus) continue;
        const g = gambarGrid("kardus"); const x = ox + c * uk, y = oy + r * uk;
        if (g) ctx.drawImage(g, x + 1, y + 1, uk - 2, uk - 2);
        if (s.kardus > 1) { ctx.fillStyle = "#B5443A"; ctx.fillRect(x + uk * 0.2, y + uk * 0.55, uk * 0.6, uk * 0.14); teks(ctx, "2", x + uk * 0.78, y + uk * 0.22, Math.round(uk * 0.3), "#FFFDF6"); }
      }
      // efek
      for (const e of st.efek) {
        const a = 1 - e.umur / 0.4;
        ctx.globalAlpha = Math.max(0, a);
        if (e.k === "garisH") { ctx.fillStyle = "#FFFDF6"; ctx.fillRect(ox, oy + (e.r + 0.5) * uk - uk * 0.18 * a, uk * C, uk * 0.36 * a); }
        else if (e.k === "garisV") { ctx.fillStyle = "#FFFDF6"; ctx.fillRect(ox + (e.c + 0.5) * uk - uk * 0.18 * a, oy, uk * 0.36 * a, uk * B); }
        else if (e.k === "ledak") { ctx.fillStyle = "#7FC8F2"; ctx.beginPath(); ctx.arc(ox + (e.c + 0.5) * uk, oy + (e.r + 0.5) * uk, uk * (e.rad + 0.5) * (1.2 - a * 0.4), 0, 7); ctx.fill(); }
        else if (e.k === "pesawat") {
          const p = Math.min(1, e.umur / 0.3); const x = ox + (e.c + 0.5 + (e.c2 - e.c) * p) * uk, y = oy + (e.r + 0.5 + (e.r2 - e.r) * p) * uk - Math.sin(p * Math.PI) * uk;
          ctx.globalAlpha = 1; const g = gambarGrid("kertas"); if (g) ctx.drawImage(g, x - uk * 0.4, y - uk * 0.4, uk * 0.8, uk * 0.8);
        } else if (e.k === "sinar") { ctx.strokeStyle = "#7FC8F2"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(ox + (e.c + 0.5) * uk, oy + (e.r + 0.5) * uk); ctx.lineTo(ox + (e.c2 + 0.5) * uk, oy + (e.r2 + 0.5) * uk); ctx.stroke(); }
        else if (e.k === "kardus") { ctx.strokeStyle = "#FFFDF6"; ctx.lineWidth = 3; ctx.strokeRect(ox + e.c * uk + 3 - (1 - a) * 6, oy + e.r * uk + 3 - (1 - a) * 6, uk - 6 + (1 - a) * 12, uk - 6 + (1 - a) * 12); }
        ctx.globalAlpha = 1;
      }
      for (const p of st.partikel) { ctx.globalAlpha = 1 - p.umur / 0.6; ctx.fillStyle = p.warna; const s = Math.max(2, uk * 0.09); ctx.fillRect(ox + p.x * uk - s / 2, oy + p.y * uk - s / 2, s, s); }
      ctx.globalAlpha = 1;
      // HUD atas: sasaran & langkah
      gambarHud(ctx, W);
      // benda terbang ke ikon sasaran
      for (const f of st.terbang) {
        const p = Math.min(1, f.umur / TERBANG), e = p * p;
        const tx = posTarget(W, f.ke).x + 14, ty = posTarget(W, f.ke).y + 14;
        const x = ox + (f.x + 0.5) * uk + (tx - ox - (f.x + 0.5) * uk) * e, y = oy + (f.y + 0.5) * uk + (ty - oy - (f.y + 0.5) * uk) * e - Math.sin(p * Math.PI) * 30;
        const s = uk * 0.6 * (1 - p * 0.5);
        if (f.j === "debu" || f.j === "kardus") { ctx.fillStyle = f.j === "debu" ? "#B79F7A" : "#C9A06A"; ctx.fillRect(x - s / 3, y - s / 3, s / 1.5, s / 1.5); }
        else { const g = gambarGrid(JENIS[f.j].id); if (g) ctx.drawImage(g, x - s / 2, y - s / 2, s, s); }
      }
      for (const t of st.teks) {
        const p = t.umur / (t.lama || 0.95);
        ctx.globalAlpha = Math.max(0, 1 - Math.max(0, p - 0.6) / 0.4);
        const n = t.besar ? 22 : 15;
        teks(ctx, t.t, t.besar ? W / 2 : ox + t.x * uk, oy + t.y * uk - p * 24, n * (p < 0.12 ? 0.6 + p * 3.3 : 1), t.besar ? "#F2C14E" : "#FFFDF6");
      }
      ctx.globalAlpha = 1;
    }
    function posTarget(W, i) {
      const n = st.target.length, lebar = 64;
      return { x: 12 + i * lebar, y: 12 };
    }
    function gambarHud(ctx, W) {
      // panel sasaran
      const n = st.target.length;
      ctx.fillStyle = "rgba(43,42,38,.82)"; ctx.fillRect(6, 4, 12 + n * 64, 54);
      st.target.forEach((t, i) => {
        const { x, y } = posTarget(W, i);
        ikonTarget(ctx, t.j, x, y, 28);
        if (t.sisa <= 0) teks(ctx, "✓", x + 44, y + 15, 18, "#7FD18B");
        else teks(ctx, String(t.sisa), x + 46, y + 15, 16, "#FFFDF6");
      });
      // langkah
      ctx.fillStyle = "rgba(43,42,38,.82)"; ctx.fillRect(W - 82, 4, 76, 54);
      teks(ctx, String(st.langkah), W - 44, 26, 26, st.langkah <= 3 ? "#FF8A7A" : "#FFFDF6");
      ctx.font = FONT(10); ctx.fillStyle = "#C9D6E2"; ctx.textAlign = "center"; ctx.fillText("langkah", W - 44, 48);
    }
    function gambarBenda(ctx, t, cx, cy, s, waktu) {
      const g = gambarGrid(t.sp === "bintang" ? "bintang" : JENIS[t.j].id);
      if (t.sp === "bintang") { const sk = 1 + 0.06 * Math.sin(waktu * 6); s *= sk; ctx.fillStyle = "rgba(127,200,242,.35)"; ctx.beginPath(); ctx.arc(cx, cy, s * 0.62, 0, 7); ctx.fill(); }
      if (t.sp === "bom") { ctx.fillStyle = "rgba(127,200,242,.5)"; ctx.beginPath(); ctx.arc(cx, cy, s * (0.56 + 0.04 * Math.sin(waktu * 8)), 0, 7); ctx.fill(); }
      if (g) ctx.drawImage(g, cx - s / 2, cy - s / 2, s, s);
      if (t.sp === "sapuH" || t.sp === "sapuV") {
        ctx.fillStyle = "#FFFDF6"; ctx.strokeStyle = OL; ctx.lineWidth = 1.5;
        for (const d of [-0.22, 0.22]) {
          if (t.sp === "sapuH") { ctx.fillRect(cx - s * 0.48, cy + d * s - 2, s * 0.96, 4); ctx.strokeRect(cx - s * 0.48, cy + d * s - 2, s * 0.96, 4); }
          else { ctx.fillRect(cx + d * s - 2, cy - s * 0.48, 4, s * 0.96); ctx.strokeRect(cx + d * s - 2, cy - s * 0.48, 4, s * 0.96); }
        }
      }
      if (t.sp === "pesawat") {
        const b = Math.sin(waktu * 7) * 2;
        ctx.fillStyle = "#FFFDF6"; ctx.strokeStyle = OL; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(cx - s * 0.55, cy - s * 0.1 + b); ctx.lineTo(cx - s * 0.2, cy - s * 0.3 + b); ctx.lineTo(cx - s * 0.2, cy + s * 0.05 + b); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx + s * 0.55, cy - s * 0.1 + b); ctx.lineTo(cx + s * 0.2, cy - s * 0.3 + b); ctx.lineTo(cx + s * 0.2, cy + s * 0.05 + b); ctx.closePath(); ctx.fill(); ctx.stroke();
      }
      if (t.sp === "bom") { ctx.fillStyle = "#3E78C4"; ctx.strokeStyle = OL; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(cx + s * 0.32, cy - s * 0.5); ctx.quadraticCurveTo(cx + s * 0.5, cy - s * 0.18, cx + s * 0.32, cy - s * 0.12); ctx.quadraticCurveTo(cx + s * 0.14, cy - s * 0.18, cx + s * 0.32, cy - s * 0.5); ctx.fill(); ctx.stroke(); }
    }

    /* ---------- sentuhan ---------- */
    let tekanan = null;
    function selDari(x, y) {
      if (!tata) return null;
      const c = Math.floor((x - tata.x) / tata.uk), r = Math.floor((y - tata.y) / tata.uk);
      return sah(r, c) ? [r, c] : null;
    }
    function tekan(x, y) { tekanan = { sel: selDari(x, y), x, y, geser: false }; }
    function geser(x, y) {
      if (!tekanan || !tekanan.sel || tekanan.geser || !tata) return;
      const dx = x - tekanan.x, dy = y - tekanan.y;
      if (Math.hypot(dx, dy) < tata.uk * 0.35) return;
      tekanan.geser = true;
      const [r, c] = tekanan.sel;
      const [dr, dc] = Math.abs(dx) > Math.abs(dy) ? [0, Math.sign(dx)] : [Math.sign(dy), 0];
      coba(r, c, r + dr, c + dc);
    }
    function lepas(x, y) {
      const t = tekanan; tekanan = null;
      if (!t || t.geser || !bisaMain()) return;
      const s = selDari(x, y);
      if (!s || !t.sel || s[0] !== t.sel[0] || s[1] !== t.sel[1]) return;
      const [r, c] = s;
      if (st.pilih) {
        const [pr, pc] = st.pilih;
        if (pr === r && pc === c) { if (sel[r][c].t?.sp) ketukSpesial(r, c); else st.pilih = null; return; }
        if (Math.abs(pr - r) + Math.abs(pc - c) === 1) { coba(pr, pc, r, c); return; }
      }
      if (sel[r][c].t && !sel[r][c].kardus) { st.pilih = [r, c]; opsi.bunyi?.("klik"); }
    }

    isiAwal();
    return {
      st, sel, tick, gambar, tekan, geser, lepas, coba, ketukSpesial, tambahLangkah, cariGerak, aturTata,
      get tata() { return tata; },
      // untuk pengujian: mainkan satu gerakan rakus
      gerakRakus() {
        if (!bisaMain()) return false;
        let terbaik = null, nilai = -1;
        for (let r = 0; r < B; r++) for (let c = 0; c < C; c++) {
          const s = sel[r][c]; if (!s.ada || s.kardus || !s.t) continue;
          if (s.t.sp) { const v = 50 + rnd(); if (v > nilai) { nilai = v; terbaik = ["ketuk", r, c]; } }
          for (const [dr, dc] of [[0, 1], [1, 0]]) {
            const r2 = r + dr, c2 = c + dc;
            if (!sah(r2, c2) || sel[r2][c2].kardus || !sel[r2][c2].t) continue;
            tukarIsi(r, c, r2, c2);
            let v = -1;
            if (adaCocokDi(r, c) || adaCocokDi(r2, c2)) { const g = cariGrup(); const dekatKardus = (y, z) => [[0, 1], [1, 0], [0, -1], [-1, 0]].some(([a, b]) => sah(y + a, z + b) && sel[y + a][z + b].kardus);
              v = g.reduce((a, x) => a + x.sel.length + (x.sp ? 6 : 0) + x.sel.filter(([y, z]) => sel[y][z].debu || dekatKardus(y, z) || st.target.some((t) => t.j === x.j && t.sisa > 0)).length * 3, 0) + rnd(); }
            tukarIsi(r, c, r2, c2);
            if (v > nilai) { nilai = v; terbaik = [r, c, r2, c2]; }
          }
        }
        if (!terbaik) return false;
        if (terbaik[0] === "ketuk") return ketukSpesial(terbaik[1], terbaik[2]);
        return coba(...terbaik);
      },
    };
  }

  K.PUZZLE = { buat, buatLevel, JENIS, gambarGrid, rng32 };
})();
