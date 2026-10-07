/* =========================================================
   Misteri Lantai 13 · Bab 4 (Arsip Bawah Tanah)
                      · Bab 5 (Jam di Atap)
                      · Bab 6 (Lantai 13) + Ruang Rahasia
   ========================================================= */
(() => {
  "use strict";
  const K = window.KLP;
  const L13 = K.L13;
  const { $, esc, px, sfx, memo, NAMA, N } = K;
  const ink = "#2B2A26";
  const svg = (isi) => `<svg viewBox="0 0 300 400" preserveAspectRatio="none" aria-hidden="true">${isi}</svg>`;
  const jam = (x, y, r, [j, m] = [10, 10], warna = "#FFFDF6") => {
    const sJ = ((j % 12) + m / 60) * 30, sM = m * 6;
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="${warna}" stroke="${ink}" stroke-width="3"/>
      <line x1="${x}" y1="${y}" x2="${x}" y2="${y - r * 0.5}" stroke="${ink}" stroke-width="3" transform="rotate(${sJ} ${x} ${y})"/>
      <line x1="${x}" y1="${y}" x2="${x}" y2="${y - r * 0.8}" stroke="#B5443A" stroke-width="2" transform="rotate(${sM} ${x} ${y})"/>`;
  };

  /* ---------- gambar ruangan ---------- */
  Object.assign(L13.LATAR, {
    tangga: (L) => svg(`
      <rect width="300" height="400" fill="#4A4540"/>
      ${[0, 1, 2, 3, 4, 5, 6].map((i) => `<rect x="${i * 20}" y="${260 + i * 20}" width="${300 - i * 20}" height="20" fill="${i % 2 ? "#5C564F" : "#67615A"}" stroke="${ink}" stroke-width="2"/>`).join("")}
      <rect x="150" y="80" width="110" height="180" fill="${L.flag("pintuTerbuka") ? "#111" : "#8A5E3B"}" stroke="${ink}" stroke-width="5"/>
      ${L.flag("pintuTerbuka") ? "" : `<circle cx="240" cy="176" r="6" fill="#F2C14E" stroke="${ink}" stroke-width="2"/>`}
      <rect x="160" y="52" width="90" height="22" fill="#FFFDF6" stroke="${ink}" stroke-width="2"/>
      <text x="205" y="67" text-anchor="middle" font-family="Pixelify Sans" font-size="9" fill="${ink}">GUDANG ARSIP</text>
      <text x="205" y="98" text-anchor="middle" font-family="VT323" font-size="11" fill="#F0EADB">dibuka terakhir: 1998</text>
      <circle cx="60" cy="60" r="12" fill="#6A645C" stroke="${ink}" stroke-width="3"/>
      <text x="150" y="30" text-anchor="middle" font-family="Pixelify Sans" font-size="12" fill="#F0EADB">TANGGA BAWAH TANAH</text>`),

    arsip: () => svg(`
      <rect width="300" height="400" fill="#7A7268"/>
      <rect x="0" y="320" width="300" height="80" fill="#5C564F"/><rect x="0" y="320" width="300" height="4" fill="${ink}"/>
      <!-- lemari besar -->
      <rect x="14" y="110" width="96" height="210" fill="#8A8F94" stroke="${ink}" stroke-width="4"/>
      <line x1="62" y1="110" x2="62" y2="320" stroke="${ink}" stroke-width="3"/>
      <rect x="52" y="200" width="6" height="18" fill="${ink}"/><rect x="66" y="200" width="6" height="18" fill="${ink}"/>
      <!-- rak berkas -->
      <rect x="124" y="140" width="80" height="180" fill="#9C6B43" stroke="${ink}" stroke-width="4"/>
      ${[0, 1, 2, 3].map((r) => `<rect x="124" y="${180 + r * 40}" width="80" height="4" fill="${ink}"/>${[0, 1, 2, 3, 4, 5].map((b) => `<rect x="${130 + b * 12}" y="${152 + r * 40}" width="9" height="28" fill="${["#E0B84A", "#F4EFE3", "#7F98B4"][(b + r) % 3]}" stroke="${ink}" stroke-width="1"/>`).join("")}`).join("")}
      <!-- loker -->
      <rect x="216" y="170" width="74" height="150" fill="#5B6F86" stroke="${ink}" stroke-width="4"/>
      ${[0, 1, 2].map((i) => `<rect x="222" y="${178 + i * 46}" width="62" height="38" fill="#6F8AA8" stroke="${ink}" stroke-width="2"/>`).join("")}
      <rect x="240" y="228" width="26" height="14" fill="#23302A" stroke="${ink}" stroke-width="2"/>
      <text x="150" y="30" text-anchor="middle" font-family="Pixelify Sans" font-size="12" fill="${ink}">GUDANG ARSIP · BAWAH TANAH</text>`),

    atap: (L) => svg(`
      <defs><linearGradient id="senja" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9FB4C4"/><stop offset="1" stop-color="#F2D28A"/></linearGradient></defs>
      <rect width="300" height="400" fill="url(#senja)"/>
      ${[[0, 210, 40, 60], [36, 190, 30, 80], [70, 220, 50, 50], [210, 196, 34, 74], [240, 214, 60, 56]].map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#7F8A9A"/>`).join("")}
      <rect x="0" y="270" width="300" height="130" fill="#A39C90"/><rect x="0" y="270" width="300" height="4" fill="${ink}"/>
      <rect x="0" y="262" width="300" height="10" fill="#8A847A" stroke="${ink}" stroke-width="2"/>
      <!-- rumah tangga -->
      <rect x="150" y="150" width="120" height="120" fill="#D6CCB4" stroke="${ink}" stroke-width="4"/>
      <rect x="176" y="200" width="44" height="70" fill="#8A5E3B" stroke="${ink}" stroke-width="3"/>
      ${jam(240, 186, 18, L.s?.flag?.["jam:atap"] || [6, 30])}
      <!-- antena -->
      <rect x="64" y="90" width="5" height="180" fill="${ink}"/>
      <rect x="44" y="110" width="45" height="4" fill="${ink}"/><rect x="50" y="130" width="33" height="4" fill="${ink}"/>
      <circle cx="66" cy="86" r="5" fill="#B5443A" class="kedip-antena"/>
      ${L.flag("stikerJatuh") ? "" : `<circle cx="66" cy="150" r="9" fill="#F2C14E" stroke="${ink}" stroke-width="2"/>`}
      <!-- kursi plastik & jemuran -->
      <rect x="96" y="304" width="40" height="8" fill="#7FB2D9" stroke="${ink}" stroke-width="2"/>
      <rect x="98" y="312" width="4" height="26" fill="#7FB2D9"/><rect x="130" y="312" width="4" height="26" fill="#7FB2D9"/>
      <rect x="96" y="276" width="40" height="28" fill="none" stroke="#7FB2D9" stroke-width="4"/>
      <line x1="0" y1="96" x2="150" y2="150" stroke="${ink}" stroke-width="1.5"/>
      <rect x="100" y="128" width="14" height="18" fill="#FFFDF6" stroke="${ink}" stroke-width="1.5"/>
      <text x="150" y="30" text-anchor="middle" font-family="Pixelify Sans" font-size="12" fill="${ink}">ATAP GEDUNG</text>`),

    lift: (L) => svg(`
      <rect width="300" height="400" fill="#9AA2AA"/>
      ${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${i * 50}" y="0" width="3" height="400" fill="#8B939B"/>`).join("")}
      <rect x="0" y="330" width="300" height="70" fill="#6A727A"/>
      <rect x="196" y="120" width="70" height="160" fill="#3B4046" stroke="${ink}" stroke-width="4"/>
      ${["5", "4", "3", "2", "1", "L"].map((t, i) => `<circle cx="${216 + (i % 2) * 30}" cy="${140 + Math.floor(i / 2) * 26}" r="9" fill="#5C636B" stroke="${ink}" stroke-width="2"/><text x="${216 + (i % 2) * 30}" y="${144 + Math.floor(i / 2) * 26}" text-anchor="middle" font-family="VT323" font-size="12" fill="#D7DCE0">${t}</text>`).join("")}
      <circle cx="231" cy="222" r="11" fill="${L.flag("tombolTerpasang") ? "#F2C14E" : "#5C636B"}" stroke="${ink}" stroke-width="2"/>
      <text x="231" y="226" text-anchor="middle" font-family="VT323" font-size="12" fill="${ink}">${L.flag("tombolTerpasang") ? "13" : ""}</text>
      <rect x="30" y="40" width="80" height="26" fill="#1E1A14" stroke="${ink}" stroke-width="2"/>
      <text x="70" y="59" text-anchor="middle" font-family="VT323" font-size="18" fill="#F2C14E">${L.flag("sampai") ? "13" : "▲ 5"}</text>
      <text x="150" y="30" text-anchor="middle" font-family="Pixelify Sans" font-size="12" fill="${ink}">DI DALAM LIFT</text>`),

    lantai13: () => svg(`
      <defs><radialGradient id="lampu13" cx="50%" cy="20%" r="80%"><stop offset="0" stop-color="#FFE7A3"/><stop offset="1" stop-color="#C9A86A"/></radialGradient></defs>
      <rect width="300" height="400" fill="url(#lampu13)"/>
      <rect x="0" y="330" width="300" height="70" fill="#9C6B43"/><rect x="0" y="330" width="300" height="4" fill="${ink}"/>
      <!-- rak toples -->
      ${[0, 1, 2].map((r) => `<rect x="14" y="${110 + r * 70}" width="272" height="6" fill="#8A5E3B" stroke="${ink}" stroke-width="2"/>
        ${[0, 1, 2, 3, 4, 5, 6].map((j) => `<rect x="${24 + j * 38}" y="${80 + r * 70}" width="24" height="30" rx="4" fill="#EEF3F6" fill-opacity=".85" stroke="${ink}" stroke-width="2"/><rect x="${24 + j * 38}" y="${76 + r * 70}" width="24" height="6" fill="${["#B5443A", "#2F4A6B", "#4F6E5E", "#9A7224"][(j + r) % 4]}" stroke="${ink}" stroke-width="1.5"/><circle cx="${36 + j * 38}" cy="${96 + r * 70}" r="${3 + ((j * 7 + r) % 4)}" fill="${["#F2C14E", "#7FA868", "#7F98B4", "#E39B4A"][(j + r * 2) % 4]}"/>`).join("")}`).join("")}
      <!-- meja teh -->
      <rect x="98" y="300" width="104" height="12" fill="#8A5E3B" stroke="${ink}" stroke-width="3"/>
      <rect x="110" y="312" width="6" height="22" fill="${ink}"/><rect x="184" y="312" width="6" height="22" fill="${ink}"/>
      <rect x="116" y="284" width="16" height="16" fill="#FFFDF6" stroke="${ink}" stroke-width="2"/>
      <rect x="160" y="278" width="22" height="22" fill="#FFFDF6" stroke="${ink}" stroke-width="2"/><rect x="160" y="274" width="22" height="6" fill="#2F4A6B" stroke="${ink}" stroke-width="1.5"/>
      <text x="150" y="30" text-anchor="middle" font-family="Pixelify Sans" font-size="12" fill="${ink}">LANTAI 13</text>
      <text x="150" y="50" text-anchor="middle" font-family="Patrick Hand" font-size="12" fill="#5D5A50">(tidak tercatat di lift, sengaja)</text>`),
  });

  /* ---------- barang ---------- */
  Object.assign(L13.barang, {
    buku: { nama: "Buku Catatan Penjaga", sprite: "buku", ket: "Tulisan tangannya miring, ditulis pakai cakar. Ada bekas teh di sampulnya." },
    tombol13: { nama: "Stiker Tombol 13", sprite: "tombol13", ket: "Jatuh dari antena di atap. Bagian belakangnya masih lengket. Ukurannya pas untuk panel lift." },
    kunci13: { nama: "Kunci Lantai 13", sprite: "kunci", ket: "Kunci kecil berwarna emas. Membuka Ruang Rahasia lewat tombol 13 di lift." },
  });
  Object.assign(L13.langka, {
    buku: { nama: "Buku Catatan Penjaga", sprite: "buku", ket: "Berisi catatan penjaga lantai 13 sebelumnya. Tulisan tangannya miring karena memakai cakar." },
    tombol13: { nama: "Stiker Tombol 13 (cadangan)", sprite: "tombol13", ket: "Yang satu dipasang di lift. Yang ini cadangan, kalau yang asli lepas karena terlalu sering ditekan." },
    kunci13: { nama: "Kunci Lantai 13", sprite: "kunci", ket: "Tanda jabatan Penjaga Lantai 13. Jangan dihilangkan. Kalau hilang, Oyen punya duplikat di bawah kulkas." },
  });

  /* =========================================================
     BAB 4 · Arsip Bawah Tanah
     ========================================================= */
  L13.bab[4] = {
    judul: "Arsip Bawah Tanah",
    teaser: "Ruang arsip bawah tanah dibuka untuk pertama kali sejak 1998.",
    ruangAwal: "tangga",
    langka: "buku",
    penutup: "Buku catatan penjaga menyebut jam paling tenang: 16.59. Semua jam di gedung harus sepakat. Dimas sudah lari duluan ke atas.",
    petunjuk: {
      pintu: ["Pintunya terkunci ya. Kamu punya kuncinya dari pos jaga.", "Pilih Kunci Gudang di laci, lalu ketuk pintunya."],
      gelap: ["Gelap sekali ya. Pak Satpam meminjamkan sesuatu yang terang.", "Pilih Senter di laci, lalu ketuk di mana saja di kegelapan."],
      lemari: ["Coba periksa lemari besi besar di kiri. Ketuk dulu sebelum buka. Atau jangan, terserah.", "Lemari besarnya di kiri ruangan."],
      loker: ["Kode loker ada di poster K3 di balik pintu lemari ya.", "Lihat KIRI 4 kali, lihat KANAN 1 kali, tarik napas 7 detik. Angka-angkanya dipakai berurutan."],
    },
    async pembuka(L) {
      L.tujuan("pintu");
      await L.bilang("narasi", "Tangga menuju bawah tanah. Lampunya berkedip seperti sedang berpikir. Udara di sini berbau kertas lama dan sedikit teh.");
      await L.bilang("dimas", "Saya IKUT. Eh, maksudnya, saya ikut. Pak Satpam bilang jangan sendirian. *saya juga nggak mau sendirian.");
    },
    ruang: {
      tangga: {
        nama: "Tangga bawah tanah", latar: "tangga",
        titik: [
          { id: "pintu", x: 150, y: 80, w: 110, h: 180, label: "Pintu gudang",
            async ketuk(L) {
              if (L.flag("pintuTerbuka")) { L.ruang("arsip"); return; }
              await L.bilang("narasi", "Pintu kayu berat. Terkunci. Ada tulisan kecil di bawah papan nama: \"Mohon ketuk dulu.\"");
            },
            async pakai(L, b) {
              if (b !== "kunciGudang") return false;
              L.flag("pintuTerbuka", true); L.segarkan(); L.sfx("stempel");
              await L.bilang("narasi", "Kuncinya pas. Pintu terbuka dengan bunyi yang panjang dan agak dramatis. Di dalamnya gelap total.");
              await L.bilang("dimas", "Itu tadi bunyi pintu kan. Bukan bunyi... hal lain. Kan?");
              L.tujuan("gelap");
            } },
          { id: "dimas", x: 30, y: 230, w: 56, h: 60, label: "Dimas", gambar: "marmut",
            async ketuk(L) {
              const j = await L.tanya("dimas", "Saya di sini. Saya berani. Saya cuma berdiri agak jauh dari pintu.", ["Kamu takut?", "Mau pegangan?"]);
              if (j === 0) await L.bilang("dimas", "NGGAK— eh. Sedikit. Takut gelap, takut sunyi, takut kalau ternyata isinya cuma berkas pajak.");
              else await L.bilang("dimas", "...boleh? Oke. Saya pegang ujung baju aja. *lebih tenang, sumpah.");
            } },
          { id: "lampu", x: 40, y: 40, w: 50, h: 48, label: "Lampu",
            async ketuk(L) { await L.bilang("narasi", "Lampunya berkedip dua kali, lalu menyala stabil. Seperti mengatakan: oke, saya bangun."); } },
        ],
      },
      arsip: {
        nama: "Gudang Arsip", latar: "arsip",
        async masuk(L) {
          if (!L.flag("senterNyala")) { L.gelap(true, true); if (!L.flag("bilangGelap")) { L.flag("bilangGelap", true); await L.bilang("narasi", "Gelap total. Anda tidak bisa melihat tangan sendiri. Dimas bisa, katanya, tapi itu karena dia menutup mata."); } }
          else L.gelap(true);
        },
        titik: [
          { id: "gelapnya", x: 0, y: 60, w: 300, h: 340, label: "Kegelapan", samar: true, tampil: (L) => !L.flag("senterNyala"),
            async ketuk(L) { await L.bilang("narasi", "Gelap. Sangat gelap. Kegelapan yang sopan, tapi tetap gelap."); },
            async pakai(L, b) {
              if (b !== "senter") return false;
              L.flag("senterNyala", true); L.sfx("klik");
              L.gelap(true);
              L.segarkan();
              await L.bilang("narasi", "Klik. Senter menyala. Geser jari di layar untuk menyorot. Rak berkas, lemari besi, dan loker muncul dari kegelapan.");
              L.tujuan("lemari");
            } },
          { id: "lemari", x: 14, y: 110, w: 96, h: 210, label: "Lemari besi", tampil: (L) => L.flag("senterNyala"),
            async ketuk(L) {
              if (L.flag("lemariDibuka")) { await bacaPoster(L); return; }
              L.flag("lemariDibuka", true);
              await L.bilang("narasi", "Lemari besi besar. Pintunya sedikit terbuka. Dari dalam terdengar bunyi... dengkuran?");
              await L.kejut({
                gambar: `<span class="kejut-sprite">${px("oyen")}</span>`,
                teriak: "MEONG.",
                siapa: "oyen",
                punchline: "Rapat sedang berlangsung. Mohon ketuk dulu.",
              });
              await L.bilang("narasi", "Oyen keluar dari lemari dengan tenang, merapikan dasinya, lalu berjalan ke atas tanpa menoleh.");
              await L.bilang("dimas", "ITU OYEN. Eh. Itu Oyen. Dia rapat sama siapa di dalam lemari?? *saya nggak mau tahu. saya mau tahu.");
              await L.bilang("narasi", "Di balik pintu lemari tertempel poster tua.");
              await bacaPoster(L);
              L.tujuan("loker");
            } },
          { id: "rak", x: 124, y: 140, w: 80, h: 180, label: "Rak berkas", tampil: (L) => L.flag("senterNyala"),
            async ketuk(L) { await L.bilang("narasi", K.acak(["Berkas-berkas lama: \"Laporan Galon Kosong 1998\", \"Laporan Galon Kosong 1999\", \"Laporan Galon Kosong 2000 (lanjutan)\".", "Satu map berlabel \"RAHASIA\". Isinya resep teh Bu Ratna. Tidak terlalu rahasia.", "Arsip tahun 2003: \"Pengajuan kucing sebagai Kepala Bagian\". Statusnya: DISETUJUI, dengan bekas tapak kaki."])); } },
          { id: "loker", x: 216, y: 170, w: 74, h: 150, label: "Loker kode", tampil: (L) => L.flag("senterNyala"),
            async ketuk(L) {
              if (L.punya("buku")) { await L.bilang("narasi", "Lokernya sudah kosong. Ada bau teh yang tertinggal."); return; }
              const ok = await L.gembok({ judul: "Loker arsip", ket: "Tiga digit. Ada stiker kecil: \"kode = langkah aman\".", kode: "417" });
              if (!ok) { await L.bilang("dimas", "Mungkin kodenya ada di poster? Saya lihat ada poster tadi. Saya nggak baca. Saya lagi panik."); return; }
              await L.bilang("narasi", "Loker terbuka. Di dalamnya ada buku catatan kecil dengan bekas teh di sampulnya.");
              L.dapat("buku"); L.langka("buku");
              await L.lihat(`
                <h3 class="teka-judul">Buku Catatan Penjaga</h3>
                <p class="tulisan-cakar">Catatan penjaga lantai 13.</p>
                <p class="tulisan-cakar">Lantai ini hanya terbuka kalau jam-jam di gedung sepakat.</p>
                <p class="tulisan-cakar">Jam yang disepakati: <b>16.59</b>. Jam paling tenang. Pekerjaan hampir selesai, belum ada yang buru-buru pulang.</p>
                <p class="tulisan-cakar">Jam lobi, jam pantry, jam atap. Kalau ketiganya setuju, tombolnya lepas sendiri.</p>
                <p class="tulisan-cakar">Jangan lupa teh manis untuk yang lembur.</p>
                <p class="tulisan-cakar" style="text-align:right">— O.</p>`, "Tutup buku");
              await L.bilang("dimas", "O? O itu siapa? ...OH. Eh. Bukan. Mungkin O itu... Orang. Orang biasa. *bukan kucing. pasti bukan kucing.");
              await L.bilang("narasi", "Dimas sudah lari duluan ke atas. Anda menyusul dengan langkah yang lebih santai.");
              await L.selesaiBab();
            } },
          { id: "naik", x: 0, y: 340, w: 70, h: 56, label: "← Tangga", keluar: true, ke: "tangga", tampil: (L) => L.flag("senterNyala") },
        ],
      },
    },
  };
  async function bacaPoster(L) {
    await L.lihat(`
      <h3 class="teka-judul">POSTER K3 · Ingat 3 Langkah Aman</h3>
      <p>1. Lihat <b>KIRI</b>, <b>4</b> kali.</p>
      <p>2. Lihat <b>KANAN</b>, <b>1</b> kali.</p>
      <p>3. Tarik napas, <b>7</b> detik.</p>
      <p class="muted small">Dikeluarkan oleh Bagian Keselamatan Kerja, 1998. Masih berlaku. Terutama langkah 3.</p>`, "Sudah dibaca");
  }

  /* =========================================================
     BAB 5 · Jam di Atap
     ========================================================= */
  const TARGET = [16, 59];
  const jamBenar = (L, id) => { const v = L.flagGlobal(`jam:${id}`); return v && v[0] === TARGET[0] && v[1] === TARGET[1]; };
  const semuaBenar = (L) => ["lobi", "pantry", "atap"].every((id) => jamBenar(L, id));
  async function setelJam(L, id, nama, awal) {
    const sekarang = L.flagGlobal(`jam:${id}`) || awal;
    const h = await L.jam({ judul: `Jam ${nama}`, ket: "Putar jarumnya. Buku catatan penjaga menyebut satu jam tertentu.", jam: sekarang[0], menit: sekarang[1], target: TARGET });
    if (!h) return;
    L.flagGlobal(`jam:${id}`, [h.jam, h.menit]); L.segarkan();
    const sisa = ["lobi", "pantry", "atap"].filter((x) => !jamBenar(L, x)).length;
    if (!h.benar) { await L.bilang("narasi", "Jamnya berdetak, tapi tidak terdengar yakin. Sepertinya bukan jam itu."); return; }
    if (sisa) { await L.bilang("narasi", `Klik. Jam ${nama} sepakat. Masih ada ${sisa} jam lagi yang belum.`); return; }
    if (id !== "atap") { await L.bilang("narasi", "Klik. Ketiga jam sepakat. Dari arah atap terdengar bunyi kecil: \"tik.\""); return; }
    await adeganStiker(L);
  }
  async function adeganStiker(L) {
    if (L.flag("stikerJatuh")) return;
    await L.bilang("narasi", "Tik. Ketiga jam di gedung menunjuk 16.59 bersamaan. Angin bertiup pelan. Sesuatu berwarna kuning terlepas dari antena dan melayang turun.");
    L.flag("stikerJatuh", true); L.segarkan(); L.sfx("boing");
    await L.bilang("narasi", "Anda menangkapnya. Stiker bulat bertuliskan 13. Bagian belakangnya masih lengket.");
    L.dapat("tombol13"); L.langka("tombol13");
    await L.bilang("ratna", "Oh, kamu di sini ya. Saya bawa teh. Dua gelas, untuk jaga-jaga.");
    const j = await L.tanya("ratna", "Di sini anginnya enak ya. Saya suka ke sini jam segini. Semua orang hampir pulang, tapi belum ada yang buru-buru.", ["Ibu tahu soal lantai 13?", "Tehnya manis, Bu"]);
    if (j === 0) await L.bilang("ratna", "Saya tahu ada yang sering bikin teh manis buat yang lembur. Saya nggak pernah tanya siapa. Ada hal yang lebih enak kalau nggak ditanya ya.");
    else await L.bilang("ratna", "Iya. Gulanya muncul lagi tadi pagi. Satu toples. Ada catatannya: \"pinjam dulu\". Tulisannya miring.");
    await L.bilang("narasi", "Kalian minum teh sampai jam 17.00. Tidak ada yang bicara. Itu juga termasuk kegiatan.");
    await L.selesaiBab();
  }
  L13.bab[5] = {
    judul: "Jam di Atap",
    teaser: "Angin di atap meniup sesuatu yang berbunyi klik.",
    ruangAwal: "lobi",
    langka: "tombol13",
    penutup: "Stiker tombol 13 sudah di laci. Bu Ratna menghabiskan dua gelas teh. Dua-duanya, karena Anda lupa minum.",
    petunjuk: {
      jam: ["Buku catatan bilang jamnya 16.59 ya. Jam paling tenang.", "Ada tiga jam: di lobi, di pantry, dan di atap. Semuanya disetel ke 16.59.", "Jam 16 itu jam 4 sore. Jarum pendek dekat angka 5, jarum panjang hampir di angka 12."],
    },
    async pembuka(L) {
      L.tujuan("jam");
      await L.bilang("narasi", "Lobi. Jam dinding masih macet di 10.10. Buku catatan penjaga terasa sedikit hangat di laci.");
      await L.bilang("satpam", "Siap. Laporan: semua jam di gedung menunjukkan waktu berbeda. Sudah dari dulu. Saya kira itu gaya.");
    },
    ruang: {
      lobi: {
        nama: "Lobi", latar: "lobi",
        titik: [
          { id: "jam", x: 230, y: 34, w: 50, h: 52, label: "Jam lobi",
            async ketuk(L) { await setelJam(L, "lobi", "lobi", [10, 10]); } },
          { id: "satpam", x: 126, y: 178, w: 56, h: 66, label: "Pak Satpam", gambar: "kura",
            async ketuk(L) { await L.bilang("satpam", semuaBenar(L) ? "Siap. Semua jam sepakat. Pertama kali dalam sejarah gedung. Saya terharu. Secara profesional." : "Siap. Jam lobi macet di 10.10 sejak saya bertugas. Silakan diubah. Saya tidak terikat secara emosional. Sedikit."); } },
          { id: "tangga", x: 104, y: 330, w: 92, h: 56, label: "Tangga ke Pantry ↑", keluar: true, ke: "pantry" },
        ],
      },
      pantry: {
        nama: "Pantry · Lantai 3", latar: "pantry",
        titik: [
          { id: "jam", x: 248, y: 46, w: 48, h: 48, label: "Jam pantry",
            async ketuk(L) { await setelJam(L, "pantry", "pantry", [3, 0]); } },
          { id: "kukang", x: 120, y: 236, w: 56, h: 62, label: "Mas Kukang", gambar: "kukang",
            async ketuk(L) { await L.bilang("kukang", "...jam pantry selalu jam tiga. Itu jam galon kosong. Kalau diubah... mungkin galonnya juga berubah. Pelan-pelan."); } },
          { id: "turun", x: 4, y: 330, w: 70, h: 60, label: "← Lobi", keluar: true, ke: "lobi" },
          { id: "atap", x: 230, y: 330, w: 66, h: 60, label: "Ke atap ↑", keluar: true, ke: "atap" },
        ],
      },
      atap: {
        nama: "Atap gedung", latar: "atap",
        async masuk(L) {
          if (!L.flag("masukAtap")) { L.flag("masukAtap", true); await L.bilang("narasi", "Atap gedung. Langit sore, angin pelan, dan jemuran seseorang yang isinya satu handuk kecil bersulam B.H."); }
          if (semuaBenar(L) && !L.flag("stikerJatuh")) await adeganStiker(L);
        },
        titik: [
          { id: "jam", x: 214, y: 162, w: 52, h: 50, label: "Jam atap",
            async ketuk(L) { await setelJam(L, "atap", "atap", [6, 30]); } },
          { id: "antena", x: 40, y: 80, w: 54, h: 110, label: "Antena",
            async ketuk(L) { await L.bilang("narasi", L.flag("stikerJatuh") ? "Antena berkedip pelan. Tanpa stiker, ia terlihat lebih ringan." : "Ada stiker bulat kuning menempel di antena. Terlalu tinggi untuk diraih. Ia berkedip setiap kali jam berdetak."); } },
          { id: "kursi", x: 92, y: 274, w: 48, h: 66, label: "Kursi plastik",
            async ketuk(L) { await L.bilang("narasi", "Kursi plastik biru. Ada bekas duduk yang kecil dan bulat. Kursi ini sepertinya sering dipakai menatap matahari terbenam oleh seseorang berbulu."); } },
          { id: "turun", x: 4, y: 340, w: 76, h: 56, label: "← Pantry", keluar: true, ke: "pantry" },
        ],
      },
    },
  };

  /* =========================================================
     BAB 6 · Lantai 13
     ========================================================= */
  function toplesMira() {
    const d = K.data, j = d.jejak;
    const baris = [
      ["Hari baik yang dilaporkan", j.loketB || 0],
      ["Keluhan yang disetujui", j.loketA || 0],
      ["Semangat yang didaftarkan", j.loketC || 0],
      ["Rekor rally", d.skor.rally ?? 0],
      ["Gosip yang terkumpul", d.gosip.length],
      ["Obrolan yang selesai", Object.keys(j).filter((k) => k.startsWith("ngobrol:")).length],
      ["Barang koperasi", Object.values(d.barang).reduce((a, b) => a + b, 0)],
      ["Kejutan yang dilaporkan", j.kaget || 0],
    ];
    return `<table class="poster-piket"><tbody>${baris.map(([a, b]) => `<tr><th>${esc(a)}</th><td class="mono">${b}</td></tr>`).join("")}</tbody></table>`;
  }
  L13.bab[6] = {
    judul: "Lantai 13",
    teaser: "Lift berbunyi \"ting\" sendiri jam 16.59.",
    ruangAwal: "lobi",
    langka: "kunci13",
    penutup: "Anda resmi menjadi Penjaga Lantai 13. Tombol 13 di lift sekarang menyala dan membuka Ruang Rahasia berisi koleksi Anda. Gula tetap dipegang Oyen.",
    petunjuk: {
      tombol: ["Stikernya cocok untuk panel lift ya.", "Masuk lift dulu, lalu pilih Stiker Tombol 13 di laci dan ketuk panel tombolnya."],
      buka: ["Itu cuma tombol lift kok. Yang satu buka pintu, yang satu tutup pintu.", "Pilih tombol yang membuka pintu."],
      oyen: ["Oyen menunggu di dekat meja teh ya. Ajak ngobrol.", "Ketuk Oyen."],
    },
    async pembuka(L) {
      L.tujuan("tombol");
      await L.bilang("narasi", "Jam lobi menunjukkan 16.59. Semua jam di gedung sepakat. Lift berbunyi \"ting\" sendiri, lalu pintunya terbuka. Tidak ada yang memanggil.");
      await L.bilang("satpam", "Siap. Lift itu terbuka untuk Anda. Saya tidak ikut. Saya berjaga di sini. Kalau ada apa-apa, tiup peluit. Kalau tidak punya peluit, teriak pelan.");
    },
    ruang: {
      lobi: {
        nama: "Lobi", latar: "lobi",
        titik: [
          { id: "lift", x: 224, y: 124, w: 62, h: 172, label: "Masuk lift", keluar: true, ke: "lift" },
          { id: "satpam", x: 126, y: 178, w: 56, h: 66, label: "Pak Satpam", gambar: "kura",
            async ketuk(L) { await L.bilang("satpam", "Siap. Saya akan berdiri di sini sampai Anda kembali. Atau sampai jam pulang. Mana yang duluan."); } },
        ],
      },
      lift: {
        nama: "Di dalam lift", latar: "lift",
        titik: [
          { id: "panel", x: 196, y: 120, w: 70, h: 160, label: "Panel tombol", tampil: (L) => !L.flag("tombolTerpasang"),
            async ketuk(L) { await L.bilang("narasi", "Panel tombol: 5, 4, 3, 2, 1, L. Dan satu lubang bulat kosong di bawahnya, seukuran stiker."); },
            async pakai(L, b) {
              if (b !== "tombol13") return false;
              L.flag("tombolTerpasang", true); L.buang("tombol13"); L.segarkan(); L.sfx("pilih");
              await L.bilang("narasi", "Stiker menempel pas. Tombol 13 menyala kuning. Anda menekannya. Lift bergerak naik. Lantai 5... lalu terus naik.");
              await L.bilang("narasi", "Lalu lampu lift mati.");
              L.gelap(true, true);
              await L.kejut({
                gambar: `<div class="kejut-mata"><span></span><span></span></div>`,
                teriak: "",
                siapa: "narasi",
                punchline: "...Dua cahaya kuning menatap Anda dari kegelapan. Anda memicingkan mata. Itu tombol lift. Yang kiri BUKA PINTU, yang kanan TUTUP PINTU. Keduanya bersinar karena baru dilap Bu Ratna.",
              });
              L.gelap(false);
              L.flag("sampai", true); L.segarkan();
              L.tujuan("buka");
            } },
          { id: "buka", x: 30, y: 230, w: 70, h: 70, label: "◀▶ Buka pintu", tampil: (L) => L.flag("sampai"),
            async ketuk(L) { L.sfx("lift"); await L.bilang("narasi", "Ting. Pintu terbuka pelan, seperti tidak mau mengagetkan siapa-siapa. Ada cahaya hangat di luar."); L.tujuan("oyen"); L.ruang("lantai13"); } },
          { id: "tutup", x: 110, y: 230, w: 70, h: 70, label: "▶◀ Tutup pintu", tampil: (L) => L.flag("sampai"),
            async ketuk(L) { await L.bilang("narasi", "Pintunya sudah tertutup. Ia bingung, tapi menutup lebih rapat lagi. Sebagai bentuk kerja sama."); } },
        ],
      },
      lantai13: {
        nama: "Lantai 13", latar: "lantai13",
        async masuk(L) {
          if (L.flag("masuk13")) return;
          L.flag("masuk13", true);
          await L.bilang("narasi", "Ruangan sunyi dan hangat. Rak-rak penuh toples kaca berlabel tulisan tangan. Di meja kecil ada dua gelas teh dan toples gula yang penuh.");
          await L.bilang("narasi", "Di samping meja, duduk dengan sangat rapi, ada Oyen.");
        },
        titik: [
          { id: "toples1", x: 14, y: 70, w: 140, h: 50, label: "Toples (rak atas)",
            async ketuk(L) { await L.bilang("narasi", K.acak(["Label: \"Bau hujan pertama setelah kemarau\". Toplesnya sedikit berembun.", "Label: \"Lagu enak di radio angkot, pas lagi bengong\".", "Label: \"Chat 'udah makan?' dari orang yang nggak harus nanya\".", "Label: \"Nemu uang lima ribu di saku jaket lama\"."])); } },
          { id: "toples2", x: 154, y: 140, w: 132, h: 50, label: "Toples (rak tengah)",
            async ketuk(L) { await L.bilang("narasi", K.acak(["Label: \"Kucing tidur di kardus yang terlalu kecil\". Ada bekas cap kaki.", "Label: \"Ketawa sampai lupa tadi ngetawain apa\".", "Label: \"Tidur siang sepuluh menit yang rasanya dua jam\".", "Label: \"Teh manis waktu lembur, nggak tahu dari siapa\"."])); } },
          { id: "toplesMira", x: 14, y: 210, w: 140, h: 50, label: `Toples berlabel nama ${NAMA}`,
            async ketuk(L) {
              await L.lihat(`<h3 class="teka-judul">Toples: ${esc(NAMA)}</h3><p>Ternyata sudah ada toples atas nama Anda. Isinya dicatat rapi dengan cap kaki:</p>${toplesMira()}<p class="muted small">"Ditambahkan setiap kali Anda mampir. Termasuk hari-hari yang cuma mampir sebentar." — O.</p>`);
            } },
          { id: "oyen", x: 214, y: 254, w: 66, h: 70, label: "Oyen", gambar: "oyen",
            async ketuk(L) {
              if (L.flag("diangkat")) { await L.bilang("oyen", "Gula tetap saya yang pegang."); return; }
              await L.bilang("oyen", "Diketahui. Anda sampai.");
              await L.bilang("oyen", "Ini lantai tiga belas. Tidak tercatat di lift, karena kalau tercatat, orang datang buru-buru.");
              let tanya = ["Ini tempat apa?", "Jadi gula yang hilang...?", "Stempel yang berpindah?"];
              const sudah = new Set();
              while (sudah.size < 3) {
                const sisa = tanya.filter((t) => !sudah.has(t));
                const j = await L.tanya("oyen", sudah.size ? "Ada lagi?" : "Silakan bertanya. Satu-satu.", sisa);
                const t = sisa[j]; sudah.add(t);
                if (t === tanya[0]) await L.bilang("oyen", "Gudang hal kecil yang bikin orang senyum. Supaya tidak hilang di antara hal-hal besar. Hal besar suka menyerobot antrean.");
                if (t === tanya[1]) await L.bilang("oyen", "Untuk teh manis. Untuk yang pulang paling malam. Saya taruh di depan pintu mereka. Tidak pakai nama.");
                if (t === tanya[2]) await L.bilang("oyen", "Untuk mengecap toples. DISIMPAN. Saya pakai kaki. Hasilnya miring. Tidak apa-apa.");
              }
              await L.bilang("oyen", "Saya sudah tua. Untuk ukuran kucing. Lantai ini butuh penjaga baru.");
              await L.bilang("oyen", "Tugasnya mudah. Kalau nemu hal kecil yang bikin senyum, taruh di sini. Kalau nggak nemu, duduk aja. Kadang mereka datang sendiri.");
              const j = await L.tanya("oyen", "Bersedia?", ["Saya mau", "Kenapa saya?"]);
              if (j === 1) await L.bilang("oyen", "Karena Anda datang ke kantor ini waktu sedang capek, dan tetap mengetuk pintunya satu per satu. Itu kualifikasinya. Satu-satunya.");
              await L.bilang("oyen", `Diketahui. Mulai hari ini, ${NAMA}, Penjaga Lantai 13.`);
              L.sfx("stempel");
              await L.bilang("narasi", "Oyen mengecap selembar kertas dengan kakinya. Capnya miring. Lalu ia menggeser sebuah kunci kecil berwarna emas ke arah Anda.");
              L.dapat("kunci13"); L.langka("kunci13");
              L.flag("diangkat", true);
              await L.bilang("narasi", "Pintu lift terbuka lagi. Satu per satu, pegawai lain masuk.");
              await L.bilang("ratna", "Selamat ya. Tehnya manis hari ini. Gulanya dari Oyen.");
              await L.bilang("dimas", "LANTAI 13 BENERAN ADA— eh. Selamat. *saya boleh mampir kapan-kapan? saya bawa gorengan.");
              await L.bilang("satpam", "Siap. Lantai ini sekarang masuk rute patroli saya. Saya akan lewat pelan-pelan.");
              await L.bilang("kukang", "......saya ketinggalan apa?");
              await L.bilang("oyen", "Gula tetap saya yang pegang.");
              await L.selesaiBab();
            } },
          { id: "meja", x: 98, y: 270, w: 104, h: 60, label: "Meja teh",
            async ketuk(L) { await L.bilang("narasi", "Dua gelas teh manis, masih hangat. Satu bertuliskan \"untuk yang lembur\". Satunya lagi bertuliskan nama Anda, dengan tulisan miring."); } },
        ],
      },
    },
  };

  /* =========================================================
     RUANG RAHASIA (tombol 13 di lift)
     ========================================================= */
  const S = () => K.data.l13;
  function isiRahasia() {
    const r = $("#ruangRahasia");
    if (!S().selesai.includes(6)) {
      r.innerHTML = `<h2 id="h-lantai13">Lantai 13</h2><p>Pintunya terkunci. Di gagangnya tergantung tulisan: "Belum waktunya. — O."</p><div class="actions"><button class="btn" type="button" data-go="s-misteri">Ke berkas misteri</button></div>`;
      return;
    }
    const barang = (K.BARANG || []).filter((b) => K.data.barang[b.id]);
    const langka = S().langka.map((id) => L13.langka[id]).filter(Boolean);
    const hal = S().halKecil || [];
    const tgl = S().tglDiangkat || K.tanggalPanjang(new Date());
    if (!S().tglDiangkat) { S().tglDiangkat = tgl; K.simpan(); }
    r.innerHTML = `
      <div class="form-head"><span class="loket-badge">Lantai 13</span><span class="mono small">Ruang Rahasia</span></div>
      <h2 id="h-lantai13">Ruang Penyimpanan Hal Kecil</h2>
      <div class="petugas" data-sprite="oyen">
        <div class="petugas-tag">Oyen <small>Mantan penjaga, sekarang penasihat</small></div>
        <p>Ini ruangan Anda. Isinya hal-hal yang Anda kumpulkan selama di kantor. Saya cuma mampir. Untuk gula.</p>
      </div>

      <div class="cert" id="skPenjaga" data-accent="C">
        <div class="cert-head">
          <p class="cert-org">Kantor Layanan Perasaan · Lantai 13</p>
          <p class="cert-title">Surat Keputusan Pengangkatan</p>
          <p class="cert-no">No. 13/SK/OY/${new Date().getFullYear()}</p>
        </div>
        <p>Menimbang bahwa yang bersangkutan datang ke kantor ini waktu sedang capek dan tetap mengetuk pintunya satu per satu, maka dengan ini:</p>
        <dl>
          <div class="cert-row"><dt>Nama</dt><dd><strong>${N}</strong></dd></div>
          <div class="cert-row"><dt>Jabatan</dt><dd class="cert-big">Penjaga Lantai 13</dd></div>
          <div class="cert-row"><dt>Tugas</dt><dd>Menyimpan hal kecil yang bikin senyum. Kalau tidak menemukan, duduk saja.</dd></div>
          <div class="cert-row"><dt>Berlaku</dt><dd>Sejak ${esc(tgl)}, sampai yang bersangkutan bosan (tidak diharapkan).</dd></div>
        </dl>
        <div class="cert-foot">
          <div>${K.avatarDok("oyen")}<p><strong>Oyen</strong><br>Kepala Bagian · cap kaki</p></div>
          <div class="stamp">Diketahui</div>
        </div>
      </div>
      <div class="actions"><button class="btn" type="button" data-download="skPenjaga" data-file="sk-penjaga-lantai-13">Unduh SK</button></div>

      <h3 class="sub-judul">Rak toples ${N}</h3>
      <div class="rak-toples">
        ${langka.map((x) => `<div class="toples-hal"><span class="th-foto">${px(x.sprite)}</span><strong>${esc(x.nama)}</strong><small>barang langka</small></div>`).join("")}
        ${barang.map((b) => `<div class="toples-hal"><span class="th-foto">${px(b.sprite)}</span><strong>${esc(b.nama)}</strong><small>koperasi · x${K.data.barang[b.id]}</small></div>`).join("")}
        ${hal.map((h) => `<div class="toples-hal"><span class="th-foto">${px("toples")}</span><strong>${esc(h.teks)}</strong><small>${esc(h.tgl)}</small></div>`).join("")}
      </div>
      <div class="baca">${toplesMira()}</div>

      <h3 class="sub-judul">Simpan satu hal kecil</h3>
      <p class="muted small">Hal kecil yang bikin senyum hari ini, kalau ada. Disimpan di perangkat ini saja, tidak dikirim ke mana pun. Kalau tidak ada, tidak apa-apa. Duduk saja.</p>
      <form class="hal-kecil-form" id="halKecilForm">
        <label class="sr-only" for="halKecil">Hal kecil</label>
        <input type="text" id="halKecil" maxlength="80" placeholder="misal: kucing lewat, teh pas manisnya" autocomplete="off">
        <button class="btn primary small" type="submit">Simpan</button>
      </form>
      ${hal.length ? `<details class="bersihkan"><summary>Kosongkan toples hal kecil</summary><button class="btn small" type="button" id="kosongkanHal">Kosongkan</button></details>` : ""}`;
    K.pasangSprite(r);
    $("#halKecilForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const t = $("#halKecil").value.trim();
      if (!t) { memo("Oyen · Kepala Bagian", "Kosong juga boleh. Duduk saja."); return; }
      S().halKecil = [{ teks: t, tgl: K.tanggalPanjang(new Date()) }, ...(S().halKecil || [])].slice(0, 40);
      K.simpan(); sfx("stempel");
      memo("Oyen · Kepala Bagian", "Disimpan. Dicap. Miring sedikit.");
      isiRahasia();
    });
    $("#kosongkanHal")?.addEventListener("click", () => { S().halKecil = []; K.simpan(); isiRahasia(); });
  }
  K.saatMasuk["s-lantai13"] = isiRahasia;

  /* ---------- ringkasan misteri di Meja Kerja ---------- */
  K.isiMejaL13 = (el) => {
    if (!el) return;
    const n = S().selesai.length;
    el.innerHTML = `
      <h3 class="sub-judul">Misteri Lantai 13</h3>
      <p>${n >= 6 ? `Kasus ditutup. ${N} adalah Penjaga Lantai 13. SK-nya tersimpan di Ruang Rahasia (tombol 13 di lift).` : `${n} dari 6 bab selesai. Berkasnya ada di lobi.`}</p>
      <div class="actions"><button class="btn small" type="button" data-go="${n >= 6 ? "s-lantai13" : "s-misteri"}">${n >= 6 ? "Ke Ruang Rahasia" : "Buka berkas"}</button></div>`;
  };
})();
