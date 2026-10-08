/* =========================================================
   Kantor Layanan Perasaan · isi Pantry
   Obrolan bercabang, kalimat "dengerin aja", dan gosip kantor.
   Gosip hanya tentang tokoh fiktif dan benda kantor.
   Format node: { k: [kalimat karakter...], p: [[teks pilihan, node berikut], ...], efek? }
   ========================================================= */
window.KLP = window.KLP || {};
window.KLP.PANTRY = {
  OBROLAN: {
    ratna: {
      status: "lagi nuang teh",
      topik: {
        berat: {
          judul: "Hari ini berat",
          mulai: "a",
          node: {
            a: { k: ["Duduk dulu ya. Tehnya masih anget."], p: [["Makasih, Bu", "b"], ["Aku nggak tahu mau cerita apa", "c"], ["Dengerin aja ya, Bu", "@dengar"]] },
            b: { k: ["Sama-sama ya.", "Nggak usah buru-buru diminum. Pegang aja dulu, anget di tangan."], p: [["Ibu nggak sibuk?", "d"], ["Hari ini capek banget, Bu", "e"]] },
            c: { k: ["Nggak apa-apa. Nggak semua hal harus jadi cerita ya.", "Kadang orang ke pantry cuma buat duduk. Itu juga keperluan resmi."], p: [["Boleh di sini dulu?", "f"], ["Kok Ibu baik banget", "g"]] },
            d: { k: ["Sibuk. Tapi loket bisa nunggu lima menit ya.", "Berkas nggak ke mana-mana. Mereka juga butuh istirahat."], p: [["Hari ini capek banget, Bu", "e"]] },
            e: { k: ["Iya. Kelihatan kok.", "Capek itu bukan tanda kamu kurang. Kadang tandanya kamu udah banyak ngelakuin sesuatu ya."], p: [["Tapi rasanya belum cukup", "h"], ["Iya, Bu", "f"]] },
            f: { k: ["Boleh. Kursi ini nggak ada yang punya.", "Saya lanjut cuci gelas ya. Kalau mau ngomong, saya dengar dari sini."], p: [] },
            g: { k: ["Bukan baik. Saya cuma nggak buru-buru.", "Gulanya habis lagi, jadi tehnya tawar. Maaf ya."], p: [["Gula ke mana sih, Bu?", "i"]] },
            h: { k: ["Rasanya memang sering bohong soal itu.", "Hari ini dihitung cukup ya. Saya yang tanda tangan."], p: [] },
            i: { k: ["Nah itu. Tiap pagi saya isi, siang sudah kosong.", "Pak Satpam bilang nggak lihat siapa-siapa. Oyen cuma menatap tembok."], p: [] },
          },
        },
        kerja: {
          judul: "Kenapa Ibu kerja di sini?",
          mulai: "a",
          node: {
            a: { k: ["Hmm. Dulu saya mau jadi pustakawan.", "Terus saya sadar, yang saya suka bukan bukunya. Saya suka tempat yang orang datangnya pelan-pelan ya."], p: [["Kantor ini pelan?", "b"], ["Nyesel nggak, Bu?", "c"]] },
            b: { k: ["Orangnya datang dengan buru-buru. Pulangnya agak pelan. Itu yang saya jaga."], p: [["Itu kerjaan yang bagus", "d"]] },
            c: { k: ["Nggak. Pustakawan nggak boleh nyeduh teh di dekat rak ya. Di sini boleh."], p: [["Prioritas yang jelas", "d"]] },
            d: { k: ["Hehe. Jangan bilang Oyen. Nanti dijadikan memo."], p: [] },
          },
        },
        teh: {
          judul: "Resep teh Bu Ratna",
          mulai: "a",
          node: {
            a: { k: ["Resepnya gampang ya.", "Air panas, teh celup, tunggu sebentar. Bagian tunggu sebentar itu yang paling susah."], p: [["Kenapa susah?", "b"], ["Gulanya berapa sendok?", "c"]] },
            b: { k: ["Karena orang maunya langsung jadi.", "Teh nggak bisa diburu-buru. Orang juga, sebenarnya."], p: [["Ibu ngomongin teh atau aku?", "d"]] },
            c: { k: ["Biasanya dua. Tapi gulanya hilang terus.", "Jadi sekarang resepnya: teh, air, dan kesabaran."], p: [] },
            d: { k: ["Teh ya.", "...Kebanyakan teh."], p: [] },
          },
        },
      },
      dengar: ["Iya.", "Hmm.", "Pelan-pelan aja ya.", "Saya di sini.", "Tehnya diminum dulu, nanti dingin.", "Nggak apa-apa.", "Iya. Kedengarannya berat ya.", "Saya dengar."],
      salam: "Sini, duduk. Mau ngobrol apa, atau mau diam aja juga boleh ya.",
    },
    satpam: {
      status: "berjaga di dekat dispenser",
      topik: {
        rahasia: {
          judul: "Rahasia bulutangkis Bapak",
          mulai: "a",
          node: {
            a: { k: ["Siap. Itu informasi rahasia.", "...Baik. Saya buka sedikit."], p: [["Serius, Pak", "b"], ["Nggak usah kalau rahasia", "c"]] },
            b: { k: ["Siap. Rahasianya: kura-kura tidak pernah lari ke kok.", "Kok yang datang ke saya. Saya cuma berdiri di tempat yang benar."], p: [["Itu filosofis banget", "d"], ["Itu malas, Pak", "e"]] },
            c: { k: ["Siap. Saya hargai privasi. Tapi saya sudah terlanjur ingin cerita."], p: [["Ya udah cerita", "b"]] },
            d: { k: ["Siap. Saya juga baru sadar waktu mengucapkannya. Akan saya tulis di buku jaga."], p: [] },
            e: { k: ["Siap. Itu efisiensi. Tapi laporan Anda dicatat dan... sedikit benar."], p: [] },
          },
        },
        laporan: {
          judul: "Laporan keamanan hari ini",
          mulai: "a",
          efek: "l13hint",
          node: {
            a: { k: ["Siap. Laporan jaga hari ini.", "Pintu depan: aman. Parkiran: aman. Gula: hilang lagi."], p: [["Gulanya ke mana, Pak?", "b"], ["Ada yang aneh lagi?", "c"]] },
            b: { k: ["Siap. Belum diketahui. Saya sudah berjaga semalaman.", "Yang lewat hanya Oyen. Dan Oyen tidak minum teh. Setahu saya."], p: [["Setahu Bapak?", "c"]] },
            c: { k: ["Siap. Ada satu.", "Lift kadang berhenti di antara lantai 5 dan atap. Tidak ada lantai di situ.", "Pintunya tidak terbuka. Tapi saya dengar suara... sendok diaduk."], p: [["Serem, Pak", "d"], ["Lucu, Pak", "e"]] },
            d: { k: ["Siap. Tidak seram. Sendoknya terdengar sopan."], p: [] },
            e: { k: ["Siap. Saya juga merasa begitu. Tapi saya tidak boleh tertawa saat berjaga."], p: [] },
          },
        },
        capek: {
          judul: "Bapak pernah capek nggak?",
          mulai: "a",
          node: {
            a: { k: ["Siap. Pernah.", "Saya kura-kura. Saya membawa rumah saya ke mana-mana. Itu berat."], p: [["Terus gimana?", "b"]] },
            b: { k: ["Siap. Kalau capek, saya masuk cangkang sebentar.", "Bukan kabur. Cuma menutup pintu sebentar supaya bisa buka lagi."], p: [["Aku boleh masuk cangkang juga?", "c"]] },
            c: { k: ["Siap. Diizinkan. Saya yang jaga pintunya selama Anda di dalam."], p: [] },
          },
        },
      },
      dengar: ["Siap. Saya dengarkan.", "Dicatat. Dalam hati.", "Siap. Lanjutkan, saya jaga pintunya.", "...Siap.", "Situasi dipahami.", "Siap. Tidak ada yang akan mengganggu."],
      salam: "Siap. Pantry dalam pengawasan. Silakan bicara dengan tenang.",
    },
    dimas: {
      status: "panik di dekat mesin kopi",
      topik: {
        pertama: {
          judul: "Hari pertama magang",
          mulai: "a",
          node: {
            a: { k: ["HARI PERTAMA SAYA— eh, maaf. Hari pertama saya...", "...saya salah masuk lift dan naik-turun selama empat puluh menit."], p: [["Kok bisa?", "b"], ["Itu aku banget", "c"]] },
            b: { k: ["Saya nggak tahu cara keluar! Pintunya kebuka, tapi saya takut itu bukan lantai saya.", "*ternyata semua lantai saya. saya kan magang di semua bagian."], p: [["Terus?", "d"]] },
            c: { k: ["SERIUS?? Eh. Serius? Wah. Saya kira cuma saya.", "*lega banget, sumpah."], p: [["Banyak kok yang gitu", "d"]] },
            d: { k: ["Akhirnya Bu Ratna masuk lift, pencet tombol L, terus bilang 'pelan-pelan ya'.", "Sejak itu saya hafal tombol L. Yang lain masih belajar."], p: [] },
          },
        },
        panik: {
          judul: "Dimas kenapa panik terus?",
          mulai: "a",
          node: {
            a: { k: ["SAYA NGGAK PANIK.", "...", "Oke. Sedikit. *banyak."], p: [["Kenapa?", "b"], ["Nggak apa-apa kok panik", "c"]] },
            b: { k: ["Saya takut salah. Kalau salah, nanti... nanti...", "Hmm. Sebenarnya saya nggak tahu nanti apa. Belum pernah sampai ke bagian itu."], p: [["Mungkin nggak seburuk itu", "d"]] },
            c: { k: ["Eh. Beneran?", "Oke. Saya panik dengan izin resmi sekarang. *rasanya lebih tenang, aneh."], p: [] },
            d: { k: ["Iya ya. Kemarin saya salah fotokopi 200 lembar, ternyata Mas Kukang malah senang.", "Katanya, 'akhirnya ada kertas buat alas tidur.'"], p: [] },
          },
        },
        tips: {
          judul: "Minta tips dong",
          mulai: "a",
          node: {
            a: { k: ["TIPS? DARI SAYA?? Eh. Oke. Oke. Tips."], p: [["Tips biar nggak panik", "b"], ["Tips bertahan hidup di kantor", "c"]] },
            b: { k: ["Saya nggak punya. Maaf.", "Tapi... saya punya tips biar panik nggak sendirian: cerita ke Bu Ratna. Pasti dikasih teh."], p: [] },
            c: { k: ["1. Selalu bawa pulpen dua.", "2. Jangan duduk di kursi Oyen. Itu bukan kursi, itu wilayah.", "3. Kalau galon kosong, jangan ditanya kenapa. Nggak ada yang tahu."], p: [] },
          },
        },
      },
      dengar: ["Iya iya. *maaf, satu iya aja.", "Oke. Saya diam. Saya dengerin.", "Hmm. ...Saya nggak panik kok, saya dengerin beneran.", "Iya.", "Itu masuk akal banget. *maaf, saya nggak nasihatin, cuma bilang.", "Saya di sini. Nggak ke mana-mana. Paling ke dispenser."],
      salam: "HALO— eh, halo. Mau ngobrol? Saya juga mau. *kebetulan.",
    },
    oyen: {
      status: "duduk di atas kulkas",
      topik: {
        boleh: {
          judul: "Pak Oyen, boleh ngobrol?",
          mulai: "a",
          node: {
            a: { k: ["Boleh.", "Lima menit. Saya ada rapat dengan tembok."], p: [["Rapat dengan tembok?", "b"], ["Bapak suka kerja di sini?", "c"]] },
            b: { k: ["Rahasia jabatan."], p: [["Oke...", "d"]] },
            c: { k: ["Suka.", "Banyak kardus. Banyak sinar matahari jam dua.", "Pegawainya juga lumayan."], p: [["Lumayan?", "d"]] },
            d: { k: ["...Bagus. Pegawainya bagus.", "Jangan dicatat."], p: [] },
          },
        },
        tembok: {
          judul: "Kenapa sering menatap tembok?",
          mulai: "a",
          efek: "l13hint",
          node: {
            a: { k: ["...", "Ada yang tidak terlihat di situ."], p: [["Hantu?", "b"], ["Tikus?", "c"]] },
            b: { k: ["Bukan.", "Lebih sopan dari hantu."], p: [["Terus apa?", "d"]] },
            c: { k: ["Tikus sudah saya tegur bulan lalu. Secara tertulis."], p: [["Terus apa?", "d"]] },
            d: { k: ["Belum waktunya.", "Ditunda sampai lantainya siap."], p: [["Lantai apa?", "e"]] },
            e: { k: ["Rapat selesai."], p: [] },
          },
        },
        nilai: {
          judul: "Penilaian kinerjaku gimana?",
          mulai: "a",
          node: {
            a: { k: ["Sudah saya nilai.", "Hasilnya di bawah."], p: [["Mana?", "b"]] },
            b: { k: ["*Oyen menggeser selembar kertas dengan kakinya*", "Isinya cuma satu kata: \"CUKUP.\" Dicap. Ada bekas kaki."], p: [["Cukup doang?", "c"], ["Makasih, Pak", "d"]] },
            c: { k: ["Cukup itu nilai tertinggi di kantor ini.", "Yang lain dapat \"lumayan\"."], p: [] },
            d: { k: ["Diketahui."], p: [] },
          },
        },
      },
      dengar: ["Diketahui.", "...", "Hm.", "Lanjut.", "*duduk di sebelah Anda*", "*mendengkur pelan*", "*menyandarkan kepala ke lengan Anda sebentar, lalu pura-pura tidak*"],
      salam: "Ya.",
    },
    kukang: {
      status: "menunggu air mendidih (sejak tadi)",
      topik: {
        santai: {
          judul: "Kenapa santai banget, Mas?",
          mulai: "a",
          node: {
            a: { k: ["......", "...maaf. Saya sedang memikirkan jawabannya."], p: [["Santai aja, Mas", "b"]] },
            b: { k: ["...nah. Itu jawabannya.", "Kalau saya buru-buru, fotokopiannya miring. Kalau pelan, lurus."], p: [["Tapi kerjaan jadi lama", "c"], ["Aku pengen bisa gitu", "d"]] },
            c: { k: ["...iya. Tapi tidak pernah diulang.", "Yang cepat sering harus diulang. Jadi... sama saja."], p: [] },
            d: { k: ["...bisa.", "Mulai dari satu hal kecil yang dikerjakan pelan. Misalnya... minum teh ini.", "...tehnya sudah dingin. Tidak apa-apa."], p: [] },
          },
        },
        fotokopi: {
          judul: "Fotokopian favorit Mas",
          mulai: "a",
          node: {
            a: { k: ["...pernah ada yang minta fotokopi daun.", "Saya fotokopi. Hasilnya bagus. Daunnya juga senang, sepertinya."], p: [["Siapa yang minta?", "b"], ["Mesin fotokopinya baik-baik aja?", "c"]] },
            b: { k: ["...Oyen.", "Katanya untuk arsip. Arsip apa, saya tidak tanya."], p: [] },
            c: { k: ["...mesinnya sedang jatuh cinta.", "Pada printer. Sudah lama. Printernya belum tahu."], p: [["Waduh", "d"]] },
            d: { k: ["...jangan bilang printer. Biar mesinnya yang bilang sendiri. Pelan-pelan."], p: [] },
          },
        },
        semangat: {
          judul: "Kalau lagi nggak semangat?",
          mulai: "a",
          node: {
            a: { k: ["...saya tidur."], p: [["Itu aja?", "b"]] },
            b: { k: ["......", "...lalu bangun. Lalu lihat apakah semangatnya sudah datang.", "Kalau belum... tidur lagi. Kalau sudah... ya pelan-pelan saja."], p: [["Kalau nggak datang-datang?", "c"]] },
            c: { k: ["...dia selalu datang. Kadang telat. Seperti saya.", "Tidak ada yang marah sama saya karena telat. Jadi jangan marah sama dia juga."], p: [] },
          },
        },
      },
      dengar: ["......iya.", "...hmm.", "Saya dengar. Pelan-pelan saja ceritanya. Saya juga pelan.", "...", "...tidak apa-apa.", "......saya masih di sini. Cuma lambat bicaranya."],
      salam: "...halo.",
    },
  },

  GOSIP: [
    { id: "fotokopi", syarat: "pantry", petunjuk: "mampir ke Pantry", judul: "Mesin fotokopi naksir printer", sumber: "Mas Kukang",
      isi: "Sudah tiga bulan mesin fotokopi lantai 1 menyimpan perasaan pada printer. Setiap kali printer macet, mesin fotokopi ikut berbunyi pelan. Printer belum tahu. Printer hanya mau berhubungan lewat kabel USB." },
    { id: "galon", syarat: "game", petunjuk: "main satu game", judul: "Galon kosong setiap jam 3 sore", sumber: "Dimas (tidak bisa dipercaya sepenuhnya)",
      isi: "Galon di pantry selalu kosong tepat jam 3 sore. Tidak ada yang pernah melihat siapa yang menghabiskannya. Dimas sempat berjaga dan tertidur jam 2.58. Saat bangun, galonnya kosong dan ada bekas tapak kaki kecil." },
    { id: "gula", syarat: "loketA", petunjuk: "selesaikan Loket A", judul: "Gula pasir hilang (lagi)", sumber: "Bu Ratna",
      isi: "Toples gula diisi setiap pagi dan sudah kosong sebelum makan siang. Tersangka sementara: semua orang. Bu Ratna sudah menulis label \"GULA BERSAMA, AMBIL SECUKUPNYA\". Esok harinya labelnya juga hilang." },
    { id: "kipas", syarat: "game:kertas", petunjuk: "main Tangkap Kertas Terbang", judul: "Kipas angin cuma pura-pura menoleh", sumber: "Pak Satpam",
      isi: "Menurut pengamatan Pak Satpam, kipas angin di ruang istirahat sebenarnya tidak suka menoleh. Ia menoleh hanya karena ingin melihat siapa yang sedang makan. Belum ada bukti. Kipasnya juga tidak mau berkomentar." },
    { id: "raket", syarat: "game:rally", petunjuk: "main Rally vs Pak Satpam", judul: "Raket Pak Satpam punya nama", sumber: "Dimas",
      isi: "Raket kesayangan Pak Satpam diberi nama \"Bu Hajah\". Raket itu disimpan di loker dengan dilapisi handuk kecil. Pak Satpam membantah, tapi handuknya bersulam huruf B.H." },
    { id: "tangan", syarat: "loketB", petunjuk: "selesaikan Loket B", judul: "Dimas memfotokopi tangannya sendiri", sumber: "Mas Kukang",
      isi: "Pada minggu kedua magang, Dimas memfotokopi tangannya sendiri \"untuk arsip\". Hasilnya disimpan di map bertuliskan TANGAN DIMAS (ASLI). Mas Kukang menyimpan salinannya. Katanya, \"siapa tahu suatu hari dibutuhkan.\"" },
    { id: "ditolak", syarat: "game:stempel", petunjuk: "main Stempel Kilat", judul: "Stempel DITOLAK sebenarnya pemalu", sumber: "Bu Ratna",
      isi: "Stempel DITOLAK selalu disimpan paling belakang di laci. Bu Ratna bilang, bukan karena jarang dipakai, tapi karena stempelnya sendiri tidak suka menolak orang. Setiap habis dipakai, ia dibersihkan pelan-pelan sebagai permintaan maaf." },
    { id: "banding", syarat: "loketC", petunjuk: "selesaikan Loket C", judul: "Oyen pernah mengajukan banding", sumber: "Pak Satpam",
      isi: "Dulu Oyen sempat tidak diangkat jadi Kepala Bagian. Oyen mengajukan banding dengan cara tidur di atas berkas pengangkatan selama sembilan hari. Pada hari kesepuluh, berkasnya ditandatangani. Tidak ada yang tahu siapa yang tanda tangan." },
    { id: "mertua", syarat: "tanamanSegar", petunjuk: "siram tanaman di ruang tunggu sampai segar", judul: "Lidah mertua sudah naik pangkat tiga kali", sumber: "Bu Gajah (lewat memo)",
      isi: "Pak Lidah Mertua, tanaman di ruang tunggu, sudah dipromosikan tiga kali karena \"tidak pernah mengeluh dan selalu hadir\". Jabatannya sekarang setara Kepala Seksi. Ia tetap tidak punya meja, tapi potnya diganti yang lebih bagus." },
    { id: "rapat", syarat: "game:ngemil", petunjuk: "main Ngemil Diam-diam di Rapat", judul: "Gorengan rapat selalu kurang satu", sumber: "Dimas",
      isi: "Setiap rapat, gorengan dipesan sesuai jumlah peserta. Setiap rapat, gorengan kurang satu. Oyen selalu duduk paling dekat piring. Oyen juga selalu bilang tidak makan gorengan. Kasus ditutup karena kurang bukti dan banyak remah." },
    { id: "surat", syarat: "suratPrinter", petunjuk: "tangkap surat rahasia di Tangkap Kertas Terbang", judul: "Isi surat untuk printer bocor", sumber: "Kertas terbang (sumber tidak resmi)",
      isi: "Surat dari mesin fotokopi untuk printer akhirnya terbaca sebagian. Isinya: \"Kamu selalu panas duluan, aku selalu menyalin perasaanku dua kali.\" Sisanya buram karena tintanya hampir habis. Printer membalas dengan error \"PAPER JAM\". Belum jelas artinya." },
    { id: "troli", syarat: "game:troli", petunjuk: "main Balap Troli Arsip", judul: "Troli arsip punya SIM", sumber: "Pak Satpam",
      isi: "Troli arsip nomor 3 ternyata punya SIM, dibuat sendiri dari karton dan dilaminasi Mas Kukang. Fotonya buram karena trolinya tidak mau diam. Pak Satpam mengizinkan, asal tidak melebihi 40 km/jam di parkiran B2." },
    { id: "gelas", syarat: "absen", petunjuk: "isi absen perasaan di Lobi", judul: "Gelas teh Bu Ratna punya nama", sumber: "Dimas",
      isi: "Semua gelas di pantry ternyata dinamai Bu Ratna. Gelas yang biasa dipakai untuk absen perasaan namanya \"Pak Sabar\". Gelas yang retak sedikit namanya \"Tetap Dipakai\". Bu Ratna bilang itu bukan nama, itu doa." },
    { id: "lift", syarat: "l13:bab1", petunjuk: "selesaikan Bab 1 Misteri Lantai 13", judul: "Ada lantai yang tidak dihitung lift", sumber: "Pak Satpam (sambil berbisik)",
      isi: "Lift gedung ini kadang berhenti di antara lantai 5 dan atap, di tempat yang seharusnya tidak ada lantainya. Pintunya tidak terbuka. Pak Satpam bersumpah pernah mendengar suara sendok diaduk dari baliknya. Sendoknya terdengar sopan." },
    { id: "boo", syarat: "l13:bab2", petunjuk: "selesaikan Bab 2 Misteri Lantai 13", judul: "Mesin fotokopi minta maaf soal BOO", sumber: "Mas Kukang",
      isi: "Mesin fotokopi menyesal sudah mencetak tulisan BOO raksasa. Sebagai permintaan maaf, ia mencetak satu lembar bertuliskan \"maaf ya\" dalam ukuran huruf 6. Tidak ada yang bisa membacanya, tapi semua merasa dimaafkan." },
    { id: "pot", syarat: "l13:bab3", petunjuk: "selesaikan Bab 3 Misteri Lantai 13", judul: "Pak Satpam masih menyimpan kostum pot", sumber: "Dimas",
      isi: "Setelah penyamarannya terbongkar, Pak Satpam tidak membuang kostum pot tanamannya. Kostum itu dilipat rapi di pos jaga dengan label \"UNTUK KEADAAN DARURAT\". Belum ada yang tahu keadaan darurat jenis apa yang membutuhkan pot." },
    { id: "penjaga", syarat: "l13:bab6", petunjuk: "selesaikan Misteri Lantai 13", judul: "Gula ternyata untuk lembur", sumber: "Bu Ratna",
      isi: "Misteri gula akhirnya terungkap. Gula diambil untuk membuat teh manis bagi siapa pun yang pulang paling malam. Bu Ratna sekarang menyiapkan dua toples: satu untuk pantry, satu ditaruh di depan tembok yang sering ditatap Oyen." },
  ],
};
