/* =========================================================
   Kantor Layanan Perasaan · Lobi "Main Berdua Online"
   Buat room → bagikan kode/tautan → teman gabung → pilih game
   → main di HP masing-masing. Ada stiker emote di lobi & game.
   ========================================================= */
(() => {
  "use strict";
  const K = window.KLP;
  const { $, esc, px, sfx, memo, NAMA } = K;
  const NET = () => K.NET;

  const GAME_ONLINE = {
    rally: { nama: "Rally Online", sprite: "kura", ket: "Saling pukul kok. Yang duluan 7 poin menang." },
    stempel: { nama: "Stempel Rebutan", sprite: "berkas", ket: "Berkas yang sama untuk berdua. Siapa cepat dan benar, dia dapat poin." },
    kertas: { nama: "Rebutan Kertas", sprite: "saran", ket: "Dua map, satu kipas angin. Tangkap kertas lebih banyak dari teman." },
    ngemil: { nama: "Ngemil Berdua", sprite: "gorengan", ket: "Ngemil diam-diam bareng. Ketahuan Oyen 3 kali, keluar." },
    troli: { nama: "Grand Prix Berdua", sprite: "kursi", ket: "Balapan berdua plus 4 bot, lengkap dengan item dan drift." },
    moba: { nama: "Legenda Lantai 2", sprite: "badak", ket: "Arena hero. Satu tim melawan bot, atau saling lawan.", opsi: [["tim", "Satu tim"], ["lawan", "Saling lawan"]] },
    royale: { nama: "Kantor Royale", sprite: "payung", ket: "Battle royale. Duo satu regu, atau saling lawan.", opsi: [["duo", "Duo satu regu"], ["lawan", "Saling lawan"]] },
  };
  K.GAME_ONLINE = GAME_ONLINE;
  const EMOTE = [["Ayo!", "badak"], ["GG", "oyen"], ["Wkwk", "marmut"], ["Siap!", "kura"], ["Hehe", "kapibara"], ["Mantap!", "singa"], ["Tunggu", "kukang"], ["Ampun", "rakun"]];
  K.EMOTE = EMOTE;

  /* ---------- lapisan lobi ---------- */
  const lapis = document.createElement("div");
  lapis.className = "online"; lapis.id = "onlineLobi"; lapis.hidden = true;
  lapis.setAttribute("role", "dialog"); lapis.setAttribute("aria-modal", "true"); lapis.setAttribute("aria-label", "Main berdua online");
  lapis.innerHTML = `<div class="online-isi" id="onlineIsi"></div>`;
  document.body.appendChild(lapis);
  const isi = $("#onlineIsi");
  let pilihan = { game: "troli", opsi: {} }, menungguTeman = false;

  const profil = () => {
    const s = K.data.setelan.online || {};
    return { nama: (s.nama || NAMA).slice(0, 12), sprite: s.sprite || "kapibara", kendaraan: K.data.setelan.balap?.kendaraan || "troli", hero: K.data.setelan.moba || "kura" };
  };
  function buka(kodeAwal) {
    lapis.hidden = false; document.body.classList.add("layar-penuh");
    if (NET().aktif) layarLobi(); else layarAwal(kodeAwal);
  }
  function tutup() {
    lapis.hidden = true;
    if (document.getElementById("arena").hidden) document.body.classList.remove("layar-penuh");
  }
  K.bukaOnline = buka;

  /* ---------- layar awal: buat / gabung ---------- */
  function layarAwal(kodeAwal = "") {
    const p = profil();
    isi.innerHTML = `
      <button class="online-tutup" type="button" data-o="tutup" aria-label="Tutup">✕</button>
      <h2 class="online-judul">Main Berdua Online</h2>
      <p class="muted">Main bareng teman di HP masing-masing. Satu orang membuat room, yang lain memasukkan kodenya.</p>
      <div class="online-profil">
        <label class="ap-label" for="onNama">Nama kamu</label>
        <input id="onNama" class="da-nama" maxlength="12" value="${esc(p.nama)}">
        <div class="gp-karakter">${["kapibara", "kura", "marmut", "kukang", "oyen", "badak", "rakun", "berang", "singa", "gajah", "hantu", "beruang"].map((k) => `<button type="button" class="da-kar${p.sprite === k ? " dipilih" : ""}" data-spr="${k}" aria-label="${k}">${px(k)}</button>`).join("")}</div>
      </div>
      <div class="online-pilihan">
        <button class="btn primary online-besar" type="button" data-o="buat">Buat room</button>
        <div class="online-gabung">
          <input id="onKode" class="online-kode-input" maxlength="5" placeholder="KODE" value="${esc(kodeAwal)}" autocomplete="off" autocapitalize="characters" aria-label="Kode room">
          <button class="btn online-besar" type="button" data-o="gabung">Gabung</button>
        </div>
      </div>
      <p class="online-status" id="onStatus" aria-live="polite"></p>
      <details class="online-tips"><summary>Kalau susah tersambung</summary>
        <p>Sambungan dibuat langsung antar-HP. Di sebagian jaringan seluler kadang gagal. Paling lancar kalau dua HP memakai Wi-Fi yang sama, atau satu HP menyalakan hotspot dan HP lain tersambung ke hotspot itu.</p>
      </details>`;
    isi.onclick = async (e) => {
      const spr = e.target.closest("[data-spr]");
      if (spr) { simpanProfil({ sprite: spr.dataset.spr }); isi.querySelectorAll("[data-spr]").forEach((b) => b.classList.toggle("dipilih", b === spr)); sfx("pilih"); return; }
      const b = e.target.closest("[data-o]");
      if (!b) return;
      simpanProfil({ nama: ($("#onNama").value.trim() || NAMA).slice(0, 12) });
      if (b.dataset.o === "tutup") { tutup(); return; }
      if (b.dataset.o === "buat") await buatRoom();
      if (b.dataset.o === "gabung") await gabung($("#onKode").value);
    };
    if (kodeAwal) setTimeout(() => gabung(kodeAwal), 300);
  }
  function simpanProfil(ubah) { K.data.setelan.online = { ...profil(), ...ubah }; K.simpan(); }
  const status = (t, buruk) => { const el = $("#onStatus"); if (el) { el.textContent = t; el.classList.toggle("buruk", !!buruk); } };
  const PESAN_GAGAL = { pustaka: "Mesin online belum termuat. Pastikan internet nyala.", server: "Server perantara tidak bisa dihubungi. Coba lagi sebentar.", "tidak-ada": "Room dengan kode itu tidak ditemukan. Cek lagi kodenya.", penuh: "Room itu sudah penuh.", waktu: "Kelamaan menunggu. Coba lagi, atau pakai Wi-Fi/hotspot yang sama." };

  async function buatRoom() {
    status("Membuat room...");
    menungguTeman = true;
    try {
      const kode = await NET().buatRoom(profil(), (k) => layarTunggu(k));
      void kode;
    } catch (err) { menungguTeman = false; status(PESAN_GAGAL[err.message] || "Gagal membuat room.", true); }
  }
  async function gabung(kode) {
    kode = String(kode || "").toUpperCase().trim();
    if (kode.length < 5) { status("Kodenya 5 huruf/angka.", true); return; }
    status("Menyambung ke room " + kode + "...");
    try { await NET().gabung(kode, profil()); sfx("tingtong"); layarLobi(); }
    catch (err) { status(PESAN_GAGAL[err.message] || "Gagal tersambung.", true); }
  }

  function layarTunggu(kode) {
    const tautan = `${location.origin}${location.pathname}?room=${kode}`;
    isi.innerHTML = `
      <button class="online-tutup" type="button" data-o="batal" aria-label="Batal">✕</button>
      <h2 class="online-judul">Room dibuat</h2>
      <p class="muted">Bagikan kode ini ke teman. Dia buka situs ini, pilih Main Berdua Online, lalu masukkan kodenya.</p>
      <p class="online-kode mono">${kode}</p>
      <div class="actions">
        <button class="btn primary" type="button" data-o="bagi">Bagikan tautan</button>
        <a class="btn" href="https://wa.me/?text=${encodeURIComponent(`Main bareng di Kantor Layanan Perasaan! Kode room: ${kode} ${tautan}`)}" target="_blank" rel="noopener">Kirim lewat WhatsApp</a>
      </div>
      <p class="online-status" id="onStatus"><span class="titik-tunggu"></span> Menunggu teman bergabung...</p>`;
    isi.onclick = async (e) => {
      const b = e.target.closest("[data-o]");
      if (!b) return;
      if (b.dataset.o === "batal") { menungguTeman = false; NET().tutup(); layarAwal(); }
      if (b.dataset.o === "bagi") {
        try { if (navigator.share) await navigator.share({ title: "Main bareng", text: `Kode room: ${kode}`, url: tautan }); else { await navigator.clipboard.writeText(tautan); memo("Pak Satpam · Keamanan", "Siap. Tautan room disalin. Tempel di chat teman Anda."); } } catch { /* dibatalkan */ }
      }
    };
  }

  /* ---------- lobi: berdua sudah terhubung ---------- */
  function layarLobi() {
    menungguTeman = false;
    const n = NET(), saya = profil(), host = n.peran === "host";
    const g = GAME_ONLINE[pilihan.game];
    isi.innerHTML = `
      <button class="online-tutup" type="button" data-o="keluar" aria-label="Keluar room">✕</button>
      <h2 class="online-judul">Room ${esc(n.kode || "")}</h2>
      <div class="online-duo">
        <div class="od-pemain biru"><span class="avatar">${px(saya.sprite)}</span><b>${esc(saya.nama)}</b><small>${host ? "Tuan rumah" : "Tamu"} · kamu</small></div>
        <span class="od-vs">VS</span>
        <div class="od-pemain oranye"><span class="avatar">${px(n.teman?.sprite || "marmut")}</span><b>${esc(n.teman?.nama || "Teman")}</b><small>${host ? "Tamu" : "Tuan rumah"} · <span id="onPing">${n.ping} ms</span></small></div>
      </div>
      <div class="online-emote">${EMOTE.map(([t, s], i) => `<button type="button" class="em-btn" data-em="${i}"><span class="avatar avatar-sm">${px(s)}</span>${esc(t)}</button>`).join("")}</div>
      <h3 class="sub-judul">${host ? "Pilih game" : "Game pilihan tuan rumah"}</h3>
      <div class="online-game">${Object.entries(GAME_ONLINE).map(([id, gm]) => `
        <button type="button" class="og-kartu${pilihan.game === id ? " dipilih" : ""}" data-g="${id}" ${host ? "" : "disabled"}>
          <span class="avatar">${px(gm.sprite)}</span><strong>${esc(gm.nama)}</strong><small>${esc(gm.ket)}</small>
        </button>`).join("")}</div>
      ${g.opsi ? `<div class="pilih-tampilan online-opsi">${g.opsi.map(([v, t]) => `<button type="button" class="chip${(pilihan.opsi.mode || g.opsi[0][0]) === v ? " dipilih" : ""}" data-mode="${v}" ${host ? "" : "disabled"}>${esc(t)}</button>`).join("")}</div>` : ""}
      <div class="actions">${host ? `<button class="btn primary online-besar" type="button" data-o="mulai">Mulai: ${esc(g.nama)}</button>` : `<p class="online-status"><span class="titik-tunggu"></span> Menunggu tuan rumah menekan Mulai...</p>`}</div>`;
    isi.onclick = (e) => {
      const em = e.target.closest("[data-em]");
      if (em) { kirimEmote(Number(em.dataset.em)); return; }
      const b = e.target.closest("[data-o],[data-g],[data-mode]");
      if (!b) return;
      if (b.dataset.o === "keluar") { NET().tutup("keluar"); tutup(); return; }
      if (!host) return;
      if (b.dataset.g) { pilihan = { game: b.dataset.g, opsi: {} }; sfx("pilih"); NET().kirim({ t: "pilih", ...pilihan }); layarLobi(); }
      if (b.dataset.mode) { pilihan.opsi.mode = b.dataset.mode; sfx("pilih"); NET().kirim({ t: "pilih", ...pilihan }); layarLobi(); }
      if (b.dataset.o === "mulai") {
        const gm = GAME_ONLINE[pilihan.game];
        if (gm.opsi && !pilihan.opsi.mode) pilihan.opsi.mode = gm.opsi[0][0];
        const benih = Math.floor(Math.random() * 1e9);
        NET().kirim({ t: "mulai", game: pilihan.game, opsi: pilihan.opsi, benih });
        mulaiGame(pilihan.game, pilihan.opsi, benih);
      }
    };
  }
  function kirimEmote(i) {
    const [t, s] = EMOTE[i];
    NET().kirim({ t: "emote", i });
    K.WOW?.emote(profil().sprite, t, false); sfx("pilih");
    void s;
  }
  K.kirimEmote = kirimEmote;

  function mulaiGame(game, opsi, benih) {
    tutup();
    K.mulaiOnline?.(game, { peran: NET().peran, opsi, benih, teman: NET().teman, saya: profil() });
  }

  /* ---------- pesan dari teman ---------- */
  const n0 = () => NET();
  setTimeout(() => {
    const n = n0();
    if (!n) return;
    n.on("terhubung", () => { if (!lapis.hidden || menungguTeman) { sfx("tingtong"); K.WOW?.teks("TERHUBUNG!", "#7FD18B", `${n.teman.nama} masuk room`); layarLobi(); } });
    n.on("pilih", (o) => { if (GAME_ONLINE[o.game]) { pilihan = { game: o.game, opsi: o.opsi || {} }; if (!lapis.hidden) layarLobi(); } });
    n.on("mulai", (o) => { if (GAME_ONLINE[o.game]) { pilihan = { game: o.game, opsi: o.opsi || {} }; mulaiGame(o.game, o.opsi || {}, o.benih); } });
    n.on("emote", (o) => { const e = EMOTE[o.i]; if (e) { K.WOW?.emote(n.teman?.sprite || e[1], e[0], true); sfx("klik"); } });
    n.on("putus", (o) => {
      memo("Pak Satpam · Keamanan", `Siap. Sambungan dengan teman terputus (${o.alasan || "tidak diketahui"}).`, 6000);
      K.onlinePutus?.();
      if (!lapis.hidden) layarAwal();
    });
    n.on("kembaliLobi", () => { if (n.aktif) buka(); });
    setInterval(() => { const el = document.getElementById("onPing"); if (el && n.aktif) el.textContent = `${n.ping} ms`; }, 1500);
  }, 0);
  K.kembaliLobiOnline = () => { if (NET()?.aktif) buka(); };

  // tautan undangan ?room=KODE langsung membuka layar gabung
  const kodeUrl = new URLSearchParams(location.search).get("room");
  if (kodeUrl) {
    let dibuka = false;
    const bukaSekali = () => { if (!dibuka) { dibuka = true; buka(kodeUrl.toUpperCase()); } };
    setTimeout(() => { if (K.data.sudahMasuk) bukaSekali(); else K.on?.("layar", (id) => { if (id === "s-lobi" || id === "s-istirahat") bukaSekali(); }); }, 800);
  }
})();
