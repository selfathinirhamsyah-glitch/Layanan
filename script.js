/* =========================================================
   Kantor Layanan Perasaan
   Nama bisa diganti di sini, atau lewat URL: ?nama=Mira
   ========================================================= */
const NAMA_DEFAULT = "Mira";

(() => {
  "use strict";

  const params = new URLSearchParams(location.search);
  const NAMA = ((params.get("nama") || "").trim().slice(0, 30)) || NAMA_DEFAULT;
  const KUNCI_SEMANGAT = "klp-semangat";
  const kurangiGerak = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const acak = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const tunggu = (ms) => new Promise((r) => setTimeout(r, kurangiGerak ? Math.min(ms, 300) : ms));
  const N = esc(NAMA);

  // Penyimpanan lokal hanya untuk target Loket C. Dibungkus try/catch karena bisa diblokir.
  const simpan = {
    get() { try { return JSON.parse(localStorage.getItem(KUNCI_SEMANGAT)); } catch { return null; } },
    set(v) { try { localStorage.setItem(KUNCI_SEMANGAT, JSON.stringify(v)); } catch { /* tidak apa-apa */ } },
    hapus() { try { localStorage.removeItem(KUNCI_SEMANGAT); } catch { /* tidak apa-apa */ } },
  };

  /* ---------- Data dasar ---------- */
  const now = new Date();
  const pad = (n, l = 2) => String(n).padStart(l, "0");
  const BULAN = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const tanggalPanjang = (d) => `${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`;
  const ymd = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  const TIKET = `KLP-${ymd}-${pad(Math.floor(Math.random() * 9000) + 1000, 4)}`;
  const ANTREAN = pad(Math.floor(Math.random() * 40) + 1, 3);
  const nomorSurat = (kode) => `${pad(Math.floor(Math.random() * 900) + 100, 3)}/${kode}/KLP/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;

  $$(".nama").forEach((el) => (el.textContent = NAMA));

  /* ---------- Sprite pixel ---------- */
  const px = (nama) => window.SPRITE?.svg(nama) || "";
  // Avatar untuk dokumen unduhan: pakai background PNG karena html2canvas tidak menggambar <img> di sini
  const avatarDok = (nama) => `<span class="cert-avatar" style="background-image:url(${window.SPRITE?.png(nama) || ""})"></span>`;
  function pasangSprite(root = document) {
    $$("[data-sprite]", root).forEach((el) => {
      if (el.classList.contains("petugas")) {
        if (el.querySelector(":scope > .avatar")) return;
        const balon = document.createElement("div");
        balon.className = "petugas-bubble";
        balon.append(...el.childNodes);
        el.append(balon);
        el.insertAdjacentHTML("afterbegin", `<span class="avatar">${px(el.dataset.sprite)}</span>`);
      } else {
        el.innerHTML = px(el.dataset.sprite);
      }
    });
  }
  pasangSprite();
  // Siapa pengirim memo → sprite
  const SPRITE_PENGIRIM = [
    ["Kura", "kura"], ["Kapibara", "kapibara"], ["Resepsionis", "kapibara"], ["Berang", "berang"], ["Singa", "singa"],
    ["Badak", "badak"], ["Burung Hantu", "hantu"], ["Kukang", "kukang"], ["Beruang", "beruang"], ["Gajah", "gajah"],
    ["Rakun", "rakun"], ["Mesin Kopi", "kopi"], ["Kotak Saran", "saran"], ["Tanaman", "tanaman2"],
  ];
  $("#noTiket").textContent = TIKET;
  $("#tglHariIni").textContent = tanggalPanjang(now);
  $("#noAntrean").textContent = ANTREAN;
  $("#noAntrean2").textContent = ANTREAN;
  document.title = `Kantor Layanan Perasaan · ${NAMA}`;

  /* ---------- Navigasi layar ---------- */
  let layarAktif = "s-depan";
  const saatMasuk = {};
  const saatKeluar = {};

  function ke(id) {
    const tujuan = document.getElementById(id);
    if (!tujuan || id === layarAktif) return;
    saatKeluar[layarAktif]?.();
    $$(".screen").forEach((s) => s.classList.toggle("active", s === tujuan));
    document.body.dataset.loket = tujuan.dataset.loket || "umum";
    layarAktif = id;
    window.scrollTo({ top: 0, behavior: kurangiGerak ? "auto" : "smooth" });
    const judul = tujuan.querySelector("h2");
    if (judul) { judul.setAttribute("tabindex", "-1"); judul.focus({ preventScroll: true }); }
    saatMasuk[id]?.();
  }

  document.addEventListener("click", (e) => {
    const go = e.target.closest("[data-go]");
    if (go) ke(go.dataset.go);
    const tutup = e.target.closest("[data-closing]");
    if (tutup) penutup(tutup.dataset.closing);
    const unduh = e.target.closest("[data-download]");
    if (unduh) unduhGambar(unduh.dataset.download, unduh.dataset.file, unduh);
  });

  /* ---------- Memo (toast) ---------- */
  let timerToast;
  function memo(dari, teks, ms = 4800) {
    $("#toastFrom").textContent = dari;
    const sp = SPRITE_PENGIRIM.find(([kata]) => dari.includes(kata));
    $("#toastAvatar").innerHTML = sp ? px(sp[1]) : "";
    $("#toastAvatar").hidden = !sp;
    $("#toastText").textContent = teks;
    const t = $("#toast");
    t.hidden = true; void t.offsetWidth; t.hidden = false;
    clearTimeout(timerToast);
    timerToast = setTimeout(() => (t.hidden = true), ms);
  }
  $("#toast").addEventListener("click", () => ($("#toast").hidden = true));

  /* =========================================================
     0. HALAMAN DEPAN
     ========================================================= */
  $("#btnAmbil").addEventListener("click", () => {
    $("#nomorAntrean").hidden = false;
    $("#btnAmbil").hidden = true;
    $("#btnMasuk").hidden = false;
    $("#btnMasuk").focus();
  });
  $("#btnMasuk").addEventListener("click", () => ke("s-pilih"));

  // Easter egg: cap kantor diketuk 5x
  let ketukCap = 0;
  $("#capKantor").addEventListener("click", (e) => {
    ketukCap++;
    const kertas = e.currentTarget.closest(".paper");
    if (ketukCap < 5) {
      if (ketukCap === 1) memo("Pak Kura-kura · Satpam", "Itu cap resmi. Dilihat saja, ya.");
      return;
    }
    const jumlah = ketukCap === 5 ? 7 : 1;
    for (let i = 0; i < jumlah; i++) {
      const c = document.createElement("span");
      c.className = "cap-cetak";
      c.textContent = "KLP";
      c.style.left = `${8 + Math.random() * 78}%`;
      c.style.top = `${10 + Math.random() * 75}%`;
      c.style.setProperty("--r", `${Math.round(Math.random() * 60 - 30)}deg`);
      c.style.animationDelay = `${i * 90}ms`;
      kertas.appendChild(c);
    }
    if (ketukCap === 5) memo("Pak Kura-kura · Satpam", "Mohon jangan main cap, itu inventaris negara. ...Ya sudah, satu lagi boleh.");
    if (ketukCap === 9) memo("Pak Kura-kura · Satpam", "Saya pura-pura tidak lihat. Tapi besok tintanya Anda yang beli.");
  });

  // Arsip semangat dari kunjungan sebelumnya
  function tampilkanArsip() {
    const data = simpan.get();
    const box = $("#arsipSemangat");
    if (!data || data.selesai) { box.hidden = true; return; }
    const tgl = new Date(data.waktu);
    box.innerHTML = `
      <p class="mono small" style="color:var(--green)">ARSIP TERBUKA · LOKET C</p>
      <p>Izin Resmi untuk Jadi Hebat dengan target <strong>"${esc(data.target)}"</strong> masih terbuka sejak ${esc(tanggalPanjang(tgl))}. Kak Badak menunggu kabar.</p>
      <div class="actions">
        <button class="btn primary" type="button" id="arsipSelesai">Saya sudah selesai</button>
        <button class="btn ghost" type="button" id="arsipNanti">Belum, nanti lagi</button>
      </div>`;
    box.hidden = false;
    $("#arsipSelesai").addEventListener("click", () => tuntas(data.target));
    $("#arsipNanti").addEventListener("click", () => {
      box.hidden = true;
      memo("Kak Badak · Loket C", "Tidak apa-apa. Berkasnya saya taruh di laci. Laci ini tidak punya deadline.");
    });
  }
  tampilkanArsip();

  /* =========================================================
     1. RUANG TUNGGU: PILIH LOKET (+ Loket D tersembunyi)
     ========================================================= */
  let timerD, raguHitung = 0, terakhirDisorot = null;
  function bukaLoketD() {
    if (!$("#loketD").hidden) return;
    $("#loketD").hidden = false;
    $("#hintD").hidden = false;
    clearTimeout(timerD);
  }
  saatMasuk["s-pilih"] = () => {
    raguHitung = 0; terakhirDisorot = null;
    clearTimeout(timerD);
    timerD = setTimeout(bukaLoketD, 10000);
  };
  saatKeluar["s-pilih"] = () => clearTimeout(timerD);

  $$(".loket-card").forEach((card) => {
    const ragu = () => {
      if (terakhirDisorot && terakhirDisorot !== card) raguHitung++;
      terakhirDisorot = card;
      if (raguHitung >= 5) bukaLoketD();
    };
    card.addEventListener("pointerenter", ragu);
    card.addEventListener("focus", ragu);
    card.addEventListener("click", () => {
      const to = card.dataset.to;
      if (to === "a") ke("s-a-form");
      if (to === "b") ke("s-b-form");
      if (to === "c") ke("s-c-form");
      if (to === "d") mulaiDiagnosis();
    });
  });

  /* =========================================================
     LOKET A: KELUHAN
     ========================================================= */
  const CAPEK = [
    null,
    { label: "Masih bisa senyum (agak dipaksa)", note: "Tercatat. Senyumnya boleh dilepas kalau pegal.", balas: "Kami menghargai Anda masih tersenyum. Tapi untuk dicatat: tidak wajib, ya." },
    { label: "Senyum sudah mode hemat", note: "Tercatat. Senyum hemat tetap senyum, tapi tidak ada kewajiban.", balas: "Senyum mode hemat sudah kami terima. Sisa energinya silakan disimpan untuk diri sendiri." },
    { label: "Mode hemat baterai", note: "Tercatat. Lampu-lampu yang tidak perlu sudah kami matikan.", balas: "Mode hemat baterai adalah keputusan yang bijak. Kantor tidak akan meminta Anda menyala lebih terang." },
    { label: "Baterai 1%, jangan diajak ngobrol panjang", note: "Tercatat. Kami akan bicara singkat-singkat.", balas: "Mengingat baterai Anda 1%, surat ini kami usahakan pendek. Sisanya silakan dibaca sambil rebahan. Posisi ini sah secara administrasi." },
    { label: "Sudah jadi kasur", note: "Tercatat. Mohon tidak berdiri terlalu cepat.", balas: "Petugas kami menyarankan Anda membaca sisa surat ini sambil rebahan. Karena Anda sudah jadi kasur, ini seharusnya mudah." },
  ];

  const KELUHAN = {
    tugas: {
      nama: "Tugas",
      balas: [
        `Keluhan terhadap pihak "Tugas" telah kami terima. Pihak tersebut kami catat sebagai <strong>pihak yang terlalu banyak menuntut</strong> dan sudah kami tegur secara tertulis. Dengan ini Anda diberi izin resmi untuk mengerjakannya satu per satu, bukan semuanya sekaligus.`,
        `Kami sudah memeriksa tumpukan tugas Anda. Tingginya memang melewati standar keselamatan kerja. Pihak "Tugas" resmi tercatat sebagai <strong>pihak yang terlalu banyak menuntut</strong>. Anda diizinkan mengerjakannya satu per satu. Deadline tetap ada, tapi kami sudah menyampaikan bahwa ia kurang sopan.`,
      ],
    },
    latihan: {
      nama: "Latihan",
      balas: [
        `Berdasarkan pemeriksaan berkas, Anda terbukti sudah bekerja keras. Badan dan pikiran Anda tercatat sebagai dua pegawai yang belum mengambil cuti. Keduanya <strong>berhak istirahat</strong>. Itu bukan malas, itu prosedur perawatan.`,
        `Capek setelah latihan adalah bukti sah bahwa latihannya benar-benar terjadi. Kantor mengakui kerja keras Anda, termasuk bagian yang tidak dilihat siapa-siapa. Badan dan pikiran Anda <strong>berhak istirahat</strong>, tanpa perlu izin tambahan.`,
      ],
    },
    teman: {
      nama: "Teman",
      balas: [
        `Perasaan Anda sah, walaupun situasinya rumit. Kantor kami tidak memihak siapa pun dan tidak menilai siapa yang salah. Kami hanya mencatat bahwa Anda sedang tidak nyaman, dan <strong>itu cukup untuk dianggap penting</strong>.`,
        `Urusan antar-teman memang termasuk berkas yang paling susah diarsipkan. Kami tidak akan menyalahkan siapa-siapa. Yang kami catat: Anda sedang merasa berat, dan <strong>perasaan itu boleh ada</strong>. Tidak harus beres hari ini.`,
      ],
    },
    lainnya: { nama: "Lainnya" },
    nggaktahu: {
      nama: "Nggak tahu, cuma lagi pengen aja",
      balas: [
        `Capek dan sedih <strong>tidak memerlukan alasan resmi</strong>. Tidak perlu surat pengantar, tidak perlu fotokopi KTP, tidak perlu bisa menjelaskan. Keluhan Anda langsung disetujui tanpa antre.`,
      ],
    },
  };

  const KOMPENSASI = [
    { nama: "Izin Resmi Rebahan 30 Menit", ket: "Tidak perlu merasa bersalah. Sudah ditandatangani." },
    { nama: "Voucher Marah-Marah ke Bantal", ket: "Berlaku 1x. Bantal sudah diberi tahu dan bersedia." },
    { nama: "Surat Keterangan Sudah Berusaha Cukup Keras Hari Ini", ket: "Berlaku sampai besok, bisa diperpanjang." },
    { nama: "Kupon Tidak Membalas Chat Selama 1 Jam", ket: "Kecuali chat dari ibu. Itu di luar wewenang kami." },
    { nama: "Izin Makan Enak Tanpa Alasan", ket: "Alasan sudah disediakan kantor: karena mau." },
    { nama: "Surat Dispensasi Produktivitas", ket: "Hari ini dihitung hadir walau cuma rebahan." },
    { nama: "Sertifikat Boleh Tidur Lebih Awal", ket: "Tidak perlu menunggu \"setelah satu hal lagi\"." },
    { nama: "Tiket Mandi Air Hangat Agak Lama", ket: "Durasi tidak diawasi. Lampu kamar mandi boleh tetap nyala." },
  ];

  const keluhan = { kat: [], lainnya: "", capek: 3, adaUraian: false };

  // Kolom "Lainnya"
  $("#katLainnya").addEventListener("change", (e) => {
    $("#lainnyaWrap").hidden = !e.target.checked;
    if (e.target.checked) $("#lainnyaText").focus();
  });

  // Slider
  const slider = $("#capek");
  function updateCapek() {
    const v = Number(slider.value);
    const lbl = $("#capekLabel");
    lbl.textContent = CAPEK[v].label;
    lbl.classList.remove("ganti"); void lbl.offsetWidth; lbl.classList.add("ganti");
    $("#capekNote").textContent = CAPEK[v].note;
    slider.setAttribute("aria-valuetext", CAPEK[v].label);
  }
  slider.addEventListener("input", updateCapek);
  updateCapek();

  $("#formKeluhan").addEventListener("change", () => ($("#errKat").hidden = true));

  $("#formKeluhan").addEventListener("submit", (e) => {
    e.preventDefault();
    keluhan.kat = $$('input[name="kat"]:checked').map((i) => i.value);
    if (!keluhan.kat.length) { $("#errKat").hidden = false; $("#errKat").scrollIntoView({ block: "center", behavior: "smooth" }); return; }
    keluhan.lainnya = $("#lainnyaText").value.trim();
    keluhan.capek = Number(slider.value);
    keluhan.adaUraian = $("#uraian").value.trim().length > 0;
    // Uraian tidak disimpan ke variabel mana pun, hanya dicek ada/tidaknya.

    susunBalasan();
    if (keluhan.kat.includes("nggaktahu")) {
      // Jalur prioritas: langsung disetujui tanpa antre.
      ke("s-a-balasan");
      memo("Bu Kapibara · Loket A", "Berkas ini tidak perlu antre. Saya sudah berdiri dari kursi, itu artinya serius.");
    } else {
      ke("s-a-proses");
    }
  });

  // Proses birokrasi
  let prosesJalan = 0;
  saatMasuk["s-a-proses"] = async () => {
    const id = ++prosesJalan;
    const stage = $("#stageA");
    const log = $("#logA");
    stage.className = "stage";
    log.innerHTML = "";
    const langkah = [
      ["s1", "Berkas diterima oleh Bu Kapibara.", 1300],
      ["s2", "Berkas dicap. Tok.", 1300],
      ["s3", "Difotokopi rangkap tiga oleh Mas Kukang. Mohon maklum, beliau kukang.", 2200],
      ["s4", "Fotokopian dibawa ke ruang rapat.", 1500],
      ["s5", "Rapat selesai. Semua peserta setuju: keluhan Anda valid.", 1300],
    ];
    if (keluhan.capek >= 4) langkah.splice(3, 0, ["s3", "Catatan: tingkat capek tinggi. Mas Kukang diminta jalan lebih cepat. Beliau menolak, tapi sopan.", 1700]);
    if (keluhan.kat.length > 1) langkah.splice(1, 0, ["s1", "Terdeteksi keluhan berlapis. Kopi tambahan dipesan.", 1300]);

    for (const [cls, teks, ms] of langkah) {
      if (id !== prosesJalan) return;
      log.querySelector("li:last-child")?.classList.add("done");
      const li = document.createElement("li");
      li.textContent = teks;
      log.appendChild(li);
      stage.classList.add(cls);
      await tunggu(ms);
    }
    if (id !== prosesJalan) return;
    log.querySelector("li:last-child")?.classList.add("done");
    await tunggu(700);
    if (id === prosesJalan && layarAktif === "s-a-proses") ke("s-a-balasan");
  };
  saatKeluar["s-a-proses"] = () => { prosesJalan++; };
  $("#skipA").addEventListener("click", () => {
    memo("Mas Kukang · Bagian Fotokopi", "Baik. Saya fotokopi besok saja. Atau lusa.");
    ke("s-a-balasan");
  });

  function susunBalasan() {
    const k = keluhan.kat;
    const isi = [];
    const bagian = [];

    k.forEach((kode) => {
      if (kode === "lainnya") {
        bagian.push(keluhan.lainnya
          ? `Kategori "<strong>${esc(keluhan.lainnya)}</strong>" belum ada di sistem kami, tapi sudah kami tambahkan secara manual pakai pulpen. Keluhan ini tetap diproses dengan prioritas penuh dan tidak dianggap remeh.`
          : `Kategori "Lainnya" kami terima walaupun tidak dijelaskan. Kami paham, kadang memang susah dijelaskan, dan itu tidak mengurangi nilainya.`);
      } else {
        bagian.push(acak(KELUHAN[kode].balas));
      }
    });

    if (k.length > 1) {
      isi.push(`<p>Kami mendeteksi <strong>keluhan berlapis</strong>. Mohon jangan khawatir, kami sudah memesan kopi tambahan. Berikut tanggapan untuk masing-masing lapisan:</p>`);
      isi.push(`<ol>${bagian.map((b) => `<li>${b}</li>`).join("")}</ol>`);
    } else {
      isi.push(`<p>Sehubungan dengan keluhan yang Anda ajukan hari ini, dengan ini kami sampaikan:</p>`);
      isi.push(`<p>${bagian[0]}</p>`);
    }

    isi.push(`<p>${CAPEK[keluhan.capek].balas}</p>`);
    isi.push(`<p class="catatan">${keluhan.adaUraian
      ? "Uraian keluhan Anda sudah dibaca oleh layar ini saja, lalu dilipat rapi. Tidak disimpan, tidak dikirim. Terima kasih sudah menuliskannya."
      : "Kolom uraian dibiarkan kosong. Itu juga boleh. Kadang capek memang tidak muat di kolom."}</p>`);

    $("#balasanA").innerHTML = isi.join("");
    $("#noSuratA").textContent = `No. ${nomorSurat("KEL")}`;
    $("#stampTanpaSyarat").hidden = !k.includes("nggaktahu");

    // reset kompensasi
    $("#sertifikatAWrap").hidden = true;
    $("#kompenBack").hidden = false;
    $("#undianWindow").textContent = "— — —";
    $$(".kompen").forEach((b) => b.classList.remove("terpilih"));
  }

  // Kompensasi
  const grid = $("#kompenGrid");
  grid.innerHTML = KOMPENSASI.map((k, i) => `<button class="kompen" type="button" data-i="${i}"><strong>${esc(k.nama)}</strong><small>${esc(k.ket)}</small></button>`).join("");
  grid.addEventListener("click", (e) => {
    const b = e.target.closest(".kompen");
    if (b) pilihKompensasi(Number(b.dataset.i));
  });

  let sedangUndi = false;
  $("#btnUndi").addEventListener("click", async () => {
    if (sedangUndi) return;
    sedangUndi = true;
    const win = $("#undianWindow");
    win.classList.add("berputar");
    let i = Math.floor(Math.random() * KOMPENSASI.length);
    const putaran = kurangiGerak ? 1 : 14;
    for (let n = 0; n < putaran; n++) {
      i = (i + 1 + Math.floor(Math.random() * 3)) % KOMPENSASI.length;
      win.textContent = KOMPENSASI[i].nama;
      await new Promise((r) => setTimeout(r, 60 + n * 14));
    }
    win.classList.remove("berputar");
    sedangUndi = false;
    pilihKompensasi(i);
  });

  function pilihKompensasi(i) {
    const k = KOMPENSASI[i];
    $("#undianWindow").textContent = k.nama;
    $$(".kompen").forEach((b) => b.classList.toggle("terpilih", Number(b.dataset.i) === i));
    const kat = keluhan.kat.map((c) => (c === "lainnya" && keluhan.lainnya ? keluhan.lainnya : KELUHAN[c].nama)).join(", ");
    $("#sertifikatA").dataset.accent = "A";
    $("#sertifikatA").innerHTML = `
      <div class="cert-head">
        <p class="cert-org">Kantor Layanan Perasaan · Loket A</p>
        <p class="cert-title">Surat Kompensasi Resmi</p>
        <p class="cert-no">No. ${esc(nomorSurat("KOMP"))} · Tiket ${esc(TIKET)}</p>
      </div>
      <dl>
        <div class="cert-row"><dt>Diberikan kepada</dt><dd><strong>${N}</strong></dd></div>
        <div class="cert-row"><dt>Atas keluhan</dt><dd>${esc(kat)}</dd></div>
        <div class="cert-row"><dt>Tingkat capek</dt><dd>${keluhan.capek}/5 · ${esc(CAPEK[keluhan.capek].label)}</dd></div>
        <div class="cert-row"><dt>Kompensasi</dt><dd class="cert-big">${esc(k.nama)}</dd></div>
        <div class="cert-row"><dt>Keterangan</dt><dd>${esc(k.ket)}</dd></div>
        <div class="cert-row"><dt>Masa berlaku</dt><dd>Hari ini, sampai ${N} merasa cukup.</dd></div>
      </dl>
      <div class="cert-foot">
        <div>
          <svg class="ttd-coret" viewBox="0 0 160 50" aria-hidden="true"><path d="M8 34c14-22 22-24 24-8s6 18 14 0 12-16 16 2 10 12 20-4 16-10 22 6 12 8 22-2 14-6 26-4"/></svg>
          <p>${avatarDok("kapibara")}<strong>Bu Kapibara</strong><br>Petugas Loket A · ${esc(tanggalPanjang(now))}</p>
        </div>
        <div class="stamp">Sah &amp;<br>berlaku</div>
      </div>`;
    $("#sertifikatAWrap").hidden = false;
    $("#kompenBack").hidden = true;
    setTimeout(() => $("#sertifikatAWrap").scrollIntoView({ behavior: kurangiGerak ? "auto" : "smooth", block: "start" }), 60);
  }

  /* =========================================================
     LOKET B: KABAR BAIK
     ========================================================= */
  const KABAR = {
    tugas: { nama: "Tugas beres", umum: "Perhatian. Sebuah tugas telah diselesaikan. Tugas yang bersangkutan dilaporkan kaget." },
    latihan: { nama: "Latihan lancar", umum: "Perhatian. Latihan hari ini berjalan lancar. Badan ${N} mengirim surat terima kasih. Tulisannya jelek, maklum, habis latihan." },
    teman: { nama: "Momen seru bareng teman", umum: "Perhatian. Telah terjadi momen seru bareng teman. Momen ini diarsipkan di lemari paling aman, yang kuncinya tidak hilang." },
    kecil: { nama: "Hal kecil yang bikin senyum", umum: "Perhatian. Hal kecil yang bikin senyum terdeteksi. Hal tersebut resmi dinaikkan pangkatnya menjadi hal penting." },
    seneng: { nama: "Pokoknya lagi seneng aja", umum: "Perhatian. ${N} sedang senang tanpa alasan. Ini jenis senang paling langka. Seluruh pegawai dimohon berdiri. ...Silakan duduk kembali." },
  };
  const PESERTA = [
    ["berang", "Bang Berang-berang (pemimpin rapat, sudah rapi)"],
    ["singa", "Pak Singa (bagian pengumuman, suaranya memang begitu)"],
    ["kukang", "Mas Kukang (masih di jalan menuju kursi)"],
    ["tanaman2", "Pak Lidah Mertua (hadir sebagai tanaman)"],
  ];
  const kabar = { kat: [], adaCerita: false };

  $("#formKabar").addEventListener("change", () => ($("#errKb").hidden = true));
  $("#formKabar").addEventListener("submit", (e) => {
    e.preventDefault();
    kabar.kat = $$('input[name="kb"]:checked').map((i) => i.value);
    if (!kabar.kat.length) { $("#errKb").hidden = false; return; }
    kabar.adaCerita = $("#ceritaB").value.trim().length > 0;
    ke("s-b-proses");
  });

  let rayaJalan = 0;
  saatMasuk["s-b-proses"] = async () => {
    const id = ++rayaJalan;
    const ok = () => id === rayaJalan;
    ["#rapatB", "#paB", "#stampHariBaik", "#btnPiagam"].forEach((s) => ($(s).hidden = true));
    $("#pesertaB").innerHTML = "";
    $("#paText").textContent = "";
    $("#paText").classList.remove("selesai");

    await tunggu(400); if (!ok()) return;
    $("#rapatB").hidden = false;
    for (const [sp, teks] of PESERTA) {
      await tunggu(550); if (!ok()) return;
      const li = document.createElement("li");
      li.innerHTML = `<span class="avatar avatar-sm">${px(sp)}</span><span>${esc(teks)}</span>`;
      $("#pesertaB").appendChild(li);
    }
    await tunggu(900); if (!ok()) return;

    $("#paB").hidden = false;
    $("#paB").classList.add("bunyi");
    const kalimat = ["TING-TONG.", ...kabar.kat.map((k) => KABAR[k].umum.replaceAll("${N}", NAMA)), "Demikian pengumuman ini. Harap ikut senang."];
    await ketik($("#paText"), kalimat.join("\n"), ok);
    if (!ok()) return;
    $("#paText").classList.add("selesai");
    $("#paB").classList.remove("bunyi");

    await tunggu(500); if (!ok()) return;
    $("#stampHariBaik").hidden = false;
    konfetiKertas();
    await tunggu(900); if (!ok()) return;
    $("#btnPiagam").hidden = false;
  };
  saatKeluar["s-b-proses"] = () => { rayaJalan++; };

  async function ketik(el, teks, ok) {
    if (kurangiGerak) { el.textContent = teks; return; }
    el.textContent = "";
    for (let i = 0; i < teks.length; i++) {
      if (!ok()) return;
      el.textContent += teks[i];
      const c = teks[i];
      await new Promise((r) => setTimeout(r, c === "\n" ? 380 : c === "." ? 160 : 22));
    }
  }

  $("#btnPiagam").addEventListener("click", () => {
    const kat = kabar.kat.map((k) => KABAR[k].nama).join(", ");
    $("#piagamB").dataset.accent = "B";
    $("#piagamB").innerHTML = `
      <div class="cert-head">
        <p class="cert-org">Kantor Layanan Perasaan · Loket B</p>
        <p class="cert-title">Piagam Hari Baik</p>
        <p class="cert-no">No. ${esc(nomorSurat("HB"))} · Tiket ${esc(TIKET)}</p>
      </div>
      <p>Dengan ini kantor mencatat bahwa pada tanggal <strong>${esc(tanggalPanjang(now))}</strong>, <strong>${N}</strong> telah mengalami hari baik dalam kategori:</p>
      <p class="cert-big">${esc(kat)}</p>
      <dl>
        <div class="cert-row"><dt>Isi cerita</dt><dd>${kabar.adaCerita ? `Dirahasiakan, karena itu milik ${N}.` : "Tidak dilampirkan. Kantor tetap percaya sepenuhnya."}</dd></div>
        <div class="cert-row"><dt>Disimpan di</dt><dd>Lemari arsip "Jangan Dibuang", rak paling atas.</dd></div>
        <div class="cert-row"><dt>Catatan</dt><dd>Hari ini boleh diingat-ingat lagi kapan saja dibutuhkan.</dd></div>
      </dl>
      <div class="cert-foot">
        <div>
          <svg class="ttd-coret" viewBox="0 0 160 50" aria-hidden="true"><path d="M10 30c10-16 18-20 22-6s10 10 16-6 14-8 18 6 12 4 20-10 16 2 22 8 16-4 24-2"/></svg>
          <p>${avatarDok("berang")}${avatarDok("singa")}<strong>Bang Berang-berang</strong><br>Petugas Loket B · diumumkan oleh Pak Singa</p>
        </div>
        <div class="stamp">Hari<br>baik</div>
      </div>`;
    ke("s-b-piagam");
  });

  function konfetiKertas() {
    if (kurangiGerak) return;
    const wadah = $("#confetti");
    const jumlah = innerWidth < 500 ? 32 : 48;
    const jenis = ["", "", "polos", "kotak"];
    for (let i = 0; i < jumlah; i++) {
      const s = document.createElement("span");
      s.className = `sobekan ${acak(jenis)}`;
      s.style.left = `${Math.random() * 100}vw`;
      s.style.setProperty("--w", `${8 + Math.random() * 12}px`);
      s.style.setProperty("--h", `${12 + Math.random() * 16}px`);
      s.style.setProperty("--x", `${Math.round(Math.random() * 120 - 60)}px`);
      s.style.setProperty("--r", `${Math.round(Math.random() * 720 - 360)}deg`);
      s.style.setProperty("--d", `${3 + Math.random() * 2.5}s`);
      s.style.setProperty("--delay", `${Math.random() * .9}s`);
      wadah.appendChild(s);
      s.addEventListener("animationend", () => s.remove());
    }
  }

  /* =========================================================
     LOKET C: SEMANGAT
     ========================================================= */
  const TIPS = {
    umum: [
      "Minum air dulu. Ini bukan saran, ini peraturan.",
      "Mulai dari lima menit pertama saja. Sisanya biasanya ikut sendiri.",
      "Taruh HP agak jauh. HP tidak akan tersinggung.",
      "Kerjakan bagian yang paling gampang dulu. Ini namanya strategi, bukan curang.",
      "Makan dulu. Semangat tanpa makan itu ilegal di kantor ini.",
      "Kalau mentok, berdiri, jalan ke dapur, lalu kembali. Prosedur ini sudah diuji Mas Kukang.",
    ],
    tugas: [
      "Buka filenya dulu. Membuka file sudah dihitung sebagai mulai.",
      "Pecah tugasnya jadi potongan kecil. Tugas besar takut kalau dipotong-potong.",
    ],
    latihan: [
      "Pemanasan dulu. Badan Anda bukan mesin fotokopi, tidak bisa langsung panas. (Mesin fotokopi kami juga tidak bisa.)",
      "Bawa air minum. Kak Badak akan memeriksa. Kak Badak tidak bercanda soal ini.",
    ],
  };
  const semangat = { kode: "", target: "" };

  $$('input[name="target"]').forEach((r) => r.addEventListener("change", () => {
    $("#errTarget").hidden = true;
    $("#targetWrap").hidden = !$("#targetSendiri").checked;
    if ($("#targetSendiri").checked) $("#targetText").focus();
  }));

  $("#formSemangat").addEventListener("submit", (e) => {
    e.preventDefault();
    const r = $('input[name="target"]:checked');
    if (!r) { $("#errTarget").hidden = false; return; }
    semangat.kode = r.value;
    if (r.value === "sendiri") {
      semangat.target = $("#targetText").value.trim();
      if (!semangat.target) { $("#errTarget").textContent = "Targetnya ditulis dulu, singkat saja. Kak Badak tidak bisa menebak."; $("#errTarget").hidden = false; return; }
    } else {
      semangat.target = r.value === "tugas" ? "Tugas" : "Latihan";
    }

    const tips = acak([...TIPS.umum, ...(TIPS[semangat.kode] || []), ...(TIPS[semangat.kode] || [])]);
    $("#tipsC").textContent = `"${tips}"`;
    $("#izinC").dataset.accent = "C";
    $("#izinC").innerHTML = `
      <div class="cert-head">
        <p class="cert-org">Kantor Layanan Perasaan · Loket C</p>
        <p class="cert-title">Izin Resmi untuk Jadi Hebat Hari Ini</p>
        <p class="cert-no">No. ${esc(nomorSurat("SMG"))} · Tiket ${esc(TIKET)}</p>
      </div>
      <dl>
        <div class="cert-row"><dt>Pemegang izin</dt><dd><strong>${N}</strong></dd></div>
        <div class="cert-row"><dt>Target</dt><dd class="cert-big">${esc(semangat.target)}</dd></div>
        <div class="cert-row"><dt>Berlaku</dt><dd>${esc(tanggalPanjang(now))}, dengan jeda istirahat yang wajib diambil.</dd></div>
        <div class="cert-row"><dt>Wewenang</dt><dd>Pemegang izin boleh fokus, boleh menolak gangguan, dan boleh bangga sedikit setelahnya.</dd></div>
        <div class="cert-row"><dt>Peraturan</dt><dd>${esc(tips)}</dd></div>
      </dl>
      <div class="cert-foot">
        <div>
          <svg class="ttd-coret" viewBox="0 0 160 50" aria-hidden="true"><path d="M6 36l18-26 6 26 14-22 4 22 20-18c6-4 10 14 22 4s14-10 30-6"/></svg>
          <p>${avatarDok("badak")}<strong>Kak Badak</strong><br>Petugas Izin Semangat</p>
        </div>
        <div class="stamp">Berlaku</div>
      </div>`;

    simpan.set({ target: semangat.target, waktu: Date.now(), selesai: false });
    ke("s-c-izin");
  });

  $("#btnTuntasSekarang").addEventListener("click", () => tuntas(semangat.target));

  let setelahTuntas = null;
  function tuntas(target) {
    simpan.hapus();
    $("#arsipSemangat").hidden = true;
    $("#tuntasText").innerHTML = `Target <strong>"${esc(target)}"</strong> resmi dicap TUNTAS. Kak Badak mengangguk pelan. Itu bentuk pujian tertinggi dari Kak Badak.`;
    $("#overlayTuntas").hidden = false;
    $("#btnTutupTuntas").focus();
    setelahTuntas = () => penutup("C-tuntas");
  }
  $("#btnTutupTuntas").addEventListener("click", () => {
    $("#overlayTuntas").hidden = true;
    setelahTuntas?.();
    setelahTuntas = null;
  });

  /* =========================================================
     LOKET D: DIAGNOSIS
     ========================================================= */
  const PERTANYAAN = [
    {
      t: "Kalau hari ini makanan, kamu makanan apa?",
      o: [["Kerupuk yang sudah melempem", "a"], ["Martabak manis, bagian pinggirnya", "b"], ["Nasi padang porsi kuli", "c"], ["Air putih. Hambar tapi aman", "a"]],
    },
    {
      t: "Kalau perasaanmu ramalan cuaca, bunyinya apa?",
      o: [["Mendung, kemungkinan rebahan 80%", "a"], ["Cerah berawan, cocok jemur baju", "b"], ["Panas terik, siap membakar target", "c"], ["Berkabut. Kantor juga tidak bisa lihat", "a"]],
    },
    {
      t: "Kalau kamu salah satu pegawai kantor ini, kamu siapa?",
      o: [["Mas Kukang: pelan, tapi sampai", "a"], ["Bang Berang-berang: lagi main air", "b"], ["Kak Badak: minggir, saya lewat", "c"], ["Pak Kura-kura: masuk cangkang dulu", "a"]],
    },
  ];
  const HASIL = {
    a: { loket: "A", layar: "s-a-form", judul: "Loket A · Mengajukan Keluhan", teks: "Hasil diagnosis menunjukkan Anda sedang membawa sesuatu yang agak berat. Belum tentu tahu namanya, dan tidak harus. Loket A siap menerima, tanpa syarat." },
    b: { loket: "B", layar: "s-b-form", judul: "Loket B · Melaporkan Kabar Baik", teks: "Hasil diagnosis menunjukkan ada sesuatu yang menyenangkan di dalam sana, walaupun mungkin masih malu-malu. Loket B ingin mendengarnya." },
    c: { loket: "C", layar: "s-c-form", judul: "Loket C · Mendaftarkan Semangat", teks: "Hasil diagnosis menunjukkan ada tenaga yang siap dipakai. Kak Badak sudah berdiri dan merapikan meja." },
  };

  let skor, nomorTanya;
  function mulaiDiagnosis() {
    skor = { a: 0, b: 0, c: 0 };
    nomorTanya = 0;
    $("#dBack").hidden = false;
    ke("s-d");
    tampilPertanyaan();
  }
  function tampilPertanyaan() {
    const q = PERTANYAAN[nomorTanya];
    $("#diagnosis").innerHTML = `
      <div class="tanya">
        <p class="tanya-no">PERTANYAAN ${nomorTanya + 1} DARI ${PERTANYAAN.length}</p>
        <h3>${esc(q.t)}</h3>
        <div class="opsi">${q.o.map(([teks, k]) => `<button type="button" data-k="${k}">${esc(teks)}</button>`).join("")}</div>
      </div>`;
  }
  $("#diagnosis").addEventListener("click", (e) => {
    const b = e.target.closest(".opsi button");
    if (!b) return;
    skor[b.dataset.k]++;
    nomorTanya++;
    if (nomorTanya < PERTANYAAN.length) { tampilPertanyaan(); return; }

    // Seri dianggap A: kalau ragu, kantor memilih yang paling lembut.
    const urut = ["a", "b", "c"].sort((x, y) => skor[y] - skor[x]);
    const terbaik = skor[urut[0]] === skor[urut[1]] ? "a" : urut[0];
    const h = HASIL[terbaik];
    $("#diagnosis").innerHTML = `
      <div class="hasil-diagnosis">
        <p class="mono">HASIL DIAGNOSIS (TIDAK ILMIAH)</p>
        <p>${esc(h.teks)}</p>
        <p class="muted small">Diagnosis ini bisa salah. Mbak Burung Hantu cuma burung. Anda tetap boleh pilih loket mana saja.</p>
        <div class="actions">
          <button class="btn ghost" type="button" data-go="s-pilih">Pilih loket sendiri</button>
          <button class="btn primary" type="button" data-go="${h.layar}">Ke ${esc(h.judul)} →</button>
        </div>
      </div>`;
    $("#dBack").hidden = true;
  });

  /* =========================================================
     PENUTUP
     ========================================================= */
  const MEMO = {
    A: `${NAMA}, kamu nggak harus langsung semangat lagi hari ini. Pelan-pelan aja, satu-satu. Dan sekadar info: ada yang peduli sama kamu, makanya kantor ini dibuka.`,
    B: `Senang sekali dengar kabar ini, ${NAMA}. Simpan baik-baik rasanya, kamu pantas dapat hari seperti ini. Ada yang ikut senang di sini, sungguh.`,
    C: `Semoga lancar, ${NAMA}. Jangan lupa istirahat di tengah jalan. Selesai atau belum, usahamu hari ini tetap dihitung, dan ada yang bangga sama kamu.`,
    "C-tuntas": `Selamat, ${NAMA}. Itu bukan hal kecil, jadi jangan dikecilkan. Sekarang istirahat dulu, kamu sudah dapat izinnya.`,
  };
  function penutup(jenis) {
    $("#memoKepala").textContent = MEMO[jenis] || MEMO.A;
    $("#penutupBadge").textContent = jenis.startsWith("C") ? "Loket C" : `Loket ${jenis}`;
    ke("s-penutup");
  }
  $("#btnRuangTunggu").addEventListener("click", () => {
    resetFormulir();
    ke("s-pilih");
  });
  function resetFormulir() {
    ["#formKeluhan", "#formKabar", "#formSemangat"].forEach((f) => $(f).reset());
    $("#lainnyaWrap").hidden = true;
    $("#targetWrap").hidden = true;
    $("#errTarget").textContent = "Pilih satu target dulu. Kak Badak butuh tahu harus menyeruduk ke arah mana.";
    updateCapek();
  }

  /* =========================================================
     UNDUH GAMBAR (html2canvas)
     ========================================================= */
  async function unduhGambar(id, namaFile, tombol) {
    const el = document.getElementById(id);
    if (!window.html2canvas) { memo("Bang Rakun · Teknisi", "Mesin pemindai belum siap. Coba lagi sebentar, atau pastikan internet nyala."); return; }
    const teksAsli = tombol.textContent;
    tombol.disabled = true;
    tombol.textContent = "Sedang dipindai…";
    try {
      await document.fonts?.ready;
      const canvas = await html2canvas(el, { scale: Math.min(3, Math.max(2, devicePixelRatio || 1)), backgroundColor: "#FFFDF6", useCORS: true, logging: false });
      const url = canvas.toDataURL("image/png");
      const file = `${namaFile}-${NAMA.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;
      const iOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
      if (iOS) {
        $("#gambarHasil").src = url;
        $("#overlayGambar").hidden = false;
      } else {
        const a = document.createElement("a");
        a.href = url; a.download = file;
        document.body.appendChild(a); a.click(); a.remove();
        memo("Mas Kukang · Bagian Fotokopi", "Sudah saya fotokopi. Cepat, kan? Jangan dibiasakan.");
      }
    } catch (err) {
      memo("Bang Rakun · Teknisi", "Mesin pemindai macet. Untuk sementara, silakan screenshot saja. Sama sahnya.");
    } finally {
      tombol.disabled = false;
      tombol.textContent = teksAsli;
    }
  }
  $("#btnTutupGambar").addEventListener("click", () => ($("#overlayGambar").hidden = true));
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    $("#overlayGambar").hidden = true;
    if (!$("#overlayTuntas").hidden) $("#btnTutupTuntas").click();
  });

  /* =========================================================
     FASILITAS RUANG TUNGGU (easter egg)
     ========================================================= */
  function goyang(btn) { btn.classList.remove("goyang"); void btn.offsetWidth; btn.classList.add("goyang"); }

  // Tanaman
  let siram = 0;
  const PESAN_TANAMAN = [
    "Pak Lidah Mertua menerima air. Satu daun sedikit tegak.",
    "Pak Lidah Mertua terlihat mempertimbangkan untuk hidup lebih semangat.",
    "Daun ketiga mulai ikut. Pelan, tapi ikut.",
    "Pak Lidah Mertua sudah hampir tegak. Hampir.",
  ];
  $("#fasTanaman").addEventListener("click", (e) => {
    siram++;
    $("#fasTanaman .fas-sprite").innerHTML = px(siram >= 5 ? "tanaman2" : siram >= 2 ? "tanaman1" : "tanaman0");
    goyang(e.currentTarget);
    if (siram < 5) memo("Ruang Tunggu · Tanaman", PESAN_TANAMAN[siram - 1]);
    else if (siram === 5) memo("Pak Lidah Mertua · Tanaman Kantor", "Terima kasih. Ternyata disiram sedikit-sedikit juga cukup.", 6000);
    else memo("Pak Lidah Mertua · Tanaman Kantor", acak(["Sudah cukup, nanti saya kembung.", "Saya sudah segar. Giliran Anda minum air.", "Terima kasih, tapi saya bukan ikan."]));
  });

  // Mesin kopi (selalu rusak)
  let kopi = 0, kopiPesan = 0;
  const PESAN_KOPI = [
    "Mesin sedang memanaskan diri. Mohon tunggu 3–5 hari kerja.",
    "Kopi habis. Yang tersisa tinggal niat.",
    "ERROR 404: semangat tidak ditemukan. Silakan coba tombol lain.",
    "Mesin mengeluarkan bunyi \"hhhh\". Kami juga.",
    "Gelas keluar. Isinya tidak.",
    "Mesin minta istirahat. Permintaannya disetujui, sesuai prosedur kantor.",
  ];
  $("#fasKopi").addEventListener("click", (e) => {
    kopi++;
    goyang(e.currentTarget);
    if (kopi % 7 === 0) memo("Bang Rakun · Teknisi Mesin Kopi", "Keluar segelas teh hangat. Ini bukan kopi, tapi lumayan.", 6000);
    else memo("Mesin Kopi · Lantai 1", PESAN_KOPI[kopiPesan++ % PESAN_KOPI.length]);
  });

  // Kotak saran
  let saran = 0;
  $("#fasSaran").addEventListener("click", (e) => {
    saran++;
    goyang(e.currentTarget);
    if (saran === 1) memo("Kotak Saran", "Di dalam ada satu kertas lama: \"Saran: semua orang boleh istirahat.\" Status: disetujui sejak dulu.", 6500);
    else if (saran === 2) memo("Kotak Saran", "Kotaknya sekarang kosong. Kertas tadi boleh dibawa pulang.");
    else memo("Kotak Saran", acak(["Masih kosong. Tapi kotaknya senang ditengok.", "Kotak saran ini juga menerima keluhan. Tapi Loket A lebih nyaman kursinya."]));
  });

  // Bicara dengan Manajer
  let manajer = 0;
  const PESAN_MANAJER = [
    ["Resepsionis", "Mohon tunggu. Manajer sedang rapat dengan dirinya sendiri."],
    ["Resepsionis", "Rapatnya alot. Manajer tidak setuju dengan dirinya."],
    ["Resepsionis", "Manajer sedang mencari sepatu sebelah."],
    ["Resepsionis", "Manajer bilang \"lima menit lagi\". Ini lima menit versi manajer."],
  ];
  $("#fasManajer").addEventListener("click", (e) => {
    manajer++;
    goyang(e.currentTarget);
    if (manajer <= 4) memo(...PESAN_MANAJER[manajer - 1]);
    else if (manajer === 5) memo("Pak Beruang Madu · Manajer", `Halo, ${NAMA}. Maaf lama, saya juga capek. Tapi urusan kamu tetap yang paling penting di gedung ini hari ini.`, 7500);
    else memo("Resepsionis", "Manajer kembali tidur siang. Itu haknya, dan hak Anda juga.");
  });
})();
