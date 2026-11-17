/* =========================================================
   Kantor Layanan Perasaan · Efek "WOW" untuk game
   Getar layar, kilatan warna, ledakan partikel, getar HP,
   tulisan besar melompat, dan stiker emote (main berdua).
   Semua dimatikan/diperhalus kalau HP minta "kurangi gerakan".
   ========================================================= */
(() => {
  "use strict";
  const K = window.KLP;
  const pelan = () => K.kurangiGerak;

  // lapisan efek di atas panggung arena (tidak menangkap sentuhan)
  let lapis, kv, ctx, partikel = [], raf = 0, getarSisa = 0, getarKuat = 0;
  function siap() {
    if (lapis) return;
    lapis = document.createElement("div");
    lapis.className = "wow-lapis";
    lapis.innerHTML = `<canvas class="wow-kanvas"></canvas><div class="wow-kilat"></div><div class="wow-teks"></div><div class="wow-emote"></div>`;
    document.body.appendChild(lapis);
    kv = lapis.querySelector("canvas"); ctx = kv.getContext("2d");
    const ukur = () => { const d = Math.min(2, devicePixelRatio || 1); kv.width = innerWidth * d; kv.height = innerHeight * d; ctx.setTransform(d, 0, 0, d, 0, 0); };
    ukur(); addEventListener("resize", ukur);
  }
  function putar() {
    raf = 0;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = partikel.length - 1; i >= 0; i--) {
      const p = partikel[i];
      p.umur += 1 / 60; p.vy += p.g; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      if (p.umur > p.maks) { partikel.splice(i, 1); continue; }
      ctx.globalAlpha = Math.max(0, 1 - p.umur / p.maks);
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
      ctx.fillStyle = p.warna;
      if (p.bentuk === "bintang") { ctx.beginPath(); for (let k = 0; k < 10; k++) { const a = (k * Math.PI) / 5, rr = k % 2 ? p.uk * 0.45 : p.uk; ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } ctx.closePath(); ctx.fill(); }
      else ctx.fillRect(-p.uk / 2, -p.uk / 2, p.uk, p.uk * (p.bentuk === "kertas" ? 1.4 : 1));
      ctx.restore();
    }
    ctx.globalAlpha = 1;
    // getar panggung
    const pg = document.getElementById("arenaPanggung");
    if (getarSisa > 0) {
      getarSisa -= 1 / 60;
      const k = getarKuat * Math.max(0, getarSisa) * 10;
      if (pg) pg.style.transform = `translate(${(Math.random() - 0.5) * k}px, ${(Math.random() - 0.5) * k}px)`;
    } else if (pg && pg.style.transform) pg.style.transform = "";
    if (partikel.length || getarSisa > 0) raf = requestAnimationFrame(putar);
  }
  const jalan = () => { if (!raf) raf = requestAnimationFrame(putar); };

  const WOW = {
    // ledakan partikel di titik layar (px), warna boleh array
    ledak(x, y, warna = ["#F2C14E", "#FFFDF6", "#3E78C4"], n = 18, opsi = {}) {
      if (pelan()) return;
      siap();
      const w = Array.isArray(warna) ? warna : [warna];
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2, v = (opsi.kuat || 4) * (0.4 + Math.random());
        partikel.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - (opsi.naik || 1.5), g: opsi.gravitasi ?? 0.18, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4,
          uk: (opsi.ukuran || 6) * (0.6 + Math.random() * 0.8), warna: w[i % w.length], umur: 0, maks: opsi.lama || 0.9 + Math.random() * 0.5, bentuk: opsi.bentuk || (i % 3 === 0 ? "bintang" : "kotak") });
      }
      jalan();
    },
    // hujan konfeti dari atas layar
    hujan(warna = ["#3E78C4", "#F2C14E", "#E58B3A", "#7FD18B", "#FFFDF6"], n = 70) {
      if (pelan()) return;
      siap();
      for (let i = 0; i < n; i++) partikel.push({ x: Math.random() * innerWidth, y: -20 - Math.random() * 200, vx: (Math.random() - 0.5) * 2, vy: 2 + Math.random() * 3, g: 0.04, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3, uk: 7 + Math.random() * 6, warna: warna[i % warna.length], umur: 0, maks: 3 + Math.random() * 1.5, bentuk: "kertas" });
      jalan();
    },
    getar(kuat = 1, lama = 0.25) { if (pelan()) return; getarKuat = Math.max(getarSisa > 0 ? getarKuat : 0, kuat); getarSisa = Math.max(getarSisa, lama); siap(); jalan(); },
    kilat(warna = "rgba(255,253,246,.6)", lama = 180) {
      if (pelan()) return;
      siap();
      const el = lapis.querySelector(".wow-kilat");
      el.style.background = warna; el.style.transition = "none"; el.style.opacity = "1";
      requestAnimationFrame(() => { el.style.transition = `opacity ${lama}ms ease-out`; el.style.opacity = "0"; });
    },
    hp(ms = 30) { if (K.data.setelan.getar === false) return; try { navigator.vibrate?.(ms); } catch { /* tidak apa-apa */ } },
    // tulisan besar melompat di tengah layar
    teks(t, warna = "#F2C14E", sub = "") {
      siap();
      const el = lapis.querySelector(".wow-teks");
      el.innerHTML = `<b style="color:${warna}">${K.esc(t)}</b>${sub ? `<small>${K.esc(sub)}</small>` : ""}`;
      el.classList.remove("muncul"); void el.offsetWidth; el.classList.add("muncul");
    },
    // stiker emote (main berdua): gelembung dengan avatar
    emote(sprite, teks, dariTeman) {
      siap();
      const wadah = lapis.querySelector(".wow-emote");
      const el = document.createElement("div");
      el.className = `wow-gelembung${dariTeman ? " teman" : ""}`;
      el.innerHTML = `<span class="avatar avatar-sm">${K.px(sprite)}</span><b>${K.esc(teks)}</b>`;
      wadah.appendChild(el);
      setTimeout(() => el.remove(), 2600);
    },
    // ubah koordinat logis kanvas game (lebar 360) ke piksel layar
    dariKanvas(kanvas, x, y) {
      const r = kanvas.getBoundingClientRect(), s = r.width / 360;
      return { x: r.left + x * s, y: r.top + y * s };
    },
  };
  K.WOW = WOW;
})();
