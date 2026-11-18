/* =========================================================
   Kantor Layanan Perasaan · Atap Biru · gambar piksel
   - Penyangga piksel kecil (warna + transparan), diperbesar tajam
   - Pemandangan atap 160×200 yang berubah mengikuti renovasi,
     gaya pilihan, jam (pagi/siang/sore/malam), dan hadiah teman
   - Karakter Mira 18×26 dengan baju dari lemari
   ========================================================= */
(() => {
  "use strict";
  const K = window.KLP;
  const OL = "#2B2A26";

  /* ---------- penyangga piksel ---------- */
  const warnaCache = {};
  function rgba(w) {
    if (warnaCache[w]) return warnaCache[w];
    let h = w.replace("#", "");
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    const v = [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), h.length >= 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1];
    return (warnaCache[w] = v);
  }
  class Piksel {
    constructor(w, h) { this.w = w; this.h = h; this.d = new Uint8ClampedArray(w * h * 4); }
    p(x, y, w) {
      x |= 0; y |= 0;
      if (x < 0 || y < 0 || x >= this.w || y >= this.h || !w) return;
      const [r, g, b, a] = rgba(w), i = (y * this.w + x) * 4, d = this.d;
      if (a >= 1) { d[i] = r; d[i + 1] = g; d[i + 2] = b; d[i + 3] = 255; return; }
      const a0 = d[i + 3] / 255, ao = a + a0 * (1 - a);
      if (ao <= 0) return;
      d[i] = (r * a + d[i] * a0 * (1 - a)) / ao; d[i + 1] = (g * a + d[i + 1] * a0 * (1 - a)) / ao; d[i + 2] = (b * a + d[i + 2] * a0 * (1 - a)) / ao; d[i + 3] = ao * 255;
    }
    r(x, y, w, h, c) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.p(x + i, y + j, c); }
    kotak(x, y, w, h, isi, garis = OL) { this.r(x, y, w, h, garis); if (w > 2 && h > 2) this.r(x + 1, y + 1, w - 2, h - 2, isi); }
    garis(x0, y0, x1, y1, c) {
      x0 |= 0; y0 |= 0; x1 |= 0; y1 |= 0;
      const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
      let e = dx + dy;
      for (;;) { this.p(x0, y0, c); if (x0 === x1 && y0 === y1) break; const e2 = 2 * e; if (e2 >= dy) { e += dy; x0 += sx; } if (e2 <= dx) { e += dx; y0 += sy; } }
    }
    ada(x, y) { return x >= 0 && y >= 0 && x < this.w && y < this.h && this.d[(y * this.w + x) * 4 + 3] > 0; }
    garisLuar(c = OL) {
      const tandai = [];
      for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++) if (!this.ada(x, y) && (this.ada(x - 1, y) || this.ada(x + 1, y) || this.ada(x, y - 1) || this.ada(x, y + 1))) tandai.push([x, y]);
      for (const [x, y] of tandai) this.p(x, y, c);
    }
    tempel(lain, ox, oy, balik = false) {
      for (let y = 0; y < lain.h; y++) for (let x = 0; x < lain.w; x++) {
        const i = (y * lain.w + x) * 4; if (lain.d[i + 3] === 0) continue;
        const hx = (n) => n.toString(16).padStart(2, "0");
        this.p(ox + (balik ? lain.w - 1 - x : x), oy + y, `#${hx(lain.d[i])}${hx(lain.d[i + 1])}${hx(lain.d[i + 2])}${hx(lain.d[i + 3])}`);
      }
    }
    sprite(nama, ox, oy, balik = false) {
      const s = window.SPRITE?.data?.(nama);
      if (!s) return;
      s.g.forEach((row, y) => [...row].forEach((ch, x) => { if (ch !== ".") this.p(ox + (balik ? 11 - x : x), oy + y, s.p[ch]); }));
    }
    keKanvas(kanvas) {
      kanvas.width = this.w; kanvas.height = this.h;
      kanvas.getContext("2d").putImageData(new ImageData(this.d, this.w, this.h), 0, 0);
      return kanvas;
    }
  }

  /* ---------- karakter Mira ---------- */
  const D = () => K.ATAP_DATA;
  function gelap(w, f = 0.75) { const [r, g, b] = rgba(w); const h = (n) => Math.round(n * f).toString(16).padStart(2, "0"); return `#${h(r)}${h(g)}${h(b)}`; }
  function terang(w, f = 0.35) { const [r, g, b] = rgba(w); const h = (n) => Math.round(n + (255 - n) * f).toString(16).padStart(2, "0"); return `#${h(r)}${h(g)}${h(b)}`; }
  function avatar(b) {
    const d = D();
    const A = new Piksel(20, 28);
    const kulit = d.KULIT[b.kulit]?.[0] || d.KULIT[1][0];
    const rambut = d.WARNA_RAMBUT[b.wRambut]?.[0] || d.WARNA_RAMBUT[0][0];
    const wa = d.WARNA_BAJU[b.wAtas]?.[0] || "#3E78C4", wb = d.WARNA_BAJU[b.wBawah]?.[0] || "#2F4A6B", ws = d.WARNA_BAJU[b.wSepatu]?.[0] || "#F4F1E8", wk = d.WARNA_BAJU[b.wAks]?.[0] || "#7FC8F2";
    const X = 1; // geser 1 piksel untuk ruang garis luar
    const r = (x, y, w, h, c) => A.r(x + X, y, w, h, c);
    // rambut belakang
    if (b.rambut === "panjang") r(4, 4, 10, 15, rambut);
    if (b.rambut === "kuncir") { r(13, 5, 3, 3, rambut); r(14, 8, 2, 7, rambut); }
    if (b.rambut === "cepol") r(6, 0, 6, 3, rambut);
    if (b.rambut === "bob") r(4, 4, 10, 9, rambut);
    // lengan & badan
    const lenganPendek = b.atas === "kaus";
    r(3, 13, 2, 6, lenganPendek ? kulit : wa); r(13, 13, 2, 6, lenganPendek ? kulit : wa);
    if (lenganPendek) { r(3, 13, 2, 2, wa); r(13, 13, 2, 2, wa); }
    r(3, 19, 2, 1, kulit); r(13, 19, 2, 1, kulit);
    r(5, 12, 8, 7, wa);
    if (b.atas === "hoodie") { r(6, 12, 6, 1, gelap(wa)); r(7, 16, 4, 2, gelap(wa)); r(8, 13, 1, 2, "#F4F1E8"); r(10, 13, 1, 2, "#F4F1E8"); }
    if (b.atas === "kemeja") { r(7, 12, 4, 1, "#F4F1E8"); r(9, 14, 1, 1, "#F4F1E8"); r(9, 16, 1, 1, "#F4F1E8"); r(5, 18, 8, 1, gelap(wa, 0.85)); }
    if (b.atas === "jersey") { r(3, 15, 2, 1, "#F4F1E8"); r(13, 15, 2, 1, "#F4F1E8"); r(9, 12, 1, 7, gelap(wa)); r(7, 12, 4, 1, "#F4F1E8"); }
    if (b.atas === "sweater") { r(5, 18, 8, 1, gelap(wa)); r(5, 15, 8, 1, terang(wa)); r(3, 18, 2, 1, gelap(wa)); r(13, 18, 2, 1, gelap(wa)); }
    if (b.atas === "kardigan") { r(8, 12, 2, 7, "#F4F1E8"); r(7, 14, 1, 1, gelap(wa)); r(7, 16, 1, 1, gelap(wa)); }
    if (b.atas === "kaus") { r(7, 12, 4, 1, gelap(wa)); }
    // bawahan
    if (b.bawah === "jins") { r(5, 19, 8, 2, wb); r(5, 21, 3, 3, wb); r(10, 21, 3, 3, wb); r(8, 19, 1, 1, terang(wb)); }
    if (b.bawah === "training") { r(5, 19, 8, 2, wb); r(5, 21, 3, 3, wb); r(10, 21, 3, 3, wb); r(5, 19, 1, 5, "#F4F1E8"); r(12, 19, 1, 5, "#F4F1E8"); }
    if (b.bawah === "rok") { r(5, 19, 8, 1, wb); r(4, 20, 10, 2, wb); r(4, 21, 10, 1, gelap(wb)); r(6, 22, 2, 2, kulit); r(10, 22, 2, 2, kulit); }
    if (b.bawah === "kulot") { r(5, 19, 8, 1, wb); r(4, 20, 4, 4, wb); r(10, 20, 4, 4, wb); r(8, 20, 2, 2, wb); }
    // sepatu
    if (b.sepatu === "sneakers") { r(4, 24, 4, 2, ws); r(10, 24, 4, 2, ws); r(4, 25, 4, 1, "#F4F1E8"); r(10, 25, 4, 1, "#F4F1E8"); }
    if (b.sepatu === "bot") { r(5, 21, 3, 5, ws); r(10, 21, 3, 5, ws); r(4, 25, 4, 1, gelap(ws)); r(10, 25, 4, 1, gelap(ws)); }
    if (b.sepatu === "sandal") { r(5, 24, 3, 1, kulit); r(10, 24, 3, 1, kulit); r(4, 25, 4, 1, ws); r(10, 25, 4, 1, ws); }
    // leher & kepala
    r(8, 11, 2, 1, kulit);
    r(5, 3, 8, 8, kulit);
    r(4, 6, 1, 2, kulit); r(13, 6, 1, 2, kulit);
    // wajah
    r(7, 7, 1, 2, OL); r(10, 7, 1, 2, OL);
    r(6, 9, 1, 1, gelap(kulit, 0.9)); r(11, 9, 1, 1, gelap(kulit, 0.9));
    r(8, 9, 2, 1, gelap(kulit, 0.6));
    // rambut depan
    if (b.rambut === "pendek") { r(5, 2, 8, 2, rambut); r(4, 3, 1, 5, rambut); r(13, 3, 1, 5, rambut); r(5, 4, 3, 1, rambut); r(10, 4, 2, 1, rambut); }
    if (b.rambut === "panjang") { r(5, 2, 8, 2, rambut); r(4, 3, 2, 13, rambut); r(12, 3, 2, 13, rambut); r(6, 4, 2, 1, rambut); r(10, 4, 2, 1, rambut); }
    if (b.rambut === "kuncir") { r(5, 2, 8, 2, rambut); r(4, 3, 1, 4, rambut); r(13, 3, 1, 5, rambut); r(5, 4, 2, 1, rambut); }
    if (b.rambut === "cepol") { r(5, 2, 8, 2, rambut); r(4, 3, 1, 4, rambut); r(13, 3, 1, 4, rambut); r(6, 4, 1, 1, rambut); r(11, 4, 1, 1, rambut); }
    if (b.rambut === "poni") { r(5, 2, 8, 4, rambut); r(4, 3, 1, 9, rambut); r(13, 3, 1, 9, rambut); r(7, 6, 1, 0, rambut); }
    if (b.rambut === "bob") { r(4, 2, 10, 3, rambut); r(4, 5, 2, 7, rambut); r(12, 5, 2, 7, rambut); r(6, 5, 1, 1, rambut); }
    // aksesori
    if (b.aksesori === "jepit") { r(11, 3, 2, 1, wk); }
    if (b.aksesori === "kacamata") { r(6, 6, 3, 1, OL); r(9, 6, 3, 1, OL); r(6, 7, 1, 2, OL); r(11, 7, 1, 2, OL); r(8, 7, 2, 1, OL); }
    if (b.aksesori === "topi") { r(4, 1, 10, 3, wk); r(12, 3, 4, 1, gelap(wk)); r(8, 1, 2, 1, terang(wk)); }
    if (b.aksesori === "syal") { r(5, 11, 8, 2, wk); r(10, 13, 2, 3, wk); r(10, 15, 2, 1, gelap(wk)); }
    if (b.aksesori === "headphone") { r(4, 1, 10, 1, OL); r(3, 2, 1, 4, OL); r(14, 2, 1, 4, OL); r(2, 5, 3, 4, wk); r(13, 5, 3, 4, wk); }
    if (b.aksesori === "lightstick") { r(15, 15, 1, 6, OL); r(14, 11, 3, 4, wk); r(15, 12, 1, 2, "#FFFDF6"); }
    A.garisLuar();
    return A;
  }

  /* ---------- pemandangan atap ---------- */
  const W = 160, H = 200;
  const LANGIT = {
    pagi: ["#BFE3F7", "#A6D4F2", "#8EC6EC", "#DDF0F8"],
    siang: ["#5FA7E3", "#73B4E8", "#8EC6EC", "#BFE3F7"],
    sore: ["#E9925A", "#EFA866", "#F2C07A", "#F7D9A6"],
    malam: ["#16203A", "#1E2B4A", "#26385E", "#2F4A6B"],
  };
  function waktuDari(jam) { return jam >= 5 && jam < 10 ? "pagi" : jam < 15 && jam >= 10 ? "siang" : jam >= 15 && jam < 18 ? "sore" : "malam"; }
  const hash = (n) => { let x = Math.sin(n * 127.1) * 43758.5453; return x - Math.floor(x); };

  // st: { tugas: {id: gayaIndex}, baju, hadiah: [{id, dari}] } · opsi: { jam, t (detik), suratBaru }
  function atap(st, opsi = {}) {
    const P = new Piksel(W, H);
    const t = opsi.t || 0;
    const sudah = (id) => st.tugas[id] !== undefined;
    const gaya = (id) => { const tg = D().SEMUA_TUGAS.find((x) => x.id === id); return tg?.gaya?.[st.tugas[id]]?.[0] ?? tg?.gaya?.[0]?.[0]; };
    const areaBeres = (aid) => D().AREA.find((a) => a.id === aid).tugas.every((x) => sudah(x.id));
    const sisaArea = (aid) => D().AREA.find((a) => a.id === aid).tugas.filter((x) => !sudah(x.id)).length;
    const wkt = opsi.waktu || waktuDari(opsi.jam ?? new Date().getHours());
    const malam = wkt === "malam";

    // langit berpita
    const L = LANGIT[wkt];
    for (let y = 0; y < 90; y++) { const k = Math.min(3, Math.floor((y / 90) * 4 + (hash(y) - 0.5) * 0.3)); P.r(0, y, W, 1, L[k]); }
    if (malam) {
      for (let i = 0; i < 40; i++) { const x = Math.floor(hash(i) * W), y = Math.floor(hash(i + 50) * 60); if ((t * 2 + i) % 7 < 6) P.p(x, y, hash(i + 9) > 0.7 ? "#FFF3C4" : "#C9D6E2"); }
      P.r(128, 10, 8, 8, "#FFF3C4"); P.r(131, 10, 5, 6, L[0]);   // bulan sabit
    } else if (wkt === "pagi") { P.r(18, 18, 10, 10, "#FFF3C4"); }
    else if (wkt === "sore") { P.r(20, 50, 14, 10, "#F7D06A"); }
    else { P.r(130, 12, 10, 10, "#FFF6D0"); }
    // awan
    if (!malam) for (const [x0, y0] of [[30 + (t * 1.5) % 200 - 40, 22], [100 + (t * 1) % 200 - 60, 34]]) { P.r(x0, y0, 22, 4, "#FFFFFFCC"); P.r(x0 + 5, y0 - 3, 12, 3, "#FFFFFFCC"); }
    // gedung-gedung kota
    const kota = [[0, 58, 18], [16, 50, 14], [28, 62, 20], [46, 46, 12], [56, 56, 22], [76, 40, 14], [88, 60, 18], [104, 52, 12], [114, 64, 16], [150, 54, 12]];
    for (const [x, y, w] of kota) {
      const wg = malam ? "#24304A" : wkt === "sore" ? "#B97D63" : "#8FA9C4";
      P.r(x, y, w, 90 - y, wg);
      for (let wy = y + 3; wy < 86; wy += 5) for (let wx = x + 2; wx < x + w - 2; wx += 4) if (hash(wx * 3 + wy) > 0.45) P.r(wx, wy, 2, 2, malam ? (hash(wx + wy) > 0.5 ? "#F2C14E" : "#3B4A66") : terang(wg, 0.35));
    }
    // menara air (selalu ada)
    P.kotak(130, 40, 22, 22, "#9AA7B4"); P.r(131, 45, 20, 1, "#7E8A96"); P.r(131, 52, 20, 1, "#7E8A96");
    P.r(133, 62, 2, 26, OL); P.r(147, 62, 2, 26, OL); P.garis(134, 66, 148, 80, OL); P.garis(148, 66, 134, 80, OL);

    // lantai
    const lantai = sudah("lantai") ? gaya("lantai") : null;
    for (let y = 90; y < H; y++) for (let x = 0; x < W; x++) {
      let c;
      if (lantai === "kayu") c = (Math.floor((y - 90) / 6) % 2 ? "#B98A5A" : "#C69A68");
      else if (lantai === "ubin") c = ((Math.floor(x / 10) + Math.floor((y - 90) / 10)) % 2 ? "#7FA8D6" : "#A9C8EE");
      else if (lantai === "rumput") c = hash(x * 7 + y * 13) > 0.85 ? "#4F8F45" : "#6FAE5A";
      else c = hash(x * 3 + y * 7) > 0.92 ? "#8A8A82" : "#A3A39A";
      if (lantai === "kayu" && (y - 90) % 6 === 0) c = "#9C7149";
      if (lantai === "kayu" && (x + Math.floor((y - 90) / 6) * 23) % 40 === 0) c = "#9C7149";
      P.p(x, y, c);
    }
    if (!lantai) for (let i = 0; i < 14; i++) P.garis(hash(i) * W, 95 + hash(i + 3) * 100, hash(i) * W + 6, 98 + hash(i + 3) * 100, "#86867E");
    // pagar belakang
    const wp = sudah("pagar") ? { putih: "#F4F1E8", biru: "#3E78C4", kuning: "#F2C14E" }[gaya("pagar")] : "#8C6A4E";
    P.r(0, 78, W, 2, wp); P.r(0, 84, W, 2, wp);
    for (let x = 2; x < W; x += 8) P.r(x, 76, 2, 14, wp);
    P.r(0, 89, W, 2, OL);
    // daun kering
    if (!sudah("sapu")) for (let i = 0; i < 26; i++) { const x = hash(i + 7) * W, y = 94 + hash(i + 31) * 100; P.r(x, y, 3, 2, i % 2 ? "#B5823A" : "#9A6A2E"); }

    const tumpuk = []; // objek digambar urut y (yang di belakang dulu)
    const tambah = (y, fn) => tumpuk.push([y, fn]);

    // tumpukan kardus untuk sudut yang belum beres
    const SAMPAH = { kebun: [8, 96], baca: [8, 130], panggung: [116, 104], layar: [66, 100], kedai: [114, 150], langit: [56, 172] };
    for (const [aid, [x, y]] of Object.entries(SAMPAH)) {
      const n = sisaArea(aid); if (!n) continue;
      tambah(y + 10, () => { for (let i = 0; i < n; i++) { const bx = x + (i % 3) * 9, by = y - Math.floor(i / 3) * 7 + (i % 2) * 2; P.kotak(bx, by, 10, 8, "#C9A06A"); P.r(bx + 4, by + 1, 2, 6, "#E8D9B0"); } });
    }

    // KEBUN (belakang kiri)
    if (sudah("rak")) tambah(96, () => {
      const g = gaya("rak");
      if (g === "kayu") { P.kotak(4, 80, 44, 3, "#A57749"); P.kotak(4, 92, 44, 3, "#A57749"); P.r(5, 80, 2, 16, OL); P.r(45, 80, 2, 16, OL); }
      else if (g === "kaleng") for (let i = 0; i < 4; i++) P.kotak(6 + i * 11, 88, 9, 8, "#3E78C4");
      else { P.garis(6, 96, 14, 72, OL); P.garis(40, 96, 32, 72, OL); for (let y = 76; y < 96; y += 6) P.r(10, y, 26, 2, "#A57749"); }
    });
    if (sudah("pot")) tambah(97, () => {
      const naik = sudah("rak") ? (gaya("rak") === "kaleng" ? -8 : gaya("rak") === "tangga" ? -6 : -12) : 0;
      for (let i = 0; i < 3; i++) {
        const x = 8 + i * 14, y = 90 + naik;
        P.kotak(x, y, 9, 7, "#C8553D"); P.r(x + 1, y + 1, 7, 1, "#E07A5F");
        if (sudah("tanam")) {
          const tg = gaya("tanam");
          if (tg === "cabai") { P.r(x + 2, y - 7, 5, 7, "#5FA35A"); P.r(x + 1, y - 5, 2, 2, "#C8553D"); P.r(x + 6, y - 3, 2, 2, "#C8553D"); P.r(x + 4, y - 8, 1, 1, "#C8553D"); }
          else if (tg === "matahari") { P.r(x + 4, y - 12, 1, 12, "#4F8F45"); P.r(x + 2, y - 7, 2, 2, "#5FA35A"); P.r(x + 1, y - 17, 7, 6, "#F2C14E"); P.r(x + 3, y - 15, 3, 2, "#7A5235"); }
          else { P.kotak(x + 3, y - 9, 4, 9, "#5FA35A"); P.r(x + 1, y - 6, 2, 3, "#5FA35A"); P.p(x + 5, y - 10, "#F2C14E"); }
        }
      }
    });

    // LAYAR TANCAP (tengah belakang)
    if (sudah("layarputih")) tambah(98, () => {
      P.r(60, 36, 2, 62, OL); P.r(98, 36, 2, 62, OL);
      P.kotak(58, 34, 44, 30, "#FFFDF6");
      if (sudah("proyektor") && malam) {
        // adegan di layar: dua tokoh dan matahari terbenam
        P.r(59, 35, 42, 28, "#2F4A6B"); P.r(59, 52, 42, 11, "#26385E"); P.r(74, 42, 10, 10, "#F2C14E");
        const gerak = Math.floor(t * 2) % 2;
        P.r(66, 48 + gerak, 4, 8, "#C8553D"); P.r(88, 48, 4, 8, "#7FC8F2");
      }
    });
    if (sudah("proyektor")) tambah(150, () => {
      P.kotak(74, 146, 12, 6, "#8A8F96"); P.r(70, 148, 4, 2, "#C9D6E2"); P.r(76, 152, 2, 6, OL); P.r(82, 152, 2, 6, OL);
      if (malam && sudah("layarputih")) for (let i = 0; i < 6; i++) P.garis(72, 148, 62 + i * 7, 62, "#FFF3C430");
    });
    if (sudah("kursinonton")) tambah(166, () => {
      const g = gaya("kursinonton");
      if (g === "lipat") for (let i = 0; i < 3; i++) { const x = 60 + i * 13; P.kotak(x, 158, 9, 4, "#3E78C4"); P.r(x + 1, 154, 1, 12, OL); P.r(x + 7, 154, 1, 12, OL); P.kotak(x, 152, 9, 3, "#3E78C4"); }
      else if (g === "karpet") { P.kotak(56, 158, 46, 12, "#8A6BBE"); P.r(58, 160, 42, 1, "#B7A0DE"); for (let i = 0; i < 3; i++) P.kotak(60 + i * 14, 154, 9, 6, i === 1 ? "#F2C14E" : "#7FC8F2"); }
      else { P.kotak(58, 154, 42, 12, "#7A5235"); P.kotak(58, 148, 42, 8, "#8E6142"); P.r(60, 156, 38, 2, "#A57749"); }
    });

    // PANGGUNG (kanan belakang)
    if (sudah("cermin")) tambah(100, () => { P.kotak(122, 70, 22, 28, "#C9D6E2"); P.garis(126, 74, 132, 80, "#FFFDF6"); P.garis(126, 80, 134, 88, "#FFFDF6"); });
    if (sudah("lantaipanggung")) tambah(104, () => { P.kotak(104, 98, 54, 16, "#5D5A50"); P.r(105, 99, 52, 3, "#7A776B"); for (let x = 108; x < 156; x += 9) P.r(x, 104, 1, 9, "#4A4741"); });
    if (sudah("speaker")) tambah(108, () => { for (const x of [104, 148]) { P.kotak(x, 90, 10, 14, "#33302B"); P.r(x + 3, 93, 4, 4, "#8A8F96"); P.r(x + 4, 99, 2, 2, "#8A8F96"); } });
    if (sudah("sorot")) tambah(70, () => {
      const g = gaya("sorot"); const warna = g === "biru" ? ["#7FC8F2"] : g === "ungu" ? ["#B7A0DE"] : ["#7FC8F2", "#F2C14E", "#B7A0DE", "#7FD18B"];
      for (const [x, arah] of [[108, 1], [152, -1]]) {
        P.r(x, 66, 2, 34, OL); P.kotak(x - 2, 62, 6, 5, "#33302B");
        const w = warna[Math.floor(t * 2 + (arah > 0 ? 0 : 2)) % warna.length];
        const a = malam ? "50" : "28";
        for (let i = 0; i < 18; i++) P.garis(x + 1, 66, x + 1 + arah * (6 + i) , 112, w + a);
      }
    });

    // POJOK BACA (kiri tengah)
    if (sudah("rakbuku")) tambah(150, () => {
      P.kotak(4, 112, 16, 40, "#A57749"); for (let y = 122; y < 150; y += 10) P.r(5, y, 14, 1, OL);
      const g = gaya("rakbuku"); const sampul = g === "biru" ? ["#2F4A6B", "#3E78C4", "#7FC8F2"] : g === "klasik" ? ["#7A5235", "#8E6142", "#5D4A3A", "#C9A06A"] : ["#C8553D", "#3E78C4", "#F2C14E", "#5FA35A", "#8A6BBE"];
      for (let rak = 0; rak < 4; rak++) for (let i = 0; i < 6; i++) { const tinggi = 6 + (hash(rak * 9 + i) * 3 | 0); P.r(6 + i * 2, 113 + rak * 10 + (9 - tinggi), 2, tinggi, sampul[(i + rak) % sampul.length]); }
    });
    if (sudah("duduk")) tambah(146, () => {
      const g = gaya("duduk");
      if (g === "hammock") { P.r(22, 118, 2, 32, OL); P.r(50, 118, 2, 32, OL); for (let x = 24; x < 50; x++) { const y = 128 + Math.round(Math.sin(((x - 24) / 26) * Math.PI) * 8); P.r(x, y, 1, 3, "#3E78C4"); P.p(x, y + 3, OL); } }
      else if (g === "beanbag") { P.kotak(26, 134, 22, 14, "#F2C14E"); P.r(28, 132, 18, 3, "#F2C14E"); P.r(30, 137, 6, 3, "#F7D06A"); }
      else { P.kotak(28, 128, 18, 6, "#C9A06A"); P.kotak(28, 120, 18, 9, "#C9A06A"); P.r(29, 134, 2, 12, "#A57749"); P.r(43, 134, 2, 12, "#A57749"); for (let x = 30; x < 44; x += 3) P.r(x, 121, 1, 7, "#A57749"); }
    });
    if (sudah("lampubaca")) tambah(150, () => { P.r(53, 120, 2, 30, OL); P.kotak(49, 114, 10, 7, "#F2C14E"); if (malam) for (let i = 0; i < 10; i++) P.garis(54, 120, 40 + i * 3, 150, "#FFF3C428"); });

    // KEDAI TEH (kanan depan)
    if (sudah("payung")) tambah(158, () => {
      const g = gaya("payung"); const [a, b] = g === "biru" ? ["#3E78C4", "#F4F1E8"] : g === "kuning" ? ["#F2C14E", "#F7D06A"] : ["#5FA35A", "#8BC47E"];
      P.r(129, 128, 2, 30, OL);
      for (let i = 0; i < 9; i++) P.r(129 - 4 - i * 2, 120 + i, 10 + i * 4, 1, i % 2 ? a : b);
      P.r(111, 129, 38, 1, OL);
    });
    if (sudah("meja")) tambah(166, () => {
      const g = gaya("meja");
      if (g === "bundar") { P.kotak(116, 156, 28, 5, "#A57749"); P.r(129, 161, 2, 9, OL); P.r(124, 169, 12, 2, OL); }
      else if (g === "biru") { P.kotak(116, 156, 28, 4, "#3E78C4"); P.garis(118, 160, 140, 170, OL); P.garis(142, 160, 120, 170, OL); }
      else { P.kotak(116, 156, 28, 14, "#C9A06A"); P.r(117, 162, 26, 1, "#A57749"); }
      if (sudah("termos")) { P.kotak(120, 146, 6, 10, "#C8553D"); P.r(121, 145, 4, 1, OL); P.kotak(130, 151, 5, 5, "#F4F1E8"); P.kotak(137, 151, 5, 5, "#F4F1E8"); if (Math.floor(t * 3) % 2) P.p(132, 148, "#FFFFFF90"); else P.p(139, 148, "#FFFFFF90"); }
    });
    // Oyen: tidur di kasurnya kalau sudah ada, kalau belum di atas kardus
    tambah(186, () => {
      const kasur = sudah("kasuroyen") ? gaya("kasuroyen") : null;
      const x = 138, y = 176;
      if (kasur === "kardus") P.kotak(x - 2, y + 6, 18, 8, "#C9A06A");
      else if (kasur === "keranjang") { P.kotak(x - 2, y + 5, 18, 9, "#C9A06A"); for (let i = x; i < x + 16; i += 3) P.r(i, y + 6, 1, 7, "#A57749"); }
      else if (kasur === "bantal") P.kotak(x - 3, y + 7, 20, 7, "#7FC8F2");
      P.sprite("oyen", x, y - 2 + (Math.floor(t * 1.5) % 2));
      if (Math.floor(t) % 4 < 2) { P.p(x + 13, y - 4, "#FFFDF6"); P.p(x + 15, y - 7, "#FFFDF6"); }   // zzz
    });

    // LANGIT MALAM: lampu tali, teropong
    if (sudah("lampu")) tambah(0, () => {
      const g = gaya("lampu");
      const warna = g === "hangat" ? ["#F2C14E"] : g === "biru" ? ["#7FC8F2", "#3E78C4"] : ["#F2C14E", "#7FC8F2", "#7FD18B", "#B7A0DE", "#E9925A"];
      const titik = [[0, 64], [60, 36], [100, 36], [130, 50], [160, 66]];
      let n = 0;
      for (let i = 0; i < titik.length - 1; i++) {
        const [x0, y0] = titik[i], [x1, y1] = titik[i + 1];
        for (let s = 0; s <= 1; s += 0.02) {
          const x = x0 + (x1 - x0) * s, y = y0 + (y1 - y0) * s + Math.sin(s * Math.PI) * 8;
          P.p(x, y, OL);
          if (Math.round(s * 50) % 6 === 0) {
            n++;
            const nyala = malam ? (Math.floor(t * 2) + n) % 9 !== 0 : true;
            const w = warna[n % warna.length];
            P.r(x - 1, y + 1, 2, 2, nyala ? w : gelap(w));
            if (malam && nyala) { P.p(x - 2, y + 1, w + "60"); P.p(x + 1, y + 2, w + "60"); P.p(x, y + 3, w + "60"); }
          }
        }
      }
    });
    if (sudah("teropong")) tambah(182, () => { P.garis(60, 168, 54, 182, OL); P.garis(62, 168, 68, 182, OL); P.garis(61, 168, 61, 182, OL); P.kotak(54, 160, 16, 6, "#2F4A6B"); P.r(52, 160, 2, 6, "#C9D6E2"); });

    // kotak surat (selalu ada; berkarat sebelum dicat ulang)
    tambah(190, () => {
      const baru = sudah("kotaksurat");
      const x = 6, y = 172;
      P.r(x + 6, y + 10, 2, 12, OL);
      P.kotak(x, y, 14, 11, baru ? "#3E78C4" : "#6B7F94");
      P.r(x + 2, y + 3, 10, 2, OL);
      if (!baru) for (let i = 0; i < 6; i++) P.p(x + 1 + hash(i) * 12, y + 1 + hash(i + 4) * 9, "#8C6A4E");
      P.r(x + 14, y + 2, 2, 4, baru ? "#F2C14E" : "#8C6A4E");
      if (opsi.suratBaru && Math.floor(t * 2) % 2) { P.r(x + 3, y - 6, 8, 5, "#FFFDF6"); P.r(x + 3, y - 6, 8, 1, OL); P.r(x + 3, y - 2, 8, 1, OL); P.r(x + 3, y - 6, 1, 5, OL); P.r(x + 10, y - 6, 1, 5, OL); }
    });

    // hadiah dari teman (baris depan)
    (st.hadiah || []).slice(-6).forEach((h, i) => tambah(194, () => {
      const x = 26 + i * 12, y = 186;
      if (h.id === "kaktus") { P.kotak(x, y + 4, 8, 6, "#C8553D"); P.kotak(x + 2, y - 3, 4, 8, "#5FA35A"); }
      else if (h.id === "bendera") { P.r(x + 1, y - 6, 1, 16, OL); P.r(x + 2, y - 6, 6, 4, ["#3E78C4", "#F2C14E", "#5FA35A"][i % 3]); }
      else if (h.id === "bantal") P.kotak(x, y + 2, 10, 7, "#7FC8F2");
      else { P.r(x + 4, y - 6, 1, 3, OL); P.kotak(x + 1, y - 3, 8, 9, "#E9925A"); if (malam) P.r(x + 3, y - 1, 4, 5, "#F7D06A"); }
    }));

    // pegawai muncul di sudut yang sudah beres
    const TAMU = [["kebun", "kapibara", 52, 92], ["baca", "kukang", 34, 140], ["panggung", "marmut", 130 + (Math.floor(t * 2) % 2), 86], ["layar", "kura", 102, 156], ["langit", "hantu", 36, 166]];
    for (const [aid, sp, x, y] of TAMU) if (areaBeres(aid)) tambah(y + 12, () => P.sprite(sp, x, y, aid === "layar"));

    // Mira
    tambah(192, () => P.tempel(avatar(st.baju), 82, 168));

    // rona waktu (lantai dulu, supaya lampu & benda tetap terang)
    if (wkt === "sore") P.r(0, 0, W, H, "#E9925A18");
    if (malam) P.r(0, 76, W, H - 76, "#16203A66");
    tumpuk.sort((a, b) => a[0] - b[0]).forEach(([, fn]) => fn());
    // tepi depan atap
    P.r(0, 196, W, 4, "#5D5A50"); P.r(0, 196, W, 1, OL);
    return P;
  }

  K.ATAP_GAMBAR = { Piksel, avatar, atap, waktuDari, W, H };
})();
