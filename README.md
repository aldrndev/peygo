# PeyGo 🚀

**Platform Invoice & Billing untuk UMKM Indonesia**

PeyGo adalah platform SaaS manajemen invoice dan pembayaran digital modern yang dirancang untuk Freelancer, UMKM, Startup, dan Agensi di Indonesia. Dengan fokus pada kecepatan, keamanan, dan estetika premium, PeyGo mempermudah pengelolaan operasional keuangan bisnis Anda.

---

## ✨ Fitur Utama

### 📊 Dashboard & Analytics
- **Dashboard Real-time**: Visualisasi data transaksi dengan statistik lengkap
- **Admin Reports**: Laporan komprehensif dengan filtering, charts, dan period comparison
  - Revenue trend (line chart)
  - Invoice volume (bar chart)
  - Status distribution (donut chart)
  - Export to PDF & CSV
  - Drill-down capabilities

### 💰 Manajemen Invoice
- **Multi-step Wizard**: Buat invoice profesional dengan panduan langkah-demi-langkah
- **Invoice Types**: Support BILLING dan PAYMENT_REQUEST
- **Status Tracking**: DRAFT → SENT → PAID → DISBURSED
- **PDF Generation**: Export invoice ke PDF dengan branding bisnis
- **QR Code Payment**: Integrasi QRIS untuk pembayaran mudah

### 💸 Manajemen Pembayaran (Pay-out)
- **Supplier Management**: Kelola database supplier dengan verifikasi bank
- **Payment Tracking**: Pelacakan status pembayaran real-time
- **Bank Verification**: Validasi nomor rekening otomatis

### 👤 Manajemen User
- **Profil Bisnis**: Personalisasi dengan logo, nama perusahaan, alamat
- **Role-Based Access**: Support role `user` dan `admin`
- **Onboarding Flow**: Wizard setup awal untuk user baru

### 🛡️ Admin Features
- **User Management**: 
  - View all users dengan filter & search
  - Change user roles (user ↔ admin)
  - Soft delete users
  - View user detail & transaction history
- **Invoice Management**: 
  - View all invoices (cross-user)
  - Filter by type, status, date range
  - Click-through ke invoice detail
- **Audit Logs**: 
  - Comprehensive activity logging
  - Searchable & filterable
  - IP address & user agent tracking
  - Export to CSV
- **Reports & Analytics**:
  - Date range filtering (presets + custom)
  - Revenue, fees, user growth tracking
  - Period comparison dengan growth indicators
  - Multi-tab data tables (Invoice/User/Monthly)

### 🔒 Keamanan
- **Authentication**: Supabase Auth dengan email/password
- **Authorization**: Row Level Security (RLS) policies
- **Audit Trail**: Semua admin actions tercatat
- **Soft Delete**: Data preservation untuk compliance
- **Input Validation**: Zod schema validation di client & server

---

## 🛠️ Tech Stack

### Core
- **Framework**: [Next.js 16.1](https://nextjs.org/) (App Router, Server Actions, React 19)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict mode)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) (Headless primitives)
- **Icons**: [Lucide React](https://lucide.dev/)

### State & Data
- **Server State**: [TanStack Query](https://tanstack.com/query) (React Query v5)
- **Client State**: [Zustand](https://zustand-demo.pmnd.rs/) (minimal, slice-based)
- **Form Management**: [React Hook Form](https://react-hook-form.com/)
- **Validation**: [Zod](https://zod.dev/)

### Backend
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL 17)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (logo uploads)
- **Real-time**: Supabase Realtime (optional)

### Features
- **Charts**: [Recharts](https://recharts.org/) v3
- **PDF Generation**: [@react-pdf/renderer](https://react-pdf.org/)
- **QR Codes**: [qrcode](https://www.npmjs.com/package/qrcode)
- **Date Utilities**: Native Date API

### Development
- **Package Manager**: pnpm
- **Linting**: ESLint v9
- **Testing**: Vitest (security & business logic tests)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/username/peygo.git
   cd peygo
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**
   
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

4. **Setup database**
   
   Run migrations in Supabase:
   ```bash
   # Navigate to your Supabase project dashboard
   # Go to Database > Migrations
   # Apply all pending migrations from /supabase/migrations
   ```

5. **Run development server**
   ```bash
   pnpm dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
peygo/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/              # Auth pages (login, register)
│   │   ├── (dashboard)/         # Protected dashboard pages
│   │   │   ├── dashboard/       # User dashboard
│   │   │   │   ├── admin/       # Admin-only pages
│   │   │   │   │   ├── audit-logs/
│   │   │   │   │   ├── invoices/
│   │   │   │   │   ├── reports/
│   │   │   │   │   ├── settings/
│   │   │   │   │   └── users/
│   │   │   │   ├── invoice/     # Invoice management
│   │   │   │   ├── pembayaran/  # Payment management
│   │   │   │   ├── penjualan/   # Billing management
│   │   │   │   ├── profil/      # User profile
│   │   │   │   └── supplier/    # Supplier management
│   │   └── api/                 # API routes (webhooks)
│   ├── components/              # React components
│   │   ├── auth/               # Auth components
│   │   ├── dashboard/          # Dashboard components
│   │   ├── invoice/            # Invoice components
│   │   ├── supplier/           # Supplier components
│   │   └── ui/                 # Reusable UI components
│   ├── hooks/                  # Custom React hooks
│   │   ├── mutations/          # TanStack Query mutations
│   │   └── queries/            # TanStack Query queries
│   ├── lib/                    # Utility libraries
│   │   ├── api/                # API functions
│   │   ├── supabase/           # Supabase clients
│   │   └── utils/              # Helper functions
│   └── styles/                 # Global styles
├── supabase/
│   └── migrations/             # Database migrations
├── tests/                      # Test files
│   ├── business/              # Business logic tests
│   └── security/              # Security tests
└── public/                     # Static assets
```

---

## 🗄️ Database Schema

### Core Tables
- **profiles**: User profiles with business info
- **invoices**: Invoice records (BILLING/PAYMENT_REQUEST)
- **invoice_items**: Line items for invoices
- **suppliers**: Supplier database
- **audit_logs**: Admin action audit trail
- **settings**: System-wide settings

### Key Features
- Row Level Security (RLS) on all tables
- Soft delete support (`deleted_at` column)
- Audit logging for admin actions
- Foreign key constraints for data integrity

---

## 🔐 Security Features

- ✅ Row Level Security (RLS) policies
- ✅ Server-side authentication checks
- ✅ Input validation (client & server)
- ✅ Audit logging for admin actions
- ✅ IP address tracking
- ✅ User agent logging
- ✅ Soft delete for data preservation
- ✅ Role-based access control (RBAC)

---

## 📜 Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint

# Testing
pnpm test             # Run all tests
pnpm test:security    # Run security tests only
pnpm test:business    # Run business logic tests only
```

---

## 🚢 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy

### Environment Variables (Production)
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 License

This project is proprietary software. All rights reserved.

---

## 🙏 Credits

Dibuat dengan ❤️ oleh [Digitesia](https://digitesia.com)

---

## 📧 Contact

Untuk pertanyaan atau dukungan, hubungi: support@peygo.id
