# TPQ Digital MVP

Sistem Informasi TPQ Digital dengan Google Sheets sebagai database.

## Fitur yang Sudah Dibuat

- ✅ Login Admin (sederhana)
- ✅ Dashboard dengan statistik
- ✅ CRUD Data Santri (Create, Read, Update, Deactivate, Search)
- ✅ CRUD Data Guru
- ✅ CRUD Data Kelas
- ✅ Responsive design (mobile-friendly)
- ✅ Google Sheets sebagai database

## Cara Menjalankan

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Copy file `.env.example` menjadi `.env.local`:

```bash
copy .env.example .env.local
```

Isi dengan kredensial Google Sheets Anda:

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"
GOOGLE_SPREADSHEET_ID=your-spreadsheet-id-here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Jalankan Development Server

```bash
npm run dev
```

Buka http://localhost:3000 di browser.

### 4. Login

- Username: `admin`
- Password: `admin123`

## Struktur Google Sheets

Buat Google Spreadsheet dengan sheet-sheet berikut:

### Sheet: Config
| key | value |
|-----|-------|
| nama_tpq | TPQ Al-Hidayah |
| alamat | Jl. Contoh No. 123 |
| logo_url | |
| tahun_ajaran | 2024/2025 |

### Sheet: Santri
| ID_Santri | NIS | Nama | Jenis_Kelamin | Tanggal_Lahir | Nama_Wali | No_WA | ID_Kelas | Status | Access_Token | Created_At | Updated_At |
|-----------|-----|------|---------------|---------------|-----------|-------|----------|--------|-------------|------------|------------|

### Sheet: Guru
| ID_Guru | Nama | No_WA | Email | Status | Created_At |
|---------|------|-------|-------|--------|------------|

### Sheet: Kelas
| ID_Kelas | Nama_Kelas | ID_Guru | Hari | Jam | Status |
|----------|------------|---------|------|-----|--------|

### Sheet: Absensi
| ID_Absensi | Tanggal | ID_Santri | ID_Kelas | Status | ID_Guru | Catatan | Created_At |
|------------|---------|-----------|----------|--------|---------|---------|------------|

### Sheet: Progress
| ID_Progress | Tanggal | ID_Santri | Kategori | Materi | Status | Catatan | ID_Guru | Created_At |
|-------------|---------|-----------|----------|--------|--------|---------|---------|------------|

### Sheet: Hafalan
| ID_Hafalan | ID_Santri | Tanggal | Surah | Status | Catatan | ID_Guru | Created_At |
|------------|-----------|---------|-------|--------|---------|---------|------------|

### Sheet: Catatan
| ID_Catatan | ID_Santri | Tanggal | ID_Guru | Catatan | Tampil_Ke_Wali | Created_At |
|------------|-----------|---------|---------|---------|----------------|------------|

### Sheet: Iuran
| ID_Iuran | ID_Santri | Bulan | Jenis | Nominal | Status | Tanggal_Bayar | Catatan | Created_At |
|---------|-----------|-------|-------|---------|--------|---------------|---------|------------|

### Sheet: Pengumuman
| ID_Pengumuman | Judul | Isi | Tanggal_Publish | Tanggal_Expired | Status | Created_By | Created_At |
|---------------|-------|-----|-----------------|-----------------|--------|------------|------------|

## Cara Setup Google Sheets

### 1. Buat Google Cloud Project

1. Buka https://console.cloud.google.com/
2. Buat project baru
3. Enable Google Sheets API
4. Buat Service Account
5. Download JSON key file
6. Share spreadsheet dengan service account email

### 2. Buat Spreadsheet

1. Buat Google Spreadsheet baru
2. Copy spreadsheet ID dari URL
3. Share spreadsheet dengan service account email (sebagai Editor)

### 3. Setup Environment Variables

Isi `.env.local` dengan kredensial dari service account JSON key.

## Struktur Folder

```
src/
├── app/
│   ├── api/              # API routes (backend)
│   │   ├── santri/       # API untuk data santri
│   │   ├── guru/         # API untuk data guru
│   │   └── kelas/        # API untuk data kelas
│   ├── dashboard/        # Halaman dashboard
│   ├── santri/           # Halaman data santri
│   ├── guru/             # Halaman data guru
│   ├── kelas/            # Halaman data kelas
│   ├── login/            # Halaman login
│   └── layout.tsx        # Root layout
├── components/
│   ├── layout/           # Layout components (Sidebar, Header, AdminLayout)
│   └── ui/               # UI components (Button, Card, Modal, dll)
├── services/             # Business logic & database access
│   ├── googleSheets.ts   # Koneksi ke Google Sheets
│   ├── studentService.ts # Logic untuk santri
│   ├── teacherService.ts # Logic untuk guru
│   └── classService.ts   # Logic untuk kelas
└── types/                # TypeScript types
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Google Sheets API
- **Authentication**: LocalStorage (MVP)

## Catatan Penting

1. **Google Sheets belum dikonfigurasi**: Anda perlu setup Google Sheets API terlebih dahulu sebelum data bisa disimpan/dibaca
2. **Authentication sederhana**: Login masih menggunakan hardcoded username/password untuk MVP
3. **Belum ada validasi Google Sheets**: Pastikan spreadsheet sudah dibuat dengan sheet-sheet yang diperlukan

## Next Steps (Belum Diimplementasikan)

- [ ] Absensi
- [ ] Perkembangan Mengaji
- [ ] Hafalan
- [ ] Catatan Guru
- [ ] Iuran
- [ ] Pengumuman
- [ ] Portal Orang Tua
- [ ] Guru interface
