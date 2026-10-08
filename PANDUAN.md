# Panduan Kantor Layanan Perasaan

Panduan ini untuk kamu, orang yang menyiapkan website ini untuk Mira. Bagian 1–3 cukup untuk mulai. Sisanya dibaca kalau perlu.

---

## 1. Meng-online-kan website

Website ini tidak butuh build, server, atau API key. Semua filenya sudah siap di branch `main`.

### Pilihan A · Netlify Drop (paling cepat, tanpa akun GitHub)
1. Unduh repo sebagai ZIP: di GitHub, buka repo → tombol **Code** → **Download ZIP**, lalu ekstrak.
2. Buka **app.netlify.com/drop** (login kalau diminta).
3. Seret **folder hasil ekstrak** (yang berisi `index.html`) ke halaman itu.
4. Tunggu beberapa detik. Kamu akan dapat link seperti `https://nama-acak.netlify.app`.
5. Opsional: di **Site settings → Change site name**, ganti jadi nama yang lebih manis, misalnya `kantor-mira`.

### Pilihan B · Netlify atau Vercel dari GitHub (otomatis ikut ter-update)
1. Login ke Netlify atau Vercel pakai akun GitHub.
2. **Add new site / Add New Project** → pilih repo `Layanan`.
3. Isi pengaturannya:
   - Branch: `main`
   - Build command: **kosongkan**
   - Publish / Output directory: **kosongkan** (atau `.`)
   - Vercel: Framework preset pilih **Other**
4. Deploy. Setiap ada perubahan baru di `main`, website-nya ikut berubah sendiri.

### Cek setelah online
Buka link-nya di HP kamu sendiri dan pastikan:
- Halaman depan muncul dengan font pixel. Kalau font-nya terlihat biasa, tunggu sebentar atau muat ulang.
- Unduh satu dokumen, misalnya sertifikat kompensasi di Loket A. Kalau berhasil, berarti html2canvas dari cdnjs sudah termuat.

---

## 2. Mengirim ke Mira

Nama "Mira" sudah jadi nama bawaan, jadi link biasa sudah cukup:

```
https://kantor-mira.netlify.app/
```

Kalau suatu saat mau dipakai untuk orang lain, tambahkan `?nama=` di akhir link:

```
https://kantor-mira.netlify.app/?nama=Dina
```

Di dalam website sudah ada **Buku Panduan Pegawai Baru** (tombol *Panduan* di pojok kanan atas). Pak Satpam juga menawarkannya saat Mira pertama kali masuk lobi, jadi kamu tidak perlu menjelaskan cara pakainya.

**Saran saat mengirim:**
- Tidak perlu dijelaskan panjang. Cukup misalnya: "Ada kantor yang mau nerima keluhan kamu. Buka pas lagi senggang ya."
- Paling enak dibuka di HP. Di Chrome atau Safari, Mira bisa memilih **Tambahkan ke Layar Utama** supaya website-nya muncul seperti aplikasi.
- Bab misteri terbuka satu per hari, jadi ada alasan untuk kembali. Biarkan Mira menemukannya sendiri.

---

## 3. Tur singkat

Navigasi utamanya adalah **panel tombol lift** di bawah layar. Panel ini muncul setelah Mira masuk lewat halaman depan.

| Tombol | Ruangan | Isinya |
|---|---|---|
| **L** | Lobi | Sapaan petugas, pengumuman kantor, absen perasaan (Gelas Teh), denah gedung, Papan Pegawai, berkas misteri (Lantai 13 + Kasus Lift Tengah Malam) |
| **1** | Loket | Loket A (keluhan), B (kabar baik), C (semangat), D (tersembunyi, muncul kalau Mira ragu-ragu ±10 detik) |
| **2** | Rehat | 5 mini game (termasuk Balap Troli Arsip), Poin Sabar, papan Pegawai Teladan |
| **3** | Pantry | Ngobrol dengan 5 karakter (ada mode "dengerin aja") dan papan gosip |
| **4** | Kopkar | Koperasi: belanja barang absurd pakai Poin Sabar, struk bisa diunduh |
| **5** | Meja | Meja Kerja Mira: koleksi barang, barang langka, buku rekor |
| **▒ → 13** | Rahasia | Terbuka setelah Misteri Lantai 13 tamat |

### Cara mendapat Poin Sabar
- Main game (paling banyak)
- Absen perasaan di lobi (+5, sekali sehari)
- Menyelesaikan satu topik obrolan di Pantry pertama kali (+3)
- Menyelesaikan satu bab misteri (+25)
- Beban pikiran yang berkurang sesudah main game (bonus dari Dimas)

