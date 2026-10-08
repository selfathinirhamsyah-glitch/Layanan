/* =========================================================
   Kantor Layanan Perasaan · Data pegawai kehormatan
   Ulang tahun (21 Agustus), kartu pegawai di Meja Kerja,
   dan surat ucapan dari seluruh kantor.
   Tanggal lahir bisa diganti lewat URL: ?lahir=2012-08-21
   ========================================================= */
(() => {
  "use strict";
  const K = window.KLP;
  const { $, esc, px, sfx, memo, NAMA, N } = K;

  const LAHIR_DEFAULT = "2012-08-21";
  const q = new URLSearchParams(location.search).get("lahir") || "";
  const LAHIR = /^\d{4}-\d{2}-\d{2}$/.test(q) ? q : LAHIR_DEFAULT;
  const [TH, BL, TG] = LAHIR.split("-").map(Number);
  const BULAN = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const TGL_LAHIR = `${TG} ${BULAN[BL - 1]}`;

  K.PROFIL = {
    lahir: LAHIR, warna: "Biru", bacaan: "Novel",
    tontonan: "Drakor & film Marvel", lagu: "CORTIS",
  };

  /* ---------- hitung ulang tahun ---------- */
  const hariIni = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
  const selisih = (a, b) => Math.round((a - b) / 86400000);
  function umurSekarang() {
    const n = hariIni();
    const sudah = n.getMonth() + 1 > BL || (n.getMonth() + 1 === BL && n.getDate() >= TG);
    return n.getFullYear() - TH - (sudah ? 0 : 1);
  }
  // mode: "hari" (tepat hari ini), "telat" (1–60 hari sesudah), "segera" (1–14 hari sebelum), null
  function statusUltah() {
    const n = hariIni(), y = n.getFullYear();
    for (const th of [y, y - 1, y + 1]) {
      const d = selisih(n, new Date(th, BL - 1, TG));
      if (d === 0) return { mode: "hari", umur: th - TH, hari: 0, tahun: th };
      if (d > 0 && d <= 60) return { mode: "telat", umur: th - TH, hari: d, tahun: th };
      if (d < 0 && d >= -14) return { mode: "segera", umur: th - TH, hari: -d, tahun: th };
    }
    return { mode: null, umur: umurSekarang() };
  }
  K.statusUltah = statusUltah;

  /* ---------- barang langka: kue ---------- */
  if (K.L13) K.L13.langka.kueUltah = { nama: "Kue Ulang Tahun Biru", sprite: "kue", ket: `Dari seluruh kantor, untuk ${NAMA}. Lilinnya sudah ditiup. Permohonannya dirahasiakan, bahkan dari Oyen.` };

  /* ---------- konfeti biru ---------- */
  function konfetiBiru(kali = 1) {
    if (K.kurangiGerak) return;
    const wadah = $("#confetti");
    if (!wadah) return;
    const jumlah = Math.round((innerWidth < 500 ? 34 : 50) * kali);
    for (let i = 0; i < jumlah; i++) {
      const s = document.createElement("span");
      s.className = `sobekan ${K.acak(["biru", "biru", "biru-tua", "polos"])}`;
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

  /* ---------- pengumuman & kartu di lobi ---------- */
  K.pengumuman.unshift(() => {
    const u = statusUltah();
    if (u.mode === "hari") return { dari: "Pak Singa", sprite: "singa", teks: `PERHATIAN. Hari ini ${TGL_LAHIR}. Kantor libur. Yang berulang tahun: ${NAMA}, ke-${u.umur}. Seluruh pegawai dimohon bersikap biasa saja, tapi dengan senyum.` };
    if (u.mode === "telat") return { dari: "Pak Singa", sprite: "singa", teks: `Perhatian. Ucapan ulang tahun untuk ${NAMA} terlambat ${u.hari} hari. Bagian Surat-Menyurat sudah ditegur. Suratnya ada di atas.` };
    if (u.mode === "segera") return { dari: "Pak Singa", sprite: "singa", teks: `Perhatian. ${u.hari} hari lagi menuju ${TGL_LAHIR}. Bagian Pengadaan sedang memesan kue biru. Ini rahasia. Tolong pura-pura tidak dengar.` };
    return null;
  });

  function isiSlotUltah() {
    const slot = $("#ultahSlot");
    if (!slot) return;
    const u = statusUltah();
    if (!u.mode) { slot.innerHTML = ""; return; }
    if (u.mode === "segera") {
      slot.innerHTML = `
        <div class="kartu-ultah segera">
          <span class="ku-ikon">${px("kue")}</span>
          <span class="ku-isi"><strong>${u.hari} hari lagi</strong><small>Menuju ${TGL_LAHIR}. Kuenya sedang dipesan. Warnanya sudah pasti: biru.</small></span>
        </div>`;
      return;
    }
    const judul = u.mode === "hari" ? `Selamat ulang tahun ke-${u.umur}!` : `Surat ucapan ulang tahun ke-${u.umur}`;
    const ket = u.mode === "hari" ? "Hari ini kantor libur. Ada surat, dan ada kue biru dengan lilin yang belum ditiup." : `Terlambat ${u.hari} hari, sesuai prosedur birokrasi. Kuenya masih di kulkas pantry.`;
    slot.innerHTML = `
      <button type="button" class="kartu-ultah ${u.mode}" data-go="s-ultah">
        <span class="ku-ikon">${px("kue")}</span>
        <span class="ku-isi"><strong>${esc(judul)}</strong><small>${esc(ket)}</small></span>
        <span class="km-panah" aria-hidden="true">→</span>
      </button>`;
    if (u.mode === "hari" && K.data.ultahKonfeti !== K.hariIni()) {
      K.data.ultahKonfeti = K.hariIni(); K.simpan();
      setTimeout(() => { konfetiBiru(1.4); sfx("tingtong"); }, 400);
    }
  }
  const lobiLama = K.saatMasuk["s-lobi"];
  K.saatMasuk["s-lobi"] = () => { lobiLama?.(); isiSlotUltah(); };
  if (K.layarAktif() === "s-lobi") isiSlotUltah();

  /* ---------- halaman surat ulang tahun ---------- */
  const UCAPAN = (u) => [
    ["kapibara", "Bu Ratna", "Selamat ulang tahun ya. Tehnya saya kasih gula hari ini. Dua sendok. Jangan bilang Oyen."],
    ["kura", "Pak Satpam", "Siap. Selamat bertambah umur. Hari ini Anda saya kawal ke mana pun, termasuk ke kulkas."],
    ["marmut", "Dimas", "SELAMAT ULANG TAHUN— eh, kekencengan. Selamat ulang tahun! *saya yang niup terompet tadi. maaf kalau kaget."],
    ["kukang", "Mas Kukang", u.mode === "telat" ? "...selamat ulang tahun. ...ucapan ini saya mulai tulis tanggal 21 Agustus. ...baru selesai." : "...selamat ulang tahun. ...ucapan ini saya mulai tulis bulan Juni. ...pas."],
    ["oyen", "Oyen", "Diketahui. Disetujui. Selamat ulang tahun. Gula hari ini boleh diambil. Satu sendok."],
    ["badak", "Kak Badak", "Umur baru, izin semangat baru. Sudah saya stempel. Mau dipakai boleh, disimpan dulu juga sah."],
    ["rakun", "Bang Rakun", "Mesin kopi saya paksa bikin cokelat panas khusus hari ini. Berhasil. Sekali. Itu buat kamu."],
    ["singa", "Pak Singa", "PERHATIAN. Selamat ulang tahun. Ini volume pelan. Untuk saya, ini pelan."],
  ];
  function isiUltah() {
    const r = $("#ruangUltah");
    const u = statusUltah();
    const umur = u.mode ? u.umur : umurSekarang();
    const tahun = u.tahun || new Date().getFullYear();
    const sudahTiup = K.data.ultahTiup === tahun;
    const pembuka = u.mode === "hari"
      ? `<p>Dengan hormat,</p><p>Hari ini, <strong>${TGL_LAHIR} ${tahun}</strong>, ${N} genap berumur <strong>${umur} tahun</strong>. Sesuai keputusan Kepala Bagian, hari ini ditetapkan sebagai hari libur kantor. Semua loket tutup, kecuali Pantry, karena di Pantry ada kue.</p>`
      : `<p>Dengan hormat,</p><p>Bersama surat ini kami menyampaikan selamat ulang tahun ke-${umur} kepada ${N}, yang jatuh pada <strong>${TGL_LAHIR} ${tahun}</strong>.</p>
         ${u.mode === "telat" ? `<p>Surat ini terlambat <strong>${u.hari} hari</strong>. Menurut hasil rapat, penyebabnya:</p>
         <ol class="ultah-alasan">
           <li>Surat sempat difotokopi Mas Kukang. Prosesnya ${Math.max(1, u.hari - 7)} hari.</li>
           <li>Dimas salah naik lift dan mengantar surat ke lantai yang tidak ada.</li>
           <li>Oyen tidur di atas surat ini selama enam hari. Kami tidak menyesal soal yang nomor 3.</li>
         </ol>` : ""}`;
    r.innerHTML = `
      <div class="form-head"><span class="loket-badge">Surat Resmi</span><span class="mono small">Sifat: sangat hangat</span></div>
      <h2 id="h-ultah">${u.mode === "hari" ? "Hari Libur Kantor" : "Surat Ucapan Ulang Tahun"}</h2>
      <div class="cert-wrap">
        <div class="cert surat-ultah" id="suratUltah" data-accent="A">
          <div class="cert-head">
            <p class="cert-org">Kantor Layanan Perasaan · Bagian Surat-Menyurat</p>
            <p class="cert-title">Selamat Ulang Tahun ke-${umur}</p>
            <p class="cert-no">Nomor: ${String(TG).padStart(2, "0")}${String(BL).padStart(2, "0")}/ULT/KLP/${tahun}</p>
          </div>
          ${pembuka}
          <div class="kue-panggung" aria-label="Kue ulang tahun biru dengan ${umur} lilin">
            <div class="lilin-baris">${Array.from({ length: Math.min(umur, 20) }, (_, i) => `<span class="lilin${sudahTiup ? " padam" : ""}" style="--i:${i}"><i></i></span>`).join("")}</div>
            <div class="kue-badan"><span class="kue-krim"></span><span class="kue-tulisan">${esc(NAMA.toUpperCase())} · ${umur}</span></div>
            <p class="kue-ket">${u.mode === "telat" ? "Kue biru, disimpan di kulkas pantry sejak tanggal 21. Pak Satpam sudah memeriksanya: masih layak dipandang." : `Kue biru, lilinnya ${umur}. Dimas sudah menghitungnya tiga kali.`}</p>
          </div>
          <p class="cert-big">Ucapan dari seluruh pegawai</p>
          <ul class="ultah-ucapan">
            ${UCAPAN(u).map(([sp, nm, t]) => `<li>${K.avatarDok(sp)}<span><strong>${esc(nm)}</strong>${esc(t)}</span></li>`).join("")}
          </ul>
          <p class="cert-big">Data pegawai yang sudah dicatat</p>
          <ul class="ultah-data">
            <li><b>Warna favorit: biru.</b> Semua map hari ini dicetak biru. Bagian Pengadaan kehabisan tinta biru. Tidak apa-apa.</li>
            <li><b>Novel.</b> Bu Ratna menyiapkan pembatas buku, supaya halaman terakhir tidak hilang.</li>
            <li><b>Drakor.</b> Tisu tersedia di Pantry. Tidak ada yang akan bertanya kenapa.</li>
            <li><b>Marvel.</b> Rapat hari ini ditutup dengan menunggu adegan setelah kredit. Dimas masih menunggu.</li>
            <li><b>CORTIS.</b> Lagu mereka diputar di Radio Kantor. Dimas latihan joget di lift. Mohon pura-pura tidak lihat.</li>
          </ul>
          <div class="cert-foot">
            <p>Ditetapkan di Lantai 13<br>Tanggal: ${TGL_LAHIR} ${tahun}${u.mode === "telat" ? " (dikirim belakangan)" : ""}<br><br>Oyen, Kepala Bagian</p>
            <span class="stamp">DISETUJUI<br>TANPA ANTRE</span>
          </div>
        </div>
        <p class="tiup-pesan muted" aria-live="polite">${sudahTiup ? "Lilinnya sudah ditiup. Permohonannya dicatat dan dirahasiakan." : ""}</p>
        <div class="actions">
          <button class="btn primary" type="button" id="btnTiup" ${sudahTiup ? "disabled" : ""}>${sudahTiup ? "Lilin sudah ditiup" : "Tiup lilin"}</button>
          <button class="btn" type="button" data-download="suratUltah" data-file="surat-ulang-tahun">Unduh suratnya</button>
          <button class="btn ghost" type="button" data-go="s-lobi">Kembali ke lobi</button>
        </div>
      </div>`;
  }
  K.saatMasuk["s-ultah"] = isiUltah;

  document.addEventListener("click", (e) => {
    if (!e.target.closest("#btnTiup")) return;
    const u = statusUltah();
    const tahun = u.tahun || new Date().getFullYear();
    if (K.data.ultahTiup === tahun) return;
    const tombol = $("#btnTiup");
    tombol.disabled = true;
    const lilin = [...document.querySelectorAll("#suratUltah .lilin")];
    lilin.forEach((l, i) => setTimeout(() => l.classList.add("padam"), K.kurangiGerak ? 0 : 80 * i));
    sfx("angin");
    setTimeout(() => {
      K.data.ultahTiup = tahun;
      if (K.data.l13 && !K.data.l13.langka.includes("kueUltah")) K.data.l13.langka.push("kueUltah");
      const poin = K.tambahPoin(21);
      K.simpan();
      sfx("menang");
      konfetiBiru(1.5);
      tombol.textContent = "Lilin sudah ditiup";
      $(".tiup-pesan").textContent = "Lilinnya padam semua. Permohonannya dicatat dan dirahasiakan, bahkan dari Oyen.";
      memo("Oyen · Kepala Bagian", `Hadiah dicatat: +${poin} Poin Sabar (sesuai tanggal 21) dan Kue Ulang Tahun Biru di rak Meja Kerja.`, 7000);
    }, K.kurangiGerak ? 100 : 80 * lilin.length + 300);
  });

  /* ---------- kartu pegawai di Meja Kerja ---------- */
  K.kartuPegawai = () => {
    const u = statusUltah();
    const umur = umurSekarang();
    return `
      <div class="kartu-id" aria-label="Kartu pegawai ${esc(NAMA)}">
        <span class="kid-tali" aria-hidden="true"></span>
        <div class="kid-kepala"><span>KARTU PEGAWAI</span><span class="mono">KLP</span></div>
        <div class="kid-isi">
          <div class="kid-foto"><strong>FOTO</strong><small>Pegawai menolak difoto hari ini. Disetujui.</small></div>
          <dl class="kid-data">
            <dt>Nama</dt><dd><strong>${N}</strong></dd>
            <dt>NIP</dt><dd class="mono">${LAHIR.replace(/-/g, "")} 013 001</dd>
            <dt>Jabatan</dt><dd>Pegawai Kehormatan, gol. IV/e (ditetapkan Oyen)</dd>
            <dt>Lahir</dt><dd>${TGL_LAHIR} ${TH} (${umur} tahun)${u.mode === "hari" ? " · <b>hari ini!</b>" : u.mode === "segera" ? ` · ${u.hari} hari lagi` : ""}</dd>
            <dt>Warna dinas</dt><dd>Biru</dd>
            <dt>Bacaan wajib</dt><dd>Novel</dd>
            <dt>Tontonan resmi</dt><dd>Drakor &amp; film Marvel</dd>
            <dt>Lagu radio</dt><dd>CORTIS</dd>
          </dl>
        </div>
        <div class="kid-kaki">Berlaku selamanya. Hilang? Lapor Pak Satpam.</div>
      </div>`;
  };
})();
