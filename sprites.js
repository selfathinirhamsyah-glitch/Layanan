/* =========================================================
   Sprite pixel art untuk pegawai & fasilitas kantor.
   Setiap sprite: grid huruf 12 kolom, "." = transparan.
   ========================================================= */
(() => {
  const K = "#2B2A26"; // garis luar

  const S = {
    dokumen: {
      p: { k: K, w: "#FFFDF6", r: "#B5443A" },
      g: [
        ".kkkkkkk....",
        ".kwwwwwkk...",
        ".kwkkkwkwk..",
        ".kwwwwwkkkk.",
        ".kwkkkkkwwk.",
        ".kwwwwwwwwk.",
        ".kwkkkkkkwk.",
        ".kwwwwwwwwk.",
        ".kwkkkwrrrk.",
        ".kwwwwwrrrk.",
        ".kkkkkkkkkk.",
      ],
    },
    kura: { // Pak Kura-kura, satpam bertopi
      p: { k: K, N: "#2F4A6B", y: "#E0B84A", g: "#7FA868", m: "#3E5E36" },
      g: [
        "...kkkkkk...",
        "..kNNNNNNk..",
        ".kNNNNyNNNk.",
        "kkkkkkkkkkkk",
        ".kggggggggk.",
        ".kgkggggkgk.",
        ".kggggggggk.",
        ".kggmmmmggk.",
        "..kggggggk..",
        "...kkkkkk...",
      ],
    },
    kapibara: { // Bu Kapibara
      p: { k: K, b: "#B98A5A", B: "#8E6440" },
      g: [
        ".kk......kk.",
        ".kbk....kbk.",
        ".kbbkkkkbbk.",
        "kbbbbbbbbbbk",
        "kbkbbbbbbkbk",
        "kbbbbbbbbbbk",
        "kbbbBBBBbbbk",
        "kbbBBkkBBbbk",
        "kbbBBBBBBbbk",
        ".kbbbbbbbbk.",
        ".kkkkkkkkkk.",
      ],
    },
    berang: { // Bang Berang-berang
      p: { k: K, b: "#7A5A3C", c: "#E9D7B5" },
      g: [
        "..kk....kk..",
        ".kbbkkkkbbk.",
        ".kbbbbbbbbk.",
        "kbbbbbbbbbbk",
        "kbbkbbbbkbbk",
        "kbbbccccbbbk",
        "kbbcckkccbbk",
        "kbbccccccbbk",
        ".kbbccccbbk.",
        "..kkkkkkkk..",
      ],
    },
    singa: { // Pak Singa, bagian pengumuman
      p: { k: K, m: "#A8662E", y: "#E8C36A", B: "#5A3A22" },
      g: [
        "..mmmmmmmm..",
        ".mmmmmmmmmm.",
        "mmmyyyyyymmm",
        "mmyyyyyyyymm",
        "mmkkyyyykkmm",
        "mmykyyyykymm",
        "mmyyyBByyymm",
        "mmmyykkyymmm",
        ".mmmyyyymmm.",
        "..mmmmmmmm..",
      ],
    },
    badak: { // Kak Badak
      p: { k: K, w: "#F1E6CC", g: "#9A9A92", G: "#7A7A72" },
      g: [
        ".....kk.....",
        "....kwwk....",
        ".kk.kwwk.kk.",
        ".kgkkwwkkgk.",
        "kggggwwggggk",
        "kgkkggggkkgk",
        "kggkggggkggk",
        "kggggggggggk",
        "kgggGGGGgggk",
        ".kgGkGGkGgk.",
        "..kkkkkkkk..",
      ],
    },
    hantu: { // Mbak Burung Hantu
      p: { k: K, o: "#8A6A4A", w: "#FFFDF6", y: "#E0B84A", c: "#D9C4A0" },
      g: [
        "kk........kk",
        "kok......kok",
        "kookkkkkkook",
        "kooooooooook",
        "kowwwoowwwok",
        "kowkwoowkwok",
        "kowwwoowwwok",
        "kooooyyooook",
        "kocooyyoocok",
        ".kcocoocock.",
        "..kkkkkkkk..",
      ],
    },
    kukang: { // Mas Kukang, bagian fotokopi
      p: { k: K, t: "#D8BE96", d: "#7A5A3C" },
      g: [
        "...kkkkkk...",
        "..kttttttk..",
        ".kttttttttk.",
        "kttddttddttk",
        "ktdkdttdkdtk",
        "kttddttddttk",
        "kttttkkttttk",
        ".kttttttttk.",
        "..kttttttk..",
        "...kkkkkk...",
      ],
    },
    beruang: { // Pak Beruang Madu, manajer
      p: { k: K, K: "#4A4540", w: "#FFFDF6", t: "#E0B84A" },
      g: [
        ".kk......kk.",
        "kKKkkkkkkKKk",
        "kKKKKKKKKKKk",
        "kKKKKKKKKKKk",
        "kKwKKKKKKwKk",
        "kKKKttttKKKk",
        "kKKttkkttKKk",
        "kKKttttttKKk",
        ".kKKttttKKk.",
        "..kkkkkkkk..",
      ],
    },
    gajah: { // Bu Gajah, kepala kantor
      p: { k: K, g: "#A3A39B", G: "#8A8A82" },
      g: [
        "...kkkkkk...",
        ".kkggggggkk.",
        "kGGggggggGGk",
        "kGGgkggkgGGk",
        "kGGggggggGGk",
        "kGGkggggkGGk",
        ".kk.kggk.kk.",
        "....kggk....",
        "....kggk....",
        ".....kggk...",
        "......kk....",
      ],
    },
    rakun: { // Bang Rakun, teknisi
      p: { k: K, g: "#9C9A92", K: "#3D3A36", w: "#F1ECE0" },
      g: [
        ".kk......kk.",
        "kggk....kggk",
        "kgggkkkkgggk",
        "kggggggggggk",
        "kKKKKggKKKKk",
        "kKwKKggKKwKk",
        "kggggwwggggk",
        "kgggwkkwgggk",
        ".kggwwwwggk.",
        "..kkkkkkkk..",
      ],
    },
    marmut: { // Dimas, anak magang (selalu panik, keringetan)
      p: { k: K, o: "#D9A066", c: "#F4E3C6", w: "#FFFFFF", r: "#E2A487", b: "#7FB2D9" },
      g: [
        "..kk....kk..",
        ".kock..kockb",
        ".kooooooookb",
        "kooooooooook",
        "kowkooookwok",
        "kowwoooowwok",
        "krccccccccrk",
        "kccckkkkccck",
        ".kccckkccck.",
        "..kkkkkkkk..",
      ],
    },
    oyen: { // Oyen, kucing oranye, Kepala Bagian (berdasi)
      p: { k: K, o: "#E39B4A", O: "#B8692A", w: "#FFF5E6", p: "#D98A7A", N: "#2F4A6B" },
      g: [
        ".k........k.",
        ".kk......kk.",
        ".kok....kok.",
        ".kookkkkook.",
        "koooOooOoook",
        "kooooooooook",
        "kokkooookkok",
        "kwoooppooowk",
        ".kowwkkwwok.",
        "..kkkkkkkk..",
        ".....NN.....",
        "....NNNN....",
      ],
    },
    radio: { // Radio Kantor
      p: { k: K, r: "#9C6B43", g: "#5A4632", l: "#A8E0B0" },
      g: [
        "..........k.",
        ".........k..",
        "kkkkkkkkkkkk",
        "krrrrrrrrrrk",
        "krgggrrlllrk",
        "krgggrrlllrk",
        "krgggrrrkrrk",
        "krrrrrrrrrrk",
        "kkkkkkkkkkkk",
        ".k........k.",
      ],
    },
    berkas: {
      p: { k: K, y: "#E0B84A", w: "#FFFDF6" },
      g: [
        "............",
        ".kkkkk......",
        ".kyyyykkkkk.",
        ".kywwwwwwyk.",
        ".kywkkkkwyk.",
        ".kywwwwwwyk.",
        ".kywkkkwwyk.",
        ".kyyyyyyyyk.",
        ".kkkkkkkkkk.",
      ],
    },
    batu: {
      p: { k: K, g: "#9A9A92", G: "#77776F" },
      g: [
        "............",
        "............",
        "....kkkk....",
        "..kkggggkk..",
        ".kggGgggggk.",
        ".kgggggGggk.",
        "kgggGggggggk",
        "kggggggGgggk",
        ".kkkkkkkkkk.",
      ],
    },
    bantal: {
      p: { k: K, b: "#A9C3DA" },
      g: [
        "............",
        "............",
        ".kk......kk.",
        ".kbkkkkkkbk.",
        ".kbbbbbbbbk.",
        "kbbbbbbbbbbk",
        "kbbbbbbbbbbk",
        ".kbbbbbbbbk.",
        ".kbkkkkkkbk.",
        ".kk......kk.",
      ],
    },
    balon: {
      p: { k: K, b: "#8FB8A8", w: "#E6F2EC" },
      g: [
        "....kkkk....",
        "...kbbbbk...",
        "..kbwbbbbk..",
        "..kbwbbbbk..",
        "..kbbbbbbk..",
        "..kbbbbbbk..",
        "...kbbbbk...",
        "....kkkk....",
        ".....kk.....",
        "......k.....",
        ".....k......",
        "......k.....",
      ],
    },
    oyenBelakang: { // Oyen dilihat dari belakang (sedang presentasi)
      p: { k: K, o: "#E39B4A", O: "#B8692A" },
      g: [
        ".k........k.",
        ".kk......kk.",
        ".kok....kok.",
        ".kookkkkook.",
        "kooooOOooook",
        "koooOooOoook",
        "kooOooooOook",
        "kooooooooook",
        ".kooooooook.",
        "..kkkkkkkk..",
      ],
    },
    gorengan: {
      p: { k: K, y: "#D9A441", Y: "#B07A2A" },
      g: [
        "............",
        "............",
        "...kkkkkk...",
        "..kyyYyyyk..",
        ".kyYyyyYyyk.",
        ".kyyyYyyyyk.",
        "..kkkkkkkk..",
      ],
    },
    payung: {
      p: { k: K, b: "#5B6F86" },
      g: [
        "....kkkk....",
        "..kkbbbbkk..",
        ".kbbbbbbbbk.",
        "kbbbbbbbbbbk",
        "kkkkkkkkkkkk",
        ".....k......",
        ".....k......",
        ".....k......",
        ".....k..k...",
        "......kk....",
      ],
    },
    cangkir: {
      p: { k: K, w: "#FFFDF6", c: "#6B4A2E" },
      g: [
        "............",
        "...k.k.k....",
        "....k.k.....",
        ".kkkkkkkk...",
        ".kwwwwwwkkk.",
        ".kwccccwk.k.",
        ".kwwwwwwkkk.",
        ".kwwwwwwk...",
        "..kkkkkk....",
        "kkkkkkkkkk..",
      ],
    },
    penghapus: {
      p: { k: K, w: "#FFFDF6", b: "#7F98B4" },
      g: [
        "............",
        "............",
        "....kkkkkkk.",
        "...kwwkbbbbk",
        "..kwwkbbbbk.",
        ".kwwkbbbbk..",
        "kkkkkkkkk...",
        "............",
      ],
    },
    stiker: {
      p: { k: K, g: "#7FA868", w: "#FFFDF6" },
      g: [
        "............",
        "............",
        ".kkkkkkkkkk.",
        ".kgggwwwwwkk",
        ".kgggwwwwwkk",
        ".kkkkkkkkkk.",
      ],
    },
    jam: {
      p: { k: K, w: "#FFFDF6" },
      g: [
        "...kkkkkk...",
        "..kwwwwwwk..",
        ".kwwwkwwwwk.",
        ".kwwwkwwwwk.",
        ".kwwwkkkwwk.",
        ".kwwwwwwwwk.",
        "..kwwwwwwk..",
        "...kkkkkk...",
      ],
    },
    plastik: { // tanaman plastik
      p: { k: K, g: "#5FB878", p: "#6F8AA8" },
      g: [
        "....g..g....",
        "..g.g..g.g..",
        "..g.gg.g.g..",
        "...ggg.gg...",
        "....gggg....",
        ".....gg.....",
        "..kkkkkkkk..",
        "..kppppppk..",
        "...kppppk...",
        "...kkkkkk...",
      ],
    },
    kaus: {
      p: { k: K, b: "#A8553A", w: "#FFFDF6" },
      g: [
        "....kkkk....",
        "....kbbk....",
        "....kwwk....",
        "....kbbk....",
        "....kwwk....",
        "....kbbkk...",
        "....kbbbbk..",
        "....kbbbbbk.",
        ".....kkkkk..",
      ],
    },
    kursi: {
      p: { k: K, b: "#5B6F86" },
      g: [
        "...kkkkkk...",
        "...kbbbbk...",
        "...kbbbbk...",
        "...kbbbbk...",
        "..kkkkkkkk..",
        "..kbbbbbbk..",
        "..kkkkkkkk..",
        ".....kk.....",
        "...kkkkkk...",
        "..k..kk..k..",
      ],
    },
    gula: {
      p: { k: K, N: "#2F4A6B", w: "#FFFDF6" },
      g: [
        "...kkkkkk...",
        "..kNNNNNNk..",
        "..kkkkkkkk..",
        "..kwwwwwwk..",
        "..kwwwwwwk..",
        "..kwkkkkwk..",
        "..kwwwwwwk..",
        "..kkkkkkkk..",
      ],
    },
    senter: {
      p: { k: K, y: "#F2C14E", g: "#3B4046" },
      g: [
        "............",
        "............",
        "kk..........",
        "kykkkkkkkk..",
        "kyykggggggk.",
        "kyykggggggk.",
        "kykkkkkkkk..",
        "kk..........",
      ],
    },
    toples: {
      p: { k: K, w: "#EEF3F6", y: "#F2C14E", b: "#7F98B4", g: "#7FA868" },
      g: [
        "...kkkkkk...",
        "..kkkkkkkk..",
        "..kwwwwwwk..",
        "..kwywwbwk..",
        "..kwwwgwwk..",
        "..kwbwwwyk..",
        "..kwwwwwwk..",
        "..kkkkkkkk..",
      ],
    },
    tanaman0: { // layu
      p: { k: K, g: "#A3A060", p: "#B0714F" },
      g: [
        "............",
        "............",
        "......g.....",
        "gg...g.g..gg",
        "..ggg...gg..",
        "....gggg....",
        "..kkkkkkkk..",
        "..kppppppk..",
        "...kppppk...",
        "...kkkkkk...",
      ],
    },
    tanaman1: { // mulai segar
      p: { k: K, g: "#7FA060", p: "#B0714F" },
      g: [
        "............",
        "......g.....",
        "..g...g..g..",
        "...g..g.g...",
        "....gggg....",
        ".....gg.....",
        "..kkkkkkkk..",
        "..kppppppk..",
        "...kppppk...",
        "...kkkkkk...",
      ],
    },
    tanaman2: { // segar
      p: { k: K, g: "#4F8A4E", p: "#B0714F" },
      g: [
        "....g..g....",
        "..g.g..g.g..",
        "..g.gg.g.g..",
        "...ggg.gg...",
        "....gggg....",
        ".....gg.....",
        "..kkkkkkkk..",
        "..kppppppk..",
        "...kppppk...",
        "...kkkkkk...",
      ],
    },
    kopi: { // mesin kopi (lampu merah = rusak)
      p: { k: K, m: "#A9B4BC", r: "#C8463B", w: "#FFFDF6" },
      g: [
        ".kkkkkkkkkk.",
        ".kmmmmmmmmk.",
        ".kmrmmmmmmk.",
        ".kmmmmmmmmk.",
        ".kmkkkkkkmk.",
        ".kmk....kmk.",
        ".kmk.ww.kmk.",
        ".kmk.ww.kmk.",
        ".kmkkkkkkmk.",
        ".kmmmmmmmmk.",
        ".kkkkkkkkkk.",
      ],
    },
    saran: { // kotak saran
      p: { k: K, b: "#7F98B4", w: "#FFFDF6" },
      g: [
        ".....ww.....",
        ".kkkkwwkkkk.",
        ".kbbbbbbbbk.",
        ".kbbkkkkbbk.",
        ".kbbbbbbbbk.",
        "kkkkkkkkkkkk",
        "kbbbbbbbbbbk",
        "kbbbwwwwbbbk",
        "kbbbbbbbbbbk",
        "kkkkkkkkkkkk",
      ],
    },
  };

  const cache = {};
  function svg(name) {
    if (cache[name]) return cache[name];
    const s = S[name];
    if (!s) return "";
    const w = 12, h = s.g.length;
    let rects = "";
    s.g.forEach((row, y) => {
      let x = 0;
      while (x < w) {
        const c = row[x];
        if (c === "." || c === undefined) { x++; continue; }
        let run = 1;
        while (row[x + run] === c) run++;
        rects += `<rect x="${x}" y="${y}" width="${run}" height="1" fill="${s.p[c]}"/>`;
        x += run;
      }
    });
    const off = (12 - h) / 2;
    return (cache[name] = `<svg class="px" viewBox="0 ${-off} 12 12" shape-rendering="crispEdges" aria-hidden="true" focusable="false">${rects}</svg>`);
  }

  // Versi PNG untuk dokumen yang diunduh (html2canvas lebih andal dengan <img>)
  const cachePng = {};
  function png(name, skala = 8) {
    const key = name + skala;
    if (cachePng[key]) return cachePng[key];
    const s = S[name];
    if (!s) return "";
    const c = document.createElement("canvas");
    c.width = c.height = 12 * skala;
    const ctx = c.getContext("2d");
    const off = Math.floor((12 - s.g.length) / 2);
    s.g.forEach((row, y) => [...row].forEach((ch, x) => {
      if (ch === ".") return;
      ctx.fillStyle = s.p[ch];
      ctx.fillRect(x * skala, (y + off) * skala, skala, skala);
    }));
    return (cachePng[key] = c.toDataURL("image/png"));
  }

  window.SPRITE = { svg, png };
})();
