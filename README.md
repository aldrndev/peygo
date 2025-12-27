# Peygo 🚀

**Peygo** adalah platform SaaS manajemen invoice dan pembayaran digital modern yang dirancang untuk Freelancer, UMKM, Startup, dan Agensi di Indonesia. Dengan fokus pada kecepatan, keamanan, dan estetika premium, Peygo mempermudah pengelolaan operasional keuangan bisnis Anda.

## ✨ Fitur Utama

-   **Dashboard Real-time**: Pantau arus kas dan statistik transaksi melalui visualisasi data yang elegan.
-   **Manajemen Penagihan (Invoicing)**: Buat, kelola, dan kirim invoice profesional dengan wizard multi-step yang intuitif.
-   **Manajemen Pembayaran (Pay-out)**: Kelola pembayaran ke supplier dengan verifikasi bank otomatis dan pelacakan status.
-   **Identitas Bisnis & Brand**: Personalisasi profil bisnis Anda dengan logo dan informasi resmi untuk meningkatkan kredibilitas.
-   **Keamanan Level Enterprise**: Autentikasi aman melalui Supabase Auth dengan perlindungan data tingkat tinggi.
-   **Desain Modern & Responsif**: Antarmuka berbasis *glassmorphism* yang dioptimalkan untuk perangkat mobile dan desktop.

## 🛠️ Tech Stack

Peygo dibangun menggunakan teknologi terkini untuk memastikan performa maksimal:

-   **Framework**: [Next.js 15+](https://nextjs.org/) (App Router, Server Actions)
-   **Bahasa**: [TypeScript](https://www.typescriptlang.org/) (Strict mode)
-   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
-   **UI Library**: [HeroUI](https://heroui.com/) (React UI Library)
-   **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) (Client-side) & [React Query](https://tanstack.com/query) (Server-state)
-   **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL, Auth, Storage)
-   **Form Handling**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
-   **Animasi**: [Framer Motion](https://www.framer.com/motion/)

## 🚀 Memulai (Local Setup)

### Prasyarat
-   Node.js 18+ 
-   PNPM (Rekomendasi) atau NPM
-   Akun Supabase

### Instalasi

1.  **Clone repository**
    ```bash
    git clone https://github.com/username/peygo.git
    cd peygo
    ```

2.  **Instal dependensi**
    ```bash
    pnpm install
    ```

3.  **Konfigurasi Environment Variable**
    Salin `.env.example` menjadi `.env.local` dan isi kredensial Supabase Anda:
    ```bash
    cp .env.example .env.local
    ```

4.  **Jalankan aplikasi**
    ```bash
    pnpm dev
    ```
    Buka [http://localhost:3000](http://localhost:3000) pada browser Anda.

## 📝 Script Tersedia

-   `pnpm dev`: Jalankan server pengembangan.
-   `pnpm build`: Buat aplikasi versi produksi.
-   `pnpm start`: Jalankan aplikasi versi produksi yang sudah di-build.
-   `pnpm lint`: Jalankan audit kode dengan ESLint.

---

Dibuat dengan ❤️ oleh [Digitesia](https://digitesia.com)
