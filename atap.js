/* =========================================================
   Kantor Layanan Perasaan · Lantai A · ATAP BIRU
   Siklus: main puzzle "Rapikan Atap" → dapat bintang & koin →
   renovasi sudut atap (pilih gaya sendiri) → surat & episode
   cerita terbuka → atap makin bagus, lemari makin lengkap.
   Berdua: Lomba Rapikan (papan sama, siapa cepat) dan
   Main ke Atap (berkunjung, kasih cap & hadiah).
   ========================================================= */
(() => {
  "use strict";
  const K = window.KLP;
  const { $, esc, px, sfx, memo, NAMA } = K;
  const D = K.ATAP_DATA, G = K.ATAP_GAMBAR, PZ = K.PUZZLE;
  const N = (t) => String(t).replaceAll("{N}", NAMA);

  /* ---------- data tersimpan ---------- */
  function A() {
    const a = (K.data.atap ||= {});
    const awal = { bintang: 0, bintangTotal: 0, koin: 0, level: 1, tugas: {}, episode: [], punya: [], hadiah: [], cap: [], harian: { tgl: null, n: 0 }, surat: "", menang: 0, main: 0 };
    for (const [k, v] of Object.entries(awal)) if (a[k] === undefined || typeof a[k] !== typeof v || Array.isArray(v) !== Array.isArray(a[k])) a[k] = v;
    if (!a.baju || typeof a.baju !== "object") a.baju = {};
    for (const [k, v] of Object.entries(D.BAJU_AWAL)) if (a.baju[k] === undefined) a.baju[k] = v;   // isi di tempat, jangan diganti objek baru
    return a;
  }
  const sudah = (id) => A().tugas[id] !== undefined;
  const areaBeres = (ar) => ar.tugas.every((t) => sudah(t.id));
  const areaKini = () => D.AREA.find((ar) => !areaBeres(ar)) || null;
  const jumlahBeres = () => D.AREA.filter(areaBeres).length;
  const episodeTersedia = () => D.CERITA.filter((c) => (c.syarat === null || areaBeres(D.AREA.find((ar) => ar.id === c.syarat))) && !A().episode.includes(c.id));
  const punyaBaju = (kat, id) => { const it = D.LEMARI[kat].isi.find((x) => x[0] === id); return !it || it[2] === 0 || A().punya.includes(`${kat}:${id}`) || D.BAJU_AWAL[kat] === id; };

  /* =========================================================
     LAYAR LANTAI A
     ========================================================= */
  const ruang = $("#ruangAtap");
  let kanvasAtap = null, putar = 0;
  function isi() {
    const a = A(), ar = areaKini();
    const ep = episodeTersedia();
    ruang.innerHTML = `
      <div class="form-head"><span class="loket-badge">Lantai A</span><span class="mono small atap-dompet">★ <b>${a.bintang}</b> · Koin <b>${a.koin}</b></span></div>
      <h2 id="h-atap">Atap Biru</h2>
      <p class="atap-sub muted">${ar ? `Sudut yang sedang dirapikan: <b>${esc(ar.nama)}</b>. ${jumlahBeres()}/7 sudut beres.` : "Semua sudut beres. Atapnya resmi milik kamu. Level puzzle tetap jalan terus."}</p>
      <div class="atap-pemandangan">
        <canvas id="atapKanvas" width="160" height="200" role="img" aria-label="Pemandangan atap kantor"></canvas>
        ${ep.length ? `<button class="btn small primary atap-surat-btn" type="button" data-a="cerita">Ada surat baru di kotak surat</button>` : ""}
      </div>
      <div class="atap-mainkan">
        <button class="btn primary atap-besar" type="button" data-a="main">Rapikan Atap · Level ${a.level}</button>
        <p class="small muted">Menang satu level = 1 bintang + koin. Kalah tidak mengurangi apa-apa.</p>
      </div>
      ${ar ? `
      <section class="atap-area" aria-labelledby="h-area">
        <div class="aa-kepala"><span class="avatar">${px(ar.sprite)}</span><div><h3 id="h-area" class="sub-judul">${esc(ar.nama)}</h3><p class="small muted">${esc(ar.ket)}</p></div></div>
        <div class="aa-bar" aria-hidden="true"><i style="width:${(ar.tugas.filter((t) => sudah(t.id)).length / ar.tugas.length) * 100}%"></i></div>
        <ul class="aa-tugas">${ar.tugas.map((t) => `
          <li class="${sudah(t.id) ? "beres" : ""}">
            <span class="aa-nama">${esc(t.nama)}${sudah(t.id) && t.gaya ? `<small>${esc(t.gaya[a.tugas[t.id]][1])}</small>` : ""}</span>
            ${sudah(t.id) ? (t.gaya ? `<button class="btn small" type="button" data-gaya="${t.id}">Ganti gaya</button>` : `<span class="mono small">beres</span>`)
              : `<button class="btn small ${a.bintang >= t.harga ? "primary" : ""}" type="button" data-kerja="${t.id}">Kerjakan ★${t.harga}</button>`}
          </li>`).join("")}
        </ul>
      </section>` : ""}
      ${D.SEMUA_TUGAS.some((t) => t.gaya && sudah(t.id) && !(ar && t.area === ar.id)) ? `
      <details class="atap-gaya-lama"><summary>Ubah gaya sudut yang sudah beres</summary>
        <ul class="aa-tugas">${D.SEMUA_TUGAS.filter((t) => t.gaya && sudah(t.id) && !(ar && t.area === ar.id)).map((t) => `
          <li><span class="aa-nama">${esc(t.nama)}<small>${esc(t.gaya[a.tugas[t.id]][1])}</small></span><button class="btn small" type="button" data-gaya="${t.id}">Ganti</button></li>`).join("")}</ul>
      </details>` : ""}
      <div class="atap-menu">
        <button class="am-tombol" type="button" data-a="lemari"><span class="avatar">${px("kaus")}</span><b>Lemari</b><small>Baju & aksesori</small></button>
        <button class="am-tombol" type="button" data-a="buku"><span class="avatar">${px("kotakSurat")}</span><b>Surat dari R.</b><small>${a.episode.length}/${D.CERITA.length} dibaca</small></button>
        <button class="am-tombol" type="button" data-a="kartu"><span class="avatar">${px("kartu")}</span><b>Kartu pamer</b><small>Simpan & kirim</small></button>
        <button class="am-tombol" type="button" data-a="berdua"><span class="avatar">${px("marmut")}</span><b>Main berdua</b><small>Lomba & berkunjung</small></button>
      </div>
      ${a.hadiah.length || a.cap.length ? `<p class="small muted atap-dari-teman">${a.hadiah.length ? `Hadiah dari teman: ${a.hadiah.slice(-3).map((h) => `${esc(D.HADIAH.find((x) => x.id === h.id)?.nama || h.id)} dari ${esc(h.dari)}`).join(", ")}. ` : ""}${a.cap.length ? `Cap terakhir: "${esc(a.cap[a.cap.length - 1].teks)}" dari ${esc(a.cap[a.cap.length - 1].dari)}.` : ""}</p>` : ""}
      <div class="actions"><button class="btn ghost" type="button" data-go="s-lobi">← Lobi</button></div>`;
    K.pasangSprite?.(ruang);
    kanvasAtap = $("#atapKanvas");
    gambarAtap();
  }
  function gambarAtap() {
    if (!kanvasAtap || !kanvasAtap.isConnected) return;
    const a = A();
    G.atap(a, { t: performance.now() / 1000, suratBaru: episodeTersedia().length > 0 }).keKanvas(kanvasAtap);
  }
  function mulaiPutar() { berhentiPutar(); putar = setInterval(() => { if (!document.hidden) gambarAtap(); }, 160); }
  function berhentiPutar() { clearInterval(putar); putar = 0; }

  K.saatMasuk["s-atap"] = () => {
    isi(); mulaiPutar();
    const a = A();
    if (!a.episode.includes("prolog")) setTimeout(() => putarCerita("prolog"), 350);
  };
  if (K.saatKeluar) { const lama = K.saatKeluar["s-atap"]; K.saatKeluar["s-atap"] = () => { lama?.(); berhentiPutar(); }; }

  ruang.addEventListener("click", (e) => {
    const b = e.target.closest("[data-a], [data-kerja], [data-gaya]");
    if (!b) {
      if (e.target.id === "atapKanvas") { sfx("meong"); }
      return;
    }
    if (b.dataset.kerja) return kerjakan(b.dataset.kerja);
    if (b.dataset.gaya) return pilihGaya(b.dataset.gaya, true);
    const aksi = b.dataset.a;
    if (aksi === "main") bukaPuzzle(A().level);
    else if (aksi === "cerita") { const ep = episodeTersedia()[0]; if (ep) putarCerita(ep.id); }
    else if (aksi === "lemari") bukaLemari();
    else if (aksi === "buku") bukaBukuSurat();
    else if (aksi === "kartu") buatKartu(b);
    else if (aksi === "berdua") K.bukaOnline?.();
  });

  /* ---------- renovasi ---------- */
  function kerjakan(id) {
    const t = D.SEMUA_TUGAS.find((x) => x.id === id);
    const a = A();
    if (!t || sudah(id)) return;
    if (a.bintang < t.harga) {
      sfx("salah");
      memo("Pak Satpam · Keamanan", `Siap. Bintangnya kurang ${t.harga - a.bintang}. Satu level Rapikan Atap = satu bintang. Tidak ada jalan pintas, sudah saya periksa.`);
      return;
    }
    if (t.gaya) { pilihGaya(id, false); return; }
    selesaiTugas(t, 0);
  }
  function selesaiTugas(t, gaya) {
    const a = A();
    const ar = D.AREA[t.ai];
    a.bintang -= t.harga; a.tugas[t.id] = gaya; K.simpan();
    K.catat("atap:tugas");
    sfx("poin"); K.WOW?.hp(40);
    const kv = $("#atapKanvas");
    if (kv) { const r = kv.getBoundingClientRect(); K.WOW?.ledak(r.left + r.width / 2, r.top + r.height * 0.6, ["#3E78C4", "#F2C14E", "#FFFDF6", "#7FC8F2"], 26, { kuat: 5 }); }
    isi();
    const [sp, nama, kata] = t.kata;
    memo(`${nama}`, kata, 5200);
    if (areaBeres(ar)) {
      K.WOW?.teks(`${ar.nama.toUpperCase()} BERES`, "#F2C14E", "Ada surat baru di kotak surat");
      K.WOW?.hujan(); sfx("menang");
      const ep = D.CERITA.find((c) => c.syarat === ar.id);
      if (ep) setTimeout(() => putarCerita(ep.id), 1600);
    }
    void sp;
  }

  /* ---------- pilih gaya (dengan pratinjau) ---------- */
  const lapisGaya = buatLapis("atap-gaya-lapis", "Pilih gaya");
  function pilihGaya(id, ganti) {
    const t = D.SEMUA_TUGAS.find((x) => x.id === id);
    const a = A();
    let pilih = ganti ? a.tugas[id] : 0;
    const isiLapis = () => {
      const pratinjau = { ...a, tugas: { ...a.tugas, [id]: pilih } };
      lapisGaya.isi.innerHTML = `
        <button class="atap-tutup" type="button" data-x aria-label="Tutup">✕</button>
        <h2 class="atap-judul">${esc(t.nama)}</h2>
        <p class="small muted">${ganti ? "Ganti gaya gratis, kapan saja." : `Biaya ★${t.harga}. Gayanya bisa diganti lagi nanti, gratis.`}</p>
        <canvas class="gaya-pratinjau" width="160" height="200" aria-label="Pratinjau atap"></canvas>
        <div class="gaya-pilihan" role="radiogroup">${t.gaya.map(([gid, nama], i) => `<button type="button" class="chip${i === pilih ? " dipilih" : ""}" role="radio" aria-checked="${i === pilih}" data-g="${i}">${esc(nama)}</button>`).join("")}</div>
        <div class="actions"><button class="btn primary" type="button" data-ok>${ganti ? "Pakai gaya ini" : `Pasang · ★${t.harga}`}</button></div>`;
      G.atap(pratinjau, { t: performance.now() / 1000 }).keKanvas(lapisGaya.isi.querySelector("canvas"));
    };
    lapisGaya.buka();
    isiLapis();
    lapisGaya.isi.onclick = (e) => {
      if (e.target.closest("[data-x]")) { lapisGaya.tutup(); return; }
      const g = e.target.closest("[data-g]");
      if (g) { pilih = Number(g.dataset.g); sfx("pilih"); isiLapis(); return; }
      if (e.target.closest("[data-ok]")) {
        lapisGaya.tutup();
        if (ganti) { a.tugas[id] = pilih; K.simpan(); sfx("poin"); isi(); memo("Bu Ratna · Loket A", "Gayanya sudah diganti ya. Atapnya ikut senang.", 3500); }
        else selesaiTugas(t, pilih);
      }
    };
  }

  /* ---------- lapisan (modal) sederhana ---------- */
  function buatLapis(kelas, label) {
    const el = document.createElement("div");
    el.className = `atap-lapis ${kelas}`; el.hidden = true;
    el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true"); el.setAttribute("aria-label", label);
    el.innerHTML = `<div class="atap-lapis-isi"></div>`;
    document.body.appendChild(el);
    return {
      el, isi: el.firstElementChild,
      buka() { el.hidden = false; document.body.classList.add("atap-modal"); },
      tutup() { el.hidden = true; if (!document.querySelector(".atap-lapis:not([hidden])")) document.body.classList.remove("atap-modal"); },
    };
  }

  /* =========================================================
     PUZZLE LAYAR PENUH
     ========================================================= */
  const lapisMain = document.createElement("div");
  lapisMain.className = "atap-puzzle"; lapisMain.hidden = true;
  lapisMain.setAttribute("role", "dialog"); lapisMain.setAttribute("aria-modal", "true"); lapisMain.setAttribute("aria-label", "Rapikan Atap");
  lapisMain.innerHTML = `
    <div class="ap-kepala-pz"><button class="btn small" type="button" data-pz="keluar">✕ Keluar</button><strong id="pzJudul">Level 1</strong><span class="mono">Skor <b id="pzSkor">0</b></span></div>
    <div class="pz-panggung" id="pzPanggung"><canvas id="pzKanvas"></canvas><div class="pz-hasil" id="pzHasil" hidden></div></div>
    <p class="pz-info" id="pzInfo"></p>`;
  document.body.appendChild(lapisMain);
  const pzKanvas = $("#pzKanvas"), pzCtx = pzKanvas.getContext("2d");
  let pz = null, pzLevel = 1, pzRaf = 0, pzLalu = 0, pzW = 360, pzH = 560, pzSkala = 1, sesiDetik = 0, sudahIngatkan = false;

  function ukurPz() {
    const r = $("#pzPanggung").getBoundingClientRect();
    const cssW = Math.min(r.width, 480), cssH = Math.min(r.height, 760);
    const dpr = Math.min(2, devicePixelRatio || 1);
    pzKanvas.style.width = `${cssW}px`; pzKanvas.style.height = `${cssH}px`;
    pzKanvas.width = Math.round(cssW * dpr); pzKanvas.height = Math.round(cssH * dpr);
    pzSkala = cssW / 360; pzW = 360; pzH = cssH / pzSkala;
    pzCtx.setTransform(dpr * pzSkala, 0, 0, dpr * pzSkala, 0, 0);
    pz?.aturTata(pzW, pzH);
  }
  addEventListener("resize", () => { if (!lapisMain.hidden) ukurPz(); });

  function opsiWow(kanvas, getTata) {
    return (jenis, r, c) => {
      const tata = getTata(); if (!tata || !K.WOW) return;
      const rc = kanvas.getBoundingClientRect(), s = rc.width / 360;
      const x = rc.left + (tata.x + (c + 0.5) * tata.uk) * s, y = rc.top + (tata.y + (r + 0.5) * tata.uk) * s;
      if (jenis === "ledak") { K.WOW.ledak(x, y, ["#7FC8F2", "#3E78C4", "#FFFDF6"], 16, { kuat: 4 }); K.WOW.hp(30); }
      else if (jenis === "bintang" || jenis === "bintangBaru") { K.WOW.ledak(x, y, ["#3E78C4", "#7FC8F2", "#F2C14E", "#FFFDF6"], 30, { kuat: 6 }); K.WOW.getar(0.8, 0.25); K.WOW.hp(60); }
      else if (jenis === "combo") { K.WOW.getar(0.5, 0.15); K.WOW.hp(25); }
      else if (jenis === "menang") { K.WOW.kilat("rgba(127,200,242,.3)"); }
    };
  }

  function bukaPuzzle(n) {
    pzLevel = n;
    document.body.classList.add("layar-penuh");
    lapisMain.hidden = false;
    $("#pzHasil").hidden = true;
    $("#pzJudul").textContent = `Level ${n}`;
    const L = PZ.buatLevel(n, { tingkat: K.data.setelan.tingkat });
    $("#pzInfo").textContent = L.info || `Sasaran ada di kiri atas. Langkah tersisa di kanan atas.`;
    ukurPz();
    pz = PZ.buat(L, {
      benih: n * 7 + A().main * 131,
      bunyi: sfx,
      ringan: K.kurangiGerak,
      wow: opsiWow(pzKanvas, () => pz?.tata),
      saatSelesai: (h) => setTimeout(() => hasilPuzzle(h), h.menang ? 900 : 500),
    });
    pz.aturTata(pzW, pzH);
    A().main++; K.simpan();
    pzLalu = performance.now();
    cancelAnimationFrame(pzRaf);
    const loop = (now) => {
      const dt = Math.min(0.05, (now - pzLalu) / 1000); pzLalu = now;
      if (!document.hidden && pz) {
        pz.tick(dt);
        sesiDetik += dt;
        if (!sudahIngatkan && sesiDetik > 25 * 60) { sudahIngatkan = true; memo("Mas Kukang · Bagian Fotokopi", "...sudah 25 menit merapikan atap. Atapnya tidak ke mana-mana. Matanya boleh istirahat sebentar. Lihat yang jauh-jauh dulu.", 8000); }
        gambarPz(now / 1000);
      }
      pzRaf = requestAnimationFrame(loop);
    };
    pzRaf = requestAnimationFrame(loop);
  }
  function gambarPz(t) {
    const c = pzCtx;
    c.clearRect(0, 0, pzW, pzH);
    // latar langit atap
    const g = c.createLinearGradient(0, 0, 0, pzH);
    g.addColorStop(0, "#8EC6EC"); g.addColorStop(1, "#DDEBF5");
    c.fillStyle = g; c.fillRect(0, 0, pzW, pzH);
    c.fillStyle = "rgba(255,255,255,.35)";
    for (let i = 0; i < 6; i++) c.fillRect((i * 83 + t * 6) % (pzW + 60) - 60, 80 + i * 70, 50, 8);
    pz.gambar(c, pzW, pzH, t);
    $("#pzSkor").textContent = pz.st.skor;
  }
  function tutupPuzzle() {
    cancelAnimationFrame(pzRaf); pzRaf = 0; pz = null;
    lapisMain.hidden = true;
    document.body.classList.remove("layar-penuh");
    if (K.layarAktif() === "s-atap") isi();
  }
  // sentuhan
  const titikPz = (e) => { const r = pzKanvas.getBoundingClientRect(); return [(e.clientX - r.left) / pzSkala, (e.clientY - r.top) / pzSkala]; };
  pzKanvas.addEventListener("pointerdown", (e) => { if (!pz) return; e.preventDefault(); pzKanvas.setPointerCapture?.(e.pointerId); pz.tekan(...titikPz(e)); });
  pzKanvas.addEventListener("pointermove", (e) => { if (pz) pz.geser(...titikPz(e)); });
  pzKanvas.addEventListener("pointerup", (e) => { if (pz) pz.lepas(...titikPz(e)); });
  pzKanvas.addEventListener("pointercancel", () => pz?.lepas(-1, -1));

  lapisMain.addEventListener("click", (e) => {
    const b = e.target.closest("[data-pz]");
    if (!b) return;
    const aksi = b.dataset.pz;
    if (aksi === "keluar") tutupPuzzle();
    else if (aksi === "lanjut") bukaPuzzle(A().level);
    else if (aksi === "ulang") bukaPuzzle(pzLevel);
    else if (aksi === "tambah" && pz) { pz.tambahLangkah(5); $("#pzHasil").hidden = true; sfx("pilih"); }
    else if (aksi === "renovasi") { tutupPuzzle(); if (K.layarAktif() !== "s-atap") K.ke("s-atap"); setTimeout(() => $(".atap-area")?.scrollIntoView({ behavior: "smooth", block: "center" }), 200); }
  });

  function hasilPuzzle(h) {
    if (!pz) return;
    const a = A();
    const kotak = $("#pzHasil");
    if (h.menang) {
      const koin = Math.min(45, 10 + Math.floor(h.skor / 350));
      a.bintang++; a.bintangTotal++; a.koin += koin; a.menang++;
      if (pzLevel === a.level) a.level++;
      // bonus harian
      let harian = "";
      const hari = K.hariIni();
      if (a.harian.tgl !== hari) {
        const kemarin = new Date(); kemarin.setDate(kemarin.getDate() - 1);
        const k = `${kemarin.getFullYear()}-${String(kemarin.getMonth() + 1).padStart(2, "0")}-${String(kemarin.getDate()).padStart(2, "0")}`;
        a.harian.n = a.harian.tgl === k ? a.harian.n + 1 : 1; a.harian.tgl = hari;
        const bonus = 15 + Math.min(6, a.harian.n) * 5;
        a.koin += bonus;
        harian = `<p class="pz-harian">Teh pagi dari Bu Ratna: +${bonus} koin${a.harian.n > 1 ? ` (naik atap ${a.harian.n} hari berturut-turut)` : ""}.</p>`;
      }
      const poin = K.tambahPoin(3 + Math.floor(h.skor / 1500));
      K.simpan();
      K.catat("game:atap", { skor: h.skor }); K.catat("game");
      const prog = K.progres?.lapor({ jenis: "solo", game: "atap", skor: h.skor, tingkat: K.data.setelan.tingkat, stat: { combo: h.comboMaks }, poin });
      sfx("menang"); K.WOW?.hujan(); K.WOW?.hp(120);
      const bisaRenov = (() => { const ar = areaKini(); return ar && ar.tugas.some((t) => !sudah(t.id) && t.harga <= a.bintang); })();
      kotak.innerHTML = `
        <p class="pz-besar">BERES!</p>
        <p class="pz-dapat">+1 ★ · +${koin} koin · +${poin} Poin Sabar</p>
        ${harian}
        ${K.progres && prog ? K.progres.htmlHasil(prog) : ""}
        <p class="small">${esc(["Pak Satpam: Siap. Satu bagian atap dinyatakan rapi.", "Oyen: ...Lumayan.", "Dimas: RAPI— eh. Rapi. Rapi sekali.", "Bu Ratna: Pelan-pelan juga sampai ya.", "Mas Kukang: ...cepat sekali. Saya masih memikirkan langkah pertama."][a.menang % 5])}</p>
        <div class="pz-tombol">
          ${bisaRenov ? `<button class="btn primary" type="button" data-pz="renovasi">Pakai bintang untuk renovasi</button>` : ""}
          <button class="btn ${bisaRenov ? "" : "primary"}" type="button" data-pz="lanjut">Level ${a.level}</button>
          <button class="btn ghost" type="button" data-pz="keluar">Ke atap</button>
        </div>`;
      if (prog?.naikPangkat) setTimeout(() => K.progres.rayakanPangkat(prog.naikPangkat), 900);
    } else {
      sfx("salah");
      const sisa = pz.st.target.filter((t) => t.sisa > 0).map((t) => `${t.sisa} ${t.j === "debu" ? "debu" : t.j === "kardus" ? "kardus" : PZ.JENIS[t.j].nama.toLowerCase()}`).join(", ");
      kotak.innerHTML = `
        <p class="pz-besar">Kurang sedikit</p>
        <p class="pz-dapat">Sisa: ${esc(sisa)}</p>
        <p class="small">Bu Ratna: Nggak apa-apa ya. Atapnya juga nggak dirapikan dalam sehari dulu.</p>
        <div class="pz-tombol">
          ${pz.st.tambahanDipakai ? "" : `<button class="btn primary" type="button" data-pz="tambah">+5 langkah (gratis, sekali)</button>`}
          <button class="btn" type="button" data-pz="ulang">Ulangi level</button>
          <button class="btn ghost" type="button" data-pz="keluar">Ke atap</button>
        </div>`;
    }
    kotak.hidden = false;
  }

  /* =========================================================
     CERITA: SURAT DARI ATAP
     ========================================================= */
  const lapisCerita = buatLapis("atap-cerita", "Surat dari Atap");
  function putarCerita(id, ulang = false) {
    const ep = D.CERITA.find((c) => c.id === id);
    if (!ep) return;
    let i = -1;
    lapisCerita.buka();
    const tampil = () => {
      const isiEl = lapisCerita.isi;
      if (i < 0) {
        isiEl.innerHTML = `<div class="ac-judul"><p class="mono small">SURAT DARI ATAP</p><h2>${esc(ep.judul)}</h2><button class="btn primary" type="button" data-lanjut>Mulai</button></div>`;
        return;
      }
      if (i >= ep.baris.length) {
        isiEl.innerHTML = `<div class="ac-judul ac-akhir"><p class="mono small">bersambung…</p><p>${esc(N(ep.bersambung))}</p><button class="btn primary" type="button" data-selesai>Tutup</button></div>`;
        if (!A().episode.includes(ep.id)) { A().episode.push(ep.id); K.simpan(); K.catat("atap:episode"); }
        return;
      }
      const b = ep.baris[i];
      const lewati = `<button class="atap-tutup" type="button" data-selesai-paksa aria-label="Tutup">✕</button>`;
      if (b[0] === "narasi") isiEl.innerHTML = `${lewati}<div class="ac-narasi"><p>${esc(N(b[1]))}</p></div><div class="actions"><button class="btn primary" type="button" data-lanjut>Lanjut</button></div>`;
      else if (b[0] === "surat") { isiEl.innerHTML = `${lewati}<div class="ac-surat"><p>${esc(N(b[1])).replaceAll("\n", "<br>")}</p></div><div class="actions"><button class="btn primary" type="button" data-lanjut>Lipat suratnya</button></div>`; sfx("kertas"); }
      else if (b[0] === "pilih") {
        isiEl.innerHTML = `${lewati}<div class="ac-narasi"><p><b>${esc(N(b[1]))}</b></p></div><div class="ac-pilih">${b[2].map(([label], j) => `<button class="btn" type="button" data-pilih="${j}">${esc(label)}</button>`).join("")}</div>`;
      } else if (b[0] === "tulis") {
        const lama = A().surat || "";
        isiEl.innerHTML = `${lewati}<div class="ac-surat ac-tulis"><label class="small" for="acTulis">${esc(b[1])}</label><textarea id="acTulis" maxlength="500" rows="7" placeholder="Untuk siapa pun yang nanti naik ke sini...">${esc(lama)}</textarea><p class="small muted">Disimpan di HP ini saja. Tidak dikirim ke mana-mana.</p></div><div class="actions"><button class="btn ghost" type="button" data-lanjut>Nanti saja</button><button class="btn primary" type="button" data-simpan-surat>Masukkan ke kotak surat</button></div>`;
      } else {
        const [sp, nama, teks] = b;
        isiEl.innerHTML = `${lewati}<div class="ac-bicara"><span class="avatar">${px(sp)}</span><div><b>${esc(nama)}</b><p>${esc(N(teks))}</p></div></div><div class="actions"><button class="btn primary" type="button" data-lanjut>Lanjut</button></div>`;
      }
    };
    lapisCerita.isi.onclick = (e) => {
      if (e.target.closest("[data-lanjut]")) { i++; sfx("klik"); tampil(); return; }
      const p = e.target.closest("[data-pilih]");
      if (p) {
        const [, sp, nama, balas] = ep.baris[i][2][Number(p.dataset.pilih)];
        sfx("pilih");
        lapisCerita.isi.innerHTML = `<div class="ac-bicara"><span class="avatar">${px(sp)}</span><div><b>${esc(nama)}</b><p>${esc(N(balas))}</p></div></div><div class="actions"><button class="btn primary" type="button" data-lanjut>Lanjut</button></div>`;
        return;
      }
      if (e.target.closest("[data-simpan-surat]")) {
        const v = $("#acTulis").value.trim().slice(0, 500);
        A().surat = v; K.simpan(); sfx("kertas");
        if (v) K.WOW?.ledak(innerWidth / 2, innerHeight / 2, ["#3E78C4", "#FFFDF6", "#F2C14E"], 20);
        i++; tampil(); return;
      }
      if (e.target.closest("[data-selesai]")) { lapisCerita.tutup(); if (K.layarAktif() === "s-atap") isi(); if (ep.id === "ep7" && !ulang) { K.WOW?.hujan(); K.konfetiKertas?.(1.4); } return; }
      if (e.target.closest("[data-selesai-paksa]")) { lapisCerita.tutup(); if (K.layarAktif() === "s-atap") isi(); }
    };
    tampil();
  }
  const lapisBuku = buatLapis("atap-buku", "Surat dari R.");
  function bukaBukuSurat() {
    const a = A();
    lapisBuku.isi.innerHTML = `
      <button class="atap-tutup" type="button" data-x aria-label="Tutup">✕</button>
      <h2 class="atap-judul">Surat dari R.</h2>
      <p class="small muted">Tiap sudut atap yang beres membuka satu episode. Yang sudah dibaca bisa diputar ulang.</p>
      <ul class="buku-daftar">${D.CERITA.map((c) => {
        const buka = a.episode.includes(c.id), siap = episodeTersedia().some((x) => x.id === c.id);
        return `<li class="${buka ? "" : "terkunci"}"><span>${esc(c.judul)}</span>${buka ? `<button class="btn small" type="button" data-ep="${c.id}">Baca lagi</button>` : siap ? `<button class="btn small primary" type="button" data-ep="${c.id}">Baca</button>` : `<span class="mono small">terkunci</span>`}</li>`;
      }).join("")}</ul>
      ${a.surat ? `<h3 class="sub-judul">Surat kamu di kotak surat</h3><div class="ac-surat"><p>${esc(a.surat).replaceAll("\n", "<br>")}</p></div>` : ""}`;
    lapisBuku.buka();
    lapisBuku.isi.onclick = (e) => {
      if (e.target.closest("[data-x]")) { lapisBuku.tutup(); return; }
      const b = e.target.closest("[data-ep]");
      if (b) { lapisBuku.tutup(); putarCerita(b.dataset.ep, A().episode.includes(b.dataset.ep)); }
    };
  }

  /* =========================================================
     LEMARI
     ========================================================= */
  const lapisLemari = buatLapis("atap-lemari", "Lemari");
  let tabLemari = "rambut";
  function bukaLemari() { lapisLemari.buka(); isiLemari(); }
  function isiLemari() {
    const a = A(), b = a.baju;
    const kat = D.LEMARI[tabLemari];
    const kunciWarna = { rambut: "wRambut", atas: "wAtas", bawah: "wBawah", sepatu: "wSepatu", aksesori: "wAks" }[tabLemari];
    const palet = tabLemari === "rambut" ? D.WARNA_RAMBUT : D.WARNA_BAJU;
    lapisLemari.isi.innerHTML = `
      <button class="atap-tutup" type="button" data-x aria-label="Tutup">✕</button>
      <h2 class="atap-judul">Lemari ${esc(NAMA)}</h2>
      <div class="lemari-atas">
        <canvas class="lemari-pratinjau" width="20" height="28" aria-label="Karakter kamu"></canvas>
        <div><p class="mono">Koin: <b>${a.koin}</b></p><p class="small muted">Warna bebas diganti. Model baru dibeli pakai koin dari puzzle. Tidak ada undian, tidak ada uang sungguhan.</p></div>
      </div>
      <div class="lemari-tab" role="tablist">${Object.entries(D.LEMARI).map(([k, v]) => `<button type="button" role="tab" class="chip${k === tabLemari ? " dipilih" : ""}" aria-selected="${k === tabLemari}" data-tab="${k}">${esc(v.nama)}</button>`).join("")}<button type="button" role="tab" class="chip${tabLemari === "kulit" ? " dipilih" : ""}" data-tab="kulit">Kulit</button></div>
      ${tabLemari === "kulit" ? `
        <div class="lemari-warna">${D.KULIT.map(([w, n], i) => `<button type="button" class="swatch${b.kulit === i ? " dipilih" : ""}" style="--w:${w}" data-kulit="${i}" aria-label="${esc(n)}"></button>`).join("")}</div>` : `
        <div class="lemari-isi">${kat.isi.map(([id, nama, harga]) => {
          const punya = punyaBaju(tabLemari, id), pakai = b[tabLemari] === id;
          return `<button type="button" class="lemari-item${pakai ? " dipakai" : ""}${punya ? "" : " terkunci"}" data-item="${id}"><canvas width="20" height="28" data-cob="${id}"></canvas><b>${esc(nama)}</b><small>${pakai ? "dipakai" : punya ? "punya" : `${harga} koin`}</small></button>`;
        }).join("")}</div>
        <p class="small muted">Warna ${esc(kat.nama.toLowerCase())}</p>
        <div class="lemari-warna">${palet.map(([w, n], i) => `<button type="button" class="swatch${b[kunciWarna] === i ? " dipilih" : ""}" style="--w:${w}" data-warna="${i}" aria-label="${esc(n)}"></button>`).join("")}</div>`}
      <div class="actions"><button class="btn primary" type="button" data-x>Selesai</button></div>`;
    G.avatar(b).keKanvas(lapisLemari.isi.querySelector(".lemari-pratinjau"));
    lapisLemari.isi.querySelectorAll("[data-cob]").forEach((c) => G.avatar({ ...b, [tabLemari]: c.dataset.cob }).keKanvas(c));
    lapisLemari.isi.onclick = (e) => {
      if (e.target.closest("[data-x]")) { lapisLemari.tutup(); if (K.layarAktif() === "s-atap") isi(); return; }
      const t = e.target.closest("[data-tab]"); if (t) { tabLemari = t.dataset.tab; sfx("klik"); isiLemari(); return; }
      const w = e.target.closest("[data-warna]"); if (w) { b[kunciWarna] = Number(w.dataset.warna); K.simpan(); sfx("pilih"); isiLemari(); return; }
      const kl = e.target.closest("[data-kulit]"); if (kl) { b.kulit = Number(kl.dataset.kulit); K.simpan(); sfx("pilih"); isiLemari(); return; }
      const it = e.target.closest("[data-item]");
      if (it) {
        const id = it.dataset.item, harga = kat.isi.find((x) => x[0] === id)[2];
        if (!punyaBaju(tabLemari, id)) {
          if (a.koin < harga) { sfx("salah"); memo("Bang Berang-berang · Koperasi", `Kabar baik: barangnya ada. Kabar kurang baik: koinnya kurang ${harga - a.koin}. Main beberapa level lagi ya.`); return; }
          a.koin -= harga; a.punya.push(`${tabLemari}:${id}`); sfx("poin"); K.WOW?.hp(40);
          const r = it.getBoundingClientRect(); K.WOW?.ledak(r.left + r.width / 2, r.top + r.height / 2, ["#3E78C4", "#F2C14E", "#FFFDF6"], 16);
        } else sfx("pilih");
        b[tabLemari] = id; K.simpan(); isiLemari();
      }
    };
  }

  /* =========================================================
     KARTU PAMER (gambar PNG untuk dikirim ke teman)
     ========================================================= */
  async function buatKartu(tombol) {
    const a = A();
    const c = document.createElement("canvas");
    c.width = 540; c.height = 760;
    const x = c.getContext("2d");
    x.imageSmoothingEnabled = false;
    x.fillStyle = "#FAF6EC"; x.fillRect(0, 0, c.width, c.height);
    x.strokeStyle = "rgba(47,74,107,.08)"; x.lineWidth = 1;
    for (let i = 0; i < c.width; i += 20) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, c.height); x.stroke(); }
    for (let i = 0; i < c.height; i += 20) { x.beginPath(); x.moveTo(0, i); x.lineTo(c.width, i); x.stroke(); }
    await document.fonts?.ready;
    x.fillStyle = "#2B2A26"; x.textAlign = "center";
    x.font = '34px "Pixelify Sans", monospace'; x.fillText(`Atap Biru milik ${NAMA}`, 270, 60);
    x.font = '18px "Pixelify Sans", monospace'; x.fillStyle = "#5D5A50";
    x.fillText(`Kantor Layanan Perasaan · Lantai A`, 270, 90);
    const sc = G.atap(a, { t: 0 }).keKanvas(document.createElement("canvas"));
    x.fillStyle = "#2B2A26"; x.fillRect(46, 112, 448, 560);
    x.drawImage(sc, 50, 116, 440, 552);
    x.font = '20px "Pixelify Sans", monospace'; x.fillStyle = "#2F4A6B";
    x.fillText(`Level ${a.level - 1} beres · ${jumlahBeres()}/7 sudut · ★ ${a.bintangTotal} total`, 270, 706);
    x.font = '16px "Pixelify Sans", monospace'; x.fillStyle = "#5D5A50";
    x.fillText(a.hadiah.length ? `Hadiah dari ${[...new Set(a.hadiah.map((h) => h.dari))].slice(0, 3).join(", ")}` : "Belum ada hadiah dari teman. Ajak berkunjung!", 270, 736);
    const blob = await new Promise((r) => c.toBlob(r, "image/png"));
    const namaFile = `atap-biru-${NAMA.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;
    try {
      const file = new File([blob], namaFile, { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) { await navigator.share({ files: [file], title: "Atap Biru", text: `Atap Biru milik ${NAMA}` }); return; }
    } catch (err) { if (err?.name === "AbortError") return; }
    const url = URL.createObjectURL(blob);
    const iOS = /iP(hone|ad|od)/.test(navigator.userAgent);
    if (iOS && $("#overlayGambar")) { $("#gambarHasil").src = c.toDataURL("image/png"); $("#overlayGambar").hidden = false; }
    else { const el = document.createElement("a"); el.href = url; el.download = namaFile; document.body.appendChild(el); el.click(); el.remove(); memo("Mas Kukang · Bagian Fotokopi", "Kartunya sudah saya cetak. Silakan dipamerkan. Pelan-pelan saja pamernya."); }
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    void tombol;
  }

  /* =========================================================
     MAIN BERDUA ONLINE
     ========================================================= */
  Object.assign(K.GAME_ONLINE || {}, {
    lomba: { nama: "Lomba Rapikan Atap", sprite: "kotakSurat", ket: "Puzzle Atap Biru dengan papan yang sama persis. Siapa yang beres duluan, menang." },
    kunjung: { nama: "Main ke Atap", sprite: "tanaman2", ket: "Saling berkunjung ke Atap Biru. Kasih cap dan kirim hadiah kecil." },
  });
  K.ONLINE_MAIN = K.ONLINE_MAIN || {};

  // Lomba Rapikan: papan sama (benih sama), status dikirim tiap gerakan
  K.ONLINE_MAIN.lomba = (api) => {
    const o = api.online, host = o.host, ctx = api.ctx;
    const benih = (o.benih ?? 777) >>> 0;
    const n = 7 + (benih % 18);
    const L = PZ.buatLevel(n);
    let p = null, akhir = null, akuSelesai = null, temanSt = { sisa: null, langkah: L.langkah, skor: 0, selesai: null }, waktu = 0, temanNama = o.teman?.nama || "Teman";
    const totalSisa = () => p.st.target.reduce((s, t) => s + Math.max(0, t.sisa), 0);
    let awalTotal = 1;
    const kirimStatus = () => o.kirim({ t: "lomba", sisa: totalSisa(), langkah: p.st.langkah, skor: p.st.skor, selesai: akuSelesai, w: waktu });
    p = PZ.buat(L, {
      benih, atas: 100, bunyi: sfx, ringan: K.kurangiGerak, wow: opsiWow(ctx.canvas, () => p?.tata),
      saatGerak: () => setTimeout(kirimStatus, 0), saatUbah: kirimStatus,
      saatSelesai: (h) => { akuSelesai = h.menang ? "menang" : "habis"; kirimStatus(); if (host) putuskan(); },
    });
    awalTotal = Math.max(1, totalSisa());
    ctx.canvas._uji = { get p() { return p; }, get akhir() { return akhir; } };   // untuk pengujian otomatis
    api.info(`Papan yang sama dengan ${temanNama}. Siapa beres duluan, menang.`);
    // tuan rumah memutuskan pemenang
    let urutanMenang = null;
    function putuskan() {
      if (akhir) return;
      if (akuSelesai === "menang" && !urutanMenang) urutanMenang = 1;
      if (temanSt.selesai === "menang" && !urutanMenang) urutanMenang = 2;
      let pemenang = null;
      if (urutanMenang) pemenang = urutanMenang;
      else if (akuSelesai && temanSt.selesai) {
        const a = totalSisa(), b = temanSt.sisa ?? 999;
        pemenang = a < b ? 1 : b < a ? 2 : p.st.skor > temanSt.skor ? 1 : temanSt.skor > p.st.skor ? 2 : 0;
      }
      if (pemenang === null) return;
      o.kirim({ t: "lombaHasil", pemenang });
      tutupLomba(pemenang === 0 ? "seri" : pemenang === 1);
    }
    o.on("lomba", (m) => { temanSt = { sisa: m.sisa, langkah: m.langkah, skor: m.skor, selesai: m.selesai }; if (host) putuskan(); });
    o.on("lombaHasil", (m) => { if (!host) tutupLomba(m.pemenang === 0 ? "seri" : m.pemenang === 2); });
    function tutupLomba(menang) {
      if (akhir) return;
      akhir = { menang, sisa: 2.6 };
      if (menang === true) { K.WOW?.hujan(); K.WOW?.hp(150); sfx("menang"); } else sfx(menang === "seri" ? "poin" : "salah");
    }
    setTimeout(kirimStatus, 300);
    // sentuhan
    const kv = ctx.canvas;
    const t2 = (e) => { const q = api.titik(e); return [q.x, q.y]; };
    const down = (e) => { if (!akhir) { e.preventDefault(); p.tekan(...t2(e)); } }, move = (e) => p.geser(...t2(e)), up = (e) => p.lepas(...t2(e));
    kv.addEventListener("pointerdown", down); kv.addEventListener("pointermove", move); kv.addEventListener("pointerup", up);
    const stop = api.loop((dt, t) => {
      waktu += dt;
      p.tick(dt);
      const W = api.W(), H = api.H();
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#CFE3F2"; ctx.fillRect(0, 0, W, H);
      p.gambar(ctx, W, H, t);
      // bilah teman
      ctx.fillStyle = "rgba(43,42,38,.82)"; ctx.fillRect(6, 62, W - 12, 32);
      ctx.font = '13px "Pixelify Sans", monospace'; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillStyle = "#F2C14E";
      ctx.fillText(`${temanNama}`, 14, 78);
      const sisaT = temanSt.sisa ?? awalTotal, prog = Math.max(0, Math.min(1, 1 - sisaT / awalTotal));
      ctx.fillStyle = "#3B4046"; ctx.fillRect(110, 72, W - 200, 12);
      ctx.fillStyle = "#E58B3A"; ctx.fillRect(110, 72, (W - 200) * prog, 12);
      ctx.fillStyle = "#FFFDF6"; ctx.textAlign = "right"; ctx.fillText(temanSt.selesai === "menang" ? "BERES" : `sisa ${sisaT} · ${temanSt.langkah} lgk`, W - 12, 78);
      api.skor(p.st.skor);
      if (akuSelesai === "habis" && !akhir) { ctx.fillStyle = "rgba(43,42,38,.7)"; ctx.fillRect(0, H / 2 - 30, W, 60); ctx.textAlign = "center"; ctx.fillStyle = "#FFFDF6"; ctx.font = '16px "Pixelify Sans", monospace'; ctx.fillText(`Langkah habis. Menunggu ${temanNama}...`, W / 2, H / 2); }
      if (akhir) {
        akhir.sisa -= dt;
        ctx.fillStyle = "rgba(43,42,38,.75)"; ctx.fillRect(0, H / 2 - 44, W, 88); ctx.textAlign = "center";
        ctx.font = '28px "Pixelify Sans", monospace'; ctx.fillStyle = akhir.menang === true ? "#F2C14E" : "#FFFDF6";
        ctx.fillText(akhir.menang === true ? "KAMU DULUAN!" : akhir.menang === "seri" ? "SERI" : `${temanNama} duluan`, W / 2, H / 2);
        if (akhir.sisa <= 0) {
          const menang = akhir.menang === true;
          stop2();
          const seri = akhir.menang === "seri";
          api.selesai((menang ? 60 : 25) + Math.min(40, Math.round(p.st.skor / 200)), [menang ? "kura" : "kapibara", menang ? "Pak Satpam: Siap. Atap Anda dinyatakan lebih rapi lebih dulu. Selamat." : seri ? "Bu Ratna: Seri ya. Dua atap sama rapinya. Itu jarang sekali." : "Bu Ratna: Kalah cepat sedikit ya. Atapnya tetap rapi kok."], { menang, judul: `${menang ? "MENANG" : akhir.menang === "seri" ? "SERI" : "KALAH"} · Lomba Rapikan Atap` });
        }
      }
    });
    function stop2() { stop(); kv.removeEventListener("pointerdown", down); kv.removeEventListener("pointermove", move); kv.removeEventListener("pointerup", up); }
    return stop2;
  };

  // Main ke Atap: dua atap saling dikunjungi
  K.ONLINE_MAIN.kunjung = (api) => {
    const o = api.online, ctx = api.ctx, a = A();
    const temanNama = o.teman?.nama || "Teman";
    let atapTeman = null, lihat = "teman", capTerkirim = 0, hadiahTerkirim = false, selesai = false;
    const kirimAtap = () => o.kirim({ t: "atapku", st: { tugas: a.tugas, baju: a.baju, hadiah: a.hadiah.slice(-6) }, level: a.level, sudut: jumlahBeres() });
    o.on("atapku", (m) => { if (m.st && typeof m.st === "object") { atapTeman = { tugas: m.st.tugas || {}, baju: { ...D.BAJU_AWAL, ...(m.st.baju || {}) }, hadiah: Array.isArray(m.st.hadiah) ? m.st.hadiah.slice(0, 6) : [], level: m.level | 0, sudut: m.sudut | 0 }; isiKontrol(); } });
    o.on("mintaAtap", kirimAtap);
    o.on("cap", (m) => {
      const teks = String(m.teks || "").slice(0, 30);
      a.cap.push({ teks, dari: temanNama }); a.cap = a.cap.slice(-20); K.simpan();
      K.WOW?.teks(`"${teks}"`, "#F2C14E", `cap dari ${temanNama} untuk atap kamu`); K.WOW?.hp(40); sfx("stempel");
    });
    o.on("hadiah", (m) => {
      const h = D.HADIAH.find((x) => x.id === m.id); if (!h) return;
      a.hadiah.push({ id: h.id, dari: temanNama.slice(0, 12), tgl: K.hariIni() }); a.hadiah = a.hadiah.slice(-12); K.simpan();
      K.WOW?.teks("DAPAT HADIAH!", "#7FC8F2", `${h.nama} dari ${temanNama}. Sudah dipasang di atap kamu.`); K.WOW?.hujan(); K.WOW?.hp(100); sfx("menang");
    });
    o.on("kunjungSelesai", () => akhiri(false));
    kirimAtap(); o.kirim({ t: "mintaAtap" });
    const minta = setInterval(() => { if (!atapTeman) o.kirim({ t: "mintaAtap" }); }, 1200);
    const CAP = ["Keren!", "Nyaman banget", "Rapi sekali", "Mau nginep", "Lampunya juara"];
    function isiKontrol() {
      api.kontrol.innerHTML = `
        <div class="kunjung-kontrol">
          <button class="btn small" type="button" data-k="lihat">${lihat === "teman" ? "Lihat atapku" : `Lihat atap ${esc(temanNama)}`}</button>
          <button class="btn small primary" type="button" data-k="cap" ${capTerkirim >= 3 ? "disabled" : ""}>Kasih cap (${3 - capTerkirim})</button>
          <button class="btn small" type="button" data-k="hadiah" ${hadiahTerkirim ? "disabled" : ""}>Kirim hadiah</button>
          <button class="btn small" type="button" data-k="selesai">Selesai berkunjung</button>
        </div>
        <div class="kunjung-pilihan" hidden></div>`;
    }
    isiKontrol();
    api.kontrol.onclick = (e) => {
      const b = e.target.closest("[data-k], [data-cap], [data-hd]");
      if (!b) return;
      const pil = api.kontrol.querySelector(".kunjung-pilihan");
      if (b.dataset.k === "lihat") { lihat = lihat === "teman" ? "aku" : "teman"; sfx("klik"); isiKontrol(); }
      else if (b.dataset.k === "cap") { pil.hidden = false; pil.innerHTML = CAP.map((c, i) => `<button class="chip" type="button" data-cap="${i}">${esc(c)}</button>`).join(""); }
      else if (b.dataset.k === "hadiah") { pil.hidden = false; pil.innerHTML = D.HADIAH.map((h) => `<button class="chip" type="button" data-hd="${h.id}">${esc(h.nama)}</button>`).join(""); }
      else if (b.dataset.k === "selesai") { o.kirim({ t: "kunjungSelesai" }); akhiri(true); }
      else if (b.dataset.cap !== undefined) { o.kirim({ t: "cap", teks: CAP[Number(b.dataset.cap)] }); capTerkirim++; sfx("stempel"); K.WOW?.hp(30); memo("Pak Satpam · Keamanan", `Siap. Cap "${CAP[Number(b.dataset.cap)]}" sudah dikirim ke ${temanNama}.`, 2600); isiKontrol(); }
      else if (b.dataset.hd) { o.kirim({ t: "hadiah", id: b.dataset.hd }); hadiahTerkirim = true; sfx("poin"); K.WOW?.ledak(innerWidth / 2, innerHeight * 0.7, ["#7FC8F2", "#F2C14E", "#FFFDF6"], 18); isiKontrol(); }
    };
    function akhiri(saya) {
      if (selesai) return; selesai = true;
      stop2();
      api.selesai(40 + capTerkirim * 10 + (hadiahTerkirim ? 20 : 0), ["kapibara", saya ? `Bu Ratna: Kunjungannya sudah selesai ya. Atap ${temanNama} bagus juga.` : `Bu Ratna: ${temanNama} sudah pulang dari atap kamu. Katanya nyaman.`], { menang: false, judul: "Kunjungan selesai" });
    }
    const bayangan = document.createElement("canvas");
    api.info(`Berkunjung ke Atap Biru milik ${temanNama}.`);
    const stop = api.loop((dt, t) => {
      const W = api.W(), H = api.H();
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#CFE3F2"; ctx.fillRect(0, 0, W, H);
      const data = lihat === "teman" ? atapTeman : { tugas: a.tugas, baju: a.baju, hadiah: a.hadiah };
      ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = "#2B2A26"; ctx.font = '16px "Pixelify Sans", monospace';
      if (!data) { ctx.fillText(`Menunggu atap ${temanNama}...`, W / 2, H / 2); return; }
      G.atap(data, { t }).keKanvas(bayangan);
      const s = Math.min((W - 20) / 160, (H - 60) / 200);
      ctx.imageSmoothingEnabled = false;
      const x0 = (W - 160 * s) / 2, y0 = 40;
      ctx.fillStyle = "#2B2A26"; ctx.fillRect(x0 - 3, y0 - 3, 160 * s + 6, 200 * s + 6);
      ctx.drawImage(bayangan, x0, y0, 160 * s, 200 * s);
      ctx.fillStyle = "#2B2A26";
      ctx.fillText(lihat === "teman" ? `Atap Biru milik ${temanNama} · ${atapTeman.sudut}/7 sudut · level ${Math.max(0, atapTeman.level - 1)}` : "Atap kamu (begini yang dilihat teman)", W / 2, 22);
    });
    function stop2() { stop(); clearInterval(minta); api.kontrol.onclick = null; }
    return stop2;
  };

  /* ---------- pengumuman di lobi ---------- */
  K.pengumuman = K.pengumuman || [];
  K.pengumuman.push(() => {
    const a = K.data.atap;
    if (!a || !a.episode?.length) return { dari: "Pak Singa", sprite: "singa", teks: "PERHATIAN. Atap gedung akan dijadikan gudang arsip. Kecuali ada yang membuatnya berguna. Kuncinya di lift, tombol A." };
    const ep = episodeTersedia();
    if (ep.length) return { dari: "Bu Ratna", sprite: "kapibara", teks: "Ada surat baru di kotak surat atap ya. Saya tidak tahu dari siapa. Sungguh." };
    return null;
  });

  K.ATAP = { isi, bukaPuzzle, putarCerita, A, get _pz() { return pz; } };
})();
