/* =========================================================
   Memasang skala perasaan ke tempatnya masing-masing.
   ========================================================= */
(() => {
  "use strict";
  const K = window.KLP;
  const { $, esc, px, sfx, memo, NAMA } = K;
  const S = K.skala;

  /* ---------- Loket A: Tarik Senyum menggantikan slider ---------- */
  const slider = $("#capek");
  const wajah = S.senyum($("#skalaSenyum"), {
    onUbah(lv) {
      if (Number(slider.value) === lv) return;
      slider.value = lv;
      slider.dispatchEvent(new Event("input"));
    },
  });
  const C_DARI_LEVEL = { 1: 0.8, 2: 0.4, 3: 0, 4: -0.4, 5: -0.8 };
  K.on("layar", (id) => { if (id === "s-a-form") wajah.atur(C_DARI_LEVEL[Number(slider.value)] ?? 0); });

  /* ---------- Loket B: Timbangan Kantor ---------- */
  const timbang = S.timbangan($("#skalaTimbang"), {
    onUbah(lv, info) { K.skalaNilai.B = { level: lv, total: info.total, dipakai: info.isi.length > 0 }; },
  });
  K.skalaNilai.B = { level: 3, total: 0, dipakai: false };
  void timbang;

  /* ---------- Loket C: Pukul Kok ---------- */
  S.kok($("#skalaKok"), { onUbah(lv) { K.skalaNilai.C = lv; } });

  /* ---------- Lobi: Absen Perasaan (Gelas Teh) ---------- */
  const SARAN_GAME = { 1: "kertas", 2: "kertas", 3: "stempel", 4: "rally", 5: "rally" };
  const NAMA_GAME = { kertas: "Tangkap Kertas Terbang", stempel: "Stempel Kilat", rally: "Rally vs Pak Satpam", ngemil: "Ngemil Diam-diam di Rapat" };
  K.NAMA_GAME = NAMA_GAME;

  K.sapaLobi = (absen, waktu) => {
    if (!absen) return null;
    const lv = absen.level;
    if (lv <= 2) return ["ratna", `Baterainya tipis ya, ${NAMA}. Duduk sini dulu. Tehnya saya tuangin, yang anget. Nggak usah ke mana-mana kalau nggak mau.`];
    if (lv === 3) return ["dimas", `SELAMAT ${waktu.toUpperCase()}— eh, selamat ${waktu}, ${NAMA}! Baterai setengah itu normal kok. Saya juga. *saya malah 12%.`];
    return ["satpam", `Siap. Tenaga Anda terdeteksi tinggi, ${NAMA}. Saya tantang rally di Ruang Istirahat. Saya tidak akan mengalah. Mungkin sedikit.`];
  };

  K.pengumuman.push(() => {
    const a = K.data.absen;
    if (a && a.tgl === K.hariIni()) return null;
    return { dari: "Bu Ratna", sprite: "kapibara", teks: "Absen perasaan hari ini belum diisi. Tidak wajib, tapi gelasnya sudah saya cuci." };
  });

  function isiAbsen() {
    const slot = $("#absenSlot");
    const a = K.data.absen && K.data.absen.tgl === K.hariIni() ? K.data.absen : null;
    if (a && !slot.dataset.ukurUlang) {
      const game = SARAN_GAME[a.level];
      slot.innerHTML = `
        <section class="absen-box absen-selesai">
          <h3 class="papan-judul">Absen Perasaan · sudah diisi</h3>
          <div class="absen-ringkas">
            <div class="mini-gelas" aria-hidden="true"><span style="height:${Math.round(a.persen)}%"></span></div>
            <p>Baterai hari ini: <strong>${Math.round(a.persen)}%</strong>.<br>
            Saran kantor: main <strong>${esc(NAMA_GAME[game])}</strong> di Lantai 2.</p>
          </div>
          <div class="actions">
            <button class="btn ghost" type="button" id="absenUlang">Ukur ulang</button>
            <button class="btn" type="button" data-ke="s-istirahat">Ke Ruang Istirahat →</button>
          </div>
        </section>`;
      $("#absenUlang").addEventListener("click", () => { slot.dataset.ukurUlang = "1"; isiAbsen(); });
      return;
    }
    slot.innerHTML = `
      <section class="absen-box">
        <h3 class="papan-judul">Absen Perasaan Harian</h3>
        <p class="muted small">Isi gelas sesuai isi baterai Anda hari ini. Jujur saja, gelasnya tidak menilai.</p>
        <div id="skalaTeh"></div>
        <div class="actions"><button class="btn primary" type="button" id="catatAbsen" disabled>Catat absen</button></div>
      </section>`;
    const gelas = S.teh($("#skalaTeh"), { onUbah(lv) { $("#catatAbsen").disabled = lv === 0; } });
    $("#catatAbsen").addEventListener("click", () => {
      const pertamaHariIni = !(K.data.absen && K.data.absen.tgl === K.hariIni());
      K.data.absen = { tgl: K.hariIni(), level: gelas.level, persen: gelas.persen, saranGame: SARAN_GAME[gelas.level] };
      K.simpan();
      delete slot.dataset.ukurUlang;
      sfx("stempel");
      K.catat("absen");
      if (pertamaHariIni) {
        K.tambahPoin(5);
        memo("Bu Ratna · Loket A", "Absen tercatat ya. Poin Sabar +5. Gelasnya biar saya yang cuci.");
      } else {
        memo("Bu Ratna · Loket A", "Absennya saya perbarui ya. Perasaan memang boleh berubah dalam sehari.");
      }
      K.segarkanLobi();
    });
  }
  const isiLobiAsli = K.saatMasuk["s-lobi"];
  K.saatMasuk["s-lobi"] = () => { isiLobiAsli(); isiAbsen(); };
  if (K.layarAktif() === "s-lobi") K.saatMasuk["s-lobi"]();
})();
