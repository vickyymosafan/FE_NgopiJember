# Dokumentasi NgopiJember

Selamat datang di dokumentasi lengkap NgopiJember! Folder ini berisi panduan komprehensif untuk setiap fase pengembangan platform, dari MVP hingga scaling multi-kota.

## Struktur Dokumentasi

### Dokumentasi Fase

Setiap dokumen fase mencakup:

- **Tujuan** — Apa yang ingin dicapai di fase ini
- **Status** — Checklist fitur yang sudah selesai
- **Fitur Inti** — Penjelasan detail setiap fitur
- **Alur Pengguna** — Step-by-step penggunaan dari perspektif user
- **Endpoint API** — Tabel endpoint yang terlibat
- **Struktur Data** — Schema database dan relasi
- **Keputusan Arsitektur** — Mengapa kami memilih pendekatan tertentu
- **Contoh Interaksi** — Skenario nyata penggunaan
- **Catatan Implementasi** — Tips dan gotcha teknis
- **KPI** — Metrik keberhasilan fase

### Daftar Dokumen

| Dokumen | Topik | Estimasi Baca |
| --- | --- | --- |
| [PHASE_1_DIRECTORY.md](PHASE_1_DIRECTORY.md) | Homepage, Search, Filter, Detail, Map | 15 menit |
| [PHASE_2_COMMUNITY.md](PHASE_2_COMMUNITY.md) | Authentication, Reviews, Favorites, Profile | 20 menit |
| [PHASE_3_BUSINESS.md](PHASE_3_BUSINESS.md) | Claim, Owner Dashboard, Promotions | 15 menit |
| [PHASE_4_GROWTH.md](PHASE_4_GROWTH.md) | Trending, Popular Searches, Search Analytics | 15 menit |
| [PHASE_5_AI.md](PHASE_5_AI.md) | AI Assistant, Personalized Suggestions | 20 menit |
| [PHASE_6_SCALE.md](PHASE_6_SCALE.md) | Multi-city, Events, Communities | 15 menit |
| [POLISH_SEO_ACCESSIBILITY.md](POLISH_SEO_ACCESSIBILITY.md) | SEO, JSON-LD, PWA, A11y | 10 menit |
| [MOBILE_BOTTOM_SHEET.md](MOBILE_BOTTOM_SHEET.md) | Mobile filter UX | 10 menit |

**Total estimasi baca**: ~2 jam (untuk memahami seluruh arsitektur).

## Panduan Membaca

### Untuk Developer Baru

Jika Anda baru bergabung atau ingin memahami proyek dari nol:

1. **Mulai dari README utama** (`../README.md`) untuk overview.
2. **Baca PHASE_1_DIRECTORY.md** untuk memahami fondasi.
3. **Lanjutkan ke fase berikutnya** secara berurutan (setiap fase membangun di atas fase sebelumnya).
4. **Baca POLISH_SEO_ACCESSIBILITY.md** untuk memahami optimasi lintas fase.

### Untuk Feature-Specific Work

Jika Anda hanya ingin memahami atau mengubah fitur tertentu:

1. **Identifikasi fase** yang berisi fitur tersebut (lihat tabel di atas).
2. **Baca dokumen fase** terkait.
3. **Cek "Keputusan Arsitektur"** untuk memahami mengapa diimplementasi demikian.
4. **Cek "Contoh Interaksi"** untuk skenario penggunaan nyata.

### Untuk Audit atau Review

Jika Anda melakukan code review atau audit arsitektur:

1. **Baca semua dokumen fase** (skim "Tujuan" dan "Keputusan Arsitektur").
2. **Fokus ke "Struktur Data"** untuk memahami model.
3. **Cek "Endpoint API"** untuk memahami integrasi.
4. **Review "KPI"** untuk memahami metrik keberhasilan.

## Dokumen Teknis Lain

Selain dokumentasi fase, proyek ini memiliki dokumen teknis di root:

| Dokumen | Deskripsi |
| --- | --- |
| [`AGENT.md`](../AGENT.md) | Identitas proyek, visi, dan prinsip pengembangan |
| [`API_SPEC.md`](../API_SPEC.md) | Spesifikasi lengkap endpoint API (request/response) |
| [`DATABASE.md`](../DATABASE.md) | Schema database PostgreSQL (tabel, kolom, indeks) |
| [`DESIGN.md`](../DESIGN.md) | Panduan desain UI/UX (warna, tipografi, spacing) |
| [`FRONTEND_ARCHITECTURE.md`](../FRONTEND_ARCHITECTURE.md) | Arsitektur frontend Next.js (struktur folder, pola) |
| [`BACKEND_ARCHITECTURE.md`](../BACKEND_ARCHITECTURE.md) | Arsitektur backend NestJS (modul, service, controller) |
| [`ROADMAP.md`](../ROADMAP.md) | Roadmap pengembangan high-level |

## Konvensi Penulisan

Dokumentasi ini mengikuti konvensi:

- **Bahasa**: Indonesia (formal, teknis).
- **Format**: Markdown dengan heading hierarchy yang jelas.
- **Tabel**: Digunakan untuk data terstruktur (endpoint, field, KPI).
- **Code block**: Hanya untuk contoh JSON, SQL, atau pseudo-code (bukan implementasi aktual).
- **Diagram**: ASCII art untuk alur sederhana (tidak ada dependency ke tools eksternal).

## Kontribusi Dokumentasi

Jika Anda menemukan:

- **Informasi tidak akurat**: Buat issue dengan label `docs`.
- **Penjelasan kurang jelas**: Buat PR dengan perbaikan.
- **Fitur baru belum terdokumentasi**: Tambahkan ke dokumen fase terkait.

### Checklist Update Dokumentasi

Saat menambah atau mengubah fitur:

- [ ] Update "Status" di dokumen fase terkait.
- [ ] Tambahkan deskripsi di "Fitur Inti".
- [ ] Update "Endpoint API" jika ada endpoint baru.
- [ ] Update "Struktur Data" jika ada schema baru.
- [ ] Tambahkan "Contoh Interaksi" untuk fitur kompleks.
- [ ] Update KPI jika ada metrik baru.

## FAQ

### Q: Mengapa tidak ada kode di dokumentasi ini?

**A**: Dokumentasi ini fokus pada **konsep, alur, dan keputusan arsitektur**. Kode implementasi bisa berubah, tapi konsep tetap stabil. Untuk kode aktual, lihat langsung di folder `src/`.

### Q: Apakah dokumen ini sinkron dengan kode?

**A**: Ya, dokumen ini di-update setiap ada perubahan signifikan. Jika Anda menemukan ketidaksesuaian, buat issue.

### Q: Bolehkah saya share dokumen ini ke pihak luar?

**A**: Boleh, selama tidak mengandung informasi sensitif (API key, credentials). Dokumen ini adalah portofolio publik.

### Q: Bagaimana jika saya ingin menambahkan fase baru (Phase 7+)?

**A**: Buat dokumen baru `PHASE_7_[NAME].md` mengikuti struktur yang sama. Update tabel di dokumen ini dan `ROADMAP.md`.

## Lisensi

Dokumentasi ini dilisensikan di bawah [MIT License](../LICENSE), sama seperti kode proyek.

---

**Terakhir diupdate**: 15 Juni 2026  
**Versi**: 1.0.0 (post-Phase 6)  
**Maintainer**: NgopiJember Team