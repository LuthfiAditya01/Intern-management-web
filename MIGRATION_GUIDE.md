# Panduan Migrasi MongoDB ke PostgreSQL

## Langkah-langkah Migrasi

### 1. Persiapan Database PostgreSQL

1. **Install PostgreSQL** di sistem Anda
2. **Buat database baru**:
   ```sql
   CREATE DATABASE intern_management;
   ```

### 2. Setup Environment Variables

Buat file `.env` dengan konfigurasi berikut:

```env
# PostgreSQL Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=intern_management
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password

# MongoDB (untuk migrasi data)
MONGO_URI=mongodb://localhost:27017/your_mongodb_database

# Firebase Configuration (existing)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# Firebase Admin
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
```

### 3. Install Dependencies

```bash
npm install pg @types/pg sequelize sequelize-cli
```

### 4. Struktur Model Baru

Model PostgreSQL yang telah dibuat:

- **User.js** - Model untuk user dengan role (admin, mentor, intern)
- **Mentor.js** - Model untuk data mentor/pembimbing
- **Intern.js** - Model untuk data intern/mahasiswa magang
- **Assessment.js** - Model untuk penilaian intern
- **Quota.js** - Model untuk manajemen kuota

### 5. Jalankan Migrasi Data

```bash
npm run migrate
```

Script ini akan:
- Mengambil data dari MongoDB
- Membuat user baru di PostgreSQL
- Migrasi data mentor
- Migrasi data intern
- Migrasi data assessment
- Migrasi data quota

### 6. Update API Routes

API routes yang telah diupdate:
- `/api/users/route.js` - Menggunakan PostgreSQL
- `/api/intern/route.js` - Menggunakan PostgreSQL

### 7. Testing

1. **Test koneksi database**:
   ```bash
   npm run dev
   ```

2. **Test API endpoints**:
   - GET `/api/users` - Ambil semua users
   - GET `/api/intern` - Ambil data intern
   - POST `/api/intern` - Tambah intern baru

### 8. Perubahan Utama

#### Database Schema
- **MongoDB**: Document-based dengan ObjectId
- **PostgreSQL**: Relational dengan UUID sebagai primary key

#### Associations
- User ↔ Mentor (One-to-One)
- User ↔ Intern (One-to-One)
- Mentor ↔ Intern (One-to-Many)
- Intern ↔ Assessment (One-to-Many)

#### Query Changes
- **MongoDB**: `find()`, `findOne()`, `populate()`
- **PostgreSQL**: `findAll()`, `findOne()`, `include`

### 9. Troubleshooting

#### Error: Connection refused
- Pastikan PostgreSQL server berjalan
- Cek konfigurasi host dan port

#### Error: Database does not exist
- Buat database terlebih dahulu
- Cek nama database di environment variables

#### Error: Authentication failed
- Cek username dan password PostgreSQL
- Pastikan user memiliki akses ke database

#### Error: Migration failed
- Backup data MongoDB terlebih dahulu
- Cek struktur data di MongoDB
- Sesuaikan script migrasi jika diperlukan

### 10. Rollback Plan

Jika migrasi gagal, Anda dapat:

1. **Kembali ke MongoDB**:
   - Hapus file model PostgreSQL
   - Restore API routes lama
   - Uninstall dependencies PostgreSQL

2. **Partial rollback**:
   - Drop database PostgreSQL
   - Jalankan ulang migrasi dengan data yang sudah dibersihkan

### 11. Performance Considerations

#### Indexes
- Primary keys otomatis ter-index
- Foreign keys otomatis ter-index
- Tambahkan index untuk field yang sering di-query

#### Connection Pooling
- Sequelize sudah mengatur connection pooling
- Sesuaikan konfigurasi pool sesuai kebutuhan

### 12. Security

1. **Environment Variables**: Jangan commit file `.env`
2. **Database Access**: Batasi akses database hanya untuk aplikasi
3. **Password Hashing**: Tetap menggunakan bcrypt untuk password
4. **Input Validation**: Validasi input di level application

### 13. Monitoring

1. **Database Logs**: Monitor PostgreSQL logs
2. **Application Logs**: Monitor error logs aplikasi
3. **Performance**: Monitor query performance
4. **Backup**: Setup regular backup PostgreSQL

## Catatan Penting

- **Backup data MongoDB** sebelum migrasi
- **Test di environment development** terlebih dahulu
- **Update semua API routes** yang menggunakan MongoDB
- **Update frontend** jika ada perubahan response format
- **Monitor aplikasi** setelah migrasi selesai 