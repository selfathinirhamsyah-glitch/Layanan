/* =========================================================
   Kantor Layanan Perasaan · Kasus Lift Tengah Malam
   Kasus kedua di berkas misteri: Babak 1–3 (nomor bab 7–9).
   Terbuka setelah Bab 1 Misteri Lantai 13 selesai, satu babak per hari.
   Koordinat titik memakai bidang 300 × 400.
   ========================================================= */
(() => {
  "use strict";
  const K = window.KLP;
  const L13 = K.L13;
  const { px, esc, NAMA } = K;

  /* =========================================================
     DATA KASUS
     ========================================================= */
  L13.KASUS.push({
    id: "lift",
    judul: "Kasus Lift Tengah Malam",
    pendek: "Lift",
    bab: [7, 8, 9],
    satuan: "Babak",
    syarat: 1,
    syaratTeks: "Terbuka setelah Bab 1 Misteri Lantai 13 selesai.",
    pengumuman: { dari: "Pak Satpam", sprite: "kura", teks: "Siap. Laporan darurat: lift naik turun sendiri tiap jam 00.13. Berkas baru di lobi. Saya tidak takut. Saya melapor sambil pegang senter." },
    surat: () => `
      <p class="mono small">MEMO KEAMANAN No. 00.13</p>
      <p>Kepada: <strong>Detektif ${esc(NAMA)}</strong>.<br>Lift naik turun sendiri tiap jam 00.13. Di CCTV ada sosok berambut panjang berdiri di pojok lift.<br>Saya tidak takut. Saya hanya melapor sambil memegang senter dengan dua tangan.</p>
      <p class="ttd-oyen">— Pak Satpam, Keamanan</p>`,
    tersangka: (L) => {
      const d7 = L.flagGlobal("deduksi:7"), d8 = L.flagGlobal("deduksi:8"), d9 = L.flagGlobal("deduksi:9");
      if (!d7 && !d8) return `<span class="avatar">?</span><div><p><strong>Tersangka: belum ada</strong></p><p>Yang diketahui: lift bergerak sendiri jam 00.13. Ada "sosok" di CCTV.</p></div>`;
      if (!d8) return `<span class="avatar">${px("pel")}</span><div><p><strong>"Hantu" lift: kain pel</strong> <span class="cap-tersangka">BUKAN HANTU</span></p><p>Tapi kain pel tidak naik lift sendirian. Siapa yang membawanya?</p></div>`;
      return `<span class="avatar">${px("rakun")}</span><div>
        <p><strong>Tersangka: Bang Rakun</strong> <span class="cap-tersangka">${d9 ? "TEKNISI TELADAN" : "DICURIGAI"}</span></p>
        <p>Jabatan: Teknisi mesin kopi. Ciri: tangan kecil lima jari, bau oli, suka bersenandung.</p>
        <p>Motif: ${d9 ? "memperbaiki mesin kopi kantor diam-diam, supaya yang lembur dapat kopi enak." : "???"}</p></div>`;
    },
  });

  /* =========================================================
     GAMBAR RUANGAN (SVG 300×400)
     ========================================================= */
  const ink = "#2B2A26";
  const svg = (isi) => `<svg viewBox="0 0 300 400" preserveAspectRatio="none" aria-hidden="true">${isi}</svg>`;
  const lantai = (y, a, b, id) =>
    `<pattern id="${id}" width="30" height="30" patternUnits="userSpaceOnUse"><rect width="30" height="30" fill="${a}"/><rect width="15" height="15" fill="${b}"/><rect x="15" y="15" width="15" height="15" fill="${b}"/></pattern>
     <rect x="0" y="${y}" width="300" height="${400 - y}" fill="url(#${id})"/><rect x="0" y="${y}" width="300" height="4" fill="${ink}"/>`;
  const judul = (t, warna = "#EDE7D6") => `<text x="150" y="28" text-anchor="middle" font-family="Pixelify Sans" font-size="12" fill="${warna}">${t}</text>`;

  Object.assign(L13.LATAR, {
    posJaga: (L) => svg(`
      <rect width="300" height="400" fill="#2F3442"/>
      ${lantai(300, "#3B3B46", "#33333D", "ubinPos")}
      <!-- jendela malam -->
      <rect x="16" y="50" width="90" height="70" fill="#141A30" stroke="${ink}" stroke-width="4"/>
      <circle cx="80" cy="72" r="10" fill="#EDE7D6"/><circle cx="85" cy="68" r="9" fill="#141A30"/>
      ${[[30, 64], [48, 96], [96, 104], [60, 60]].map(([x, y]) => `<rect x="${x}" y="${y}" width="3" height="3" fill="#F2C14E"/>`).join("")}
      <line x1="61" y1="50" x2="61" y2="120" stroke="${ink}" stroke-width="3"/>
      <!-- jadwal patroli -->
      <rect x="122" y="58" width="60" height="52" fill="#FFFDF6" stroke="${ink}" stroke-width="2" transform="rotate(-2 152 84)"/>
      <text x="152" y="72" text-anchor="middle" font-family="Pixelify Sans" font-size="7" fill="${ink}">PATROLI</text>
      ${[0, 1, 2, 3].map((i) => `<rect x="130" y="${78 + i * 7}" width="${34 + (i % 2) * 8}" height="2" fill="#9FB2C8"/>`).join("")}
      <!-- jam digital -->
      <rect x="196" y="44" width="84" height="32" fill="#111" stroke="${ink}" stroke-width="3"/>
      <text x="238" y="68" text-anchor="middle" font-family="VT323" font-size="24" fill="#E05A4E">${L.flag && L.flag("jam013") ? "00.13" : "23.58"}</text>
      <!-- monitor CCTV -->
      <rect x="26" y="128" width="148" height="90" fill="#22252B" stroke="${ink}" stroke-width="4"/>
      ${[[32, 134], [102, 134], [32, 176], [102, 176]].map(([x, y], i) => `
        <rect x="${x}" y="${y}" width="66" height="38" fill="${i === 2 ? "#17241C" : "#0E1A14"}" stroke="#4A5A4E" stroke-width="2"/>
        ${[0, 1, 2, 3].map((j) => `<rect x="${x + 2}" y="${y + 6 + j * 8}" width="62" height="1" fill="#2E4A38"/>`).join("")}
        <text x="${x + 4}" y="${y + 10}" font-family="VT323" font-size="9" fill="#8FD19E">CAM${i + 1}</text>`).join("")}
      <rect x="54" y="184" width="6" height="18" fill="#C9D6CE" opacity=".55"/>
      <!-- meja -->
      <rect x="8" y="226" width="206" height="16" fill="#8A5E3B" stroke="${ink}" stroke-width="4"/>
      <rect x="16" y="242" width="10" height="58" fill="${ink}"/><rect x="196" y="242" width="10" height="58" fill="${ink}"/>
      <!-- lampu meja -->
      <polygon points="190,196 214,196 240,226 164,226" fill="#F2C14E" opacity=".18"/>
      <rect x="196" y="186" width="14" height="10" fill="#F2C14E" stroke="${ink}" stroke-width="2"/>
      <!-- buku log -->
      <rect x="142" y="216" width="46" height="10" fill="#3E5E36" stroke="${ink}" stroke-width="2"/>
      <!-- termos -->
      <rect x="18" y="190" width="14" height="36" rx="3" fill="#B5443A" stroke="${ink}" stroke-width="2"/>
      <!-- pintu lift -->
      <rect x="232" y="110" width="60" height="190" fill="#7C848C" stroke="${ink}" stroke-width="4"/>
      <line x1="262" y1="110" x2="262" y2="300" stroke="${ink}" stroke-width="3"/>
      <rect x="244" y="92" width="36" height="14" fill="#111" stroke="${ink}" stroke-width="2"/>
      <text x="262" y="104" text-anchor="middle" font-family="VT323" font-size="13" fill="#F2C14E">${L.flag && L.flag("liftTurun") ? "▼" : "L"}</text>
      ${judul("POS JAGA · MALAM")}`),

    liftMalam: (L) => svg(`
      <rect width="300" height="400" fill="#5E656C"/>
      ${[40, 100, 160, 220].map((x) => `<rect x="${x}" y="40" width="2" height="280" fill="#4A5056"/>`).join("")}
      <rect x="0" y="0" width="300" height="40" fill="#3A3F45"/>
      <rect x="100" y="12" width="100" height="14" fill="#F2D27A" opacity="${L.flag && L.flag("lampuMati") ? ".25" : ".9"}"/>
      <!-- pintu darurat plafon -->
      <rect x="122" y="40" width="56" height="20" fill="none" stroke="#2B2A26" stroke-width="2" stroke-dasharray="4 3"/>
      <!-- cermin -->
      <rect x="96" y="80" width="108" height="150" fill="#9DB0BC" stroke="${ink}" stroke-width="4" opacity=".75"/>
      <line x1="110" y1="96" x2="140" y2="130" stroke="#FFFDF6" stroke-width="3" opacity=".6"/>
      <!-- pegangan -->
      <rect x="80" y="246" width="140" height="6" fill="#C9CDD2" stroke="${ink}" stroke-width="2"/>
      <!-- pojok gelap -->
      <polygon points="0,40 74,40 74,320 0,330" fill="#15141B" opacity=".78"/>
      ${L.flag && L.flag("kukangMuncul") ? "" : `<circle cx="34" cy="150" r="2" fill="#F2C14E"/><circle cx="44" cy="150" r="2" fill="#F2C14E"/>`}
      <!-- panel tombol -->
      <rect x="236" y="150" width="44" height="110" fill="#9AA2AA" stroke="${ink}" stroke-width="3"/>
      ${["5", "4", "3", "2", "1", "L"].map((t, i) => `<circle cx="${250 + (i % 2) * 16}" cy="${166 + Math.floor(i / 2) * 22}" r="7" fill="#FFFDF6" stroke="${ink}" stroke-width="2"/><text x="${250 + (i % 2) * 16}" y="${169 + Math.floor(i / 2) * 22}" text-anchor="middle" font-family="VT323" font-size="10" fill="${ink}">${t}</text>`).join("")}
      <circle cx="258" cy="240" r="8" fill="${L.flag && L.flag("panelBuka") ? "#7FA868" : "#E9E2D0"}" stroke="${ink}" stroke-width="2"/>
      <!-- lantai & genangan -->
      ${lantai(320, "#4A3C30", "#43362B", "ubinLift")}
      <ellipse cx="160" cy="356" rx="64" ry="14" fill="#6F93AE" opacity=".55"/>
      ${[[110, 350], [132, 342], [158, 352], [184, 340], [210, 336]].map(([x, y]) => `<g fill="#9DB7CA" opacity=".8"><circle cx="${x}" cy="${y}" r="3"/><circle cx="${x - 4}" cy="${y - 5}" r="1.4"/><circle cx="${x}" cy="${y - 6}" r="1.4"/><circle cx="${x + 4}" cy="${y - 5}" r="1.4"/></g>`).join("")}
      ${judul("DALAM LIFT · 23.59")}`),

    ruangRapat: (L) => svg(`
      <rect width="300" height="400" fill="#3B3550"/>
      ${lantai(300, "#4B4458", "#433D50", "ubinRapat")}
      <!-- papan tulis -->
      <rect x="18" y="48" width="124" height="84" fill="#FFFDF6" stroke="${ink}" stroke-width="4"/>
      <text x="80" y="66" text-anchor="middle" font-family="Pixelify Sans" font-size="8" fill="${ink}">INTEROGASI</text>
      <path d="M30 80 h40 M30 92 h70 M30 104 h52 M30 116 h60" stroke="#7F98B4" stroke-width="2"/>
      <circle cx="116" cy="104" r="12" fill="none" stroke="#B5443A" stroke-width="2"/>
      <!-- layar proyektor -->
      <rect x="158" y="40" width="124" height="92" fill="${L.flag && L.flag("proyektor") ? "#FFF4B8" : "#2B2738"}" stroke="${ink}" stroke-width="4"/>
      ${L.flag && L.flag("proyektor") ? `<text x="220" y="62" text-anchor="middle" font-family="Pixelify Sans" font-size="7" fill="${ink}">ALASAN SAYA PANTAS</text><text x="220" y="72" text-anchor="middle" font-family="Pixelify Sans" font-size="7" fill="${ink}">NAIK GAJI (DRAFT 14)</text><rect x="204" y="80" width="32" height="32" fill="#E58B3A" stroke="${ink}" stroke-width="2"/>` : ""}
      <!-- kursi -->
      ${[22, 78, 134, 190, 246].map((x) => `<rect x="${x + 6}" y="190" width="38" height="64" fill="#5D4E6E" stroke="${ink}" stroke-width="3"/>`).join("")}
      <!-- meja panjang -->
      <rect x="10" y="252" width="280" height="22" fill="#8A5E3B" stroke="${ink}" stroke-width="4"/>
      <rect x="24" y="274" width="10" height="28" fill="${ink}"/><rect x="266" y="274" width="10" height="28" fill="${ink}"/>
      <rect x="60" y="244" width="20" height="10" fill="#FFFDF6" stroke="${ink}" stroke-width="1.5"/>
      <rect x="210" y="242" width="12" height="12" fill="#B5443A" stroke="${ink}" stroke-width="1.5"/>
      ${judul("RUANG RAPAT · 00.05")}`),

    bengkel: (L) => svg(`
      <rect width="300" height="400" fill="#3A2E2A"/>
      <pattern id="bata" width="40" height="20" patternUnits="userSpaceOnUse"><rect width="40" height="20" fill="#3A2E2A"/><path d="M0 0 H40 M0 10 H40 M20 0 V10 M0 10 V20" stroke="#2A211E" stroke-width="2"/></pattern>
      <rect x="0" y="40" width="300" height="270" fill="url(#bata)"/>
      ${lantai(310, "#2F2B29", "#292523", "ubinB2")}
      <!-- pipa -->
      <rect x="0" y="40" width="300" height="10" fill="#7C848C" stroke="${ink}" stroke-width="2"/>
      <rect x="268" y="40" width="10" height="120" fill="#7C848C" stroke="${ink}" stroke-width="2"/>
      <!-- neon -->
      <rect x="96" y="56" width="108" height="6" fill="#DDEFE0" opacity=".85"/>
      <!-- cetak biru -->
      <rect x="108" y="68" width="94" height="72" fill="#2F5D8A" stroke="${ink}" stroke-width="3"/>
      <rect x="128" y="80" width="30" height="40" fill="none" stroke="#DDEFE0" stroke-width="1.5"/><circle cx="174" cy="96" r="10" fill="none" stroke="#DDEFE0" stroke-width="1.5"/>
      <path d="M120 128 h70" stroke="#DDEFE0" stroke-width="1.5" stroke-dasharray="3 2"/>
      <!-- rak & radio -->
      <rect x="10" y="152" width="74" height="6" fill="#8A5E3B" stroke="${ink}" stroke-width="2"/>
      <rect x="18" y="122" width="54" height="30" fill="#B5443A" stroke="${ink}" stroke-width="3"/>
      <circle cx="34" cy="137" r="8" fill="#2B2A26"/><rect x="48" y="128" width="18" height="6" fill="#F2C14E"/>
      ${L.flag && L.flag("radioMati") ? "" : `<path d="M76 124 q6 6 0 12 M82 120 q9 10 0 20" fill="none" stroke="#F2C14E" stroke-width="2"/>`}
      <!-- meja kerja + mesin kopi -->
      <rect x="120" y="240" width="172" height="14" fill="#8A5E3B" stroke="${ink}" stroke-width="4"/>
      <rect x="130" y="254" width="8" height="56" fill="${ink}"/><rect x="276" y="254" width="8" height="56" fill="${ink}"/>
      <rect x="180" y="176" width="64" height="64" fill="#A9B4BC" stroke="${ink}" stroke-width="4"/>
      <rect x="190" y="186" width="44" height="22" fill="#2B2A26"/>
      <circle cx="198" cy="222" r="5" fill="${L.flag && L.flag("kopiJalan") ? "#7FA868" : "#C8463B"}"/>
      ${L.flag && L.flag("kopiJalan") ? `<path d="M222 166 q-6 -8 0 -16 M232 168 q-6 -8 0 -16" fill="none" stroke="#EDE7D6" stroke-width="2"/>` : `<rect x="150" y="228" width="14" height="10" fill="#C9CDD2" stroke="${ink}" stroke-width="1.5"/><circle cx="262" cy="234" r="5" fill="#7C848C" stroke="${ink}" stroke-width="1.5"/>`}
      <!-- terpal -->
      ${L.flag && L.flag("rakunKetemu") ? `<path d="M20 330 q30 -10 90 0 v4 h-90 z" fill="#5B6E4E" stroke="${ink}" stroke-width="3"/>` : `<path d="M18 330 q4 -66 46 -70 q40 4 46 70 z" fill="#5B6E4E" stroke="${ink}" stroke-width="3"/><path d="M40 300 q20 -10 44 0" fill="none" stroke="#475A3D" stroke-width="2"/>`}
      <!-- ember & pel (bersandar, "rambutnya" di lantai) -->
      <path d="M232 318 h44 l-6 36 h-32 z" fill="#7F98B4" stroke="${ink}" stroke-width="3"/>
      <line x1="292" y1="236" x2="262" y2="346" stroke="#8A5E3B" stroke-width="5"/>
      <path d="M250 344 q12 -6 26 0 q4 12 8 22 l-6 -2 l-2 6 l-5 -6 l-3 7 l-4 -7 l-4 6 l-3 -7 l-5 4 l-3 -6 l-5 2 q3 -10 6 -19 z" fill="#EDE7D6" stroke="${ink}" stroke-width="2"/>
      ${judul("B2 · TIDAK ADA DI DENAH")}`),
  });

  /* =========================================================
     BARANG LANGKA
     ========================================================= */
  Object.assign(L13.langka, {
    fotoCctv: { nama: "Foto CCTV \"Hantu\"", sprite: "pel", ket: "Cetakan CCTV jam 00.13. Sosok berambut panjang. Ternyata kain pel. Tetap dibingkai, karena lucu." },
    obengRakun: { nama: "Obeng Bang Rakun", sprite: "obeng", ket: "Tertinggal waktu Bang Rakun kabur lewat tangga darurat. Gagangnya bau kopi." },
    kopiPertama: { nama: "Cangkir Kopi Pertama", sprite: "kopiPertama", ket: "Dari mesin kopi lantai 1 yang akhirnya jalan setelah 61 malam. Masih hangat, secara emosional." },
  });

  /* ---------- reaksi umum saat bukti tidak relevan ---------- */
  const reaksiUmum = {
    satpam: "Siap. Bukti diterima. Saya tidak tahu harus bereaksi bagaimana. Saya mengangguk saja.",
    dimas: "Eh?? Itu... saya nggak ngerti. Tapi kayaknya penting. *saya catat juga deh.",
    kukang: "...hmm. ...menarik. ...boleh saya pikirkan sampai besok?",
    oyen: "Bukti itu tidak ada hubungannya dengan saya. Saya hanya kucing berdasi.",
    rakun: "Itu? Itu bukan apa-apa. Sama sekali bukan apa-apa. Kenapa ditanya ke saya?",
  };

  /* =========================================================
     BABAK 1 · Lift yang Turun Sendiri  (bab 7)
     ========================================================= */
  L13.bab[7] = {
    judul: "Lift yang Turun Sendiri",
    teaser: "Ada \"sosok\" di CCTV lift.",
    ruangAwal: "posJaga",
    langka: "fotoCctv",
    pascaKredit: "Pagi hari. Mas Kukang akhirnya sampai di lantai 2. Pintu lift terbuka. Ia menatap lorong lama sekali. \"...ternyata bukan lantai 2 yang saya cari.\" Pintu tertutup lagi.",
    penutup: "Hantu lift ternyata kain pel. Tapi kain pel tidak naik lift sendirian, dan pintu B2 bertanda tangan \"R\".",
    petunjuk: {
      mulai: ["Ngobrol dulu dengan Pak Satpam ya. Beliau yang melapor.", "Pak Satpam berdiri di depan meja jaga. Ketuk dia."],
      cctv: ["Coba lihat monitor CCTV. Rekaman jam 00.13.", "Pilih kamera yang ada di dalam lift ya. CAM 3."],
      lift: ["Ke lift lewat pintu di kanan. Ketuk semua yang ada di dalam.", "Pojok yang gelap, lantai yang basah, lalu panel tombol."],
      tunggu: ["Ketuk pojok lift dan lantainya dulu ya. Detektif perlu bukti sebelum menunggu.", "Kalau sudah, ketuk panel tombol lift dan tunggu jam 00.13."],
    },
    async pembuka(L) {
      L.tujuan("mulai");
      await L.lihat(`
        <p class="mono small">MEMO KEAMANAN No. 00.13</p>
        <p>Kepada: <strong>Detektif ${esc(NAMA)}</strong>.</p>
        <p>Lift naik turun sendiri tiap jam 00.13. Tidak ada yang menekan tombol. Di CCTV ada sosok berambut panjang di pojok lift.</p>
        <p>Mohon diselidiki malam ini. Saya akan menemani dari pos jaga. Dari jarak yang aman.</p>
        <p class="ttd-oyen">— Pak Satpam, Keamanan</p>`, "Terima kasus");
      await L.bilang("narasi", "Jam 23.40. Gedung sepi. Lampu lorong tinggal separuh. Pos jaga satu-satunya ruangan yang terang, dan bau kacang.");
    },
    ruang: {
      posJaga: {
        nama: "Pos Jaga · Lobi", latar: "posJaga", seram: 1,
        titik: [
          { id: "satpam", x: 160, y: 300, w: 60, h: 70, label: "Pak Satpam", gambar: "kura",
            async ketuk(L) {
              if (L.flag("bicara")) {
                await L.bilang("satpam", L.flag("cctvDilihat") ? "Siap. Lift ada di sebelah kanan. Saya jaga di sini. Saya pegang senter. Dua tangan." : "Siap. Rekamannya di monitor CCTV. Kamera tiga. Saya tidak berani menonton sendirian.");
                return;
              }
              await L.bilang("satpam", "Siap. Selamat malam, Detektif. Terima kasih sudah datang selarut ini. Kacang?");
              await L.bilang("satpam", "Laporan: tiap malam jam 00.13, lift turun sendiri. Ke bawah lobi. Padahal gedung ini tidak punya lantai di bawah lobi.");
              const j = await L.tanya("satpam", "Jam 00.40 lift naik lagi. Pintunya terbuka. Kosong. Lalu tercium bau kopi.", ["Bapak takut?", "Bau kopi?"]);
              if (j === 0) await L.bilang("satpam", "Siap. Tidak. Saya kura-kura. Kalau takut, saya tinggal masuk ke tempurung. Tapi saya memilih tidak. Tadi.");
              else await L.bilang("satpam", "Siap. Bau kopi. Padahal mesin kopi kantor rusak sejak sebelum saya bekerja di sini. Itu yang paling seram.");
              await L.bilang("satpam", "Rekaman semalam ada di monitor CCTV. Saya catat semuanya di buku log.");
              L.flag("bicara", true);
              L.bukti("logLift", "Log lift", "Tiap malam jam 00.13 lift turun sendiri ke bawah lobi, lalu naik lagi jam 00.40. Gedung ini tidak punya lantai di bawah lobi.");
              L.tujuan("cctv");
            } },
          { id: "cctv", x: 26, y: 128, w: 148, h: 90, label: "Monitor CCTV",
            async ketuk(L) {
              if (!L.flag("bicara")) { await L.bilang("narasi", "Empat layar CCTV. Semuanya menampilkan lorong kosong. Pak Satpam menjaganya dengan sangat serius, sambil makan kacang."); return; }
              const j = await L.tanya("narasi", "Rekaman semalam, jam 00.13. Lihat kamera yang mana?", ["CAM 1 · Lobi", "CAM 2 · Pantry", "CAM 3 · Dalam lift", "CAM 4 · Parkiran"]);
              if (j === 0) { await L.bilang("narasi", "Lobi kosong. Pot tanaman bergeser dua senti. Tidak ada yang berani membahasnya."); return; }
              if (j === 1) { await L.bilang("narasi", "Pantry. Oyen sedang menatap kulkas. Kulkas menatap balik. Hasilnya imbang."); return; }
              if (j === 3) { await L.bilang("narasi", "Parkiran. Motor Pak Satpam sendirian. Kelihatannya agak kesepian."); return; }
              await L.lihat(`
                <h3 class="teka-judul">CAM 3 · Dalam Lift · 00.13</h3>
                <div class="cctv-layar"><span class="cctv-sosok">${px("pel")}</span><span class="cctv-jam mono">00:13:07</span></div>
                <p>Gambar buram. Di pojok lift ada sosok berambut panjang, berdiri diam. Tidak bergerak selama 27 menit.</p>
                <p class="muted small">Wajahnya tidak terlihat. Mungkin menghadap dinding. Mungkin memang tidak punya wajah. Pak Satpam menutup mata di bagian ini.</p>`, "Catat");
              if (L.tegang) { L.sfx("bisik"); L.bisik("(...layar CCTV berkedip. Sosoknya masih di sana.)", 3600); }
              L.bukti("cctvSosok", "Sosok di CCTV", "Berambut panjang, diam di pojok lift 27 menit. Wajah tidak terlihat. Tidak bergerak sama sekali.");
              L.flag("cctvDilihat", true);
              L.tujuan("lift");
            } },
          { id: "log", x: 138, y: 210, w: 56, h: 40, label: "Buku log",
            async ketuk(L) {
              await L.lihat(`
                <h3 class="teka-judul">Buku Log Pos Jaga</h3>
                <table class="poster-piket"><tbody>
                  <tr><th>Senin</th><td>00.13 lift turun sendiri. Saya pura-pura tidak lihat.</td></tr>
                  <tr><th>Selasa</th><td>00.13 lift turun lagi. Saya lihat. Tetap pura-pura.</td></tr>
                  <tr><th>Rabu</th><td>00.40 lift naik. Bau kopi. Kopi betulan.</td></tr>
                  <tr><th>Kamis</th><td>Ada tapak basah di lantai lift. Kecil. Sudah saya pel. Pelnya hilang.</td></tr>
                </tbody></table>
                <p class="muted small">Di pojok halaman: "Patroli toilet 00.10–00.40, sesuai jadwal di dinding."</p>`);
              L.bukti("bauKopi", "Bau kopi", "Tiap lift naik lagi jam 00.40, tercium bau kopi betulan. Padahal mesin kopi kantor rusak sejak dulu.");
            } },
          { id: "termos", x: 12, y: 184, w: 40, h: 44, label: "Termos",
            async ketuk(L) { await L.bilang("satpam", "Siap. Itu termos saya. Isinya air putih hangat. Kopi dilarang untuk saya. Kopi bikin saya terlalu waspada. Saya jadi curiga pada pot."); } },
          { id: "jadwal", x: 120, y: 54, w: 66, h: 60, label: "Jadwal patroli",
            async ketuk(L) { await L.bilang("narasi", "Jadwal patroli Pak Satpam, ditempel di dinding. \"00.10–00.40: patroli toilet.\" Tiga puluh menit. Sangat teliti."); } },
          { id: "jam", x: 194, y: 40, w: 88, h: 40, label: "Jam digital",
            async ketuk(L) { await L.bilang("narasi", "23.58. Angkanya merah dan tidak sabar. Waktu memang berjalan lebih pelan kalau ditunggu."); } },
          { id: "lift", x: 232, y: 110, w: 60, h: 190, label: "Pintu lift →",
            async ketuk(L) {
              if (!L.flag("cctvDilihat")) { await L.bilang("satpam", "Siap. Sebelum masuk lift, mohon cek rekaman CCTV dulu. Prosedur. Dan supaya saya tidak masuk sendirian ke dalam cerita ini."); return; }
              L.sfx("lift");
              await L.bilang("narasi", "Ting. Pintu lift terbuka. Musik lift memainkan lagu yang sama sejak 2009.");
              L.ruang("liftMalam");
            } },
        ],
      },
      liftMalam: {
        nama: "Dalam Lift", latar: "liftMalam", seram: 2,
        async masuk(L) {
          if (L.flag("masukLift")) return;
          L.flag("masukLift", true);
          await L.bilang("narasi", "Pintu lift menutup sendiri di belakang Anda. Pelan. Sopan. Tapi tetap menutup.");
          if (L.tegang) { L.sfx("bisik"); L.bisik("(...ada yang bernapas di pojok lift. Pelan sekali.)", 4000); }
          else await L.bilang("narasi", "Di pojok yang gelap ada dua titik kecil berkilau. Mungkin pantulan lampu. Mungkin juga bukan.");
        },
        titik: [
          { id: "pojok", x: 0, y: 70, w: 74, h: 226, label: "Pojok gelap", tampil: (L) => !L.flag("kukangMuncul"),
            async ketuk(L) {
              await L.bilang("narasi", "Anda mendekat ke pojok yang gelap. Ada sesuatu di sana. Berbulu. Bergerak... sangat... sangat... pelan...");
              L.flag("kukangMuncul", true); L.segarkan();
              await L.kejut({
                gambar: `<span class="kejut-sprite">${px("kukang")}</span>`,
                teriak: "...hai.",
                siapa: "kukang",
                punchline: "...maaf. Kaget ya. Saya masuk lift ini jam sembilan malam. Mau ke lantai 2. ...belum sampai.",
              });
              await L.bilang("kukang", "...tiap lewat tengah malam, liftnya turun sendiri. Ke bawah. Saya ikut, karena saya di dalam.");
              await L.bilang("kukang", "...di bawah bau kopi. Ada yang bersenandung lagu dangdut. ...lalu liftnya naik lagi. Saya tetap belum sampai lantai 2.");
              L.bukti("kesaksianKukang", "Kesaksian Mas Kukang", "Lift turun ke bawah tiap lewat tengah malam. Di bawah: bau kopi dan seseorang bersenandung dangdut.");
            } },
          { id: "kukang", x: 6, y: 210, w: 62, h: 70, label: "Mas Kukang", gambar: "kukang", tampil: (L) => L.flag("kukangMuncul"),
            async ketuk(L) { await L.bilang("kukang", K.acak(["...lantai 2 masih jauh ya. ...tidak apa-apa. Perjalanan juga bagian dari tujuan.", "...kalau liftnya turun, pegangan ya. ...saya sudah pegangan dari jam sembilan."])); } },
          { id: "lantai", x: 84, y: 326, w: 150, h: 64, label: "Lantai basah",
            async ketuk(L) {
              await L.bilang("narasi", "Lantai lift basah. Bau karbol. Ada tapak-tapak kecil, lima jari, seperti tangan mungil, berjalan dari pintu ke panel tombol.");
              L.bukti("tapakBasah", "Tapak basah", "Lima jari kecil, seperti tangan. Dari pintu lift menuju panel tombol. Bau karbol dan sedikit oli.");
              await L.bilang("narasi", "Di dekat genangan tersangkut sehelai benang putih tebal. Panjang. Basah. Seperti rambut. Tapi bukan rambut.");
              L.bukti("benangPel", "Benang putih tebal", "Sehelai benang putih tebal, basah, bau karbol. Seperti rambut, tapi kaku. Tersangkut di lantai lift.");
              if (L.punyaBukti("kesaksianKukang")) L.tujuan("tunggu");
            } },
          { id: "cermin", x: 96, y: 80, w: 108, h: 150, label: "Cermin",
            async ketuk(L) { await L.bilang("narasi", K.acak(["Di cermin ada Anda. Terlihat seperti detektif. Agak ngantuk, tapi detektif.", "Anda menatap cermin. Cermin tidak menatap balik. Bagus. Itu cermin yang sopan."])); } },
          { id: "panel", x: 234, y: 148, w: 48, h: 114, label: "Panel tombol",
            async ketuk(L) {
              if (!L.punyaBukti("tapakBasah") || !L.punyaBukti("kesaksianKukang")) {
                await L.bilang("narasi", "Tombol: L, 1, 2, 3, 4, 5, dan satu tombol bulat tanpa angka. Tidak ada tombol untuk turun ke bawah lobi.");
                return;
              }
              await L.bilang("narasi", "Anda menunggu di depan panel. Layar kecil di atas pintu: 00.12... 00.13.");
              L.flag("lampuMati", true); L.segarkan(); L.sfx("mesin");
              await L.bilang("narasi", "Lampu meredup. Lift bergetar, lalu turun. Sendiri. Ke bawah lobi. Mas Kukang berpegangan dengan sangat tenang.");
              if (L.tegang) { L.sfx("detak"); L.bisik("(...turun... turun... masih turun...)", 3600); }
              await L.bilang("narasi", "Lift berhenti. Pintu terbuka sedikit. Di depan ada dinding bata dan pintu besi kecil bertuliskan: \"B2. DILARANG MASUK. SEDANG BEKERJA. — R\".");
              await L.bilang("narasi", "Sebelum Anda sempat keluar, pintu lift menutup lagi dengan sopan dan naik ke lobi. Ia sepertinya juga belum siap.");
              L.flag("lampuMati", false); L.segarkan();
              await L.deduksi({
                judul: "Hantu lift", pertanyaan: "Sosok berambut panjang di CCTV itu sebenarnya apa?",
                opsi: ["Hantu penunggu lift", "Mas Kukang yang belum sampai", "Kain pel yang disandarkan di pojok", "Wig Pak Satpam"], benar: 2,
                buktiBenar: "benangPel",
                salah: [
                  ["satpam", "Siap. Hantu tidak terdaftar sebagai pegawai. Saya sudah cek daftar hadir dua kali."],
                  ["kukang", "...saya tidak berambut panjang. Saya berbulu. Itu beda. ...dan saya di pojok satunya."],
                  null,
                  ["satpam", "Siap. Saya tidak memakai wig. Saya kura-kura. Saya tidak punya rambut. Pertanyaan ditolak dengan hormat."],
                ],
                siapaBenar: "narasi", benarTeks: "Sosok berambut panjang itu kain pel, disandarkan di pojok lift. Kain pel tidak naik lift sendiri. Seseorang membawanya ke bawah, lalu lupa membawanya pulang.",
              });
              await L.bilang("kukang", "...jadi bukan hantu. ...syukurlah. ...saya sempat ngobrol sama pel itu. Dia pendengar yang baik.");
              L.langka("fotoCctv");
              await L.selesaiBab();
            } },
          { id: "keluar", x: 4, y: 336, w: 74, h: 56, label: "← Pos jaga", keluar: true, ke: "posJaga" },
        ],
      },
    },
  };

  /* =========================================================
     BABAK 2 · Lima Tersangka  (bab 8)
     ========================================================= */
  const TERSANGKA = {
    satpam: {
      x: 22, sprite: "kura", nama: "Pak Satpam",
      alibi: ["Siap. Semalam saya di pos jaga dari jam enam sore sampai jam enam pagi.", "Kecuali jam 00.10 sampai 00.40. Patroli toilet. Sesuai jadwal di dinding. Prosedur."],
      bukti: {
        logLift: async (L) => {
          await L.bilang("satpam", "Siap. Log itu saya yang tulis. Dan... lift selalu turun waktu saya patroli toilet. Selalu. Seperti ada yang tahu jadwal saya.");
          await L.bilang("satpam", "Jadwal itu ditempel di dinding pos. Siapa pun yang lewat bisa membacanya. Termasuk teknisi. Termasuk kucing.");
          L.bukti("jadwalPatroli", "Pos jaga kosong 00.10–00.40", "Pak Satpam patroli toilet tiap 00.10–00.40. Jadwalnya ditempel di dinding. Siapa pun bisa tahu kapan pos kosong.");
        },
      },
    },
    dimas: {
      x: 78, sprite: "marmut", nama: "Dimas",
      alibi: ["SAYA PULANG JAM LIMA— eh. Sebenarnya... saya ketiduran di Ruang Istirahat. Bangun jam sebelas malam.", "Saya takut lift kalau malam. Jadi saya turun lewat tangga. Pelan-pelan. Sambil nyanyi biar berani."],
      bukti: {
        cctvSosok: (L) => kesaksianDimas(L),
        tapakBasah: (L) => kesaksianDimas(L),
        benangPel: (L) => kesaksianDimas(L),
      },
    },
    kukang: {
      x: 134, sprite: "kukang", nama: "Mas Kukang",
      alibi: ["...semalam saya di lift. ...dari jam sembilan.", "...hari ini juga. Saya ke sini lewat lift. Berangkat kemarin."],
      bukti: {
        bauKopi: async (L) => { await L.bilang("kukang", "...bau kopinya enak. Bukan kopi sachet. Kopi mesin. ...mesin yang benar-benar jalan. ...saya belum pernah mencium itu di kantor ini."); },
        kesaksianKukang: async (L) => { await L.bilang("kukang", "...iya. Senandungnya dangdut. ...nadanya agak fals di bagian reff. ...orangnya bahagia, sepertinya."); },
      },
    },
    oyen: {
      x: 190, sprite: "oyen", nama: "Oyen",
      alibi: ["Saya di atas, sedang menyeduh teh. Teh, bukan kopi.", "Yang Anda cari ada di bawah. Saya tidak suka bawah. Bawah dingin, dan tidak ada tembok yang menarik untuk ditatap."],
      bukti: {
        bauKopi: async (L) => { await L.bilang("oyen", "Kopi bukan urusan saya. Tapi saya tahu siapa yang paling sering mengeluh soal mesin kopi. Dan siapa yang paling sering membelanya."); },
        tapakBasah: async (L) => { await L.bilang("oyen", "Lima jari. Saya punya empat. Diketahui. Silakan coret saya dari daftar, dengan pulpen yang bagus."); },
      },
    },
    rakun: {
      x: 246, sprite: "rakun", nama: "Bang Rakun",
      alibi: ["Saya? Pulang jam lima. Naik angkot. Makan. Tidur. Mimpi indah. Tidak ke mana-mana. Sama sekali.", "Saya teknisi mesin kopi. Mesinnya di lantai satu. Rusak. Seperti biasa. Saya tidak pernah ke... bawah. Bawah itu apa? Tidak tahu."],
      bukti: {
        kesaksianDimas: async (L) => {
          await L.bilang("rakun", "Obeng itu... buat... mengupas mangga. Embernya buat... mangganya. Termos buat... jus mangga. Semuanya mangga.");
          await L.bilang("narasi", "Bang Rakun berkeringat. Rakun biasanya tidak berkeringat. Ini rakun yang sedang berbohong.");
          L.bukti("alibiRakun", "Alibi Bang Rakun goyah", "Katanya pulang jam 5. Tapi Dimas melihatnya jam 23.55 membawa obeng, ember, dan termos ke lift.");
        },
        tapakBasah: async (L) => {
          await L.bilang("rakun", "Tangan kecil lima jari itu banyak kok di kantor ini. Banyak! ...Oke, tidak banyak. Cuma saya. TAPI ITU BUKAN BUKTI.");
          await L.bilang("narasi", "Anda melirik tangan Bang Rakun. Kecil. Lima jari. Bau oli. Sedikit bau karbol.");
          L.bukti("cocokTapak", "Tapak cocok", "Tapak basah di lift cocok dengan tangan Bang Rakun: kecil, lima jari, bau oli dan karbol.");
        },
        bauKopi: async (L) => { await L.bilang("rakun", "Bau kopi? Mesin kopi kan rusak. Semua tahu. Saya teknisinya. Saya yang paling tahu rusaknya. Paling. Tahu."); },
        jadwalPatroli: async (L) => { await L.bilang("rakun", "Jadwal patroli? Saya tidak pernah baca. Jam sepuluh lewat sepuluh sampai empat puluh. ...Eh. Itu tadi kebetulan. Saya menebak."); },
      },
    },
  };
  async function kesaksianDimas(L) {
    if (L.punyaBukti("kesaksianDimas")) { await L.bilang("dimas", "Iya, itu yang saya lihat semalam! *saya masih merinding sampai sekarang."); return; }
    await L.bilang("dimas", "EH. Itu... itu kain pel kan? Saya tahu kain pel itu! Itu pel dari ember biru!");
    await L.bilang("dimas", "Semalam jam 23.55, waktu saya turun tangga, saya lihat Bang Rakun bawa ember biru, obeng gede, sama termos. Masuk lift. Sambil nyanyi dangdut.");
    await L.bilang("dimas", "Saya kira saya mimpi. *soalnya baru bangun tidur. Tapi pelnya nyata!");
    L.bukti("kesaksianDimas", "Kesaksian Dimas", "Jam 23.55 Bang Rakun masuk lift membawa ember biru, obeng besar, dan termos, sambil bersenandung dangdut.");
  }
  async function interogasi(L, id) {
    const t = TERSANGKA[id];
    if (L.flag("tertuduh")) { await L.bilang(id, id === "rakun" ? "..." : "Kesimpulan sudah dibuat. Saya menunggu babak berikutnya dengan tenang."); return; }
    for (;;) {
      const j = await L.tanya(id, L.flag(`alibi:${id}`) ? `(${t.nama} menunggu pertanyaan berikutnya.)` : `${t.nama} duduk tegak. Siap diinterogasi.`, ["Tanya alibi", "Tunjukkan bukti", "Sudah dulu"]);
      if (j === 2) return;
      if (j === 0) {
        for (const kal of t.alibi) await L.bilang(id, kal);
        L.flag(`alibi:${id}`, true);
        continue;
      }
      const b = await L.pilihBukti(`Tunjukkan bukti ke ${t.nama}`);
      if (!b) continue;
      if (t.bukti[b]) await t.bukti[b](L);
      else await L.bilang(id, reaksiUmum[id]);
      if (L.punyaBukti("alibiRakun") && L.punyaBukti("cocokTapak")) { L.tujuan("tuduh"); return; }
      if (L.punyaBukti("kesaksianDimas")) L.tujuan("rakun");
    }
  }

  L13.bab[8] = {
    judul: "Lima Tersangka",
    teaser: "Interogasi di ruang rapat.",
    ruangAwal: "ruangRapat",
    langka: "obengRakun",
    penutup: "Bang Rakun kabur lewat tangga darurat, ke arah bawah. Obengnya tertinggal. Besok malam kita ikuti lift itu sampai B2.",
    petunjuk: {
      tanya: ["Ketuk tiap tersangka. Tanya alibinya dulu ya.", "Lalu tunjukkan bukti yang bertentangan dengan alibinya.", "Dimas sepertinya melihat sesuatu semalam. Coba tunjukkan bukti dari lift ke Dimas."],
      rakun: ["Kesaksian Dimas bertentangan dengan alibi seseorang ya.", "Tunjukkan Kesaksian Dimas ke Bang Rakun. Lalu Tapak basah juga."],
      tuduh: ["Buktinya sudah cukup. Ketuk papan tulis untuk menyusun kesimpulan ya."],
    },
    async pembuka(L) {
      L.tujuan("tanya");
      await L.lihat(`
        <p class="mono small">MEMO KEAMANAN No. 00.13-B</p>
        <p>Kepada: <strong>Detektif ${esc(NAMA)}</strong>.</p>
        <p>Lima pegawai yang ada di gedung semalam sudah saya kumpulkan di Ruang Rapat. Mereka belum tahu kenapa. Saya juga belum, tapi saya sudah menyiapkan kacang.</p>
        <p>Silakan interogasi. Tanya alibi, lalu tunjukkan bukti.</p>
        <p class="ttd-oyen">— Pak Satpam, Keamanan</p>`, "Mulai interogasi");
    },
    ruang: {
      ruangRapat: {
        nama: "Ruang Rapat · Malam", latar: "ruangRapat", seram: 1,
        async masuk(L) {
          if (L.flag("masukRapat")) return;
          L.flag("masukRapat", true);
          await L.bilang("narasi", "Ruang rapat, lewat tengah malam. Lima kursi terisi. Tidak ada yang bicara. Proyektor di ujung ruangan berdengung pelan.");
          await L.bilang("narasi", "Tiba-tiba layar proyektor menyala sendiri, terang sekali, dan menampilkan—");
          L.flag("proyektor", true); L.segarkan();
          await L.kejut({
            gambar: `<span class="kejut-sprite">${px("oyen")}</span>`,
            teriak: "KLIK!",
            siapa: "oyen",
            punchline: "Itu presentasi pribadi. \"Alasan Saya Pantas Naik Gaji, Draft 14\". Jangan dilihat. Proyektornya menyala karena saya menduduki remotnya.",
          });
          await L.bilang("dimas", "*draft empat belas. saya baru sampai draft dua.");
        },
        titik: [
          ...Object.entries(TERSANGKA).map(([id, t]) => ({
            id, x: t.x, y: 188, w: 52, h: 62, label: t.nama, gambar: t.sprite,
            ketuk: (L) => interogasi(L, id),
          })),
          { id: "papan", x: 18, y: 48, w: 124, h: 84, label: "Papan tulis",
            async ketuk(L) {
              if (L.flag("tertuduh")) { await L.bilang("narasi", "Di papan tulis tertulis besar-besar: \"B2??\". Dilingkari tiga kali."); return; }
              if (!(L.punyaBukti("alibiRakun") || L.punyaBukti("cocokTapak"))) {
                await L.bilang("narasi", "Papan tulis interogasi. Ada tulisan Pak Satpam: \"1. Tanya alibi. 2. Tunjukkan bukti. 3. Jangan lupa kacang.\"");
                return;
              }
              await L.deduksi({
                judul: "Lift tengah malam", pertanyaan: "Siapa yang membawa lift turun tiap jam 00.13?",
                opsi: ["Pak Satpam", "Dimas", "Mas Kukang", "Oyen", "Bang Rakun"], benar: 4,
                buktiBenar: ["alibiRakun", "cocokTapak", "kesaksianDimas"],
                salah: [
                  ["satpam", "Siap. Saya di toilet. Saksinya cermin toilet. Cermin itu jujur."],
                  ["dimas", "SAYA TAKUT LIFT MALAM-MALAM! *saya naik tangga ke mana-mana. betis saya kuat sekarang."],
                  ["kukang", "...saya bahkan belum sampai lantai 2. ...apalagi ke bawah dengan sengaja."],
                  ["oyen", "Saya tidak memakai lift. Lift yang menunggu saya. Lagi pula saya di atas, bukan di bawah."],
                ],
                siapaBenar: "rakun", benarTeks: "...oke. OKE. Saya ngaku. Saya yang turun ke bawah. Tapi jangan bilang Bu Gajah dulu! Ini... belum selesai!",
              });
              L.flag("tertuduh", true);
              await L.bilang("narasi", "Bang Rakun melompat dari kursi, berlari ke pintu tangga darurat, dan menghilang. Ke arah bawah. Langkahnya kecil-kecil dan cepat.");
              await L.bilang("narasi", "Di kursinya tertinggal sebuah obeng bergagang merah. Bau kopi.");
              await L.bilang("satpam", "Siap. Tersangka melarikan diri ke arah bawah. Tangga darurat dikunci jam 12, jadi dia akan terjebak di... di mana pun \"bawah\" itu.");
              await L.bilang("satpam", "Besok malam, jam 00.13, kita ikuti lift itu. Saya akan... patroli toilet seperti biasa. Untuk menjaga penyamaran.");
              L.langka("obengRakun");
              await L.selesaiBab();
            } },
          { id: "proyektor", x: 158, y: 40, w: 124, h: 92, label: "Layar proyektor",
            async ketuk(L) { await L.bilang("oyen", K.acak(["Slide 3: \"Saya sudah menatap tembok selama 7 tahun tanpa cuti.\" Itu fakta.", "Slide 9: \"Gula tidak hilang. Gula dipinjam.\" Itu juga fakta.", "Jangan dibaca. Itu draft. Typo-nya banyak. Saya mengetik pakai kaki."])); } },
        ],
      },
    },
  };

  /* =========================================================
     BABAK 3 · Ruang di Bawah L  (bab 9)
     ========================================================= */
  L13.bab[9] = {
    judul: "Ruang di Bawah Lobi",
    teaser: "Lift turun ke lantai yang tidak ada di denah.",
    ruangAwal: "posJaga",
    langka: "kopiPertama",
    pascaKredit: "B2, seminggu kemudian. Bang Rakun menempel cetak biru baru di dinding: \"PROYEK BERIKUTNYA: PRINTER.\" Di lantai 1, printer bergetar sedikit. Mesin fotokopi menenangkannya.",
    penutup: "Mesin kopi lantai 1 akhirnya jalan. Bang Rakun tidak dihukum. Bu Gajah malah minta dibuatkan kopi kedua.",
    petunjuk: {
      mulai: ["Ngobrol dulu dengan Pak Satpam ya, sebelum beliau patroli.", "Pak Satpam ada di depan meja jaga."],
      panel: ["Masuk lift, lalu ketuk panel tombol ya.", "Tombol tanpa angka bisa diputar. Kodenya jam lift turun sendiri.", "Coba 0, 0, 1, 3."],
      b2: ["Di B2, ketuk-ketuk dulu sekelilingnya. Radio, cetak biru, mesin di meja.", "Ada terpal yang bentuknya mencurigakan ya."],
      tuduh: ["Bang Rakun sudah ketemu. Ketuk dia untuk menyimpulkan motifnya."],
    },
    async pembuka(L) {
      L.tujuan("mulai");
      await L.bilang("narasi", "Jam 00.08. Malam ketiga. Pos jaga terang. Lift diam di lobi, pura-pura tidak tahu apa-apa.");
    },
    ruang: {
      posJaga: {
        nama: "Pos Jaga · Lobi", latar: "posJaga", seram: 1,
        titik: [
          { id: "satpam", x: 160, y: 300, w: 60, h: 70, label: "Pak Satpam", gambar: "kura", tampil: (L) => !L.flag("satpamPergi"),
            async ketuk(L) {
              await L.bilang("satpam", "Siap. Jam 00.10. Saya akan patroli toilet sesuai jadwal. Pos jaga dan lift saya serahkan pada Detektif.");
              const j = await L.tanya("satpam", "Saya tidak kabur. Saya patroli. Ke arah toilet. Dengan langkah yang tenang.", ["Hati-hati, Pak", "Bapak nggak ikut?"]);
              if (j === 0) await L.bilang("satpam", "Siap. Terima kasih. Toiletnya juga akan saya beri tahu bahwa Anda menitip salam.");
              else await L.bilang("satpam", "Siap. Kalau saya ikut, jadwal patroli rusak, dan pelakunya curiga. Ini strategi. Bukan karena saya takut. Sama sekali.");
              await L.bilang("satpam", "Satu lagi: tombol bulat tanpa angka di panel lift bisa diputar. Saya pernah melihat Bang Rakun memutarnya. Saya kira dia sedang olahraga jari.");
              L.flag("satpamPergi", true); L.flag("jam013", true); L.segarkan();
              await L.bilang("narasi", "Pak Satpam berjalan ke arah toilet. Sangat pelan. Jam digital berganti: 00.13.");
              L.tujuan("panel");
            } },
          { id: "cctv", x: 26, y: 128, w: 148, h: 90, label: "Monitor CCTV",
            async ketuk(L) { await L.bilang("narasi", L.flag("satpamPergi") ? "CAM 3: lift kosong. Tidak ada kain pel. Kain pelnya sudah ditemukan, dan sedang menikmati pensiun di laci barang bukti." : "Empat layar CCTV. Pak Satpam masih di sini, mengunyah kacang dengan penuh kewaspadaan."); } },
          { id: "log", x: 138, y: 210, w: 56, h: 40, label: "Buku log",
            async ketuk(L) { await L.bilang("narasi", "Entri terbaru di buku log: \"Malam ketiga. Detektif masuk lift. Saya patroli. Semoga semua selamat, termasuk pel.\""); } },
          { id: "lift", x: 232, y: 110, w: 60, h: 190, label: "Pintu lift →",
            async ketuk(L) {
              if (!L.flag("satpamPergi")) { await L.bilang("narasi", "Liftnya diam. Sepertinya ia menunggu pos jaga kosong dulu. Lift ini tahu jadwal."); return; }
              L.sfx("lift");
              await L.bilang("narasi", "Ting. Pintu lift terbuka. Mas Kukang sudah tidak ada. Akhirnya beliau sampai di lantai 2, kemarin sore.");
              L.ruang("liftMalam");
            } },
        ],
      },
      liftMalam: {
        nama: "Dalam Lift", latar: "liftMalam", seram: 2,
        async masuk(L) {
          if (L.flag("masukLift")) return;
          L.flag("masukLift", true); L.flag("kukangMuncul", true); L.segarkan();
          await L.bilang("narasi", "Di dalam lift. Sepi. Lantainya kering malam ini. Pojoknya tidak lagi menyimpan siapa-siapa.");
        },
        titik: [
          { id: "panel", x: 234, y: 148, w: 48, h: 114, label: "Panel tombol",
            async ketuk(L) {
              if (L.flag("panelBuka")) return;
              await L.bilang("narasi", "Anda memutar tombol bulat tanpa angka. Di baliknya ada empat roda angka kecil, lengket bekas kopi.");
              const ok = await L.gembok({ judul: "Panel lift: tombol tanpa angka", ket: "Empat roda. Ada coretan spidol yang luntur: \"jam turun\".", kode: "0013" });
              if (!ok) { await L.bilang("narasi", "Liftnya tidak bergerak. Lagu lift tetap mengalun. Ia sabar."); return; }
              L.flag("panelBuka", true); L.flag("lampuMati", true); L.segarkan(); L.sfx("mesin");
              await L.bilang("narasi", "Tombol menyala hijau. Lift bergetar, lalu turun. Melewati lobi. Terus turun.");
              L.sfx("bisik");
              L.bisik("(...jangan menoleh... dia ada di belakangmu...)", 4200);
              await L.bilang("narasi", "Dari celah pintu lift terdengar bisikan. Makin turun, makin jelas.");
              if (L.tegang) { L.sfx("detak"); await L.bilang("narasi", "Jantung Anda berdetak. Lift berhenti. Bisikannya berhenti juga. Lalu mulai lagi, lebih dekat."); }
              await L.bilang("narasi", "Ting. Pintu terbuka.");
              L.flag("lampuMati", false);
              L.tujuan("b2");
              L.ruang("bengkel");
            } },
          { id: "cermin", x: 96, y: 80, w: 108, h: 150, label: "Cermin",
            async ketuk(L) { await L.bilang("narasi", "Anda di cermin terlihat siap. Rambut agak berantakan, tapi itu rambut detektif."); } },
          { id: "keluar", x: 4, y: 336, w: 74, h: 56, label: "← Pos jaga", keluar: true, ke: "posJaga" },
          { id: "keB2", x: 110, y: 330, w: 110, h: 60, label: "Keluar ke B2 ↓", keluar: true, ke: "bengkel", tampil: (L) => L.flag("panelBuka") },
        ],
      },
      bengkel: {
        nama: "B2 · Tidak Ada di Denah", latar: "bengkel", seram: 2,
        async masuk(L) {
          if (L.flag("masukB2")) return;
          L.flag("masukB2", true);
          await L.bilang("narasi", "Lantai B2. Dinding bata, pipa-pipa, lampu neon yang berkedip. Bau kopi di sini sangat kuat, seperti kafe yang sedang bersembunyi.");
          L.bisik("(...dia ada di belakangmu... sekarang... di sampingmu...)", 4200);
          await L.bilang("narasi", "Bisikan itu datang dari pojok ruangan. Ada juga terpal hijau yang bentuknya... seperti seseorang sedang duduk sangat diam.");
        },
        titik: [
          { id: "radio", x: 14, y: 116, w: 72, h: 44, label: "Radio",
            async ketuk(L) {
              if (L.flag("radioMati")) { await L.bilang("narasi", "Radionya sudah mati. Ruangan jadi sunyi. Ternyata sunyi lebih enak."); return; }
              await L.bilang("narasi", "Radio kecil, volumenya pelan. Bisikan itu dari sini: \"...dan ternyata... DIA ADA DI BELAKANGMU...\"");
              await L.bilang("narasi", "Penyiar: \"Anda mendengarkan Kisah Seram Jam Dua Belas, episode 213: Lift yang Turun Sendiri.\" Anda mematikan radionya.");
              L.flag("radioMati", true); L.segarkan();
              L.bukti("radioPodcast", "Sumber bisikan", "Bisikan dari lorong lift ternyata siaran radio \"Kisah Seram Jam Dua Belas\". Penyiarnya terlalu menghayati.");
            } },
          { id: "cetak", x: 106, y: 64, w: 98, h: 80, label: "Cetak biru",
            async ketuk(L) {
              await L.lihat(`
                <h3 class="teka-judul">Cetak Biru: Mesin Kopi Lt. 1</h3>
                <p>Gambar mesin kopi, penuh coretan dan panah.</p>
                <table class="poster-piket"><tbody>
                  <tr><th>Malam 1</th><td>Mesin dibawa turun. Berat. Pakai lift.</td></tr>
                  <tr><th>Malam 23</th><td>Pompa bocor. Pinjam pel. Pelnya ketinggalan di lift.</td></tr>
                  <tr><th>Malam 47</th><td>Pompa diganti. Keluar teh. (??)</td></tr>
                  <tr><th>Malam 61</th><td>Hampir jalan. Jangan bilang Bu Gajah sampai jalan.</td></tr>
                </tbody></table>
                <p class="muted small">Di bawahnya: "Tangga darurat dikunci jam 12. Pakai lift waktu pos jaga patroli toilet. — R"</p>`);
              L.bukti("cetakBiru", "Catatan bengkel", "61 malam memperbaiki mesin kopi lantai 1 diam-diam. Lewat lift, waktu pos jaga patroli. \"Jangan bilang Bu Gajah sampai jalan.\"");
            } },
          { id: "mesin", x: 176, y: 170, w: 72, h: 72, label: "Mesin di meja",
            async ketuk(L) {
              if (L.flag("kopiJalan")) { await L.bilang("narasi", "Mesin kopi berdengung puas. Lampunya hijau. Ia terlihat bangga, seperti baru lulus."); return; }
              await L.bilang("narasi", "Mesin kopi tua, dibongkar dengan sangat rapi. Ada label: \"MESIN KOPI LT. 1. PROYEK RAHASIA.\" Lampunya merah.");
              L.bukti("mesinDibongkar", "Mesin kopi lantai 1", "Mesin kopi yang \"selalu rusak\" ternyata ada di B2, dibongkar rapi. Label: PROYEK RAHASIA.");
            } },
          { id: "ember", x: 226, y: 256, w: 66, h: 100, label: "Ember & pel",
            async ketuk(L) { await L.bilang("narasi", "Ember biru berisi air karbol, dan sebatang kain pel dengan \"rambut\" yang sangat panjang. Inilah sosok dari CCTV. Ia terlihat sedikit malu."); } },
          { id: "terpal", x: 14, y: 256, w: 100, h: 80, label: "Terpal hijau", tampil: (L) => !L.flag("rakunKetemu"),
            async ketuk(L) {
              await L.bilang("narasi", "Terpal hijau. Bentuknya seperti seseorang yang duduk memeluk lutut. Terpalnya... naik turun. Pelan. Seperti bernapas.");
              if (L.tegang) { L.sfx("detak"); L.bisik("(...terpalnya bernapas...)", 3000); }
              await L.bilang("narasi", "Anda menarik ujung terpal pelan-pelan—");
              L.flag("rakunKetemu", true); L.segarkan();
              await L.kejut({
                gambar: `<span class="kejut-sprite">${px("rakun")}</span>`,
                teriak: "JANGAN BILANG BU GAJAH!!",
                siapa: "rakun",
                punchline: "...eh. Kirain Bu Gajah. Ternyata Detektif. Fiuh. Saya sembunyi di bawah terpal dari kemarin. Panas sekali di situ.",
              });
              L.tujuan("tuduh");
            } },
          { id: "rakun", x: 40, y: 262, w: 58, h: 68, label: "Bang Rakun", gambar: "rakun", tampil: (L) => L.flag("rakunKetemu"),
            async ketuk(L) {
              if (L.flag("kopiJalan")) { await L.bilang("rakun", "Kopinya enak, kan? Enak, kan? Bilang enak. Saya butuh validasi."); return; }
              if (!L.flagGlobal("deduksi:9")) {
                await L.bilang("rakun", "Oke. Saya ketahuan. Tapi sebelum saya dibawa ke Bu Gajah... Detektif tahu nggak, kenapa saya ke sini tiap malam?");
                await L.deduksi({
                  judul: "Rahasia B2", pertanyaan: "Kenapa Bang Rakun diam-diam turun ke B2 tiap jam 00.13?",
                  opsi: ["Menyembunyikan gula curian", "Memperbaiki mesin kopi kantor diam-diam, supaya jadi kejutan", "Latihan jadi hantu", "Menghindari rapat pagi"], benar: 1,
                  buktiBenar: ["cetakBiru", "mesinDibongkar"],
                  salah: [
                    ["rakun", "Gula itu urusan Oyen. Saya tidak mau ikut campur. Dia punya dasi."],
                    null,
                    ["rakun", "Saya rakun. Saya sudah cukup menyeramkan buat tempat sampah. Tidak perlu latihan."],
                    ["rakun", "...itu bonus. Tapi bukan alasan utama. Rapatnya di jam sembilan pagi, ini jam dua belas malam."],
                  ],
                  siapaBenar: "rakun", benarTeks: "...iya. Mesin kopi lantai 1 rusak dari sebelum saya masuk kerja. Semua orang bilang \"ya udah lah\". Saya nggak mau \"ya udah lah\".",
                });
              }
              await L.bilang("rakun", "Saya mau orang-orang di kantor ini dapat kopi enak waktu lembur. Atau waktu capek. Atau waktu cuma butuh sesuatu yang hangat.");
              await L.bilang("rakun", "Tangga darurat dikunci jam 12, jadi saya pakai lift. Pelnya buat ngepel tumpahan. Radionya biar nggak sepi. Ternyata malah bikin seram, ya.");
              await L.bilang("rakun", "Malam ini malam ke-62. Tinggal satu langkah. Tapi kertas instruksinya sobek kena kopi. Bantu susun?");
              let ok = false;
              while (!ok) {
                ok = await L.susun({ judul: "Instruksi menyalakan mesin kopi", ket: "Susun sobekannya dari langkah pertama sampai terakhir.", potongan: ["1. Isi air sampai garis.", "2. Pasang pompa baru.", "3. Tekan tombol merah tiga detik.", "4. Tunggu bunyi \"hhhh\".", "5. Jangan panik."] });
                if (!ok) await L.bilang("rakun", "Pelan-pelan aja. Saya sudah 61 malam. Satu malam lagi nggak apa-apa. *tapi semoga malam ini.");
              }
              L.sfx("mesin");
              await L.bilang("narasi", "Mesin berbunyi \"hhhh\". Lalu \"blup\". Lalu, untuk pertama kalinya dalam sejarah kantor ini, keluar kopi. Kopi betulan. Panas.");
              L.flag("kopiJalan", true); L.flagGlobal("kopiJalan", true); L.segarkan(); L.sfx("menang");
              await L.bilang("rakun", "JALAN. JALAN!! ...maaf, saya teriak. Cangkir pertama buat Detektif. Yang membuat saya tidak sendirian di sini malam ini.");
              await L.bilang("satpam", "Siap. Saya mencium bau kopi dari toilet. Saya kembali secepat yang diizinkan prosedur.");
              await L.bilang("gajah", "Jadi ini yang membuat lift turun tiap malam. Bang Rakun, besok mesinnya dipasang lagi di lantai 1. Lewat lift. Siang-siang.");
              await L.bilang("gajah", "Dan tolong buatkan saya satu. Tidak pakai gula. Gulanya, kata orang-orang, dipegang Oyen.");
              L.langka("kopiPertama");
              await L.selesaiBab();
            } },
          { id: "naik", x: 120, y: 340, w: 90, h: 52, label: "↑ Lift", keluar: true, ke: "liftMalam" },
        ],
      },
    },
  };
})();
