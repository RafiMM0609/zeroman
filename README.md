# zeroman — Anton's Portfolio

Website portofolio modern yang responsif dan dioptimalkan untuk SEO, dibangun menggunakan **Nuxt 3** dan **Tailwind CSS**. Menampilkan keahlian dalam Software Engineering & AI Architecture.

## 🚀 Fitur Utama
*   ⚡ **Nuxt 3 & Vue 3** - Framework modern dengan performa tinggi dan rendering SSR/Static.
*   🎨 **Desain Premium** - Layout bento modern, tipografi elegan (Playfair Display & Outfit), dan ikon berbasis Lucide.
*   🔍 **SEO Optimized** - Konfigurasi meta tags, Open Graph, preconnect font, dan data terstruktur bawaan.
*   📱 **Responsive & Fast** - Desain mobile-first dengan Tailwind CSS dan pemuatan font yang dioptimalkan.

## 🛠️ Cara Penggunaan

### Prasyarat
*   Node.js versi terbaru (LTS direkomendasikan)
*   npm / yarn / pnpm

### Langkah Instalasi

1.  **Clone repositori & Masuk ke direktori:**
    ```bash
    git clone https://github.com/RafiMM0609/zeroman.git
    cd zeroman
    ```

2.  **Instal dependensi:**
    ```bash
    npm install
    ```

3.  **Jalankan server pengembangan (Local Dev):**
    ```bash
    npm run dev
    ```
    Akses website melalui browser di `http://localhost:3000`.

### Perintah Lainnya

*   **Build untuk Produksi:**
    ```bash
    npm run build
    ```
*   **Preview Build Produksi:**
    ```bash
    npm run preview
    ```
*   **Generate Static Site (SSG):**
    ```bash
    npm run generate
    ```

## 📁 Struktur Folder Utama
```text
zeroman/
├── assets/css/style.css  # Gaya CSS global kustom
├── components/           # Komponen Vue yang reusable
├── pages/                # Halaman utama aplikasi (berbasis file routing)
├── public/               # File statis (favicon, gambar, robot.txt)
├── server/               # Server routes / API endpoints Nuxt
├── nuxt.config.ts        # Konfigurasi utama Nuxt 3 (SEO, Head, CSS, dll)
├── tailwind.config.ts    # Konfigurasi Tailwind CSS
└── package.json          # Dependensi dan script proyek
```

---
Dibuat dengan ❤️ oleh **Anton**
