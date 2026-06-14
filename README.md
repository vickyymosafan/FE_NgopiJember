# NgopiJember

> Temukan setiap coffee shop di Jember — dan segera di seluruh Jawa Timur.

NgopiJember adalah platform discovery coffee shop berbasis lokasi yang dirancang khusus untuk pecinta kopi di Jember dan sekitarnya. Cari berdasarkan fasilitas, suasana, distrik, atau cukup tanyakan langsung ke asisten AI kami.

## Daftar Isi

- [Tentang Proyek](#tentang-proyek)
- [Fitur Unggulan](#fitur-unggulan)
- [Tangkapan Layar](#tangkapan-layar)
- [Tumpukan Teknologi](#tumpukan-teknologi)
- [Memulai](#memulai)
- [Struktur Proyek](#struktur-proyek)
- [Dokumentasi Fase](#dokumentasi-fase)
- [Pengujian](#pengujian)
- [Kontribusi](#kontribusi)
- [Lisensi](#lisensi)

## Tentang Proyek

NgopiJember lahir dari kebutuhan sederhana: menemukan coffee shop yang tepat untuk suasana yang tepat. Apakah Anda butuh tempat nugas dengan wifi kencang, cafe 24 jam, atau lokasi meeting yang tenang — platform ini menyatukan semuanya dalam satu pengalaman yang cepat dan menyenangkan.

Platform ini dirancang sebagai **proyek portofolio full-stack modern** yang menunjukkan praktik terbaik pengembangan web di tahun 2026: arsitektur Next.js 16 dengan React 19, NestJS 11 di backend, PostgreSQL via Supabase, dan pendekatan "API-first" yang konsisten.

## Fitur Unggulan

### Untuk Pengunjung

- Pencarian canggih dengan filter fasilitas, distrik, harga, rating, dan status buka.
- Peta interaktif berbasis OpenStreetMap dengan marker cluster.
- Asisten AI natural language: "Cafe wifi dekat UNEJ buka 24 jam".
- Rekomendasi personal berdasarkan favorit dan ulasan Anda.
- Coffee shop trending dan pencarian populer minggu ini.
- Sistem favorit dan ulasan dengan unggah foto.

### Untuk Pemilik Coffee Shop

- Klaim kepemilikan coffee shop dengan verifikasi admin.
- Dashboard owner untuk mengelola informasi coffee shop.
- Manajemen promosi dengan rentang tanggal.
- Analitik ringkas: views, rating rata-rata, jumlah ulasan.

### Untuk Admin

- CRUD coffee shop lengkap dengan galeri dan fasilitas.
- Review klaim kepemilikan (setuju/tolak).
- Search analytics: istilah populer, volume pencarian, tren.
- Manajemen pengguna.

## Tangkapan Layar

> Tambahkan tangkapan layar di folder `docs/screenshots/` setelah deployment pertama:
> - `home.png` — Beranda dengan hero search
> - `search.png` — Halaman pencarian dengan filter sidebar
> - `search-mobile.png` — Bottom-sheet filter di mobile
> - `detail.png` — Detail coffee shop dengan galeri
> - `map.png` — Peta interaktif dengan cluster
> - `ai-chat.png` — Asisten AI mengobrol
> - `admin.png` — Dashboard admin

## Tumpukan Teknologi

### Frontend (`/frontend`)

| Kategori | Teknologi |
| --- | --- |
| Framework | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS v4, Framer Motion 11 |
| UI Components | Shadcn-style manual components |
| State & Data | TanStack Query v5 |
| Forms | React Hook Form, Zod 4 |
| Maps | React Leaflet, Leaflet MarkerCluster |
| Icons | Lucide React |

### Backend (`/backend`)

| Kategori | Teknologi |
| --- | --- |
| Framework | NestJS 11, TypeScript |
| ORM | Drizzle ORM |
| Auth | JWT (httpOnly cookie via Next proxy) |
| Docs | Swagger |
| Storage | Supabase Storage |

### Infrastruktur

| Komponen | Layanan |
| --- | --- |
| Database | PostgreSQL (Supabase) |
| File Storage | Supabase Storage |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |
| Tile Peta | OpenStreetMap |

## Memulai

### Prasyarat

- Node.js 20+ (direkomendasikan 22 LTS)
- npm 10+
- Git

### Instalasi Cepat

1. **Clone repositori**

   ```bash
   git clone https://github.com/vickymosafan/ngopijember.git
   cd ngopijember
   ```

2. **Setup frontend**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   Frontend akan berjalan di `http://localhost:3000` dalam mode mock (data dummy, tidak memerlukan backend).

3. **Setup backend** (opsional untuk development awal)

   ```bash
   cd backend
   npm install
   npm run start:dev
   ```

4. **Variabel lingkungan**

   Salin `.env.example` ke `.env.local` di folder `frontend` dan sesuaikan:

   | Variabel | Nilai default | Keterangan |
   | --- | --- | --- |
   | `NEXT_PUBLIC_USE_MOCK` | `true` | Gunakan data mock alih-alih backend |
   | `NEXT_PUBLIC_API_URL` | `/api/v1` | URL backend |
   | `NEXT_PUBLIC_SITE_URL` | `https://ngopijember.id` | URL publik untuk SEO |

### Akun Mock

Untuk development, gunakan kredensial berikut (mode mock):

| Peran | Email | Kata Sandi |
| --- | --- | --- |
| Admin | `user@ngopijember.id` | `Password123` |
| Owner | `owner@ngopijember.id` | `Password123` |

Setelah login sebagai admin, Anda dapat menyetujui klaim kepemilikan untuk `owner@ngopijember.id` dan kemudian login sebagai owner untuk mengakses dashboard owner.

### Perintah Penting

```bash
# Frontend
npm run dev          # Jalankan development server
npm run build        # Build produksi
npm run start        # Jalankan build produksi
npm run lint         # Pemeriksaan ESLint
npm test             # Jalankan unit test (Vitest)
npm run test:watch   # Vitest mode watch

# Backend
npm run start:dev    # Development server
npm run build        # Build produksi
npm run test         # Unit test
npm run test:e2e     # End-to-end test
```

## Struktur Proyek

```
NgopiJember/
├── frontend/                 # Aplikasi Next.js 16
│   ├── src/
│   │   ├── app/              # Route handler & halaman
│   │   ├── components/       # UI & shared components
│   │   ├── features/         # Feature-driven modules
│   │   │   ├── admin/
│   │   │   ├── ai/
│   │   │   ├── auth/
│   │   │   ├── claim/
│   │   │   ├── city/
│   │   │   ├── coffee-shop/
│   │   │   ├── community/
│   │   │   ├── event/
│   │   │   ├── favorite/
│   │   │   ├── growth/
│   │   │   ├── home/
│   │   │   ├── map/
│   │   │   ├── owner/
│   │   │   ├── profile/
│   │   │   ├── review/
│   │   │   ├── search/
│   │   │   └── seo/
│   │   ├── lib/              # Utilitas (api-client, env, cn)
│   │   ├── providers/        # React context providers
│   │   ├── constants/
│   │   └── types/
│   ├── public/
│   └── package.json
│
├── backend/                  # Aplikasi NestJS 11
│   ├── src/
│   │   ├── auth/
│   │   ├── coffee-shops/
│   │   ├── reviews/
│   │   ├── favorites/
│   │   ├── uploads/
│   │   └── admin/
│   └── package.json
│
├── docs/                     # Dokumentasi per fase
│   ├── README.md             # Index dokumentasi
│   ├── PHASE_1_DIRECTORY.md
│   ├── PHASE_2_COMMUNITY.md
│   ├── PHASE_3_BUSINESS.md
│   ├── PHASE_4_GROWTH.md
│   ├── PHASE_5_AI.md
│   ├── PHASE_6_SCALE.md
│   ├── POLISH_SEO_ACCESSIBILITY.md
│   └── MOBILE_BOTTOM_SHEET.md
│
├── AGENT.md                  # Identitas & visi proyek
├── API_SPEC.md               # Spesifikasi API
├── DATABASE.md               # Skema database
├── DESIGN.md                 # Panduan desain UI/UX
├── FRONTEND_ARCHITECTURE.md  # Arsitektur frontend
├── BACKEND_ARCHITECTURE.md   # Arsitektur backend
├── ROADMAP.md                # Roadmap pengembangan
├── LICENSE                   # Lisensi MIT (c) vickymosafan
├── LICENSE.id.md             # Terjemahan lisensi (tidak resmi)
└── README.md                 # Anda di sini
```

Setiap folder `feature` mengikuti pola self-contained:

```
features/<nama-fitur>/
├── components/       # Komponen UI spesifik fitur
├── services/         # Service layer (panggil route handler Next)
├── queries/          # TanStack Query hooks
├── types/            # Type definitions
├── schemas/          # Zod validation schemas
├── constants/        # Konstanta & mock data
└── lib/              # Helper functions
```

## Dokumentasi Fase

Dokumentasi detail per fase pengembangan tersedia di folder `docs/`:

| Dokumen | Topik |
| --- | --- |
| [PHASE_1_DIRECTORY.md](docs/PHASE_1_DIRECTORY.md) | Homepage, Search, Filter, Detail, Map |
| [PHASE_2_COMMUNITY.md](docs/PHASE_2_COMMUNITY.md) | Authentication, Reviews, Favorites, Profile |
| [PHASE_3_BUSINESS.md](docs/PHASE_3_BUSINESS.md) | Claim, Owner Dashboard, Promotions |
| [PHASE_4_GROWTH.md](docs/PHASE_4_GROWTH.md) | Trending, Popular Searches, Search Analytics |
| [PHASE_5_AI.md](docs/PHASE_5_AI.md) | AI Assistant, Personalized Suggestions |
| [PHASE_6_SCALE.md](docs/PHASE_6_SCALE.md) | Multi-city, Events, Communities |
| [POLISH_SEO_ACCESSIBILITY.md](docs/POLISH_SEO_ACCESSIBILITY.md) | SEO, JSON-LD, PWA, A11y |
| [MOBILE_BOTTOM_SHEET.md](docs/MOBILE_BOTTOM_SHEET.md) | Mobile filter UX |

Lihat [docs/README.md](docs/README.md) untuk panduan membaca dokumentasi dan FAQ.

## Pengujian

```bash
# Unit tests (Vitest) — frontend
cd frontend
npm test

# Coverage report
npm test -- --coverage
```

Cakupan test saat ini:

- 55 unit tests frontend (9 file test)
- Skema Zod: auth, review, admin, promotion, claim
- Service layer: coffee-shop, review, favorite, opening-hours, AI NL parser, recommendation engine
- Target coverage: 80% statement coverage di service & schema layer

## Kontribusi

Proyek ini dikembangkan sebagai portofolio solo oleh **vickymosafan**, namun saran, issue, dan pull request tetap diterima dengan senang hati.

1. Fork repositori
2. Buat branch fitur (`git checkout -b feature/nama-fitur`)
3. Commit perubahan (`git commit -m 'feat: tambahkan fitur X'`)
4. Push ke branch (`git push origin feature/nama-fitur`)
5. Buka Pull Request

### Konvensi Commit

Mengikuti [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` fitur baru
- `fix:` perbaikan bug
- `docs:` perubahan dokumentasi
- `style:` formatting, tidak ada perubahan logika
- `refactor:` perubahan kode tanpa mengubah perilaku
- `test:` menambah atau memperbaiki test
- `chore:` tugas maintenance

## Lisensi

Proyek ini dilisensikan di bawah **MIT License** — lihat file [LICENSE](LICENSE) untuk detail lengkap.

```
MIT License
Copyright (c) 2026 vickymosafan
```

Anda bebas menggunakan, memodifikasi, dan mendistribusikan proyek ini untuk keperluan apa pun, komersial maupun non-komersial, dengan syarat mencantumkan pemberitahuan hak cipta asli.

> Tersedia juga [terjemahan tidak resmi dalam Bahasa Indonesia](LICENSE.id.md).

---

Dibangun dengan ☕ di Jember, Jawa Timur oleh [vickymosafan](https://github.com/vickymosafan).