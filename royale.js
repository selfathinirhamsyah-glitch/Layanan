/* =========================================================
   Kantor Layanan Perasaan · Kantor Royale
   Battle royale 20 pemain ala game bertahan terakhir:
   loncat dari pesawat kertas, turun pakai payung, buka peti,
   ambil senjata air/kertas, rompi & teh, zona aman menyusut,
   sisa pemain & umpan berita, juara = pulang paling akhir.
   Tidak ada darah: yang kalah basah kuyup lalu pulang duluan.
   ========================================================= */
(() => {
  "use strict";
  const K = window.KLP;
  const { sfx } = K;
  const A = () => K.ARENA;
  const acak = (a, b) => a + Math.random() * (b - a);
  const d2 = (a, b) => (a.x - b.x) ** 2 + (a.z - b.z) ** 2;
  const bungkus = (a) => { while (a > Math.PI) a -= Math.PI * 2; while (a < -Math.PI) a += Math.PI * 2; return a; };

  const SENJATA = {
    tinju: { nama: "Tinju Bantal", tier: 0, dmg: 9, cd: 0.5, jangkau: 1.8, mag: Infinity, isi: 0, sebar: 0, warna: "#FFFDF6", sprite: "bantal", jarakDekat: true },
    pistol: { nama: "Pistol Air", tier: 1, dmg: 14, cd: 0.38, jangkau: 13, mag: 10, isi: 1.3, sebar: 0.05, warna: "#7FC8F2", sprite: "senter" },
    ketapel: { nama: "Ketapel Karet", tier: 2, dmg: 10, cd: 0.85, jangkau: 8.5, mag: 5, isi: 1.9, sebar: 0.22, peluru: 5, warna: "#E0B84A", sprite: "kaus" },
    smg: { nama: "Pelontar Bola Kertas", tier: 2, dmg: 8, cd: 0.11, jangkau: 12, mag: 25, isi: 1.7, sebar: 0.13, warna: "#FFFDF6", sprite: "dokumen" },
    senapan: { nama: "Semprotan Tekanan Tinggi", tier: 3, dmg: 13, cd: 0.15, jangkau: 16, mag: 30, isi: 2.0, sebar: 0.07, warna: "#5B9BE0", sprite: "tinta" },
    sniper: { nama: "Stempel Jarak Jauh", tier: 3, dmg: 62, cd: 1.2, jangkau: 28, mag: 4, isi: 2.3, sebar: 0.01, warna: "#B5443A", sprite: "berkas" },
  };
  const NAMA_BOT = ["Pak Satpam", "Dimas", "Kak Badak", "Mas Kukang", "Oyen", "Bu Ratna", "Bang Rakun", "Pak Singa", "Bu Gajah", "Bang Berang", "Mbak Hantu", "Pak Beruang", "Staf Arsip", "Staf Pantry", "Kurir Map", "Teknisi AC", "Kepala Gudang", "Anak Magang 2", "Resepsionis"];
  const SPRITE_BOT = ["kura", "marmut", "badak", "kukang", "oyen", "kapibara", "rakun", "singa", "gajah", "berang", "hantu", "beruang", "kura", "marmut", "badak", "kukang", "rakun", "marmut", "kapibara"];
  const FASE_ZONA = [[22, 16, 62], [18, 14, 40], [15, 12, 24], [12, 10, 12], [9, 9, 0]];
  const RUSAK_ZONA = [2, 4, 7, 11, 16];

  /* ---------- peta pulau kantor ---------- */
  function buatPeta() {
    const R = [], lantai = [], peti = [], hiasan = [];
    const GEDUNG = [["Gedung Arsip", -50, -48], ["Pantry Pusat", 4, -56], ["Ruang Rapat", 52, -44], ["Koperasi", -58, 4], ["Lobi Utama", 0, 0], ["Gudang ATK", 56, 8], ["Parkiran", -44, 54], ["Menara Air", 8, 58], ["Taman Kantor", 54, 56]];
    for (const [nama, cx, cz] of GEDUNG) {
      const w = acak(14, 18), d = acak(12, 15), t = 1, h = 3.2, pintu = 4;
      const warna = ["#E9E2D0", "#D9CFB8", "#CFC5AD"][Math.floor(Math.random() * 3)];
      lantai.push({ x: cx, z: cz, w, d, warna: "#B9A27E" });
      // dinding dengan pintu di atas & bawah
      const seg = (w - pintu) / 2;
      for (const s of [-1, 1]) {
        R.push({ x: cx - pintu / 2 - seg / 2, z: cz + s * d / 2, w: seg, d: t, h, warna });
        R.push({ x: cx + pintu / 2 + seg / 2, z: cz + s * d / 2, w: seg, d: t, h, warna });
        R.push({ x: cx + s * w / 2, z: cz - d / 4 - 1, w: t, d: d / 2 - 2, h, warna });
        R.push({ x: cx + s * w / 2, z: cz + d / 4 + 1, w: t, d: d / 2 - 2, h, warna });
      }
      R.push({ x: cx - w / 4, z: cz, w: 3, d: 1.4, h: 1, warna: "#9C6B43", rendah: true });
      R.push({ x: cx + w / 4, z: cz - 2, w: 1.4, d: 3, h: 1, warna: "#9C6B43", rendah: true });
      peti.push({ x: cx + acak(-w / 3, w / 3), z: cz + acak(-d / 3, d / 3), tier: 2 }, { x: cx + acak(-w / 3, w / 3), z: cz + acak(-d / 3, d / 3), tier: 1 });
      hiasan.push({ teks: nama.toUpperCase(), x: cx, z: cz + d / 2 + 2.2, w: Math.min(12, nama.length * 0.9), h: 1.2, latar: "#2F4A6B" });
    }
    const jauhGedung = (x, z, m) => GEDUNG.every(([, cx, cz]) => Math.abs(x - cx) > 10 + m || Math.abs(z - cz) > 9 + m);
    for (let k = 0; k < 400 && peti.length < 44; k++) { const x = acak(-82, 82), z = acak(-82, 82); if (jauhGedung(x, z, 2)) peti.push({ x, z, tier: Math.random() < 0.25 ? 3 : 1 }); }
    let pohon = 0, semak = 0;
    for (let k = 0; k < 900 && (pohon < 46 || semak < 30); k++) {
      const x = acak(-84, 84), z = acak(-84, 84);
      if (!jauhGedung(x, z, 3)) continue;
      if (pohon < 46 && Math.random() < 0.6) { R.push({ x, z, w: 1.3, d: 1.3, h: 4, pohon: true, warna: "#4F6E5E" }); pohon++; }
      else if (semak < 30) { R.push({ x, z, w: acak(3, 5), d: acak(2.5, 4), h: 1.1, warna: "#5E8C6A", semak: true, tembus: true, rendah: true }); semak++; }
    }
    // jalan setapak
    lantai.push({ x: 0, z: 0, w: 170, d: 5, warna: "#B9B4AA" }, { x: 0, z: 0, w: 5, d: 170, warna: "#B9B4AA" });
    return {
      x0: -90, x1: 90, z0: -90, z1: 90, warnaTanah: "#A9BD82", warnaLuar: "#5E8FB8", langit: "#BFD8E8", kabut: [50, 130],
      lantai, rintangan: R, hiasan, peti, lebarPandang: 22, kamera: { tinggi: 23, mundur: 13, maju: 2 },
    };
  }

  function main(api) {
    const { ctx } = api;
    const AR = A();
    const dunia = buatPeta();
    const kotak = dunia.rintangan.filter((b) => !b.tembus);
    const peluruKotak = kotak.filter((b) => !b.rendah);
    const semak = dunia.rintangan.filter((b) => b.semak);
    const kuat = { santai: 0.55, normal: 0.75, lembur: 0.92 }[api.tingkat] || 0.75;
    const umpan = AR.umpan(), umum = AR.pengumum();
    let waktu = 0, selesai = null, kedipMerah = 0, penanda = 0;

    // pesawat kertas melintas
    const sudut = acak(0, Math.PI * 2);
    const pes = { x0: Math.cos(sudut) * -115, z0: Math.sin(sudut) * -115 + acak(-25, 25), a: sudut, laju: 21, t: 0, durasi: 230 / 21 };
    pes.x = pes.x0; pes.z = pes.z0;
    const posPesawat = (t) => ({ x: pes.x0 + Math.cos(pes.a) * pes.laju * t, z: pes.z0 + Math.sin(pes.a) * pes.laju * t });

    // pemain & bot
    const orang = [];
    const buatOrang = (nama, sprite, pemain, i) => {
      const o = {
        id: i, nama, sprite, pemain, jenis: pemain ? "pemain" : "bot", x: pes.x, z: pes.z, r: 0.6, hp: 100, rompi: 0,
        senjata: [null, null], aktif: 0, peluru: [0, 0], cd: 0, isiUlang: 0, teh: 0, minum: 0, tinggi: 16, fase: "pesawat",
        loncatPada: pemain ? Infinity : acak(1.5, pes.durasi - 1), mati: false, kill: 0, hadap: 0, warna: pemain ? "#3E78C4" : null,
        target: null, tujuan: null, ubahTujuan: 0, skill: kuat * acak(0.85, 1.12), strafe: Math.random() < 0.5 ? 1 : -1, jedaStrafe: 0,
      };
      orang.push(o); return o;
    };
    const pemain = buatOrang(api.nama, K.data.setelan.royale || "kapibara", true, 0);
    NAMA_BOT.forEach((n, i) => buatOrang(n, SPRITE_BOT[i], false, i + 1));

    // peti & barang di tanah
    const peti = dunia.peti.map((p) => ({ ...p, jenis: "peti", r: 0.8, terbuka: false }));
    const barang = [];
    function isiPeti(p) {
      p.terbuka = true; p.mati = true;
      const daftar = [];
      const tier = p.tier;
      const pilSenjata = tier >= 3 ? ["senapan", "sniper", "smg"] : tier === 2 ? ["smg", "ketapel", "senapan", "pistol"] : ["pistol", "pistol", "ketapel", "smg"];
      daftar.push({ jenis: "senjata", id: pilSenjata[Math.floor(Math.random() * pilSenjata.length)] });
      if (Math.random() < 0.6) daftar.push({ jenis: "teh" });
      if (Math.random() < 0.45) daftar.push({ jenis: "rompi", lv: Math.min(3, tier + (Math.random() < 0.3 ? 1 : 0)) });
      daftar.forEach((b, i) => { const s = (i / daftar.length) * Math.PI * 2; barang.push({ ...b, x: p.x + Math.cos(s) * 1.2, z: p.z + Math.sin(s) * 1.2, r: 0.4, jenisTampil: true }); });
      sfx("kertas");
    }
    const spriteBarang = (b) => (b.jenis === "senjata" ? SENJATA[b.id].sprite : b.jenis === "teh" ? "cangkir" : "kaus");
    const namaBarang = (b) => (b.jenis === "senjata" ? SENJATA[b.id].nama : b.jenis === "teh" ? "Teh Hangat" : `Rompi Map Lv${b.lv}`);

    // zona
    const zona = { x: 0, z: 0, r: 135, xB: acak(-30, 30), zB: acak(-30, 30), rBerikut: FASE_ZONA[0][2], fase: 0, sisa: FASE_ZONA[0][0], susut: false, r0: 135, x0: 0, z0: 0 };

    /* ---------- kendali ---------- */
    const kend = AR.kendali(api, [
      { id: "tembak", dx: 62, dy: 72, r: 38, label: "LONCAT", ikon: "senter", warna: "#F2C14E" },
      { id: "ganti", dx: 136, dy: 46, r: 22, label: "GANTI", ikon: "tinta" },
      { id: "teh", dx: 132, dy: 116, r: 22, label: "TEH", ikon: "cangkir", warna: "#7FD18B" },
    ]);
    api.kontrol.innerHTML = "";

    /* ---------- aksi ---------- */
    const senjataAktif = (o) => (o.senjata[o.aktif] ? SENJATA[o.senjata[o.aktif]] : SENJATA.tinju);
    function loncat(o) {
      if (o.fase !== "pesawat") return; o.fase = "turun"; o.x = pes.x; o.z = pes.z; o.tinggi = 16;
      if (!o.pemain) { const tegak = pes.a + Math.PI / 2, j = acak(-38, 38); o.titikTurun = { x: AR.batas(o.x + Math.cos(tegak) * j + acak(-8, 8), -80, 80), z: AR.batas(o.z + Math.sin(tegak) * j + acak(-8, 8), -80, 80) }; } if (o.pemain) { sfx("boing"); umum.umumkan("LONCAT!", "Arahkan payung dengan joystick", "#F2C14E"); } }
    const peluru = [], efek = [], angka = [];
    function tembak(o, t) {
      const s = senjataAktif(o);
      if (o.cd > 0 || o.isiUlang > 0 || o.minum > 0) return;
      const slot = o.aktif;
      if (o.senjata[slot] && o.peluru[slot] <= 0) { o.isiUlang = s.isi; return; }
      o.cd = s.cd;
      let arah = o.hadap;
      if (t) arah = Math.atan2(t.z - o.z, t.x - o.x);
      o.hadap = arah;
      if (s.jarakDekat) {
        if (t && d2(o, t) < (s.jangkau + 0.6) ** 2) kena(o, t, s.dmg, s.nama);
        o.lompat = 0.15; return;
      }
      if (o.senjata[slot]) { o.peluru[slot]--; if (o.peluru[slot] <= 0) o.isiUlang = s.isi; }
      const n = s.peluru || 1;
      const galat = o.pemain ? 0 : (1 - o.skill) * 0.5 + 0.06;
      for (let k = 0; k < n; k++) {
        const a = arah + acak(-s.sebar, s.sebar) + acak(-galat, galat);
        peluru.push({ x: o.x + Math.cos(a) * 0.8, z: o.z + Math.sin(a) * 0.8, y: 1, vx: Math.cos(a), vz: Math.sin(a), laju: s.jarakDekat ? 0 : 42, jarak: s.jangkau, tempuh: 0, dmg: s.dmg, dari: o, warna: s.warna, r: s.dmg > 40 ? 0.32 : 0.2, senjata: s.nama });
      }
      if (o.pemain || d2(o, pemain) < 400) sfx(s.tier >= 3 ? "stempel" : "klik");
    }
    function kena(dari, t, dmg, senjata) {
      if (t.mati || t.fase !== "darat") return;
      const n = dmg * (1 - [0, 0.2, 0.35, 0.5][t.rompi]);
      t.hp -= n; t.minum = 0;
      if (t.pemain) { kedipMerah = 0.35; }
      if (dari.pemain) { penanda = 0.18; angka.push({ x: t.x, z: t.z, teks: Math.round(n), warna: "#FFE08A", umur: 0 }); }
      if (!t.pemain) { t.target = dari; }
      if (t.hp <= 0) pulang(t, dari, senjata);
    }
    function pulang(t, dari, senjata) {
      t.mati = true; t.hp = 0;
      const sisa = orang.filter((o) => !o.mati).length;
      t.peringkat = sisa + 1;
      // jatuhkan barang
      t.senjata.forEach((id) => id && barang.push({ jenis: "senjata", id, x: t.x + acak(-1, 1), z: t.z + acak(-1, 1), r: 0.4 }));
      if (t.teh) barang.push({ jenis: "teh", x: t.x, z: t.z + 1, r: 0.4, jumlah: t.teh });
      if (t.rompi) barang.push({ jenis: "rompi", lv: t.rompi, x: t.x + 1, z: t.z, r: 0.4 });
      efek.push({ x: t.x, z: t.z, r: 2.5, warna: "#7FC8F2", umur: 0, maks: 0.8 });
      if (dari) {
        dari.kill++;
        umpan.tambah(`${dari.nama} ➜ ${t.nama} (${senjata})`, dari.pemain ? "#F2C14E" : "#FFFDF6");
        if (dari.pemain) { sfx("menang"); umum.umumkan(`${t.nama} basah kuyup`, `${dari.kill} pemain kamu pulangkan · sisa ${sisa}`, "#F2C14E"); }
      } else umpan.tambah(`${t.nama} kedinginan di luar zona`, "#7FC8F2");
      if (t.pemain) akhiri(false);
      else if (sisa === 1 && !pemain.mati) akhiri(true);
    }
    function ambilBarang(o) {
      for (let i = barang.length - 1; i >= 0; i--) {
        const b = barang[i];
        if (d2(o, b) > 1.6) continue;
        let ambil = false;
        if (b.jenis === "senjata") {
          const s = SENJATA[b.id];
          const kosong = o.senjata.indexOf(null);
          if (o.senjata.includes(b.id)) { const j = o.senjata.indexOf(b.id); o.peluru[j] = s.mag; ambil = true; }
          else if (kosong >= 0) { o.senjata[kosong] = b.id; o.peluru[kosong] = s.mag; if (!o.senjata[o.aktif]) o.aktif = kosong; ambil = true; }
          else {
            const j = SENJATA[o.senjata[0]].tier <= SENJATA[o.senjata[1]].tier ? 0 : 1;
            if (s.tier > SENJATA[o.senjata[j]].tier) { barang.push({ jenis: "senjata", id: o.senjata[j], x: o.x + 1, z: o.z, r: 0.4 }); o.senjata[j] = b.id; o.peluru[j] = s.mag; ambil = true; }
          }
        } else if (b.jenis === "teh") { if (o.teh < 5) { o.teh = Math.min(5, o.teh + (b.jumlah || 1)); ambil = true; } }
        else if (b.jenis === "rompi") { if (b.lv > o.rompi) { o.rompi = b.lv; ambil = true; } }
        if (ambil) { barang.splice(i, 1); if (o.pemain) { sfx("poin"); umpan.tambah(`Dapat ${namaBarang(b)}`, "#7FD18B"); } }
      }
      for (const p of peti) if (!p.terbuka && d2(o, p) < 2.2) isiPeti(p);
    }
    function minumTeh(o) { if (o.teh <= 0 || o.minum > 0 || o.hp >= 100) return; o.minum = 1.6; if (o.pemain) sfx("pilih"); }

    /* ---------- penglihatan ---------- */
    function terlihat(o, t, jarak) {
      if (t.mati || t.fase !== "darat" || t === o) return false;
      const dd = d2(o, t);
      if (dd > jarak * jarak) return false;
      if (AR.diSemak(t, semak) && dd > 16) return false;
      return !AR.terhalang(o.x, o.z, t.x, t.z, peluruKotak);
    }
    function musuhTerdekat(o, jarak) {
      let t = null, m = Infinity;
      for (const v of orang) { if (!terlihat(o, v, jarak)) continue; const dd = d2(o, v); if (dd < m) { m = dd; t = v; } }
      return t;
    }

    /* ---------- otak bot ---------- */
    const diZona = (o, r = zona.r, x = zona.x, z = zona.z) => (o.x - x) ** 2 + (o.z - z) ** 2 < r * r;
    function otakBot(o, dt) {
      const s = senjataAktif(o);
      if (o.hp < 45 && o.teh > 0 && !musuhTerdekat(o, 10)) minumTeh(o);
      // lawan
      const baruMendarat = waktu - (o.waktuDarat || 0) < 22;
      let lawan = o.target && terlihat(o, o.target, 22) ? o.target : musuhTerdekat(o, o.senjata[0] || o.senjata[1] ? (baruMendarat ? 7 : 14) : 6);
      if (lawan) {
        if (o.senjata[1 - o.aktif] && SENJATA[o.senjata[1 - o.aktif]].tier > s.tier) o.aktif = 1 - o.aktif;
        const jarak = Math.sqrt(d2(o, lawan));
        const ideal = Math.min(senjataAktif(o).jangkau * 0.7, 12);
        o.jedaStrafe -= dt; if (o.jedaStrafe <= 0) { o.strafe *= -1; o.jedaStrafe = acak(0.6, 1.6); }
        const a = Math.atan2(lawan.z - o.z, lawan.x - o.x);
        let mx = -Math.sin(a) * o.strafe * 0.7, mz = Math.cos(a) * o.strafe * 0.7;
        if (jarak > ideal + 1) { mx += Math.cos(a); mz += Math.sin(a); } else if (jarak < ideal - 2) { mx -= Math.cos(a) * 0.6; mz -= Math.sin(a) * 0.6; }
        if (jarak <= senjataAktif(o).jangkau && Math.random() < dt * 5 * o.skill) tembak(o, lawan);
        return { mx, mz, lari: 0.85 };
      }
      o.target = null;
      // zona
      if (!diZona(o, zona.r * 0.92) || (zona.susut && !diZona(o, zona.rBerikut * 0.9, zona.xB, zona.zB))) {
        const tx = zona.susut ? zona.xB : zona.x, tz = zona.susut ? zona.zB : zona.z;
        return arahKe(o, tx, tz);
      }
      // cari peti / barang
      o.ubahTujuan -= dt;
      if (!o.tujuan || o.ubahTujuan <= 0 || (o.tujuan.terbuka) || (o.tujuan.jenis && !barang.includes(o.tujuan) && !peti.includes(o.tujuan))) {
        o.ubahTujuan = 6;
        const butuh = !o.senjata[0] || !o.senjata[1] || o.teh < 2;
        let terbaik = null, m = 30 * 30;
        if (butuh) {
          for (const b of barang) { const dd = d2(o, b); if (dd < m && diZona(b, zona.rBerikut || zona.r, zona.susut ? zona.xB : zona.x, zona.susut ? zona.zB : zona.z)) { m = dd; terbaik = b; } }
          for (const p of peti) { if (p.terbuka) continue; const dd = d2(o, p); if (dd < m) { m = dd; terbaik = p; } }
        }
        o.tujuan = terbaik || { x: zona.xB + acak(-zona.rBerikut * 0.6, zona.rBerikut * 0.6), z: zona.zB + acak(-zona.rBerikut * 0.6, zona.rBerikut * 0.6) };
      }
      return arahKe(o, o.tujuan.x, o.tujuan.z);
    }
    function arahKe(o, x, z) { const dx = x - o.x, dz = z - o.z, l = Math.hypot(dx, dz) || 1; return { mx: dx / l, mz: dz / l, lari: l < 0.6 ? 0 : 1 }; }

    /* ---------- akhir ---------- */
    function akhiri(menang) {
      if (selesai) return;
      const peringkat = menang ? 1 : pemain.peringkat;
      selesai = { menang, peringkat, sisa: 4 };
      if (menang) { sfx("menang"); K.konfetiKertas?.(1.6); umum.umumkan("PULANG PALING AKHIR!", "Juara Kantor Royale", "#F2C14E"); }
      else { sfx("salah"); umum.umumkan(`Peringkat #${peringkat}`, "Kamu basah kuyup dan pulang duluan", "#FF8A7A"); }
    }
    function kirimHasil() {
      const pr = selesai.peringkat;
      const skor = (pr === 1 ? 220 : pr <= 3 ? 150 : pr <= 5 ? 110 : pr <= 10 ? 70 : 35) + pemain.kill * 15;
      api.catatStat("peringkat", pr); api.catatStat("kill", pemain.kill);
      api.selesai(skor, [pr === 1 ? "singa" : "kapibara", `Peringkat #${pr} dari 20 · ${pemain.kill} pemain dipulangkan. ${pr === 1 ? "Pak Singa: PERHATIAN. Juara Kantor Royale. Semua orang lain sudah pulang, kecuali Anda." : pr <= 5 ? "Bu Ratna: Lima besar. Bajunya basah sedikit ya, nanti dikeringkan." : "Bu Ratna: Pulang duluan juga tidak apa-apa. Handuknya di pantry."}`]);
    }

    ctx.canvas._uji = { orang, pemain, zona, peti, barang };   // untuk pengujian otomatis

    /* ---------- tampilan ---------- */
    const d3 = api.buat3D(dunia);
    const tampil = d3 || AR.render2D(api, dunia);
    api.info("Kantor Royale · 20 pemain. Ketuk LONCAT saat pesawat kertas di atas tempat yang kamu mau.");

    const stop = api.loop((dt) => {
      waktu += dt;
      if (!selesai) {
        // pesawat
        if (pes.t < pes.durasi) { pes.t += dt; Object.assign(pes, posPesawat(pes.t)); }
        // zona
        if (pes.t >= pes.durasi * 0.6) {
          zona.sisa -= dt;
          const f = FASE_ZONA[Math.min(zona.fase, FASE_ZONA.length - 1)];
          if (!zona.susut && zona.sisa <= 0) { zona.susut = true; zona.sisa = f[1]; zona.r0 = zona.r; zona.x0 = zona.x; zona.z0 = zona.z; umpan.tambah("Zona aman mulai menyusut!", "#7FC8F2"); if (pemain.fase === "darat") sfx("tingtong"); }
          else if (zona.susut) {
            const p = 1 - Math.max(0, zona.sisa) / f[1];
            zona.r = zona.r0 + (zona.rBerikut - zona.r0) * p; zona.x = zona.x0 + (zona.xB - zona.x0) * p; zona.z = zona.z0 + (zona.zB - zona.z0) * p;
            if (zona.sisa <= 0) {
              zona.susut = false; zona.fase++;
              const g = FASE_ZONA[Math.min(zona.fase, FASE_ZONA.length - 1)];
              zona.sisa = g[0];
              const rb = g[2], ruang = Math.max(0, zona.r - rb), a = acak(0, Math.PI * 2), j = acak(0, ruang * 0.8);
              zona.xB = zona.x + Math.cos(a) * j; zona.zB = zona.z + Math.sin(a) * j; zona.rBerikut = rb;
            }
          }
        }
        // pemain
        const aksi = kend.ambil();
        for (const a of aksi) {
          if (a === "tembak" && pemain.fase === "pesawat") loncat(pemain);
          if (a === "ganti" && pemain.senjata[1 - pemain.aktif]) { pemain.aktif = 1 - pemain.aktif; pemain.isiUlang = 0; sfx("klik"); }
          if (a === "teh") minumTeh(pemain);
        }
        if (pemain.fase === "darat" && kend.tahan.tembak) {
          const s = senjataAktif(pemain);
          tembak(pemain, musuhTerdekat(pemain, s.jangkau + 1));
        }
        // semua orang
        const sisaHidup = orang.filter((o) => !o.mati).length;
        for (const o of orang) {
          if (o.mati) continue;
          if (o.fase === "pesawat") {
            o.x = pes.x; o.z = pes.z;
            if (pes.t >= o.loncatPada || pes.t >= pes.durasi - 0.2) loncat(o);
            continue;
          }
          if (o.cd > 0) o.cd -= dt;
          if (o.lompat > 0) o.lompat = Math.max(0, o.lompat - dt);
          if (o.isiUlang > 0) { o.isiUlang -= dt; if (o.isiUlang <= 0 && o.senjata[o.aktif]) o.peluru[o.aktif] = SENJATA[o.senjata[o.aktif]].mag; }
          if (o.minum > 0) { o.minum -= dt; if (o.minum <= 0 && o.teh > 0) { o.teh--; o.hp = Math.min(100, o.hp + 38); if (o.pemain) { sfx("poin"); angka.push({ x: o.x, z: o.z, teks: "+38", warna: "#7FD18B", umur: 0 }); } } }
          let gx = 0, gz = 0, laju = 6.2;
          if (o.pemain) { gx = kend.gerak.x; gz = kend.gerak.z; if (gx || gz) o.hadap = Math.atan2(gz, gx); }
          else if (o.fase === "turun" && o.titikTurun) { const g = arahKe(o, o.titikTurun.x, o.titikTurun.z); gx = g.mx * g.lari; gz = g.mz * g.lari; }
          else { const g = otakBot(o, dt); gx = g.mx * g.lari; gz = g.mz * g.lari; const l = Math.hypot(gx, gz); if (l > 1) { gx /= l; gz /= l; } if (l > 0.1 && !o.target) o.hadap = Math.atan2(gz, gx); }
          if (o.fase === "turun") {
            o.tinggi -= dt * 3.8; laju = 7;
            if (o.tinggi <= 0) { o.tinggi = 0; o.fase = "darat"; o.waktuDarat = waktu; if (o.pemain) { sfx("klik"); umum.umumkan("MENDARAT", "Cari peti, ambil senjata!", "#7FD18B"); } }
          }
          if (o.minum > 0) laju *= 0.55;
          o.x += gx * laju * dt; o.z += gz * laju * dt;
          if (o.fase === "darat") { AR.tabrakKotak(o, kotak); ambilBarang(o); }
          o.x = AR.batas(o.x, -89, 89); o.z = AR.batas(o.z, -89, 89);
          // di luar zona: kedinginan
          if (o.fase === "darat" && !diZona(o)) { o.hp -= RUSAK_ZONA[Math.min(zona.fase, 4)] * dt; if (o.pemain) kedipMerah = Math.max(kedipMerah, 0.12); if (o.hp <= 0) pulang(o, null, "zona"); }
        }
        // peluru
        for (let i = peluru.length - 1; i >= 0; i--) {
          const q = peluru[i];
          const lx = q.x, lz = q.z;
          q.x += q.vx * q.laju * dt; q.z += q.vz * q.laju * dt; q.tempuh += q.laju * dt;
          let hapus = q.tempuh > q.jarak || AR.terhalang(lx, lz, q.x, q.z, peluruKotak);
          if (!hapus) for (const o of orang) {
            if (o === q.dari || o.mati || o.fase !== "darat") continue;
            if (d2(q, o) < 0.55) { kena(q.dari, o, q.dmg, q.senjata); hapus = true; break; }
          }
          if (hapus) peluru.splice(i, 1);
        }
        void sisaHidup;
      } else {
        selesai.sisa -= dt;
        if (selesai.sisa <= 0) { stop2(); kirimHasil(); return; }
      }
      for (let i = efek.length - 1; i >= 0; i--) { efek[i].umur += dt; if (efek[i].umur > efek[i].maks) efek.splice(i, 1); }
      for (let i = angka.length - 1; i >= 0; i--) { angka[i].umur += dt; if (angka[i].umur > 0.9) angka.splice(i, 1); }
      if (kedipMerah > 0) kedipMerah -= dt;
      if (penanda > 0) penanda -= dt;

      // ===== gambar =====
      const W = api.W(), H = api.H();
      const fokus = pemain.mati ? (orang.find((o) => !o.mati && o.kill === Math.max(...orang.filter((v) => !v.mati).map((v) => v.kill))) || pemain) : pemain.fase === "pesawat" ? pes : pemain;
      const entitas = [];
      for (const o of orang) {
        if (o.mati || o.fase === "pesawat") continue;
        o.payung = o.fase === "turun";
        o.transparan = AR.diSemak(o, semak);
        o.tersembunyi = !o.pemain && o.transparan && d2(o, pemain) > 16;
        o.warna = o.pemain ? "#3E78C4" : "#E05A4E";
        entitas.push(o);
      }
      for (const p of peti) if (!p.terbuka && Math.abs(p.x - fokus.x) < 40 && Math.abs(p.z - fokus.z) < 45) entitas.push(p);
      // barang di tanah ditampilkan lewat objek bayangan berjenis "barang"
      for (const b of barang) if (Math.abs(b.x - fokus.x) < 40 && Math.abs(b.z - fokus.z) < 45) entitas.push(tampilBarang(b));
      const st = {
        fokus, entitas, proyektil: peluru, efek,
        zona, pesawat: pes.t < pes.durasi ? { x: pes.x, z: pes.z, a: pes.a } : null, kameraTinggi: pemain.fase === "pesawat" ? 22 : pemain.fase === "turun" ? 10 * (pemain.tinggi / 16) : 0,
      };
      if (d3) ctx.clearRect(0, 0, W, H);
      tampil.gambar(st, waktu);
      gambarHUD(W, H, dt);
    });
    const bayangBarang = new Map();
    function tampilBarang(b) {
      let e = bayangBarang.get(b);
      if (!e) { e = { jenis: "barang", r: 0.45, skala: 0.85 }; bayangBarang.set(b, e); }
      e.x = b.x; e.z = b.z; e.sprite = spriteBarang(b); e.mati = false; e.tinggi = 0.3;
      return e;
    }

    function gambarHUD(W, H, dt) {
      const T = AR.teks;
      // nama & HP lawan dekat
      for (const o of orang) {
        if (o.mati || o.tersembunyi || o.fase === "pesawat" || o.pemain) continue;
        if (Math.abs(o.x - pemain.x) > 16 || Math.abs(o.z - pemain.z) > 22) continue;
        const p = tampil.proyeksi(o.x, 2.2 + (o.tinggi || 0), o.z);
        if (p.di === false) continue;
        AR.barHp(ctx, p, 30, o.hp, 100, "#E05A4E", o.nama);
      }
      for (const n of angka) { const p = tampil.proyeksi(n.x, 2.4 + n.umur * 1.6, n.z); ctx.globalAlpha = 1 - n.umur / 0.9; T(ctx, `${n.teks}`, p.x, p.y, 13, n.warna); ctx.globalAlpha = 1; }
      // atas: sisa pemain, kill, zona
      const hidup = orang.filter((o) => !o.mati).length;
      ctx.fillStyle = "rgba(20,20,24,.75)"; ctx.fillRect(W / 2 - 80, 6, 160, 30);
      T(ctx, `SISA ${hidup}`, W / 2 - 38, 21, 14, "#FFFDF6"); T(ctx, `KO ${pemain.kill}`, W / 2 + 42, 21, 14, "#F2C14E");
      const f = FASE_ZONA[Math.min(zona.fase, 4)];
      T(ctx, zona.susut ? `Zona menyusut ${Math.ceil(zona.sisa)}d` : `Zona menyusut dalam ${Math.ceil(Math.max(0, zona.sisa))}d`, W / 2, 46, 10, zona.susut ? "#7FC8F2" : "#FFFDF6");
      void f;
      // peta mini
      const mx = W - 78, my = 54, ms = 70, sk = ms / 180;
      ctx.fillStyle = "rgba(20,20,24,.7)"; ctx.fillRect(mx, my, ms, ms);
      ctx.save(); ctx.beginPath(); ctx.rect(mx, my, ms, ms); ctx.clip();
      const pm = (x, z) => [mx + (x + 90) * sk, my + (z + 90) * sk];
      ctx.beginPath(); const [zx, zy] = pm(zona.x, zona.z); ctx.arc(zx, zy, zona.r * sk, 0, 7); ctx.strokeStyle = "#7FC8F2"; ctx.lineWidth = 2; ctx.stroke();
      if (zona.rBerikut) { const [bx, by] = pm(zona.xB, zona.zB); ctx.beginPath(); ctx.arc(bx, by, zona.rBerikut * sk, 0, 7); ctx.strokeStyle = "#FFFDF6"; ctx.lineWidth = 1; ctx.stroke(); }
      if (pes.t < pes.durasi) { const [a1, b1] = pm(pes.x0, pes.z0), [a2, b2] = pm(posPesawat(pes.durasi).x, posPesawat(pes.durasi).z); ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(a1, b1); ctx.lineTo(a2, b2); ctx.strokeStyle = "#FFFDF6"; ctx.stroke(); ctx.setLineDash([]); }
      const [px2, py2] = pm(pemain.fase === "pesawat" ? pes.x : pemain.x, pemain.fase === "pesawat" ? pes.z : pemain.z);
      ctx.fillStyle = "#F2C14E"; ctx.fillRect(px2 - 3, py2 - 3, 6, 6);
      ctx.restore();
      // panah ke zona kalau di luar
      if (pemain.fase === "darat" && !diZona(pemain)) {
        const a = Math.atan2(zona.z - pemain.z, zona.x - pemain.x);
        ctx.save(); ctx.translate(W / 2 + Math.cos(a) * 70, H * 0.42 + Math.sin(a) * 70); ctx.rotate(a);
        ctx.fillStyle = "#7FC8F2"; ctx.beginPath(); ctx.moveTo(16, 0); ctx.lineTo(-8, -10); ctx.lineTo(-8, 10); ctx.closePath(); ctx.fill(); ctx.restore();
        T(ctx, "Di luar zona aman! Kembali ke lingkaran", W / 2, H * 0.24, 12, "#7FC8F2");
      }
      // HP, rompi, senjata
      const y0 = H - 168;
      ctx.fillStyle = "rgba(20,20,24,.75)"; ctx.fillRect(10, y0, 150, 52);
      ctx.fillStyle = "#3B4046"; ctx.fillRect(16, y0 + 8, 138, 10);
      ctx.fillStyle = pemain.hp > 35 ? "#7FD18B" : "#E05A4E"; ctx.fillRect(16, y0 + 8, 138 * Math.max(0, pemain.hp) / 100, 10);
      T(ctx, `${Math.max(0, Math.ceil(pemain.hp))}`, 154, y0 + 13, 10, "#FFFDF6", "right");
      const s = senjataAktif(pemain), slot = pemain.aktif;
      T(ctx, `${s.nama}${pemain.senjata[slot] ? ` ${pemain.isiUlang > 0 ? "isi ulang..." : `${pemain.peluru[slot]}/${s.mag}`}` : ""}`, 16, y0 + 30, 10, "#F2C14E", "left");
      T(ctx, `Rompi Lv${pemain.rompi} · Teh x${pemain.teh}${pemain.minum > 0 ? " · minum..." : ""}`, 16, y0 + 44, 10, "#FFFDF6", "left");
      kend.label.tembak = pemain.fase === "pesawat" ? "LONCAT" : pemain.fase === "turun" ? "..." : "TEMBAK";
      kend.label.teh = `TEH ${pemain.teh}`;
      kend.nonaktif.ganti = !pemain.senjata[1 - pemain.aktif];
      kend.nonaktif.teh = !pemain.teh;
      kend.cd = { tembak: pemain.isiUlang > 0 ? pemain.isiUlang : 0, teh: pemain.minum > 0 ? pemain.minum : 0 };
      kend.cdMaks = { tembak: s.isi || 1, teh: 1.6 };
      if (penanda > 0) { ctx.strokeStyle = "#FFFDF6"; ctx.lineWidth = 2; const cx = W / 2, cy = H * 0.5; ctx.beginPath(); ctx.moveTo(cx - 10, cy - 10); ctx.lineTo(cx - 4, cy - 4); ctx.moveTo(cx + 10, cy - 10); ctx.lineTo(cx + 4, cy - 4); ctx.moveTo(cx - 10, cy + 10); ctx.lineTo(cx - 4, cy + 4); ctx.moveTo(cx + 10, cy + 10); ctx.lineTo(cx + 4, cy + 4); ctx.stroke(); }
      if (kedipMerah > 0) { ctx.fillStyle = `rgba(127,180,230,${kedipMerah})`; ctx.fillRect(0, 0, W, H); }
      if (pemain.fase === "pesawat") T(ctx, "Ketuk LONCAT di atas lokasi pilihanmu", W / 2, H * 0.62, 13, "#FFFDF6");
      umpan.gambar(ctx, W, 130, dt);
      umum.gambar(ctx, W, H, dt);
      if (!pemain.mati) kend.gambar(ctx);
      if (pemain.mati && !selesai) T(ctx, "Menonton pemain lain...", W / 2, H * 0.5, 14);
    }
    function stop2() { stop(); kend.hapus(); }
    return stop2;
  }

  function htmlPilihan() {
    const p = K.data.setelan.royale || "kapibara";
    const daftar = ["kapibara", "kura", "marmut", "kukang", "oyen", "badak", "rakun", "berang", "singa", "gajah", "hantu", "beruang"];
    return `
      <div class="ap-bagian royale-pilih">
        <p class="ap-label">Pilih karakter</p>
        <div class="gp-karakter">${daftar.map((k) => `<button type="button" class="da-kar${p === k ? " dipilih" : ""}" data-royale="${k}" aria-label="${k}">${K.px(k)}</button>`).join("")}</div>
        <p class="muted small">Senjata di sini cuma pistol air, ketapel karet, bola kertas, dan stempel. Yang kalah basah kuyup, lalu pulang duluan.</p>
      </div>`;
  }
  function pasang(panel) {
    panel.querySelector(".royale-pilih")?.addEventListener("click", (e) => {
      const b = e.target.closest("[data-royale]");
      if (!b) return;
      K.data.setelan.royale = b.dataset.royale; K.simpan(); sfx("pilih");
      panel.querySelectorAll("[data-royale]").forEach((x) => x.classList.toggle("dipilih", x === b));
    });
  }
  K.ROYALE = { main, htmlPilihan, pasang, SENJATA };
})();
