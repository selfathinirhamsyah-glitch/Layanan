/* =========================================================
   Kantor Layanan Perasaan · Tampilan 3D untuk Ruang Istirahat
   Memakai three.js (vendor/three.min.js, dimuat hanya saat main).
   Logika & skor game tetap di games.js; berkas ini cuma menggambar
   dunianya dalam 3D: benda kotak bergaris tepi ala doodle, pegawai
   tetap pixel art sebagai papan yang selalu menghadap kamera.
   Kalau WebGL atau three.js tidak tersedia, game memakai versi 2D.
   ========================================================= */
(() => {
  "use strict";
  const K = window.KLP;
  const SRC = "vendor/three.min.js";
  const INK = 0x2B2A26;

  /* ---------- muat three.js sekali, kalau perangkat mampu ---------- */
  let adaGL = null, janji = null;
  function bisa3D() {
    if (adaGL !== null) return adaGL;
    try {
      const c = document.createElement("canvas");
      adaGL = !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")));
    } catch { adaGL = false; }
    return adaGL;
  }
  function siap() {
    if (window.THREE) return Promise.resolve(true);
    if (!bisa3D()) return Promise.resolve(false);
    if (!janji) janji = new Promise((res) => {
      const s = document.createElement("script");
      s.src = SRC; s.async = true;
      const t = setTimeout(() => res(false), 12000);
      s.onload = () => { clearTimeout(t); res(!!window.THREE); };
      s.onerror = () => { clearTimeout(t); janji = null; res(false); };
      document.head.appendChild(s);
    });
    return janji;
  }

  /* ---------- perkakas bersama ---------- */
  let T, renderer = null, gradien = null, rasioMaks = 2;
  const teksturSprite = {};
  function mulaiT() {
    T = window.THREE;
    if (!gradien) {
      gradien = new T.DataTexture(new Uint8Array([110, 185, 255]), 3, 1, T.LuminanceFormat);
      gradien.minFilter = gradien.magFilter = T.NearestFilter;
      gradien.needsUpdate = true;
    }
  }
  const bahan = (warna, opsi = {}) => new T.MeshToonMaterial({ color: warna, gradientMap: gradien, ...opsi });
  // garis tepi tebal: salinan mesh sedikit lebih besar, hanya sisi belakang, warna tinta
  function garis(mesh, tebal = 0.035) {
    mesh.geometry.computeBoundingBox();
    const u = mesh.geometry.boundingBox.getSize(new T.Vector3());
    const o = new T.Mesh(mesh.geometry, new T.MeshBasicMaterial({ color: INK, side: T.BackSide }));
    o.scale.set(1 + (2 * tebal) / Math.max(u.x, 0.01), 1 + (2 * tebal) / Math.max(u.y, 0.01), 1 + (2 * tebal) / Math.max(u.z, 0.01));
    mesh.add(o);
    return mesh;
  }
  const kotak = (w, h, d, warna, tebal = 0.035) => { const m = new T.Mesh(new T.BoxGeometry(w, h, d), bahan(warna)); return tebal ? garis(m, tebal) : m; };
  const silinder = (r1, r2, h, warna, seg = 16, tebal = 0.03) => { const m = new T.Mesh(new T.CylinderGeometry(r1, r2, h, seg), bahan(warna)); return tebal ? garis(m, tebal) : m; };
  function tekstur(nama) {
    if (!teksturSprite[nama]) {
      const img = new Image();
      const t = new T.Texture(img);
      t.magFilter = T.NearestFilter; t.minFilter = T.NearestFilter; t.generateMipmaps = false;
      img.onload = () => { t.needsUpdate = true; };
      img.src = window.SPRITE.png(nama, 8);
      teksturSprite[nama] = t;
    }
    return teksturSprite[nama];
  }
  // pegawai pixel sebagai papan yang selalu menghadap kamera
  function papan(nama, ukuran) {
    const s = new T.Sprite(new T.SpriteMaterial({ map: tekstur(nama), alphaTest: 0.5 }));
    s.scale.set(ukuran, ukuran, 1);
    s.userData.sprite = nama;
    return s;
  }
  function gantiPapan(s, nama) { if (s.userData.sprite !== nama) { s.material.map = tekstur(nama); s.material.needsUpdate = true; s.userData.sprite = nama; } }
  // tulisan / gambar kanvas sebagai tekstur
  function kanvasTekstur(w, h, gambar) {
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    gambar(c.getContext("2d"), w, h);
    const t = new T.CanvasTexture(c);
    t.anisotropy = 2;
    return t;
  }
  function bidangTeks(teks, lebar, tinggi, opsi = {}) {
    const t = kanvasTekstur(256, Math.round(256 * tinggi / lebar), (g, w, h) => {
      g.fillStyle = opsi.latar || "#FFFDF6"; g.fillRect(0, 0, w, h);
      if (opsi.bingkai !== false) { g.strokeStyle = "#2B2A26"; g.lineWidth = 8; g.strokeRect(4, 4, w - 8, h - 8); }
      g.fillStyle = opsi.warna || "#2B2A26";
      g.font = `bold ${opsi.ukuran || Math.round(h * 0.5)}px "Pixelify Sans", monospace`;
      g.textAlign = "center"; g.textBaseline = "middle";
      g.fillText(teks, w / 2, h / 2 + 2);
    });
    return new T.Mesh(new T.PlaneGeometry(lebar, tinggi), new T.MeshBasicMaterial({ map: t, transparent: !!opsi.transparan }));
  }
  let teksBayangan;
  function bayangan(r) {
    if (!teksBayangan) teksBayangan = kanvasTekstur(64, 64, (g) => {
      const gr = g.createRadialGradient(32, 32, 2, 32, 32, 31);
      gr.addColorStop(0, "rgba(0,0,0,.45)"); gr.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    });
    const m = new T.Mesh(new T.PlaneGeometry(r * 2, r * 2), new T.MeshBasicMaterial({ map: teksBayangan, transparent: true, depthWrite: false }));
    m.rotation.x = -Math.PI / 2;
    return m;
  }
  const lerp = (a, b, t) => a + (b - a) * t;

  /* ---------- panggung: renderer dipakai ulang, adegan baru tiap main ---------- */
  function panggung(kanvas2d, opsi) {
    mulaiT();
    const cv = document.getElementById("arenaKanvas3d");
    if (!renderer) {
      renderer = new T.WebGLRenderer({ canvas: cv, antialias: true, powerPreference: "low-power" });
    }
    const ukur = () => {
      const w = parseFloat(kanvas2d.style.width) || 360, h = parseFloat(kanvas2d.style.height) || 480;
      renderer.setPixelRatio(Math.min(rasioMaks, devicePixelRatio || 1));
      renderer.setSize(w, h, true);
      kamera.aspect = w / h; kamera.updateProjectionMatrix();
      return { w, h };
    };
    const adegan = new T.Scene();
    adegan.background = new T.Color(opsi.langit || "#E9E2D0");
    if (opsi.kabut) adegan.fog = new T.Fog(opsi.langit || "#E9E2D0", opsi.kabut[0], opsi.kabut[1]);
    const kamera = new T.PerspectiveCamera(opsi.fov || 50, 1, 0.1, 400);
    adegan.add(new T.HemisphereLight(0xFFFDF6, 0x8A7F6A, 0.72));
    const mata = new T.DirectionalLight(0xFFFFFF, 0.62);
    mata.position.set(3, 8, 6);
    adegan.add(mata);
    cv.hidden = false;
    ukur();
    let lalu = 0, total = 0, n = 0;
    return {
      adegan, kamera, ukur,
      render() {
        renderer.render(adegan, kamera);
        // HP terasa berat? turunkan resolusi sekali, supaya tetap lancar
        const kini = performance.now();
        if (lalu) {
          total += kini - lalu; n++;
          if (n === 45) { if (total / n > 38 && rasioMaks > 1) { rasioMaks = 1; ukur(); } total = 0; n = 0; }
        }
        lalu = kini;
      },
      hapus() {
        adegan.traverse((o) => {
          if (o.geometry) o.geometry.dispose();
          if (o.material) {
            const m = o.material;
            // tekstur sprite dipakai ulang antar-game, tekstur kanvas dibuang
            if (m.map && m.map.isCanvasTexture && m.map !== teksBayangan) m.map.dispose();
            m.dispose();
          }
        });
        renderer.renderLists.dispose();
        cv.hidden = true;
      },
    };
  }

  /* =========================================================
     ADEGAN TIAP GAME
     ========================================================= */
  const ADEGAN = {};

  /* ---------- Rally: lapangan dilihat dari belakang pemain ---------- */
  ADEGAN.rally = (api, kanvas2d) => {
    const P = panggung(kanvas2d, { langit: "#BFD8E8", fov: 52, kabut: [16, 34] });
    const { adegan: A, kamera } = P;
    const Z_JAUH = -8.6, Z_PUKUL = 2.6;
    const X = (x) => ((x - api.W() / 2) / api.W()) * 6.4;
    // lantai & garis lapangan
    const lantai = new T.Mesh(new T.PlaneGeometry(60, 60), bahan("#7FA868"));
    lantai.rotation.x = -Math.PI / 2; A.add(lantai);
    const putih = bahan("#FFFDF6");
    const garisL = (w, d, x, z) => { const g = new T.Mesh(new T.BoxGeometry(w, 0.02, d), putih); g.position.set(x, 0.01, z); A.add(g); };
    garisL(0.08, 13.4, -3.4, -3.2); garisL(0.08, 13.4, 3.4, -3.2); garisL(6.88, 0.08, 0, -9.9); garisL(6.88, 0.08, 0, 3.5); garisL(0.06, 13.4, 0, -3.2);
    // net
    [-3.6, 3.6].forEach((x) => { const t = silinder(0.06, 0.06, 1.6, "#3B4046"); t.position.set(x, 0.8, -3.2); A.add(t); });
    const net = new T.Mesh(new T.PlaneGeometry(7.2, 0.7), new T.MeshBasicMaterial({ color: 0xFFFDF6, transparent: true, opacity: 0.45, side: T.DoubleSide }));
    net.position.set(0, 1.15, -3.2); A.add(net);
    const pita = kotak(7.2, 0.08, 0.04, "#2B2A26", 0); pita.position.set(0, 1.52, -3.2); A.add(pita);
    // tembok belakang & bangku penonton
    const tembok = kotak(30, 6, 0.4, "#E9E2D0", 0); tembok.position.set(0, 3, -14); A.add(tembok);
    const papanNama = bidangTeks("RALLY VS PAK SATPAM", 7, 0.9, { latar: "#2F4A6B", warna: "#FFFDF6" }); papanNama.position.set(0, 3.4, -13.75); A.add(papanNama);
    ["kapibara", "marmut", "kukang"].forEach((s, i) => { const p = papan(s, 1.2); p.position.set(-5.2 + i * 0.1, 0.62, -6 + i * 2.4); A.add(p); });
    const oyen = papan("oyen", 1.3); oyen.position.set(5.2, 0.68, -4.5); A.add(oyen);
    // Pak Satpam
    const satpam = papan("kura", 2.3); satpam.position.set(0, 1.18, Z_JAUH - 0.6); A.add(satpam);
    const bySatpam = bayangan(0.9); bySatpam.position.set(0, 0.02, Z_JAUH - 0.6); A.add(bySatpam);
    // cincin zona pukul
    const cincin = new T.Mesh(new T.RingGeometry(0.62, 0.8, 32), new T.MeshBasicMaterial({ color: 0xFFFDF6, transparent: true, opacity: 0.85, side: T.DoubleSide }));
    cincin.rotation.x = -Math.PI / 2; cincin.position.y = 0.03; A.add(cincin);
    // kok
    const kok = new T.Group();
    const bulu = new T.Mesh(new T.ConeGeometry(0.2, 0.34, 12, 1, true), bahan("#FFFDF6", { side: T.DoubleSide }));
    bulu.position.y = 0.17; bulu.rotation.x = Math.PI; kok.add(bulu);
    const gabus = new T.Mesh(new T.SphereGeometry(0.09, 12, 8), bahan("#B5443A")); kok.add(gabus);
    A.add(kok);
    const byKok = bayangan(0.25); A.add(byKok);
    // raket
    const raket = new T.Group();
    const gagang = silinder(0.04, 0.04, 0.7, "#2B2A26", 8, 0); gagang.position.y = 0.35; raket.add(gagang);
    const kepala = new T.Mesh(new T.TorusGeometry(0.28, 0.035, 8, 24), bahan("#2F4A6B")); kepala.position.y = 1.0; kepala.scale.set(0.8, 1.1, 1); raket.add(kepala);
    const senar = new T.Mesh(new T.CircleGeometry(0.27, 20), new T.MeshBasicMaterial({ color: 0xFFFDF6, transparent: true, opacity: 0.35, side: T.DoubleSide })); senar.position.y = 1.0; senar.scale.set(0.8, 1.1, 1); raket.add(senar);
    A.add(raket);
    kamera.position.set(0, 3.6, 8.4); kamera.lookAt(0, 0.6, -2.6);

    const posKok = (s) => {
      const tx = X(s.targetX);
      if (s.fase === "datang") { const p = s.t; return [lerp(0, tx, p), lerp(2.0, 1.0, p) + Math.sin(Math.PI * p) * 2.4, lerp(Z_JAUH, Z_PUKUL, p), 1]; }
      if (s.fase === "lewat") { const p = s.t; return [tx, Math.max(0.08, 1.0 - p * 5), Z_PUKUL + p * 9, 1]; }
      if (s.fase === "balik") { const p = s.t; return [lerp(tx, 0, p), lerp(1.0, 2.0, p) + Math.sin(Math.PI * p) * 3, lerp(Z_PUKUL, Z_JAUH, p), -1]; }
      return null;
    };
    const sebelum = new T.Vector3();
    return {
      gambar(s, waktu) {
        const tx = X(s.targetX);
        cincin.position.x = tx; cincin.position.z = Z_PUKUL;
        cincin.material.color.set(s.fase === "datang" && s.t > 0.6 ? 0xF2C14E : 0xFFFDF6);
        const k = posKok(s);
        kok.visible = byKok.visible = !!k;
        if (k) {
          sebelum.copy(kok.position);
          kok.position.set(k[0], k[1], k[2]);
          const arah = kok.position.clone().sub(sebelum);
          if (arah.lengthSq() > 1e-6) kok.lookAt(kok.position.clone().add(arah)), kok.rotateX(-Math.PI / 2);
          byKok.position.set(k[0], 0.02, k[2]);
        }
        satpam.position.x = lerp(satpam.position.x, s.fase === "balik" ? 0 : tx * 0.3, 0.05);
        satpam.position.y = 1.18 + Math.abs(Math.sin(waktu * 4)) * 0.08;
        bySatpam.position.x = satpam.position.x;
        raket.position.set(tx + 0.7, 0.2, Z_PUKUL + 0.5);
        raket.rotation.z = s.ayun > 0 ? 1.1 : -0.25;
        raket.rotation.x = s.ayun > 0 ? -0.6 : 0;
        kamera.position.x = lerp(kamera.position.x, tx * 0.25, 0.08);
        kamera.lookAt(kamera.position.x * 0.5, 0.6, -2.6);
        P.render();
      },
      ukur: P.ukur, hapus: P.hapus,
    };
  };

  /* ---------- Kertas: ruangan kantor, kertas berputar di udara ---------- */
  ADEGAN.kertas = (api, kanvas2d) => {
    const P = panggung(kanvas2d, { langit: "#F0EADB", fov: 40 });
    const { adegan: A, kamera } = P;
    const JARAK = 16;
    kamera.position.set(0, 0, JARAK); kamera.lookAt(0, 0, 0);
    const s = () => (2 * JARAK * Math.tan((40 * Math.PI) / 360)) / api.H();
    const X = (x) => (x - api.W() / 2) * s(), Y = (y) => (api.H() / 2 - y) * s();
    // tembok berpetak, lantai, jendela
    const petak = kanvasTekstur(256, 256, (g, w, h) => {
      g.fillStyle = "#F0EADB"; g.fillRect(0, 0, w, h);
      g.fillStyle = "rgba(47,74,107,.12)"; for (let i = 0; i < w; i += 32) { g.fillRect(i, 0, 2, h); g.fillRect(0, i, w, 2); }
    });
    petak.wrapS = petak.wrapT = T.RepeatWrapping; petak.repeat.set(6, 6);
    const tembok = new T.Mesh(new T.PlaneGeometry(40, 40), new T.MeshBasicMaterial({ map: petak }));
    tembok.position.z = -4; A.add(tembok);
    const bawah = Y(api.H()) - 0.2;
    const lantai = new T.Mesh(new T.PlaneGeometry(40, 12), bahan("#C9B48E"));
    lantai.rotation.x = -Math.PI / 2; lantai.position.set(0, bawah, 0); A.add(lantai);
    const jendela = kotak(3.4, 2.4, 0.1, "#C9DCE6"); jendela.position.set(-3.2, Y(api.H() * 0.42), -3.9); A.add(jendela);
    const rak = kotak(1.6, 3.2, 0.8, "#9C6B43"); rak.position.set(3.4, bawah + 1.6, -3.4); A.add(rak);
    for (let i = 0; i < 3; i++) { const m = kotak(1.2, 0.5, 0.5, ["#E0B84A", "#7F98B4", "#FFFDF6"][i]); m.position.set(3.4, bawah + 0.8 + i * 0.95, -3.0); A.add(m); }
    const dimas = papan("marmut", 1.6); dimas.position.set(-4.4, bawah + 0.8, -2.6); A.add(dimas);
    // kipas angin: tiang, kepala menoleh, baling-baling berputar
    const kipas = new T.Group(); A.add(kipas);
    const tiang = silinder(0.08, 0.08, 1.4, "#3B4046", 8); tiang.position.y = 0.9; kipas.add(tiang);
    const kepala = new T.Group(); kipas.add(kepala);
    const rangka = new T.Mesh(new T.TorusGeometry(0.85, 0.05, 8, 32), bahan("#FFFDF6")); kepala.add(garis(rangka, 0.02));
    const baling = new T.Group(); kepala.add(baling);
    for (let i = 0; i < 3; i++) { const b = kotak(0.72, 0.24, 0.04, "#7F98B4", 0.02); b.position.x = 0.36; const g = new T.Group(); g.rotation.z = (i * Math.PI * 2) / 3; g.add(b); baling.add(g); }
    const pusat = silinder(0.14, 0.14, 0.16, "#2B2A26", 12, 0); pusat.rotation.x = Math.PI / 2; kepala.add(pusat);
    // map penangkap
    const map = new T.Group(); A.add(map);
    const mapBelakang = kotak(2.6, 0.95, 0.12, "#E0B84A"); mapBelakang.position.set(0, 0.2, -0.25); mapBelakang.rotation.x = -0.25; map.add(mapBelakang);
    const mapDepan = kotak(2.6, 0.7, 0.12, "#E9C766"); mapDepan.position.set(0, 0, 0.2); map.add(mapDepan);
    const tab = kotak(0.9, 0.3, 0.12, "#E0B84A"); tab.position.set(-0.8, 0.75, -0.32); tab.rotation.x = -0.25; map.add(tab);
    // kolam kertas
    const garisKertas = (warnaGaris, kepalaMerah, latar) => kanvasTekstur(64, 80, (g, w, h) => {
      g.fillStyle = latar; g.fillRect(0, 0, w, h);
      g.strokeStyle = "#2B2A26"; g.lineWidth = 5; g.strokeRect(2, 2, w - 4, h - 4);
      if (kepalaMerah) { g.fillStyle = "#B5443A"; g.fillRect(2, 2, w - 4, 16); }
      g.fillStyle = warnaGaris; for (let l = 0; l < 4; l++) g.fillRect(12, 26 + l * 12, l === 3 ? 22 : 40, 4);
    });
    const TEKS = { baik: garisKertas("#9FB2C8", false, "#FFFDF6"), rapat: garisKertas("#B5443A", true, "#FFFDF6"), emas: garisKertas("#9A7224", false, "#F2D28A") };
    const kolam = [], pakai = new Map();
    function ambilKertas(jenis) {
      let m = kolam.pop();
      if (!m) { m = new T.Mesh(new T.PlaneGeometry(1, 1.27), new T.MeshBasicMaterial({ side: T.DoubleSide })); A.add(m); }
      m.material.map = TEKS[jenis]; m.material.needsUpdate = true; m.visible = true;
      return m;
    }
    return {
      gambar(st, waktu) {
        const sk = s();
        kipas.position.set(X(api.W() / 2), Y(46) - 1.7, 0.6);
        kepala.position.y = 1.7;
        kepala.rotation.y = st.sudut;
        baling.rotation.z = -waktu * 18;
        map.position.set(X(st.mapX) + (st.getar > 0 ? Math.sin(waktu * 80) * 0.15 : 0), Y(st.mapY) - 0.1, 0.4);
        map.scale.setScalar(sk / 0.032);
        // sinkronkan kertas
        const lihat = new Set();
        for (const k of st.kertas) {
          let m = pakai.get(k);
          if (!m) { m = ambilKertas(k.jenis); pakai.set(k, m); }
          lihat.add(k);
          m.scale.setScalar(30 * sk);
          m.position.set(X(k.x), Y(k.y), Math.sin(k.fase) * 0.5);
          m.rotation.set(Math.sin(k.rot * 1.3) * 0.9, Math.cos(k.rot) * 0.7, Math.sin(k.rot) * 0.6);
        }
        for (const [k, m] of pakai) if (!lihat.has(k)) { m.visible = false; kolam.push(m); pakai.delete(k); }
        dimas.position.y = bawah + 0.8 + Math.abs(Math.sin(waktu * 6)) * 0.08;
        P.render();
      },
      ukur: P.ukur, hapus: P.hapus,
    };
  };

  /* ---------- Ngemil: duduk di ruang rapat, Oyen presentasi ---------- */
  ADEGAN.ngemil = (api, kanvas2d) => {
    const P = panggung(kanvas2d, { langit: "#E9E2D0", fov: 68 });
    const { adegan: A, kamera } = P;
    const lantai = new T.Mesh(new T.PlaneGeometry(20, 20), bahan("#B9A27E")); lantai.rotation.x = -Math.PI / 2; A.add(lantai);
    const tembok = new T.Mesh(new T.PlaneGeometry(20, 8), bahan("#E9E2D0")); tembok.position.set(0, 4, -4.5); A.add(tembok);
    [-5, 5].forEach((x) => { const s = new T.Mesh(new T.PlaneGeometry(12, 8), bahan("#E2D9C2")); s.position.set(x, 4, 1.5); s.rotation.y = x < 0 ? Math.PI / 2 : -Math.PI / 2; A.add(s); });
    // papan tulis dengan grafik gula
    const papanTulis = kanvasTekstur(512, 256, (g, w, h) => {
      g.fillStyle = "#FFFDF6"; g.fillRect(0, 0, w, h);
      g.strokeStyle = "#2B2A26"; g.lineWidth = 12; g.strokeRect(6, 6, w - 12, h - 12);
      g.strokeStyle = "#2F4A6B"; g.lineWidth = 8; g.beginPath(); g.moveTo(40, 210); g.lineTo(130, 170); g.lineTo(220, 190); g.lineTo(330, 90); g.stroke();
      g.fillStyle = "#B5443A"; g.font = 'bold 40px "Pixelify Sans", monospace'; g.textAlign = "right"; g.fillText("GULA: ???", w - 36, 64);
    });
    const papanM = new T.Mesh(new T.PlaneGeometry(3.4, 1.7), new T.MeshBasicMaterial({ map: papanTulis })); papanM.position.set(-0.3, 2.45, -4.4); A.add(papanM);
    const bingkai = kotak(3.6, 1.9, 0.08, "#8A5E3B", 0); bingkai.position.set(-0.3, 2.45, -4.48); A.add(bingkai);
    // Oyen
    const oyen = papan("oyenBelakang", 1.6); oyen.position.set(0.85, 1.3, -3.4); A.add(oyen);
    const byOyen = bayangan(0.6); byOyen.position.set(0.85, 0.02, -3.4); A.add(byOyen);
    const seru = bidangTeks("!", 0.4, 0.56, { latar: "#B5443A", warna: "#FFFDF6", ukuran: 120 }); seru.position.set(1.4, 2.3, -3.35); A.add(seru);
    // meja panjang, kursi, rekan rapat
    const meja = kotak(2.0, 0.14, 4.4, "#9C6B43"); meja.position.set(0, 0.8, 0); A.add(meja);
    [[-0.85, -2.0], [0.85, -2.0], [-0.85, 2.0], [0.85, 2.0]].forEach(([x, z]) => { const k = kotak(0.1, 0.8, 0.1, "#6B4A2E", 0); k.position.set(x, 0.4, z); A.add(k); });
    const rekan = [["marmut", -1.4, -2.3], ["kukang", 1.4, -1.5], ["kapibara", -1.4, -0.7]].map(([sp, x, z]) => {
      const kursi = kotak(0.7, 0.8, 0.7, "#5D4E6E"); kursi.position.set(x, 0.4, z); A.add(kursi);
      const sandaran = kotak(0.7, 0.9, 0.12, "#5D4E6E"); sandaran.position.set(x + (x < 0 ? -0.3 : 0.3), 1.1, z); sandaran.rotation.y = Math.PI / 2; A.add(sandaran);
      const p = papan(sp, 1.0); p.position.set(x, 1.28, z); p.userData.dasar = 1.28; A.add(p);
      return p;
    });
    // piring & gorengan
    const piring = silinder(0.42, 0.34, 0.05, "#FFFDF6", 24, 0.02); piring.position.set(0, 0.9, 1.25); A.add(piring);
    const gorengan = [0, 1, 2].map((i) => { const g = papan("gorengan", 0.3); g.position.set(-0.22 + i * 0.22, 1.02, 1.2 + (i % 2) * 0.08); A.add(g); return g; });
    const cangkir = papan("cangkir", 0.34); cangkir.position.set(0.62, 1.03, 1.0); A.add(cangkir);
    const pos = { y: 1.72, ly: 1.4, lz: -3 };
    kamera.position.set(0, pos.y, 3.7); kamera.lookAt(0, pos.ly, pos.lz);
    return {
      gambar(st, waktu) {
        gantiPapan(oyen, st.keadaan === "menoleh" ? "oyen" : "oyenBelakang");
        seru.visible = st.keadaan === "curiga";
        oyen.position.y = 1.25 + (st.keadaan === "presentasi" ? Math.abs(Math.sin(waktu * 2.5)) * 0.06 : 0);
        // kepala menunduk saat ngemil
        const makan = st.makan;
        pos.y = lerp(pos.y, makan ? 1.45 : 1.72, 0.12);
        pos.ly = lerp(pos.ly, makan ? 0.8 : 1.4, 0.12);
        pos.lz = lerp(pos.lz, makan ? 0.9 : -3, 0.12);
        kamera.position.set(Math.sin(waktu * 0.6) * 0.08, pos.y + (makan ? Math.sin(waktu * 16) * 0.02 : 0), 3.7);
        kamera.lookAt(0, pos.ly, pos.lz);
        gorengan.forEach((g, i) => { g.scale.setScalar(i === 2 ? 0.3 * (1 - st.potongan * 0.28) : 0.3); });
        rekan.forEach((p, i) => { p.position.y = p.userData.dasar + Math.abs(Math.sin(waktu * 1.4 + i)) * 0.04; });
        P.render();
      },
      ukur: P.ukur, hapus: P.hapus,
    };
  };

  /* ---------- Grand Prix Kantor: sirkuit 3 lap, kamera mengejar ---------- */
  ADEGAN.troli = (api, kanvas2d, sim) => {
    const P = panggung(kanvas2d, { langit: "#BFD8E8", fov: 64, kabut: [36, 150] });
    const { adegan: A, kamera } = P;
    const { pts, N, halfW } = sim.trek;
    // rumput
    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
    for (const p of pts) { minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x); minZ = Math.min(minZ, p.z); maxZ = Math.max(maxZ, p.z); }
    const cx = (minX + maxX) / 2, cz = (minZ + maxZ) / 2;
    const rumput = new T.Mesh(new T.PlaneGeometry(600, 600), bahan("#7FA868"));
    rumput.rotation.x = -Math.PI / 2; rumput.position.set(cx, -0.03, cz); A.add(rumput);
    // pita mengikuti lintasan: dari jarak lateral a ke b, tinggi y (atau dinding tegak)
    function pita(a, b, y, warnaFn, tegak = 0) {
      const pos = [], war = [], idx = [];
      const c = new T.Color();
      for (let i = 0; i <= N; i++) {
        const p = pts[i % N];
        if (tegak) { pos.push(p.x + p.nx * a, 0, p.z + p.nz * a, p.x + p.nx * a, tegak, p.z + p.nz * a); }
        else pos.push(p.x + p.nx * a, y, p.z + p.nz * a, p.x + p.nx * b, y, p.z + p.nz * b);
        c.set(warnaFn(i)); war.push(c.r, c.g, c.b, c.r, c.g, c.b);
        if (i > 0) { const k = (i - 1) * 2; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
      }
      const g = new T.BufferGeometry();
      g.setAttribute("position", new T.Float32BufferAttribute(pos, 3));
      g.setAttribute("color", new T.Float32BufferAttribute(war, 3));
      g.setIndex(idx); g.computeVertexNormals();
      const m = new T.Mesh(g, new T.MeshLambertMaterial({ vertexColors: true, side: T.DoubleSide }));
      A.add(m); return m;
    }
    pita(-halfW, halfW, 0, () => "#5C5A57");
    pita(-halfW - 1.1, -halfW, 0.02, (i) => (Math.floor(i / 5) % 2 ? "#FFFDF6" : "#B5443A"));
    pita(halfW, halfW + 1.1, 0.02, (i) => (Math.floor(i / 5) % 2 ? "#FFFDF6" : "#B5443A"));
    pita(-0.12, 0.12, 0.01, (i) => (Math.floor(i / 8) % 2 ? "#5C5A57" : "#E9E2D0"));
    // pagar ban (dinding rendah warna-warni)
    const BATAS = halfW + 4.6;
    pita(-BATAS, 0, 0, (i) => ["#2B2A26", "#E05A4E", "#2B2A26", "#FFFDF6"][Math.floor(i / 3) % 4], 0.9);
    pita(BATAS, 0, 0, (i) => ["#2B2A26", "#3E78C4", "#2B2A26", "#FFFDF6"][Math.floor(i / 3) % 4], 0.9);
    // garis start/finis & gapura
    const p0 = pts[0];
    const kotakFinis = kanvasTekstur(256, 32, (g) => { for (let i = 0; i < 16; i++) for (let j = 0; j < 2; j++) { g.fillStyle = (i + j) % 2 ? "#2B2A26" : "#FFFDF6"; g.fillRect(i * 16, j * 16, 16, 16); } });
    const finis = new T.Mesh(new T.PlaneGeometry(halfW * 2, 1.4), new T.MeshBasicMaterial({ map: kotakFinis }));
    finis.rotation.set(-Math.PI / 2, 0, Math.atan2(-p0.nz, p0.nx)); finis.position.set(p0.x, 0.03, p0.z); A.add(finis);
    const hadapDatang = Math.atan2(-p0.tx, -p0.tz);
    [-1, 1].forEach((s2) => { const t = kotak(0.5, 6, 0.5, "#B9B4AA"); t.position.set(p0.x + p0.nx * s2 * (halfW + 1.6), 3, p0.z + p0.nz * s2 * (halfW + 1.6)); A.add(t); });
    const spanduk = bidangTeks("KLP GRAND PRIX", halfW * 2 + 3.6, 1.4, { latar: "#B5443A", warna: "#FFFDF6" });
    spanduk.position.set(p0.x, 5.6, p0.z); spanduk.rotation.y = hadapDatang; A.add(spanduk);
    const spanduk2 = spanduk.clone(); spanduk2.rotation.y = hadapDatang + Math.PI; spanduk2.position.set(p0.x + p0.tx * 0.05, 5.6, p0.z + p0.tz * 0.05); A.add(spanduk2);
    // tribun penonton di luar lurusan start
    const sisiTribun = 1, pT = pts[N - 40];
    const tribun = new T.Group(); A.add(tribun);
    tribun.position.set(pT.x + pT.nx * sisiTribun * (BATAS + 4), 0, pT.z + pT.nz * sisiTribun * (BATAS + 4));
    tribun.rotation.y = Math.atan2(-pT.tx, -pT.tz) + Math.PI / 2;
    for (let k = 0; k < 3; k++) { const b = kotak(26, 1, 2, ["#9AA2AA", "#B9B4AA", "#CFC5AD"][k], 0.03); b.position.set(0, 0.5 + k, k * 2); tribun.add(b); }
    ["kapibara", "gajah", "singa", "rakun", "berang", "hantu", "beruang", "kapibara"].forEach((sp, k) => { const p = papan(sp, 1.5); p.position.set(-10 + k * 2.9, 1.8 + (k % 3), (k % 3) * 2); p.userData.dasar = p.position.y; tribun.add(p); });
    const penonton = tribun.children.filter((o) => o.isSprite);
    // gedung kantor di tengah & pohon
    const jauhDariTrek = (x, z, min) => { for (let i = 0; i < N; i += 4) { const p = pts[i]; if ((p.x - x) ** 2 + (p.z - z) ** 2 < min * min) return false; } return true; };
    if (jauhDariTrek(cx, cz, 16)) {
      const jendela = kanvasTekstur(128, 128, (g, w, h) => { g.fillStyle = "#E9E2D0"; g.fillRect(0, 0, w, h); g.fillStyle = "#7FB2D9"; for (let y = 10; y < h; y += 30) for (let x = 10; x < w; x += 30) g.fillRect(x, y, 18, 18); });
      jendela.wrapS = jendela.wrapT = T.RepeatWrapping; jendela.repeat.set(3, 3);
      const gedung = new T.Mesh(new T.BoxGeometry(18, 16, 12), new T.MeshLambertMaterial({ map: jendela }));
      gedung.position.set(cx, 8, cz); garis(gedung, 0.12); A.add(gedung);
      const papanNama = bidangTeks("KANTOR LAYANAN PERASAAN", 16, 1.6, { latar: "#2F4A6B", warna: "#FFFDF6" }); papanNama.position.set(cx, 14.5, cz + 6.05); A.add(papanNama);
    }
    let ditanam = 0;
    for (let k = 0; k < 400 && ditanam < 46; k++) {
      const x = acak3(minX - 30, maxX + 30), z = acak3(minZ - 30, maxZ + 30);
      if (!jauhDariTrek(x, z, BATAS + 3) || (Math.abs(x - cx) < 12 && Math.abs(z - cz) < 9)) continue;
      const pohon = new T.Group();
      const batang = silinder(0.25, 0.3, 1.4, "#8A5E3B", 6, 0); batang.position.y = 0.7; pohon.add(batang);
      const daun = new T.Mesh(new T.ConeGeometry(1.4, 3, 7), bahan(ditanam % 3 ? "#4F6E5E" : "#5E8C6A")); daun.position.y = 2.9; pohon.add(garis(daun, 0.06));
      pohon.position.set(x, 0, z); pohon.scale.setScalar(0.8 + (k % 5) * 0.12); A.add(pohon); ditanam++;
    }
    // panah turbo di aspal
    const teksPanah = kanvasTekstur(64, 64, (g, w, h) => { g.fillStyle = "#F2C14E"; g.fillRect(0, 0, w, h); g.fillStyle = "#B5803A"; for (let k = 0; k < 2; k++) { g.beginPath(); g.moveTo(10, 36 - k * 22 + 18); g.lineTo(32, 14 - k * 22 + 18); g.lineTo(54, 36 - k * 22 + 18); g.lineTo(54, 46 - k * 22 + 18); g.lineTo(32, 24 - k * 22 + 18); g.lineTo(10, 46 - k * 22 + 18); g.fill(); } });
    sim.pad.forEach((q) => {
      const m = new T.Mesh(new T.PlaneGeometry(2.6, 3.4), new T.MeshBasicMaterial({ map: teksPanah }));
      m.rotation.set(-Math.PI / 2, 0, Math.atan2(-Math.cos(q.a), -Math.sin(q.a)));
      m.position.set(q.x, 0.035, q.z); A.add(m);
    });
    // kotak item "?"
    const teksTanya = kanvasTekstur(64, 64, (g, w, h) => { g.fillStyle = "#7FC8F2"; g.fillRect(0, 0, w, h); g.strokeStyle = "#2B2A26"; g.lineWidth = 6; g.strokeRect(3, 3, w - 6, h - 6); g.fillStyle = "#FFFDF6"; g.font = 'bold 44px "Pixelify Sans", monospace'; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("?", w / 2, h / 2 + 3); });
    const bahanTanya = new T.MeshLambertMaterial({ map: teksTanya, transparent: true, opacity: 0.92 });
    const mKotak = sim.kotak.map((k) => { const m = new T.Mesh(new T.BoxGeometry(1.1, 1.1, 1.1), bahanTanya); m.position.set(k.x, 0.95, k.z); A.add(m); return m; });
    const mKoin = sim.koin.map((c) => { const m = kotak(0.5, 0.68, 0.08, "#F2C14E", 0.03); m.position.set(c.x, 0.6, c.z); A.add(m); return m; });
    // kendaraan
    function buatKendaraan(r) {
      const g = new T.Group(), badan = new T.Group(); g.add(badan);
      const roda = [];
      if (r.kendaraan === "motor") {
        const b = kotak(1.5, 0.32, 0.34, r.warna); b.position.y = 0.6; badan.add(b);
        const depan = kotak(0.5, 0.42, 0.42, r.warna); depan.position.set(0.55, 0.78, 0); depan.rotation.z = -0.4; badan.add(depan);
        const kaca = kotak(0.08, 0.3, 0.36, "#9DB0BC", 0.02); kaca.position.set(0.72, 1.02, 0); kaca.rotation.z = -0.5; badan.add(kaca);
        [0.72, -0.68].forEach((x) => { const w = new T.Mesh(new T.TorusGeometry(0.3, 0.1, 8, 16), bahan("#2B2A26")); w.position.set(x, 0.4, 0); badan.add(w); roda.push(w); });
        const p = papan(r.sprite, 0.95); p.position.set(-0.05, 1.18, 0); badan.add(p);
      } else if (r.kendaraan === "kursi") {
        const dudukan = kotak(0.9, 0.18, 0.9, r.warna); dudukan.position.y = 0.72; badan.add(dudukan);
        const sandaran = kotak(0.14, 0.85, 0.9, r.warna); sandaran.position.set(-0.45, 1.15, 0); badan.add(sandaran);
        const tiang = silinder(0.07, 0.07, 0.5, "#3B4046", 8, 0); tiang.position.y = 0.4; badan.add(tiang);
        for (let k = 0; k < 5; k++) { const kaki = kotak(0.6, 0.06, 0.08, "#3B4046", 0); const sud = (k * Math.PI * 2) / 5; kaki.position.set(Math.cos(sud) * 0.3, 0.16, Math.sin(sud) * 0.3); kaki.rotation.y = -sud; badan.add(kaki); const w = silinder(0.08, 0.08, 0.06, "#2B2A26", 8, 0); w.rotation.x = Math.PI / 2; w.position.set(Math.cos(sud) * 0.58, 0.08, Math.sin(sud) * 0.58); badan.add(w); }
        const p = papan(r.sprite, 0.95); p.position.set(0.05, 1.3, 0); badan.add(p);
      } else {
        const b = kotak(1.5, 0.45, 1.0, r.warna); b.position.y = 0.45; badan.add(b);
        const isi = kotak(0.5, 0.22, 0.7, "#FFFDF6", 0.02); isi.position.set(0.35, 0.78, 0); badan.add(isi);
        const gagang = kotak(0.06, 0.06, 1.0, "#2B2A26", 0); gagang.position.set(-0.78, 0.98, 0); badan.add(gagang);
        [[0.55, 0.42], [0.55, -0.42], [-0.55, 0.42], [-0.55, -0.42]].forEach(([x, z]) => { const w = silinder(0.17, 0.17, 0.12, "#2B2A26", 10, 0); w.rotation.x = Math.PI / 2; w.position.set(x, 0.17, z); badan.add(w); roda.push(w); });
        const p = papan(r.sprite, 0.95); p.position.set(-0.25, 1.12, 0); badan.add(p);
      }
      const by = bayangan(1.0); by.position.y = 0.04; g.add(by);
      const gelembung = new T.Mesh(new T.SphereGeometry(1.45, 16, 12), new T.MeshBasicMaterial({ color: 0x7FC8F2, transparent: true, opacity: 0.28, depthWrite: false }));
      gelembung.position.y = 0.8; g.add(gelembung);
      const api2 = [0, 1].map((k) => { const m = new T.Mesh(new T.ConeGeometry(0.16, 0.7, 8), new T.MeshBasicMaterial({ color: 0xF2A14E })); m.rotation.z = Math.PI / 2; m.position.set(-0.95, 0.35, k ? 0.22 : -0.22); g.add(m); return m; });
      const percik = [0, 1].map((k) => { const m = new T.Mesh(new T.BoxGeometry(0.16, 0.16, 0.16), new T.MeshBasicMaterial({ color: 0x7FC8F2 })); m.position.set(-0.7, 0.12, k ? 0.5 : -0.5); g.add(m); return m; });
      if (!r.pemain) { const t = bidangTeks(r.nama, 1.3, 0.3, { latar: "#2B2A26", warna: "#FFFDF6" }); t.position.y = 2.15; t.userData.label = true; g.add(t); }
      A.add(g);
      return { g, badan, roda, gelembung, api: api2, percik };
    }
    const mobil = sim.pembalap.map(buatKendaraan);
    const label = []; A.traverse((o) => { if (o.userData.label) label.push(o); });
    // benda dinamis: kulit pisang & stempel
    const kolamPisang = new Map(), kolamStempel = new Map();
    const WARNA_MUATAN = [0xFFFDF6, 0x7FC8F2, 0xF2A14E, 0xC38AF2];
    const kam = { x: 0, z: 0, ada: false };
    return {
      gambar(st, waktu) {
        mKotak.forEach((m, i) => { const k = st.kotak[i]; m.visible = k.aktif; m.rotation.y = waktu * 1.6 + i; m.rotation.x = 0.3; m.position.y = 0.95 + Math.sin(waktu * 3 + i) * 0.12; });
        mKoin.forEach((m, i) => { m.visible = st.koin[i].aktif; m.rotation.y = waktu * 3 + i * 0.4; });
        st.pembalap.forEach((r, i) => {
          const m = mobil[i];
          m.g.position.set(r.x, (r.loncat > 0 ? Math.sin((r.loncat / 0.18) * Math.PI) * 0.35 : 0), r.z);
          m.g.rotation.y = -(r.a + r.putar + (r.drift ? r.driftArah * 0.42 : 0));
          m.badan.rotation.x = r.kendaraan === "motor" ? r.miring * 0.55 : r.miring * 0.08;
          m.roda.forEach((w) => { if (r.kendaraan === "motor") w.rotation.z = -r.roda * 3; else w.rotation.y = r.roda * 3; });
          m.gelembung.visible = r.kebal > 0;
          m.api.forEach((f) => { f.visible = r.turbo > 0; f.scale.set(1, 0.7 + Math.random() * 0.7, 1); });
          const lv = r.drift ? (r.muatan >= 2.6 ? 3 : r.muatan >= 1.7 ? 2 : r.muatan >= 0.85 ? 1 : 0) : -1;
          m.percik.forEach((p) => { p.visible = lv >= 1 || (lv === 0 && Math.random() < 0.4); if (p.visible) { p.material.color.setHex(WARNA_MUATAN[Math.max(0, lv)]); p.position.y = 0.1 + Math.random() * 0.25; } });
        });
        // kulit pisang
        const adaP = new Set(st.pisang);
        for (const b of st.pisang) { let m = kolamPisang.get(b); if (!m) { m = papan("gorengan", 0.9); A.add(m); kolamPisang.set(b, m); } m.position.set(b.x, 0.38, b.z); }
        for (const [b, m] of kolamPisang) if (!adaP.has(b)) { A.remove(m); m.material.dispose(); kolamPisang.delete(b); }
        const adaS = new Set(st.stempel);
        for (const s2 of st.stempel) { let m = kolamStempel.get(s2); if (!m) { m = kotak(0.8, 0.5, 0.8, "#B5443A"); A.add(m); kolamStempel.set(s2, m); } m.position.set(s2.x, 0.7, s2.z); m.rotation.y = waktu * 12; }
        for (const [s2, m] of kolamStempel) if (!adaS.has(s2)) { A.remove(m); kolamStempel.delete(s2); }
        penonton.forEach((p, k) => { p.position.y = p.userData.dasar + Math.abs(Math.sin(waktu * 5 + k)) * 0.25; });
        // kamera mengejar dari belakang pemain
        const r = st.pemain, fx = Math.cos(r.a), fz = Math.sin(r.a);
        const jauh = r.turbo > 0 ? 7.6 : 6.6;
        const tx = r.x - fx * jauh, tz = r.z - fz * jauh;
        if (!kam.ada) { kam.x = tx; kam.z = tz; kam.ada = true; }
        kam.x = lerp(kam.x, tx, 0.14); kam.z = lerp(kam.z, tz, 0.14);
        kamera.position.set(kam.x, st.fase === "lampu" ? 3.4 : 3.0, kam.z);
        kamera.lookAt(r.x + fx * 6, 1.0, r.z + fz * 6);
        kamera.rotateZ(-r.miring * (r.kendaraan === "motor" ? 0.16 : 0.05));
        const fovT = r.turbo > 0 ? 74 : 64;
        if (Math.abs(kamera.fov - fovT) > 0.1) { kamera.fov = lerp(kamera.fov, fovT, 0.08); kamera.updateProjectionMatrix(); }
        label.forEach((t) => t.quaternion.copy(kamera.quaternion));
        P.render();
      },
      ukur: P.ukur, hapus: P.hapus,
    };
  };
  const acak3 = (a, b) => a + Math.random() * (b - a);

  /* ---------- Arena bersama (Legenda Lantai 2 & Kantor Royale) ---------- */
  ADEGAN.arena = (api, kanvas2d, dunia) => {
    const P = panggung(kanvas2d, { langit: dunia.langit || "#BFD8E8", fov: 46, kabut: dunia.kabut || [60, 140] });
    const { adegan: A, kamera } = P;
    const W0 = dunia.x1 - dunia.x0, D0 = dunia.z1 - dunia.z0;
    const luar = new T.Mesh(new T.PlaneGeometry(W0 + 400, D0 + 400), bahan(dunia.warnaLuar || "#6E9A5C"));
    luar.rotation.x = -Math.PI / 2; luar.position.set((dunia.x0 + dunia.x1) / 2, -0.06, (dunia.z0 + dunia.z1) / 2); A.add(luar);
    const tanah = new T.Mesh(new T.PlaneGeometry(W0, D0), bahan(dunia.warnaTanah));
    tanah.rotation.x = -Math.PI / 2; tanah.position.set((dunia.x0 + dunia.x1) / 2, -0.02, (dunia.z0 + dunia.z1) / 2); A.add(tanah);
    (dunia.lantai || []).forEach((l, i) => {
      const m = new T.Mesh(new T.PlaneGeometry(l.w, l.d), new T.MeshLambertMaterial({ color: l.warna }));
      m.rotation.x = -Math.PI / 2; m.position.set(l.x, 0.005 + i * 0.002, l.z); A.add(m);
    });
    for (const b of dunia.rintangan) {
      if (b.semak) {
        const m = new T.Mesh(new T.BoxGeometry(b.w, b.h || 1, b.d), bahan(b.warna, { transparent: true, opacity: 0.88 }));
        m.position.set(b.x, (b.h || 1) / 2, b.z); A.add(m);
        for (let k = 0; k < Math.max(2, Math.round((b.w * b.d) / 6)); k++) { const daun = new T.Mesh(new T.SphereGeometry(0.6, 6, 5), bahan("#5E8C6A")); daun.position.set(b.x + (Math.random() - 0.5) * b.w * 0.8, (b.h || 1) + 0.1, b.z + (Math.random() - 0.5) * b.d * 0.8); A.add(daun); }
      } else if (b.pohon) {
        const g = new T.Group(); const bt = silinder(0.35, 0.4, 1.6, "#8A5E3B", 6, 0); bt.position.y = 0.8; g.add(bt);
        const dn = new T.Mesh(new T.ConeGeometry(1.6, 3.4, 7), bahan("#4F6E5E")); dn.position.y = 3.2; g.add(garis(dn, 0.06));
        g.position.set(b.x, 0, b.z); A.add(g);
      } else {
        const m = kotak(b.w, b.h || 2, b.d, b.warna, b.w * b.d > 40 ? 0.08 : 0.04); m.position.set(b.x, (b.h || 2) / 2, b.z); A.add(m);
      }
    }
    (dunia.hiasan || []).forEach((h) => { const t = bidangTeks(h.teks, h.w, h.h, { latar: h.latar, warna: h.warna || "#FFFDF6" }); t.rotation.x = -Math.PI / 2; t.position.set(h.x, 0.03, h.z); A.add(t); });
    // pool benda dinamis
    const kolam = new Map();
    const bahanCincin = {};
    function cincin(warna) { return bahanCincin[warna] || (bahanCincin[warna] = new T.MeshBasicMaterial({ color: warna, transparent: true, opacity: 0.8, side: T.DoubleSide })); }
    function buatEntitas(e) {
      const g = new T.Group();
      if (e.jenis === "menara" || e.jenis === "inti") {
        const besar = e.jenis === "inti";
        const kaki = silinder(besar ? 2.2 : 1.3, besar ? 2.6 : 1.6, besar ? 1.4 : 3.2, "#B9B4AA", 10); kaki.position.y = besar ? 0.7 : 1.6; g.add(kaki);
        const kristal = new T.Mesh(new T.OctahedronGeometry(besar ? 1.8 : 0.9), bahan(e.warna)); kristal.position.y = besar ? 3.2 : 4.1; garis(kristal, 0.06); g.add(kristal);
        g.userData.kristal = kristal;
      } else if (e.jenis === "peti") {
        const b = kotak(1.3, 0.9, 0.9, "#C9A06A"); b.position.y = 0.45; g.add(b);
        const tutup = kotak(1.34, 0.18, 0.94, "#9C6B43", 0.02); tutup.position.y = 0.92; g.add(tutup);
      } else {
        if (e.warna) { const c = new T.Mesh(new T.RingGeometry((e.r || 0.6) * 0.75, (e.r || 0.6), 24), cincin(e.warna)); c.rotation.x = -Math.PI / 2; c.position.y = 0.04; g.add(c); g.userData.cincin = c; }
        const by = bayangan((e.r || 0.6) * 1.1); by.position.y = 0.03; g.add(by);
        const uk = (e.r || 0.6) * 2.3 * (e.skala || 1);
        const p = papan(e.sprite || "dokumen", uk); p.position.y = uk / 2 + 0.05; g.add(p); g.userData.papan = p; g.userData.uk = uk;
        if (e.jenis === "pemain" || e.jenis === "bot") {
          const pay = new T.Mesh(new T.ConeGeometry(1.5, 0.8, 10, 1, true), bahan("#B5443A", { side: T.DoubleSide })); pay.position.y = uk + 1.6; pay.visible = false; g.add(pay); g.userData.payung = pay;
        }
      }
      A.add(g); return g;
    }
    const kolamPeluru = new Map(), kolamEfek = new Map();
    const bahanPeluru = {};
    // zona aman (dinding tembus pandang) dan pesawat kertas
    const zona = new T.Mesh(new T.CylinderGeometry(1, 1, 14, 64, 1, true), new T.MeshBasicMaterial({ color: 0x7FB2D9, transparent: true, opacity: 0.22, side: T.DoubleSide, depthWrite: false }));
    zona.position.y = 7; zona.visible = false; A.add(zona);
    const zonaBerikut = new T.Mesh(new T.RingGeometry(0.985, 1, 96), new T.MeshBasicMaterial({ color: 0xFFFDF6, side: T.DoubleSide }));
    zonaBerikut.rotation.x = -Math.PI / 2; zonaBerikut.position.y = 0.06; zonaBerikut.visible = false; A.add(zonaBerikut);
    const pesawat = new T.Group();
    const sayap = new T.Mesh(new T.BufferGeometry().setFromPoints([new T.Vector3(2.4, 0, 0), new T.Vector3(-1.8, 0, -1.8), new T.Vector3(-1.2, 0, 0), new T.Vector3(2.4, 0, 0), new T.Vector3(-1.2, 0, 0), new T.Vector3(-1.8, 0, 1.8)]), new T.MeshBasicMaterial({ color: 0xFFFDF6, side: T.DoubleSide }));
    pesawat.add(sayap); pesawat.scale.setScalar(2.2); pesawat.visible = false; A.add(pesawat);
    const v = new T.Vector3();
    const kam = { x: null, z: null };
    return {
      proyeksi(x, y, z) { v.set(x, y, z).project(kamera); return { x: (v.x + 1) / 2 * api.W(), y: (1 - v.y) / 2 * api.H(), di: v.z < 1 }; },
      gambar(st, waktu) {
        const ada = new Set();
        for (const e of st.entitas) {
          ada.add(e);
          let g = kolam.get(e);
          if (!g) { g = buatEntitas(e); kolam.set(e, g); }
          g.visible = !e.mati && !e.tersembunyi;
          if (!g.visible) continue;
          g.position.set(e.x, e.tinggi || 0, e.z);
          if (g.userData.kristal) { g.userData.kristal.rotation.y = waktu * 1.2; g.userData.kristal.position.y = (e.jenis === "inti" ? 3.2 : 4.1) + Math.sin(waktu * 2) * 0.15; }
          if (g.userData.papan) {
            const pp = g.userData.papan;
            pp.material.opacity = e.transparan ? 0.45 : 1; pp.material.transparent = !!e.transparan;
            if (e.sprite && pp.userData.sprite !== e.sprite) gantiPapan(pp, e.sprite);
            pp.position.y = g.userData.uk / 2 + 0.05 + (e.lompat || 0);
            if (e.kedip) pp.material.color.setRGB(1, 0.55, 0.55); else pp.material.color.setRGB(1, 1, 1);
          }
          if (g.userData.payung) g.userData.payung.visible = !!e.payung;
          if (e.jenis === "barang") g.rotation.y = waktu * 2;
        }
        for (const [e, g] of kolam) if (!ada.has(e)) { A.remove(g); kolam.delete(e); }
        const adaP = new Set(st.proyektil || []);
        for (const q of st.proyektil || []) {
          let m = kolamPeluru.get(q);
          if (!m) { const w = q.warna || "#FFFDF6"; m = new T.Mesh(new T.SphereGeometry(q.r || 0.25, 8, 6), bahanPeluru[w] || (bahanPeluru[w] = new T.MeshBasicMaterial({ color: w }))); A.add(m); kolamPeluru.set(q, m); }
          m.position.set(q.x, q.y ?? 1, q.z);
        }
        for (const [q, m] of kolamPeluru) if (!adaP.has(q)) { A.remove(m); m.geometry.dispose(); kolamPeluru.delete(q); }
        const adaE = new Set(st.efek || []);
        for (const ef of st.efek || []) {
          let m = kolamEfek.get(ef);
          if (!m) { m = new T.Mesh(new T.RingGeometry(0.8, 1, 32), new T.MeshBasicMaterial({ color: ef.warna, transparent: true, side: T.DoubleSide, depthWrite: false })); m.rotation.x = -Math.PI / 2; A.add(m); kolamEfek.set(ef, m); }
          const f = ef.umur / ef.maks, r = ef.r * (0.35 + 0.65 * f);
          m.scale.set(r, r, r); m.position.set(ef.x, 0.08, ef.z); m.material.opacity = Math.max(0, 0.9 - f);
        }
        for (const [ef, m] of kolamEfek) if (!adaE.has(ef)) { A.remove(m); m.geometry.dispose(); m.material.dispose(); kolamEfek.delete(ef); }
        if (st.zona) {
          zona.visible = true; zona.position.set(st.zona.x, 7, st.zona.z); zona.scale.set(st.zona.r, 1, st.zona.r);
          if (st.zona.rBerikut) { zonaBerikut.visible = true; zonaBerikut.position.set(st.zona.xB, 0.06, st.zona.zB); zonaBerikut.scale.setScalar(st.zona.rBerikut); } else zonaBerikut.visible = false;
        }
        if (st.pesawat) { pesawat.visible = true; pesawat.position.set(st.pesawat.x, 16, st.pesawat.z); pesawat.rotation.y = -st.pesawat.a; } else pesawat.visible = false;
        // kamera miring ala MOBA, mengikuti fokus
        const kd = dunia.kamera || { tinggi: 24, mundur: 15, maju: 1 };
        const naik = st.kameraTinggi || 0;
        if (kam.x === null) { kam.x = st.fokus.x; kam.z = st.fokus.z; }
        kam.x = lerp(kam.x, st.fokus.x, 0.15); kam.z = lerp(kam.z, st.fokus.z, 0.15);
        kamera.position.set(kam.x, kd.tinggi + naik, kam.z + kd.mundur + naik * 0.5);
        kamera.lookAt(kam.x, 0, kam.z - kd.maju);
        P.render();
      },
      ukur: P.ukur, hapus: P.hapus,
    };
  };
  ADEGAN.moba = ADEGAN.arena;
  ADEGAN.royale = ADEGAN.arena;

  /* ---------- antarmuka untuk games.js ---------- */
  K.G3 = {
    bisa3D, siap,
    punya: (id) => !!ADEGAN[id],
    buat(id, api, kanvas2d, data) { return ADEGAN[id](api, kanvas2d, data); },
  };
})();