### Skala perasaan dan pengaruhnya
| Skala | Letak | Mengubah |
|---|---|---|
| Tarik Senyum | Loket A | Balasan Bu Ratna dan saran kompensasi |
| Gelas Teh | Lobi (absen) | Siapa yang menyapa (Bu Ratna / Dimas / Pak Satpam) dan game yang disarankan |
| Pukul Kok | Loket C, pemanasan Rally | Isi Izin Hebat, tips Kak Badak, kecepatan awal rally |
| Timbangan | Loket B | Pengumuman Pak Singa, jumlah konfeti, isi piagam |
| Bulu Berdiri Oyen | Setelah kejutan di misteri | Tanggapan Formulir Laporan Kaget |
| Tumpukan Berkas Dimas | Sebelum & sesudah game | Bonus Poin Sabar |

---

## 4. Radio Kantor (suara & kejutan)

Tombol **Radio** ada di pojok kanan atas.

- **Kenop volume** bisa diputar dengan jari atau dengan mengetuk nama stasiunnya:
  Mode Perpustakaan (bisu) · Bisik-bisik · **Volume Rapat** (bawaan) · Volume Kantin · Volume Pak Singa
- **Tuas Mode Kaget**: kalau dimatikan, semua kejutan di misteri muncul pelan-pelan dengan keterangan "(seharusnya ini mengagetkan)".
- Setelah kejutan pertama, Oyen bertanya apakah Mira bersedia dikagetkan lagi. Jawabannya langsung mengubah tuas ini.
- **Saklar Lampu Lorong** (tingkat seram cerita detektif):
  - **Seram-lucu** (bawaan): bisikan dan lampu berkedip sesekali, cepat dibalas lelucon.
  - **Lebih tegang**: ruangan lebih gelap, bisikan lebih sering, dan ada jeda gelap + detak jantung sebelum kejutan.
  - Dua-duanya tetap tanpa darah, wajah seram, teriakan menakutkan, atau hantu sungguhan. "Hantunya" selalu ternyata kain pel, radio, atau pegawai kantor.
- Kalau HP diatur untuk mengurangi gerakan (*reduce motion*), animasi dan kejutan otomatis diperhalus.

---

## 5. Misteri Lantai 13 & Kasus Lift Tengah Malam

Adventure point-and-click detektif. Masuknya lewat kartu **"Berkas: Misteri Lantai 13"** di Lobi. Di dalam berkas ada dua kasus:
- **Misteri Lantai 13**: 6 bab.
- **Kasus Lift Tengah Malam**: 3 babak, terbuka setelah Bab 1 Misteri Lantai 13 selesai. Jadwal hariannya terpisah, jadi Mira bisa main dua kasus berselang-seling.

- **Bab 1** bisa langsung dimainkan. Bab berikutnya terbuka **satu per hari** menurut tanggal di HP, dan hanya kalau bab sebelumnya sudah selesai.
- Setiap bab memakan waktu sekitar 5–10 menit. Progres tersimpan otomatis, jadi bisa ditinggal lalu dilanjut.
- Kalau buntu, ada tombol **Petunjuk** (Bu Ratna) di pojok kanan atas. Petunjuknya bertahap, dari samar sampai hampir jawaban.
- Cara main: ketuk benda untuk memeriksa. Untuk memakai barang, ketuk barangnya di **Laci** (bawah layar) sampai menyala kuning, lalu ketuk bendanya.

### Cara kerja detektif
- Benda dan kesaksian penting otomatis jadi **bukti** di **Papan Bukti** (tombol *Bukti* di laci, atau tombol *Papan Bukti* di berkas). Papan juga menampilkan profil tersangka yang berubah seiring kasus.
- Di akhir bab ada **Deduksi**: pilih jawaban, lalu tunjuk satu bukti pendukung. Salah tidak dihukum: tersangka yang dituduh membalas dengan lelucon, lalu Mira boleh coba lagi. Kalau jawabannya benar tapi buktinya kurang kuat, Bu Ratna minta pilih bukti lain.
- Kasus Lift punya **interogasi**: ketuk tersangka, *Tanya alibi*, lalu *Tunjukkan bukti*. Bukti yang tepat membuka kesaksian atau membuat alibi goyah.

### Mode penguji (untuk kamu)
Untuk membuka semua bab sekaligus: ke **Lantai 5 (Meja)**, lalu **ketuk kalender meja 7 kali**. Oyen akan memberi konfirmasi. Ketuk 7 kali lagi untuk mematikannya.
Kalau kamu mengetes di HP Mira, matikan lagi setelah selesai, atau tes di HP-mu sendiri saja.

### ⚠️ Kunci jawaban (spoiler, jangan dibagikan ke Mira)

**Bab 1 · Gula yang Hilang** (Lobi, Pantry)
1. Ngobrol dengan Pak Satpam, lalu naik tangga ke Pantry.
2. Baca poster piket. Hari yang dilingkari: Selasa, Kamis, Sabtu → **kode gembok 246**.
3. Ketuk *Bawah meja* (kejutan Dimas) untuk dapat **Sendok Teh**.
4. Pakai sendok di toples gula untuk dapat **Kartu Akses 13?**.
5. Turun ke lobi, lalu ketuk pintu lift.

