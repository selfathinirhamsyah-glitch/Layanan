/* =========================================================
   Kantor Layanan Perasaan · Atap Biru · isi (data saja)
   - AREA: tujuh sudut atap, tiap sudut punya tugas renovasi
     (bayar pakai bintang dari puzzle, sebagian bisa pilih gaya)
   - CERITA: "Surat dari Atap", prolog + 7 episode bersambung
   - LEMARI: baju dan aksesori untuk karakter Mira
   ========================================================= */
(() => {
  "use strict";
  const K = window.KLP;

  /* ---------- sudut atap & tugas ---------- */
  const AREA = [
    {
      id: "lantai", nama: "Lantai & Pagar", sprite: "kura", oleh: "Pak Satpam",
      ket: "Debu sebelas tahun. Daun dari pohon yang bahkan tidak ada di dekat sini.",
      tugas: [
        { id: "sapu", nama: "Sapu daun kering", harga: 1, kata: ["kura", "Pak Satpam", "Siap. Daunnya sudah dipindahkan. Ke tempat sampah, bukan ke atap tetangga."] },
        { id: "lantai", nama: "Pasang lantai baru", harga: 2, gaya: [["kayu", "Papan kayu"], ["ubin", "Ubin biru"], ["rumput", "Rumput sintetis"]], kata: ["badak", "Kak Badak", "Lantainya sudah saya injak-injak untuk tes. Lulus. Saya juga lulus."] },
        { id: "pagar", nama: "Cat pagar", harga: 2, gaya: [["putih", "Putih susu"], ["biru", "Biru laut"], ["kuning", "Kuning kunyit"]], kata: ["rakun", "Bang Rakun", "Pagarnya kuat. Yang lemah cuma catnya. Sekarang dua-duanya kuat."] },
      ],
    },
    {
      id: "kebun", nama: "Kebun Kecil", sprite: "kapibara", oleh: "Bu Ratna",
      ket: "Ada tiga pot retak dan satu tanaman yang menolak mati.",
      tugas: [
        { id: "pot", nama: "Cuci pot-pot lama", harga: 1, kata: ["kapibara", "Bu Ratna", "Potnya dicuci pelan-pelan ya. Yang retak jangan dibuang, nanti diisi kaktus."] },
        { id: "tanam", nama: "Tanam sesuatu", harga: 2, gaya: [["cabai", "Cabai rawit"], ["matahari", "Bunga matahari"], ["kaktus", "Kaktus berjajar"]], kata: ["kapibara", "Bu Ratna", "Disiramnya sore saja. Pagi-pagi tanaman juga masih ngumpulin nyawa."] },
        { id: "rak", nama: "Rak tanaman", harga: 2, gaya: [["kayu", "Rak kayu"], ["kaleng", "Kaleng cat biru"], ["tangga", "Tangga bekas"]], kata: ["berang", "Bang Berang-berang", "Kabar baik: raknya tidak goyang. Kabar lebih baik: saya yang pasang."] },
      ],
    },
    {
      id: "baca", nama: "Pojok Baca", sprite: "kukang", oleh: "Mas Kukang",
      ket: "Tempat untuk membaca tiga halaman, lalu menatap langit dua puluh menit.",
      tugas: [
        { id: "rakbuku", nama: "Rak buku", harga: 2, gaya: [["biru", "Sampul biru semua"], ["campur", "Warna campur"], ["klasik", "Sampul cokelat klasik"]], kata: ["kukang", "Mas Kukang", "...rak buku yang rapi itu bagus. Rak buku yang sedikit berantakan berarti bukunya dibaca."] },
        { id: "duduk", nama: "Tempat duduk", harga: 2, gaya: [["hammock", "Hammock biru"], ["beanbag", "Beanbag"], ["rotan", "Kursi rotan"]], kata: ["kukang", "Mas Kukang", "...saya coba duduk sebentar. Sebentar itu tadi empat puluh menit."] },
        { id: "lampubaca", nama: "Lampu baca", harga: 1, kata: ["hantu", "Mbak Burung Hantu", "Diagnosis: cahaya cukup untuk membaca sampai larut. Saran: jangan sampai larut sekali."] },
      ],
    },
    {
      id: "panggung", nama: "Panggung Kecil", sprite: "marmut", oleh: "Dimas",
      ket: "Dimas butuh tempat latihan joget yang tidak terlihat dari ruang rapat.",
      tugas: [
        { id: "lantaipanggung", nama: "Lantai panggung", harga: 2, kata: ["marmut", "Dimas", "PANGGUNG— eh. Panggung. Ada panggung. Saya tenang. Saya sangat tenang."] },
        { id: "sorot", nama: "Lampu sorot", harga: 2, gaya: [["biru", "Biru"], ["ungu", "Ungu"], ["pelangi", "Warna-warni"]], kata: ["marmut", "Dimas", "Lampunya nyala! Sekarang tiap saya salah gerakan, kelihatan lebih jelas. Hore?"] },
        { id: "speaker", nama: "Speaker bekas", harga: 2, kata: ["singa", "Pak Singa", "PERHATIAN. Speaker ini lebih keras dari saya. Saya izinkan. Untuk kali ini."] },
        { id: "cermin", nama: "Cermin latihan", harga: 2, kata: ["marmut", "Dimas", "Cerminnya jujur sekali ya. Nggak apa-apa. Delapan ketukan pertama saya sudah lumayan."] },
      ],
    },
    {
      id: "layar", nama: "Layar Tancap", sprite: "kura", oleh: "Pak Satpam",
      ket: "Untuk nonton bareng tiap malam minggu. Episode terakhir boleh ditonton dua kali.",
      tugas: [
        { id: "layarputih", nama: "Bentangkan layar", harga: 2, kata: ["kura", "Pak Satpam", "Siap. Layar terpasang. Saya sudah cek dari tiga sudut. Tidak ada kerutan yang mencurigakan."] },
        { id: "proyektor", nama: "Perbaiki proyektor", harga: 2, kata: ["rakun", "Bang Rakun", "Proyektornya cuma butuh ditiup dan dipercaya. Sama seperti mesin kopi."] },
        { id: "kursinonton", nama: "Tempat duduk nonton", harga: 3, gaya: [["lipat", "Kursi lipat"], ["karpet", "Karpet & bantal"], ["sofa", "Sofa bekas lobi"]], kata: ["gajah", "Bu Gajah", "Sebagai Kepala Kantor, saya menyetujui kegiatan nonton bareng. Saya duduk di tengah."] },
      ],
    },
    {
      id: "kedai", nama: "Kedai Teh", sprite: "oyen", oleh: "Oyen",
      ket: "Teh hangat, meja kecil, dan tempat tidur resmi untuk Kepala Bagian.",
      tugas: [
        { id: "meja", nama: "Meja teh", harga: 2, gaya: [["bundar", "Meja kayu bundar"], ["biru", "Meja lipat biru"], ["peti", "Peti kayu"]], kata: ["kapibara", "Bu Ratna", "Mejanya pas untuk dua cangkir dan satu siku yang capek."] },
        { id: "payung", nama: "Payung meja", harga: 2, gaya: [["biru", "Biru putih"], ["kuning", "Kuning"], ["hijau", "Hijau daun"]], kata: ["beruang", "Pak Beruang Madu", "Payungnya bagus untuk tidur siang. Maksud saya, untuk rapat santai."] },
        { id: "termos", nama: "Termos & cangkir", harga: 1, kata: ["kapibara", "Bu Ratna", "Tehnya saya buat agak manis ya. Kebiasaan lama."] },
        { id: "kasuroyen", nama: "Tempat tidur Oyen", harga: 2, gaya: [["kardus", "Kardus (pilihan Oyen)"], ["keranjang", "Keranjang rotan"], ["bantal", "Bantal biru"]], kata: ["oyen", "Oyen", "Disetujui."] },
      ],
    },
    {
      id: "langit", nama: "Langit Malam", sprite: "hantu", oleh: "Mbak Burung Hantu",
      ket: "Bagian terakhir. Biasanya bagian terakhir itu yang paling susah dimulai.",
      tugas: [
        { id: "lampu", nama: "Lampu tali", harga: 2, gaya: [["hangat", "Kuning hangat"], ["biru", "Biru"], ["warna", "Warna-warni"]], kata: ["hantu", "Mbak Burung Hantu", "Diagnosis: atap ini sekarang terlihat dari jalan raya. Dua orang berhenti untuk memotret."] },
        { id: "teropong", nama: "Teropong bintang", harga: 3, kata: ["hantu", "Mbak Burung Hantu", "Bintang yang terlihat malam ini: tujuh. Ditambah satu pesawat yang menyamar."] },
        { id: "kotaksurat", nama: "Cat ulang kotak surat", harga: 3, kata: ["kapibara", "Bu Ratna", "Kotak suratnya jadi biru lagi ya. Persis seperti dulu."] },
      ],
    },
  ];
  const SEMUA_TUGAS = AREA.flatMap((a, i) => a.tugas.map((t) => ({ ...t, area: a.id, ai: i })));

  /* ---------- cerita: Surat dari Atap ----------
     baris: [sprite, nama, teks] · ["narasi", teks] · ["surat", teks]
            · ["pilih", tanya, [[label, sprite, nama, balasan], ...]] */
  const CERITA = [
    {
      id: "prolog", judul: "Prolog · Kunci yang Sebelas Tahun Tidak Dipakai", syarat: null,
      baris: [
        ["singa", "Pak Singa", "PERHATIAN. Atap gedung akan dijadikan Gudang Arsip Cadangan ke-14. Kecuali ada yang membuatnya berguna dalam waktu dekat."],
        ["kura", "Pak Satpam", "Siap. Ini kuncinya, {N}. Atapnya sudah sebelas tahun tidak dibuka. Isinya debu, kardus, dan Oyen."],
        ["oyen", "Oyen", "Saya tinggal di sini. Tidak resmi."],
        ["narasi", "Pintu besi berderit. Angin sore masuk duluan, seperti sudah lama menunggu. Di pojok ada kotak surat biru yang catnya mengelupas."],
        ["narasi", "Di dalamnya ada satu amplop. Tulisan tangan di depannya rapi tapi agak miring: \"Untuk siapa pun yang membuka atap ini.\""],
        ["surat", "Halo.\n\nKalau kamu baca ini, berarti pintunya akhirnya dibuka lagi. Aku dulu sering ke sini kalau lagi capek, tapi nggak tahu capek kenapa.\n\nNggak usah langsung dibereskan semua. Satu sudut dulu aja.\n\n— R."],
        ["pilih", "R. itu siapa?", [
          ["Mungkin Pak Satpam?", "kura", "Pak Satpam", "Siap. Nama saya tidak diawali R. Tapi saya akan menyelidiki. Itu tugas saya juga."],
          ["Mungkin rapat?", "marmut", "Dimas", "R... RAPAT? Rapat yang menulis surat?? Saya takut. Rapat jam 4 sore saja sudah seram."],
          ["Nanti juga ketahuan", "kukang", "Mas Kukang", "...setuju. Surat yang bagus memang tidak terburu-buru."],
        ]],
        ["narasi", "Di balik amplop ada tulisan kecil: \"Surat berikutnya kutaruh di bawah lantai. Tenang, bukan di bawah kardus.\""],
      ],
      bersambung: "Bersihkan Lantai & Pagar untuk menemukan surat kedua.",
    },
    {
      id: "ep1", judul: "Episode 1 · Lantai yang Akhirnya Kelihatan", syarat: "lantai",
      baris: [
        ["narasi", "Lantai atap bersih untuk pertama kalinya dalam sebelas tahun. Oyen langsung berbaring di tengah-tengahnya, sebagai bentuk peresmian."],
        ["rakun", "Bang Rakun", "Waktu ganti lantai, saya nemu ini di bawah papan paling ujung."],
        ["marmut", "Dimas", "BANG RAKUN. Rakun. R. Abang yang nulis surat-surat ini, kan?!"],
        ["rakun", "Bang Rakun", "Saya bisa nulis. Tapi saya cuma nulis buku manual mesin kopi. Halaman satu: jangan dipukul."],
        ["surat", "Dulu di sini ada kebun kecil. Mulainya satu pot cabai yang hampir mati.\n\nAku siram tiap sore. Bukan karena yakin dia bakal hidup. Cuma karena itu satu-satunya hal yang bisa kulakukan hari itu.\n\nDia hidup. Aku juga.\n\n— R."],
        ["kapibara", "Bu Ratna", "...Tehnya keburu dingin ya. Saya turun dulu ambil yang baru."],
        ["narasi", "Bu Ratna turun agak cepat. Lebih cepat dari biasanya."],
      ],
      bersambung: "Bu Ratna kenapa ya? Bangun Kebun Kecil untuk surat ketiga.",
    },
    {
      id: "ep2", judul: "Episode 2 · Cabai yang Menolak Mati", syarat: "kebun",
      baris: [
        ["kapibara", "Bu Ratna", "Potnya ditaruh di sisi timur ya. Cabai suka matahari pagi. Kalau siang, dia gampang ngambek."],
        ["kura", "Pak Satpam", "Siap. Bu Ratna tahu banyak tentang kebun atap ini. Dicatat."],
        ["kapibara", "Bu Ratna", "Semua orang tahu cabai suka matahari pagi, Pak."],
        ["narasi", "Di dasar pot paling tua, terbungkus plastik, ada surat ketiga."],
        ["surat", "Aku pernah baca satu novel sampai halaman 40, lalu berhenti tiga bulan. Terus lanjut lagi.\n\nTernyata buku nggak marah kalau ditinggal. Dia tetap nunggu di halaman yang sama.\n\nMungkin aku juga nggak perlu marah sama diriku sendiri.\n\n— R."],
        ["kukang", "Mas Kukang", "...saya setuju dengan surat ini. Saya sudah meninggalkan satu buku di halaman 12 sejak 2019. Dia masih menunggu."],
        ["narasi", "Terselip di surat itu: pembatas buku dari kertas karton. Ada huruf R digambar dengan spidol biru."],
      ],
      bersambung: "Pembatas buku itu milik siapa? Bangun Pojok Baca.",
    },
    {
      id: "ep3", judul: "Episode 3 · Halaman yang Ditunggu", syarat: "baca",
      baris: [
        ["kukang", "Mas Kukang", "...pembatas ini. Saya kenal gambar R seperti ini. Huruf R dengan ekor yang terlalu panjang."],
        ["marmut", "Dimas", "SIAPA, MAS?"],
        ["kukang", "Mas Kukang", "...saya lupa. Tapi saya ingat dia membaca lebih pelan dari saya. Itu prestasi."],
        ["narasi", "Di balik rak buku tua, ada kaset rekaman. Labelnya: \"lagu buat joget jelek\". Di dalam kotaknya, surat keempat."],
        ["surat", "Ada lagu yang kuputar keras-keras di sini, sendirian, sambil joget jelek.\n\nNggak ada yang lihat kecuali burung dara. Itu joget terbaik dalam hidupku.\n\nKalau kamu lagi suntuk, coba joget jelek. Jangan direkam.\n\n— R."],
        ["marmut", "Dimas", "JOGET. Ini pasti Pak Singa. Suaranya keras, pasti jogetnya juga keras."],
        ["singa", "Pak Singa", "PERHATIAN. Saya tidak berjoget. ...Secara resmi."],
      ],
      bersambung: "Kaset itu butuh tempat diputar. Bangun Panggung Kecil.",
    },
    {
      id: "ep4", judul: "Episode 4 · Delapan Ketukan Pertama", syarat: "panggung",
      baris: [
        ["marmut", "Dimas", "Saya latihan gerakan dari video latihan boy group favorit saya. Baru bisa delapan ketukan pertama."],
        ["marmut", "Dimas", "Tapi minggu lalu saya bisa nol ketukan. Jadi ini naik tak terhingga persen."],
        ["badak", "Kak Badak", "Izin semangat diberikan. Untuk delapan ketukan. Sisanya dicicil."],
        ["narasi", "Kasetnya diputar di speaker baru. Lagunya lagu lama. Di sela lagu, ada suara anak perempuan tertawa, lalu bilang: \"Eh, ini kerekam ya?\""],
        ["kura", "Pak Satpam", "...Siap. Saya kenal suara itu."],
        ["narasi", "Pak Satpam tidak menjelaskan lebih lanjut. Ia malah menunjuk tiang besi di tengah atap. Di sana terselip surat kelima."],
        ["surat", "Malam minggu kami nonton drama di layar dari sprei putih. Episode 16 bikin satu kantor nangis, termasuk satpam.\n\nKadang yang bikin kuat itu bukan semangat. Tapi ada yang nangis bareng.\n\n— R."],
        ["kura", "Pak Satpam", "Siap. Saya tidak menangis waktu itu. Ada debu."],
      ],
      bersambung: "Layar dari sprei itu ternyata masih ada. Bangun Layar Tancap.",
    },
    {
      id: "ep5", judul: "Episode 5 · Malam Minggu, Episode 16", syarat: "layar",
      baris: [
        ["narasi", "Malam minggu pertama di atap. Proyektornya berdengung. Yang diputar: film pahlawan bertopeng, seri ke-23 dari semesta yang sama."],
        ["gajah", "Bu Gajah", "Saya tidak paham urutannya. Tapi saya paham bagian yang dia pulang ke rumah dan dimarahi bibinya."],
        ["marmut", "Dimas", "Habis ini drakor ya. Episode 16. Saya sudah siap tisu satu kotak."],
        ["kura", "Pak Satpam", "Siap. Dulu juga begini. Ada anak yang selalu duduk paling depan. Minum teh yang kemanisan."],
        ["narasi", "Di kotak proyektor ada surat keenam, dilipat kecil sekali."],
        ["surat", "Aku sering ngerasa telat dibanding orang lain. Teman-teman sudah tahu mau jadi apa. Aku baru tahu mau makan apa.\n\nLalu Pak Satpam bilang: kereta yang telat tetap sampai stasiun. Penumpangnya tetap boleh turun dengan bangga.\n\n— R."],
        ["kura", "Pak Satpam", "...Siap. Itu kalimat saya. Saya bilang itu ke seorang anak. Sebelas tahun lalu."],
      ],
      bersambung: "Teh yang kemanisan... Bangun Kedai Teh.",
    },
    {
      id: "ep6", judul: "Episode 6 · Teh yang Kemanisan", syarat: "kedai",
      baris: [
        ["kapibara", "Bu Ratna", "Silakan diminum. Agak manis ya. Maaf, kebiasaan lama."],
        ["narasi", "Semua orang di atap berhenti mengunyah. Pelan-pelan, semua kepala menoleh ke Bu Ratna."],
        ["oyen", "Oyen", "Saya sudah tahu dari episode satu."],
        ["narasi", "Di bawah termos ada surat ketujuh. Kertasnya lebih baru dari yang lain."],
        ["surat", "Kalau kamu sudah sampai di sini, berarti atapnya sudah jauh lebih bagus dari waktu aku tinggalkan.\n\nAku cuma mau bilang: kamu nggak harus selalu semangat. Kamu cuma perlu naik lagi besok, nyiram satu pot. Sisanya biasanya nyusul.\n\n— R. (sekarang sudah bukan anak 14 tahun lagi)"],
        ["pilih", "Jadi, menurut kamu siapa R.?", [
          ["Bang Rakun", "rakun", "Bang Rakun", "Saya terharu dicurigai. Tapi bukan. Tulisan saya jelek, bahkan menurut mesin kopi."],
          ["Pak Singa", "singa", "Pak Singa", "PERHATIAN. Bukan saya. Tapi suratnya bagus. Itu juga pengumuman."],
          ["Bu Ratna", "kapibara", "Bu Ratna", "...Besok malam ya. Waktu lampu talinya sudah nyala."],
          ["Rapat", "marmut", "Dimas", "SAYA BILANG JUGA APA— eh, saya yang bilang itu. Maaf. Bukan rapat."],
        ]],
      ],
      bersambung: "Bu Ratna minta tunggu lampu tali menyala. Bangun Langit Malam.",
    },
    {
      id: "ep7", judul: "Episode 7 · Atap Biru (Tamat Musim 1)", syarat: "langit",
      baris: [
        ["narasi", "Lampu tali menyala satu per satu. Dari jalan raya, atap ini terlihat seperti kapal kecil yang sedang berlabuh."],
        ["kapibara", "Bu Ratna", "Ini kunci kotak surat yang asli. Saya simpan sebelas tahun. Ya, R. itu saya. Ratna."],
        ["kapibara", "Bu Ratna", "Umur 14 saya ikut ibu yang kerja bersih-bersih di gedung ini. Saya sering naik ke sini kalau lagi nggak tahu mau ngapain sama diri sendiri."],
        ["kapibara", "Bu Ratna", "Surat-surat itu saya tulis buat diri saya sendiri yang lebih tua. Ternyata yang baca kamu, {N}. Itu lebih bagus."],
        ["kura", "Pak Satpam", "Siap. Saya sudah curiga sejak tehnya kemanisan. Tidak saya laporkan. Demi cerita."],
        ["oyen", "Oyen", "Saya sudah tahu dari prolog."],
        ["singa", "Pak Singa", "PERHATIAN. Rencana Gudang Arsip Cadangan ke-14 dibatalkan. Atap ini resmi bernama Atap Biru. Penanggung jawab: {N}."],
        ["kapibara", "Bu Ratna", "Mau nulis satu surat juga? Untuk siapa pun yang nanti naik ke sini. Boleh untuk diri kamu sendiri yang lebih tua."],
        ["tulis", "Surat untuk kotak surat biru"],
        ["narasi", "Suratnya masuk ke kotak surat biru. Kotaknya ditutup pelan. Angin malam lewat, tidak membaca apa-apa, karena itu sopan."],
      ],
      bersambung: "Tamat Musim 1. Atapnya tetap buka: level puzzle jalan terus, lemari baju bisa diisi, dan teman bisa diajak berkunjung.",
    },
  ];

  /* ---------- lemari ---------- */
  const WARNA_BAJU = [
    ["#2F4A6B", "Biru dongker"], ["#3E78C4", "Biru"], ["#7FC8F2", "Biru langit"], ["#F4F1E8", "Putih"], ["#33302B", "Hitam"],
    ["#F2C14E", "Kuning"], ["#5FA35A", "Hijau"], ["#8A6BBE", "Ungu"], ["#C8553D", "Bata"], ["#D9C3A0", "Krem"],
  ];
  const WARNA_RAMBUT = [["#2B2522", "Hitam"], ["#4A3326", "Cokelat tua"], ["#7A5235", "Cokelat"], ["#2F4A6B", "Biru tua"], ["#4E3D6B", "Ungu tua"]];
  const KULIT = [["#F2D3B3", "Terang"], ["#E3B98F", "Sawo terang"], ["#C99269", "Sawo matang"], ["#8E6142", "Gelap"]];
  const LEMARI = {
    rambut: { nama: "Rambut", isi: [["pendek", "Pendek", 0], ["panjang", "Panjang", 0], ["kuncir", "Kuncir kuda", 30], ["cepol", "Cepol", 40], ["poni", "Poni", 40], ["bob", "Bob", 50]] },
    atas: { nama: "Atasan", isi: [["kaus", "Kaus", 0], ["hoodie", "Hoodie", 40], ["kemeja", "Kemeja", 40], ["jersey", "Jaket jersey", 50], ["sweater", "Sweater", 50], ["kardigan", "Kardigan", 60]] },
    bawah: { nama: "Bawahan", isi: [["jins", "Celana jins", 0], ["rok", "Rok", 30], ["kulot", "Kulot", 40], ["training", "Celana training", 40]] },
    sepatu: { nama: "Sepatu", isi: [["sneakers", "Sneakers", 0], ["sandal", "Sandal", 20], ["bot", "Sepatu bot", 40]] },
    aksesori: { nama: "Aksesori", isi: [["tidak", "Tidak pakai", 0], ["jepit", "Jepit rambut", 20], ["kacamata", "Kacamata", 30], ["topi", "Topi", 40], ["syal", "Syal", 40], ["headphone", "Headphone", 50], ["lightstick", "Lightstick", 60]] },
  };
  const BAJU_AWAL = { rambut: "panjang", wRambut: 0, atas: "hoodie", wAtas: 1, bawah: "jins", wBawah: 0, sepatu: "sneakers", wSepatu: 3, aksesori: "tidak", wAks: 2, kulit: 1 };

  /* ---------- hadiah dari teman (main ke atap) ---------- */
  const HADIAH = [
    { id: "kaktus", nama: "Pot kaktus mini" },
    { id: "bendera", nama: "Bendera kertas" },
    { id: "bantal", nama: "Bantal biru" },
    { id: "lampion", nama: "Lampion kertas" },
  ];

  K.ATAP_DATA = { AREA, SEMUA_TUGAS, CERITA, LEMARI, WARNA_BAJU, WARNA_RAMBUT, KULIT, BAJU_AWAL, HADIAH };
})();
