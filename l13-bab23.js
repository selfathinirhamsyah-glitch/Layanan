/* =========================================================
   Misteri Lantai 13 · Bab 2 (Stempel yang Berpindah)
                      · Bab 3 (Sesuatu di Parkiran)
   ========================================================= */
(() => {
  "use strict";
  const K = window.KLP;
  const L13 = K.L13;
  const { px } = K;
  const ink = "#2B2A26";
  const svg = (isi) => `<svg viewBox="0 0 300 400" preserveAspectRatio="none" aria-hidden="true">${isi}</svg>`;

  /* ---------- gambar ruangan ---------- */
  Object.assign(L13.LATAR, {
    fotokopi: (L) => svg(`
      <rect width="300" height="400" fill="#E3E6EA"/>
      <rect x="0" y="300" width="300" height="100" fill="#B9BEC4"/><rect x="0" y="300" width="300" height="4" fill="${ink}"/>
      ${[0, 1, 2, 3, 4].map((i) => `<rect x="${i * 64}" y="300" width="2" height="100" fill="#A3A9B0"/>`).join("")}
      <!-- jendela -->
      <rect x="196" y="56" width="90" height="70" fill="#CFE3EE" stroke="${ink}" stroke-width="4"/>
      <line x1="241" y1="56" x2="241" y2="126" stroke="${ink}" stroke-width="3"/>
      <!-- mesin fotokopi -->
      <rect x="20" y="170" width="120" height="130" fill="#D7D9DC" stroke="${ink}" stroke-width="4"/>
      <rect x="20" y="150" width="120" height="24" fill="#C3C6CA" stroke="${ink}" stroke-width="4"/>
      <rect x="96" y="182" width="34" height="14" fill="#23302A" stroke="${ink}" stroke-width="2"/>
      <circle cx="104" cy="206" r="4" fill="${L.flag("mesinNyala") ? "#7FA868" : "#B5443A"}"/>
      <rect x="30" y="230" width="100" height="10" fill="#A3A9B0"/><rect x="30" y="252" width="100" height="10" fill="#A3A9B0"/>
      <!-- printer -->
      <rect x="148" y="232" width="52" height="68" fill="#F4EFE3" stroke="${ink}" stroke-width="4"/>
      <rect x="156" y="222" width="36" height="12" fill="#FFFDF6" stroke="${ink}" stroke-width="3"/>
      <!-- meja stempel -->
      <rect x="206" y="236" width="88" height="12" fill="#8A5E3B" stroke="${ink}" stroke-width="3"/>
      <rect x="212" y="248" width="76" height="52" fill="#9C6B43" stroke="${ink}" stroke-width="3"/>
      <line x1="212" y1="274" x2="288" y2="274" stroke="${ink}" stroke-width="2"/>
      <rect x="244" y="258" width="12" height="4" fill="${ink}"/><rect x="244" y="284" width="12" height="4" fill="${ink}"/>
      <!-- rak stempel -->
      <rect x="214" y="150" width="70" height="36" fill="#8A5E3B" stroke="${ink}" stroke-width="3"/>
      ${[0, 1, 2, 3].map((i) => `<rect x="${220 + i * 16}" y="${L.flag("stempelRapi") ? 156 : 160}" width="10" height="20" fill="${L.flag("tinta") ? "#B5443A" : "#9A9A92"}" stroke="${ink}" stroke-width="2"/>`).join("")}
      <!-- berkas di meja -->
      <rect x="226" y="222" width="46" height="14" fill="#FFFDF6" stroke="${ink}" stroke-width="2" transform="rotate(-4 249 229)"/>
      <!-- tong sampah -->
      <rect x="150" y="320" width="40" height="56" fill="#5B6F86" stroke="${ink}" stroke-width="3"/>
      <text x="150" y="30" text-anchor="middle" font-family="Pixelify Sans" font-size="12" fill="${ink}">RUANG FOTOKOPI · LANTAI 1</text>`),

    parkiran: (L) => svg(`
      <rect width="300" height="400" fill="#B8C9D6"/>
      <rect x="0" y="0" width="300" height="70" fill="#9FB4C4"/>
      <rect x="0" y="150" width="300" height="250" fill="#6B6F73"/>
      ${[0, 1, 2, 3].map((i) => `<rect x="${20 + i * 75}" y="200" width="4" height="120" fill="#F0EADB"/>`).join("")}
      <!-- tembok gedung -->
      <rect x="0" y="70" width="300" height="80" fill="#D6CCB4" stroke="${ink}" stroke-width="3"/>
      ${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${12 + i * 48}" y="86" width="30" height="22" fill="#CFE3EE" stroke="${ink}" stroke-width="2"/>`).join("")}
      <!-- palang -->
      <rect x="18" y="150" width="14" height="60" fill="#3B4046" stroke="${ink}" stroke-width="2"/>
      <rect x="30" y="156" width="110" height="8" fill="#FFFDF6" stroke="${ink}" stroke-width="2"/>
      ${[0, 1, 2, 3, 4].map((i) => `<rect x="${36 + i * 22}" y="157" width="10" height="6" fill="#B5443A"/>`).join("")}
      <!-- pos jaga -->
      <rect x="206" y="150" width="84" height="90" fill="#E9E2D0" stroke="${ink}" stroke-width="4"/>
      <rect x="200" y="140" width="96" height="14" fill="#2F4A6B" stroke="${ink}" stroke-width="3"/>
      <rect x="218" y="168" width="58" height="30" fill="#CFE3EE" stroke="${ink}" stroke-width="2"/>
      <text x="248" y="226" text-anchor="middle" font-family="Pixelify Sans" font-size="9" fill="${ink}">POS JAGA</text>
      <!-- mobil -->
      <rect x="40" y="250" width="120" height="44" fill="#7F98B4" stroke="${ink}" stroke-width="4"/>
      <rect x="62" y="226" width="74" height="28" fill="#9FB2C8" stroke="${ink}" stroke-width="4"/>
      <circle cx="68" cy="298" r="13" fill="${ink}"/><circle cx="132" cy="298" r="13" fill="${ink}"/>
      <!-- motor -->
      <circle cx="206" cy="330" r="14" fill="none" stroke="${ink}" stroke-width="5"/><circle cx="262" cy="330" r="14" fill="none" stroke="${ink}" stroke-width="5"/>
      <path d="M206 330 L228 304 H252 L262 330" fill="none" stroke="#B5443A" stroke-width="6"/>
      <rect x="222" y="296" width="30" height="8" fill="${ink}"/>
      <!-- tong sampah -->
      <rect x="10" y="330" width="34" height="50" fill="#4F6E5E" stroke="${ink}" stroke-width="3"/>
      <text x="150" y="30" text-anchor="middle" font-family="Pixelify Sans" font-size="12" fill="${ink}">PARKIRAN</text>`),
  });

  /* ---------- barang ---------- */
  Object.assign(L13.barang, {
    tinta: { nama: "Bantalan Tinta Stempel", sprite: "tinta", ket: "Merah, masih basah. Wanginya seperti hari Senin." },
    denah: { nama: "Fotokopi Denah Gedung", sprite: "dokumen", ket: "Denah gedung dengan 13 lantai. Gedungnya sendiri hanya mengaku punya 5." },
    peluit: { nama: "Peluit Pak Satpam", sprite: "peluit", ket: "Tanda kepercayaan. Dilarang ditiup di dalam ruangan, kecuali darurat atau sangat senang." },
    karcisSobek: { nama: "Sobekan Karcis Parkir", sprite: "berkas", ket: "Potongan karcis yang tertiup angin. Kumpulkan semuanya." },
    karcis: { nama: "Karcis Parkir No. 13", sprite: "berkas", ket: "Sudah disatukan dengan selotip Bu Ratna. Lantai: 13. Titipan: kunci gudang." },
    kunciGudang: { nama: "Kunci Gudang Arsip", sprite: "kunci", ket: "Ada label: GUDANG ARSIP (BAWAH TANAH). JANGAN DIBUKA KALAU TIDAK BERANI. Di bawahnya: (tidak seram kok)." },
    senter: { nama: "Senter Pak Satpam", sprite: "senter", ket: "Dipinjamkan untuk ruang arsip yang gelap. \"Kembalikan. Atau tidak, saya punya dua.\"" },
  });
  Object.assign(L13.langka, {
    fotokopiBoo: { nama: "Fotokopi \"BOO.\"", sprite: "dokumen", ket: "Kertas raksasa dari mesin fotokopi. Di pojok bawah tertulis kecil: maaf, iseng." },
    peluit: { nama: "Peluit Pak Satpam", sprite: "peluit", ket: "Diberikan karena Anda menjaga rahasia penyamaran pot. Kepercayaan tingkat satpam." },
    karcis: { nama: "Karcis Parkir No. 13", sprite: "berkas", ket: "Karcis untuk lantai yang tidak ada. Tarifnya: gratis, asal sabar." },
  });

  /* =========================================================
     BAB 2 · Stempel yang Berpindah
     ========================================================= */
  const PROSEDUR = ["DITERIMA", "DIPERIKSA", "DISETUJUI", "DISIMPAN"];
  L13.bab[2] = {
    judul: "Stempel yang Berpindah",
    teaser: "Stempel di ruang fotokopi pindah tempat lagi semalam.",
    ruangAwal: "fotokopi",
    langka: "fotokopiBoo",
    penutup: "Mesin fotokopi mencetak denah gedung dengan 13 lantai. Gedungnya masih bersikeras hanya punya 5. Salah satu dari mereka berbohong.",
    petunjuk: {
      mulai: ["Stempelnya kering semua ya. Coba cari tinta. Biasanya di laci meja.", "Laci meja stempel ada di bawah meja kayu di kanan. Ketuk saja.", "Setelah dapat tinta, pilih tintanya di laci, lalu ketuk rak stempel."],
      urutan: ["Berkas setengah jadi di meja ada prosedurnya ya. Dibaca pelan-pelan.", "Yang pertama selalu DITERIMA. Yang terakhir selalu DISIMPAN.", "Yang DISETUJUI pasti sudah DIPERIKSA. Jadi DIPERIKSA dulu, baru DISETUJUI."],
    },
    async pembuka(L) {
      L.tujuan("mulai");
      await L.bilang("narasi", "Ruang fotokopi. Hangat, berbau kertas, dan ada dengung pelan dari mesin yang sepertinya sedang melamun.");
      await L.bilang("kukang", "...selamat datang. Stempelnya pindah lagi semalam. Saya tidak memindahkan. Saya tidur.");
    },
    ruang: {
      fotokopi: {
        nama: "Ruang Fotokopi", latar: "fotokopi", seram: 1,
        titik: [
          { id: "mesin", x: 20, y: 150, w: 120, h: 150, label: "Mesin fotokopi",
            async ketuk(L) {
              if (L.punya("denah")) { await L.bilang("narasi", "Mesin fotokopi berdengung puas. Lampunya hijau. Ia sesekali melirik printer."); return; }
              await L.bilang("narasi", "Mesin fotokopi. Lampunya berkedip pelan, seperti sedang memikirkan seseorang.");
            } },
          { id: "printer", x: 148, y: 222, w: 52, h: 78, label: "Printer",
            async ketuk(L) { await L.bilang("narasi", "Printer. Layarnya bertuliskan PAPER JAM. Mesin fotokopi di sebelahnya condong sedikit ke arahnya. Sedikit sekali."); } },
          { id: "rak", x: 212, y: 144, w: 74, h: 48, label: "Rak stempel",
            async ketuk(L) {
              if (!L.flag("tinta")) { await L.bilang("narasi", "Rak stempel. Empat stempel berserakan: DITERIMA, DIPERIKSA, DISETUJUI, DISIMPAN. Semuanya kering. Ada bekas tapak kaki kecil di rak."); L.bukti("tapakRak", "Tapak di rak stempel", "Bekas tapak kaki kecil, empat jari, di rak stempel. Ada sedikit tinta merah."); return; }
              await L.bilang("narasi", "Stempel-stempel sudah basah tinta dan siap dipakai. Berkas setengah jadi di meja menunggu dicap.");
            },
            async pakai(L, b) {
              if (b !== "tinta") return false;
              L.flag("tinta", true); L.buang("tinta"); L.segarkan(); L.sfx("stempel");
              L.bukti("tapakRak", "Tapak di rak stempel", "Bekas tapak kaki kecil, empat jari, di rak stempel. Ada sedikit tinta merah.");
              await L.bilang("narasi", "Anda menekan keempat stempel ke bantalan tinta. Puk, puk, puk, puk. Rasanya produktif.");
              L.tujuan("urutan");
            } },
          { id: "berkas", x: 206, y: 196, w: 88, h: 48, label: "Berkas di meja",
            async ketuk(L) {
              if (L.flag("stempelRapi")) { await L.bilang("narasi", "Berkasnya sudah dicap lengkap. Rapi. Mas Kukang mengangguk dengan kecepatan seperempat."); return; }
              await L.lihat(`
                <h3 class="teka-judul">Berkas setengah jadi</h3>
                <p class="mono small">PROSEDUR BERKAS (versi singkat)</p>
                <p>1. Berkas harus <b>DITERIMA</b> dulu, sebelum apa pun.</p>
                <p>2. Berkas yang <b>DISETUJUI</b> pasti sudah <b>DIPERIKSA</b>.</p>
                <p>3. <b>DISIMPAN</b> selalu paling akhir, karena setelah disimpan tidak ada yang mau membukanya lagi.</p>
                <p class="muted small">Catatan pensil di pinggir: "kalau urutannya benar, mesin bangun." — K</p>`, "Paham");
              if (!L.flag("tinta")) { await L.bilang("narasi", "Anda ingin mengecapnya, tapi semua stempel masih kering."); return; }
              const ok = await L.urutan({
                judul: "Cap berkas sesuai prosedur", ket: "Ketuk stempel sesuai urutan yang benar.",
                pilihan: ["DISIMPAN", "DITERIMA", "DISETUJUI", "DIPERIKSA"], benar: PROSEDUR,
                salahKata: "Mas Kukang: \"...pelan-pelan. Kertasnya sudah saya ganti.\"",
              });
              if (!ok) return;
              L.flag("stempelRapi", true); L.segarkan();
              await L.bilang("narasi", "Cap terakhir mendarat. Berkasnya lengkap. Ruangan mendadak sunyi. Dengung mesin fotokopi berhenti.");
              await L.bilang("narasi", "Lalu lampu mesin berubah hijau. Ia menyala sendiri...");
              L.flag("mesinNyala", true); L.segarkan();
              await L.kejut({
                gambar: `<div class="kejut-boo">BOO.<small>maaf, iseng.</small></div>`,
                teriak: "",
                siapa: "kukang",
                punchline: "...maaf. Mesinnya iseng. Dia sedang belajar bercanda. Belum lucu, tapi niatnya baik.",
              });
              await L.bilang("narasi", "Mesin fotokopi lalu mencetak lembar kedua dengan sopan: denah gedung. Anda menghitung lantainya. Tiga belas.");
              L.dapat("denah");
              L.langka("fotokopiBoo");
              L.bukti("denah13", "Denah 13 lantai", "Mesin fotokopi menyimpan salinan denah gedung yang asli: 13 lantai.");
              await L.deduksi({
                judul: "Kasus stempel yang berpindah", pertanyaan: "Siapa yang mengecap berkas tengah malam?",
                opsi: ["Mesin fotokopi", "Mas Kukang", "Seseorang berkaki empat, berdasi", "Dimas"], benar: 2,
                buktiBenar: ["tapakRak", "kesaksianKukang", "tapakKartu"],
                salah: [
                  ["kukang", "...mesin fotokopi tidak punya tangan. Ia hanya punya perasaan. Perasaan tidak bisa mengecap."],
                  ["kukang", "...saya tidur. Dan kalau saya yang mengecap, berkasnya baru selesai minggu depan."],
                  null,
                  ["dimas", "BUKAN SAYA. Saya takut ruang fotokopi malam-malam. *siang-siang juga."],
                ],
                siapaBenar: "dimas", benarTeks: "OYEN LAGI?? Eh. Maksudnya, tersangka yang sama. Ini pola. Detektif bilang ini namanya pola.",
              });
              await L.bilang("oyen", "Diketahui. Denahnya benar. Gedungnya yang malu. Lanjutkan besok.");
              await L.selesaiBab();
            } },
          { id: "laci", x: 212, y: 250, w: 76, h: 50, label: "Laci meja",
            async ketuk(L) {
              if (L.flag("tinta") || L.punya("tinta")) { await L.bilang("narasi", "Laci berisi tiga pulpen tanpa tutup dan satu tutup tanpa pulpen. Mereka belum menemukan satu sama lain."); return; }
              await L.bilang("narasi", "Laci berisi: tiga pulpen tanpa tutup, satu tutup tanpa pulpen, dan bantalan tinta stempel yang masih basah.");
              L.dapat("tinta");
            } },
          { id: "kukang", x: 144, y: 150, w: 54, h: 60, label: "Mas Kukang", gambar: "kukang",
            async ketuk(L) {
              const j = await L.tanya("kukang", "......ya?", ["Mas lihat siapa yang mindahin stempel?", "Mesinnya kenapa, Mas?", "Nggak, cuma nyapa"]);
              if (j === 0) { await L.bilang("kukang", "...semalam ada yang mengecap pakai kaki. Bunyinya puk... puk... empat kali. Lalu mengeong pelan. Saya tidak membuka mata. Takut tidak sopan."); L.bukti("kesaksianKukang", "Kesaksian Mas Kukang", "Tengah malam: bunyi \"puk\" empat kali, lalu mengeong pelan."); }
              else if (j === 1) await L.bilang("kukang", "...mesinnya sedang jatuh cinta. Pada printer. Jangan diganggu. Kecuali untuk fotokopi.");
              else await L.bilang("kukang", "......halo juga. (Jawabannya datang dua puluh detik kemudian, tapi tulus.)");
            } },
          { id: "sampah", x: 148, y: 318, w: 44, h: 60, label: "Tong sampah",
            async ketuk(L) { await L.bilang("narasi", "Isinya kertas-kertas fotokopi yang miring. Semuanya bertanda tangan \"D\". Dimas pernah magang di sini selama satu jam."); } },
          { id: "jendela", x: 196, y: 56, w: 90, h: 70, label: "Jendela",
            async ketuk(L) { await L.bilang("narasi", "Dari jendela kelihatan parkiran. Pak Satpam sedang berdiri sangat diam di dekat pot tanaman. Atau mungkin itu pot tanaman yang berdiri sangat diam."); } },
        ],
      },
    },
  };

  /* =========================================================
     BAB 3 · Sesuatu di Parkiran
     ========================================================= */
  const POTONGAN = ["KARCIS PARKIR · KLP", "No. 13 · Lantai: 13", "Titipan: KUNCI GUDANG", "di laci pos jaga No. 2"];
  async function ambilSobekan(L, n, teks) {
    if (L.flag(`sobek${n}`)) { await L.bilang("narasi", "Sudah tidak ada apa-apa di sini, selain angin."); return; }
    L.flag(`sobek${n}`, true);
    await L.bilang("narasi", teks);
    const jumlah = [1, 2, 3, 4].filter((i) => L.flag(`sobek${i}`)).length;
    L.dapat("karcisSobek", jumlah > 1);
    if (jumlah < 4) { await L.bilang("narasi", `Sobekan karcis: ${jumlah} dari 4.`); return; }
    await L.bilang("narasi", "Keempat sobekan terkumpul. Anda menyusunnya di atas kap mobil.");
    const ok = await L.susun({ judul: "Susun karcis parkir", ket: "Tukar posisi potongan sampai terbaca dengan benar, dari kiri atas ke kanan bawah.", potongan: POTONGAN });
    if (!ok) { L.flag("perluSusun", true); await L.bilang("narasi", "Anda menyimpan sobekannya dulu. Bisa disusun lagi dengan mengetuk kap mobil."); return; }
    await selesaiSusun(L);
  }
  async function selesaiSusun(L) {
    L.flag("perluSusun", false);
    L.buang("karcisSobek"); L.dapat("karcis"); L.langka("karcis");
    L.bukti("karcis13", "Karcis Parkir No. 13", "Karcis untuk lantai 13. Titipan kunci gudang, tiga tahun lalu.");
    await L.bilang("narasi", "Karcis Parkir No. 13. Lantai: 13. Titipan: kunci gudang, di laci pos jaga nomor 2.");
    L.tujuan("pos");
  }

  L13.bab[3] = {
    judul: "Sesuatu di Parkiran",
    teaser: "Pak Satpam menemukan sesuatu di parkiran.",
    ruangAwal: "lobi",
    langka: "karcis",
    pascaKredit: "Pos jaga, malam. Pak Satpam membuka lemari. Di dalamnya ada kostum pot kedua, lebih besar, dengan daun yang lebih meyakinkan. Ia mengangguk pada dirinya sendiri dan menutup lemari pelan-pelan.",
    penutup: "Kunci gudang arsip dan senter sudah di laci Anda. Pak Satpam kembali berjaga, kali ini tanpa menyamar. Daun di kepalanya lupa dilepas.",
    petunjuk: {
      mulai: ["Pak Satpam katanya patroli ya. Tapi pot di lobi itu kelihatan... tegang.", "Coba ketuk pot tanaman di lobi."],
      kumpul: ["Sobekan karcisnya ada empat ya. Angin membawanya ke mana-mana di parkiran.", "Lihat di bawah mobil, di palang, di jok motor, dan di tong sampah.", "Kalau sudah empat, nanti otomatis disusun."],
      pos: ["Karcisnya bilang laci pos jaga nomor 2 ya.", "Pos jaga ada di kanan atas parkiran. Ketuk saja."],
    },
    async pembuka(L) {
      L.tujuan("mulai");
      await L.bilang("narasi", "Lobi. Meja Pak Satpam kosong. Ada papan kecil: \"SEDANG PATROLI. KEMBALI DALAM 3 HARI.\"");
      await L.bilang("narasi", "Pot tanaman di pojok terlihat lebih besar dari biasanya. Dan sepertinya... menahan napas.");
    },
    ruang: {
      lobi: {
        nama: "Lobi", latar: "lobi",
        titik: [
          { id: "pot", x: 222, y: 290, w: 66, h: 80, label: "Pot tanaman", gambar: (L) => L.flag("satpamKetemu") ? px("tanaman1") : px("tanaman2"),
            async ketuk(L) {
              if (L.flag("satpamKetemu")) { await L.bilang("narasi", "Pot tanaman biasa. Kali ini benar-benar pot. Anda sudah mengeceknya dua kali."); return; }
              L.flag("satpamKetemu", true);
              await L.bilang("narasi", "Anda menyentuh salah satu daunnya...");
              await L.kejut({
                gambar: `<span class="kejut-sprite kejut-pot">${px("tanaman2")}<span class="kejut-mata-satpam">${px("kura")}</span></span>`,
                teriak: "!!",
                siapa: "satpam",
                punchline: "Siap. Penyamaran saya sudah tiga hari. Tolong jangan bilang siapa-siapa.",
              });
              L.bukti("alibiPot", "Alibi Pak Satpam", "Selama tiga hari Pak Satpam menyamar jadi pot di lobi. Pot tidak bisa ke parkiran.");
              const j = await L.tanya("satpam", "Saya menyamar untuk mengawasi gula. Pot adalah posisi paling strategis di lobi. Tidak ada yang curiga pada pot.", ["Janji, nggak bilang siapa-siapa", "Pak, ini lucu banget"]);
              if (j === 0) {
                await L.bilang("satpam", "Siap. Terima kasih. Ini peluit saya. Tanda kepercayaan. Jangan ditiup di dalam ruangan.");
                L.dapat("peluit"); L.langka("peluit");
              } else {
                await L.bilang("satpam", "Siap. Saya... tidak tersinggung. (Daun di kepalanya layu sedikit.)");
              }
              await L.bilang("satpam", "Laporan: tadi malam saya menemukan karcis parkir sobek di parkiran. Empat potong. Angin membawanya ke mana-mana. Saya tidak bisa mengejar. Saya sedang jadi pot.");
              L.tujuan("kumpul");
              L.segarkan();
            } },
          { id: "pintu", x: 16, y: 126, w: 74, h: 170, label: "Ke parkiran →", keluar: true, ke: "parkiran" },
          { id: "meja", x: 100, y: 240, w: 110, h: 60, label: "Meja satpam",
            async ketuk(L) { await L.bilang("narasi", "Di meja ada buku jaga. Catatan terakhir: \"Hari ke-3 jadi pot. Kaki pegal. Gula tetap hilang.\""); } },
        ],
      },
      parkiran: {
        nama: "Parkiran", latar: "parkiran", seram: 1,
        titik: [
          { id: "mobil", x: 40, y: 224, w: 120, h: 86, label: "Bawah mobil",
            async ketuk(L) {
              if (L.flag("perluSusun")) {
                const ok = await L.susun({ judul: "Susun karcis parkir", ket: "Tukar posisi potongan sampai terbaca dengan benar.", potongan: POTONGAN });
                if (ok) await selesaiSusun(L);
                return;
              }
              await ambilSobekan(L, 1, "Di bawah mobil ada sobekan karcis. Juga satu tutup pulpen. Tutup pulpen dari laci fotokopi akhirnya ketemu jodohnya. Anda ambil karcisnya saja.");
            } },
          { id: "palang", x: 18, y: 140, w: 124, h: 40, label: "Palang parkir",
            async ketuk(L) { await ambilSobekan(L, 2, "Sobekan karcis tersangkut di palang parkir. Palangnya naik sendiri saat Anda mengambilnya, seperti mempersilakan."); } },
          { id: "motor", x: 192, y: 290, w: 88, h: 58, label: "Motor",
            async ketuk(L) {
              if (!L.flag("sobek3")) L.bukti("jokHangat", "Jok motor hangat", "Jok motor masih hangat. Bekas duduk kecil, bulat, ada sehelai bulu oranye.");
              await ambilSobekan(L, 3, "Sobekan karcis menempel di jok motor. Joknya hangat. Ada yang baru duduk di sini, kecil, berbulu.");
            } },
          { id: "sampah", x: 8, y: 326, w: 40, h: 56, label: "Tong sampah",
            async ketuk(L) { await ambilSobekan(L, 4, "Di tong sampah ada sobekan karcis dan setengah gorengan. Anda mengambil karcisnya saja. Gorengannya biar tenang di situ."); } },
          { id: "pos", x: 206, y: 150, w: 84, h: 90, label: "Pos jaga",
            async ketuk(L) {
              if (L.punya("kunciGudang")) { await L.bilang("narasi", "Pos jaga. Pak Satpam sedang menulis laporan. Daun di kepalanya masih ada. Tidak ada yang memberi tahu."); return; }
              if (!L.punya("karcis")) { await L.bilang("narasi", "Pos jaga. Ada dua laci. Isinya penuh barang Pak Satpam. Anda belum tahu harus mencari apa."); return; }
              await L.bilang("narasi", "Laci nomor 2. Seret, tapi tidak terkunci. Di dalamnya ada kunci kuningan berlabel GUDANG ARSIP.");
              L.dapat("kunciGudang");
              await L.bilang("satpam", "Siap. Kunci itu dititipkan entah oleh siapa, tiga tahun lalu. Bersama karcis untuk lantai yang tidak ada.");
              await L.bilang("satpam", "Ruang arsip di bawah tanah gelap. Ini senter saya. Kembalikan. Atau tidak, saya punya dua.");
              L.dapat("senter");
              await L.deduksi({
                judul: "Kasus karcis yang tertiup angin", pertanyaan: "Siapa yang terakhir duduk di jok motor sebelum Anda datang?",
                opsi: ["Pak Satpam", "Dimas", "Seseorang berkaki empat, berdasi", "Kak Badak"], benar: 2,
                buktiBenar: "jokHangat",
                salah: [
                  ["satpam", "Siap. Saya pot. Pot tidak duduk. Silakan cek alibi saya di papan."],
                  ["dimas", "Saya naik sepeda! Dengan tiga gembok! Jok motor terlalu tinggi buat saya."],
                  null,
                  ["satpam", "Siap. Kak Badak terlalu besar untuk jok itu. Joknya pasti protes."],
                ],
                siapaBenar: "satpam", benarTeks: "Siap. Bulu oranye. Saya juga mencurigai pihak tersebut. Sejak lama. Diam-diam.",
              });
              await L.bilang("oyen", "Diketahui. Arsip dibuka besok. Ketuk dulu sebelum masuk.");
              await L.selesaiBab();
            } },
          { id: "dimas", x: 150, y: 176, w: 50, h: 52, label: "Dimas", gambar: "marmut",
            async ketuk(L) {
              const j = await L.tanya("dimas", "OH— eh, halo. Saya lagi ngunci sepeda. Pakai tiga gembok. Biar aman. *dan biar saya tenang.", ["Kenapa tiga?", "Lihat karcis sobek nggak?"]);
              if (j === 0) await L.bilang("dimas", "Satu buat sepeda, satu buat roda, satu buat... perasaan saya. Itu gembok terpenting.");
              else await L.bilang("dimas", "Tadi ada yang terbang-terbang! Saya kira kupu-kupu. Saya lari. Ternyata kertas. *saya tetap lari.");
            } },
          { id: "lobi", x: 230, y: 350, w: 66, h: 46, label: "← Lobi", keluar: true, ke: "lobi" },
        ],
      },
    },
  };
})();
