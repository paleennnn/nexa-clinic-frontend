# Nexa Clinic — Sistem Informasi Manajemen Klinik

**Nexa Clinic** adalah aplikasi Sistem Informasi Manajemen Klinik modern yang mencakup seluruh siklus operasional klinik: mulai dari pendaftaran pasien, antrean per poli, rekam medis SOAP (Subjective, Objective, Assessment, Plan), e-prescribing (resep obat), hingga dashboard analitik real-time.

---

## 👥 Akun Login Demo

Aplikasi dilengkapi dengan akun demo untuk setiap peran (*Role*) dan fitur **Quick Autofill** pada halaman Login (cukup klik kartu akun untuk mengisi form otomatis):

| Peran (Role) | Email | Password | Hak Akses Utama |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@clinic.test` | `Admin123!` | Akses penuh seluruh sistem, kelola Master Data Poli & Dokter, manajemen antrean & pasien. |
| **Dokter** | `dokter@clinic.test` | `Dokter123!` | Ruang Pemeriksaan SOAP, resep obat & tindakan, pantau antrean poli dokter, riwayat medis. |
| **Petugas Pendaftaran** | `petugas@clinic.test` | `Petugas123!` | Pendaftaran pasien baru & lama, pembuatan tiket antrean kunjungan, panggilan antrean (*Check In* / *Siap Periksa*). |

---

## 🛠️ Tech Stack & Prasyarat

### Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS, TanStack React Query v5, React Hook Form, Zod, Lucide React, React Router v7.
- **Backend**: Node.js, Express.js, Prisma ORM, PostgreSQL, JWT Authentication, bcrypt.

### Prasyarat Sistem
- **Node.js**: Versi 18+ (disarankan v20 atau v22)
- **PostgreSQL**: Versi 14+ (lokal atau cloud)
- **Package Manager**: `npm`

---

## 🚀 Panduan Instalasi & Menjalankan Aplikasi

Aplikasi terdiri dari dua direktori utama: **Backend** (API server) dan **Frontend** (UI client).

### 1. Setup Backend & Database

Buka terminal dan arahkan ke direktori backend:

```bash
cd nexa-clinic-backend
```

#### A. Install Dependensi
```bash
npm install
```

#### B. Konfigurasi File `.env`
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Sesuaikan isi file `.env` dengan kredensial PostgreSQL Anda:
```env
PORT=4000
DATABASE_URL="postgresql://postgres:password_anda@localhost:5432/db-nexaclinic?schema=public"
JWT_SECRET=super_secret_jwt_key_clinic_2026
JWT_EXPIRES_IN=8h
```

#### C. Migrasi & Seeding Database
Jalankan migrasi database Prisma untuk membuat tabel dan skema:
```bash
# Menjalankan migrasi database
npx prisma migrate dev --name init
```

Jalankan perintah seeder untuk mengisi data master akun default, poli, dokter, serta **15 data pasien demo**:
```bash
# Menjalankan seeding data awal
npx prisma db seed
```
*(Catatan: Jika sewaktu-waktu ingin mereset database dari nol beserta data seed, jalankan `npx prisma migrate reset`)*.

#### D. Menjalankan Server Backend
```bash
npm run dev
```
Server REST API backend akan aktif di: `http://localhost:4000` (atau port yang diset di `.env`).

---

### 2. Setup Frontend

Buka jendela terminal baru dan arahkan ke direktori frontend:

```bash
cd nexa-clinic-frontend
```

#### A. Install Dependensi
```bash
npm install
```

#### B. Konfigurasi File `.env`
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Pastikan variabel `VITE_API_BASE_URL` mengarah ke URL backend:
```env
VITE_API_BASE_URL=http://localhost:4000/api
```

#### C. Menjalankan Frontend Development Server
```bash
npm run dev
```
Aplikasi frontend akan aktif di: `http://localhost:5173`. Buka alamat tersebut di browser untuk mengakses aplikasi.

---

## 📁 Struktur Project

