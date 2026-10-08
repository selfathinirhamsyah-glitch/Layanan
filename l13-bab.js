/* =========================================================
   Kantor Layanan Perasaan · Misteri Lantai 13 (isi bab)
   Koordinat titik memakai bidang 300 × 400.
   ========================================================= */
(() => {
  "use strict";
  const K = window.KLP;
  const L13 = K.L13;
  const { px } = K;

  /* =========================================================
     GAMBAR RUANGAN (SVG 300×400)
     ========================================================= */
  const ink = "#2B2A26";
  const lantaiKotak = (y, a = "#D9CFB8", b = "#CBBFA4") =>
    `<pattern id="ubin" width="30" height="30" patternUnits="userSpaceOnUse"><rect width="30" height="30" fill="${a}"/><rect width="15" height="15" fill="${b}"/><rect x="15" y="15" width="15" height="15" fill="${b}"/></pattern>
     <rect x="0" y="${y}" width="300" height="${400 - y}" fill="url(#ubin)"/><rect x="0" y="${y}" width="300" height="4" fill="${ink}"/>`;
  const svg = (isi) => `<svg viewBox="0 0 300 400" preserveAspectRatio="none" aria-hidden="true">${isi}</svg>`;
  const jamDinding = (x, y, r, j = 10, m = 10) => {
    const sJ = ((j % 12) + m / 60) * 30, sM = m * 6;
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="#FFFDF6" stroke="${ink}" stroke-width="3"/>
      <line x1="${x}" y1="${y}" x2="${x}" y2="${y - r * 0.5}" stroke="${ink}" stroke-width="3" transform="rotate(${sJ} ${x} ${y})"/>
      <line x1="${x}" y1="${y}" x2="${x}" y2="${y - r * 0.8}" stroke="#B5443A" stroke-width="2" transform="rotate(${sM} ${x} ${y})"/>`;
  };

  L13.LATAR = {
    lobi: (L) => svg(`
      <rect width="300" height="400" fill="#E9E2D0"/>
      <rect x="0" y="0" width="300" height="40" fill="#D6CCB4"/>
      ${lantaiKotak(300)}
      <!-- pintu kaca depan -->
      <rect x="14" y="120" width="78" height="180" fill="#C9DCE6" stroke="${ink}" stroke-width="4"/>
      <line x1="53" y1="120" x2="53" y2="300" stroke="${ink}" stroke-width="3"/>
      <text x="53" y="112" text-anchor="middle" font-family="Pixelify Sans" font-size="10" fill="${ink}">MASUK</text>
      <!-- meja resepsionis -->
      <rect x="100" y="250" width="110" height="50" fill="#9C6B43" stroke="${ink}" stroke-width="4"/>
      <rect x="100" y="244" width="110" height="10" fill="#8A5E3B" stroke="${ink}" stroke-width="3"/>
      <!-- lift -->
      <rect x="222" y="120" width="66" height="180" fill="#9AA2AA" stroke="${ink}" stroke-width="4"/>
      <line x1="255" y1="120" x2="255" y2="300" stroke="${ink}" stroke-width="3"/>
      <rect x="236" y="96" width="38" height="18" fill="#1E1A14" stroke="${ink}" stroke-width="2"/>
      <text x="255" y="110" text-anchor="middle" font-family="VT323" font-size="15" fill="#F2C14E">${L.flag && L.flag("liftKedip") ? "13" : "L"}</text>
      <!-- papan & jam -->
      <rect x="110" y="60" width="90" height="56" fill="#3E4A3F" stroke="#8A5E3B" stroke-width="5"/>
      <rect x="120" y="70" width="30" height="20" fill="#FFF4B8"/><rect x="158" y="76" width="32" height="24" fill="#F4EFE3"/>
      ${jamDinding(255, 60, 20, ...(L.s?.flag?.["jam:lobi"] || [10, 10]))}
      <text x="150" y="30" text-anchor="middle" font-family="Pixelify Sans" font-size="12" fill="${ink}">LOBI · KANTOR LAYANAN PERASAAN</text>`),

    pantry: (L) => svg(`
      <rect width="300" height="400" fill="#E6EEE9"/>
      <pattern id="keramik" width="20" height="20" patternUnits="userSpaceOnUse"><rect width="20" height="20" fill="#E6EEE9"/><path d="M20 0V20H0" fill="none" stroke="#C9D6CE" stroke-width="2"/></pattern>
      <rect x="0" y="40" width="300" height="200" fill="url(#keramik)"/>
      ${lantaiKotak(310, "#D9CFB8", "#C8BB9D")}
      <!-- konter & wastafel -->
      <rect x="0" y="220" width="190" height="90" fill="#9C6B43" stroke="${ink}" stroke-width="4"/>
      <rect x="0" y="212" width="190" height="12" fill="#F4EFE3" stroke="${ink}" stroke-width="3"/>
      <rect x="104" y="200" width="60" height="16" fill="#C9CDD2" stroke="${ink}" stroke-width="3"/>
      <path d="M150 200 V180 H128" fill="none" stroke="${ink}" stroke-width="4"/>
      <!-- kulkas -->
      <rect x="196" y="120" width="40" height="190" fill="#F4EFE3" stroke="${ink}" stroke-width="4"/>
      <line x1="196" y1="190" x2="236" y2="190" stroke="${ink}" stroke-width="3"/>
      <!-- dispenser -->
      <rect x="244" y="190" width="46" height="120" fill="#C9CDD2" stroke="${ink}" stroke-width="4"/>
      <rect x="248" y="140" width="38" height="50" fill="${L.flag && L.flag("galonIsi") ? "#9FC3E0" : "#E6F2F8"}" stroke="${ink}" stroke-width="3" opacity=".9"/>
      <!-- poster piket -->
      <rect x="40" y="60" width="104" height="94" fill="#FFFDF6" stroke="${ink}" stroke-width="3"/>
      <text x="92" y="76" text-anchor="middle" font-family="Pixelify Sans" font-size="9" fill="${ink}">JADWAL PIKET</text>
      <text x="92" y="88" text-anchor="middle" font-family="Pixelify Sans" font-size="9" fill="${ink}">CUCI GELAS</text>
      ${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="52" y="${96 + i * 9}" width="${60 + (i % 3) * 8}" height="3" fill="#9FB2C8"/>${[1, 3, 5].includes(i) ? `<circle cx="${56}" cy="${97 + i * 9}" r="5" fill="none" stroke="#B5443A" stroke-width="1.6"/>` : ""}`).join("")}
      <!-- meja makan -->
      <rect x="80" y="330" width="140" height="14" fill="#8A5E3B" stroke="${ink}" stroke-width="3"/>
      <rect x="90" y="344" width="8" height="46" fill="${ink}"/><rect x="202" y="344" width="8" height="46" fill="${ink}"/>
      ${jamDinding(270, 70, 18, ...(L.s?.flag?.["jam:pantry"] || [3, 0]))}
      <text x="150" y="30" text-anchor="middle" font-family="Pixelify Sans" font-size="12" fill="${ink}">PANTRY · LANTAI 3</text>`),
  };

  /* =========================================================
     BARANG & BARANG LANGKA
     ========================================================= */
  Object.assign(L13.barang, {
    sendok: { nama: "Sendok Teh", sprite: "sendok", ket: "Agak bengkok. Ditemukan Dimas di bawah meja pantry." },
    kartu: { nama: "Kartu Akses \"13?\"", sprite: "kartu", ket: "Ada bekas tapak kaki kecil di pojoknya. Tanda tanyanya ditulis pakai pulpen." },
  });
  Object.assign(L13.langka, {
    sendokBengkok: { nama: "Sendok Teh Bengkok", sprite: "sendok", ket: "Bengkok sejak dipakai mencongkel toples gula. Masih bisa mengaduk, asal pelan." },
  });

  /* ---------- profil tersangka di papan bukti ---------- */
  L13.KASUS[0].tersangka = (L) => {
    const sudah = [1, 2, 3, 4, 5, 6].filter((n) => L.flagGlobal(`deduksi:${n}`)).length;
    if (!sudah) return `<span class="avatar">?</span><div><p><strong>Tersangka: belum ada</strong></p><p>Kumpulkan bukti, lalu simpulkan di akhir bab.</p></div>`;
    const motif = L.flagGlobal("deduksi:6");
    return `<span class="avatar">${px("oyen")}</span><div>
      <p><strong>Tersangka: Oyen</strong> <span class="cap-tersangka">${motif ? "BUKAN PENJAHAT" : "DICURIGAI"}</span></p>
      <p>Jabatan: Kepala Bagian. Ciri: kaki empat, berdasi, sering menatap tembok.</p>
      <p>Kesimpulan terkumpul: ${sudah} dari 6.</p>
      <p>Motif: ${motif ? "teh manis untuk yang lembur, dan menyimpan hal-hal kecil yang bikin senyum." : "???"}</p></div>`;
  };

  /* =========================================================
     BAB 1 · Gula yang Hilang
     ========================================================= */
  L13.bab[1] = {
    judul: "Gula yang Hilang",
    teaser: "Gula di pantry hilang lagi.",
    ruangAwal: "lobi",
    langka: "sendokBengkok",
    penutup: "Toples gula ternyata menyimpan kartu akses ke lantai yang tidak ada. Lift sempat menunjukkan angka 13, lalu pura-pura tidak.",
    petunjuk: {
      mulai: ["Coba ngobrol dulu dengan Pak Satpam di lobi ya.", "Pak Satpam berdiri di dekat meja resepsionis. Ketuk dia."],
      kode: ["Kodenya mungkin ada di pantry ya. Saya suka menulis jadwal di dinding.", "Lihat poster Jadwal Piket Cuci Gelas. Ada hari yang dilingkari.", "Senin itu 1, Selasa 2, dan seterusnya. Urutkan angka hari yang dilingkari, dari atas ke bawah."],
      tutup: ["Tutupnya seret ya. Perlu sesuatu yang tipis dan kuat.", "Sendok bisa dipakai mencongkel. Coba lihat di bawah meja pantry.", "Ketuk Sendok Teh di laci sampai terpilih, lalu ketuk toplesnya."],
      lapor: ["Kartunya sudah ketemu ya. Coba bawa ke lift di lobi.", "Turun ke lobi, lalu ketuk pintu lift."],
    },
    async pembuka(L) {
      L.tujuan("mulai");
      await L.lihat(`
        <p class="mono small">SURAT TUGAS No. 13/OY</p>
        <p>Kepada: <strong>${K.esc(K.NAMA)}</strong>, Pegawai Kehormatan.</p>
        <p>Gula di pantry hilang setiap hari. Stempel berpindah sendiri. Ada tembok yang perlu ditatap lebih lama.</p>
        <p>Selidiki. Mulai dari gula.</p>
        <p class="ttd-oyen">— Oyen, Kepala Bagian</p>`, "Terima tugas");
      await L.bilang("narasi", "Anda berdiri di lobi. Lampunya terang, lantainya mengilap, dan pot tanaman di pojok terlihat... biasa saja.");
    },
    ruang: {
      lobi: {
        nama: "Lobi", latar: "lobi",
        titik: [
          { id: "satpam", x: 126, y: 178, w: 56, h: 66, label: "Pak Satpam", gambar: "kura",
            async ketuk(L) {
              if (L.punya("kartu")) { await L.bilang("satpam", "Siap. Kartu akses lantai tiga belas? Lantai itu tidak ada. ...Coba bawa ke lift. Untuk memastikan tidak ada."); return; }
              if (L.flag("bicaraSatpam")) { await L.bilang("satpam", "Siap. Toplesnya di pantry, Lantai 3. Kodenya Bu Ratna lupa. Tapi Bu Ratna suka menulis jadwal."); return; }
              await L.bilang("satpam", "Siap. Selamat datang, Pegawai Kehormatan. Saya sudah menerima tembusan surat tugas Anda.");
              await L.bilang("satpam", "Laporan: gula di pantry hilang setiap hari antara jam 9 dan jam 12. Saya berjaga. Tidak ada yang lewat.");
              await L.bilang("satpam", "Kecuali Oyen. Tapi Oyen tidak minum teh. Setahu saya.");
              const j = await L.tanya("satpam", "Bu Ratna sudah mengunci toples gula dengan gembok angka. Lalu Bu Ratna lupa kodenya.", ["Saya ke pantry sekarang", "Bapak curiga siapa?"]);
              if (j === 1) await L.bilang("satpam", "Siap. Saya curiga semua orang. Termasuk saya. Itu prosedur.");
              await L.bilang("satpam", "Pantry ada di lantai 3. Lewat tangga di pojok, lift sedang suka bercanda.");
              L.flag("bicaraSatpam", true);
              L.bukti("laporanSatpam", "Laporan jaga", "Gula hilang tiap hari antara jam 9 dan 12. Yang lewat cuma Oyen.");
              L.tujuan("kode");
            } },
          { id: "pot", x: 228, y: 302, w: 56, h: 66, label: "Pot tanaman", gambar: "tanaman2",
            async ketuk(L) { await L.bilang("narasi", "Pot tanaman lidah mertua. Daunnya sepertinya baru saja... bernapas? Mungkin perasaan Anda saja."); } },
          { id: "pintu", x: 16, y: 126, w: 74, h: 170, label: "Pintu depan",
            async ketuk(L) { await L.bilang("narasi", "Pintu depan. Di luar cerah. Di dalam ada misteri gula. Anda memilih tetap di dalam."); } },
          { id: "jam", x: 232, y: 38, w: 46, h: 46, label: "Jam dinding",
            async ketuk(L) { await L.bilang("narasi", "Jam dinding lobi. Menunjukkan 10.10, seperti jam di iklan. Sepertinya macet di situ sejak lama."); } },
          { id: "lift", x: 224, y: 124, w: 62, h: 172, label: "Pintu lift",
            async ketuk(L) {
              if (!L.punya("kartu")) { await L.bilang("narasi", "Lift berbunyi \"ting\". Panelnya: L, 1, 2, 3, 4, 5, dan satu tombol tanpa angka. Tombol itu dingin kalau disentuh."); return; }
              await L.bilang("narasi", "Anda menempelkan kartu akses ke panel lift. Lampu panel berkedip.");
              L.flag("liftKedip", true); L.segarkan(); L.sfx("lift");
              await L.bilang("narasi", "Layar di atas pintu lift menunjukkan angka 13. Satu detik. Lalu kembali ke L, seperti tidak terjadi apa-apa.");
              await L.bilang("satpam", "Siap. Saya melihatnya. Saya akan pura-pura tidak melihatnya. Untuk sementara.");
              await L.deduksi({
                judul: "Kasus gula yang hilang", pertanyaan: "Siapa tersangka utama hilangnya gula?",
                opsi: ["Pak Satpam", "Dimas", "Bu Ratna", "Seseorang berkaki empat, berdasi"], benar: 3,
                buktiBenar: ["tapakKartu", "laporanSatpam"],
                salah: [
                  ["satpam", "Siap. Saya keberatan. Saya berjaga semalaman. Dan saya tidak suka gula. Saya suka garam."],
                  ["dimas", "SAYA?? Eh. Saya cuma pernah... mencicipi. Sekali. *dua kali. Tapi jari kaki saya lima!"],
                  ["ratna", "Saya yang mengisi gulanya ya. Kalau saya ambil lagi, repot di saya sendiri."],
                ],
                siapaBenar: "dimas", benarTeks: "Berkaki empat... berdasi... di gedung ini cuma ada satu. Eh. Saya nggak bilang siapa-siapa ya. *O-nya pakai Y-E-N.",
              });
              await L.bilang("oyen", "Laporan diterima. Tersangka dicatat. Motif belum diketahui. Lanjutkan besok.");
              L.flag("liftKedip", false);
              L.langka("sendokBengkok");
              await L.selesaiBab();
            } },
          { id: "tangga", x: 104, y: 330, w: 92, h: 56, label: "Tangga ke Pantry ↑", keluar: true, ke: "pantry" },
        ],
      },
      pantry: {
        nama: "Pantry · Lantai 3", latar: "pantry", seram: 1,
        async masuk(L) {
          if (!L.flag("masukPantry")) {
            L.flag("masukPantry", true);
            await L.bilang("narasi", "Pantry. Bau teh, galon kosong, dan suasana orang yang pura-pura tidak tahu soal gula.");
          }
        },
        titik: [
          { id: "toples", x: 30, y: 170, w: 50, h: 48, label: "Toples gula", gambar: "gula",
            async ketuk(L) {
              if (L.punya("kartu") || L.flag("toplesKosong")) { await L.bilang("narasi", "Toplesnya sudah terbuka. Kosong. Cuma ada remah gula dan rasa penasaran."); return; }
              if (!L.flag("gembokTerbuka")) {
                await L.bilang("narasi", "Toples gula, digembok pakai gembok angka tiga digit. Ada tulisan tangan Bu Ratna di tutupnya: \"Kode = hari piket yang dilingkari\".");
                const ok = await L.gembok({ judul: "Gembok toples gula", ket: "Tiga digit. Gemboknya berbau manis.", kode: "246" });
                if (!ok) { await L.bilang("narasi", "Gemboknya tetap terkunci. Toplesnya terlihat sedikit lega."); return; }
                L.flag("gembokTerbuka", true);
                await L.bilang("narasi", "Klik. Gembok terbuka. Tapi tutup toplesnya seret sekali, seperti ditahan dari dalam.");
                L.tujuan("tutup");
                return;
              }
              await L.bilang("narasi", "Tutup toples masih seret. Butuh sesuatu yang tipis untuk mencongkel.");
            },
            async pakai(L, barang) {
              if (barang !== "sendok") return false;
              if (!L.flag("gembokTerbuka")) { await L.bilang("narasi", "Gemboknya masih terkunci. Sendoknya menunggu giliran."); return; }
              await L.bilang("narasi", "Anda mencongkel tutup toples dengan sendok. Sendoknya bengkok sedikit. Tutupnya terbuka dengan bunyi \"pop\" yang sopan.");
              L.sfx("boing");
              await L.bilang("narasi", "Toplesnya kosong. Tidak ada gula. Yang ada cuma selembar kartu kuning dengan bekas tapak kaki kecil.");
              L.dapat("kartu");
              L.bukti("tapakKartu", "Tapak di kartu akses", "Bekas tapak kaki kecil. Empat jari. Bukan manusia.");
              L.flag("toplesKosong", true);
              const j = await L.tanya("ratna", "Itu bukan kartu saya ya. Saya cuma menyimpan gula di situ. Dulu.", ["Ini punya siapa ya, Bu?", "Boleh aku simpan, Bu?"]);
              if (j === 0) { await L.bilang("ratna", "Hmm. Tapak kakinya kecil ya. Empat jari. Saya nggak mau menuduh siapa-siapa. Tapi Oyen tadi lewat sambil bersiul."); L.bukti("siulan", "Kesaksian Bu Ratna", "Oyen lewat pantry sambil bersiul. Kucing tidak biasa bersiul."); }
              else { await L.bilang("ratna", "Boleh. Kamu yang menyelidiki. Saya buatkan teh ya, buat menemani."); await L.bilang("narasi", "Bu Ratna menyodorkan teh tawar. Gulanya, tentu saja, tidak ada."); }
              await L.bilang("narasi", "Di kartu tertulis: \"AKSES: 13?\". Tanda tanyanya ditulis tangan. Mungkin lift di lobi tahu sesuatu.");
              L.tujuan("lapor");
            } },
          { id: "poster", x: 40, y: 60, w: 104, h: 94, label: "Poster piket",
            async ketuk(L) {
              L.flag("posterDibaca", true);
              await L.lihat(`
                <h3 class="teka-judul">Jadwal Piket Cuci Gelas</h3>
                <table class="poster-piket"><tbody>
                  <tr><th>Senin</th><td>Dimas</td></tr>
                  <tr class="lingkar"><th>Selasa</th><td>Bu Ratna</td></tr>
                  <tr><th>Rabu</th><td>Mas Kukang (mulai jam 11)</td></tr>
                  <tr class="lingkar"><th>Kamis</th><td>Pak Satpam</td></tr>
                  <tr><th>Jumat</th><td>Dimas (lagi)</td></tr>
                  <tr class="lingkar"><th>Sabtu</th><td>Oyen (tidak pernah datang)</td></tr>
                </tbody></table>
                <p class="muted small">Catatan di pojok: "Hari yang dilingkari = hari gula paling cepat habis. — R"</p>`);
            } },
          { id: "meja", x: 80, y: 300, w: 140, h: 90, label: "Bawah meja",
            async ketuk(L) {
              if (L.flag("dimasMuncul")) { await L.bilang("narasi", "Di bawah meja cuma ada remah biskuit dan satu kaus kaki yang bukan milik siapa-siapa."); return; }
              L.flag("dimasMuncul", true);
              await L.bilang("narasi", "Anda membungkuk untuk melihat ke bawah meja. Gelap. Ada sesuatu yang bergerak...");
              await L.kejut({
                gambar: `<span class="kejut-sprite">${px("marmut")}</span>`,
                teriak: "AAAAAAAA!!!",
                siapa: "dimas",
                punchline: "SAYA KIRA ANDA HANTU GULA— eh. Maaf. Maaf banget. Saya lagi nyari sendok yang jatuh. Saya yang kaget duluan, sumpah.",
              });
              await L.bilang("dimas", "Ini sendoknya. Agak bengkok, saya injak tadi. *nggak sengaja. Buat kamu aja.");
              L.dapat("sendok");
            } },
          { id: "dispenser", x: 244, y: 140, w: 46, h: 170, label: "Dispenser",
            async ketuk(L) { await L.bilang("narasi", "Galonnya kosong. Tentu saja. Ada catatan tempel: \"Galon diganti jam 3. Galon kosong jam 3 lewat 1 menit.\""); } },
          { id: "kulkas", x: 196, y: 120, w: 40, h: 90, label: "Kulkas",
            async ketuk(L) { await L.bilang("narasi", "Di atas kulkas ada bekas tidur seekor kucing. Masih hangat. Pemiliknya sedang tidak ada, atau sedang menatap tembok di tempat lain."); } },
          { id: "ratna", x: 120, y: 236, w: 56, h: 62, label: "Bu Ratna", gambar: "kapibara",
            async ketuk(L) {
              if (L.punya("kartu")) { await L.bilang("ratna", "Kartunya dibawa ke lift di lobi ya. Lift itu suka tahu hal-hal yang kita nggak tahu."); return; }
              if (L.flag("gembokTerbuka")) { await L.bilang("ratna", "Tutupnya seret ya? Biasanya saya congkel pakai sendok. Sendoknya... hilang juga. Kantor ini kehilangan banyak hal ya."); return; }
              await L.bilang("ratna", "Oh, kamu yang menyelidiki ya. Maaf, saya lupa kodenya. Tapi saya ingat, saya pakai jadwal piket buat kode.");
              await L.bilang("ratna", "Saya orangnya pelupa, jadi saya simpan petunjuknya di tempat yang saya lihat tiap hari.");
            } },
          { id: "turun", x: 4, y: 330, w: 70, h: 60, label: "← Lobi", keluar: true, ke: "lobi" },
        ],
      },
    },
  };
})();
