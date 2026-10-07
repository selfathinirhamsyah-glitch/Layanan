/* =========================================================
   Kantor Layanan Perasaan · Misteri Lantai 13 (mesin)
   Point-and-click: adegan, titik ketuk, dialog, laci (inventaris),
   teka-teki, kejutan lucu, petunjuk, bab harian, penyimpanan.
   Isi bab ada di l13-bab.js.
   ========================================================= */
(() => {
  "use strict";
  const K = window.KLP;
  const { $, $$, esc, px, sfx, memo, NAMA } = K;
  const S = () => K.data.l13;            // status tersimpan
  const JUMLAH_BAB = 6;

  const L13 = K.L13 = K.L13 || { bab: {}, barang: {}, langka: {} };

  /* ---------- tanggal & bab harian ---------- */
  const tglLokal = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  function hariSejak(tgl) {
    if (!tgl) return 0;
    const [y, m, d] = tgl.split("-").map(Number);
    const a = new Date(y, m - 1, d), b = new Date(); b.setHours(0, 0, 0, 0);
    return Math.max(0, Math.round((b - a) / 86400000));
  }
  const selesai = (n) => S().selesai.includes(n);
  function statusBab(n) {
    if (selesai(n)) return "selesai";
    if (n > 1 && !selesai(n - 1)) return "menunggu";
    if (S().bukaSemua || n === 1) return "tersedia";
    const hari = hariSejak(S().mulai);
    return hari >= n - 1 ? "tersedia" : "besok";
  }
  function sisaHari(n) {
    const hari = hariSejak(S().mulai);
    return Math.max(1, n - 1 - hari);
  }
  L13.statusBab = statusBab;

  /* ---------- pengumuman di lobi ---------- */
  K.pengumuman.push(() => {
    for (let n = 1; n <= JUMLAH_BAB; n++) {
      const b = L13.bab[n];
      if (!b) continue;
      if (statusBab(n) === "tersedia" && !S().flag[`b${n}:mulai`]) {
        return n === 1
          ? { dari: "Oyen", sprite: "oyen", teks: "Surat tugas untuk Anda: selidiki Misteri Lantai 13. Berkas ada di lobi. Diketahui." }
          : { dari: "Pak Singa", sprite: "singa", teks: `Perhatian. Bab ${n} sudah bisa diakses. ${b.teaser}` };
      }
    }
    return null;
  });

  /* =========================================================
     BERKAS PENYELIDIKAN (hub)
     ========================================================= */
  function isiBerkas() {
    const r = $("#ruangMisteri");
    const nSelesai = S().selesai.length;
    r.innerHTML = `
      <div class="form-head"><span class="loket-badge">Berkas Rahasia</span><span class="mono small">${nSelesai}/${JUMLAH_BAB} bab</span></div>
      <h2 id="h-misteri">Misteri Lantai 13</h2>
      <div class="surat-tugas">
        <p class="mono small">SURAT TUGAS No. 13/OY/${new Date().getFullYear()}</p>
        <p>Kepada: <strong>${esc(NAMA)}</strong>, Pegawai Kehormatan.<br>Perihal: gula hilang, stempel berpindah, tembok yang ditatap.<br>Tugas: selidiki. Pelan-pelan saja. Satu bab per hari.</p>
        <p class="ttd-oyen">— Oyen, Kepala Bagian <span class="cap-kaki" aria-hidden="true"></span></p>
      </div>
      <ol class="daftar-bab">
        ${Array.from({ length: JUMLAH_BAB }, (_, i) => i + 1).map((n) => {
          const b = L13.bab[n], st = statusBab(n);
          const ket = !b ? "Sedang ditulis." : st === "selesai" ? "Selesai. Boleh diulang." : st === "tersedia" ? (S().flag[`b${n}:mulai`] ? "Sedang diselidiki." : "Bisa dimulai sekarang.") : st === "menunggu" ? `Selesaikan Bab ${n - 1} dulu.` : `Terbuka ${sisaHari(n) === 1 ? "besok" : `${sisaHari(n)} hari lagi`}.`;
          const bisa = b && (st === "selesai" || st === "tersedia");
          return `<li class="bab bab-${st}">
            <span class="bab-no mono">${n}</span>
            <span class="bab-isi"><strong>${b && (st !== "besok" && st !== "menunggu") ? esc(b.judul) : "▒▒▒▒▒▒▒▒"}</strong><small>${esc(ket)}</small></span>
            ${bisa ? `<button class="btn small ${st === "tersedia" ? "primary" : ""}" type="button" data-bab="${n}">${st === "selesai" ? "Ulangi" : S().flag[`b${n}:mulai`] ? "Lanjut" : "Mulai"}</button>` : `<span class="bab-gembok" aria-hidden="true">▒</span>`}
          </li>`;
        }).join("")}
      </ol>
      <p class="muted small">Progres, laci, dan pilihan disimpan di perangkat ini saja. Kalau penyimpanan gagal, misterinya tetap bisa dimainkan, hanya progresnya hilang saat halaman ditutup.</p>
      <p class="muted small">Pengaturan kejutan ada di Radio Kantor (pojok kanan atas). Mode Kaget saat ini: <strong>${K.data.setelan.kaget ? "nyala" : "mati"}</strong>.</p>
      <div class="actions"><button class="btn ghost" type="button" data-go="s-lobi">← Lobi</button></div>`;
  }
  K.saatMasuk["s-misteri"] = isiBerkas;
  $("#ruangMisteri").addEventListener("click", (e) => {
    const b = e.target.closest("[data-bab]");
    if (b) mainkan(Number(b.dataset.bab));
  });

  /* ---------- tombol rahasia: ketuk kalender meja 7x ---------- */
  let ketukKal = 0, timerKal;
  K.ketukKalender = () => {
    ketukKal++; sfx("klik");
    clearTimeout(timerKal); timerKal = setTimeout(() => (ketukKal = 0), 3000);
    if (ketukKal === 7) {
      ketukKal = 0;
      S().bukaSemua = !S().bukaSemua;
      if (!S().mulai) S().mulai = tglLokal();
      K.simpan();
      sfx("tingtong");
      memo("Oyen · Kepala Bagian", S().bukaSemua ? "Mode penguji: semua bab dibuka. Jangan bilang siapa-siapa." : "Mode penguji: dimatikan. Bab kembali terbuka satu per hari.", 6000);
    }
  };

  /* =========================================================
     LAPISAN PERMAINAN
     ========================================================= */
  const lapis = $("#l13");
  const adegan = $("#l13Adegan"), latar = $("#l13Latar"), titikEl = $("#l13Titik");
  const gelap = $("#l13Gelap");
  let babAktif = null, ruangAktif = null, sibuk = false, pilihBarang = null;

  const api = {
    get s() { return S(); },
    get bab() { return babAktif; },
    nama: NAMA,
    flag(k, v) { const key = `b${babAktif}:${k}`; if (v === undefined) return S().flag[key]; S().flag[key] = v; K.simpan(); return v; },
    flagGlobal(k, v) { if (v === undefined) return S().flag[k]; S().flag[k] = v; K.simpan(); return v; },
    punya: (id) => S().inv.includes(id),
    dapat(id, diam = false) {
      if (S().inv.includes(id)) return;
      S().inv.push(id); K.simpan(); gambarLaci();
      if (!diam) { sfx("poin"); kilasBarang(id); }
    },
    buang(id) { S().inv = S().inv.filter((x) => x !== id); if (pilihBarang === id) pilihBarang = null; K.simpan(); gambarLaci(); },
    langka(id) {
      if (!S().langka.includes(id)) { S().langka.push(id); K.simpan(); }
    },
    tujuan(id) { api.flag("tujuan", id); api.flag("petunjukKe", 0); },
    ruang: (id) => pindahRuang(id),
    segarkan: () => gambarRuang(),
    bilang, tanya, kejut, lihat, sfx,
    gembok: tekaGembok, urutan: tekaUrutan, susun: tekaSusun, jam: tekaJam,
    gelap(nyala) { gelap.hidden = !nyala; adegan.classList.toggle("dalam-gelap", nyala); },
    async selesaiBab() {
      const n = babAktif;
      if (!S().selesai.includes(n)) S().selesai.push(n);
      S().flag[`b${n}:mulai`] = true;
      S().posisi = null;
      K.simpan();
      K.catat(`l13:bab${n}`);
      sfx("menang");
      const poin = K.tambahPoin(25);
      await layarSelesai(n, poin);
    },
  };
  L13.api = api;

  function mainkan(n) {
    const b = L13.bab[n];
    if (!b) return;
    babAktif = n;
    if (!S().mulai) { S().mulai = tglLokal(); }
    const ulang = selesai(n) && !S().flag[`b${n}:ulang`];
    if (selesai(n)) {
      // main ulang: bersihkan flag bab ini, barang tetap di laci
      Object.keys(S().flag).filter((k) => k.startsWith(`b${n}:`)).forEach((k) => delete S().flag[k]);
    }
    K.simpan();
    void ulang;
    document.body.classList.add("layar-penuh");
    lapis.hidden = false;
    $("#l13Bab").textContent = `Bab ${n} · ${b.judul}`;
    pilihBarang = null;
    gambarLaci();
    const pertama = !S().flag[`b${n}:mulai`];
    S().flag[`b${n}:mulai`] = true;
    K.simpan();
    const posisi = S().posisi && S().posisi.bab === n ? S().posisi.ruang : b.ruangAwal;
    pindahRuang(posisi, true);
    sesuaikanUkuran();
    if (pertama && b.pembuka) jalankan(() => b.pembuka(api));
  }
  function keluar() {
    lapis.hidden = true;
    document.body.classList.remove("layar-penuh");
    tutupDialog();
    $("#l13Modal").hidden = true;
    babAktif = null; ruangAktif = null; sibuk = false;
    if (K.layarAktif() === "s-misteri") isiBerkas(); else K.ke("s-misteri");
  }
  $("#l13Keluar").addEventListener("click", () => { sfx("klik"); keluar(); });

  /* ---------- ruang & titik ---------- */
  function pindahRuang(id, langsung = false) {
    const b = L13.bab[babAktif];
    if (!b.ruang[id]) return;
    ruangAktif = id;
    S().posisi = { bab: babAktif, ruang: id };
    K.simpan();
    api.gelap(false);
    if (!langsung && !K.kurangiGerak) { adegan.classList.remove("ganti"); void adegan.offsetWidth; adegan.classList.add("ganti"); }
    gambarRuang();
    b.ruang[id].masuk && jalankan(() => b.ruang[id].masuk(api));
  }
  function gambarRuang() {
    const r = L13.bab[babAktif].ruang[ruangAktif];
    $("#l13Ruang").textContent = r.nama;
    latar.innerHTML = (L13.LATAR[r.latar] || (() => ""))(api);
    titikEl.innerHTML = r.titik.filter((t) => !t.tampil || t.tampil(api)).map((t) => `
      <button type="button" class="titik${t.keluar ? " titik-keluar" : ""}${t.samar ? " samar" : ""}" data-titik="${t.id}"
        style="left:${t.x / 3}%;top:${t.y / 4}%;width:${t.w / 3}%;height:${t.h / 4}%" aria-label="${esc(t.label)}">
        ${t.gambar ? `<span class="titik-gambar">${typeof t.gambar === "function" ? t.gambar(api) : px(t.gambar)}</span>` : ""}
        <span class="titik-label">${esc(t.label)}</span>
      </button>`).join("");
  }
  titikEl.addEventListener("click", (e) => {
    const el = e.target.closest("[data-titik]");
    if (!el || sibuk) return;
    const r = L13.bab[babAktif].ruang[ruangAktif];
    const t = r.titik.find((x) => x.id === el.dataset.titik);
    if (!t) return;
    sfx("klik");
    const barang = pilihBarang;
    if (barang) { pilihBarang = null; gambarLaci(); }
    jalankan(async () => {
      if (barang) {
        if (t.pakai) { const hasil = await t.pakai(api, barang); if (hasil !== false) return; }
        await bilang("narasi", acakTolak(barang, t.label));
        return;
      }
      if (t.ke && !t.ketuk) { pindahRuang(t.ke); return; }
      await t.ketuk?.(api);
    });
  });
  function acakTolak(barang, label) {
    const nm = L13.barang[barang]?.nama || barang;
    return K.acak([`${nm} dan ${label.toLowerCase()} tidak cocok. Keduanya terlihat canggung.`, `Anda mencoba memakai ${nm.toLowerCase()} di situ. Tidak terjadi apa-apa, kecuali sedikit malu.`, `Bu Ratna dari jauh: "Kayaknya bukan di situ ya."`]);
  }
  async function jalankan(fn) {
    if (sibuk) return;
    sibuk = true;
    try { await fn(); }
    catch (err) { console.error(err); }
    finally { sibuk = false; }
  }

  /* ---------- ukuran adegan 3:4 ---------- */
  function sesuaikanUkuran() {
    const p = $("#l13Panggung").getBoundingClientRect();
    const lebar = Math.min(p.width, p.height * 0.75, 480);
    adegan.style.width = `${lebar}px`;
    adegan.style.height = `${lebar / 0.75}px`;
  }
  addEventListener("resize", () => { if (!lapis.hidden) sesuaikanUkuran(); });

  /* ---------- gelap & senter ---------- */
  adegan.addEventListener("pointermove", (e) => {
    if (gelap.hidden) return;
    const r = adegan.getBoundingClientRect();
    gelap.style.setProperty("--x", `${e.clientX - r.left}px`);
    gelap.style.setProperty("--y", `${e.clientY - r.top}px`);
  });
  adegan.addEventListener("pointerdown", (e) => {
    if (gelap.hidden) return;
    const r = adegan.getBoundingClientRect();
    gelap.style.setProperty("--x", `${e.clientX - r.left}px`);
    gelap.style.setProperty("--y", `${e.clientY - r.top}px`);
  });

  /* ---------- laci (inventaris) ---------- */
  function gambarLaci() {
    const isi = S().inv;
    $("#l13Laci").innerHTML = isi.length ? isi.map((id) => {
      const b = L13.barang[id] || { nama: id, sprite: "berkas" };
      return `<button type="button" class="laci-barang${pilihBarang === id ? " dipilih" : ""}" data-barang="${id}" aria-pressed="${pilihBarang === id}" title="${esc(b.nama)}">${px(b.sprite)}</button>`;
    }).join("") : `<span class="laci-kosong">kosong</span>`;
    $("#l13LaciKet").textContent = pilihBarang ? `${(L13.barang[pilihBarang] || {}).nama || pilihBarang}: ketuk benda untuk memakai` : "Ketuk barang untuk memilih";
  }
  $("#l13Laci").addEventListener("click", (e) => {
    const b = e.target.closest("[data-barang]");
    if (!b || sibuk) return;
    const id = b.dataset.barang;
    sfx("pilih");
    if (pilihBarang === id) {
      pilihBarang = null; gambarLaci();
      const x = L13.barang[id];
      if (x) jalankan(() => bilang("narasi", `${x.nama}. ${x.ket}`));
      return;
    }
    pilihBarang = id; gambarLaci();
  });
  function kilasBarang(id) {
    const b = L13.barang[id] || { nama: id, sprite: "berkas" };
    const el = document.createElement("div");
    el.className = "kilas-barang";
    el.innerHTML = `<span class="kb-foto">${px(b.sprite)}</span><span><small>Masuk laci</small><strong>${esc(b.nama)}</strong></span>`;
    lapis.appendChild(el);
    setTimeout(() => el.remove(), 2400);
  }

  /* ---------- dialog ---------- */
  const PEMBICARA = {
    narasi: { nama: "", sprite: null },
    ratna: { nama: "Bu Ratna", sprite: "kapibara" }, satpam: { nama: "Pak Satpam", sprite: "kura" },
    dimas: { nama: "Dimas", sprite: "marmut" }, oyen: { nama: "Oyen", sprite: "oyen" }, kukang: { nama: "Mas Kukang", sprite: "kukang" },
    singa: { nama: "Pak Singa", sprite: "singa" }, gajah: { nama: "Bu Gajah", sprite: "gajah" },
  };
  const dlg = $("#l13Dialog");
  let lanjutkan = null;
  function siapkanDialog(siapa, teks) {
    const p = PEMBICARA[siapa] || { nama: siapa, sprite: null };
    dlg.hidden = false;
    dlg.classList.toggle("narasi", !p.sprite);
    $("#l13DAvatar").innerHTML = p.sprite ? px(p.sprite) : "";
    $("#l13DAvatar").hidden = !p.sprite;
    $("#l13DNama").textContent = p.nama;
    $("#l13DTeks").textContent = teks.replaceAll("{NAMA}", NAMA);
    $("#l13DPilih").innerHTML = "";
  }
  function bilang(siapa, teks) {
    siapkanDialog(siapa, teks);
    dlg.classList.add("bisa-lanjut");
    return new Promise((res) => { lanjutkan = () => { lanjutkan = null; dlg.classList.remove("bisa-lanjut"); tutupDialog(); res(); }; });
  }
  function tanya(siapa, teks, opsi) {
    siapkanDialog(siapa, teks);
    dlg.classList.remove("bisa-lanjut");
    $("#l13DPilih").innerHTML = opsi.map((o, i) => `<button type="button" class="chip" data-opsi="${i}">${esc(o)}</button>`).join("");
    return new Promise((res) => {
      $("#l13DPilih").onclick = (e) => {
        const b = e.target.closest("[data-opsi]");
        if (!b) return;
        $("#l13DPilih").onclick = null;
        sfx("pilih");
        tutupDialog();
        res(Number(b.dataset.opsi));
      };
    });
  }
  function tutupDialog() { dlg.hidden = true; }
  dlg.addEventListener("click", (e) => { if (lanjutkan && !e.target.closest(".chip")) { sfx("klik"); lanjutkan(); } });
  document.addEventListener("keydown", (e) => { if (!lapis.hidden && lanjutkan && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); lanjutkan(); } });

  /* ---------- modal umum ---------- */
  const modal = $("#l13Modal"), modalIsi = $("#l13ModalIsi");
  function bukaModal(html) { modalIsi.innerHTML = html; modal.hidden = false; }
  function tutupModal() { modal.hidden = true; modalIsi.innerHTML = ""; }
  function lihat(html, tombol = "Tutup") {
    bukaModal(`<div class="baca">${html}</div><div class="actions"><button class="btn primary" type="button" data-tutup>${esc(tombol)}</button></div>`);
    return new Promise((res) => { modalIsi.querySelector("[data-tutup]").onclick = () => { sfx("klik"); tutupModal(); res(); }; });
  }

  /* ---------- teka-teki: gembok angka ---------- */
  function tekaGembok({ judul, ket, kode, kunci = "petunjuk" }) {
    const n = kode.length;
    const isi = Array(n).fill(0);
    bukaModal(`
      <h3 class="teka-judul">${esc(judul)}</h3>
      <p class="teka-ket">${esc(ket)}</p>
      <div class="gembok">${isi.map((_, i) => `
        <div class="roda"><button type="button" data-naik="${i}" aria-label="Naikkan angka ${i + 1}">▲</button><span class="mono" data-angka="${i}">0</span><button type="button" data-turun="${i}" aria-label="Turunkan angka ${i + 1}">▼</button></div>`).join("")}
      </div>
      <p class="teka-pesan" aria-live="polite"></p>
      <div class="actions"><button class="btn ghost" type="button" data-batal>Nanti dulu</button><button class="btn primary" type="button" data-coba>Coba buka</button></div>`);
    return new Promise((res) => {
      modalIsi.onclick = (e) => {
        const nk = e.target.closest("[data-naik]"), tr = e.target.closest("[data-turun]");
        if (nk || tr) {
          const i = Number((nk || tr).dataset.naik ?? (nk || tr).dataset.turun);
          isi[i] = (isi[i] + (nk ? 1 : 9)) % 10;
          modalIsi.querySelector(`[data-angka="${i}"]`).textContent = isi[i];
          sfx("klik"); return;
        }
        if (e.target.closest("[data-batal]")) { modalIsi.onclick = null; tutupModal(); res(false); return; }
        if (e.target.closest("[data-coba]")) {
          if (isi.join("") === kode) { sfx("stempel"); modalIsi.onclick = null; tutupModal(); res(true); }
          else {
            sfx("salah");
            const m = modalIsi.querySelector(".teka-pesan");
            m.textContent = K.acak(["Gemboknya diam. Tidak setuju.", "Klik. ...Bukan klik yang itu.", "Salah, tapi gemboknya tidak marah."]);
            modalIsi.querySelector(".gembok").classList.remove("geleng"); void modalIsi.offsetWidth; modalIsi.querySelector(".gembok").classList.add("geleng");
          }
        }
      };
    });
  }

  /* ---------- teka-teki: urutan ---------- */
  function tekaUrutan({ judul, ket, pilihan, benar, salahKata }) {
    let urut = [];
    const gambar = () => `
      <h3 class="teka-judul">${esc(judul)}</h3>
      <p class="teka-ket">${esc(ket)}</p>
      <div class="urutan-kertas">${benar.map((_, i) => `<span class="urutan-slot">${urut[i] ? esc(urut[i]) : i + 1}</span>`).join("")}</div>
      <div class="urutan-pilihan">${pilihan.map((p) => `<button type="button" class="cap-pilihan" data-p="${esc(p)}" ${urut.includes(p) ? "disabled" : ""}>${esc(p)}</button>`).join("")}</div>
      <p class="teka-pesan" aria-live="polite"></p>
      <div class="actions"><button class="btn ghost" type="button" data-batal>Nanti dulu</button><button class="btn" type="button" data-ulang>Ulang dari awal</button></div>`;
    bukaModal(gambar());
    return new Promise((res) => {
      modalIsi.onclick = (e) => {
        if (e.target.closest("[data-batal]")) { modalIsi.onclick = null; tutupModal(); res(false); return; }
        if (e.target.closest("[data-ulang]")) { urut = []; bukaModal(gambar()); return; }
        const b = e.target.closest("[data-p]");
        if (!b) return;
        urut.push(b.dataset.p); sfx("stempel");
        if (urut[urut.length - 1] !== benar[urut.length - 1]) {
          const pesan = salahKata || "Urutannya belum pas. Kertasnya sudah dilap, silakan ulang.";
          urut = []; bukaModal(gambar()); sfx("salah");
          modalIsi.querySelector(".teka-pesan").textContent = pesan;
          return;
        }
        if (urut.length === benar.length) { bukaModal(gambar()); setTimeout(() => { modalIsi.onclick = null; tutupModal(); res(true); }, 700); return; }
        bukaModal(gambar());
      };
    });
  }

  /* ---------- teka-teki: susun potongan (tukar posisi) ---------- */
  function tekaSusun({ judul, ket, potongan }) {
    // potongan: array teks dalam urutan benar; ditampilkan teracak
    let urut = potongan.map((_, i) => i);
    do { urut.sort(() => Math.random() - 0.5); } while (urut.every((v, i) => v === i));
    let pilih = null;
    const gambar = () => `
      <h3 class="teka-judul">${esc(judul)}</h3>
      <p class="teka-ket">${esc(ket)}</p>
      <div class="sobekan-papan">${urut.map((p, i) => `<button type="button" class="sobek${pilih === i ? " dipilih" : ""}" data-i="${i}" style="--r:${(p % 2 ? 1 : -1) * (1 + p)}deg">${esc(potongan[p])}</button>`).join("")}</div>
      <p class="teka-pesan" aria-live="polite">Ketuk dua potongan untuk menukar posisinya.</p>
      <div class="actions"><button class="btn ghost" type="button" data-batal>Nanti dulu</button></div>`;
    bukaModal(gambar());
    return new Promise((res) => {
      modalIsi.onclick = (e) => {
        if (e.target.closest("[data-batal]")) { modalIsi.onclick = null; tutupModal(); res(false); return; }
        const b = e.target.closest("[data-i]");
        if (!b) return;
        const i = Number(b.dataset.i);
        if (pilih === null) { pilih = i; sfx("kertas"); bukaModal(gambar()); return; }
        [urut[pilih], urut[i]] = [urut[i], urut[pilih]]; pilih = null; sfx("kertas");
        bukaModal(gambar());
        if (urut.every((v, idx) => v === idx)) {
          modalIsi.querySelector(".sobekan-papan").classList.add("utuh");
          modalIsi.querySelector(".teka-pesan").textContent = "Utuh. Selotip Bu Ratna menempel sendiri.";
          sfx("menang");
          setTimeout(() => { modalIsi.onclick = null; tutupModal(); res(true); }, 1100);
        }
      };
    });
  }

  /* ---------- teka-teki: setel jam ---------- */
  function tekaJam({ judul, ket, jam, menit, target }) {
    let j = jam, m = menit;
    const gambar = () => {
      const sudJ = ((j % 12) + m / 60) * 30, sudM = m * 6;
      return `
      <h3 class="teka-judul">${esc(judul)}</h3>
      <p class="teka-ket">${esc(ket)}</p>
      <div class="jam-dinding"><svg viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="60" r="54" class="jd-muka"/>
        ${Array.from({ length: 12 }, (_, i) => `<rect x="58" y="10" width="4" height="${i % 3 ? 6 : 10}" transform="rotate(${i * 30} 60 60)" class="jd-tanda"/>`).join("")}
        <line x1="60" y1="60" x2="60" y2="32" class="jd-jam" transform="rotate(${sudJ} 60 60)"/>
        <line x1="60" y1="60" x2="60" y2="18" class="jd-menit" transform="rotate(${sudM} 60 60)"/>
        <circle cx="60" cy="60" r="4" class="jd-pusat"/></svg>
        <p class="jam-digital mono">${String(j).padStart(2, "0")}.${String(m).padStart(2, "0")}</p>
      </div>
      <div class="jam-tombol">
        <span>Jam</span><button type="button" class="btn small" data-j="-1">−1</button><button type="button" class="btn small" data-j="1">+1</button>
        <span>Menit</span><button type="button" class="btn small" data-m="-10">−10</button><button type="button" class="btn small" data-m="-1">−1</button><button type="button" class="btn small" data-m="1">+1</button><button type="button" class="btn small" data-m="10">+10</button>
      </div>
      <div class="actions"><button class="btn ghost" type="button" data-batal>Nanti dulu</button><button class="btn primary" type="button" data-pasang>Pasang</button></div>`;
    };
    bukaModal(gambar());
    return new Promise((res) => {
      modalIsi.onclick = (e) => {
        if (e.target.closest("[data-batal]")) { modalIsi.onclick = null; tutupModal(); res(null); return; }
        const bj = e.target.closest("[data-j]"), bm = e.target.closest("[data-m]");
        if (bj) { j = (j + Number(bj.dataset.j) + 24) % 24; sfx("klik"); bukaModal(gambar()); return; }
        if (bm) { m += Number(bm.dataset.m); if (m < 0) { m += 60; j = (j + 23) % 24; } if (m > 59) { m -= 60; j = (j + 1) % 24; } sfx("klik"); bukaModal(gambar()); return; }
        if (e.target.closest("[data-pasang]")) { modalIsi.onclick = null; tutupModal(); sfx("stempel"); res({ jam: j, menit: m, benar: j === target[0] && m === target[1] }); }
      };
    });
  }

  /* =========================================================
     KEJUTAN LUCU + FORMULIR LAPORAN KAGET
     ========================================================= */
  const kejutEl = $("#l13Kejut");
  async function kejut({ gambar, teriak = "", punchline, siapa = "narasi" }) {
    const keras = K.data.setelan.kaget && !K.kurangiGerak;
    kejutEl.hidden = false;
    kejutEl.className = `l13-kejut ${keras ? "keras" : "lembut"}`;
    kejutEl.innerHTML = `
      <div class="kejut-isi">
        <div class="kejut-gambar">${gambar}</div>
        ${teriak ? `<p class="kejut-teriak">${esc(teriak)}</p>` : ""}
        ${keras ? "" : `<p class="kejut-maaf">(seharusnya ini mengagetkan. Mode Kaget sedang mati, jadi kami munculkan pelan-pelan.)</p>`}
      </div>`;
    if (keras) { sfx("kaget"); lapis.classList.remove("getar"); void lapis.offsetWidth; lapis.classList.add("getar"); }
    else sfx("klik");
    await new Promise((r) => setTimeout(r, keras ? 1300 : 1800));
    kejutEl.hidden = true;
    lapis.classList.remove("getar");
    await bilang(siapa, punchline);
    await laporanKaget();
  }
  async function laporanKaget() {
    let level = 1;
    bukaModal(`
      <h3 class="teka-judul">Formulir Laporan Kaget</h3>
      <p class="teka-ket">Wajib diisi setelah kejutan, sesuai peraturan K3 kantor. Seberapa kaget Anda? Usap punggung Oyen ke atas.</p>
      <div id="skalaKaget"></div>
      <div class="actions"><button class="btn primary" type="button" data-kirim>Kirim laporan</button></div>`);
    K.skala.bulu($("#skalaKaget"), { onUbah(lv) { level = lv; } });
    await new Promise((res) => { modalIsi.querySelector("[data-kirim]").onclick = () => { sfx("stempel"); tutupModal(); res(); }; });
    const TANGGAP = [null,
      "Laporan diterima. Tidak kaget sama sekali. Oyen sedikit kecewa.",
      "Laporan diterima. Sedikit kaget. Pelaku kejutan akan diberi tahu bahwa usahanya setengah berhasil.",
      "Laporan diterima. Lumayan kaget. Bu Ratna sudah menyiapkan teh, untuk jaga-jaga.",
      "Laporan diterima. Sangat kaget. Pelaku kejutan akan ditegur. Pelan-pelan.",
      "Laporan diterima. Bulu Oyen masih di plafon. Pelaku kejutan diminta minta maaf tiga kali."];
    await bilang("oyen", TANGGAP[level]);
    K.catat("kaget");
    if (!K.data.setelan.tanyaKaget) {
      K.data.setelan.tanyaKaget = true; K.simpan();
      const j = await tanya("oyen", "Pertanyaan resmi. Apakah Anda bersedia dikagetkan lagi di masa mendatang?", ["Bersedia", "Tidak, terima kasih", "Kagetkan pelan-pelan saja"]);
      if (j === 0) { K.data.setelan.kaget = true; await bilang("oyen", "Diketahui. Kejutan berikutnya akan tetap lucu. Tidak seram. Sudah saya tanda tangani."); }
      else { K.data.setelan.kaget = false; await bilang("oyen", j === 1 ? "Diketahui. Kejutan dimatikan. Benda-benda akan muncul dengan sopan. Bisa diubah lagi di Radio Kantor." : "Diketahui. Mulai sekarang semua kejutan datang pelan-pelan, sambil minta izin. Bisa diubah lagi di Radio Kantor."); }
      K.simpan();
    }
  }

  /* ---------- layar selesai bab ---------- */
  async function layarSelesai(n, poin) {
    const b = L13.bab[n];
    const langka = b.langka ? L13.langka[b.langka] : null;
    await lihat(`
      <p class="mono selesai-cap">BAB ${n} SELESAI</p>
      <h3 class="teka-judul">${esc(b.judul)}</h3>
      <p>${esc(b.penutup || "Laporan diterima. Lanjutkan besok.")}</p>
      ${langka ? `<div class="hadiah-langka"><span class="avatar">${px(langka.sprite)}</span><span><small>Barang langka untuk Meja Kerja</small><strong>${esc(langka.nama)}</strong></span></div>` : ""}
      <p class="ap-poin">+${poin} Poin Sabar</p>
      ${n < JUMLAH_BAB ? `<p class="muted small">Bab ${n + 1} ${S().bukaSemua ? "sudah bisa diakses (mode penguji)." : "terbuka besok. Datang lagi ya. Gedungnya tidak ke mana-mana."}</p>` : ""}`, "Kembali ke berkas");
    keluar();
  }

  /* ---------- petunjuk bertahap dari Bu Ratna ---------- */
  $("#l13Petunjuk").addEventListener("click", () => {
    if (!babAktif) return;
    sfx("pilih");
    jalankan(async () => {
      const daftar = (L13.bab[babAktif].petunjuk || {})[api.flag("tujuan")] || ["Coba ketuk benda-benda di sekitar ya. Pelan-pelan aja."];
      const ke = api.flag("petunjukKe") || 0;
      await bilang("ratna", daftar[Math.min(ke, daftar.length - 1)]);
      if (ke < daftar.length - 1) api.flag("petunjukKe", ke + 1);
      else if (ke === daftar.length - 1) { api.flag("petunjukKe", ke + 1); }
    });
  });

  /* ---------- barang langka di Meja Kerja ---------- */
  K.NAMA_LANGKA = L13.langka;

  /* ---------- lift: tombol tanpa angka, lantai gaib di denah ---------- */
  K.tombolLiftKosong = (b) => {
    if (selesai(6)) { K.naikLift("s-lantai13"); return; }
    if (selesai(1)) {
      sfx("lift");
      memo("Pak Satpam · Keamanan", "Siap. Tombol itu kadang menyala sendiri jam 16.59. Belum ada angkanya. Penyelidikan Anda masih berjalan.");
    } else {
      sfx("salah");
      memo("Pak Satpam · Keamanan", "Siap. Tombol itu tidak ada lantainya. Sudah saya laporkan. Belum dijawab. Oyen bilang: tanya ke berkas di lobi.");
    }
    void b;
  };
  function perbaruiLiftGaib() {
    const b = $("#liftKosong");
    if (!b) return;
    if (selesai(6)) { b.innerHTML = "<b>13</b><small>Rahasia</small>"; b.dataset.lantai = "13"; b.dataset.layar = "s-lantai13"; b.classList.remove("berkedip"); b.classList.add("lift-13"); }
    else b.classList.toggle("berkedip", selesai(1));
  }
  K.on("*", (nama) => { if (String(nama).startsWith("l13:")) perbaruiLiftGaib(); });
  perbaruiLiftGaib();
  // denah: lantai gaib membuka berkas misteri
  document.addEventListener("click", (e) => {
    if (e.target.closest("#lantaiGaib")) { sfx("lift"); K.ke("s-misteri"); }
  });

  /* ---------- kartu misteri di lobi ---------- */
  const isiLobiSebelum = K.saatMasuk["s-lobi"];
  K.saatMasuk["s-lobi"] = () => {
    isiLobiSebelum();
    const slot = $("#misteriSlot");
    if (!slot) return;
    const n = S().selesai.length;
    const ada = Array.from({ length: JUMLAH_BAB }, (_, i) => i + 1).find((x) => statusBab(x) === "tersedia");
    slot.innerHTML = `
      <button type="button" class="kartu-misteri" data-go="s-misteri">
        <span class="km-ikon">${px("kartu")}</span>
        <span class="km-isi"><strong>Berkas: Misteri Lantai 13</strong><small>${n === JUMLAH_BAB ? "Kasus ditutup. Anda penjaganya sekarang." : ada ? `Bab ${ada} menunggu penyelidikan.` : "Bab berikutnya terbuka besok."}</small></span>
        <span class="km-panah" aria-hidden="true">→</span>
      </button>`;
    $("#lantaiGaib")?.setAttribute("role", "button");
    $("#lantaiGaib")?.setAttribute("aria-label", "Lantai tanpa nomor: buka berkas misteri");
    $("#lantaiGaib")?.removeAttribute("aria-hidden");
    if ($("#lantaiGaib")) $("#lantaiGaib").tabIndex = 0;
  };
  if (K.layarAktif() === "s-lobi") K.saatMasuk["s-lobi"]();

  L13.mainkan = mainkan;
  L13.isiBerkas = isiBerkas;
})();