### Frontend (`nexa-clinic-frontend/`)
```
nexa-clinic-frontend/
├── src/
│   ├── api/                   # Modul Axios client & fungsi pemanggilan endpoint API
│   │   ├── axiosClient.js     # Interceptor JWT token & error normalizer
│   │   ├── auth.api.js        # API login, logout, getMe
│   │   ├── dashboard.api.js   # API ringkasan metrik dashboard
│   │   ├── patients.api.js    # API kelola pasien
│   │   ├── registrations.api.js
│   │   ├── queues.api.js
│   │   ├── medicalRecords.api.js
│   │   ├── doctors.api.js
│   │   └── poli.api.js
│   ├── components/
│   │   ├── layout/            # AppLayout, Sidebar, Navbar / Header
│   │   └── ui/                # StatCard, Button, Input, Select, Modal, Badge, EmptyState, dll.
│   ├── context/
│   │   └── AuthContext.jsx    # Autentikasi global, manajemen sesi JWT & profil user
│   ├── hooks/                 # Custom React hooks & TanStack Query wrappers
│   │   ├── useAuth.js
│   │   ├── useDashboard.js
│   │   ├── usePatients.js
│   │   ├── useQueues.js
│   │   └── useRegistrations.js
│   ├── pages/
│   │   ├── auth/              # LoginPage (dengan demo accounts card & quick autofill)
│   │   ├── dashboard/         # DashboardPage (metrik klinik, antrean hari ini, status poli)
│   │   ├── patients/          # PatientsListPage & Form Pasien
│   │   ├── registrations/     # RegistrationsListPage & Pendaftaran Kunjungan
│   │   ├── queue/             # QueueBoardPage (Papan antrean & pemanggilan per poli)
│   │   ├── exams/             # ExamQueuePage & ExamFormModal (Pemeriksaan SOAP & Resep)
│   │   ├── history/           # ActivityHistoryPage (Riwayat kunjungan & rekam medis)
│   │   └── master-data/       # MasterDataPage (Manajemen Poli & Dokter khusus Admin)
│   ├── routes/                # ProtectedRoute & AppRoutes (Role-based access control)
│   └── utils/                 # statusMeta, formatters, navConfig, roles
├── .env.example
├── package.json
└── README.md
```

### Backend (`nexa-clinic-backend/`)
```
nexa-clinic-backend/
├── prisma/
│   ├── schema.prisma          # Skema database PostgreSQL (10 model, 5 enum)
│   └── seed.js                # Seeder akun, poli, dokter, dan 15 pasien demo
├── src/
│   ├── app.js                 # Inisialisasi Express, middleware global, router
│   ├── config/                # Prisma client singleton
│   ├── controllers/           # Request/response handler layer
│   ├── services/              # Pure business logic & database queries
│   ├── routes/                # REST API endpoints per entitas
│   ├── middlewares/           # JWT auth guard, role authorization, validator
│   ├── validators/            # Validasi input Zod schema
│   └── utils/                 # AppError, standard response builder, JWT helpers
├── .env.example
├── package.json
└── README.md
```

---

## 🔄 Alur Operasional Klinik (Workflow Demo)

Untuk mencoba alur lengkap operasional klinik dari awal hingga selesai:

1. **Login sebagai Petugas Pendaftaran** (`petugas@clinic.test` / `Petugas123!`):
   - Buka menu **Data Pasien** atau **Pendaftaran**.
   - Klik **Daftarkan Pasien Baru**, pilih pasien, tentukan Poli tujuan dan Dokter yang bertugas.
   - Pasien akan otomatis mendapatkan **Nomor Antrean** (misal `A001`) dengan status `MENUNGGU`.
   - Klik tombol **Check In**, lalu klik **Siap Periksa** (status berubah menjadi `PEMERIKSAAN`).

2. **Login sebagai Dokter** (`dokter@clinic.test` / `Dokter123!`):
   - Pada **Dashboard**, Anda langsung melihat antrean aktif khusus untuk poli Anda.
   - Masuk ke menu **Pemeriksaan**. Pasien yang siap diperiksa akan muncul di tabel.
   - Klik **Periksa** untuk membuka form SOAP:
     - **Subjective**: Keluhan pasien.
     - **Objective**: Tanda vital (Tekanan darah, Suhu, Berat badan, Tinggi badan).
     - **Assessment**: Diagnosa penyakit.
     - **Plan**: Rencana terapi/tindakan medis.
     - **Resep Obat (opsional)**: Tambahkan obat, dosis, jumlah, dan instruksi aturan pakai.
   - Klik **Simpan Pemeriksaan**. Status kunjungan & antrean otomatis selesai (`SELESAI`).

3. **Login sebagai Administrator** (`admin@clinic.test` / `Admin123!`):
   - Lihat statistik performa klinik pada **Dashboard**.
   - Kelola unit Poli dan Dokter di menu **Poli & Dokter**.
   - Pantau seluruh log rekam medis di menu **Riwayat Aktivitas**.