**Bab 2 · Stempel yang Berpindah** (Ruang Fotokopi)
1. Laci meja → **Tinta Stempel**, lalu pakai di rak stempel.
2. Berkas di meja → urutan cap: **DITERIMA → DIPERIKSA → DISETUJUI → DISIMPAN**.
3. Kejutan mesin fotokopi "BOO.", lalu dapat Denah Gedung.

**Bab 3 · Sesuatu di Parkiran** (Lobi, Parkiran)
1. Ketuk pot tanaman di lobi (kejutan: Pak Satpam menyamar). Pilihan *"Janji, nggak bilang"* memberi bonus Peluit.
2. Di parkiran, kumpulkan 4 sobekan karcis: bawah mobil, palang, motor, tong sampah.
3. Susun urutannya: *KARCIS PARKIR · KLP / No. 13 · Lantai: 13 / Titipan: KUNCI GUDANG / di laci pos jaga No. 2*.
4. Ketuk pos jaga untuk dapat **Kunci Gudang** dan **Senter**.

**Bab 4 · Arsip Bawah Tanah**
1. Pakai Kunci Gudang di pintu, lalu masuk.
2. Pakai Senter di kegelapan. Geser jari untuk menyorot.
3. Buka lemari besi (kejutan Oyen) dan baca poster K3: kiri 4, kanan 1, napas 7 → **kode loker 417**.
4. Dapat Buku Catatan Penjaga.

**Bab 5 · Jam di Atap** (tanpa kejutan)
1. Setel **tiga jam** ke **16.59**: jam lobi, jam pantry, jam atap (tangga dari pantry).
2. Stiker Tombol 13 jatuh dari antena, lalu ada adegan teh dengan Bu Ratna.

**Bab 6 · Lantai 13**
1. Masuk lift, lalu pakai Stiker Tombol 13 di panel tombol.
2. Lampu mati (kejutan "mata kucing"), lalu tekan **Buka pintu**.
3. Ngobrol dengan Oyen sampai Mira diangkat jadi Penjaga Lantai 13.
4. Tombol 13 di lift sekarang membuka **Ruang Rahasia**: SK bisa diunduh, toples koleksi, dan tempat menyimpan satu hal kecil.

**Jawaban Deduksi (Misteri Lantai 13)**

| Bab | Pertanyaan | Jawaban | Bukti yang diterima |
|---|---|---|---|
| 1 | Tersangka hilangnya gula | Seseorang berkaki empat, berdasi | Tapak di kartu akses / Laporan jaga |
| 2 | Yang mengecap berkas tengah malam | Seseorang berkaki empat, berdasi | Tapak di rak / Kesaksian Mas Kukang / Tapak di kartu akses |
| 3 | Yang terakhir duduk di jok motor | Seseorang berkaki empat, berdasi | Jok motor hangat |
| 4 | Siapa "O." | Oyen | Tulisan tangan di buku / Rapat di lemari arsip |
| 5 | Kenapa jam harus 16.59 | Jam paling tenang | Catatan: 16.59 |
| 6 | Motif | Teh manis untuk yang lembur & menyimpan hal kecil | Catatan: teh manis / Rak toples lantai 13 |

**Kasus Lift Tengah Malam**

*Babak 1 · Lift yang Turun Sendiri* (Pos Jaga, Dalam Lift)
1. Ngobrol dengan Pak Satpam (bukti: Log lift). Baca buku log (bukti: Bau kopi).
2. Monitor CCTV → pilih **CAM 3 · Dalam lift** (bukti: Sosok di CCTV). Lalu ketuk pintu lift.
3. Di lift: ketuk *Pojok gelap* (kejutan: Mas Kukang yang belum sampai lantai 2), lalu *Lantai basah* (Tapak basah + Benang putih tebal).
4. Ketuk *Panel tombol*: lift turun sendiri ke pintu "B2 — R". Deduksi: **kain pel** (bukti: Benang putih tebal).

*Babak 2 · Lima Tersangka* (Ruang Rapat)
1. Kejutan proyektor (presentasi naik gaji Oyen).
2. Tunjukkan bukti dari lift (Sosok di CCTV / Tapak basah / Benang) ke **Dimas** → Kesaksian Dimas (lihat Bang Rakun jam 23.55 bawa ember, obeng, termos).
3. Tunjukkan **Kesaksian Dimas** ke **Bang Rakun** (alibi goyah), lalu **Tapak basah** ke Bang Rakun (tapak cocok). Opsional: Log lift ke Pak Satpam.
4. Ketuk papan tulis. Deduksi: **Bang Rakun**.

