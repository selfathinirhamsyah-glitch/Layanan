# Kantor Layanan Perasaan

> Panduan lengkap (cara online-kan, kirim ke Mira, tur, kunci jawaban misteri): lihat [PANDUAN.md](PANDUAN.md).

Website satu halaman (HTML/CSS/JS murni) untuk Mira: kantor layanan fiktif yang menerima keluhan, kabar baik, dan semangat.

## Isi
- **Loket A – Mengajukan Keluhan**: formulir kategori + slider tingkat capek → proses birokrasi → surat balasan Bu Kapibara → kompensasi resmi (bisa diunduh).
- **Loket B – Melaporkan Kabar Baik**: rapat darurat, pengumuman Pak Singa, stempel "Dicatat sebagai Hari Baik", konfeti kertas sobek → Piagam Hari Baik.
- **Loket C – Mendaftarkan Semangat**: Izin Resmi untuk Jadi Hebat + tips Kak Badak. Kalau halaman dibuka lagi nanti, ada tombol "Saya sudah selesai" untuk cap TUNTAS.
- **Loket D (tersembunyi)**: muncul setelah 10 detik ragu di ruang tunggu (atau bolak-balik menyorot loket). Tiga pertanyaan absurd dari Mbak Burung Hantu.
- **Easter egg**: siram tanaman, mesin kopi rusak (klik ke-7), kotak saran, "Bicara dengan Manajer" (klik 5x), dan cap kantor di halaman depan (ketuk 5x).

## Gedung (versi 2)
Navigasi utama berupa **panel lift** di bawah layar dan denah gedung di Lobi.

| Lantai | Isi |
|---|---|
| L · Lobi | Pengumuman kantor, absen perasaan harian (Gelas Teh), denah, Papan Pegawai, berkas misteri |
| 1 · Loket | Loket A–D (versi pertama) dengan skala interaktif: Tarik Senyum (A), Timbangan (B), Pukul Kok (C) |
| 2 · Rehat | 5 mini game 3D (three.js di `vendor/`, ada pilihan 2D klasik): Rally vs Pak Satpam, Stempel Kilat, Tangkap Kertas Terbang, Ngemil Diam-diam di Rapat, Balap Troli Arsip. Poin Sabar, rekor, papan Pegawai Teladan |
| 3 · Pantry | Obrolan bercabang dengan Bu Ratna, Pak Satpam, Dimas, Oyen, Mas Kukang (termasuk mode "dengerin aja") dan gosip kantor |
| 4 · Koperasi | Belanja barang absurd pakai Poin Sabar, ditemani satu karakter, struk bisa diunduh |
| 5 · Meja | Koleksi barang, rak barang langka, buku rekor, hapus data |
| 13 · Rahasia | Terbuka setelah Misteri Lantai 13 selesai: SK Penjaga Lantai 13, toples koleksi, simpan hal kecil |

**Radio Kantor** (pojok kanan atas): kenop volume 5 tingkat, Tuas Mode Kaget, dan Saklar Lampu Lorong (seram-lucu / lebih tegang).

### Berkas misteri (detektif)
Adventure point-and-click dengan bukti, Papan Bukti, deduksi, dan interogasi.
- **Misteri Lantai 13**: 6 bab.
- **Kasus Lift Tengah Malam**: 3 babak, terbuka setelah Bab 1.

Satu bab/babak terbuka per hari (tanggal di perangkat).
Untuk mengetes semua bab sekaligus: buka Meja Kerja (Lantai 5) dan **ketuk kalender meja 7 kali** (ketuk 7 kali lagi untuk mematikan).

### Khusus Mira
Ulang tahun 21 Agustus (surat ucapan + tiup lilin, termasuk versi "terlambat" sampai 60 hari sesudahnya), Kartu Pegawai biru di Meja Kerja, serta topik pantry, barang koperasi, gosip, dan adegan setelah kredit bertema novel, drakor, Marvel, dan CORTIS. Ada di `mira.js` + `mira.css`. Tanggal lahir bisa diganti lewat `?lahir=YYYY-MM-DD`.

### Penyimpanan
Semua progres (poin, skor, barang, gosip, misteri) disimpan di `localStorage` perangkat itu sendiri dengan kunci `klp-v2`. Kalau penyimpanan diblokir, semua tetap bisa dimainkan; progresnya saja yang hilang saat halaman ditutup. Isi curhat dan obrolan "dengerin aja" tidak pernah disimpan.

### Struktur file
`core.js` (data, suara) → `sprites.js` → `script.js` (loket) → `kantor.js` (lobi, lift, radio) → `skala.js` + `pasang-skala.js` → `games.js` + `games3d.js` → `pantry-data.js` + `pantry.js` → `koperasi.js` → `l13-mesin.js` + `l13-bab*.js` + `l13-kasus-lift.js` → `mira.js` → `panduan.js`.

## Ganti nama
- Ubah `NAMA_DEFAULT` di baris atas `script.js`, atau
- Tambahkan di URL: `https://situsmu.netlify.app/?nama=Mira`

## Privasi
Isi kolom keluhan dan cerita tidak disimpan atau dikirim ke mana pun. Satu-satunya yang disimpan (di `localStorage` perangkat itu sendiri) adalah target Loket C, supaya bisa dicap TUNTAS nanti.

## Deploy
Tidak ada proses build.
- **Netlify**: drag-and-drop folder ini ke app.netlify.com/drop, atau hubungkan repo (publish directory: root).
- **Vercel**: import repo, framework preset "Other", tanpa build command.

## Tampilan
Campuran pixel art dan doodle: pegawai hewan digambar sebagai sprite pixel (`sprites.js`, grid 12×12), tombol gaya game retro, kertas buku kotak-kotak dengan garis tangan, klip kertas, dan catatan pensil.

Pakai Google Fonts (Pixelify Sans, VT323, Patrick Hand) dan html2canvas dari cdnjs.
