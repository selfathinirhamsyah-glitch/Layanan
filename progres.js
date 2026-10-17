/* =========================================================
   Kantor Layanan Perasaan · Pangkat, Misi Harian, Hari Beruntun
   Dipakai Ruang Istirahat (game solo) dan Mode Duel.
   Semua tersimpan di perangkat (K.data.progres).
   ========================================================= */
(() => {
  "use strict";
  const K = window.KLP;
  const { esc, px, sfx, memo } = K;
  const P = () => K.data.progres;

  /* ---------- pangkat ---------- */
  const PANGKAT = [
    { xp: 0, nama: "Pegawai Magang", warna: "#9A8F7A", sprite: "marmut", kata: "Semua orang mulai dari sini. Dimas masih di sini." },
    { xp: 150, nama: "Staf Junior", warna: "#8A6B4F", sprite: "kukang", kata: "Sudah boleh punya gelas sendiri di pantry." },
    { xp: 400, nama: "Staf", warna: "#6E8BA8", sprite: "kapibara", kata: "Nama Anda sudah ditulis di jadwal piket. Selamat, dan maaf." },
    { xp: 800, nama: "Staf Senior", warna: "#4F6E5E", sprite: "kura", kata: "Pak Satpam mulai memberi hormat. Kadang dua kali." },
    { xp: 1400, nama: "Kepala Seksi", warna: "#3E78C4", sprite: "badak", kata: "Boleh memakai kursi putar mode merenung kapan saja." },
    { xp: 2200, nama: "Kepala Bagian", warna: "#6B5B7A", sprite: "oyen", kata: "Setara Oyen. Oyen belum mengakui ini." },
    { xp: 3300, nama: "Direktur", warna: "#B5443A", sprite: "gajah", kata: "Bu Gajah meminjamkan stempel emasnya. Jangan dipakai untuk gorengan." },
    { xp: 5000, nama: "Legenda Kantor", warna: "#C9962E", sprite: "singa", kata: "Pak Singa mengumumkan nama Anda tiap pagi. Dengan volume penuh." },
  ];
  function pangkatDari(xp) {
    let i = 0;
    while (i < PANGKAT.length - 1 && xp >= PANGKAT[i + 1].xp) i++;
    const kini = PANGKAT[i], lanjut = PANGKAT[i + 1];
    return { i, ...kini, lanjut, persen: lanjut ? Math.round(((xp - kini.xp) / (lanjut.xp - kini.xp)) * 100) : 100 };
  }

  /* ---------- misi harian ---------- */
  // cek(e): e = { jenis: "solo"|"duel", game, skor, tingkat, stat }
  const MISI = [
    { id: "rally12", teks: "Pukul 12 kok dalam satu permainan Rally", target: 1, cek: (e) => e.game === "rally" && (e.stat.pukulan || 0) >= 12 },
    { id: "rallySempurna", teks: "Kumpulkan 4 pukulan SEMPURNA di Rally", target: 4, tambah: (e) => (e.game === "rally" ? e.stat.sempurna || 0 : 0) },
    { id: "stempelCombo", teks: "Combo 8 cap benar berturut-turut di Stempel Kilat", target: 1, cek: (e) => e.game === "stempel" && (e.stat.comboMaks || 0) >= 8 },
    { id: "stempelOyen", teks: "Biarkan Oyen tidur lewat 2 kali", target: 2, tambah: (e) => (e.game === "stempel" ? e.stat.oyenLewat || 0 : 0) },
    { id: "kertas20", teks: "Tangkap 20 berkas dalam satu permainan Tangkap Kertas", target: 1, cek: (e) => e.game === "kertas" && (e.stat.tangkap || 0) >= 20 },
    { id: "kertasEmas", teks: "Tangkap 2 surat rahasia (kertas emas)", target: 2, tambah: (e) => (e.game === "kertas" ? e.stat.emas || 0 : 0) },
    { id: "ngemil30", teks: "Ngemil 30 kali dan ketahuan paling banyak sekali", target: 1, cek: (e) => e.game === "ngemil" && e.skor >= 30 && (e.stat.ketahuan || 0) <= 1 },
    { id: "troliJuara", teks: "Finis posisi 1 di Balap Troli", target: 1, cek: (e) => e.game === "troli" && e.stat.finis === 1 },
    { id: "troliEmas", teks: "Ambil 4 berkas emas dalam satu balapan", target: 1, cek: (e) => e.game === "troli" && (e.stat.emas || 0) >= 4 },
    { id: "main3", teks: "Main 3 game apa saja", target: 3, tambah: (e) => (e.jenis === "solo" ? 1 : 0) },
    { id: "lembur", teks: "Selesaikan 1 game di tingkat Lembur", target: 1, cek: (e) => e.jenis === "solo" && e.tingkat === "lembur" },
    { id: "duel", teks: "Main 2 ronde Mode Duel (lawan teman atau bot)", target: 2, tambah: (e) => (e.jenis === "duel" ? 1 : 0), duel: true },
    { id: "duelMenang", teks: "Menangkan 1 ronde Mode Duel sebagai Pemain 1", target: 1, cek: (e) => e.jenis === "duel" && e.pemenang === 1, duel: true },
  ];
  const HADIAH_MISI = 15, HADIAH_SEMUA = 20, XP_MISI = 40;

  // pilihan misi tetap sepanjang hari (diacak dari tanggal), maksimal satu misi duel
  function acakHarian(tgl) {
    let h = 0;
    for (const c of tgl) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    const rng = () => ((h = (h * 1103515245 + 12345) >>> 0) / 4294967296);
    const solo = MISI.filter((m) => !m.duel), duel = MISI.filter((m) => m.duel);
    const ambil = (arr, n) => { const a = arr.slice(); const hasil = []; while (hasil.length < n && a.length) hasil.push(a.splice(Math.floor(rng() * a.length), 1)[0]); return hasil; };
    return [...ambil(solo, 2), ...ambil(duel, 1)];
  }
  function misiHariIni() {
    const tgl = K.hariIni();
    if (P().misi.tgl !== tgl) {
      P().misi = { tgl, daftar: acakHarian(tgl).map((m) => ({ id: m.id, n: 0, klaim: false })), bonus: false };
      K.simpan();
    }
    return P().misi.daftar.map((d) => ({ ...d, def: MISI.find((m) => m.id === d.id) })).filter((d) => d.def);
  }

  /* ---------- hari beruntun ---------- */
  function catatBeruntun() {
    const b = P().beruntun, tgl = K.hariIni();
    if (b.tgl === tgl) return;
    const kemarin = new Date(); kemarin.setDate(kemarin.getDate() - 1);
    const kmr = `${kemarin.getFullYear()}-${String(kemarin.getMonth() + 1).padStart(2, "0")}-${String(kemarin.getDate()).padStart(2, "0")}`;
    b.n = b.tgl === kmr ? b.n + 1 : 1;
    b.tgl = tgl;
  }

  /* ---------- laporan dari game ---------- */
  function tambahXp(n) {
    const sebelum = pangkatDari(P().xp).i;
    P().xp += Math.max(0, Math.round(n));
    const sesudah = pangkatDari(P().xp);
    return sesudah.i > sebelum ? sesudah : null;
  }
  // e: { jenis, game, skor, tingkat, stat, poin, pemenang }
  function lapor(e) {
    e.stat = e.stat || {};
    catatBeruntun();
    const selesaiBaru = [];
    for (const d of misiHariIni()) {
      const asli = P().misi.daftar.find((x) => x.id === d.id);
      if (asli.n >= d.def.target) continue;
      const naik = d.def.tambah ? d.def.tambah(e) : d.def.cek(e) ? 1 : 0;
      if (!naik) continue;
      asli.n = Math.min(d.def.target, asli.n + naik);
      if (asli.n >= d.def.target) selesaiBaru.push(d.def.teks);
    }
    const xp = e.jenis === "duel" ? 15 : 10 + (e.poin || 0) * 3 * (e.tingkat === "lembur" ? 1.3 : 1);
    const naikPangkat = tambahXp(xp);
    K.simpan();
    if (selesaiBaru.length) sfx("tingtong");
    return { xp: Math.round(xp), selesaiBaru, naikPangkat };
  }

  function klaim(id) {
    const d = P().misi.daftar.find((x) => x.id === id);
    const def = MISI.find((m) => m.id === id);
    if (!d || !def || d.klaim || d.n < def.target) return null;
    d.klaim = true;
    const poin = K.tambahPoin(HADIAH_MISI);
    let naik = tambahXp(XP_MISI), bonus = 0;
    if (!P().misi.bonus && P().misi.daftar.every((x) => x.klaim)) {
      P().misi.bonus = true;
      bonus = K.tambahPoin(HADIAH_SEMUA);
      naik = tambahXp(XP_MISI) || naik;
    }
    K.simpan();
    return { poin, bonus, naik };
  }

  /* ---------- tampilan di Ruang Istirahat ---------- */
  function htmlPapan() {
    const pk = pangkatDari(P().xp);
    const misi = misiHariIni();
    const b = P().beruntun;
    const beruntunAktif = b.tgl === K.hariIni() || (() => { const k = new Date(); k.setDate(k.getDate() - 1); return b.tgl === `${k.getFullYear()}-${String(k.getMonth() + 1).padStart(2, "0")}-${String(k.getDate()).padStart(2, "0")}`; })();
    return `
      <section class="papan-progres" aria-label="Pangkat dan misi harian">
        <div class="pangkat-kartu" style="--pk:${pk.warna}">
          <span class="pk-lencana" aria-hidden="true">${px(pk.sprite)}<b class="mono">${pk.i + 1}</b></span>
          <span class="pk-isi">
            <small>Pangkat</small>
            <strong>${esc(pk.nama)}</strong>
            <span class="pk-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pk.persen}"><i style="width:${pk.persen}%"></i></span>
            <small class="mono">${P().xp} XP${pk.lanjut ? ` · ${pk.lanjut.xp - P().xp} lagi ke ${esc(pk.lanjut.nama)}` : " · pangkat tertinggi"}</small>
          </span>
          <span class="pk-beruntun" title="Hari beruntun main">${beruntunAktif && b.n ? `<b class="mono">${b.n}</b><small>hari beruntun</small>` : `<small>Main hari ini untuk mulai hari beruntun</small>`}</span>
        </div>
        <div class="misi-harian">
          <p class="misi-judul">Misi harian <small class="mono">ganti tiap tengah malam</small></p>
          <ul>
            ${misi.map((d) => {
              const beres = d.n >= d.def.target;
              return `<li class="misi${beres ? " beres" : ""}${d.klaim ? " diklaim" : ""}${d.def.duel ? " misi-duel" : ""}">
                <span class="misi-teks">${d.def.duel ? '<b class="tag-duel">DUEL</b> ' : ""}${esc(d.def.teks)}</span>
                <span class="misi-bar"><i style="width:${Math.round((d.n / d.def.target) * 100)}%"></i></span>
                ${d.klaim ? `<span class="misi-status mono">diklaim</span>` : beres ? `<button class="btn small primary" type="button" data-klaim="${d.id}">Klaim +${HADIAH_MISI}</button>` : `<span class="misi-status mono">${d.n}/${d.def.target}</span>`}
              </li>`;
            }).join("")}
          </ul>
          <p class="muted small">Selesaikan ketiganya untuk bonus +${HADIAH_SEMUA} Poin Sabar. Misi duel boleh dikerjakan lawan bot.</p>
        </div>
      </section>`;
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-klaim]");
    if (!b) return;
    const h = klaim(b.dataset.klaim);
    if (!h) return;
    sfx("poin");
    memo("Oyen · Kepala Bagian", `Misi diklaim: +${h.poin} Poin Sabar, +${XP_MISI} XP.${h.bonus ? ` Semua misi hari ini beres: bonus +${h.bonus}.` : ""}${h.naik ? ` Naik pangkat: ${h.naik.nama}.` : ""}`, 6500);
    if (h.naik) rayakanPangkat(h.naik);
    K.segarkanIstirahat?.();
  });

  function rayakanPangkat(pk) {
    sfx("menang");
    K.konfetiKertas?.(1.2);
    memo(`Naik pangkat · ${pk.nama}`, pk.kata, 7000);
  }
  // ringkasan setelah game: XP, misi yang baru beres, naik pangkat
  function htmlHasil(h) {
    if (!h) return "";
    return `
      <div class="hasil-progres">
        <span class="mono">+${h.xp} XP</span>
        ${h.selesaiBaru.map((t) => `<span class="hp-misi">Misi beres: ${esc(t)}</span>`).join("")}
        ${h.naikPangkat ? `<span class="hp-pangkat">NAIK PANGKAT: ${esc(h.naikPangkat.nama)}</span>` : ""}
      </div>`;
  }

  K.progres = { lapor, htmlPapan, htmlHasil, pangkatDari, rayakanPangkat, PANGKAT };
})();
