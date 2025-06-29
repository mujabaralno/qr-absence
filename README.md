# QR Absence: Sistem Absensi Berbasis QR Code

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

Sistem absensi modern yang dibangun menggunakan Next.js dan TypeScript untuk proses pencatatan kehadiran yang cepat, efisien, dan paperless.

## Deskripsi Proyek

**QR Absence** adalah sebuah aplikasi web yang dirancang untuk mempermudah proses absensi. Aplikasi ini memungkinkan administrator atau pengajar untuk membuat sesi absensi dan menghasilkan QR Code unik. Pengguna (seperti siswa atau karyawan) kemudian dapat memindai QR code tersebut menggunakan perangkat mereka untuk mencatatkan kehadiran secara real-time.

Proyek ini dibuat untuk menggantikan metode absensi manual yang rentan terhadap kesalahan dan tidak efisien.

## Fitur Utama

-   ✅ **Otentikasi Pengguna:** Sistem login untuk administrator dan pengguna.
-   🔑 **Pembuatan QR Code Dinamis:** Hasilkan QR Code unik untuk setiap sesi kelas atau acara.
-   🚀 **Absensi Real-time:** Data kehadiran langsung tercatat di sistem setelah pemindaian berhasil.
-   📊 **Dasbor Manajemen:** Antarmuka untuk melihat, mengelola, dan merekap data kehadiran.
-   📱 **Desain Responsif:** Dapat diakses dengan baik di berbagai perangkat, baik desktop maupun mobile.

## Teknologi yang Digunakan

Proyek ini dibangun dengan tumpukan teknologi modern:

-   **Framework:** [Next.js](https://nextjs.org/)
-   **Bahasa Pemrograman:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** CSS
-   **Deployment:** [Vercel](https://vercel.com/)
-   **Font:** [Geist](https://vercel.com/font)
-   **Package Manager:** npm / yarn / pnpm / bun

## Instalasi dan Setup Lokal

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di mesin lokal Anda.

1.  **Clone repositori ini:**
    ```bash
    git clone [https://github.com/mujabaralno/qr-absence.git](https://github.com/mujabaralno/qr-absence.git)
    cd qr-absence
    ```

2.  **Install dependensi proyek:**
    Pilih salah satu package manager yang Anda gunakan.
    ```bash
    npm install
    # atau
    yarn install
    # atau
    pnpm install
    ```

3.  **Jalankan server pengembangan:**
    ```bash
    npm run dev
    # atau
    yarn dev
    # atau
    pnpm dev
    ```

4.  **Buka aplikasi di browser:**
    Buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk melihat hasilnya.

## Struktur Proyek

Berikut adalah gambaran umum tentang struktur direktori dan file penting dalam proyek ini:

```
.
├── /app          # Direktori utama untuk halaman dan layout (App Router)
├── /components   # Komponen React yang dapat digunakan kembali
├── /lib          # Fungsi utilitas dan konfigurasi library
├── /public       # Aset statis seperti gambar dan ikon
├── /types        # Definisi tipe TypeScript kustom
├── next.config.ts  # File konfigurasi untuk Next.js
└── package.json    # Daftar dependensi dan skrip proyek
```

## Kontribusi

Kontribusi dari komunitas sangat kami harapkan! Jika Anda ingin berkontribusi, silakan ikuti langkah-langkah berikut:

1.  **Fork** repositori ini.
2.  Buat *branch* baru untuk fitur Anda (`git checkout -b fitur/fitur-keren`).
3.  Lakukan perubahan dan **commit** (`git commit -m 'Menambahkan fitur keren'`).
4.  **Push** ke *branch* Anda (`git push origin fitur/fitur-keren`).
5.  Buat **Pull Request** baru.

## Lisensi

Proyek ini tidak memiliki lisensi spesifik. Silakan hubungi pemilik repositori untuk informasi lebih lanjut.
