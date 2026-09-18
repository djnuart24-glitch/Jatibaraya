# Panduan Deployment: Jatibaraya Website Builder

Panduan komprehensif ini menjelaskan langkah-langkah untuk mendeploy aplikasi **Jatibaraya Website Builder** ke **Firebase Hosting** atau **Netlify**. Aplikasi ini dibangun menggunakan React 19, TypeScript, Tailwind CSS v4, dan Vite sebagai *Single Page Application* (SPA) dengan output berkas statis siap saji di folder `dist/`.

---

## 1. Arsitektur & Informasi Build

* **Framework**: React 19 + TypeScript + Vite
* **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
* **Perintah Build**: `npm run build`
* **Folder Output Build**: `dist/`
* **Tipe Aplikasi**: Client-Side Single Page Application (SPA)

---

## 2. Persiapan Sebelum Deployment

Pastikan Anda telah memiliki:
1. **Node.js**: Versi 18.x atau 20.x LTS ([nodejs.org](https://nodejs.org/)).
2. **Git**: Terpasang di komputer Anda.
3. **Kode Sumber Proyek**: Pastikan dependencies terpasang dengan menjalankan:
   ```bash
   npm install
   ```
4. **Verifikasi Build Lokal**: Jalankan tes build di komputer lokal untuk memastikan tidak ada kesalahan:
   ```bash
   npm run build
   ```
   Pastikan folder `dist/` berhasil dibuat dan berisi `index.html`, berkas JavaScript/CSS, serta folder `assets/`.

---

## 3. Opsi A: Deployment ke Firebase Hosting

Firebase Hosting menyediakan hosting CDN global gratis, aman (SSL/HTTPS otomatis), dan sangat cepat dengan domain bawaan `*.web.app` dan `*.firebaseapp.com`.

### Langkah 1: Pasang Firebase CLI
Buka terminal dan pasang alat bantu Firebase secara global:
```bash
npm install -g firebase-tools
```

### Langkah 2: Login ke Akun Google Firebase
```bash
firebase login
```
Peramban web akan terbuka untuk mengonfirmasi akun Google Anda.

### Langkah 3: Inisialisasi Firebase di Direktori Proyek
Jalankan perintah berikut di root folder proyek:
```bash
firebase init hosting
```

Saat muncul serangkaian pertanyaan panduan, jawab sebagai berikut:
1. **Please select an option**:
   * Pilih `Use an existing project` (jika sudah membuat project di [Firebase Console](https://console.firebase.google.com/)) atau `Create a new project`.
2. **What do you want to use as your public directory?**:
   * Ketik: `dist`
3. **Configure as a single-page app (rewrite all urls to /index.html)?**:
   * Pilih: `Yes` (Penting agar rute SPA tidak menghasilkan 404 saat direfresh).
4. **Set up automatic builds and deploys with GitHub?**:
   * Pilih `No` (atau `Yes` jika Anda ingin mengaktifkan GitHub Actions CI/CD otomatis).
5. **File dist/index.html already exists. Overwrite?**:
   * Pilih: `No` (Agar hasil build Anda tidak tertimpa template kosong Firebase).

### Langkah 4: Konfigurasi `firebase.json`
Pastikan berkas `firebase.json` di root direktori memiliki konfigurasi rewrite berikut:
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### Langkah 5: Kompilasi & Deploy ke Firebase
Jalankan proses kompilasi diikuti perintah deploy:
```bash
npm run build
firebase deploy --only hosting
```

Setelah selesai, terminal akan menampilkan URL website yang sudah aktif:
```text
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/jatibaraya-app/overview
Hosting URL: https://jatibaraya-app.web.app
```

---

## 4. Opsi B: Deployment ke Netlify

Netlify adalah platform cloud modern yang mendukung integrasi otomatis dengan Git (GitHub, GitLab, Bitbucket) dengan CDN global dan sertifikat SSL instan.

### Metode 1: Melalui Antarmuka Web Netlify (Direkomendasikan via Git)

1. **Unggah Kode ke GitHub / GitLab**:
   ```bash
   git init
   git add .
   git commit -m "feat: website jatibaraya siap deploy"
   git branch -M main
   git remote add origin https://github.com/username/jatibaraya-website.git
   git push -u origin main
   ```
2. **Buka Netlify**:
   * Masuk ke [app.netlify.com](https://app.netlify.com/).
   * Klik tombol **"Add new site"** > **"Import an existing project"**.
   * Pilih penyedia Git Anda (misal: **GitHub**) dan pilih repositori proyek Jatibaraya.
3. **Konfigurasi Build Settings**:
   * **Base directory**: *(Biarkan kosong)*
   * **Build command**: `npm run build`
   * **Publish directory**: `dist`
4. **Konfigurasi Rute SPA**:
   * Berkas `public/_redirects` sudah tersedia di dalam proyek dengan isi:
     ```text
     /*    /index.html   200
     ```
   * Berkas ini otomatis disalin ke `dist/_redirects` saat build untuk mencegah error 404 pada rute langsung.
5. **Deploy Site**:
   * Klik tombol **"Deploy Jatibaraya"**. Netlify akan menjalankan build dan memberikan domain live seperti `https://jatibaraya.netlify.app`.

---

### Metode 2: Menggunakan Netlify CLI (Langsung dari Terminal)

1. **Pasang Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```
2. **Login ke Netlify**:
   ```bash
   netlify login
   ```
3. **Build & Deploy ke Production**:
   ```bash
   npm run build
   netlify deploy --prod --dir=dist
   ```
4. Terminal akan memberikan **Website URL** aktif Anda.

---

## 5. Pengaturan Environment Variables (Variabel Lingkungan)

Aplikasi Jatibaraya berbasis *client-side* dengan penyimpanan data lokal aman (*localStorage*) untuk mempermudah operasional pengurus awam tanpa konfigurasi server rumit.

Jika Anda menambahkan integrasi API eksternal (misal: Google Analytics atau Gemini API untuk asisten santri):

### Aturan Penamaan Variabel (Vite):
* Variabel yang diakses di peramban (client-side) **wajib** diawali prefix `VITE_`:
  ```env
  VITE_APP_TITLE="JATIBARAYA"
  VITE_CONTACT_PHONE="+628123456789"
  ```
* Akses variabel di kode:
  ```ts
  const appTitle = import.meta.env.VITE_APP_TITLE;
  ```

### Mengatur Variabel di Firebase Hosting:
Jika menggunakan Cloud Functions / backend:
```bash
firebase functions:config:set service.key="NILAI_KEY"
```

### Mengatur Variabel di Netlify:
1. Buka dashboard situs Anda di Netlify.
2. Masuk ke menu **Site configuration** > **Environment variables**.
3. Klik **Add a variable**, masukkan kunci dan nilainya, lalu simpan.
4. Lakukan re-deploy situs untuk menerapkan nilai variabel baru.

---

## 6. Verifikasi & Pengujian Pasca-Deployment

Setelah website berhasil diunggah ke hosting, lakukan pengecekan berikut:

### 1. Uji Rute & Tampilan Utama
* [ ] Buka URL situs di peramban (misal: `https://jatibaraya-app.web.app`).
* [ ] Pastikan halaman beranda terbuka dengan sempurna, warna tema hijau zamrud dan kuning keemasan muncul tanpa kendala.
* [ ] Pastikan lambang resmi Jatibaraya (Globe Biru, Kujang Emas, Tiga Kitab, 9 Bintang Merah, dan Pita Hijau Arab) tampil tajam.

### 2. Uji Navigasi & SPA Refresh (Pencegahan Error 404)
* [ ] Klik tab navigasi **"Tentang"**, **"Identitas"**, **"Program"**, **"Informasi"**, dan **"Kontak"**.
* [ ] Coba muat ulang peramban (*hard reload* `Ctrl+F5` atau `Cmd+Shift+R`) pada sub-halaman. Pastikan halaman tetap termuat dengan benar dan tidak menampilkan "404 Not Found".

### 3. Uji Unduh Lambang Vektor
* [ ] Masuk ke menu **Filosofi Lambang** (`/identitas`).
* [ ] Klik tombol **"Unduh Berkas Logo (SVG)"**. Pastikan berkas `jatibaraya-logo.svg` terunduh dengan sukses.

### 4. Uji Portal Admin & Penyimpanan Data
* [ ] Klik tombol **"Portal Admin"** atau **"Admin CMS"** di pojok kanan atas Navbar.
* [ ] Masukkan kata sandi default pengurus: `jatibaraya2025`.
* [ ] Coba edit salah satu data (misal: tambah Program Kerja baru atau edit Kontak Sekretariat).
* [ ] Klik **Simpan**. Periksa pesan konfirmasi dan pastikan data langsung tampil di halaman publik.

### 5. Uji Responsivitas Perangkat
* [ ] Buka situs menggunakan browser ponsel pintar (*smartphone*).
* [ ] Buka menu hamburger di pojok kanan atas untuk memastikan navigasi bergerak mulus (*smooth drawer*).

---

## 7. Menghubungkan Domain Kustom (Opsional)

Jika Jatibaraya memiliki domain resmi sendiri (misal: `jatibaraya.or.id` atau `jatibaraya.com`):

### Pada Firebase Hosting:
1. Buka **Firebase Console** > **Hosting**.
2. Klik **Add custom domain**.
3. Masukkan domain Anda (misal `jatibaraya.or.id`).
4. Ikuti petunjuk untuk menambahkan entri **DNS A Record** atau **TXT Record** pada registrar domain Anda.

### Pada Netlify:
1. Buka **Site configuration** > **Domain management**.
2. Klik **Add custom domain**.
3. Ikuti panduan konfigurasi **CNAME** atau **Netlify DNS**. Sertifikat SSL gratis dari Let's Encrypt akan terpasang otomatis dalam beberapa menit.

---

## 8. Ringkasan Perintah Penting

| Perintah | Deskripsi |
| :--- | :--- |
| `npm run dev` | Menjalankan server pengembangan lokal di `http://localhost:3000` |
| `npm run build` | Mengompilasi kode sumber menjadi berkas produksi di folder `dist/` |
| `npm run preview` | Meninjau hasil kompilasi `dist/` secara lokal sebelum deploy |
| `firebase deploy --only hosting` | Mengunggah hasil build langsung ke Firebase Hosting |
| `netlify deploy --prod --dir=dist` | Mengunggah hasil build langsung ke Netlify Production |
