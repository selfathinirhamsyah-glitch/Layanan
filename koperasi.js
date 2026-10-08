/* =========================================================
   Kantor Layanan Perasaan · Koperasi Kantor (Lantai 4)
   dan Meja Kerja Mira (Lantai 5)
   ========================================================= */
(() => {
  "use strict";
  const K = window.KLP;
  const { $, $$, esc, px, sfx, memo, NAMA, N } = K;

  /* ---------- Barang ---------- */
  const BARANG = [
    { id: "sertif", sprite: "dokumen", nama: "Sertifikat Bebas Overthinking 1 Jam", harga: 30,
      ket: "Berlaku 60 menit sejak dipandang. Pikiran yang mencoba masuk akan diminta antre.",
      kom: { ratna: "Satu jam itu lumayan ya. Bisa buat tidur siang.", satpam: "Siap. Selama satu jam, pikiran tambahan tidak boleh masuk. Saya jaga pintunya.", dimas: "SAYA BUTUH INI— eh, kamu duluan. *nanti saya beli juga.", oyen: "Disetujui.", kukang: "...satu jam. Itu cukup untuk minum teh pelan-pelan dua kali." } },
    { id: "payung", sprite: "payung", nama: "Payung Anti Komentar Orang", harga: 45,
      ket: "Menangkis komentar \"kok gitu sih\" dan \"kapan...?\". Tidak tahan hujan sungguhan.",
      kom: { ratna: "Yang ini bagus ya. Komentar orang memang sering turun tanpa ramalan cuaca.", satpam: "Siap. Perlengkapan pengamanan standar. Saya juga punya satu, warna hitam.", dimas: "Payungnya bisa dipakai buat komentar diri sendiri juga nggak? *tanya untuk teman.", oyen: "...Bagus.", kukang: "...dibuka pelan-pelan. Komentar yang buru-buru biasanya langsung mental." } },
    { id: "cangkir", sprite: "cangkir", nama: "Kopi Pura-Pura Produktif", harga: 20,
      ket: "Dipegang sambil menatap layar. Orang yang lewat akan mengira Anda sibuk. Isinya teh.",
      kom: { ratna: "Isinya teh ya. Saya yang isi.", satpam: "Siap. Dilaporkan: kopi ini tidak mengandung kopi.", dimas: "Saya pakai ini tiap hari. JANGAN BILANG SIAPA-SIAPA.", oyen: "Saya tahu trik ini.", kukang: "...saya pegang ini dari jam sembilan. Belum diminum. Masih produktif." } },
    { id: "penghapus", sprite: "penghapus", nama: "Penghapus Chat yang Belum Terkirim", harga: 25,
      ket: "Menghapus pesan yang diketik jam 1 pagi sebelum terkirim. Sudah menyelamatkan banyak orang.",
      kom: { ratna: "Ini penting ya. Jam satu pagi memang bukan jam yang baik untuk mengirim apa pun.", satpam: "Siap. Barang ini mencegah insiden. Saya setuju.", dimas: "Kenapa ini nggak ada dari dulu. *dari minggu lalu, tepatnya.", oyen: "Hapus.", kukang: "...yang ditulis tetap berguna. Cuma tidak perlu dikirim." } },
    { id: "bantal", sprite: "bantal", nama: "Bantal Rapat (bentuk map, bisa dipeluk)", harga: 40,
      ket: "Dari jauh terlihat seperti map berkas penting. Dari dekat, empuk.",
      kom: { ratna: "Empuk ya. Saya pernah ketiduran di atas satu.", satpam: "Siap. Dari jarak tiga meter tidak terdeteksi sebagai bantal. Sudah saya uji.", dimas: "Bisa dipakai pas rapat?? Oh. Itu namanya. Oke.", oyen: "Itu tempat tidur saya. ...Boleh. Beli satu lagi untuk saya.", kukang: "...saya punya tiga." } },
    { id: "stiker", sprite: "stiker", nama: "Stiker \"Sedang Mengisi Daya\"", harga: 15,
      ket: "Ditempel di dahi atau di pintu kamar. Artinya: jangan diajak ngobrol dulu, sebentar lagi.",
      kom: { ratna: "Tempel di pintu ya. Biar yang mau ketuk jadi pelan.", satpam: "Siap. Tanda resmi. Akan saya hormati.", dimas: "Saya tempel di laptop. Laptopnya yang ngisi daya. *saya juga.", oyen: "Saya pakai yang ini setiap siang.", kukang: "...ini stiker saya. Saya tempel dari tahun lalu. Belum penuh." } },
    { id: "jam", sprite: "jam", nama: "Jam Dinding yang Selalu Jam Pulang", harga: 60,
      ket: "Jarumnya macet di jam pulang. Tidak berguna untuk mengukur waktu, tapi bagus untuk suasana hati.",
      kom: { ratna: "Saya suka yang ini ya. Lihat aja rasanya udah lega.", satpam: "Siap. Jam ini tidak akurat. Tapi saya tidak keberatan.", dimas: "JAM PULANG— eh, maksud saya, jam yang bagus.", oyen: "Jam empat lewat lima puluh sembilan. Jam paling tenang.", kukang: "...semua jam saya juga begini. Cuma tidak sengaja." } },
    { id: "plastik", sprite: "plastik", nama: "Tanaman Plastik yang Tidak Pernah Kecewa", harga: 35,
      ket: "Tidak perlu disiram. Tidak akan layu. Tidak akan menilai Anda kalau lupa menyiram yang asli.",
      kom: { ratna: "Pak Lidah Mertua jangan sampai tahu ya.", satpam: "Siap. Tanaman ini tidak memerlukan pengamanan. Ia sudah aman.", dimas: "Yang ini nggak bisa mati kan? Oke. Saya tenang.", oyen: "Tidak bisa dimakan. Tidak menarik.", kukang: "...dia selalu terlihat segar. Saya iri sedikit." } },
    { id: "kaus", sprite: "kaus", nama: "Kaus Kaki Hari Senin (sudah diberi tahu)", harga: 20,
      ket: "Kaus kaki ini sudah diberi pengarahan bahwa hari Senin memang begitu. Ia siap.",
      kom: { ratna: "Hangat ya. Senin perlu yang hangat.", satpam: "Siap. Perlengkapan Senin. Sepasang. Sudah saya hitung.", dimas: "Senin saya pakai kaus kaki beda warna. Kemarin. *dan hari ini.", oyen: "Senin: ditolak.", kukang: "...Senin juga akan lewat. Pelan, tapi lewat." } },
    { id: "kursi", sprite: "kursi", nama: "Kursi Putar Mode Merenung", harga: 70,
      ket: "Diputar tiga kali ke kiri sambil menatap jendela. Tidak menyelesaikan masalah, tapi enak.",
      kom: { ratna: "Mahal ya. Tapi muternya enak.", satpam: "Siap. Kursi ini pernah saya uji. Saya pusing. Tapi tenang.", dimas: "Saya pernah muter sampai lupa lagi ngapain. Rekomendasi.", oyen: "Itu kursi saya.", kukang: "...saya muter satu kali. Sudah sore." } },
    { id: "pembatas", sprite: "pembatas", nama: "Pembatas Buku Anti Lupa Halaman", harga: 15,
      ket: "Menjaga halaman terakhir novel yang dibaca, dan menjaga ujung kertas dari dilipat. Tidak menjamin besok tidak lanjut baca sampai jam dua.",
      kom: { ratna: "Ini bagus ya. Dulu saya mau jadi pustakawan, jadi saya setuju sekali.", satpam: "Siap. Halaman terakhir diamankan. Tidak ada yang boleh mengintip bab terakhir.", dimas: "Saya pakai bon gorengan buat pembatas. *bonnya ikut kebaca juga.", oyen: "Halaman tidak boleh dilipat. Kertas juga punya perasaan.", kukang: "...saya pakai yang ini di halaman 212. ...dari 2019." } },
    { id: "drakor", sprite: "tisu", nama: "Paket Maraton Drakor", harga: 35,
      ket: "Isi: tisu, mi instan, selimut, dan surat izin begadang satu malam. Episode 16 tetap terasa terlalu cepat. Itu bukan cacat produk.",
      kom: { ratna: "Tisunya yang lembut ya. Adegan makan sendirian di minimarket butuh yang lembut.", satpam: "Siap. Kalau ada adegan sedih, saya jaga pintunya. Tidak ada yang akan melihat Anda menangis.", dimas: "Saya nangis di episode SATU. *pas lagu pembukanya. lagunya bagus.", oyen: "Kenapa semua orang di drakor lari di bandara. Bandara bukan untuk lari.", kukang: "...satu episode per bulan. ...saya baru episode 3 dari drama tahun 2016." } },
    { id: "tempurung", sprite: "tempurung", nama: "Tempurung Cadangan (bukan perisai)", harga: 55,
      ket: "Sumbangan Pak Satpam. Bulat, kuat, dicat sedikit biru. Menahan komentar, berkas jatuh, dan spoiler film. Tidak bisa dilempar lalu kembali sendiri. Sudah dicoba.",
      kom: { ratna: "Dipakai kalau hari lagi banyak yang dilempar ke kamu ya.", satpam: "Siap. Tempurung lama saya. Sudah saya cat biru, sesuai data warna favorit Anda. Jangan dilempar. Tidak kembali.", dimas: "Saya pernah lempar. NGGAK BALIK. Saya jalan kaki ngambilnya. *dua lantai.", oyen: "Bukan perisai. Tempurung. Fiksi dan kenyataan harus dibedakan.", kukang: "...di dalamnya hangat. ...saya tahu tidak sengaja." } },
    { id: "lightstick", sprite: "lightstick", nama: "Lightstick Senter Biru", harga: 40,
      ket: "Dirakit Bang Rakun dari senter bekas. Menyala biru. Cocok untuk konser, nonton panggung dari HP, atau mencari remot di bawah sofa.",
      kom: { ratna: "Biru ya. Warnanya tenang. Cocok buat goyang pelan.", satpam: "Siap. Boleh dinyalakan di dalam gedung. Tapi kalau joget, jangan di tangga.", dimas: "SAYA PUNYA SATU— eh. Saya pinjam punya Bang Rakun. Buat latihan di lift. *jangan cek CCTV.", oyen: "Jangan diarahkan ke mata saya. Kecuali sebentar. Itu lucu.", kukang: "...saya goyang satu kali. ...lagunya sudah selesai." } },
    { id: "gula", sprite: "gula", nama: "Gula Pasir 1 Sendok", harga: 5, syarat: "l13:bab1",
      ket: "Barang langka sejak misteri gula. Dibungkus kertas, dicap DISIMPAN.",
      kom: { ratna: "Akhirnya ada ya. Satu sendok saja, buat teh.", satpam: "Siap. Gula ini sudah diverifikasi bukan curian.", dimas: "GULA! Eh. Gula.", oyen: "...Itu dari persediaan saya.", kukang: "...manisnya pelan." } },
    { id: "senter", sprite: "senter", nama: "Senter Pak Satpam (replika)", harga: 50, syarat: "l13:bab3",
      ket: "Replika resmi senter yang menyelamatkan penyelidikan di ruang arsip. Baterai tidak termasuk.",
      kom: { ratna: "Buat jalan pulang ya, kalau gelap.", satpam: "Siap. Replika ini disetujui oleh saya sendiri. Kualitasnya hampir sama.", dimas: "Yang asli pernah saya jatuhin. Jangan bilang Pak Satpam. *dia lagi di sini ya.", oyen: "Jangan disorot ke mata saya.", kukang: "...cahayanya hangat." } },
    { id: "toples", sprite: "toples", nama: "Toples Kosong untuk Hal Kecil", harga: 30, syarat: "l13:bab6",
      ket: "Untuk menyimpan hal kecil yang bikin senyum. Datang kosong. Diisi sendiri, pelan-pelan.",
      kom: { ratna: "Toples ini cocok di meja kamu ya.", satpam: "Siap. Perlengkapan penjaga lantai 13. Dicatat.", dimas: "Saya isi apa ya? *mungkin stiker. mungkin remah gorengan.", oyen: "Diketahui. Tugas penjaga dimulai dengan toples.", kukang: "...isinya nanti datang sendiri." } },
  ];
  K.BARANG = BARANG;
  const barang = (id) => BARANG.find((b) => b.id === id);
  const tersedia = (b) => !b.syarat || K.pernah(b.syarat);

  const TEMAN = ["ratna", "satpam", "dimas", "oyen", "kukang"];
  const PEMBUKA = {
    ratna: "Saya temani belanja ya. Pilih yang bikin kamu enak aja.",
    satpam: "Siap. Saya mengawal kegiatan belanja Anda.",
    dimas: "BELANJA! Eh. Iya, belanja. Saya bawain keranjangnya.",
    oyen: "Saya ikut. Saya duduk di keranjang.",
    kukang: "...saya ikut. Pelan-pelan ya, rak-nya tidak ke mana-mana.",
  };
  const KURANG_POIN = {
    ratna: "Poinnya belum cukup ya. Nggak apa-apa, barangnya nggak ke mana-mana.",
    satpam: "Siap. Saldo Poin Sabar tidak mencukupi. Disarankan rally dengan saya. Sekarang.",
    dimas: "Kurang poin?? Eh, nggak apa-apa. Main Stempel Kilat aja, saya juga gitu.",
    oyen: "Ditolak. Alasan: poin.",
    kukang: "...poinnya sedang dalam perjalanan. Seperti saya.",
  };

  let teman = "dimas";
  let keranjang = {}; // id → jumlah

  /* =========================================================
     KOPERASI
     ========================================================= */
  const totalKeranjang = () => Object.entries(keranjang).reduce((s, [id, n]) => s + barang(id).harga * n, 0);
  const jumlahKeranjang = () => Object.values(keranjang).reduce((s, n) => s + n, 0);

  function isiKoperasi() {
    const r = $("#ruangKoperasi");
    r.innerHTML = `
      <div class="form-head"><span class="loket-badge">Lantai 4</span><span class="mono small">Poin Sabar: <b class="poin-angka">${K.data.poin}</b></span></div>
      <h2 id="h-koperasi">Koperasi Kantor</h2>
      <div class="petugas" data-sprite="berang">
        <div class="petugas-tag">Bang Berang-berang <small>Kasir koperasi</small></div>
        <p>Selamat datang di koperasi. Semua harga dalam Poin Sabar. Barang yang sudah dibeli tidak dapat ditukar dengan perasaan lain.</p>
      </div>

      <div class="teman-belanja">
        <p class="ap-label">Ditemani belanja oleh:</p>
        <div class="teman-pilih" role="radiogroup" aria-label="Teman belanja">
          ${TEMAN.map((t) => `<button type="button" role="radio" aria-checked="${t === teman}" class="teman-btn${t === teman ? " aktif" : ""}" data-teman="${t}" title="${esc(K.PEGAWAI[t].nama)}"><span>${px(K.PEGAWAI[t].sprite)}</span><small>${esc(K.PEGAWAI[t].nama)}</small></button>`).join("")}
        </div>
        <div class="petugas komentar-teman" id="komentarTeman" data-sprite="${K.PEGAWAI[teman].sprite}">
          <div class="petugas-tag">${esc(K.PEGAWAI[teman].nama)} <small>teman belanja</small></div>
          <p id="komentarTeks">${esc(PEMBUKA[teman])}</p>
        </div>
      </div>

      <h3 class="sub-judul">Rak barang</h3>
      <div class="rak">
        ${BARANG.filter(tersedia).map((b) => `
          <article class="barang${b.syarat ? " langka" : ""}">
            <div class="barang-foto">${px(b.sprite)}</div>
            <div class="barang-isi">
              <h4>${esc(b.nama)}</h4>
              <p>${esc(b.ket)}</p>
              <div class="barang-bawah">
                <span class="harga mono">${b.harga} PS</span>
                ${K.data.barang[b.id] ? `<span class="punya">punya ${K.data.barang[b.id]}</span>` : ""}
                <button class="btn small" type="button" data-masuk="${b.id}">+ Keranjang</button>
              </div>
            </div>
          </article>`).join("")}
        ${BARANG.filter((b) => !tersedia(b)).map(() => `
          <article class="barang terkunci"><div class="barang-foto">?</div><div class="barang-isi"><h4>Barang belum datang</h4><p>Stok menunggu kabar dari Misteri Lantai 13.</p></div></article>`).join("")}
      </div>

      <button type="button" class="keranjang-mini" id="keranjangMini" hidden></button>
      <section class="keranjang" id="keranjang" aria-live="polite"></section>`;
    K.pasangSprite(r);
    gambarKeranjang();
  }
  function gambarKeranjang() {
    const el = $("#keranjang");
    if (!el) return;
    const isi = Object.entries(keranjang);
    const total = totalKeranjang();
    const mini = $("#keranjangMini");
    mini.hidden = !isi.length;
    mini.innerHTML = `<span>Keranjang (${jumlahKeranjang()})</span><b class="mono">${total} PS</b><span>Lihat ↓</span>`;
    el.innerHTML = `
      <h3 class="papan-judul">Keranjang <span class="mono">(${jumlahKeranjang()})</span></h3>
      ${isi.length ? `<ul class="keranjang-list">${isi.map(([id, n]) => `
        <li><span class="avatar avatar-sm">${px(barang(id).sprite)}</span><span class="kl-nama">${esc(barang(id).nama)}</span>
          <span class="kl-jumlah"><button type="button" class="kl-btn" data-kurang="${id}" aria-label="Kurangi">−</button><b class="mono">${n}</b><button type="button" class="kl-btn" data-masuk="${id}" aria-label="Tambah">+</button></span>
          <span class="mono kl-harga">${barang(id).harga * n}</span></li>`).join("")}</ul>` : `<p class="muted">Masih kosong. ${teman === "oyen" ? "Oyen sedang duduk di dalamnya." : "Keranjangnya sabar menunggu."}</p>`}
      <div class="keranjang-total"><span>Total</span><b class="mono">${total} PS</b></div>
      <div class="keranjang-total kecil"><span>Poin Sabar Anda</span><b class="mono">${K.data.poin} PS</b></div>
      <div class="actions"><button class="btn primary" type="button" id="keKasir" ${isi.length ? "" : "disabled"}>Ke kasir →</button></div>`;
  }
  function komentar(teks) {
    const t = $("#komentarTeks");
    if (!t) return;
    t.textContent = teks;
    const box = $("#komentarTeman");
    box.classList.remove("goyang-kecil"); void box.offsetWidth; box.classList.add("goyang-kecil");
  }
  K.saatMasuk["s-koperasi"] = () => { K.catat("koperasi"); isiKoperasi(); };
  $("#ruangKoperasi").addEventListener("click", (e) => {
    const t = e.target.closest("[data-teman]");
    if (t) { teman = t.dataset.teman; sfx("pilih"); isiKoperasi(); return; }
    const m = e.target.closest("[data-masuk]");
    if (m) {
      const b = barang(m.dataset.masuk);
      keranjang[b.id] = (keranjang[b.id] || 0) + 1;
      sfx("kertas");
      komentar(b.kom[teman]);
      gambarKeranjang();
      return;
    }
    const k = e.target.closest("[data-kurang]");
    if (k) {
      const id = k.dataset.kurang;
      keranjang[id]--; if (keranjang[id] <= 0) delete keranjang[id];
      sfx("klik"); gambarKeranjang(); return;
    }
    if (e.target.closest("#keKasir")) bukaKasir();
    if (e.target.closest("#keranjangMini")) $("#keranjang").scrollIntoView({ behavior: K.kurangiGerak ? "auto" : "smooth", block: "center" });
  });

  /* ---------- Kasir & struk ---------- */
  let nomorStruk = 0;
  async function bukaKasir() {
    const total = totalKeranjang();
    const r = $("#ruangKoperasi");
    const isi = Object.entries(keranjang);
    r.innerHTML = `
      <div class="form-head"><span class="loket-badge">Lantai 4</span><span class="mono small">Kasir</span></div>
      <h2 id="h-koperasi">Kasir</h2>
      <div class="kasir-meja">
        <div class="kasir-orang">${px("berang")}</div>
        <div class="kasir-layar mono" id="kasirLayar">0 PS</div>
      </div>
      <ul class="kasir-scan" id="kasirScan"></ul>
      <div class="actions" id="kasirAksi"></div>`;
    let jalan = 0;
    for (const [id, n] of isi) {
      for (let i = 0; i < n; i++) {
        await new Promise((res) => setTimeout(res, K.kurangiGerak ? 60 : 380));
        if (K.layarAktif() !== "s-koperasi") return;
        jalan += barang(id).harga;
        $("#kasirScan").insertAdjacentHTML("beforeend", `<li><span>${esc(barang(id).nama)}</span><b class="mono">${barang(id).harga}</b></li>`);
        $("#kasirLayar").textContent = `${jalan} PS`;
        sfx("klik");
      }
    }
    const cukup = K.data.poin >= total;
    $("#kasirAksi").innerHTML = cukup
      ? `<button class="btn ghost" type="button" id="kasirBatal">← Kembali ke rak</button><button class="btn primary" type="button" id="kasirBayar">Bayar ${total} PS</button>`
      : `<p class="kasir-kurang">${esc(KURANG_POIN[teman])}</p><button class="btn ghost" type="button" id="kasirBatal">← Kembali ke rak</button><button class="btn" type="button" data-ke="s-istirahat">Cari Poin Sabar di Lantai 2</button>`;
    $("#kasirBatal").addEventListener("click", isiKoperasi);
    $("#kasirBayar")?.addEventListener("click", () => bayar(total, isi));
  }
  function bayar(total, isi) {
    if (!K.pakaiPoin(total)) return;
    isi.forEach(([id, n]) => { K.data.barang[id] = (K.data.barang[id] || 0) + n; });
    K.simpan();
    K.catat("belanja");
    sfx("stempel"); setTimeout(() => sfx("poin"), 200);
    const now = new Date();
    nomorStruk = (K.data.jejak.belanja || 1);
    const PENUTUP = {
      ratna: "Dipakai pelan-pelan ya. — Bu Ratna",
      satpam: "Siap. Barang telah diserahterimakan dengan aman. — Pak Satpam",
      dimas: "SELAMAT— eh, selamat menikmati. — Dimas",
      oyen: "Diketahui. — Oyen",
      kukang: "...semoga awet. — Mas Kukang",
    };
    $("#ruangKoperasi").innerHTML = `
      <div class="form-head"><span class="loket-badge">Lantai 4</span><span class="mono small">Lunas</span></div>
      <h2 id="h-koperasi">Struk belanja</h2>
      <div class="struk-wrap">
        <div class="struk" id="strukBelanja">
          <p class="struk-kop">KOPERASI KANTOR<br>LAYANAN PERASAAN</p>
          <p class="struk-kecil">Lantai 4 · Jl. Pelan-Pelan No. 3</p>
          <p class="struk-garis">--------------------------------</p>
          <p class="struk-kecil">No. ${String(nomorStruk).padStart(5, "0")} · ${K.tanggalPanjang(now)} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}</p>
          <p class="struk-kecil">Pembeli: ${N} · Kasir: Bang Berang-berang</p>
          <p class="struk-garis">--------------------------------</p>
          ${isi.map(([id, n]) => `<div class="struk-baris"><span>${esc(barang(id).nama)}${n > 1 ? ` x${n}` : ""}</span><b>${barang(id).harga * n}</b></div>`).join("")}
          <p class="struk-garis">--------------------------------</p>
          <div class="struk-baris tebal"><span>TOTAL</span><b>${total} PS</b></div>
          <div class="struk-baris"><span>Sisa Poin Sabar</span><b>${K.data.poin} PS</b></div>
          <p class="struk-garis">--------------------------------</p>
          <p class="struk-kecil">Ditemani: ${esc(K.PEGAWAI[teman].nama)}</p>
          <p class="struk-pesan">"${esc(PENUTUP[teman].split(" — ")[0])}"</p>
          <p class="struk-kecil">Barang yang sudah dibeli tidak dapat ditukar dengan perasaan lain.</p>
          <p class="struk-lunas">LUNAS</p>
        </div>
      </div>
      <p class="muted small">Barang sudah diantar ke Meja Kerja ${N} di Lantai 5.</p>
      <div class="actions">
        <button class="btn" type="button" data-download="strukBelanja" data-file="struk-koperasi">Unduh struk</button>
        <button class="btn" type="button" id="belanjaLagi">Belanja lagi</button>
        <button class="btn primary" type="button" data-ke="s-meja">Lihat di meja →</button>
      </div>`;
    keranjang = {};
    $("#belanjaLagi").addEventListener("click", isiKoperasi);
  }

  /* =========================================================
     MEJA KERJA MIRA
     ========================================================= */
  function isiMeja() {
    const r = $("#ruangMeja");
    const punya = BARANG.filter((b) => K.data.barang[b.id]);
    const skor = K.data.skor;
    const langka = (K.data.l13 && K.data.l13.langka) || [];
    const nGosip = K.data.gosip.length;
    const nObrol = Object.keys(K.data.jejak).filter((k) => k.startsWith("ngobrol:")).length;
    r.innerHTML = `
      <div class="form-head"><span class="loket-badge">Lantai 5</span><span class="mono small">Poin Sabar: <b class="poin-angka">${K.data.poin}</b></span></div>
      <h2 id="h-meja">Meja Kerja ${N}</h2>
      <p class="muted">Meja resmi Pegawai Kehormatan. Dibersihkan setiap hari oleh tidak ada siapa-siapa.</p>
      ${K.kartuPegawai ? K.kartuPegawai() : ""}

      <div class="meja-panggung" aria-label="Meja kerja">
        <div class="meja-dinding">
          <div class="rak-dinding" id="rakDinding">
            ${langka.length ? langka.map((id) => `<button type="button" class="pajangan langka" data-langka="${esc(id)}" title="${esc(K.NAMA_LANGKA?.[id]?.nama || id)}">${px(K.NAMA_LANGKA?.[id]?.sprite || "toples")}</button>`).join("") : `<span class="rak-kosong">rak untuk barang langka</span>`}
          </div>
          <button type="button" class="kalender-meja" id="kalenderMeja" aria-label="Kalender meja">
            <span class="kal-bulan">${["JAN", "FEB", "MAR", "APR", "MEI", "JUN", "JUL", "AGU", "SEP", "OKT", "NOV", "DES"][new Date().getMonth()]}</span>
            <span class="kal-tgl mono">${new Date().getDate()}</span>
          </button>
        </div>
        <div class="meja-atas">
          ${punya.length ? punya.map((b) => `<button type="button" class="pajangan" data-pajang="${b.id}" title="${esc(b.nama)}">${px(b.sprite)}${K.data.barang[b.id] > 1 ? `<small>x${K.data.barang[b.id]}</small>` : ""}</button>`).join("") : `<span class="meja-kosong">Meja masih kosong. Koperasi di Lantai 4 buka sampai kapan pun.</span>`}
        </div>
        <div class="meja-kaki" aria-hidden="true"></div>
      </div>

      <h3 class="sub-judul">Koleksi</h3>
      <p class="mono koleksi-hitung">${punya.length}/${BARANG.length} barang koperasi · ${nGosip} gosip · ${nObrol} obrolan selesai</p>

      <h3 class="sub-judul">Buku Rekor</h3>
      <table class="tabel-rekor">
        <tbody>
          ${Object.entries(K.GAMES || {}).map(([id, g]) => `<tr><th scope="row">${esc(g.nama)}</th><td class="mono">${skor[id] ?? "–"}</td></tr>`).join("")}
          <tr><th scope="row">Poin Sabar sepanjang masa</th><td class="mono">${K.data.poinTotal}</td></tr>
          <tr><th scope="row">Game dimainkan</th><td class="mono">${K.data.mainGame || 0}</td></tr>
          <tr><th scope="row">Loket dikunjungi</th><td class="mono">${(K.data.jejak.loketA || 0) + (K.data.jejak.loketB || 0) + (K.data.jejak.loketC || 0)}</td></tr>
        </tbody>
      </table>

      <div id="mejaL13"></div>

      <details class="bersihkan">
        <summary>Bersihkan meja (hapus semua data di perangkat ini)</summary>
        <p class="muted small">Poin, barang, skor, gosip, dan progres misteri akan hilang dari perangkat ini. Tidak bisa dibatalkan.</p>
        <button class="btn small" type="button" id="hapusData">Ya, bersihkan semuanya</button>
      </details>
      ${K.bisaSimpan ? "" : `<p class="privasi">Penyimpanan di perangkat ini sedang tidak bisa dipakai. Semua tetap bisa dimainkan, tapi progres hilang saat halaman ditutup.</p>`}`;
    K.isiMejaL13?.($("#mejaL13"));
  }
  K.saatMasuk["s-meja"] = isiMeja;
  K.segarkanMeja = () => { if (K.layarAktif() === "s-meja") isiMeja(); };
  $("#ruangMeja").addEventListener("click", (e) => {
    const p = e.target.closest("[data-pajang]");
    if (p) {
      const b = barang(p.dataset.pajang);
      const t = K.acak(TEMAN);
      sfx("pilih");
      memo(`${K.PEGAWAI[t].nama} · lewat meja`, `${b.nama}. ${b.kom[t]}`, 6000);
      p.classList.remove("lompat"); void p.offsetWidth; p.classList.add("lompat");
      return;
    }
    const l = e.target.closest("[data-langka]");
    if (l && K.NAMA_LANGKA?.[l.dataset.langka]) {
      const x = K.NAMA_LANGKA[l.dataset.langka];
      sfx("pilih");
      memo("Oyen · Kepala Bagian", `${x.nama}. ${x.ket}`, 6500);
      return;
    }
    if (e.target.closest("#kalenderMeja")) { K.ketukKalender ? K.ketukKalender() : sfx("klik"); return; }
    if (e.target.closest("#hapusData")) {
      K.hapusSemua();
      memo("Bu Ratna · Loket A", "Mejanya sudah dibersihkan ya. Halaman akan dimuat ulang.");
      setTimeout(() => location.reload(), 1200);
    }
  });
})();
