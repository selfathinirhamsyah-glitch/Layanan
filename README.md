# Kantor Layanan Perasaan

Website satu halaman (HTML/CSS/JS murni) untuk Mira: kantor layanan fiktif yang menerima keluhan, kabar baik, dan semangat.

## Isi
- **Loket A – Mengajukan Keluhan**: formulir kategori + slider tingkat capek → proses birokrasi → surat balasan Bu Kapibara → kompensasi resmi (bisa diunduh).
- **Loket B – Melaporkan Kabar Baik**: rapat darurat, pengumuman Pak Singa, stempel "Dicatat sebagai Hari Baik", konfeti kertas sobek → Piagam Hari Baik.
- **Loket C – Mendaftarkan Semangat**: Izin Resmi untuk Jadi Hebat + tips Kak Badak. Kalau halaman dibuka lagi nanti, ada tombol "Saya sudah selesai" untuk cap TUNTAS.
- **Loket D (tersembunyi)**: muncul setelah 10 detik ragu di ruang tunggu (atau bolak-balik menyorot loket). Tiga pertanyaan absurd dari Mbak Burung Hantu.
- **Easter egg**: siram tanaman, mesin kopi rusak (klik ke-7), kotak saran, "Bicara dengan Manajer" (klik 5x), dan cap kantor di halaman depan (ketuk 5x).

## Ganti nama
- Ubah `NAMA_DEFAULT` di baris atas `script.js`, atau
- Tambahkan di URL: `https://situsmu.netlify.app/?nama=Mira`

## Privasi
Isi kolom keluhan dan cerita tidak disimpan atau dikirim ke mana pun. Satu-satunya yang disimpan (di `localStorage` perangkat itu sendiri) adalah target Loket C, supaya bisa dicap TUNTAS nanti.

## Deploy
Tidak ada proses build.
- **Netlify**: drag-and-drop folder ini ke app.netlify.com/drop, atau hubungkan repo (publish directory: root).
- **Vercel**: import repo, framework preset "Other", tanpa build command.

Pakai Google Fonts (Special Elite, IBM Plex Sans/Mono) dan html2canvas dari cdnjs.
