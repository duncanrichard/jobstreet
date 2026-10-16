# JobStreat

JobStreat adalah aplikasi pencarian lowongan kerja dengan autentikasi email dan
password berbasis PostgreSQL.

## Prasyarat

- Node.js 22 atau lebih baru
- PostgreSQL lokal

## Konfigurasi database

Salin `.env.example` menjadi `.env.local`, lalu isi kredensial PostgreSQL:

```env
POSTGRES_DB=job_streat
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password_database_anda
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
DATABASE_URL=postgresql://postgres:password_database_anda@localhost:5432/job_streat
```

Jika password berisi karakter seperti `@`, `:`, `/`, `?`, atau `#`, nilai pada
`DATABASE_URL` harus diubah ke format URL-encoded.

## Migration

Buat database `job_streat`, lalu jalankan migration Prisma:

```bash
npm run db:migrate
```

Migration membuat:

- tabel `users` dengan UUID, email unik, hash password, dan role akun;
- tabel `sessions` dengan UUID dan relasi ke pengguna;
- enum `UserRole` untuk `applicant` dan `recruiter`.

Untuk membuat migration baru setelah mengubah `prisma/schema.prisma`:

```bash
npm run db:migrate:dev -- --name nama_perubahan
```

## Menjalankan aplikasi

```bash
npm install
npm run dev
```

Buka alamat lokal yang ditampilkan terminal, biasanya `http://127.0.0.1:5173`.

## Autentikasi

- Pendaftaran dan login menggunakan email yang sama, termasuk alamat Gmail.
- Password disimpan sebagai hash PBKDF2 dengan salt.
- Email dibuat unik dan dinormalisasi ke huruf kecil.
- Sesi login disimpan pada cookie HttpOnly.
- Tombol Google tetap ada sebagai tampilan; Google OAuth dapat diaktifkan setelah
  Client ID dan Client Secret Google tersedia.
