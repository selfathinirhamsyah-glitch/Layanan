/* =========================================================
   Kantor Layanan Perasaan · Jaringan main berdua (dua HP)
   Sambungan langsung antar-HP (WebRTC) lewat PeerJS.
   Satu HP membuat room (tuan rumah, menjalankan permainan),
   HP lain bergabung pakai kode (tamu, mengirim gerakan).
   Server perantara bawaan: PeerJS cloud (0.peerjs.com).
   Untuk pengujian: ?peer=localhost:9000
   ========================================================= */
(() => {
  "use strict";
  const K = window.KLP;
  const SRC = "vendor/peerjs.min.js";
  const AWALAN = "kantor-layanan-perasaan-";
  const HURUF = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

  let janji = null;
  function muatPustaka() {
    if (window.Peer) return Promise.resolve(true);
    if (!janji) janji = new Promise((res) => {
      const s = document.createElement("script");
      s.src = SRC; s.async = true;
      s.onload = () => res(!!window.Peer);
      s.onerror = () => { janji = null; res(false); };
      document.head.appendChild(s);
    });
    return janji;
  }
  function opsiPeer() {
    const q = new URLSearchParams(location.search).get("peer");
    const ice = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }, { urls: "stun:stun.cloudflare.com:3478" }] };
    if (q) { const [host, port] = q.split(":"); return { host, port: Number(port) || 9000, path: "/", secure: location.protocol === "https:" && host !== "localhost", config: ice, debug: 0 }; }
    return { config: ice, debug: 0 };
  }
  const buatKode = () => Array.from({ length: 5 }, () => HURUF[Math.floor(Math.random() * HURUF.length)]).join("");

  /* ---------- objek koneksi ---------- */
  const pendengar = {};
  const BATAS = 4000;            // karakter per potongan (aman walau semuanya huruf multi-byte)
  let nomorPotong = 0;
  const potongan = new Map();
  const NET = {
    aktif: false, peran: null, kode: null, teman: null, ping: 0, peer: null, conn: null,
    on(t, fn) { (pendengar[t] ||= new Set()).add(fn); return () => pendengar[t].delete(fn); },
    kirim(o) {
      try {
        if (!NET.conn || !NET.conn.open) return;
        // saluran JSON PeerJS menolak pesan > ~16 KB: potong jadi beberapa bagian
        const teks = JSON.stringify(o);
        if (teks.length <= BATAS) { NET.conn.send(o); return; }
        const id = ++nomorPotong, n = Math.ceil(teks.length / BATAS);
        for (let i = 0; i < n; i++) NET.conn.send({ t: "_p", id, i, n, d: teks.slice(i * BATAS, (i + 1) * BATAS) });
      } catch { /* tidak apa-apa */ }
    },
    tutup(alasan) {
      clearInterval(NET._detak);
      try { NET.conn?.close(); } catch { /* */ }
      try { NET.peer?.destroy(); } catch { /* */ }
      const tadi = NET.aktif;
      Object.assign(NET, { aktif: false, peran: null, kode: null, teman: null, peer: null, conn: null });
      if (tadi) pancar("putus", { alasan });
    },
  };
  function pancar(t, data) { (pendengar[t] || []).forEach((fn) => { try { fn(data); } catch (e) { console.error(e); } }); (pendengar["*"] || []).forEach((fn) => { try { fn({ t, ...data }); } catch (e) { console.error(e); } }); }

  function pasangKoneksi(conn, profil) {
    NET.conn = conn;
    conn.on("data", (o) => {
      if (!o || typeof o !== "object" || typeof o.t !== "string") return;
      if (o.t === "_p") {
        NET._terakhir = performance.now();
        const n = Math.min(400, o.n | 0);
        let p = potongan.get(o.id);
        if (!p) { p = { n, ada: 0, d: [] }; potongan.set(o.id, p); if (potongan.size > 8) potongan.delete(potongan.keys().next().value); }
        if (typeof o.d === "string" && p.d[o.i] === undefined) { p.d[o.i] = o.d; p.ada++; }
        if (p.ada < p.n) return;
        potongan.delete(o.id);
        try { o = JSON.parse(p.d.join("")); } catch { return; }
        if (!o || typeof o !== "object" || typeof o.t !== "string" || o.t === "_p") return;
      }
      if (o.t === "ping") { NET.kirim({ t: "pong", w: o.w }); return; }
      if (o.t === "pong") { NET.ping = Math.round(performance.now() - o.w); NET._terakhir = performance.now(); return; }
      NET._terakhir = performance.now();
      if (o.t === "halo") { NET.teman = { nama: String(o.nama || "Teman").slice(0, 12), sprite: String(o.sprite || "marmut").slice(0, 20), kendaraan: String(o.kendaraan || "").slice(0, 12), hero: String(o.hero || "").slice(0, 12) }; NET.aktif = true; pancar("terhubung", NET.teman); return; }
      pancar(o.t, o);
    });
    conn.on("open", () => { NET._terakhir = performance.now(); NET.kirim({ t: "halo", ...profil }); });
    conn.on("close", () => NET.tutup("teman keluar"));
    conn.on("error", (e) => { if (e?.type === "message-too-big") return; NET.tutup("koneksi bermasalah"); });
    clearInterval(NET._detak);
    NET._detak = setInterval(() => {
      NET.kirim({ t: "ping", w: performance.now() });
      if (NET.aktif && performance.now() - (NET._terakhir || 0) > 9000) NET.tutup("sinyal hilang");
    }, 1500);
  }

  // tuan rumah: buat room, tunggu satu teman
  NET.buatRoom = async (profil, onKode) => {
    if (!(await muatPustaka())) throw new Error("pustaka");
    NET.tutup();
    for (let coba = 0; coba < 4; coba++) {
      const kode = buatKode();
      const hasil = await new Promise((res) => {
        const peer = new window.Peer(AWALAN + kode.toLowerCase(), opsiPeer());
        const t = setTimeout(() => { peer.destroy(); res({ gagal: "server" }); }, 15000);
        peer.on("open", () => { clearTimeout(t); res({ peer }); });
        peer.on("error", (e) => { clearTimeout(t); peer.destroy(); res({ gagal: e.type === "unavailable-id" ? "dipakai" : "server" }); });
      });
      if (hasil.gagal === "dipakai") continue;
      if (hasil.gagal) throw new Error(hasil.gagal);
      NET.peer = hasil.peer; NET.peran = "host"; NET.kode = kode;
      onKode?.(kode);
      hasil.peer.on("connection", (conn) => {
        if (NET.conn && NET.conn.open) { conn.on("open", () => { conn.send({ t: "penuh" }); setTimeout(() => conn.close(), 300); }); return; }
        pasangKoneksi(conn, profil);
      });
      hasil.peer.on("disconnected", () => { try { hasil.peer.reconnect(); } catch { /* */ } });
      return kode;
    }
    throw new Error("server");
  };
  // tamu: gabung pakai kode
  NET.gabung = async (kode, profil) => {
    if (!(await muatPustaka())) throw new Error("pustaka");
    NET.tutup();
    kode = String(kode || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 5);
    return new Promise((res, rej) => {
      const peer = new window.Peer(opsiPeer());
      NET.peer = peer; NET.peran = "tamu"; NET.kode = kode;
      const t = setTimeout(() => { rej(new Error("waktu")); NET.tutup(); }, 20000);
      peer.on("error", (e) => { clearTimeout(t); rej(new Error(e.type === "peer-unavailable" ? "tidak-ada" : "server")); NET.tutup(); });
      peer.on("open", () => {
        const conn = peer.connect(AWALAN + kode.toLowerCase(), { reliable: true, serialization: "json" });
        pasangKoneksi(conn, profil);
        const lepas = NET.on("terhubung", () => { clearTimeout(t); lepas(); res(NET.teman); });
        const lepasPenuh = NET.on("penuh", () => { clearTimeout(t); lepasPenuh(); rej(new Error("penuh")); NET.tutup(); });
      });
    });
  };

  K.NET = NET;
})();
