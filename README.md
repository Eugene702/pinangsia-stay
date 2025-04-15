# 🏠 Pinangsia Stay App

Aplikasi manajemen penginapan berbasis web menggunakan Next.js, Prisma, dan PostgreSQL.

## 🚀 Langkah Instalasi

1. Install dependency
2. Duplikat `.env.example` menjadi `.env`
3. Isi semua nilai (`VALUE`) di dalam `.env`
4. Jalankan migrasi dan seeder
5. Jalankan aplikasi

### 📦 Perintah Lengkap

```bash
# Install dependencies
npm install

# Duplikat file environment
cp .env.example .env

# Jalankan migrasi database
npx prisma migrate dev

# Jalankan seeder untuk data awal
npx prisma db seed

# Jalankan aplikasi
npm run dev