/* =========================================================
   Kantor Layanan Perasaan · gedung
   Lobi (denah), papan pegawai, panel lift, panel Radio Kantor.
   ========================================================= */
(() => {
  "use strict";
  const K = window.KLP;
  const { $, $$, esc, px, ke, memo, sfx, NAMA } = K;

  /* ---------- Pegawai tetap ---------- */
  K.PEGAWAI = {
    ratna: {
      nama: "Bu Ratna", sprite: "kapibara", jabatan: "Petugas Loket A, merangkap resepsionis",
      sifat: "Kalem dan paling pengertian. Tidak pernah buru-buru, bahkan waktu latihan kebakaran.",
      gaya: "Kalimatnya pendek, sering diakhiri \"ya\", selalu menawarkan teh.",
      kutip: "Duduk dulu ya. Tehnya masih anget.",
    },
    satpam: {
      nama: "Pak Satpam", sprite: "kura", jabatan: "Keamanan gedung",
      sifat: "Kura-kura serius dan disiplin. Diam-diam juara bulutangkis antar-RT tiga tahun berturut-turut.",
      gaya: "Bicara seperti laporan jaga.",
      kutip: "Siap. Dilaporkan bahwa situasi aman. Kecuali gula.",
    },
    dimas: {
      nama: "Dimas", sprite: "marmut", jabatan: "Anak magang (bulan ke-2)",
      sifat: "Marmut yang rajin dan selalu panik. Keringetan bahkan di ruangan ber-AC.",
      gaya: "Kadang huruf kapital semua, typo, lalu meralat sendiri.",
      kutip: "MAAF SAYA TELAT— eh, saya belum telat ya? *maksudnya, selamat pagi.",
    },
    oyen: {
      nama: "Oyen", sprite: "oyen", jabatan: "Kepala Bagian",
      sifat: "Kucing oranye. Jabatannya sah, SK-nya dicap pakai kaki. Sering menatap tembok tanpa penjelasan.",
      gaya: "Satu-dua kata. Gaya memo.",
      kutip: "Diketahui.",
    },
    kukang: {
      nama: "Mas Kukang", sprite: "kukang", jabatan: "Bagian Fotokopi",
      sifat: "Santai tingkat lanjut. Pendengar yang baik, karena dia sendiri bicaranya lama.",
      gaya: "Pelan, sedikit filosofis, sering diam dulu sebelum menjawab.",
      kutip: "...Tidak semua yang lambat itu telat. Ada yang memang sampainya nanti.",
    },
  };
  const PEGAWAI_LAIN = [
    ["berang", "Bang Berang-berang", "Loket B · Kabar Baik"],
    ["badak", "Kak Badak", "Loket C · Izin Semangat"],
    ["hantu", "Mbak Burung Hantu", "Loket D · Diagnosis"],
    ["singa", "Pak Singa", "Bagian Pengumuman"],
    ["gajah", "Bu Gajah", "Kepala Kantor"],
    ["beruang", "Pak Beruang Madu", "Manajer (sering tidur)"],
    ["rakun", "Bang Rakun", "Teknisi mesin kopi"],
  ];

  /* ---------- Lantai ---------- */
  const LANTAI = [
    { no: "5", layar: "s-meja", nama: "Meja Kerja Mira", ket: "Koleksi & skor", sprite: "oyen" },
    { no: "4", layar: "s-koperasi", nama: "Koperasi Kantor", ket: "Belanja pakai Poin Sabar", sprite: "berang" },
    { no: "3", layar: "s-pantry", nama: "Pantry", ket: "Ngobrol & gosip", sprite: "kukang" },
    { no: "2", layar: "s-istirahat", nama: "Ruang Istirahat Pegawai", ket: "Games", sprite: "marmut" },
    { no: "1", layar: "s-pilih", nama: "Loket Layanan", ket: "Keluhan, kabar baik, semangat", sprite: "kapibara" },
    { no: "L", layar: "s-lobi", nama: "Lobi & Ruang Tunggu", ket: "Pengumuman, absen perasaan", sprite: "kura" },
  ];
  K.LANTAI = LANTAI;

  function gambarDenah() {
    const g = $("#denah");
    if (!g) return;
    g.innerHTML = `
      <div class="atap" aria-hidden="true"><span class="antena"></span><span class="papan-nama">KLP</span></div>
      <div class="lantai-gaib" id="lantaiGaib" aria-hidden="true"><span>?</span></div>
      ${LANTAI.filter((l) => l.no !== "L").map((l) => `
        <button class="lantai-btn" type="button" data-ke="${l.layar}">
          <span class="lantai-no">${l.no}</span>
          <span class="lantai-isi"><strong>${esc(l.nama)}</strong><small>${esc(l.ket)}</small></span>
          <span class="lantai-sprite">${px(l.sprite)}</span>
        </button>`).join("")}
      <div class="lantai-dasar">
        <span class="lantai-no">L</span>
        <span class="lantai-isi"><strong>Lobi</strong><small>Anda di sini</small></span>
        <span class="pot-lobi" id="potLobi" title="Pot tanaman">${px("tanaman2")}</span>
      </div>`;
  }

  /* ---------- Lobi ---------- */
  K.pengumuman = K.pengumuman || [];   // fungsi → { dari, teks } | null
  function sapaan() {
    const j = new Date().getHours();
    const waktu = j < 11 ? "pagi" : j < 15 ? "siang" : j < 18 ? "sore" : "malam";
    const absen = K.data.absen && K.data.absen.tgl === K.hariIni() ? K.data.absen : null;
    if (K.sapaLobi) {
      const s = K.sapaLobi(absen, waktu);
      if (s) return s;
    }
    if (j >= 22 || j < 4) return ["satpam", `Siap. Selamat ${waktu}, ${NAMA}. Kantor sudah sepi. Lampu sengaja tidak dinyalakan semua supaya mata Anda tidak kaget.`];
    return ["satpam", `Siap. Selamat ${waktu}, ${NAMA}. Dilaporkan bahwa lift berfungsi normal. Hampir.`];
  }

  function isiLobi() {
    const [siapa, teks] = sapaan();
    const p = K.PEGAWAI[siapa];
    $("#lobiSapa").innerHTML = `
      <div class="petugas" data-sprite="${p.sprite}">
        <div class="petugas-tag">${esc(p.nama)} <small>${esc(p.jabatan)}</small></div>
        <p>${esc(teks)}</p>
      </div>`;
    K.pasangSprite($("#lobiSapa"));

    const daftar = K.pengumuman.map((f) => { try { return f(); } catch { return null; } }).filter(Boolean);
    if (!daftar.length) daftar.push({ dari: "Pak Singa", teks: `Perhatian. Tidak ada pengumuman hari ini. Ini juga pengumuman.` });
    $("#papanPengumuman").innerHTML = daftar.map((d) => `
      <li><span class="avatar avatar-sm">${px(d.sprite || "singa")}</span><span><strong>${esc(d.dari)}:</strong> ${esc(d.teks)}</span></li>`).join("");
    gambarDenah();
  }
  K.saatMasuk["s-lobi"] = isiLobi;
  K.segarkanLobi = () => { if (K.layarAktif() === "s-lobi") K.saatMasuk["s-lobi"](); };

  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-ke]");
    if (t) { sfx("pilih"); naikLift(t.dataset.ke); }
  });

  /* ---------- Papan Pegawai ---------- */
  function isiPegawai() {
    $("#daftarPegawai").innerHTML = Object.values(K.PEGAWAI).map((p) => `
      <article class="kartu-pegawai">
        <div class="kp-foto">${px(p.sprite)}</div>
        <div class="kp-isi">
          <h3>${esc(p.nama)}</h3>
          <p class="kp-jabatan">${esc(p.jabatan)}</p>
          <p>${esc(p.sifat)}</p>
          <p class="kp-gaya"><span>Cara bicara:</span> ${esc(p.gaya)}</p>
          <p class="kp-kutip">"${esc(p.kutip)}"</p>
        </div>
      </article>`).join("");
    $("#pegawaiLain").innerHTML = PEGAWAI_LAIN.map(([sp, n, j]) => `
      <li><span class="avatar avatar-sm">${px(sp)}</span><span><strong>${esc(n)}</strong><small>${esc(j)}</small></span></li>`).join("");
  }
  K.saatMasuk["s-pegawai"] = isiPegawai;

  /* ---------- Lift ---------- */
  const lift = $("#lift");
  const layarLift = $("#liftLayar");
  function lantaiDari(id) {
    const sec = document.getElementById(id);
    return sec?.dataset.lantai || "";
  }
  function perbaruiLift(id) {
    const l = lantaiDari(id);
    $$(".lift-btn", lift).forEach((b) => b.classList.toggle("nyala", b.dataset.lantai === l));
    layarLift.textContent = l || "–";
    lift.hidden = !K.data.sudahMasuk || document.body.classList.contains("layar-penuh");
  }
  K.on("layar", perbaruiLift);

  let sedangNaik = false;
  async function naikLift(id) {
    if (sedangNaik || id === K.layarAktif()) return;
    const dari = lantaiDari(K.layarAktif()), ke_ = lantaiDari(id);
    if (!dari || !ke_ || dari === ke_ || K.kurangiGerak) { ke(id); return; }
    sedangNaik = true;
    const pintu = $("#pintuLift");
    const urut = ["L", "1", "2", "3", "4", "5", "13"];
    $("#pintuLantai").textContent = `${urut.indexOf(ke_) > urut.indexOf(dari) ? "▲" : "▼"} ${ke_}`;
    pintu.hidden = false;
    pintu.classList.remove("buka"); void pintu.offsetWidth; pintu.classList.add("tutup");
    await new Promise((r) => setTimeout(r, 330));
    ke(id);
    sfx("lift");
    await new Promise((r) => setTimeout(r, 160));
    pintu.classList.remove("tutup"); pintu.classList.add("buka");
    await new Promise((r) => setTimeout(r, 330));
    pintu.hidden = true;
    sedangNaik = false;
  }
  K.naikLift = naikLift;
  lift.addEventListener("click", (e) => {
    const b = e.target.closest(".lift-btn");
    if (!b) return;
    if (b.dataset.layar) naikLift(b.dataset.layar);
    else if (K.tombolLiftKosong) K.tombolLiftKosong(b);
    else { sfx("salah"); memo("Pak Satpam · Keamanan", "Siap. Tombol itu tidak ada lantainya. Sudah saya laporkan. Belum dijawab."); }
  });

  /* ---------- Radio Kantor (pengaturan suara & kaget) ---------- */
  const STASIUN = [
    ["Mode Perpustakaan", "Hening total. Bahkan kucing tidak boleh mengeong."],
    ["Bisik-bisik", "Seperti ngobrol di belakang ruang rapat."],
    ["Volume Rapat", "Cukup terdengar, tidak membangunkan peserta."],
    ["Volume Kantin", "Ramai, tapi masih sopan."],
    ["Volume Pak Singa", "Paling keras yang diizinkan. Tetap tidak melengking."],
  ];
  const FREK = ["00.0", "88.2", "91.3", "96.6", "101.3"];
  const SUDUT = [-120, -60, 0, 60, 120];
  const kenop = $("#kenop");

  function tampilSetelan() {
    const v = K.data.setelan.volume;
    kenop.style.setProperty("--putar", `${SUDUT[v]}deg`);
    kenop.setAttribute("aria-valuenow", v);
    kenop.setAttribute("aria-valuetext", STASIUN[v][0]);
    $("#radioFrek").textContent = `FM ${FREK[v]}`;
    $("#radioNama").textContent = STASIUN[v][0];
    $("#radioKet").textContent = STASIUN[v][1];
    $$(".stasiun").forEach((s, i) => s.classList.toggle("aktif", i === v));
    $("#radioLcd").classList.toggle("mati", v === 0);
    const kaget = K.data.setelan.kaget;
    const tuas = $("#tuasKaget");
    tuas.setAttribute("aria-checked", kaget);
    tuas.classList.toggle("nyala", kaget);
    $("#tuasKet").textContent = kaget
      ? "Kejutan di Misteri Lantai 13 akan muncul tiba-tiba. Semuanya lucu, tidak ada yang seram."
      : "Kejutan diganti versi lembut. Bendanya muncul pelan-pelan, disertai permintaan maaf.";
    $("#ikonRadio").classList.toggle("bisu", v === 0);
    const seram = K.data.setelan.seram || "lucu";
    $$(".seram-btn").forEach((b) => { const ya = b.dataset.seram === seram; b.classList.toggle("aktif", ya); b.setAttribute("aria-checked", ya); });
  }
  $$(".seram-btn").forEach((b) => b.addEventListener("click", () => {
    K.data.setelan.seram = b.dataset.seram; K.simpan(); tampilSetelan();
    sfx(b.dataset.seram === "tegang" ? "detak" : "klik");
    memo("Pak Satpam · Keamanan", b.dataset.seram === "tegang" ? "Siap. Lampu lorong diredupkan. Saya tetap berjaga. Saya juga sedikit takut." : "Siap. Lampu lorong dinyalakan normal. Seramnya secukupnya saja.");
  }));
  function setVolume(v) {
    if (v === K.data.setelan.volume) return;
    K.aturVolume(v);
    tampilSetelan();
    sfx("radio");
    setTimeout(() => sfx("klik"), 200);
  }
  $$(".stasiun").forEach((s, i) => s.addEventListener("click", () => setVolume(i)));
  kenop.addEventListener("keydown", (e) => {
    if (["ArrowRight", "ArrowUp"].includes(e.key)) { e.preventDefault(); setVolume(Math.min(4, K.data.setelan.volume + 1)); }
    if (["ArrowLeft", "ArrowDown"].includes(e.key)) { e.preventDefault(); setVolume(Math.max(0, K.data.setelan.volume - 1)); }
  });
  // putar kenop dengan jari
  let putarAktif = false;
  function sudutKe(e) {
    const r = kenop.getBoundingClientRect();
    const a = Math.atan2(e.clientX - (r.left + r.width / 2), -(e.clientY - (r.top + r.height / 2))) * 180 / Math.PI;
    const terdekat = SUDUT.reduce((best, s, i) => (Math.abs(s - a) < Math.abs(SUDUT[best] - a) ? i : best), 0);
    setVolume(terdekat);
  }
  kenop.addEventListener("pointerdown", (e) => { putarAktif = true; kenop.setPointerCapture(e.pointerId); sudutKe(e); });
  kenop.addEventListener("pointermove", (e) => { if (putarAktif) sudutKe(e); });
  kenop.addEventListener("pointerup", () => (putarAktif = false));
  kenop.addEventListener("pointercancel", () => (putarAktif = false));

  $("#tuasKaget").addEventListener("click", () => {
    K.data.setelan.kaget = !K.data.setelan.kaget;
    K.simpan();
    tampilSetelan();
    sfx(K.data.setelan.kaget ? "boing" : "klik");
    memo("Oyen · Kepala Bagian", K.data.setelan.kaget ? "Kaget: diizinkan." : "Kaget: ditunda. Diketahui.");
  });
  $("#tesSuara").addEventListener("click", () => {
    if (!K.data.setelan.volume) { memo("Pak Singa · Pengumuman", "Radio sedang Mode Perpustakaan. Saya bicara dalam hati saja."); return; }
    sfx("tingtong");
  });

  function bukaSetelan() { tampilSetelan(); $("#panelSetelan").hidden = false; sfx("klik"); $("#tutupSetelan").focus(); }
  function tutupSetelan() { $("#panelSetelan").hidden = true; }
  $("#btnSetelan").addEventListener("click", bukaSetelan);
  $("#tutupSetelan").addEventListener("click", tutupSetelan);
  $("#panelSetelan").addEventListener("click", (e) => { if (e.target.id === "panelSetelan") tutupSetelan(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !$("#panelSetelan").hidden) tutupSetelan(); });
  K.bukaSetelan = bukaSetelan;
  tampilSetelan();

  /* ---------- Suara klik ringan di tombol ---------- */
  document.addEventListener("click", (e) => {
    if (e.target.closest(".btn, .check, .kompen, .opsi button, .loket-card")) sfx("klik");
  }, true);

  /* ---------- Awal ---------- */
  K.on("poin", (n) => { $$(".poin-angka").forEach((el) => (el.textContent = n)); });
  $$(".poin-angka").forEach((el) => (el.textContent = K.data.poin));
  if (K.data.sudahMasuk) {
    $("#btnLewatiDepan").hidden = false;
  }
  $("#btnLewatiDepan").addEventListener("click", () => ke("s-lobi"));
  perbaruiLift(K.layarAktif());
})();
