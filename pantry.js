/* =========================================================
   Kantor Layanan Perasaan · Pantry (Lantai 3)
   Ngobrol berdua (bercabang + mode "dengerin aja") dan gosip.
   Tulisan Mira di mode "dengerin aja" tidak disimpan ke mana pun.
   ========================================================= */
(() => {
  "use strict";
  const K = window.KLP;
  const { $, $$, esc, px, sfx, memo, NAMA } = K;
  const { OBROLAN, GOSIP } = K.PANTRY;
  const tunggu = (ms) => new Promise((r) => setTimeout(r, K.kurangiGerak ? Math.min(ms, 150) : ms));

  const JEDA_KETIK = { ratna: 750, satpam: 500, dimas: 320, oyen: 950, kukang: 1600 };
  const PAMIT = {
    ratna: "Iya. Kapan-kapan ke sini lagi ya. Kursinya tetap kosong buat kamu.",
    satpam: "Siap. Pintu dibuka kembali. Hati-hati di jalan.",
    dimas: "Makasih udah cerita— eh, makasih udah ngobrol. *saya senang, beneran.",
    oyen: "Diketahui. *ekornya menyentuh tangan Anda sebentar*",
    kukang: "...sama-sama. Pelan-pelan pulangnya.",
  };

  /* =========================================================
     GOSIP
     ========================================================= */
  function cekGosip(diam = false) {
    const baru = GOSIP.filter((g) => !K.data.gosip.includes(g.id) && K.pernah(g.syarat));
    if (!baru.length) return;
    baru.forEach((g) => K.data.gosip.push(g.id));
    K.simpan();
    tandaiLift();
    if (!diam) {
      sfx("tingtong");
      memo("Dimas · Anak Magang", baru.length === 1 ? `Gosip baru di Pantry: "${baru[0].judul}". SAYA NGGAK IKUT NYEBARIN— eh, ikut sedikit.` : `Ada ${baru.length} gosip baru di Pantry. *saya nggak tahu siapa yang mulai.`);
    }
    if (K.layarAktif() === "s-pantry") isiPantry();
  }
  const belumDibaca = () => K.data.gosip.filter((id) => !K.data.gosipDibaca.includes(id));
  function tandaiLift() {
    $('.lift-btn[data-lantai="3"]')?.classList.toggle("ada-baru", belumDibaca().length > 0);
  }
  K.on("*", (nama) => { if (nama !== "layar" && nama !== "poin" && nama !== "setelan") cekGosip(); });
  K.pengumuman.push(() => {
    const n = belumDibaca().length;
    return n ? { dari: "Dimas", sprite: "marmut", teks: `Ada ${n} gosip yang belum dibaca di Pantry (Lantai 3). Saya cuma memberi tahu. Bukan menyebarkan.` } : null;
  });

  /* =========================================================
     RUANG PANTRY
     ========================================================= */
  function isiPantry() {
    const r = $("#ruangPantry");
    const terbuka = GOSIP.filter((g) => K.data.gosip.includes(g.id));
    const terkunci = GOSIP.filter((g) => !K.data.gosip.includes(g.id));
    r.innerHTML = `
      <div class="form-head"><span class="loket-badge">Lantai 3</span><span class="mono small">Galon: kosong (lagi)</span></div>
      <h2 id="h-pantry">Pantry</h2>
      <div class="petugas" data-sprite="kukang">
        <div class="petugas-tag">Mas Kukang <small>Penunggu air mendidih</small></div>
        <p>...selamat datang di pantry. Di sini boleh ngobrol, boleh diam. Airnya sebentar lagi mendidih. ...sebentar versi saya.</p>
      </div>

      <h3 class="sub-judul">Yang sedang di pantry</h3>
      <div class="meja-pantry">
        ${Object.entries(OBROLAN).map(([id, o]) => {
          const p = K.PEGAWAI[id];
          const selesai = Object.keys(o.topik).filter((t) => K.pernah(`ngobrol:${id}:${t}`)).length;
          return `
          <button class="kursi" type="button" data-ngobrol="${id}">
            <span class="kursi-foto">${px(p.sprite)}</span>
            <span class="kursi-isi"><strong>${esc(p.nama)}</strong><small>${esc(o.status)}</small>
            <span class="kursi-topik mono">${selesai}/${Object.keys(o.topik).length} topik</span></span>
            <span class="kursi-aksi">Ngobrol</span>
          </button>`;
        }).join("")}
      </div>

      <section class="papan-gosip" aria-labelledby="h-gosip">
        <h3 id="h-gosip" class="papan-judul">Papan Gosip Kantor</h3>
        <p class="muted small">Hanya tentang tokoh dan benda kantor. Tidak ada yang tersinggung, kecuali mungkin printer.</p>
        <ul class="gosip-list">
          ${terbuka.map((g) => `
            <li class="gosip${K.data.gosipDibaca.includes(g.id) ? "" : " baru"}">
              <details data-gosip="${g.id}">
                <summary><strong>${esc(g.judul)}</strong></summary>
                <p>${esc(g.isi)}</p>
                <p class="gosip-sumber">Sumber: ${esc(g.sumber)}</p>
              </details>
            </li>`).join("")}
          ${terkunci.slice(0, 3).map((g) => `
            <li class="gosip terkunci"><span class="gembok" aria-hidden="true">▒</span><span><strong>Gosip rahasia</strong><small>Terbuka setelah: ${esc(g.petunjuk)}</small></span></li>`).join("")}
          ${terkunci.length > 3 ? `<li class="gosip terkunci sisa"><span class="gembok" aria-hidden="true">▒</span><span><strong>${terkunci.length - 3} gosip lainnya</strong><small>Masih dirahasiakan. Bahkan oleh Dimas.</small></span></li>` : ""}
        </ul>
        <p class="gosip-hitung mono">${terbuka.length}/${GOSIP.length} gosip terkumpul</p>
      </section>`;
    K.pasangSprite(r);
  }
  K.saatMasuk["s-pantry"] = () => { K.catat("pantry"); isiPantry(); };
  $("#ruangPantry").addEventListener("click", (e) => {
    const b = e.target.closest("[data-ngobrol]");
    if (b) { sfx("pilih"); bukaObrolan(b.dataset.ngobrol); }
  });
  $("#ruangPantry").addEventListener("toggle", (e) => {
    const d = e.target;
    if (!d.matches?.("details[data-gosip]") || !d.open) return;
    const id = d.dataset.gosip;
    if (!K.data.gosipDibaca.includes(id)) {
      K.data.gosipDibaca.push(id); K.simpan();
      d.closest(".gosip").classList.remove("baru");
      tandaiLift();
      sfx("kertas");
    }
  }, true);

  /* =========================================================
     OBROLAN
     ========================================================= */
  const log = $("#chatLog"), pilihanEl = $("#chatPilihan");
  let siapa = null, sesi = 0;

  function bukaObrolan(id) {
    siapa = id; sesi++;
    const p = K.PEGAWAI[id];
    $("#chatFoto").innerHTML = px(p.sprite);
    $("#chatNama").textContent = p.nama;
    $("#chatStatus").textContent = OBROLAN[id].status;
    log.innerHTML = "";
    pilihanEl.innerHTML = "";
    K.ke("s-obrolan");
    const s = sesi;
    (async () => {
      await bicara([OBROLAN[id].salam], s);
      if (s === sesi) tampilTopik();
    })();
  }
  K.saatKeluar["s-obrolan"] = () => { sesi++; log.innerHTML = ""; pilihanEl.innerHTML = ""; };

  function gelembung(teks, dariMira, kelas = "") {
    const el = document.createElement("div");
    el.className = `gel ${dariMira ? "gel-mira" : "gel-dia"} ${kelas}`;
    el.innerHTML = dariMira ? `<span>${esc(teks)}</span>` : `<span class="gel-foto">${px(K.PEGAWAI[siapa].sprite)}</span><span>${esc(teks)}</span>`;
    log.appendChild(el);
    el.scrollIntoView({ block: "end", behavior: K.kurangiGerak ? "auto" : "smooth" });
    return el;
  }
  async function bicara(kalimat, s) {
    for (const k of kalimat) {
      if (s !== sesi) return;
      $("#chatStatus").textContent = "sedang mengetik…";
      const ketik = gelembung("· · ·", false, "gel-ketik");
      await tunggu(JEDA_KETIK[siapa] + Math.min(900, k.length * 12));
      ketik.remove();
      if (s !== sesi) return;
      gelembung(k, false);
      sfx("klik");
    }
    if (s === sesi) $("#chatStatus").textContent = OBROLAN[siapa].status;
  }

  function tombolPilihan(daftar) {
    pilihanEl.innerHTML = daftar.map(([teks, nilai], i) => `<button class="chip" type="button" data-i="${i}">${esc(teks)}</button>`).join("");
    pilihanEl._daftar = daftar;
  }
  pilihanEl.addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b || !pilihanEl._daftar) return;
    const [teks, aksi] = pilihanEl._daftar[Number(b.dataset.i)];
    pilihanEl.innerHTML = ""; pilihanEl._daftar = null;
    sfx("pilih");
    aksi(teks);
  });

  function tampilTopik(setelahSelesai = false) {
    const o = OBROLAN[siapa];
    const daftar = Object.entries(o.topik).map(([tid, t]) => [
      `${K.pernah(`ngobrol:${siapa}:${tid}`) ? "✓ " : ""}${t.judul}`,
      () => mulaiTopik(tid),
    ]);
    daftar.push(["Dengerin aja", (teks) => { gelembung(teks, true); mulaiDengar(); }]);
    daftar.push([setelahSelesai ? "Udahan dulu" : "Nggak jadi", () => K.ke("s-pantry")]);
    tombolPilihan(daftar);
  }

  async function mulaiTopik(tid) {
    const t = OBROLAN[siapa].topik[tid];
    const s = sesi;
    gelembung(t.judul, true);
    await jalankanNode(t, t.mulai, s);
    if (s !== sesi) return;
    const kunci = `ngobrol:${siapa}:${tid}`;
    if (!K.pernah(kunci)) {
      K.catat(kunci);
      K.catat("ngobrol");
      if (t.efek) K.catat(t.efek);
      const n = K.tambahPoin(3);
      if (n) gelembung(`Obrolan selesai. +${n} Poin Sabar (uang lelah ngobrol).`, false, "gel-sistem");
    }
    tampilTopik(true);
  }
  async function jalankanNode(t, nid, s) {
    if (nid === "@dengar") { await mulaiDengar(); return new Promise(() => {}); }
    const n = t.node[nid];
    await bicara(n.k, s);
    if (s !== sesi || !n.p.length) return;
    const lanjut = await new Promise((res) => tombolPilihan(n.p.map(([teks, ke]) => [teks, (tx) => { gelembung(tx, true); res(ke); }])));
    return jalankanNode(t, lanjut, s);
  }

  /* ---------- Mode "dengerin aja" ---------- */
  let terakhirDengar = -1;
  async function mulaiDengar() {
    const s = sesi;
    pilihanEl.innerHTML = "";
    const pembuka = {
      ratna: "Iya. Saya dengerin aja ya. Nggak akan saya kasih nasihat.",
      satpam: "Siap. Mode mendengarkan aktif. Saya tidak akan memberi saran.",
      dimas: "Oke. Saya dengerin. Saya nggak akan ngomong apa-apa. *selain ini.",
      oyen: "*Oyen turun dari kulkas dan duduk di sebelah Anda*",
      kukang: "...saya dengar. Silakan. Saya tidak buru-buru.",
    }[siapa];
    await bicara([pembuka], s);
    if (s !== sesi) return;
    pilihanEl.innerHTML = `
      <form class="dengar-form" id="dengarForm">
        <label class="sr-only" for="dengarTeks">Tulis apa saja</label>
        <textarea id="dengarTeks" rows="2" placeholder="Tulis apa saja. Tidak disimpan, tidak dikirim ke mana pun." autocomplete="off"></textarea>
        <div class="dengar-tombol">
          <button class="chip" type="button" data-dengar="diam">(diam sebentar)</button>
          <button class="chip" type="button" data-dengar="udah">Udah, makasih</button>
          <button class="btn primary small" type="submit">Kirim</button>
        </div>
      </form>`;
    const form = $("#dengarForm"), teks = $("#dengarTeks");
    async function tanggapi() {
      const pool = OBROLAN[siapa].dengar;
      let i;
      do { i = Math.floor(Math.random() * pool.length); } while (pool.length > 1 && i === terakhirDengar);
      terakhirDengar = i;
      await bicara([pool[i]], s);
    }
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const isi = teks.value.trim();
      teks.value = "";
      gelembung(isi || "…", true);
      await tanggapi();
      teks.focus({ preventScroll: true });
    });
    teks.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); } });
    form.addEventListener("click", async (e) => {
      const b = e.target.closest("[data-dengar]");
      if (!b) return;
      if (b.dataset.dengar === "diam") { gelembung("…", true); await tanggapi(); return; }
      gelembung("Udah, makasih ya.", true);
      pilihanEl.innerHTML = "";
      await bicara([PAMIT[siapa]], s);
      if (s !== sesi) return;
      if (!K.pernah(`dengar:${siapa}`)) { K.catat(`dengar:${siapa}`); K.catat("dengar"); }
      tampilTopik(true);
    });
  }

  $("#chatKembali").addEventListener("click", () => K.ke("s-pantry"));

  // awal: buka gosip yang syaratnya sudah terpenuhi tanpa memo
  cekGosip(true);
  tandaiLift();
  K.cekGosip = cekGosip;
})();
