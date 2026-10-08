/* =========================================================
   Kantor Layanan Perasaan · Ruang Istirahat Pegawai (Lantai 2)
   Empat mini game singkat, Poin Sabar, skor tertinggi,
   papan "Pegawai Teladan Minggu Ini".
   ========================================================= */
(() => {
  "use strict";
  const K = window.KLP;
  const { $, $$, esc, px, sfx, memo, NAMA } = K;
  const acak = (a, b) => a + Math.random() * (b - a);
  const pilih = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const batas = (v, a, b) => Math.max(a, Math.min(b, v));

  /* ---------- gambar sprite di canvas ---------- */
  const GAMBAR = {};
  function sp(nama) {
    if (!GAMBAR[nama]) { const i = new Image(); i.src = window.SPRITE.png(nama, 8); GAMBAR[nama] = i; }
    return GAMBAR[nama];
  }
  function gambarSprite(ctx, nama, x, y, ukuran) {
    const i = sp(nama);
    if (i.complete) ctx.drawImage(i, Math.round(x - ukuran / 2), Math.round(y - ukuran / 2), ukuran, ukuran);
  }
  const FONT = (n) => `${n}px "Pixelify Sans", monospace`;

  /* ---------- daftar game ---------- */
  const GAMES = {
    rally: {
      nama: "Rally vs Pak Satpam", sprite: "kura", durasi: "sampai 3x gagal",
      cara: "Ketuk layar saat kok masuk lingkaran. Makin pas, makin besar nilainya. Koknya makin lama makin cepat.",
      poin: (s) => s,
    },
    stempel: {
      nama: "Stempel Kilat", sprite: "berkas", durasi: "60 detik",
      cara: "Berkas berjatuhan. Pilih cap yang benar: DISETUJUI, DITOLAK, atau NANTI AJA. Kalau ada Oyen tidur di atas berkas, jangan dicap. Biarkan lewat.",
      poin: (s) => Math.max(0, Math.round(s / 2)),
    },
    kertas: {
      nama: "Tangkap Kertas Terbang", sprite: "saran", durasi: "45 detik",
      cara: "Kipas angin menoleh ke sana kemari. Geser map untuk menangkap berkas. Hindari undangan rapat jam 4 sore.",
      poin: (s) => Math.max(0, s),
    },
    ngemil: {
      nama: "Ngemil Diam-diam di Rapat", sprite: "gorengan", durasi: "45 detik",
      cara: "Tahan layar untuk ngemil gorengan. Lepas saat Oyen menoleh. Kalau ketahuan tiga kali, rapat dibubarkan.",
      poin: (s) => Math.ceil(Math.max(0, s) / 2),
    },
    troli: {
      nama: "Balap Troli Arsip", sprite: "berkas", durasi: "±1 menit, 4 pembalap",
      cara: "Meluncur menuruni parkiran pakai troli arsip. Geser jari ke kiri-kanan untuk menyetir. Ambil teh untuk turbo, berkas emas untuk poin. Hindari tumpukan berkas, pel basah, kardus, dan Oyen yang menyeberang.",
      poin: (s) => Math.round(Math.max(0, s) / 4),
    },
  };
  K.GAMES = GAMES;

  /* =========================================================
     RUANGAN
     ========================================================= */
  function mingguKe() {
    const d = new Date();
    return Math.ceil(d.getDate() / 7);
  }
  function isiRuang() {
    const r = $("#ruangIstirahat");
    const saran = K.data.absen && K.data.absen.tgl === K.hariIni() ? K.data.absen.saranGame : null;
    const totalMira = K.data.poinTotal;
    const BULAN = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    r.innerHTML = `
      <div class="form-head"><span class="loket-badge">Lantai 2</span><span class="mono small">Poin Sabar: <b class="poin-angka">${K.data.poin}</b></span></div>
      <h2 id="h-istirahat">Ruang Istirahat Pegawai</h2>
      <div class="petugas" data-sprite="marmut">
        <div class="petugas-tag">Dimas <small>Anak magang, penjaga ruang istirahat</small></div>
        <p>${saran ? `Bu Ratna titip pesan: hari ini cocoknya main <strong>${esc(GAMES[saran].nama)}</strong>. EH, maksudnya, terserah kamu. *tapi itu saran bagus.` : "SELAMAT DATANG— eh, maaf kekencengan. Silakan pilih game. Semua game di sini resmi, sudah ada SK-nya."}</p>
      </div>

      <section class="teladan" aria-labelledby="h-teladan">
        <h3 id="h-teladan" class="papan-judul">Pegawai Teladan Minggu Ini</h3>
        <p class="teladan-sub mono">Minggu ke-${mingguKe()} · ${BULAN[new Date().getMonth()]}</p>
        <ol class="teladan-list">
          <li class="juara"><span class="avatar avatar-sm">${px("dokumen")}</span>
            <span><strong>${esc(NAMA)}</strong><small>${totalMira >= 100 ? `${totalMira} Poin Sabar sepanjang masa` : "Nilai: tak terhingga (keputusan Kepala Bagian, tidak dapat diganggu gugat)"}</small></span>
            <span class="piala" aria-hidden="true">${px("berkas")}</span></li>
          <li><span class="avatar avatar-sm">${px("kura")}</span><span><strong>Pak Satpam</strong><small>Rally 212 (dihitung sendiri)</small></span></li>
          <li><span class="avatar avatar-sm">${px("marmut")}</span><span><strong>Dimas</strong><small>3 poin (lupa main, sibuk panik)</small></span></li>
          <li><span class="avatar avatar-sm">${px("kukang")}</span><span><strong>Mas Kukang</strong><small>Masih loading</small></span></li>
          <li><span class="avatar avatar-sm">${px("oyen")}</span><span><strong>Oyen</strong><small>Tidak ikut. Juri.</small></span></li>
        </ol>
      </section>

      <div class="kartu-game-list">
        ${Object.entries(GAMES).map(([id, g]) => `
          <article class="kartu-game${saran === id ? " disarankan" : ""}">
            <div class="kg-ikon">${px(g.sprite)}</div>
            <div class="kg-isi">
              <h3>${esc(g.nama)}</h3>
              <p class="muted small">${esc(g.durasi)} · Rekor: <b class="mono">${K.data.skor[id] ?? "–"}</b></p>
            </div>
            <button class="btn primary small" type="button" data-main="${id}">Main</button>
          </article>`).join("")}
      </div>`;
    K.pasangSprite(r);
  }
  K.saatMasuk["s-istirahat"] = isiRuang;
  $("#ruangIstirahat").addEventListener("click", (e) => {
    const b = e.target.closest("[data-main]");
    if (b) bukaArena(b.dataset.main);
  });

  /* =========================================================
     ARENA (layar penuh)
     ========================================================= */
  const arena = $("#arena");
  const kanvas = $("#arenaKanvas");
  const ctx = kanvas.getContext("2d");
  const domGame = $("#arenaDom");
  const kontrol = $("#arenaKontrol");
  const panel = $("#arenaPanel");
  let gameAktif = null, berhenti = null, bebanSebelum = 0;

  function bukaArena(id) {
    gameAktif = id;
    document.body.classList.add("layar-penuh");
    arena.hidden = false;
    $("#arenaJudul").textContent = GAMES[id].nama;
    tampilPanel("sebelum");
  }
  function tutupArena() {
    berhenti?.(); berhenti = null;
    arena.hidden = true;
    document.body.classList.remove("layar-penuh");
    gameAktif = null;
    isiRuang();
  }
  $("#arenaKeluar").addEventListener("click", () => {
    if (berhenti) { berhenti(); berhenti = null; memo("Dimas · Anak Magang", "KELUAR? Oke. Oke. Nggak apa-apa. *skornya tidak dihitung ya."); }
    tutupArena();
  });

  function tampilPanel(jenis, hasil) {
    const g = GAMES[gameAktif];
    panel.hidden = false;
    kontrol.innerHTML = ""; domGame.innerHTML = ""; domGame.hidden = true; kanvas.hidden = true;
    $("#hudSkor").textContent = hasil ? hasil.skor : "0"; $("#hudInfo").textContent = ""; $("#hudWaktu").textContent = "";
    if (jenis === "sebelum") {
      panel.innerHTML = `
        <div class="ap-kepala"><span class="avatar">${px(g.sprite)}</span><p>${esc(g.cara)}</p></div>
        ${gameAktif === "rally" ? `<div class="ap-bagian"><p class="ap-label">Pemanasan (opsional): pukul satu kok. Makin semangat, makin cepat Pak Satpam membalas.</p><div id="pemanasanKok"></div></div>` : ""}
        <div class="ap-bagian"><div id="bebanSebelum"></div></div>
        <div class="actions"><button class="btn primary" type="button" id="mulaiMain">Mulai</button></div>`;
      let semangat = K.data.semangatTerakhir || 0;
      if (gameAktif === "rally") K.skala.kok($("#pemanasanKok"), { onUbah(lv) { semangat = lv; } });
      const beban = K.skala.tumpukan($("#bebanSebelum"), { judul: "Beban pikiran sebelum main (opsional)", awal: 0 });
      $("#mulaiMain").addEventListener("click", () => { bebanSebelum = beban.level; mulai(semangat); });
      return;
    }
    // sesudah
    const { skor, poin, rekor, komentar } = hasil;
    panel.innerHTML = `
      <div class="ap-hasil">
        <p class="ap-skor-label">Skor</p>
        <p class="ap-skor mono">${skor}</p>
        ${rekor ? `<p class="ap-rekor">Rekor baru. Dicatat di buku besar.</p>` : `<p class="muted small">Rekor: ${K.data.skor[gameAktif]}</p>`}
        <p class="ap-poin">+${poin} Poin Sabar</p>
      </div>
      <div class="ap-kepala"><span class="avatar">${px(komentar[0])}</span><p>${esc(komentar[1])}</p></div>
      ${bebanSebelum > 0 ? `<div class="ap-bagian"><div id="bebanSesudah"></div><div class="actions"><button class="btn small" type="button" id="catatBeban">Catat beban sesudah main</button></div></div>` : ""}
      <div class="actions">
        <button class="btn" type="button" id="mainLagi">Main lagi</button>
        <button class="btn primary" type="button" id="selesaiMain">Kembali ke ruang istirahat</button>
      </div>`;
    if (bebanSebelum > 0) {
      const sesudah = K.skala.tumpukan($("#bebanSesudah"), { judul: "Beban pikiran sesudah main", awal: bebanSebelum });
      $("#catatBeban").addEventListener("click", (e) => {
        const selisih = bebanSebelum - sesudah.level;
        e.target.disabled = true;
        if (selisih > 0) {
          const bonus = K.tambahPoin(selisih * 2);
          sfx("poin");
          memo("Dimas · Anak Magang", `BERKURANG ${selisih}! ...eh, maksud saya, berkurang ${selisih}. Bonus ${bonus} Poin Sabar.`);
        } else if (selisih === 0) {
          memo("Dimas · Anak Magang", "Sama. Nggak apa-apa. Kadang game cuma buat ngalihin, bukan buat ngurangin. *kata Bu Ratna.");
        } else {
          memo("Dimas · Anak Magang", "Malah nambah? MAAF— eh, bukan salah siapa-siapa. Mungkin istirahatnya kurang lama. Ke Pantry aja yuk.");
        }
        bebanSebelum = 0;
      });
    }
    $("#mainLagi").addEventListener("click", () => tampilPanel("sebelum"));
    $("#selesaiMain").addEventListener("click", tutupArena);
  }

  async function mulai(semangat) {
    panel.hidden = true;
    const g = GAMES[gameAktif];
    const pakaiDom = gameAktif === "stempel";
    kanvas.hidden = pakaiDom; domGame.hidden = !pakaiDom;
    siapkanKanvas();
    // hitung mundur
    const hm = $("#hitungMundur");
    for (const t of ["3", "2", "1", "MULAI"]) {
      hm.textContent = t; hm.hidden = false; hm.classList.remove("pop"); void hm.offsetWidth; hm.classList.add("pop");
      sfx(t === "MULAI" ? "tingtong" : "klik");
      await new Promise((r) => setTimeout(r, K.kurangiGerak ? 150 : 600));
      if (!gameAktif) return;
    }
    hm.hidden = true;
    const api = buatApi(semangat);
    berhenti = MAIN[gameAktif](api);
    api.selesai = (skor, komentar) => {
      berhenti?.(); berhenti = null;
      const id = gameAktif;
      const rekor = skor > (K.data.skor[id] ?? -Infinity);
      if (rekor) K.data.skor[id] = skor;
      K.data.mainGame = (K.data.mainGame || 0) + 1;
      const poin = K.tambahPoin(g.poin(skor));
      K.simpan();
      K.catat(`game:${id}`, { skor });
      K.catat("game");
      sfx(rekor ? "menang" : "poin");
      tampilPanel("sesudah", { skor, poin, rekor, komentar });
    };
  }

  /* ---------- kanvas ---------- */
  let W = 360, H = 480, skala = 1;
  function siapkanKanvas() {
    const wadah = $("#arenaPanggung").getBoundingClientRect();
    const cssW = Math.min(wadah.width, 480), cssH = Math.min(wadah.height, 720);
    const dpr = Math.min(2, devicePixelRatio || 1);
    kanvas.style.width = `${cssW}px`; kanvas.style.height = `${cssH}px`;
    kanvas.width = Math.round(cssW * dpr); kanvas.height = Math.round(cssH * dpr);
    skala = cssW / 360; W = 360; H = cssH / skala;
    ctx.setTransform(dpr * skala, 0, 0, dpr * skala, 0, 0);
    ctx.imageSmoothingEnabled = false;
  }
  function buatApi(semangat) {
    const api = {
      ctx, W: () => W, H: () => H, dom: domGame, kontrol, semangat, nama: NAMA.toUpperCase().slice(0, 8),
      skor(n) { $("#hudSkor").textContent = n; },
      info(t) { $("#hudInfo").textContent = t; },
      titik(e) { const r = kanvas.getBoundingClientRect(); return { x: (e.clientX - r.left) / skala, y: (e.clientY - r.top) / skala }; },
      loop(fn) {
        let jalan = true, lalu = performance.now(), raf = 0;
        const putar = (now) => {
          if (!jalan) return;
          const dt = Math.min(0.05, (now - lalu) / 1000); lalu = now;
          if (!document.hidden) fn(dt, now / 1000);
          raf = requestAnimationFrame(putar);
        };
        raf = requestAnimationFrame(putar);
        const lihat = () => { lalu = performance.now(); };
        document.addEventListener("visibilitychange", lihat);
        return () => { jalan = false; cancelAnimationFrame(raf); document.removeEventListener("visibilitychange", lihat); };
      },
    };
    return api;
  }
  function teksTengah(t, x, y, ukuran, warna = "#2B2A26") {
    ctx.font = FONT(ukuran); ctx.fillStyle = warna; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(t, x, y);
  }
  function hati(n, maks, x, y) { // nyawa digambar sebagai kok kecil, bukan hati
    for (let i = 0; i < maks; i++) {
      ctx.globalAlpha = i < n ? 1 : 0.2;
      ctx.fillStyle = "#FFFDF6"; ctx.strokeStyle = "#2B2A26"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(x + i * 18, y + 6); ctx.lineTo(x + i * 18 - 6, y - 6); ctx.lineTo(x + i * 18 + 6, y - 6); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#B5443A"; ctx.beginPath(); ctx.arc(x + i * 18, y + 6, 3, 0, 7); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  function kilat(teks, x, y, warna) { return { teks, x, y, warna, umur: 0 }; }
  function gambarKilat(daftar, dt) {
    for (let i = daftar.length - 1; i >= 0; i--) {
      const k = daftar[i]; k.umur += dt;
      if (k.umur > 0.9) { daftar.splice(i, 1); continue; }
      ctx.globalAlpha = 1 - k.umur / 0.9;
      teksTengah(k.teks, k.x, k.y - k.umur * 30, 15, k.warna);
    }
    ctx.globalAlpha = 1;
  }

  /* =========================================================
     GAME
     ========================================================= */
  const MAIN = {};

  /* ---------- 1. Rally vs Pak Satpam ---------- */
  MAIN.rally = (api) => {
    const DUR0 = [1.45, 1.55, 1.45, 1.35, 1.22, 1.1][api.semangat || 0];
    let dur = DUR0, skor = 0, nyawa = 3, pukulan = 0;
    let fase = "datang", t = 0, targetX = W / 2, ayun = 0, jeda = 0, efek = [];
    const satY = () => H * 0.13, zonaY = () => H * 0.78;
    let komentar = "";
    const KOMENTAR = { 5: "Siap. Lima pukulan. Dicatat.", 10: "Siap. Saya mulai berkeringat. Di dalam cangkang.", 15: "Siap. Ini sudah setara final antar-RT.", 25: "Siap. Ini rekor gedung. Mohon jangan bilang ke Pak RT." };
    function kokPos() {
      if (fase === "datang" || fase === "lewat") {
        const p = fase === "datang" ? t : 1 + t;
        const x = W / 2 + (targetX - W / 2) * p;
        const y = satY() + (zonaY() - satY()) * p;
        return { x, y: y - Math.sin(Math.min(p, 1) * Math.PI) * 26, s: 0.7 + 0.6 * p };
      }
      const x = targetX + (W / 2 - targetX) * t;
      const y = zonaY() + (satY() - zonaY()) * t;
      return { x, y: y - Math.sin(t * Math.PI) * 36, s: 1.3 - 0.6 * t };
    }
    function ketuk(e) {
      e.preventDefault();
      if (ayun > 0) return;
      ayun = 0.25;
      if (fase !== "datang" && fase !== "lewat") { sfx("klik"); return; }
      const k = kokPos(), jarak = Math.abs(k.y - zonaY());
      if (jarak > 42) { efek.push(kilat("kecepetan", targetX, zonaY() - 50, "#5D5A50")); sfx("klik"); return; }
      const nilai = jarak < 10 ? 2 : 1;
      skor += nilai; pukulan++;
      api.skor(skor);
      efek.push(kilat(jarak < 10 ? "SEMPURNA +2" : jarak < 26 ? "BAGUS +1" : "TIPIS +1", targetX, zonaY() - 50, jarak < 10 ? "#4F6E5E" : "#2F4A6B"));
      sfx("pukul");
      if (KOMENTAR[pukulan]) { komentar = KOMENTAR[pukulan]; api.info(komentar); }
      dur = Math.max(0.55, dur * 0.965);
      fase = "balik"; t = 0;
    }
    kanvas.addEventListener("pointerdown", ketuk);
    api.info("Siap. Saya servis duluan.");
    const stop = api.loop((dt) => {
      // logika
      if (jeda > 0) { jeda -= dt; }
      else if (fase === "datang") { t += dt / dur; if (t >= 1) { fase = "lewat"; t = 0; } }
      else if (fase === "lewat") {
        t += dt / dur;
        if (t > 0.18) {
          nyawa--; sfx("salah");
          efek.push(kilat("LEWAT", targetX, zonaY(), "#B5443A"));
          api.info(pilih(["Siap. Kok keluar. Bukan salah Anda, anginnya dari AC.", "Siap. Lewat. Saya juga sering begitu, tapi tidak pernah mengaku.", "Siap. Kok-nya terlalu cepat. Akan saya tegur."]));
          if (nyawa <= 0) { fase = "selesai"; setTimeout(() => api.selesai(skor, ["kura", skor >= 20 ? "Siap. Saya akui kalah. Tolong jangan disebarkan." : skor >= 8 ? "Siap. Permainan Anda tercatat rapi. Saya pura-pura tidak capek." : "Siap. Pemanasan yang bagus. Rally sungguhan besok, kalau Anda mau."]), 500); }
          else { fase = "datang"; t = 0; targetX = acak(W * 0.25, W * 0.75); jeda = 0.7; }
        }
      } else if (fase === "balik") { t += dt / (dur * 0.8); if (t >= 1) { fase = "datang"; t = 0; targetX = acak(W * 0.22, W * 0.78); sfx("pukul"); } }
      if (ayun > 0) ayun -= dt;

      // gambar
      ctx.fillStyle = "#7FA868"; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "#FFFDF6"; ctx.lineWidth = 3;
      ctx.strokeRect(20, 20, W - 40, H - 40);
      ctx.beginPath(); ctx.moveTo(W / 2, 20); ctx.lineTo(W / 2, H - 20); ctx.stroke();
      // net
      ctx.fillStyle = "#2B2A26"; ctx.fillRect(10, H * 0.45 - 4, W - 20, 8);
      ctx.fillStyle = "#FFFDF6"; for (let x = 12; x < W - 12; x += 8) ctx.fillRect(x, H * 0.45 - 2, 4, 4);
      gambarSprite(ctx, "kura", W / 2, satY(), 56);
      // zona pukul
      ctx.strokeStyle = fase === "datang" && t > 0.6 ? "#F2C14E" : "rgba(255,253,246,.8)"; ctx.lineWidth = 4;
      ctx.setLineDash([6, 6]); ctx.beginPath(); ctx.arc(targetX, zonaY(), 34, 0, 7); ctx.stroke(); ctx.setLineDash([]);
      // raket
      ctx.save(); ctx.translate(targetX + 30, zonaY() + 38); ctx.rotate(ayun > 0 ? -0.9 : 0.2);
      ctx.strokeStyle = "#2B2A26"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -28); ctx.stroke();
      ctx.strokeStyle = "#2F4A6B"; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(0, -42, 11, 15, 0, 0, 7); ctx.stroke();
      ctx.restore();
      // kok
      if (fase !== "selesai") {
        const k = kokPos();
        ctx.save(); ctx.translate(k.x, k.y); ctx.scale(k.s, k.s); ctx.rotate(fase === "balik" ? Math.PI : 0);
        ctx.fillStyle = "#FFFDF6"; ctx.strokeStyle = "#2B2A26"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, 6); ctx.lineTo(-9, -10); ctx.lineTo(9, -10); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#B5443A"; ctx.beginPath(); ctx.arc(0, 7, 4.5, 0, 7); ctx.fill(); ctx.stroke();
        ctx.restore();
      }
      hati(nyawa, 3, 32, H - 34);
      gambarKilat(efek, dt);
    });
    return () => { stop(); kanvas.removeEventListener("pointerdown", ketuk); };
  };

  /* ---------- 2. Stempel Kilat ---------- */
  const BERKAS = {
    setuju: ["Izin rebahan 15 menit", "Permohonan makan siang tepat waktu", "Cuti karena hujan enak buat tidur", "Pengajuan tidur lebih awal", "Izin tidak membuka grup chat", "Permintaan tambahan teh manis", "Libur dari overthinking", "Izin minum air putih"],
    tolak: ["Lembur hari Minggu", "Rapat jam 4 sore hari Jumat", "Rapat yang bisa jadi email", "Revisi ke-17 (final_final_banget)", "Membandingkan diri dengan orang di internet", "Begadang demi tugas yang belum dibuka", "Menyalahkan diri sendiri (lagi)"],
    nanti: ["Balas chat grup 300 pesan", "Beres-beres lemari", "Memikirkan masa depan 10 tahun lagi", "Menjawab \"kapan...?\" dari saudara", "Belajar bahasa baru mulai Senin", "Merapikan 4.000 foto di galeri"],
  };
  MAIN.stempel = (api) => {
    const DURASI = 60;
    let sisa = DURASI, skor = 0, jedaSpawn = 0.3, kartu = [], id = 0, benar = 0, salah = 0;
    api.dom.innerHTML = `<div class="stempel-jalur" id="stJalur"><div class="stempel-garis-bawah">batas meja</div></div>`;
    const jalur = $("#stJalur");
    api.kontrol.innerHTML = `
      <button class="cap-btn setuju" type="button" data-cap="setuju">DISETUJUI</button>
      <button class="cap-btn tolak" type="button" data-cap="tolak">DITOLAK</button>
      <button class="cap-btn nanti" type="button" data-cap="nanti">NANTI AJA</button>`;
    function spawn() {
      const oyen = Math.random() < 0.12;
      const jenis = oyen ? "oyen" : pilih(["setuju", "tolak", "nanti"]);
      const el = document.createElement("div");
      el.className = `st-kartu${oyen ? " st-oyen" : ""}`;
      el.innerHTML = oyen
        ? `<span class="st-sprite">${px("oyen")}</span><span>(Oyen sedang tidur di atas berkas ini)</span><span class="st-zzz">z z z</span>`
        : `<span class="st-no mono">No. ${String(++id).padStart(3, "0")}</span><span>${esc(pilih(BERKAS[jenis]))}</span>`;
      el.style.left = `${acak(4, 30)}%`;
      jalur.appendChild(el);
      const kecepatan = 1 / batas(5.2 - (DURASI - sisa) * 0.05, 2.6, 5.2);
      kartu.push({ el, jenis, y: 0, v: kecepatan, selesai: false });
    }
    function cap(e) {
      const b = e.target.closest("[data-cap]");
      if (!b) return;
      const k = kartu.find((c) => !c.selesai);
      if (!k) { sfx("klik"); return; }
      const pilihan = b.dataset.cap;
      k.selesai = true;
      const stempel = document.createElement("b");
      stempel.className = `st-cap ${pilihan}`;
      stempel.textContent = { setuju: "DISETUJUI", tolak: "DITOLAK", nanti: "NANTI AJA" }[pilihan];
      k.el.appendChild(stempel);
      sfx("stempel");
      if (k.jenis === "oyen") {
        skor -= 3; salah++;
        api.info("Oyen: Ditolak. Alasan: saya sedang tidur di situ.");
        sfx("meong");
      } else if (k.jenis === pilihan) {
        skor += 2; benar++;
        api.info(pilih(["Bu Ratna: Pas ya.", "Mas Kukang: ...tepat.", "Dimas: BENAR— eh, benar.", ""]));
      } else {
        skor -= 1; salah++;
        api.info(`Dimas: Eh, itu harusnya ${{ setuju: "DISETUJUI", tolak: "DITOLAK", nanti: "NANTI AJA" }[k.jenis]}. Nggak apa-apa, saya juga sering.`);
        k.el.classList.add("keliru");
      }
      api.skor(skor);
      setTimeout(() => k.el.classList.add("pergi"), 260);
      setTimeout(() => k.el.remove(), 700);
    }
    api.kontrol.addEventListener("click", cap);
    api.info("Berkas pertama datang.");
    const stop = api.loop((dt) => {
      sisa -= dt;
      if (sisa <= 0) {
        stop2();
        const komentar = benar >= 20 ? ["oyen", "Diketahui. Kinerja: memuaskan. Boleh pulang lima menit lebih awal."] : benar >= 10 ? ["kapibara", "Rapi ya. Berkasnya juga kelihatan lega."] : ["marmut", "Banyak berkas ya. Saya juga panik tadi. *selalu, sebenarnya."];
        api.selesai(Math.max(0, skor), komentar);
        return;
      }
      jedaSpawn -= dt;
      if (jedaSpawn <= 0) { spawn(); jedaSpawn = batas(2.3 - (DURASI - sisa) * 0.025, 1.0, 2.3); }
      for (let i = kartu.length - 1; i >= 0; i--) {
        const k = kartu[i];
        if (!k.selesai) {
          k.y += k.v * dt;
          k.el.style.top = `${k.y * 82}%`;
          if (k.y >= 1) {
            k.selesai = true;
            if (k.jenis === "oyen") { skor += 1; api.info("Oyen lewat dengan selamat. Tidurnya tidak terganggu. +1"); sfx("meong"); }
            else { api.info("Berkas jatuh dari meja. Pak Satpam memungutnya."); sfx("kertas"); }
            api.skor(skor);
            k.el.classList.add("jatuh");
            setTimeout(() => k.el.remove(), 500);
          }
        }
        if (k.selesai && !k.el.isConnected) kartu.splice(i, 1);
      }
      $("#hudWaktu").textContent = `${Math.max(0, Math.ceil(sisa))} dtk`;
    });
    const stop2 = () => { stop(); api.kontrol.removeEventListener("click", cap); };
    return stop2;
  };

  /* ---------- 3. Tangkap Kertas Terbang ---------- */
  MAIN.kertas = (api) => {
    const DURASI = 45;
    let sisa = DURASI, skor = 0, waktu = 0, mapX = W / 2, targetMapX = W / 2, getar = 0, jeda = 0.4;
    const kertas = [], efek = [];
    const mapY = () => H - 70;
    function gerak(e) { targetMapX = batas(api.titik(e).x, 40, W - 40); }
    kanvas.addEventListener("pointerdown", gerak);
    kanvas.addEventListener("pointermove", gerak);
    api.info("Kipas angin dinyalakan. Mode: menoleh.");
    const stop = api.loop((dt) => {
      waktu += dt; sisa -= dt;
      if (sisa <= 0) {
        stop2();
        api.selesai(skor, skor >= 25 ? ["kukang", "...semua berkas selamat. Saya akan memfotokopinya. Besok."] : skor >= 12 ? ["kapibara", "Banyak yang ketangkep ya. Sisanya biar diambil angin."] : ["marmut", "KIPASNYA KENCENG BANGET— eh, maaf. Iya, kencang. Bukan salah kamu."]);
        return;
      }
      const sudut = Math.sin(waktu * 0.9) * 0.75;
      const angin = Math.sin(sudut) * 95;
      jeda -= dt;
      if (jeda <= 0) {
        const r = Math.random();
        const jenis = r < 0.06 ? "emas" : r < 0.27 ? "rapat" : "baik";
        kertas.push({ x: W / 2 + acak(-30, 30), y: 70, vx: acak(-20, 20), vy: acak(26, 40), rot: acak(0, 6), vr: acak(-3, 3), jenis, fase: acak(0, 6) });
        jeda = batas(0.85 - (DURASI - sisa) * 0.008, 0.45, 0.85);
      }
      mapX += (targetMapX - mapX) * Math.min(1, dt * 14);
      if (getar > 0) getar -= dt;
      for (let i = kertas.length - 1; i >= 0; i--) {
        const k = kertas[i];
        k.vx += (angin - k.vx) * dt * 0.9;
        k.x += (k.vx + Math.sin(waktu * 3 + k.fase) * 30) * dt;
        k.vy = Math.min(k.vy + 8 * dt, 95);
        k.y += k.vy * dt; k.rot += k.vr * dt;
        if (k.x < 10 || k.x > W - 10) k.vx *= -0.6, k.x = batas(k.x, 10, W - 10);
        if (k.y > mapY() - 12 && k.y < mapY() + 14 && Math.abs(k.x - mapX) < 42) {
          kertas.splice(i, 1);
          if (k.jenis === "rapat") { skor -= 2; getar = 0.3; efek.push(kilat("rapat 16.00 -2", k.x, k.y - 20, "#B5443A")); sfx("salah"); api.info("Undangan rapat jam 4 sore masuk map. Akan kami pura-pura tidak lihat."); }
          else if (k.jenis === "emas") { skor += 3; efek.push(kilat("+3 surat rahasia", k.x, k.y - 20, "#9A7224")); sfx("poin"); api.info("Dapat surat dari Mesin Fotokopi untuk Printer. Isinya rahasia. +3"); K.catat("suratPrinter"); }
          else { skor += 1; efek.push(kilat("+1", k.x, k.y - 20, "#2F4A6B")); sfx("kertas"); }
          api.skor(skor);
        } else if (k.y > H + 20) kertas.splice(i, 1);
      }
      // gambar
      ctx.fillStyle = "#F0EADB"; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "rgba(47,74,107,.07)"; for (let x = 0; x < W; x += 22) ctx.fillRect(x, 0, 1, H); for (let y = 0; y < H; y += 22) ctx.fillRect(0, y, W, 1);
      // kipas
      ctx.save(); ctx.translate(W / 2, 46);
      ctx.fillStyle = "#3B4046"; ctx.fillRect(-4, -40, 8, 26);
      ctx.rotate(sudut);
      ctx.fillStyle = "#FFFDF6"; ctx.strokeStyle = "#2B2A26"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.ellipse(0, 0, 30, 30 * 0.55, 0, 0, 7); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = "#5B6F86"; ctx.lineWidth = 2;
      for (let a = 0; a < 3; a++) { const s = waktu * 18 + a * 2.1; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(s) * 24, Math.sin(s) * 13); ctx.stroke(); }
      ctx.strokeStyle = "rgba(91,111,134,.35)"; ctx.setLineDash([4, 8]);
      for (let j = -1; j <= 1; j++) { ctx.beginPath(); ctx.moveTo(0, 12); ctx.lineTo(j * 30 + Math.sin(sudut) * 90, 120); ctx.stroke(); }
      ctx.setLineDash([]); ctx.restore();
      // kertas
      for (const k of kertas) {
        ctx.save(); ctx.translate(k.x, k.y); ctx.rotate(Math.sin(k.rot) * 0.6);
        ctx.fillStyle = k.jenis === "emas" ? "#F2D28A" : "#FFFDF6"; ctx.strokeStyle = "#2B2A26"; ctx.lineWidth = 2;
        ctx.fillRect(-11, -14, 22, 28); ctx.strokeRect(-11, -14, 22, 28);
        ctx.fillStyle = k.jenis === "rapat" ? "#B5443A" : "#9FB2C8";
        for (let l = 0; l < 4; l++) ctx.fillRect(-7, -9 + l * 6, l === 3 ? 8 : 14, 2);
        if (k.jenis === "rapat") { ctx.fillStyle = "#B5443A"; ctx.fillRect(-11, -14, 22, 5); }
        ctx.restore();
      }
      // map
      ctx.save(); ctx.translate(mapX + (getar > 0 ? Math.sin(waktu * 80) * 4 : 0), mapY());
      ctx.fillStyle = "#E0B84A"; ctx.strokeStyle = "#2B2A26"; ctx.lineWidth = 3;
      ctx.fillRect(-42, -8, 84, 30); ctx.strokeRect(-42, -8, 84, 30);
      ctx.fillRect(-42, -16, 30, 9); ctx.strokeRect(-42, -16, 30, 9);
      ctx.restore();
      teksTengah("geser map ke kiri-kanan", W / 2, H - 22, 12, "#5D5A50");
      gambarKilat(efek, dt);
      $("#hudWaktu").textContent = `${Math.max(0, Math.ceil(sisa))} dtk`;
    });
    const stop2 = () => { stop(); kanvas.removeEventListener("pointerdown", gerak); kanvas.removeEventListener("pointermove", gerak); };
    return stop2;
  };

  /* ---------- 4. Ngemil Diam-diam di Rapat ---------- */
  MAIN.ngemil = (api) => {
    const DURASI = 45;
    let sisa = DURASI, skor = 0, nyawa = 3, tahan = false, harusLepas = false, gigit = 0, potongan = 0;
    let keadaan = "presentasi", sisaKeadaan = acak(1.8, 3.2), waktu = 0, kedip = 0;
    const efek = [];
    const tekan = (e) => { e.preventDefault(); tahan = true; };
    const lepas = () => { tahan = false; harusLepas = false; };
    kanvas.addEventListener("pointerdown", tekan);
    kanvas.addEventListener("pointerup", lepas);
    kanvas.addEventListener("pointerleave", lepas);
    kanvas.addEventListener("pointercancel", lepas);
    kanvas.addEventListener("contextmenu", (e) => e.preventDefault());
    api.info("Oyen: Rapat dimulai. Agenda: gula.");
    const KALIMAT_OYEN = ["Agenda satu: gula.", "Agenda dua: gula (lanjutan).", "Grafik ini naik. Saya tidak tahu kenapa.", "Pertanyaan? Tidak ada. Bagus.", "Slide berikutnya: foto saya tidur."];
    const stop = api.loop((dt) => {
      waktu += dt; sisa -= dt; sisaKeadaan -= dt;
      if (sisa <= 0 || nyawa <= 0) {
        stop2();
        api.selesai(skor, nyawa <= 0 ? ["oyen", "Rapat dibubarkan. Gorengan disita. Untuk keperluan rapat berikutnya."] : skor >= 40 ? ["oyen", "Diketahui. Saya tahu dari tadi. Tidak apa-apa. Saya juga lapar."] : ["kapibara", "Kenyang sedikit ya. Rapatnya juga jadi kerasa lebih pendek."]);
        return;
      }
      if (sisaKeadaan <= 0) {
        if (keadaan === "presentasi") { keadaan = "curiga"; sisaKeadaan = acak(0.45, 0.75); sfx("klik"); }
        else if (keadaan === "curiga") { keadaan = "menoleh"; sisaKeadaan = acak(1.0, 1.9); }
        else { keadaan = "presentasi"; sisaKeadaan = acak(1.4, 3.4) * batas(sisa / DURASI + 0.4, 0.6, 1.2); api.info(`Oyen: ${pilih(KALIMAT_OYEN)}`); }
      }
      if (tahan && !harusLepas) {
        if (keadaan === "menoleh") {
          nyawa--; harusLepas = true; kedip = 0.5;
          sfx("meong");
          efek.push(kilat("KETAHUAN", W / 2, H * 0.55, "#B5443A"));
          api.info(pilih(["Oyen: Gorengan disita. Untuk keperluan rapat.", "Oyen: ...Diketahui.", "Oyen: Mulutnya kenapa gerak-gerak?"]));
        } else {
          gigit += dt;
          if (gigit >= 0.3) { gigit = 0; skor++; potongan = (potongan + 1) % 3; sfx("kertas"); efek.push(kilat("nyam", W / 2 + acak(-40, 40), H * 0.66, "#9A7224")); api.skor(skor); }
        }
      } else gigit = 0;
      if (kedip > 0) kedip -= dt;

      // gambar ruangan rapat
      ctx.fillStyle = "#E9E2D0"; ctx.fillRect(0, 0, W, H);
      // papan tulis
      ctx.fillStyle = "#FFFDF6"; ctx.strokeStyle = "#2B2A26"; ctx.lineWidth = 3;
      ctx.fillRect(40, 30, W - 80, H * 0.3); ctx.strokeRect(40, 30, W - 80, H * 0.3);
      ctx.strokeStyle = "#2F4A6B"; ctx.lineWidth = 3; ctx.beginPath();
      const gx = 60, gy = 30 + H * 0.26;
      ctx.moveTo(gx, gy); ctx.lineTo(gx + 50, gy - 20); ctx.lineTo(gx + 100, gy - 10); ctx.lineTo(gx + 160, gy - 50); ctx.stroke();
      teksTengah("GULA: ???", W - 100, 50, 13, "#B5443A");
      // Oyen
      const oy = 30 + H * 0.3 + 10;
      gambarSprite(ctx, keadaan === "menoleh" ? "oyen" : "oyenBelakang", W * 0.68, oy, 76);
      if (keadaan === "curiga") { teksTengah("!", W * 0.68 + 30, oy - 44, 26, "#B5443A"); }
      // meja
      ctx.fillStyle = "#9C6B43"; ctx.fillRect(0, H * 0.62, W, H * 0.38);
      ctx.fillStyle = "#8A5E3B"; ctx.fillRect(0, H * 0.62, W, 8);
      // piring + gorengan
      ctx.fillStyle = "#FFFDF6"; ctx.strokeStyle = "#2B2A26"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.ellipse(W / 2, H * 0.8, 70, 22, 0, 0, 7); ctx.fill(); ctx.stroke();
      for (let i = 0; i < 3; i++) gambarSprite(ctx, "gorengan", W / 2 - 34 + i * 34, H * 0.78, 44);
      ctx.fillStyle = "#9C6B43"; // bekas gigitan
      for (let i = 0; i < potongan; i++) { ctx.beginPath(); ctx.arc(W / 2 + 50, H * 0.77 - 6 + i * 7, 6, 0, 7); ctx.fill(); }
      // status
      teksTengah(tahan && !harusLepas ? (keadaan === "menoleh" ? "" : "ngemil...") : harusLepas ? "lepas dulu" : "tahan untuk ngemil", W / 2, H - 24, 14, "#FFFDF6");
      hati(nyawa, 3, 26, H * 0.62 + 24);
      if (kedip > 0) { ctx.fillStyle = `rgba(181,68,58,${kedip * 0.5})`; ctx.fillRect(0, 0, W, H); }
      gambarKilat(efek, dt);
      $("#hudWaktu").textContent = `${Math.max(0, Math.ceil(sisa))} dtk`;
    });
    const stop2 = () => {
      stop();
      kanvas.removeEventListener("pointerdown", tekan); kanvas.removeEventListener("pointerup", lepas);
      kanvas.removeEventListener("pointerleave", lepas); kanvas.removeEventListener("pointercancel", lepas);
    };
    return stop2;
  };

  /* ---------- 5. Balap Troli Arsip ---------- */
  MAIN.troli = (api) => {
    const PANJANG = 16000;                     // jarak lintasan (px dunia)
    const PEMAIN_Y = () => H * 0.74;
    const tengah = (d) => W / 2 + Math.sin(d / 260) * 70 + Math.sin(d / 113 + 1.3) * 26;
    const lebar = (d) => 168 - Math.min(40, d / PANJANG * 40);
    let d = 0, x = W / 2, targetX = W / 2, laju = 0, turbo = 0, licin = 0, lambat = 0, waktu = 0, emas = 0, tabrak = 0;
    let selesai = false, finis = null, jedaGesek = 0;
    const efek = [];
    const benda = [];                          // { d, off, jenis, kena, vx }
    const LAWAN = [
      { nama: "Pak Satpam", sprite: "kura", d: 0, laju: 0, maks: 300, off: -40, warna: "#2F4A6B" },
      { nama: "Dimas", sprite: "marmut", d: 0, laju: 0, maks: 312, off: 0, warna: "#B5443A" },
      { nama: "Kak Badak", sprite: "badak", d: 0, laju: 0, maks: 326, off: 40, warna: "#4F6E5E" },
    ];
    LAWAN.forEach((l) => { l.goyang = Math.random() * 6; });
    // isi lintasan dengan rintangan & bonus
    for (let jarak = 700; jarak < PANJANG - 400; jarak += acak(150, 260)) {
      const r = Math.random();
      const jenis = r < 0.24 ? "berkas" : r < 0.4 ? "pel" : r < 0.55 ? "kardus" : r < 0.62 ? "oyen" : r < 0.82 ? "teh" : "emas";
      benda.push({ d: jarak, off: acak(-0.38, 0.38), jenis, kena: false, vx: jenis === "oyen" ? (Math.random() < 0.5 ? -38 : 38) : 0 });
    }
    function gerak(e) { targetX = api.titik(e).x; }
    kanvas.addEventListener("pointerdown", gerak);
    kanvas.addEventListener("pointermove", gerak);
    api.info("Pak Satpam: Siap. Rem troli tidak berfungsi. Itu fitur.");

    function posisi() {
      const urut = [{ pemain: true, d }, ...LAWAN.map((l) => ({ pemain: false, d: l.d }))].sort((a, b) => b.d - a.d);
      return urut.findIndex((u) => u.pemain) + 1;
    }
    function gambarTroli(cx, cy, warna, sprite, tulisan) {
      ctx.save(); ctx.translate(Math.round(cx), Math.round(cy));
      ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.fillRect(-17, -20, 38, 46);
      ctx.fillStyle = "#2B2A26"; [[-19, -16], [13, -16], [-19, 12], [13, 12]].forEach(([a, b]) => ctx.fillRect(a, b, 6, 9));
      ctx.fillStyle = warna; ctx.fillRect(-15, -22, 30, 44);
      ctx.strokeStyle = "#2B2A26"; ctx.lineWidth = 2.5; ctx.strokeRect(-15, -22, 30, 44);
      ctx.fillStyle = "#FFFDF6"; ctx.fillRect(-10, 4, 20, 14); ctx.fillStyle = "#E0B84A"; ctx.fillRect(-10, 8, 20, 3);
      if (sprite) gambarSprite(ctx, sprite, 0, -8, 28);
      else { ctx.fillStyle = "#F2C14E"; ctx.fillRect(-8, -16, 16, 16); ctx.strokeRect(-8, -16, 16, 16); }
      if (tulisan) teksTengah(tulisan, 0, -32, 10, "#FFFDF6");
      ctx.restore();
    }

    const stop = api.loop((dt) => {
      waktu += dt;
      if (!selesai) {
        // laju
        const lebarJalan = lebar(d), c = tengah(d), luar = Math.abs(x - c) > lebarJalan / 2 - 16;
        const maks = 330 + (turbo > 0 ? 170 : 0) - (lambat > 0 ? 150 : 0) - (luar ? 170 : 0);
        laju += (maks - laju) * Math.min(1, dt * (laju < maks ? 1.4 : 4));
        if (turbo > 0) turbo -= dt;
        if (lambat > 0) lambat -= dt;
        jedaGesek -= dt;
        if (luar && jedaGesek <= 0) { jedaGesek = 0.9; efek.push(kilat("gesek tembok", x, PEMAIN_Y() - 34, "#FFFDF6")); sfx("salah"); }
        d += laju * dt;
        // setir
        let sasaran = targetX;
        if (licin > 0) { licin -= dt; sasaran += Math.sin(waktu * 14) * 60; }
        x += Math.max(-340 * dt, Math.min(340 * dt, sasaran - x));
        x = batas(x, 18, W - 18);
        // lawan (sedikit karet supaya tetap seru)
        LAWAN.forEach((l, i) => {
          const selisih = l.d - d;
          const karet = selisih > 500 ? -40 : selisih < -500 ? 45 : 0;
          const target = l.maks + karet + Math.sin(waktu * 0.7 + l.goyang) * 25;
          l.laju += (target - l.laju) * dt * 1.2;
          l.d += l.laju * dt;
          if (l.d >= PANJANG && !l.finis) l.finis = waktu;
          void i;
        });
        // tabrakan & ambil
        for (const b of benda) {
          if (b.kena) continue;
          if (b.jenis === "oyen") b.off += (b.vx / lebar(b.d)) * dt;
          const by = PEMAIN_Y() - (b.d - d);
          if (by < PEMAIN_Y() - 30 || by > PEMAIN_Y() + 26) continue;
          const bx = tengah(b.d) + b.off * lebar(b.d);
          if (Math.abs(bx - x) > 26) continue;
          b.kena = true;
          if (b.jenis === "teh") { turbo = 2.2; sfx("poin"); efek.push(kilat("TURBO TEH!", x, PEMAIN_Y() - 40, "#F2C14E")); api.info("Bu Ratna: Diminum pelan-pelan ya. Eh, sudah habis."); }
          else if (b.jenis === "emas") { emas++; sfx("pilih"); efek.push(kilat("+berkas emas", x, PEMAIN_Y() - 40, "#F2C14E")); }
          else if (b.jenis === "pel") { licin = 1.1; sfx("boing"); efek.push(kilat("LICIN", x, PEMAIN_Y() - 40, "#9FC3E0")); api.info("Dimas: ITU BARU DIPEL— eh, maaf, saya yang ngepel."); }
          else if (b.jenis === "oyen") { lambat = 1.2; tabrak++; sfx("meong"); efek.push(kilat("Ditolak.", x, PEMAIN_Y() - 40, "#E39B4A")); api.info("Oyen: Ini wilayah saya. Silakan memutar."); }
          else { lambat = 0.9; tabrak++; sfx("kertas"); efek.push(kilat(b.jenis === "berkas" ? "berkas berhamburan" : "kardus penyok", x, PEMAIN_Y() - 40, "#FFFDF6")); }
        }
        $("#hudWaktu").textContent = `Posisi ${posisi()}/4`;
        if (d >= PANJANG) {
          selesai = true; finis = posisi();
          sfx(finis === 1 ? "menang" : "tingtong");
          const skor = [0, 160, 110, 80, 60][finis] + emas * 12 + Math.max(0, 40 - tabrak * 8);
          const KOMENTAR = [null,
            ["badak", "JUARA. Saya kalah, dan saya menerima dengan lapang dada. Dada saya lapang. Saya badak."],
            ["kura", "Siap. Juara dua. Saya juara satu antar-RT, jadi ini masih terhormat. Untuk Anda."],
            ["marmut", "Juara tiga! Eh, itu bagus kok. Saya biasanya juara 'paling sering nabrak'."],
            ["kapibara", "Yang penting sampai bawah ya. Troli juga butuh istirahat."]];
          const [sp, kata] = KOMENTAR[finis];
          setTimeout(() => api.selesai(skor, [sp, `Finis posisi ${finis} dari 4, ${emas} berkas emas. ${kata}`]), 900);
        }
      }

      // ===== gambar =====
      ctx.fillStyle = "#8D8A84"; ctx.fillRect(0, 0, W, H);
      const langkahY = 8;
      for (let y = 0; y <= H + langkahY; y += langkahY) {
        const dd = d + (PEMAIN_Y() - y);
        const c = tengah(dd), l = lebar(dd);
        ctx.fillStyle = "#5C5A57"; ctx.fillRect(c - l / 2, y, l, langkahY + 1);
        ctx.fillStyle = "#F2C14E"; ctx.fillRect(c - l / 2 - 6, y, 6, langkahY + 1); ctx.fillRect(c + l / 2, y, 6, langkahY + 1);
        if (Math.floor(dd / 40) % 2 === 0) { ctx.fillStyle = "#E9E2D0"; ctx.fillRect(c - 2, y, 4, langkahY + 1); }
      }
      // pilar parkiran & tanda lantai
      for (let k = Math.floor((d - 200) / 400); k < (d + H) / 400 + 1; k++) {
        const dd = k * 400, y = PEMAIN_Y() - (dd - d);
        if (y < -40 || y > H + 40) continue;
        const c = tengah(dd), l = lebar(dd);
        ctx.fillStyle = "#B9B4AA"; ctx.fillRect(c - l / 2 - 30, y - 12, 18, 24); ctx.fillRect(c + l / 2 + 12, y - 12, 18, 24);
        ctx.strokeStyle = "#2B2A26"; ctx.lineWidth = 2; ctx.strokeRect(c - l / 2 - 30, y - 12, 18, 24); ctx.strokeRect(c + l / 2 + 12, y - 12, 18, 24);
        if (k % 4 === 0) teksTengah(`B${1 + Math.floor(k / 4)}`, c + l / 2 + 21, y, 10, "#2B2A26");
      }
      // garis finis
      const fy = PEMAIN_Y() - (PANJANG - d);
      if (fy > -20 && fy < H + 20) {
        const c = tengah(PANJANG), l = lebar(PANJANG);
        for (let i = 0; i < l / 10; i++) { ctx.fillStyle = i % 2 ? "#2B2A26" : "#FFFDF6"; ctx.fillRect(c - l / 2 + i * 10, fy - 6, 10, 6); ctx.fillStyle = i % 2 ? "#FFFDF6" : "#2B2A26"; ctx.fillRect(c - l / 2 + i * 10, fy, 10, 6); }
        teksTengah("FINIS · PINTU KELUAR", c, fy - 16, 11, "#FFFDF6");
      }
      // benda
      for (const b of benda) {
        if (b.kena) continue;
        const y = PEMAIN_Y() - (b.d - d);
        if (y < -30 || y > H + 30) continue;
        const bx = tengah(b.d) + b.off * lebar(b.d);
        if (b.jenis === "teh") gambarSprite(ctx, "cangkir", bx, y, 30);
        else if (b.jenis === "emas") { ctx.save(); ctx.translate(bx, y); ctx.rotate(Math.sin(waktu * 4) * 0.2); ctx.fillStyle = "#F2C14E"; ctx.fillRect(-10, -13, 20, 26); ctx.strokeStyle = "#2B2A26"; ctx.lineWidth = 2; ctx.strokeRect(-10, -13, 20, 26); ctx.restore(); }
        else if (b.jenis === "pel") { ctx.fillStyle = "rgba(159,195,224,.75)"; ctx.beginPath(); ctx.ellipse(bx, y, 24, 12, 0, 0, 7); ctx.fill(); teksTengah("LICIN", bx, y, 8, "#2F4A6B"); }
        else if (b.jenis === "oyen") gambarSprite(ctx, "oyen", bx, y, 32);
        else if (b.jenis === "kardus") { ctx.fillStyle = "#C9A06A"; ctx.fillRect(bx - 15, y - 13, 30, 26); ctx.strokeStyle = "#2B2A26"; ctx.lineWidth = 2; ctx.strokeRect(bx - 15, y - 13, 30, 26); ctx.beginPath(); ctx.moveTo(bx - 15, y); ctx.lineTo(bx + 15, y); ctx.stroke(); }
        else gambarSprite(ctx, "berkas", bx, y, 32);
      }
      // lawan
      LAWAN.forEach((l) => {
        const y = PEMAIN_Y() - (l.d - d);
        if (y < -40 || y > H + 40) return;
        const lx = tengah(l.d) + l.off + Math.sin(waktu * 1.3 + l.goyang) * 14;
        gambarTroli(lx, y, l.warna, l.sprite, l.nama.split(" ").pop());
      });
      // pemain
      if (turbo > 0) { ctx.fillStyle = "rgba(242,193,78,.6)"; for (let i = 0; i < 3; i++) ctx.fillRect(x - 10 + i * 8, PEMAIN_Y() + 26 + Math.random() * 10, 4, 10 + Math.random() * 10); }
      gambarTroli(x, PEMAIN_Y(), "#6B5B7A", null, api.nama);
      // bilah kemajuan
      ctx.fillStyle = "rgba(43,42,38,.7)"; ctx.fillRect(W - 14, 16, 8, H - 32);
      const prog = (v) => 16 + (H - 32) * (1 - Math.min(1, v / PANJANG));
      LAWAN.forEach((l) => { ctx.fillStyle = l.warna; ctx.fillRect(W - 16, prog(l.d) - 2, 12, 4); });
      ctx.fillStyle = "#F2C14E"; ctx.fillRect(W - 18, prog(d) - 3, 16, 6);
      teksTengah(`${Math.round(laju / 10)} km/j`, 40, H - 18, 12, "#FFFDF6");
      gambarKilat(efek, dt);
    });
    const stop2 = () => { stop(); kanvas.removeEventListener("pointerdown", gerak); kanvas.removeEventListener("pointermove", gerak); };
    return stop2;
  };

  addEventListener("resize", () => { if (!arena.hidden && !kanvas.hidden) siapkanKanvas(); });
  K.bukaGame = bukaArena;
})();
