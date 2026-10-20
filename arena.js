/* =========================================================
   Kantor Layanan Perasaan · Mesin arena bersama
   Dipakai "Legenda Lantai 2" (moba.js) dan "Kantor Royale" (royale.js):
   joystick virtual + tombol aksi dengan cooldown, papan ketik,
   tabrakan dengan rintangan kotak, garis pandang, tampilan 2D
   dari atas (cadangan kalau 3D tidak tersedia), dan HUD bersama.
   Koordinat dunia: x ke kanan, z ke bawah layar.
   ========================================================= */
(() => {
  "use strict";
  const K = window.KLP;
  const batas = (v, a, b) => Math.max(a, Math.min(b, v));

  /* ---------- kendali sentuh: joystick kiri, tombol kanan ---------- */
  // tombol: [{ id, dx, dy, r, label, ikon }] — dx/dy diukur dari pojok kanan bawah (satuan logis)
  function kendali(api, tombol) {
    const kanvas = api.ctx.canvas;
    const st = { gerak: { x: 0, z: 0 }, tahan: {}, cd: {}, cdMaks: {}, nonaktif: {}, label: {}, aktif: true };
    const antre = [];
    let joy = null;                                  // { id, ox, oy, x, y }
    const pegang = new Map();                        // pointerId -> id tombol
    const titik = (e) => { const r = kanvas.getBoundingClientRect(); const s = r.width / api.W(); return { x: (e.clientX - r.left) / s, y: (e.clientY - r.top) / s }; };
    const posTombol = (t) => ({ x: api.W() - t.dx, y: api.H() - t.dy });
    function kenaTombol(p) {
      for (const t of tombol) { const q = posTombol(t); if ((p.x - q.x) ** 2 + (p.y - q.y) ** 2 < (t.r + 8) ** 2) return t; }
      return null;
    }
    const turun = (e) => {
      e.preventDefault();
      if (!st.aktif) return;
      const p = titik(e), t = kenaTombol(p);
      try { kanvas.setPointerCapture(e.pointerId); } catch { /* tidak apa-apa */ }
      if (t) { pegang.set(e.pointerId, t.id); st.tahan[t.id] = true; antre.push(t.id); return; }
      if (p.x < api.W() * 0.6 && !joy) { joy = { id: e.pointerId, ox: p.x, oy: p.y, x: p.x, y: p.y }; }
    };
    const geser = (e) => {
      if (joy && e.pointerId === joy.id) {
        const p = titik(e); joy.x = p.x; joy.y = p.y;
        const dx = p.x - joy.ox, dy = p.y - joy.oy, l = Math.hypot(dx, dy), R = 46;
        if (l > R) { joy.ox = p.x - (dx / l) * R; joy.oy = p.y - (dy / l) * R; }
        const m = Math.min(1, l / R);
        st.gerak.x = l ? (dx / l) * m : 0; st.gerak.z = l ? (dy / l) * m : 0;
      }
    };
    const naik = (e) => {
      if (joy && e.pointerId === joy.id) { joy = null; st.gerak.x = st.gerak.z = 0; }
      const id = pegang.get(e.pointerId);
      if (id) { pegang.delete(e.pointerId); if (![...pegang.values()].includes(id)) st.tahan[id] = false; }
    };
    kanvas.addEventListener("pointerdown", turun);
    kanvas.addEventListener("pointermove", geser);
    kanvas.addEventListener("pointerup", naik);
    kanvas.addEventListener("pointercancel", naik);
    // papan ketik: WASD/panah bergerak, tombol lain dipetakan
    const kb = {};
    const PETA = { j: 0, " ": 0, k: 1, "1": 1, l: 2, "2": 2, i: 3, "3": 3, u: 4, "4": 4, o: 5, "5": 5, p: 6, "6": 6 };
    const aturKb = () => {
      if (joy) return;
      const x = (kb.d || kb.arrowright ? 1 : 0) - (kb.a || kb.arrowleft ? 1 : 0);
      const z = (kb.s || kb.arrowdown ? 1 : 0) - (kb.w || kb.arrowup ? 1 : 0);
      const l = Math.hypot(x, z) || 1;
      st.gerak.x = x / l; st.gerak.z = z / l;
    };
    const kd = (e) => {
      const k = e.key.toLowerCase();
      if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(k)) { e.preventDefault(); kb[k] = true; aturKb(); return; }
      const i = PETA[k];
      if (i !== undefined && tombol[i] && !e.repeat) { e.preventDefault(); st.tahan[tombol[i].id] = true; antre.push(tombol[i].id); }
    };
    const ku = (e) => {
      const k = e.key.toLowerCase();
      if (k in kb) { kb[k] = false; aturKb(); return; }
      const i = PETA[k];
      if (i !== undefined && tombol[i]) st.tahan[tombol[i].id] = false;
    };
    addEventListener("keydown", kd); addEventListener("keyup", ku);

    st.ambil = () => antre.splice(0);
    st.hapus = () => {
      kanvas.removeEventListener("pointerdown", turun); kanvas.removeEventListener("pointermove", geser);
      kanvas.removeEventListener("pointerup", naik); kanvas.removeEventListener("pointercancel", naik);
      removeEventListener("keydown", kd); removeEventListener("keyup", ku);
    };
    st.gambar = (ctx) => {
      // joystick
      const jx = joy ? joy.ox : 70, jy = joy ? joy.oy : api.H() - 80;
      ctx.globalAlpha = joy ? 0.85 : 0.45;
      ctx.beginPath(); ctx.arc(jx, jy, 46, 0, 7); ctx.fillStyle = "rgba(43,42,38,.35)"; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = "rgba(255,253,246,.7)"; ctx.stroke();
      ctx.beginPath(); ctx.arc(joy ? joy.x : jx, joy ? joy.y : jy, 20, 0, 7); ctx.fillStyle = "rgba(255,253,246,.85)"; ctx.fill();
      ctx.globalAlpha = 1;
      // tombol aksi
      for (const t of tombol) {
        const q = posTombol(t), cd = st.cd[t.id] || 0, mati = st.nonaktif[t.id];
        ctx.beginPath(); ctx.arc(q.x, q.y, t.r, 0, 7);
        ctx.fillStyle = st.tahan[t.id] ? "rgba(242,193,78,.85)" : mati ? "rgba(43,42,38,.35)" : "rgba(43,42,38,.6)"; ctx.fill();
        ctx.lineWidth = 3; ctx.strokeStyle = t.warna || "rgba(255,253,246,.8)"; ctx.stroke();
        if (t.ikon) { const i = api.alat.sp(t.ikon); if (i.complete) { ctx.globalAlpha = mati ? 0.4 : 1; const u = t.r * 1.05; ctx.drawImage(i, q.x - u / 2, q.y - u / 2 - (t.label ? 4 : 0), u, u); ctx.globalAlpha = 1; } }
        const lbl = st.label[t.id] ?? t.label;
        if (lbl) { ctx.font = `${t.r > 30 ? 11 : 9}px "Pixelify Sans", monospace`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = "#FFFDF6"; ctx.fillText(lbl, q.x, q.y + (t.ikon ? t.r * 0.62 : 0)); }
        if (cd > 0) {
          const f = cd / (st.cdMaks[t.id] || 1);
          ctx.beginPath(); ctx.moveTo(q.x, q.y); ctx.arc(q.x, q.y, t.r, -Math.PI / 2, -Math.PI / 2 + f * Math.PI * 2); ctx.closePath();
          ctx.fillStyle = "rgba(10,10,14,.6)"; ctx.fill();
          ctx.font = '14px "Pixelify Sans", monospace'; ctx.fillStyle = "#FFFDF6"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(Math.ceil(cd), q.x, q.y);
        }
      }
    };
    return st;
  }

  /* ---------- geometri ---------- */
  // dorong lingkaran (x,z,r) keluar dari kotak-kotak rintangan
  function tabrakKotak(e, kotak) {
    for (const b of kotak) {
      if (b.tembus) continue;
      const hx = b.w / 2, hz = b.d / 2;
      const cx = batas(e.x, b.x - hx, b.x + hx), cz = batas(e.z, b.z - hz, b.z + hz);
      const dx = e.x - cx, dz = e.z - cz, d2 = dx * dx + dz * dz;
      if (d2 < e.r * e.r) {
        if (d2 > 1e-6) { const d = Math.sqrt(d2); e.x = cx + (dx / d) * e.r; e.z = cz + (dz / d) * e.r; }
        else { // di dalam kotak: keluar lewat sisi terdekat
          const kiri = e.x - (b.x - hx), kanan = b.x + hx - e.x, atas = e.z - (b.z - hz), bawah = b.z + hz - e.z;
          const m = Math.min(kiri, kanan, atas, bawah);
          if (m === kiri) e.x = b.x - hx - e.r; else if (m === kanan) e.x = b.x + hx + e.r; else if (m === atas) e.z = b.z - hz - e.r; else e.z = b.z + hz + e.r;
        }
      }
    }
  }
  // apakah garis a→b terhalang kotak (untuk peluru & penglihatan)
  function terhalang(ax, az, bx, bz, kotak) {
    for (const b of kotak) {
      if (b.tembus || b.rendah) continue;
      const x0 = b.x - b.w / 2, x1 = b.x + b.w / 2, z0 = b.z - b.d / 2, z1 = b.z + b.d / 2;
      let t0 = 0, t1 = 1;
      const dx = bx - ax, dz = bz - az;
      const uji = (p, q) => { if (p === 0) return q >= 0; const r = q / p; if (p < 0) { if (r > t1) return false; if (r > t0) t0 = r; } else { if (r < t0) return false; if (r < t1) t1 = r; } return true; };
      if (uji(-dx, ax - x0) && uji(dx, x1 - ax) && uji(-dz, az - z0) && uji(dz, z1 - az) && t0 <= t1) return true;
    }
    return false;
  }
  const diSemak = (e, semak) => semak.some((s) => Math.abs(e.x - s.x) < s.w / 2 && Math.abs(e.z - s.z) < s.d / 2);

  /* ---------- tampilan 2D dari atas (cadangan) ---------- */
  function render2D(api, dunia) {
    const ctx = api.ctx;
    const S = () => api.W() / (dunia.lebarPandang || 22);
    let fx = 0, fz = 0;
    const ke = (x, z) => ({ x: api.W() / 2 + (x - fx) * S(), y: api.H() * 0.55 + (z - fz) * S() });
    return {
      proyeksi: (x, y, z) => { const p = ke(x, z); return { x: p.x, y: p.y - y * S() * 0.6 }; },
      gambar(st) {
        fx = st.fokus.x; fz = st.fokus.z;
        const W = api.W(), H = api.H(), s = S();
        ctx.fillStyle = dunia.warnaLuar || "#6E9A5C"; ctx.fillRect(0, 0, W, H);
        const kiriAtas = ke(dunia.x0, dunia.z0);
        ctx.fillStyle = dunia.warnaTanah; ctx.fillRect(kiriAtas.x, kiriAtas.y, (dunia.x1 - dunia.x0) * s, (dunia.z1 - dunia.z0) * s);
        for (const l of dunia.lantai || []) { const p = ke(l.x - l.w / 2, l.z - l.d / 2); ctx.fillStyle = l.warna; ctx.fillRect(p.x, p.y, l.w * s, l.d * s); }
        if (st.zona) {
          const c = ke(st.zona.x, st.zona.z);
          ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.arc(c.x, c.y, st.zona.r * s, 0, 7, true); ctx.fillStyle = "rgba(127,152,220,.35)"; ctx.fill("evenodd"); ctx.restore();
          ctx.beginPath(); ctx.arc(c.x, c.y, st.zona.r * s, 0, 7); ctx.strokeStyle = "#7FB2D9"; ctx.lineWidth = 3; ctx.stroke();
        }
        for (const b of dunia.rintangan) {
          const p = ke(b.x - b.w / 2, b.z - b.d / 2);
          if (p.x > W || p.y > H || p.x + b.w * s < 0 || p.y + b.d * s < 0) continue;
          ctx.fillStyle = b.warna; ctx.fillRect(p.x, p.y, b.w * s, b.d * s);
          if (!b.tembus) { ctx.strokeStyle = "#2B2A26"; ctx.lineWidth = 2; ctx.strokeRect(p.x, p.y, b.w * s, b.d * s); }
        }
        for (const ef of st.efek || []) { const p = ke(ef.x, ef.z); ctx.globalAlpha = Math.max(0, 1 - ef.umur / ef.maks); ctx.beginPath(); ctx.arc(p.x, p.y, ef.r * s * (0.4 + 0.6 * ef.umur / ef.maks), 0, 7); ctx.strokeStyle = ef.warna; ctx.lineWidth = 3; ctx.stroke(); ctx.globalAlpha = 1; }
        const urut = st.entitas.slice().sort((a, b) => a.z - b.z);
        for (const e of urut) {
          if (e.tersembunyi) continue;
          const p = ke(e.x, e.z), r = (e.r || 0.6) * s;
          ctx.globalAlpha = e.transparan ? 0.45 : 1;
          if (e.jenis === "menara" || e.jenis === "inti") {
            ctx.fillStyle = e.warna; ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, 7); ctx.fill(); ctx.strokeStyle = "#2B2A26"; ctx.lineWidth = 3; ctx.stroke();
            ctx.fillStyle = "#FFFDF6"; ctx.beginPath(); ctx.arc(p.x, p.y, r * 0.45, 0, 7); ctx.fill();
          } else if (e.jenis === "peti") {
            ctx.fillStyle = "#C9A06A"; ctx.fillRect(p.x - r, p.y - r * 0.8, r * 2, r * 1.6); ctx.strokeStyle = "#2B2A26"; ctx.lineWidth = 2; ctx.strokeRect(p.x - r, p.y - r * 0.8, r * 2, r * 1.6);
          } else {
            if (e.warna) { ctx.beginPath(); ctx.ellipse(p.x, p.y + r * 0.2, r, r * 0.6, 0, 0, 7); ctx.fillStyle = e.warna; ctx.fill(); }
            if (e.sprite) { const i = api.alat.sp(e.sprite); const u = r * 2.2 * (e.skala || 1); if (i.complete) ctx.drawImage(i, p.x - u / 2, p.y - u * 0.85 - (e.tinggi || 0) * s * 0.6, u, u); }
            if (e.payung) { ctx.fillStyle = "#B5443A"; ctx.beginPath(); ctx.arc(p.x, p.y - r * 2.4 - (e.tinggi || 0) * s * 0.6, r * 1.3, Math.PI, 0); ctx.fill(); }
          }
          ctx.globalAlpha = 1;
        }
        for (const q of st.proyektil || []) { const p = ke(q.x, q.z); ctx.fillStyle = q.warna; ctx.beginPath(); ctx.arc(p.x, p.y, (q.r || 0.25) * s, 0, 7); ctx.fill(); }
        if (st.pesawat) { const p = ke(st.pesawat.x, st.pesawat.z); ctx.fillStyle = "#FFFDF6"; ctx.beginPath(); ctx.moveTo(p.x + 18, p.y); ctx.lineTo(p.x - 14, p.y - 12); ctx.lineTo(p.x - 8, p.y); ctx.lineTo(p.x - 14, p.y + 12); ctx.closePath(); ctx.fill(); ctx.strokeStyle = "#2B2A26"; ctx.stroke(); }
      },
      ukur() {}, hapus() {},
    };
  }

  /* ---------- HUD bersama ---------- */
  function teks(ctx, t, x, y, uk, warna = "#FFFDF6", rata = "center") {
    ctx.font = `${uk}px "Pixelify Sans", monospace`; ctx.textAlign = rata; ctx.textBaseline = "middle";
    ctx.lineWidth = Math.max(2, uk / 5); ctx.strokeStyle = "#2B2A26"; ctx.strokeText(t, x, y);
    ctx.fillStyle = warna; ctx.fillText(t, x, y);
  }
  function barHp(ctx, p, lebar, hp, maks, warna, nama, tingkat) {
    const x = p.x - lebar / 2, y = p.y;
    ctx.fillStyle = "rgba(20,20,24,.75)"; ctx.fillRect(x - 1, y - 1, lebar + 2, 7);
    ctx.fillStyle = warna; ctx.fillRect(x, y, lebar * batas(hp / maks, 0, 1), 5);
    if (tingkat) { ctx.fillStyle = "#2B2A26"; ctx.fillRect(x - 13, y - 3, 12, 11); ctx.font = '9px "Pixelify Sans", monospace'; ctx.fillStyle = "#F2C14E"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(tingkat, x - 7, y + 2.5); }
    if (nama) teks(ctx, nama, p.x, y - 8, 9, "#FFFDF6");
  }
  // umpan berita (kill feed) di kanan atas
  function umpan() {
    const daftar = [];
    return {
      tambah(t, warna = "#FFFDF6") { daftar.unshift({ t, warna, umur: 0 }); if (daftar.length > 4) daftar.pop(); },
      gambar(ctx, W, y0, dt) {
        for (let i = daftar.length - 1; i >= 0; i--) { daftar[i].umur += dt; if (daftar[i].umur > 5) daftar.splice(i, 1); }
        daftar.forEach((d, i) => {
          ctx.globalAlpha = Math.min(1, 5 - d.umur);
          ctx.font = '10px "Pixelify Sans", monospace';
          const w = ctx.measureText(d.t).width + 12;
          ctx.fillStyle = "rgba(20,20,24,.7)"; ctx.fillRect(W - w - 6, y0 + i * 18, w, 16);
          ctx.fillStyle = d.warna; ctx.textAlign = "right"; ctx.textBaseline = "middle"; ctx.fillText(d.t, W - 12, y0 + i * 18 + 8);
          ctx.globalAlpha = 1;
        });
      },
    };
  }
  // pengumuman besar di tengah (Double Kill, dst.)
  function pengumum() {
    let t = "", sub = "", umur = 9, warna = "#F2C14E";
    return {
      umumkan(a, b = "", w = "#F2C14E") { t = a; sub = b; umur = 0; warna = w; },
      gambar(ctx, W, H, dt) {
        umur += dt;
        if (umur > 2) return;
        ctx.globalAlpha = Math.min(1, 2 - umur) ;
        const sk = 1 + Math.max(0, 0.25 - umur) * 2;
        ctx.save(); ctx.translate(W / 2, H * 0.3); ctx.scale(sk, sk);
        ctx.fillStyle = "rgba(20,20,24,.6)"; ctx.fillRect(-W / 2, -24, W, sub ? 52 : 40);
        teks(ctx, t, 0, -4, 24, warna);
        if (sub) teks(ctx, sub, 0, 18, 11, "#FFFDF6");
        ctx.restore(); ctx.globalAlpha = 1;
      },
    };
  }

  K.ARENA = { kendali, tabrakKotak, terhalang, diSemak, render2D, teks, barHp, umpan, pengumum, batas };
})();
