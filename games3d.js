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

  /* ---------- Troli: lintasan parkiran bawah tanah, kamera mengejar ---------- */
  ADEGAN.troli = (api, kanvas2d, data) => {
    const P = panggung(kanvas2d, { langit: "#4A4744", fov: 62, kabut: [10, 48] });
    const { adegan: A, kamera } = P;
    const { PANJANG, tengah, lebar, benda, LAWAN } = data;
    const S = 1 / 48;
    const X = (px) => (px - api.W() / 2) * S, Z = (d) => -d * S;
    // lantai luas
    const lantai = new T.Mesh(new T.PlaneGeometry(40, PANJANG * S + 80), bahan("#8D8A84"));
    lantai.rotation.x = -Math.PI / 2; lantai.position.set(0, -0.02, Z(PANJANG / 2)); A.add(lantai);
    // jalan: pita mengikuti tikungan
    function pita(dariKiri, keKanan, y, warna, langkah = 40, sampai = PANJANG + 900) {
      const pos = [], idx = [];
      let n = 0;
      for (let dd = -500; dd <= sampai; dd += langkah) {
        const c = tengah(dd), l = lebar(dd);
        pos.push(X(c + dariKiri(l)), y, Z(dd), X(c + keKanan(l)), y, Z(dd));
        if (n > 0) { const a = (n - 1) * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
        n++;
      }
      const g = new T.BufferGeometry();
      g.setAttribute("position", new T.Float32BufferAttribute(pos, 3));
      g.setIndex(idx); g.computeVertexNormals();
      const m = new T.Mesh(g, bahan(warna, { side: T.DoubleSide }));
      A.add(m); return m;
    }
    pita((l) => -l / 2, (l) => l / 2, 0, "#5C5A57");
    pita((l) => -l / 2 - 7, (l) => -l / 2, 0.06, "#F2C14E");
    pita((l) => l / 2, (l) => l / 2 + 7, 0.06, "#F2C14E");
    // garis tengah putus-putus
    const putih = bahan("#E9E2D0");
    for (let dd = 0; dd < PANJANG + 400; dd += 80) {
      const g = new T.Mesh(new T.BoxGeometry(0.08, 0.01, 40 * S), putih);
      g.position.set(X(tengah(dd + 20)), 0.01, Z(dd + 20)); g.rotation.y = Math.atan2(X(tengah(dd + 40)) - X(tengah(dd)), 40 * S) ; A.add(g);
    }
    // pilar, plafon, lampu, tanda lantai
    const plafon = new T.Mesh(new T.PlaneGeometry(40, PANJANG * S + 80), bahan("#6E6B66", { side: T.DoubleSide }));
    plafon.rotation.x = Math.PI / 2; plafon.position.set(0, 3.4, Z(PANJANG / 2)); A.add(plafon);
    const bahanLampu = new T.MeshBasicMaterial({ color: 0xFFF4C8 });
    for (let k = 0; k * 400 < PANJANG + 800; k++) {
      const dd = k * 400, c = tengah(dd), l = lebar(dd);
      [-1, 1].forEach((sisi) => {
        const p = kotak(0.42, 3.4, 0.42, "#B9B4AA");
        p.position.set(X(c + sisi * (l / 2 + 30)), 1.7, Z(dd)); A.add(p);
      });
      const lampu = new T.Mesh(new T.BoxGeometry(1.6, 0.06, 0.24), bahanLampu); lampu.position.set(X(c), 3.36, Z(dd + 200)); A.add(lampu);
      if (k % 4 === 0) {
        const t = bidangTeks(`B${1 + k / 4}`, 0.7, 0.5, { latar: "#2F4A6B", warna: "#FFFDF6" });
        t.position.set(X(c + l / 2 + 30), 2.3, Z(dd) + 0.22); A.add(t);
      }
    }
    // garis finis & gapura
    const kotakFinis = kanvasTekstur(256, 32, (g, w, h) => { for (let i = 0; i < 16; i++) for (let j = 0; j < 2; j++) { g.fillStyle = (i + j) % 2 ? "#2B2A26" : "#FFFDF6"; g.fillRect(i * 16, j * 16, 16, 16); } });
    const cf = tengah(PANJANG), lf = lebar(PANJANG);
    const finis = new T.Mesh(new T.PlaneGeometry(lf * S, 0.5), new T.MeshBasicMaterial({ map: kotakFinis }));
    finis.rotation.x = -Math.PI / 2; finis.position.set(X(cf), 0.02, Z(PANJANG)); A.add(finis);
    const spanduk = bidangTeks("FINIS · PINTU KELUAR", lf * S + 1, 0.6, { latar: "#B5443A", warna: "#FFFDF6" });
    spanduk.position.set(X(cf), 2.6, Z(PANJANG)); A.add(spanduk);
    // benda di lintasan
    const MODEL = {
      teh: () => papan("cangkir", 0.7), oyen: () => papan("oyen", 0.9), berkas: () => papan("berkas", 0.8),
      emas: () => kotak(0.42, 0.56, 0.08, "#F2C14E"),
      kardus: () => { const g = kotak(0.62, 0.5, 0.6, "#C9A06A"); const pita2 = kotak(0.64, 0.06, 0.62, "#A47E4D", 0); pita2.position.y = 0.05; g.add(pita2); return g; },
      pel: () => { const m = new T.Mesh(new T.CircleGeometry(0.5, 20), new T.MeshBasicMaterial({ color: 0x9FC3E0, transparent: true, opacity: 0.75 })); m.rotation.x = -Math.PI / 2; m.scale.set(1, 0.6, 1); return m; },
    };
    const TINGGI = { teh: 0.38, oyen: 0.45, berkas: 0.42, emas: 0.4, kardus: 0.25, pel: 0.02 };
    const mBenda = benda.map((b) => { const m = MODEL[b.jenis](); m.position.y = TINGGI[b.jenis]; A.add(m); return m; });
    // troli
    function troli(warna, sprite, label) {
      const g = new T.Group();
      const badan = kotak(0.62, 0.36, 0.9, warna); badan.position.y = 0.36; g.add(badan);
      const isi = kotak(0.46, 0.14, 0.4, "#FFFDF6", 0.02); isi.position.set(0, 0.6, 0.18); g.add(isi);
      const gagang = kotak(0.62, 0.06, 0.06, "#2B2A26", 0); gagang.position.set(0, 0.78, 0.46); g.add(gagang);
      [[-0.26, -0.36], [0.26, -0.36], [-0.26, 0.36], [0.26, 0.36]].forEach(([x, z]) => { const r = silinder(0.08, 0.08, 0.06, "#2B2A26", 10, 0); r.rotation.z = Math.PI / 2; r.position.set(x, 0.1, z); g.add(r); });
      if (sprite) { const p = papan(sprite, 0.8); p.position.set(0, 1.0, -0.1); g.add(p); }
      else { const kep = kotak(0.34, 0.34, 0.34, "#F2C14E"); kep.position.set(0, 0.86, -0.12); g.add(kep); }
      if (label) { const t = bidangTeks(label, 0.56, 0.15, { latar: "#2B2A26", warna: "#FFFDF6" }); t.position.set(0, sprite ? 1.5 : 1.14, 0); t.userData.label = true; g.add(t); }
      const by = bayangan(0.6); by.position.y = 0.01; g.add(by);
      A.add(g); return g;
    }
    const mLawan = LAWAN.map((l) => troli(l.warna, l.sprite, l.nama.split(" ").pop()));
    const pemain = troli("#3E78C4", null, api.nama);
    const percik = [0, 1, 2].map(() => { const m = new T.Mesh(new T.BoxGeometry(0.08, 0.08, 0.5), new T.MeshBasicMaterial({ color: 0xF2C14E })); A.add(m); return m; });
    const label = [];
    A.traverse((o) => { if (o.userData.label) label.push(o); });
    let fov = 62;
    return {
      gambar(st, waktu) {
        const { d, x, turbo, licin } = st;
        benda.forEach((b, i) => {
          const m = mBenda[i];
          if (b.kena || Math.abs(b.d - d) > 2600) { m.visible = false; return; }
          m.visible = true;
          m.position.x = X(tengah(b.d) + b.off * lebar(b.d)); m.position.z = Z(b.d);
          if (b.jenis === "emas") m.rotation.y = waktu * 3;
          if (b.jenis === "kardus") m.rotation.y = 0.3;
        });
        LAWAN.forEach((l, i) => {
          const m = mLawan[i];
          m.position.set(X(tengah(l.d) + l.off + Math.sin(waktu * 1.3 + l.goyang) * 14), 0, Z(l.d));
          m.rotation.y = Math.sin(waktu * 1.3 + l.goyang) * 0.12;
        });
        pemain.position.set(X(x), 0, Z(d));
        pemain.rotation.y = licin > 0 ? Math.sin(waktu * 14) * 0.35 : (X(st.targetX) - X(x)) * -0.3;
        percik.forEach((p, i) => { p.visible = turbo > 0; p.position.set(X(x) - 0.15 + i * 0.15, 0.25 + Math.random() * 0.2, Z(d) + 0.7 + Math.random() * 0.5); });
        label.forEach((t) => t.quaternion.copy(kamera.quaternion));
        // kamera mengejar dari belakang
        const cMaju = tengah(d + 260);
        kamera.position.set(lerp(kamera.position.x || X(x), X(x) * 0.7 + X(tengah(d)) * 0.3, 0.12), 2.5, Z(d) + 4.2);
        kamera.lookAt(X(cMaju) * 0.6 + X(x) * 0.4, 0.3, Z(d + 320));
        const fovTarget = 62 + (turbo > 0 ? 12 : 0);
        if (Math.abs(fov - fovTarget) > 0.1) { fov = lerp(fov, fovTarget, 0.08); kamera.fov = fov; kamera.updateProjectionMatrix(); }
        P.render();
      },
      ukur: P.ukur, hapus: P.hapus,
    };
  };

  /* ---------- antarmuka untuk games.js ---------- */
  K.G3 = {
    bisa3D, siap,
    punya: (id) => !!ADEGAN[id],
    buat(id, api, kanvas2d, data) { return ADEGAN[id](api, kanvas2d, data); },
  };
})();