*Babak 3 · Ruang di Bawah Lobi* (Pos Jaga, Lift, B2)
1. Ngobrol dengan Pak Satpam (beliau pergi patroli toilet, jam jadi 00.13). Masuk lift.
2. Panel tombol → roda angka **0013**.
3. Di B2: radio (bisikan ternyata siaran radio horor), cetak biru, mesin di meja, lalu terpal hijau (kejutan: Bang Rakun).
4. Ketuk Bang Rakun. Deduksi: **memperbaiki mesin kopi diam-diam** (bukti: Catatan bengkel / Mesin kopi lantai 1).
5. Susun instruksi: Isi air → Pasang pompa → Tekan tombol merah → Tunggu "hhhh" → Jangan panik. Dapat **Cangkir Kopi Pertama**, dan mesin kopi di ruang tunggu sekarang betul-betul mengeluarkan kopi.

---

## 6. Easter egg

| Di mana | Apa |
|---|---|
| Halaman depan | Ketuk cap merah "KLP" 5 kali |
| Fasilitas ruang tunggu | Siram tanaman 5 kali · mesin kopi klik ke-7 (setelah Kasus Lift selesai, mesinnya jalan dengan pesan baru) · kotak saran · "Bicara dengan Manajer" 5 kali |
| Denah lobi | Garis berkedip di atas lantai 5 (setelah Bab 1, bisa diketuk) |
| Panel lift | Tombol tanpa angka (berkedip setelah Bab 1, jadi "13" setelah tamat) |
| Game Stempel Kilat | Berkas yang ditiduri Oyen: jangan dicap, biarkan lewat (+1) |
| Game Tangkap Kertas | Kertas emas = surat rahasia mesin fotokopi untuk printer (membuka gosip) |
| Lantai 13 | Toples berlabel nama Mira berisi catatan perjalanannya di kantor |

---

## 7. Privasi & data

- Isi kolom keluhan, cerita kabar baik, dan tulisan di mode "dengerin aja" **tidak pernah disimpan atau dikirim**.
- Yang disimpan (hanya di HP Mira, di `localStorage`) cuma: Poin Sabar, skor, barang koperasi, gosip, progres misteri, target Loket C, dan "hal kecil" yang ia tulis sendiri di Ruang Rahasia.
- Tidak ada server, tidak ada analytics, tidak ada pelacak.
- **Menghapus semua data:** Lantai 5 (Meja) → bagian paling bawah → *Bersihkan meja*.
- Data tidak pindah antar-perangkat. Kalau Mira membuka di HP lain atau di mode samaran, progresnya mulai dari nol.

---

## 8. Mengubah isi

Semua teks ada di file JavaScript, jadi bisa diubah langsung lewat GitHub (buka file → ikon pensil → **Commit changes**). Kalau situsnya terhubung ke GitHub (Pilihan B), perubahannya otomatis online.

| Mau mengubah | File |
|---|---|
| Nama bawaan | `script.js`, baris `const NAMA_DEFAULT = "Mira";` |
| Balasan loket, kompensasi, tips | `script.js` |
| Profil & kutipan karakter | `kantor.js` (bagian `K.PEGAWAI`) |
| Obrolan Pantry, kalimat "dengerin aja", gosip | `pantry-data.js` |
| Barang koperasi & harga | `koperasi.js` (bagian `BARANG`) |
| Isi game | `games.js` |
| Cerita misteri | `l13-bab.js` (Bab 1), `l13-bab23.js` (Bab 2–3), `l13-bab456.js` (Bab 4–6 + Ruang Rahasia), `l13-kasus-lift.js` (Kasus Lift Tengah Malam) |
| Gambar karakter (pixel) | `sprites.js` (grid 12×12 huruf) |

---

## 9. Masalah umum

| Masalah | Penyebab & solusi |
|---|---|
| Tombol unduh tidak bekerja | Biasanya koneksi ke cdnjs sedang lambat atau diblokir jaringan. Coba lagi, atau screenshot saja. Di iPhone, gambar muncul dulu lalu tekan lama → *Simpan ke Foto*. |
| Tidak ada suara | Volume di Radio Kantor mungkin di "Mode Perpustakaan", atau HP dalam mode senyap. Suara baru aktif setelah ketukan pertama di halaman (aturan browser). |
| Panel lift tidak muncul | Masuk dulu lewat tombol **Ambil Nomor Antrean → Masuk ke Lobi** di halaman depan. |
| Bab berikutnya belum terbuka | Memang terbuka satu per hari, dan bab sebelumnya harus sudah selesai. Untuk tes, pakai mode penguji (bagian 5). |
| Progres hilang | Dibuka di mode samaran, di browser atau perangkat lain, atau data situs dihapus. |
| Font terlihat biasa | Google Fonts belum termuat. Muat ulang halaman saat koneksi lebih baik. |
