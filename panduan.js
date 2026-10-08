/* =========================================================
   Kantor Layanan Perasaan · Buku Panduan Pegawai Baru
   Panduan penggunaan di dalam aplikasi. Terbuka di bab yang
   sesuai dengan lantai tempat Mira berada. Tanpa spoiler misteri.
   ========================================================= */
(() => {
  "use strict";
  const K = window.KLP;
  const { $, $$, esc, px, sfx, NAMA } = K;

  /* Setiap bab: dibawakan satu pegawai. Langkah: [sprite, teks]. */
  const BAB = [
    {
      id: "mulai", judul: "Selamat datang", sprite: "kapibara", oleh: "Bu Ratna",
      buka: `Halo, ${NAMA}. Ini kantor untuk urusan perasaan. Yang berat, yang menyenangkan, yang belum ketahuan apa. Datang kapan saja ya, nggak ada jam telat di sini.`,
      langkah: [
        ["dokumen", "Di halaman depan, ketuk <b>Ambil Nomor Antrean</b>, lalu <b>Masuk ke Lobi</b>. Antreannya selalu kosong. Sengaja."],
        ["kura", "Setelah masuk, panel tombol lift muncul di bawah layar. Itu cara pindah ruangan."],
        ["panduan", "Buku ini bisa dibuka kapan saja lewat tombol <b>Panduan</b> di pojok kanan atas. Bukunya langsung terbuka di bab lantai tempat kamu berada."],
        ["radio", "Tombol <b>Radio</b> di sebelahnya untuk mengatur suara."],
      ],
      catatan: "Nggak ada yang wajib di sini. Mau cuma duduk di lobi juga boleh.",
    },
    {
      id: "lift", judul: "Lift & denah gedung", sprite: "kura", oleh: "Pak Satpam",
      buka: "Siap. Gedung ini punya enam lantai yang tercatat. Ke mana-mana pakai lift. Tangga sedang dipakai untuk merenung.",
      langkah: [
        ["kura", "<b>L</b> Lobi · <b>1</b> Loket · <b>2</b> Rehat (games) · <b>3</b> Pantry · <b>4</b> Koperasi · <b>5</b> Meja Kerja kamu."],
        ["dokumen", "Di lobi ada <b>denah gedung</b>. Ketuk lantainya untuk naik lift."],
        ["oyen", "Tombol lift yang tidak ada angkanya... belum ada lantainya. Laporan sudah saya kirim. Belum dijawab."],
        ["berkas", "Kotak merah kecil di tombol lift artinya ada yang baru di lantai itu, misalnya gosip baru."],
      ],
      catatan: "Siap. Tidak ada yang tersesat di gedung ini. Paling lama empat puluh menit, seperti Dimas.",
    },
    {
      id: "lobi", judul: "Lobi", sprite: "kapibara", oleh: "Bu Ratna",
      buka: "Lobi itu ruang tunggu. Tapi di sini nunggunya nggak harus nunggu apa-apa ya.",
      langkah: [
        ["singa", "<b>Pengumuman Kantor</b>: kabar terbaru, misalnya gosip baru atau bab misteri yang sudah terbuka."],
        ["cangkir", "<b>Absen Perasaan</b>: tahan tombol untuk menuang teh. Isi gelas = isi baterai kamu hari ini. Seruput kalau kebanyakan. Lalu ketuk <b>Catat absen</b>."],
        ["marmut", "Isi gelasnya menentukan siapa yang menyapa kamu dan game apa yang disarankan. Absen pertama tiap hari dapat +5 Poin Sabar."],
        ["kartu", "Kartu <b>Berkas: Misteri Lantai 13</b> untuk masuk ke cerita bersambung."],
        ["kapibara", "<b>Papan Pegawai</b>: kenalan sama kami semua. Fotonya diambil Mas Kukang, jadi agak lama."],
        ["tanaman2", "Di bawah ada fasilitas ruang tunggu: tanaman, mesin kopi, kotak saran, manajer. Coba diketuk berkali-kali."],
      ],
      catatan: "Absennya boleh diubah lagi kalau perasaan berubah. Perasaan memang begitu.",
    },
    {
      id: "loket", judul: "Loket Layanan", sprite: "kapibara", oleh: "Bu Ratna",
      buka: "Lantai 1 isinya loket. Pilih yang paling dekat sama perasaan kamu sekarang ya.",
      langkah: [
        ["kapibara", "<b>Loket A · Keluhan</b>: centang kategori, <b>tarik garis mulut</b> wajahnya ke atas atau bawah untuk tingkat capek, tulis kalau mau. Lalu terima surat balasan dan kompensasi."],
        ["berang", "<b>Loket B · Kabar baik</b>: pilih jenis kabar baik, taruh barang di <b>timbangan</b> (balon bikin ringan), lalu kantor merayakan. Dapat Piagam Hari Baik."],
        ["badak", "<b>Loket C · Semangat</b>: pilih target, lalu <b>usap ke atas</b> di lapangan untuk memukul kok. Makin jauh, makin semangat. Dapat Izin Resmi untuk Jadi Hebat."],
        ["hantu", "<b>Loket D</b> muncul sendiri kalau kamu ragu-ragu sebentar. Tiga pertanyaan aneh untuk mencari loket yang cocok."],
        ["dokumen", "Surat, piagam, dan izin bisa <b>diunduh sebagai gambar</b>. Di iPhone, tekan lama gambarnya lalu simpan."],
      ],
      catatan: "Yang kamu tulis di kolom keluhan atau cerita tidak disimpan ke mana pun. Begitu ditutup, hilang.",
    },
    {
      id: "rehat", judul: "Ruang Istirahat (games)", sprite: "marmut", oleh: "Dimas",
      buka: "SELAMAT DATANG DI LANTAI 2— eh, maaf. Di sini ada empat game. Semuanya singkat. Semuanya resmi.",
      langkah: [
        ["kura", "<b>Rally vs Pak Satpam</b>: ketuk layar saat kok masuk lingkaran. Makin pas, makin besar nilainya. Gagal 3 kali, selesai."],
        ["berkas", "<b>Stempel Kilat</b> (60 detik): pilih DISETUJUI, DITOLAK, atau NANTI AJA. Kalau ada Oyen tidur di atas berkas, <b>jangan dicap</b>."],
        ["saran", "<b>Tangkap Kertas Terbang</b> (45 detik): geser jari untuk memindahkan map. Hindari undangan rapat jam 4 sore."],
        ["gorengan", "<b>Ngemil Diam-diam di Rapat</b> (45 detik): tahan layar untuk ngemil, <b>lepas</b> saat Oyen menoleh."],
        ["marmut", "Sebelum main, kamu boleh menumpuk berkas di kepala saya (beban pikiran). Kalau sesudah main berkurang, dapat bonus. *kepala saya kuat kok."],
        ["oyen", "Semua game memberi <b>Poin Sabar</b>. Rekor tersimpan. Papan Pegawai Teladan selalu dimenangkan kamu. Itu keputusan Kepala Bagian."],
      ],
      catatan: "Kalau capek di tengah game, ketuk Keluar. Nggak ada yang marah. *saya juga sering keluar.",
    },
    {
      id: "pantry", judul: "Pantry", sprite: "kukang", oleh: "Mas Kukang",
      buka: "...di pantry, orang boleh ngobrol. Boleh juga diam. Dua-duanya sama sahnya.",
      langkah: [
        ["kapibara", "Ketuk <b>Ngobrol</b> di samping salah satu pegawai. Pilih topik, lalu pilih balasan kamu sendiri."],
        ["kukang", "Pilih <b>Dengerin aja</b> kalau cuma mau cerita. Kami cuma menemani. Tidak menasihati. ...saya paling jago yang ini."],
        ["dokumen", "Di mode itu kamu boleh mengetik apa saja. Tulisannya <b>tidak disimpan</b>. Begitu keluar dari pantry, gelembungnya dicuci."],
        ["saran", "<b>Papan Gosip</b>: gosip tentang benda dan pegawai kantor. Gosip baru terbuka setelah kamu main game, ke loket, atau menyelidiki misteri."],
        ["cangkir", "Topik yang selesai pertama kali memberi +3 Poin Sabar. ...uang lelah ngobrol."],
      ],
      catatan: "...setiap karakter cara bicaranya beda. Saya lambat. Itu bukan error.",
    },
    {
      id: "koperasi", judul: "Koperasi Kantor", sprite: "berang", oleh: "Bang Berang-berang",
      buka: "Koperasi menjual barang-barang yang tidak dijual di tempat lain. Karena memang tidak ada.",
      langkah: [
        ["marmut", "Pilih <b>teman belanja</b>. Dia akan mengomentari setiap barang yang kamu ambil."],
        ["payung", "Ketuk <b>+ Keranjang</b> di barang yang kamu mau. Bar keranjang muncul di bawah, ketuk untuk melihat isinya."],
        ["berang", "Ke <b>kasir</b>, bayar pakai Poin Sabar, lalu dapat <b>struk</b> yang bisa diunduh."],
        ["kursi", "Barang yang dibeli otomatis diantar ke Meja Kerja kamu di Lantai 5."],
        ["toples", "Beberapa barang langka baru datang setelah Misteri Lantai 13 berjalan."],
      ],
      catatan: "Barang yang sudah dibeli tidak dapat ditukar dengan perasaan lain. Itu peraturan koperasi.",
    },
    {
      id: "meja", judul: "Meja Kerja", sprite: "oyen", oleh: "Oyen",
      buka: "Meja Anda. Lantai 5. Dibersihkan oleh tidak ada siapa-siapa.",
      langkah: [
        ["kursi", "Barang dari koperasi dipajang di meja. Ketuk barangnya, pegawai yang lewat akan berkomentar."],
        ["sendok", "Rak di dinding untuk <b>barang langka</b> dari misteri."],
        ["dokumen", "<b>Buku Rekor</b>: skor tertinggi, Poin Sabar sepanjang masa, game yang dimainkan."],
        ["berkas", "Paling bawah: <b>Bersihkan meja</b> untuk menghapus semua data di HP ini. Tidak bisa dibatalkan."],
      ],
      catatan: "Kalendernya jangan diketuk berkali-kali. Itu urusan saya.",
    },
    {
      id: "misteri", judul: "Misteri Lantai 13 · cara main", sprite: "oyen", oleh: "Oyen",
      buka: "Ada lantai yang tidak tercatat. Tugas Anda: selidiki. Pelan-pelan.",
      langkah: [
        ["kartu", "Masuk lewat kartu <b>Berkas: Misteri Lantai 13</b> di Lobi. Satu bab terbuka <b>per hari</b>. Bab 1 bisa langsung."],
        ["kura", "<b>Ketuk benda</b> yang bergaris putus-putus untuk memeriksa, ngobrol, atau pindah ruangan."],
        ["dokumen", "Dialog: ketuk kotak teks untuk lanjut. Kalau ada pilihan, pilih salah satu. Tidak ada pilihan yang salah."],
        ["kunci", "<b>Laci</b> di bawah layar berisi barang temuan. Untuk memakai: ketuk barangnya sampai <b>kuning</b>, lalu ketuk bendanya. Ketuk dua kali untuk membaca keterangannya."],
        ["kapibara", "Buntu? Ketuk <b>Petunjuk</b> di pojok kanan atas. Bu Ratna kasih petunjuk bertahap, dari samar sampai hampir jawaban."],
        ["marmut", "Kadang ada <b>kejutan</b>. Selalu lucu, tidak seram. Setelahnya ada Formulir Laporan Kaget. Kejutan bisa dimatikan di Radio Kantor."],
        ["panduan", "Progres tersimpan otomatis. Boleh keluar kapan saja dan lanjut lagi nanti."],
      ],
      catatan: "Jawaban tidak dicantumkan di buku ini. Itu namanya misteri. Diketahui.",
    },
    {
      id: "rahasia", judul: "Lantai 13", sprite: "oyen", oleh: "Oyen",
      buka: "Lantai ini terbuka untuk penjaganya saja.",
      langkah: [
        ["kunci", "Tombol <b>13</b> di lift membawa Anda ke Ruang Penyimpanan Hal Kecil."],
        ["dokumen", "SK pengangkatan bisa diunduh."],
        ["toples", "Tulis satu hal kecil yang bikin senyum hari ini, lalu simpan. Disimpan di HP ini saja. Kalau tidak ada, duduk saja."],
      ],
      catatan: "Gula tetap saya yang pegang.",
    },
    {
      id: "radio", judul: "Radio Kantor (suara & kejutan)", sprite: "singa", oleh: "Pak Singa",
      buka: "Perhatian. Radio Kantor ada di pojok kanan atas. Ini pengumuman tentang pengumuman.",
      langkah: [
        ["radio", "<b>Putar kenop</b> dengan jari, atau ketuk nama stasiunnya: Mode Perpustakaan (tanpa suara), Bisik-bisik, Volume Rapat, Volume Kantin, Volume Pak Singa."],
        ["oyen", "<b>Tuas Mode Kaget</b>: matikan kalau tidak mau dikagetkan di misteri. Bendanya akan muncul pelan-pelan, sambil minta maaf."],
        ["singa", "Ketuk <b>Tes: Ting-Tong</b> untuk mencoba suara. Suara baru menyala setelah layar diketuk sekali. Itu aturan browser, bukan saya."],
      ],
      catatan: "Perhatian. Kalau HP sedang mode senyap, saya juga ikut senyap. Demikian.",
    },
    {
      id: "privasi", judul: "Privasi & data", sprite: "gajah", oleh: "Bu Gajah, Kepala Kantor",
      buka: "Kantor ini tidak punya lemari arsip rahasia. Yang ada cuma pajangan.",
      langkah: [
        ["dokumen", "Isi keluhan, cerita kabar baik, dan obrolan \"dengerin aja\" <b>tidak pernah disimpan atau dikirim</b>."],
        ["berkas", "Yang diingat hanya hal-hal kantor: Poin Sabar, skor, barang, gosip, progres misteri. Semuanya di HP ini saja."],
        ["payung", "Tidak ada server, tidak ada pelacak. Kalau dibuka di HP lain atau mode samaran, semuanya mulai dari awal."],
        ["kursi", "Mau mulai dari nol? Lantai 5, paling bawah: <b>Bersihkan meja</b>."],
      ],
      catatan: "Saya tidak pernah lupa siapa saja yang mampir. Tapi saya juga tidak mencatatnya.",
    },
  ];

  const BAB_LANTAI = { L: "lobi", "1": "loket", "2": "rehat", "3": "pantry", "4": "koperasi", "5": "meja", "13": "rahasia" };
  const BAB_LAYAR = { "s-depan": "mulai", "s-misteri": "misteri", "s-pegawai": "lobi", "s-obrolan": "pantry", "s-penutup": "loket" };

  const panel = $("#panelPanduan"), isi = $("#panduanIsi"), bawah = $("#panduanBawah");
  let posisi = -1; // -1 = daftar isi

  function babSekarang() {
    const layar = K.layarAktif();
    if (!$("#l13").hidden) return "misteri";
    if (BAB_LAYAR[layar]) return BAB_LAYAR[layar];
    return BAB_LANTAI[document.getElementById(layar)?.dataset.lantai] || "mulai";
  }
  const terlihat = (b) => b.id !== "rahasia" || (K.data.l13 && K.data.l13.selesai.includes(6));
  const daftar = () => BAB.filter(terlihat);

  function gambarDaftar() {
    posisi = -1;
    const dibaca = K.data.panduanDibaca || [];
    isi.innerHTML = `
      <p class="bp-pengantar">Pilih bab. Atau baca dari awal, pelan-pelan saja.</p>
      <ol class="bp-daftar">
        ${daftar().map((b, i) => `
          <li><button type="button" class="bp-bab" data-i="${i}">
            <span class="avatar avatar-sm">${px(b.sprite)}</span>
            <span class="bp-bab-judul"><strong>${esc(b.judul)}</strong><small>dibawakan ${esc(b.oleh)}</small></span>
            ${dibaca.includes(b.id) ? `<span class="bp-centang" aria-label="sudah dibaca">✓</span>` : ""}
          </button></li>`).join("")}
      </ol>`;
    bawah.innerHTML = `<button class="btn primary" type="button" data-bp="0">Baca dari awal →</button>`;
    isi.scrollTop = 0;
  }
  function gambarHalaman(i) {
    const d = daftar();
    posisi = Math.max(0, Math.min(d.length - 1, i));
    const b = d[posisi];
    const dibaca = new Set(K.data.panduanDibaca || []);
    if (!dibaca.has(b.id)) { dibaca.add(b.id); K.data.panduanDibaca = [...dibaca]; K.simpan(); }
    isi.innerHTML = `
      <p class="bp-nomor mono">Bab ${posisi + 1} dari ${d.length}</p>
      <h3 class="bp-judul">${esc(b.judul)}</h3>
      <div class="petugas" data-sprite="${b.sprite}">
        <div class="petugas-tag">${esc(b.oleh)}</div>
        <p>${esc(b.buka)}</p>
      </div>
      <ol class="bp-langkah">
        ${b.langkah.map(([sp, teks]) => `<li><span class="bp-ikon-kecil">${px(sp)}</span><span>${teks}</span></li>`).join("")}
      </ol>
      ${b.catatan ? `<p class="bp-catatan">${esc(b.catatan)}</p>` : ""}`;
    K.pasangSprite(isi);
    bawah.innerHTML = `
      <button class="btn ghost" type="button" data-bp="daftar">☰ Daftar isi</button>
      <span class="bp-navigasi">
        <button class="btn small" type="button" data-bp="${posisi - 1}" ${posisi === 0 ? "disabled" : ""} aria-label="Bab sebelumnya">←</button>
        <button class="btn small primary" type="button" data-bp="${posisi + 1}" ${posisi === d.length - 1 ? "disabled" : ""} aria-label="Bab berikutnya">→</button>
      </span>`;
    isi.scrollTop = 0;
  }

  function buka(id) {
    const d = daftar();
    const target = id === "daftar" ? -1 : d.findIndex((b) => b.id === (id || babSekarang()));
    if (target < 0) gambarDaftar(); else gambarHalaman(target);
    panel.hidden = false;
    sfx("kertas");
    $("#tutupPanduan").focus();
  }
  function tutup() { panel.hidden = true; sfx("klik"); K.segarkanLobi?.(); }
  K.bukaPanduan = buka;

  $("#btnPanduan").addEventListener("click", () => buka());
  $("#tutupPanduan").addEventListener("click", tutup);
  panel.addEventListener("click", (e) => { if (e.target === panel) tutup(); });
  document.addEventListener("keydown", (e) => {
    if (panel.hidden) return;
    if (e.key === "Escape") tutup();
    if (e.key === "ArrowRight" && posisi >= 0) gambarHalaman(posisi + 1);
    if (e.key === "ArrowLeft" && posisi > 0) gambarHalaman(posisi - 1);
  });
  isi.addEventListener("click", (e) => {
    const b = e.target.closest(".bp-bab");
    if (b) { sfx("pilih"); gambarHalaman(Number(b.dataset.i)); }
  });
  bawah.addEventListener("click", (e) => {
    const b = e.target.closest("[data-bp]");
    if (!b || b.disabled) return;
    sfx("kertas");
    if (b.dataset.bp === "daftar") gambarDaftar(); else gambarHalaman(Number(b.dataset.bp));
  });
  // geser kiri/kanan untuk pindah halaman
  let awalX = null;
  isi.addEventListener("pointerdown", (e) => { awalX = e.clientX; });
  isi.addEventListener("pointerup", (e) => {
    if (awalX === null || posisi < 0) return;
    const dx = e.clientX - awalX; awalX = null;
    if (Math.abs(dx) > 70) gambarHalaman(posisi + (dx < 0 ? 1 : -1));
  });
  // tombol "cara main" di mana pun
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-panduan]");
    if (t) buka(t.dataset.panduan);
  });

  /* ---------- tawaran membaca panduan di lobi (kunjungan pertama) ---------- */
  const isiLobiSebelum = K.saatMasuk["s-lobi"];
  K.saatMasuk["s-lobi"] = () => {
    isiLobiSebelum();
    const slot = $("#panduanSlot");
    if (!slot) return;
    if (K.data.panduanDitawari) { slot.innerHTML = ""; return; }
    slot.innerHTML = `
      <section class="tawar-panduan">
        <span class="avatar">${px("kura")}</span>
        <div>
          <p><strong>Pak Satpam:</strong> Siap. Pegawai baru biasanya dapat buku panduan. Tipis. Banyak gambarnya.</p>
          <div class="actions">
            <button class="btn ghost" type="button" id="tolakPanduan">Nanti saja</button>
            <button class="btn primary" type="button" id="terimaPanduan">Baca panduan</button>
          </div>
        </div>
      </section>`;
    const tandai = () => { K.data.panduanDitawari = true; K.simpan(); slot.innerHTML = ""; };
    $("#terimaPanduan").addEventListener("click", () => { tandai(); buka("mulai"); });
    $("#tolakPanduan").addEventListener("click", () => {
      tandai();
      K.memo("Pak Satpam · Keamanan", "Siap. Bukunya ada di tombol Panduan, pojok kanan atas. Kapan saja.");
    });
  };
  if (K.layarAktif() === "s-lobi") K.saatMasuk["s-lobi"]();
})();
