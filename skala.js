/* =========================================================
   Kantor Layanan Perasaan · Skala Perasaan Interaktif
   Setiap skala: KLP.skala.<nama>(wadah, { onUbah(level, info) })
   level selalu 1–5 (kecuali tumpukan berkas: 0–8).
   ========================================================= */
(() => {
  "use strict";
  const K = window.KLP;
  const { $, esc, px, sfx } = K;
  const batas = (v, a, b) => Math.max(a, Math.min(b, v));

  /* ---------------------------------------------------------
     1. TARIK SENYUM — tarik garis mulut ke atas/bawah
     --------------------------------------------------------- */
  function senyum(wadah, { onUbah, awal = 0 } = {}) {
    wadah.classList.add("skala", "skala-senyum");
    wadah.innerHTML = `
      <div class="senyum-area" tabindex="0" role="slider" aria-label="Tarik senyum: geser ke atas untuk tersenyum, ke bawah untuk cemberut" aria-valuemin="1" aria-valuemax="5">
        <svg viewBox="0 0 120 120" class="wajah" aria-hidden="true">
          <circle cx="60" cy="60" r="50" class="w-kepala"/>
          <ellipse cx="34" cy="74" rx="8" ry="5" class="w-pipi"/>
          <ellipse cx="86" cy="74" rx="8" ry="5" class="w-pipi"/>
          <path class="w-alis kiri"/><path class="w-alis kanan"/>
          <g class="w-mata"></g>
          <path class="w-mulut"/>
          <rect class="w-pegangan" width="12" height="12"/>
          <path class="w-keringat" d="M96 30 q5 8 0 12 q-5 -4 0 -12z"/>
        </svg>
      </div>`;
    const area = wadah.querySelector(".senyum-area");
    const svg = wadah.querySelector("svg");
    let c = awal, mulaiY = 0, mulaiC = 0, tarik = false, levelLama = 0;

    function gambar() {
      const my = 82, lebar = 26 + Math.abs(c) * 4;
      const ctrl = my + c * 22;
      svg.querySelector(".w-mulut").setAttribute("d", `M${60 - lebar} ${my - c * 4} Q60 ${ctrl} ${60 + lebar} ${my - c * 4}`);
      const pegY = (my + ctrl) / 2 - 6;
      const peg = svg.querySelector(".w-pegangan");
      peg.setAttribute("x", 54); peg.setAttribute("y", pegY);
      // mata
      const mata = svg.querySelector(".w-mata");
      if (c > 0.45) mata.innerHTML = `<path d="M34 50 q8 -9 16 0"/><path d="M70 50 q8 -9 16 0"/>`;
      else if (c < -0.45) mata.innerHTML = `<path d="M34 50 q8 6 16 0"/><path d="M70 50 q8 6 16 0"/><circle cx="42" cy="52" r="2.5"/><circle cx="78" cy="52" r="2.5"/>`;
      else mata.innerHTML = `<rect x="38" y="44" width="7" height="9"/><rect x="75" y="44" width="7" height="9"/>`;
      // alis
      // sedih: ujung dalam alis naik (khawatir); senang: alis naik dan datar
      const t = Math.min(0, c) * 7, dasar = 36 - Math.max(0, c) * 5;
      svg.querySelector(".w-alis.kiri").setAttribute("d", `M32 ${dasar - t} L50 ${dasar + t}`);
      svg.querySelector(".w-alis.kanan").setAttribute("d", `M70 ${dasar + t} L88 ${dasar - t}`);
      svg.querySelector(".w-keringat").style.opacity = c < -0.75 ? 1 : 0;
      svg.querySelectorAll(".w-pipi").forEach((p) => (p.style.opacity = c > 0.3 ? (c - 0.3) * 1.4 : 0));
      const lv = level();
      area.setAttribute("aria-valuenow", lv);
      if (lv !== levelLama) { levelLama = lv; onUbah?.(lv, { c }); if (tarik) sfx("klik"); }
    }
    // senyum lebar = capek rendah
    const level = () => (c >= 0.6 ? 1 : c >= 0.2 ? 2 : c >= -0.2 ? 3 : c >= -0.6 ? 4 : 5);

    area.addEventListener("pointerdown", (e) => {
      tarik = true; mulaiY = e.clientY; mulaiC = c; area.setPointerCapture(e.pointerId);
      wadah.classList.add("ditarik");
    });
    area.addEventListener("pointermove", (e) => {
      if (!tarik) return;
      c = batas(mulaiC - (e.clientY - mulaiY) / 70, -1, 1);
      gambar();
    });
    const lepas = () => { tarik = false; wadah.classList.remove("ditarik"); };
    area.addEventListener("pointerup", lepas);
    area.addEventListener("pointercancel", lepas);
    area.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp" || e.key === "ArrowRight") { e.preventDefault(); c = batas(c + 0.2, -1, 1); gambar(); }
      if (e.key === "ArrowDown" || e.key === "ArrowLeft") { e.preventDefault(); c = batas(c - 0.2, -1, 1); gambar(); }
    });
    gambar();
    return {
      get level() { return level(); },
      atur(v) { c = batas(v, -1, 1); gambar(); },
    };
  }

  /* ---------------------------------------------------------
     2. GELAS TEH — tahan untuk menuang, isi = baterai hari ini
     --------------------------------------------------------- */
  const KET_TEH = [
    [0, "Gelas masih kosong. Tahan tombol untuk menuang."],
    [1, "Baterai merah. Kantor menyalakan mode hemat untuk Anda."],
    [21, "Kurang dari setengah. Masih bisa dipakai, pelan-pelan."],
    [41, "Setengah gelas. Yang optimis dan yang pesimis sama-sama benar."],
    [61, "Cukup penuh. Hari ini ada tenaga."],
    [86, "Penuh. Hati-hati kalau jalan."],
  ];
  function teh(wadah, { onUbah, awal = 0 } = {}) {
    wadah.classList.add("skala", "skala-teh");
    wadah.innerHTML = `
      <div class="teh-meja">
        <div class="teh-teko ${awal ? "" : ""}" aria-hidden="true"><span class="teko-badan"></span><span class="teko-cerat"></span><span class="teh-aliran"></span></div>
        <div class="teh-gelas" role="meter" aria-label="Isi gelas teh" aria-valuemin="0" aria-valuemax="100">
          <div class="teh-isi"><span class="uap"></span><span class="uap"></span></div>
          <div class="teh-skala" aria-hidden="true"><span>100%</span><span>50%</span><span>1%</span></div>
        </div>
        <div class="teh-tumpah" aria-hidden="true"></div>
      </div>
      <p class="teh-ket" aria-live="polite"></p>
      <div class="teh-tombol">
        <button class="btn primary btn-tuang" type="button">Tahan untuk menuang</button>
        <button class="btn btn-seruput" type="button">Seruput sedikit</button>
      </div>`;
    const isi = wadah.querySelector(".teh-isi"), gelas = wadah.querySelector(".teh-gelas");
    const ket = wadah.querySelector(".teh-ket"), teko = wadah.querySelector(".teh-teko");
    const tumpah = wadah.querySelector(".teh-tumpah");
    let pct = awal, timer = null, lebih = 0, sudahTumpah = false, levelLama = -1, detikSuara = 0;

    const level = () => (pct <= 0 ? 0 : Math.min(5, Math.ceil(pct / 20)));
    function gambar() {
      isi.style.height = `${pct}%`;
      gelas.setAttribute("aria-valuenow", Math.round(pct));
      wadah.classList.toggle("hangat", pct > 60);
      tumpah.classList.toggle("ada", sudahTumpah);
      let teks = KET_TEH.filter(([b]) => pct >= b).pop()[1];
      if (sudahTumpah) teks = "Tumpah sedikit. Tidak apa-apa, Bu Ratna sudah ambil lap.";
      ket.textContent = `${Math.round(pct)}% · ${teks}`;
      const lv = level();
      if (lv !== levelLama) { levelLama = lv; onUbah?.(lv, { pct }); }
    }
    function mulai(e) {
      e.preventDefault();
      if (timer) return;
      teko.classList.add("menuang");
      timer = setInterval(() => {
        if (pct < 100) pct = Math.min(100, pct + 1.3);
        else if (++lebih > 10 && !sudahTumpah) { sudahTumpah = true; sfx("salah"); }
        if (++detikSuara % 8 === 1) sfx("tuang");
        gambar();
      }, 50);
    }
    function berhenti() { clearInterval(timer); timer = null; lebih = 0; teko.classList.remove("menuang"); }
    const tuang = wadah.querySelector(".btn-tuang");
    tuang.addEventListener("pointerdown", mulai);
    ["pointerup", "pointerleave", "pointercancel"].forEach((ev) => tuang.addEventListener(ev, berhenti));
    tuang.addEventListener("keydown", (e) => { if (e.key === " " || e.key === "Enter") { pct = Math.min(100, pct + 10); sfx("tuang"); gambar(); e.preventDefault(); } });
    tuang.addEventListener("contextmenu", (e) => e.preventDefault());
    wadah.querySelector(".btn-seruput").addEventListener("click", () => {
      pct = Math.max(0, pct - 12); sudahTumpah = false; sfx("klik"); gambar();
    });
    gambar();
    return { get level() { return level(); }, get persen() { return pct; } };
  }

  /* ---------------------------------------------------------
     3. PUKUL KOK — usap ke atas; jauhnya kok = semangat
     --------------------------------------------------------- */
  const KET_KOK = [
    null,
    "Siap. Kok jatuh di depan net. Netnya memang terlalu tinggi hari ini. Saya yang salah pasang.",
    "Siap. Lewat net, tipis. Lewat tetap lewat. Dicatat sebagai semangat sah.",
    "Siap. Jatuh di tengah lapangan. Semangat standar, cukup untuk hari kerja.",
    "Siap. Pukulan dalam. Saya harus mundur dua langkah.",
    "Siap. Kok keluar lapangan dan masuk parkiran. Akan saya ambil nanti. Semangat Anda tercatat: tinggi.",
  ];
  function kok(wadah, { onUbah } = {}) {
    wadah.classList.add("skala", "skala-kok");
    wadah.innerHTML = `
      <div class="kok-lapangan" role="button" tabindex="0" aria-label="Usap ke atas untuk memukul kok">
        <svg viewBox="0 0 320 150" aria-hidden="true">
          <rect x="0" y="128" width="320" height="22" class="k-lantai"/>
          <line x1="12" y1="128" x2="308" y2="128" class="k-garis"/>
          <rect x="157" y="78" width="6" height="50" class="k-tiang"/>
          <rect x="160" y="78" width="2" height="50" class="k-net"/>
          <g class="k-raket" transform="translate(26 118)">
            <line x1="0" y1="0" x2="0" y2="-26" class="k-gagang"/>
            <ellipse cx="0" cy="-36" rx="9" ry="12" class="k-kepala-raket"/>
          </g>
          <g class="k-kok"><path d="M0 0 L-7 -10 L7 -10 Z" class="k-bulu"/><circle cx="0" cy="1" r="3.2" class="k-gabus"/></g>
          <text x="300" y="20" class="k-label" text-anchor="end">← lebih jauh = lebih semangat</text>
        </svg>
        <span class="kok-satpam" aria-hidden="true">${px("kura")}</span>
        <span class="kok-petunjuk">Usap ke atas dengan cepat untuk memukul</span>
      </div>
      <p class="kok-ket" aria-live="polite">Pak Satpam sudah siap di seberang net.</p>
      <div class="kok-tombol">
        <span class="kok-meter" aria-hidden="true"><span></span></span>
        <button class="btn small btn-ayun" type="button">Pukul pakai tombol</button>
      </div>`;
    const lap = wadah.querySelector(".kok-lapangan");
    const kokEl = wadah.querySelector(".k-kok");
    const raket = wadah.querySelector(".k-raket");
    const ket = wadah.querySelector(".kok-ket");
    let lv = 0, terbang = false, awalY = 0, awalT = 0;
    const posisiAwal = () => kokEl.setAttribute("transform", "translate(40 92) rotate(-90)");
    posisiAwal();

    function pukul(tenaga) {
      if (terbang) return;
      tenaga = batas(tenaga, 0.05, 1);
      terbang = true;
      raket.classList.remove("ayun"); void raket.getBoundingClientRect(); raket.classList.add("ayun");
      sfx("pukul");
      const x0 = 40, y0 = 92;
      const jatuh = 70 + tenaga * 270;                   // < 160 berarti di depan net
      const kenaNet = jatuh < 160;
      const xAkhir = kenaNet ? 150 : Math.min(jatuh, 330);
      const puncak = 20 + (1 - tenaga) * 40;
      const t0 = performance.now(), durasi = K.kurangiGerak ? 1 : 650 + tenaga * 450;
      const langkah = (now) => {
        const t = Math.min(1, (now - t0) / durasi);
        const x = x0 + (xAkhir - x0) * t;
        const yAkhir = kenaNet ? 120 : 124;
        const y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * puncak + t * t * yAkhir;
        const sudut = t < 0.5 ? -90 + t * 120 : 30 + (t - 0.5) * 220;
        kokEl.setAttribute("transform", `translate(${x} ${y}) rotate(${sudut})`);
        if (t < 1) requestAnimationFrame(langkah);
        else selesai();
      };
      requestAnimationFrame(langkah);
      function selesai() {
        lv = tenaga < 0.3 ? 1 : tenaga < 0.5 ? 2 : tenaga < 0.7 ? 3 : tenaga < 0.88 ? 4 : 5;
        ket.textContent = KET_KOK[lv];
        wadah.dataset.level = lv;
        onUbah?.(lv, { tenaga });
        sfx(lv === 1 ? "salah" : "pilih");
        setTimeout(() => { terbang = false; posisiAwal(); }, 900);
      }
    }
    lap.addEventListener("pointerdown", (e) => { awalY = e.clientY; awalT = performance.now(); lap.setPointerCapture(e.pointerId); });
    lap.addEventListener("pointerup", (e) => {
      const dy = awalY - e.clientY, dt = Math.max(30, performance.now() - awalT);
      if (dy < 18) { ket.textContent = "Pak Satpam: Siap. Itu baru ketukan. Usap ke atas untuk memukul."; return; }
      const kecepatan = dy / dt;                  // px per ms
      pukul(kecepatan / 1.6 * 0.75 + Math.min(dy, 220) / 220 * 0.25);
    });
    lap.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pukul(0.4 + Math.random() * 0.5); } });

    // alternatif: meter tenaga
    const meter = wadah.querySelector(".kok-meter"), isiMeter = meter.querySelector("span");
    const btn = wadah.querySelector(".btn-ayun");
    let meterJalan = false, raf = 0, mulaiMeter = 0, nilaiMeter = 0;
    btn.addEventListener("click", () => {
      if (!meterJalan) {
        meterJalan = true; meter.classList.add("jalan"); btn.textContent = "Pukul sekarang!"; mulaiMeter = performance.now();
        const putar = (now) => {
          const fase = ((now - mulaiMeter) / 1100) % 2;
          nilaiMeter = fase < 1 ? fase : 2 - fase;
          isiMeter.style.width = `${nilaiMeter * 100}%`;
          if (meterJalan) raf = requestAnimationFrame(putar);
        };
        raf = requestAnimationFrame(putar);
      } else {
        meterJalan = false; cancelAnimationFrame(raf); meter.classList.remove("jalan"); btn.textContent = "Pukul pakai tombol";
        pukul(nilaiMeter);
      }
    });
    return { get level() { return lv; } };
  }

  /* ---------------------------------------------------------
     4. TIMBANGAN KANTOR — taruh beban; balon mengangkat
     --------------------------------------------------------- */
  const BEBAN = [
    { id: "berkas", nama: "Berkas", berat: 2 },
    { id: "batu", nama: "Batu", berat: 3 },
    { id: "bantal", nama: "Bantal", berat: 1 },
    { id: "balon", nama: "Balon", berat: -2 },
  ];
  const KET_TIMBANG = [
    null,
    "Berat. Tapi Anda tetap datang membawa kabar baik. Itu dicatat dua kali.",
    "Agak berat. Kabar baiknya tetap sah, timbangan tidak menilai.",
    "Seimbang. Jarum diam di tengah, seperti pegawai yang baru gajian.",
    "Ringan. Jarum condong ke arah melayang.",
    "Melayang. Pak Satpam diminta memegangi timbangan supaya tidak terbang.",
  ];
  function timbangan(wadah, { onUbah } = {}) {
    wadah.classList.add("skala", "skala-timbang");
    wadah.innerHTML = `
      <div class="timbang-badan">
        <div class="timbang-piring" aria-live="polite" aria-label="Piring timbangan, ketuk barang untuk menurunkan"></div>
        <div class="timbang-dial" aria-hidden="true">
          <svg viewBox="0 0 120 70"><path d="M10 64 A50 50 0 0 1 110 64" class="d-busur"/>
            <text x="12" y="58" class="d-teks">berat</text><text x="108" y="58" text-anchor="end" class="d-teks">melayang</text>
            <line x1="60" y1="64" x2="60" y2="20" class="d-jarum"/><circle cx="60" cy="64" r="5" class="d-pusat"/></svg>
        </div>
      </div>
      <p class="timbang-ket" aria-live="polite">Timbangan kosong. Ketuk barang di bawah untuk menaruhnya.</p>
      <div class="timbang-barang">
        ${BEBAN.map((b) => `<button class="timbang-btn" type="button" data-id="${b.id}"><span class="tb-sprite">${px(b.id)}</span><span>${b.nama}</span><small>${b.berat > 0 ? "+" + b.berat : b.berat}</small></button>`).join("")}
      </div>`;
    const piring = wadah.querySelector(".timbang-piring");
    const jarum = wadah.querySelector(".d-jarum");
    const ket = wadah.querySelector(".timbang-ket");
    const isi = [];
    let lv = 3;
    const total = () => isi.reduce((s, id) => s + BEBAN.find((b) => b.id === id).berat, 0);
    function gambar() {
      const t = total();
      piring.innerHTML = isi.map((id, i) => `<button type="button" class="di-piring" data-i="${i}" aria-label="Turunkan ${id}">${px(id)}</button>`).join("");
      // jarum: t=+8 → kiri (berat), t=-6 → kanan (melayang)
      const sudut = batas(-t * 11, -80, 80);
      jarum.style.transform = `rotate(${sudut}deg)`;
      piring.style.transform = `translateY(${batas(t * 1.5, -8, 12)}px)`;
      lv = t <= -4 ? 5 : t <= -1 ? 4 : t === 0 ? 3 : t <= 3 ? 2 : 1;
      ket.textContent = isi.length ? `${KET_TIMBANG[lv]} (Total: ${t > 0 ? "+" : ""}${t})` : "Timbangan kosong. Ketuk barang di bawah untuk menaruhnya.";
      wadah.classList.toggle("melayang", lv === 5);
      onUbah?.(lv, { total: t, isi: [...isi] });
    }
    wadah.querySelector(".timbang-barang").addEventListener("click", (e) => {
      const b = e.target.closest(".timbang-btn");
      if (!b) return;
      if (isi.length >= 8) { ket.textContent = "Piring penuh. Pak Satpam menolak menambah beban lagi, demi keselamatan kerja."; sfx("salah"); return; }
      isi.push(b.dataset.id); sfx(b.dataset.id === "balon" ? "boing" : "stempel"); gambar();
    });
    piring.addEventListener("click", (e) => {
      const b = e.target.closest(".di-piring");
      if (!b) return;
      isi.splice(Number(b.dataset.i), 1); sfx("klik"); gambar();
    });
    jarum.style.transformOrigin = "60px 64px";
    return { get level() { return lv; }, get total() { return total(); }, get dipakai() { return isi.length > 0; } };
  }

  /* ---------------------------------------------------------
     5. BULU BERDIRI OYEN — usap punggung ke atas = makin kaget
     --------------------------------------------------------- */
  const KET_BULU = [
    null,
    "Tidak kaget. Bulu rapi. Oyen: \"Diketahui.\"",
    "Sedikit kaget. Oyen menoleh, lalu pura-pura tidak menoleh.",
    "Lumayan kaget. Ekor membesar tiga puluh persen.",
    "Sangat kaget. Bulunya seperti sikat. Oyen meminta ini tidak dicatat. Sudah terlanjur.",
    "Bulunya pindah ke plafon. Pak Satpam akan mengambilnya pakai tangga.",
  ];
  function bulu(wadah, { onUbah } = {}) {
    wadah.classList.add("skala", "skala-bulu");
    const DURI = 9;
    wadah.innerHTML = `
      <div class="bulu-area" tabindex="0" role="slider" aria-label="Usap punggung Oyen ke atas: makin tinggi bulunya, makin kaget" aria-valuemin="1" aria-valuemax="5">
        <svg viewBox="0 0 200 120" aria-hidden="true">
          <g class="o-duri">${Array.from({ length: DURI }, (_, i) => `<path data-i="${i}"/>`).join("")}</g>
          <path class="o-ekor" d=""/>
          <ellipse cx="96" cy="78" rx="58" ry="26" class="o-badan"/>
          <rect x="52" y="96" width="10" height="16" class="o-kaki"/><rect x="128" y="96" width="10" height="16" class="o-kaki"/>
          <g class="o-kepala" transform="translate(160 58)">
            <path d="M-16 -10 L-12 -30 L-2 -16 Z" class="o-telinga"/><path d="M2 -16 L12 -30 L16 -10 Z" class="o-telinga"/>
            <circle r="20" class="o-muka"/>
            <path class="o-mata" d="M-10 -2 h7 M4 -2 h7"/>
            <path d="M-2 6 l2 2 l2 -2" class="o-mulut"/>
          </g>
          <rect x="146" y="80" width="14" height="10" class="o-dasi"/>
        </svg>
        <span class="bulu-petunjuk" aria-hidden="true">↑ usap punggungnya ke atas</span>
      </div>
      <p class="bulu-ket" aria-live="polite">${KET_BULU[1]}</p>`;
    const area = wadah.querySelector(".bulu-area");
    const duri = [...wadah.querySelectorAll(".o-duri path")];
    const ekor = wadah.querySelector(".o-ekor");
    const mata = wadah.querySelector(".o-mata");
    const ket = wadah.querySelector(".bulu-ket");
    let f = 0, aktif = false, awalY = 0, awalF = 0, lvLama = 1;
    const level = () => (f < 0.15 ? 1 : f < 0.4 ? 2 : f < 0.65 ? 3 : f < 0.9 ? 4 : 5);
    function gambar() {
      duri.forEach((d, i) => {
        const x = 50 + i * 10.5;
        const yDasar = 78 - Math.sqrt(Math.max(0, 1 - ((x - 96) / 58) ** 2)) * 26 + 2;
        const tinggi = 3 + f * 22 * (0.7 + 0.3 * Math.sin(i * 1.7));
        d.setAttribute("d", `M${x - 5} ${yDasar} L${x} ${yDasar - tinggi} L${x + 5} ${yDasar} Z`);
      });
      const tebal = 6 + f * 10;
      ekor.setAttribute("d", `M40 76 Q${18 - f * 6} ${60 - f * 20} ${24} ${30 - f * 14}`);
      ekor.style.strokeWidth = tebal;
      mata.setAttribute("d", f > 0.65 ? "M-10 -4 a3.5 3.5 0 1 0 7 0 a3.5 3.5 0 1 0 -7 0 M4 -4 a3.5 3.5 0 1 0 7 0 a3.5 3.5 0 1 0 -7 0" : "M-10 -2 h7 M4 -2 h7");
      const lv = level();
      area.setAttribute("aria-valuenow", lv);
      if (lv !== lvLama) { lvLama = lv; ket.textContent = KET_BULU[lv]; onUbah?.(lv, { f }); if (aktif) sfx(lv >= 4 ? "meong" : "klik"); }
    }
    area.addEventListener("pointerdown", (e) => { aktif = true; awalY = e.clientY; awalF = f; area.setPointerCapture(e.pointerId); });
    area.addEventListener("pointermove", (e) => { if (aktif) { f = batas(awalF + (awalY - e.clientY) / 110, 0, 1); gambar(); } });
    area.addEventListener("pointerup", () => (aktif = false));
    area.addEventListener("pointercancel", () => (aktif = false));
    area.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp" || e.key === "ArrowRight") { e.preventDefault(); f = batas(f + 0.25, 0, 1); gambar(); }
      if (e.key === "ArrowDown" || e.key === "ArrowLeft") { e.preventDefault(); f = batas(f - 0.25, 0, 1); gambar(); }
    });
    gambar();
    return { get level() { return level(); } };
  }

  /* ---------------------------------------------------------
     6. TUMPUKAN BERKAS DI KEPALA DIMAS — beban pikiran (0–8)
     --------------------------------------------------------- */
  const KET_TUMPUK = (n) =>
    n === 0 ? "Kepala Dimas kosong. Dalam arti yang baik."
      : n <= 2 ? "Ringan. Dimas masih bisa menoleh."
        : n <= 4 ? "Lumayan. Dimas mulai keringetan (lebih dari biasanya)."
          : n <= 6 ? "Berat. Dimas berdiri sangat tegak supaya tidak jatuh."
            : "Sangat berat. Dimas: TOLONG— eh, aman. Aman. *agak aman.";
  function tumpukan(wadah, { onUbah, awal = 0, judul = "" } = {}) {
    wadah.classList.add("skala", "skala-tumpuk");
    wadah.innerHTML = `
      ${judul ? `<p class="tumpuk-judul">${esc(judul)}</p>` : ""}
      <div class="tumpuk-panggung">
        <div class="tumpuk-stack" aria-hidden="true"></div>
        <div class="tumpuk-dimas">${px("marmut")}</div>
      </div>
      <p class="tumpuk-ket" aria-live="polite"></p>
      <div class="tumpuk-tombol">
        <button class="btn small" type="button" data-d="-1">− Ambil satu</button>
        <span class="tumpuk-angka mono" aria-hidden="true">0</span>
        <button class="btn small primary" type="button" data-d="1">+ Tambah berkas</button>
      </div>`;
    const stack = wadah.querySelector(".tumpuk-stack");
    const ket = wadah.querySelector(".tumpuk-ket");
    let n = awal;
    function gambar() {
      stack.innerHTML = Array.from({ length: n }, (_, i) => `<span style="--i:${i};--r:${((i * 37) % 9) - 4}deg"></span>`).join("");
      stack.style.setProperty("--goyang", `${n * 0.6}deg`);
      wadah.querySelector(".tumpuk-angka").textContent = n;
      ket.textContent = KET_TUMPUK(n);
      onUbah?.(n, {});
    }
    wadah.querySelector(".tumpuk-tombol").addEventListener("click", (e) => {
      const b = e.target.closest("[data-d]");
      if (!b) return;
      const d = Number(b.dataset.d);
      if (d > 0 && n >= 8) {
        sfx("kertas");
        ket.textContent = "BRUK. Semuanya jatuh. Dimas: SAYA SUSUN LAGI— eh, sudah. Maksimal delapan ya.";
        stack.classList.remove("jatuh"); void stack.offsetWidth; stack.classList.add("jatuh");
        return;
      }
      n = batas(n + d, 0, 8);
      sfx(d > 0 ? "kertas" : "klik");
      gambar();
    });
    gambar();
    return { get level() { return n; }, atur(v) { n = batas(v, 0, 8); gambar(); } };
  }

  K.skala = { senyum, teh, kok, timbangan, bulu, tumpukan, KET_KOK, KET_TIMBANG, KET_BULU };
  K.skalaNilai = K.skalaNilai || {};
  document.dispatchEvent(new Event("klp:skala"));
})();
