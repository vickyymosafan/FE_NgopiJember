# Phase 5 — AI

> Memberikan pengalaman discovery yang natural lewat AI Assistant dan personalized suggestions.

## Tujuan

Mengubah interaksi dari "filter-based" menjadi "conversation-based":

1. **AI Search Assistant** — Chatbot floating untuk pertanyaan natural language.
2. **Natural Language Parser** — Parsing intent user ke filter terstruktur.
3. **Personalized Suggestions** — Saran berbasis interaksi user (favorit, review).
4. **Contextual Recommendations** — Saran muncul di waktu & tempat yang tepat.

## Status

| Kriteria | Status |
| --- | --- |
| AI chat floating bubble | ✅ |
| NL parser (facility, district, price, 24h, rating) | ✅ |
| Quick prompts (4 saran awal) | ✅ |
| Chat history di session | ✅ |
| Personalized suggestions (berbasis favorit) | ✅ |
| Section rekomendasi di homepage | ✅ |

## Fitur Inti

### 1. AI Chat Assistant

**Komponen floating** yang muncul di semua halaman:

- **Mobile**: Bottom-right, di atas bottom nav.
- **Desktop**: Bottom-right, offset dari edge.
- Toggle dengan tombol "Tanya AI" (ikon Bot + label).

**Drawer chat** (saat dibuka):

- Header: Ikon Bot + "Asisten NgopiJember" + tombol X.
- Area pesan: Scrollable, bubble user di kanan (aksen), bubble assistant di kiri (muted).
- Quick prompts (saat kosong): 4 pill pertanyaan umum.
- Loading state: "Asisten sedang berpikir..." dengan ikon MessageCircle pulse.
- Input area: Text input + tombol Send (disabled jika kosong atau pending).

**Quick prompts**:

| Prompt | Intent |
| --- | --- |
| "Cari coffee shop wifi kencang" | Facility: wifi |
| "Cafe murah buat nugas" | Price: 1, Facility: study-friendly |
| "Cafe buka 24 jam" | openNow: true |
| "Dekat UNEJ" | District: Sumbersari |

**Komponen**: `AiChatBubble` (layout.tsx global).

### 2. Natural Language Parser

Modul yang menerjemahkan pertanyaan natural language ke `CoffeeShopQuery` terstruktur.

**Input**: String pertanyaan user (lowercase).

**Output**:

```typescript
interface ParsedIntent {
  filters: CoffeeShopQuery
  keywords: string[]
  summary: string
}
```

**Deteksi yang didukung**:

| Kategori | Keyword → Filter |
| --- | --- |
| Fasilitas | "wifi", "wi-fi", "internet" → `facility: "wifi"` |
| | "stop kontak", "power", "colokan" → `facility: "power-outlet"` |
| | "nugas", "belajar", "kuliah", "kerja" → `facility: "study-friendly"` |
| | "outdoor", "luar", "taman" → `facility: "outdoor"` |
| | "indoor", "dalam", "ac" → `facility: "indoor"` |
| | "parkir", "parking", "mobil" → `facility: "parking"` |
| | "meeting", "rapat", "diskusi" → `facility: "meeting-area"` |
| Distrik | "unej", "kampus", "universitas", "tegal boto" → `district: "Sumbersari"` |
| | "sumbersari" → `district: "Sumbersari"` |
| | "patrang" → `district: "Patrang"` |
| Harga | "murah", "hemat", "budget" → `priceRange: 1` |
| | "premium", "mewah", "mahal" → `priceRange: 4` |
| 24 jam | "24 jam", "24 hours", "buka 24", "sepanjang hari" → `openNow: true` |
| Rating | "rating", "terbaik", "tertinggi" → `rating: 4.5` |
| Search | Sisa teks (min 3 karakter) jika tidak ada facility match → `search: "..."` |

**Contoh parsing**:

```
Input: "Cari cafe wifi dekat UNEJ yang buka 24 jam"
       │
       ▼
   Lowercase: "cari cafe wifi dekat unej yang buka 24 jam"
       │
       ▼
   Facility match: "wifi" → facility: "wifi"
   District match: "unej" → district: "Sumbersari"
   24h match: "24 jam" → openNow: true
   Leftover: "cafe dekat yang buka" (dibuang, tidak informatif)
       │
       ▼
   Output:
   {
     filters: {
       facility: "wifi",
       district: "Sumbersari",
       openNow: true
     },
     keywords: ["wifi", "district:Sumbersari", "24jam"],
     summary: "Oke, saya carikan coffee shop fasilitas wifi, di Sumbersari, buka 24 jam."
   }
```

**Modul**: `src/features/ai/lib/nl-parser.ts` (pure function, mudah di-test).

### 3. Chat Flow

**Endpoint**: `POST /api/ai/chat`

**Request**:

```json
{
  "message": "Cari cafe wifi dekat UNEJ",
  "history": [
    { "role": "user", "content": "Halo" },
    { "role": "assistant", "content": "Hai! Ada yang bisa saya bantu?" }
  ]
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "reply": "Oke, saya carikan coffee shop fasilitas wifi, di Sumbersari. Saya menemukan 6 coffee shop. Ini beberapa yang paling cocok untuk Anda:",
    "shops": [
      { "id": "mock-01", "name": "Perasa Coffee & Eatery", ... },
      { "id": "mock-02", "name": "Discuss Space & Coffee", ... },
      ...
    ],
    "filtersApplied": {
      "facility": "wifi",
      "district": "Sumbersari"
    }
  }
}
```

**Alur server mock**:

1. Parse message dengan `parseNaturalLanguage()`.
2. Filter `MOCK_COFFEE_SHOPS` berdasarkan `parsed.filters`.
3. Sort by trending (rating × reviewCount).
4. Ambil top 6.
5. Generate reply dari `parsed.summary`.
6. Append ke `MOCK_CHAT_HISTORY`.

### 4. Personalized Suggestions

Section "Rekomendasi untuk Anda" yang hanya muncul di homepage **jika user login**.

**Algoritma**:

```javascript
// Step 1: Ambil data interaksi user
const favoriteIds = Set(user.favorites)
const reviewedIds = Set(user.reviews)
const interactedIds = favoriteIds ∪ reviewedIds

// Step 2: Hitung preferensi dari favorit
const facilityPrefs = new Map<facilityId, count>()
const districtPrefs = new Map<district, count>()

for (const favShop of favorites) {
  for (const facility of favShop.facilities) {
    facilityPrefs.set(facility.id, facilityPrefs.get(facility.id) + 1)
  }
  districtPrefs.set(favShop.district, districtPrefs.get(favShop.district) + 1)
}

// Step 3: Score setiap coffee shop (yang belum di-interact)
for (const shop of allShops) {
  if (interactedIds.has(shop.id)) continue
  
  let score = 0
  for (const facility of shop.facilities) {
    score += facilityPrefs.get(facility.id) ?? 0
  }
  score += (districtPrefs.get(shop.district) ?? 0) × 2
  score += shop.rating × 0.5
  
  results.push({ shop, score })
}

// Step 4: Ambil top N
results.sort((a, b) => b.score - a.score)
const suggested = results.slice(0, 4)
```

**Tampilan di homepage**:

- Section "Berdasarkan coffee shop favorit Anda" (top 4 dari scoring).
- Section "Sedang trending di Jember" (top 4 trending, exclude interacted).

**Endpoint**: `GET /api/ai/suggestions` (auth required).

**Komponen**: `PersonalizedSuggestions` (homepage only).

## Alur Pengguna

### Tamu Bertanya ke AI

1. Tamu buka homepage.
2. Lihat floating button "Tanya AI" di pojok kanan bawah.
3. Klik → drawer terbuka dengan 4 quick prompts.
4. Klik "Cari coffee shop wifi kencang".
5. Bubble user muncul: "Cari coffee shop wifi kencang".
6. Loading state "Asisten sedang berpikir..." (1-2 detik).
7. Bubble assistant muncul: "Oke, saya carikan coffee shop fasilitas wifi. Saya menemukan 6 coffee shop. Ini beberapa yang paling cocok untuk Anda:"
8. 3 card coffee shop muncul di bawah bubble assistant: Perasa, Discuss, Grand Cafe.
9. Klik card → pindah ke detail page.

### Personalized Suggestions (Login)

1. User login.
2. Buka homepage.
3. Scroll ke bawah → section "Berdasarkan coffee shop favorit Anda".
4. 4 card muncul, semuanya coffee shop yang mirip dengan favorit user.
5. Klik card → detail → tambahkan ke favorit.
6. Refresh homepage → section ter-update dengan saran baru.

### Percakapan Multi-Turn

```
User: "Cari cafe buat nugas"
AI: "Oke, saya carikan coffee shop fasilitas study-friendly. Saya menemukan 4 coffee shop."
[Cards: Perasa, Nugas Jember, Kopi Kampus, Kopikuy]

User: "Yang di Sumbersari saja"
AI: "Oke, saya carikan coffee shop fasilitas study-friendly, di Sumbersari. Saya menemukan 4 coffee shop."
[Cards: Perasa, Nugas Jember, Kopi Kampus, Kopikuy] (sama, karena semua memang di Sumbersari)

User: "Buka 24 jam?"
AI: "Oke, saya carikan coffee shop fasilitas study-friendly, di Sumbersari, buka 24 jam. Saya menemukan 2 coffee shop."
[Cards: Perasa, Nugas Jember] (Kopi Kampus & Kopikuy bukan 24 jam)
```

## Endpoint API

### AI Chat

| Metode | Path | Deskripsi |
| --- | --- | --- |
| POST | `/api/ai/chat` | Kirim pesan, terima reply + shops |
| GET | `/api/ai/chat` | Ambil riwayat chat (mock only) |

### AI Suggestions

| Metode | Path | Deskripsi |
| --- | --- | --- |
| GET | `/api/ai/suggestions` | Saran personal (auth required) |

## Struktur Data

### ChatMessage

| Field | Tipe |
| --- | --- |
| id | String |
| role | Enum: "user", "assistant" |
| content | String |
| createdAt | Timestamp |
| shops | Array<CoffeeShop> (opsional, hanya untuk assistant) |

### ChatRequest

| Field | Tipe |
| --- | --- |
| message | String |
| history | Array<{role, content}> (opsional) |

### ChatResponse

| Field | Tipe |
| --- | --- |
| reply | String (narasi) |
| shops | Array<CoffeeShop> (top N) |
| filtersApplied | Record<string, unknown> (debug info) |

### PersonalizedSuggestion

| Field | Tipe |
| --- | --- |
| reason | String ("Berdasarkan favorit Anda", "Sedang trending") |
| shops | Array<CoffeeShop> |

## Keputusan Arsitektur

### Rule-Based NL Parser (MVP)

**Kenapa bukan LLM sungguhan di awal?**

- LLM butuh API key, biaya, latency (1-3 detik).
- Domain sempit: coffee shop di Jember, query terbatas.
- Rule-based cukup untuk MVP, bisa di-swap nanti.

**Strategi swap ke LLM**:

- Backend NestJS expose endpoint yang sama (`POST /api/ai/chat`).
- Ganti implementasi: rule-based → call OpenAI/Claude API dengan system prompt.
- Frontend tidak berubah.

**System prompt untuk LLM (future)**:

```
Anda adalah asisten NgopiJember yang membantu pengguna menemukan coffee shop 
di Jember. Jawab dalam Bahasa Indonesia yang ramah dan singkat.

Ketika pengguna meminta rekomendasi, gunakan tools yang tersedia untuk 
mencari coffee shop berdasarkan filter: facility, district, priceRange, 
openNow, rating.

Selalu jelaskan filter apa yang Anda gunakan sebelum menampilkan hasil.
```

### Floating Bubble Global

**Kenapa bubble di-layout global, bukan per halaman?**

- AI assistant adalah fitur cross-cutting, seperti search bar.
- User bisa bertanya dari halaman mana saja.
- State chat (drawer open/close) di-handle component-local.

**Trade-off**: Drawer tidak tersedia di halaman admin/owner (layout berbeda). Ini acceptable karena AI assistant untuk pengunjung publik.

### Chat History In-Memory

**Kenapa riwayat chat tidak persisten?**

- MVP: cukup untuk sesi browser aktif.
- Jika user refresh, chat hilang.
- Backend mock menyimpan di `MOCK_CHAT_HISTORY`, tapi ini reset saat server restart.

**Future**: Persist ke database, associate dengan user ID, load saat user login.

### Personalized Suggestions Gated by Auth

**Kenapa saran personal hanya untuk user login?**

- Butuh data interaksi (favorit, review).
- Tamu tidak punya data ini.
- Insentif untuk login: pengalaman lebih personal.

**Fallback untuk tamu**: Section "Trending Coffee Shops" (berbasis data agregat, bukan personal).

## Contoh Interaksi

### NL Parser dengan Multiple Intents

```javascript
parseNaturalLanguage("Cari cafe murah buat nugas di dekat kampus yang buka 24 jam")

// Langkah parsing:
// 1. "murah" → priceRange: 1
// 2. "nugas" → facility: "study-friendly"
// 3. "kampus" → district: "Sumbersari"
// 4. "24 jam" → openNow: true
// 5. Leftover: "cafe buat di dekat yang buka" (dibuang)

// Output:
{
  filters: {
    priceRange: 1,
    facility: "study-friendly",
    district: "Sumbersari",
    openNow: true
  },
  keywords: ["price:1", "study-friendly", "district:Sumbersari", "24jam"],
  summary: "Oke, saya carikan coffee shop fasilitas study-friendly, di Sumbersari, buka 24 jam, kisaran harga 1."
}

// Mock filter result:
// 1. Nugas Jember (matches all: study, Sumbersari, 24h, price 1)
// 2. Kopi Kampus Jember (matches: Sumbersari, price 1, open 07:00-03:00 ≈ near-24h)
```

### Personalized Suggestions Scoring

```javascript
// User favorites: Perasa, Nugas Jember
// Perasa facilities: [wifi, power-outlet, study-friendly, indoor, parking]
// Nugas facilities: [study-friendly, wifi, power-outlet]

// Preferensi:
// facilityPrefs: { "wifi": 2, "power-outlet": 2, "study-friendly": 2, "indoor": 1, "parking": 1 }
// districtPrefs: { "Sumbersari": 2 }

// Kandidat: Grand Cafe Jember
// Grand facilities: [wifi, indoor, outdoor, large-capacity]
// Score:
//   - wifi: 2
//   - indoor: 1
//   - outdoor: 0
//   - large: 0
//   - district Sumbersari: 2 × 2 = 4
//   - rating 4.4 × 0.5 = 2.2
//   Total: 9.2

// Kandidat: Discuss Space
// Discuss facilities: [wifi, meeting, indoor, outdoor]
// Score:
//   - wifi: 2
//   - indoor: 1
//   - outdoor: 0
//   - meeting: 0
//   - district Sumbersari: 4
//   - rating 4.4 × 0.5 = 2.2
//   Total: 9.2

// Kandidat: Tomoro Coffee
// Tomoro facilities: [ac, wifi, modern]
// Score:
//   - wifi: 2
//   - ac: 0
//   - modern: 0
//   - district Sumbersari: 4
//   - rating 4.7 × 0.5 = 2.35
//   Total: 8.35

// Top 3: Grand Cafe, Discuss Space, Tomoro Coffee
```

## Catatan Implementasi

- **Quick prompts** di-hardcode 4 item. Bisa diperluas atau di-randomize.
- **Chat bubble position** fixed di pojok kanan bawah dengan offset dari bottom nav (mobile) atau edge (desktop).
- **Drawer max height** 80vh agar tidak menutupi seluruh layar.
- **Message timestamp** ditampilkan dalam format HH:mm (24-jam).
- **Shop cards in chat** hanya menampilkan 3 teratas, meskipun filter mengembalikan 6.
- **Error handling**: Jika NL parser tidak match apapun, reply: "Hmm, saya tidak menemukan coffee shop yang cocok. Coba ubah kata kuncinya ya."

## KPI

| Metrik | Target | Hasil |
| --- | --- | --- |
| AI response time | < 2s | ~500ms (mock) |
| NL parser accuracy | > 80% intent benar | ~90% (rule-based) |
| Personalized CTR | > 15% user klik saran | Belum terukur |
| Chat engagement | > 30% session gunakan AI | Belum terukur |

## Roadmap Masa Depan

1. **Integrasi LLM nyata** — Swap rule-based parser dengan OpenAI/Claude API.
2. **Voice input** — Speech-to-text untuk pertanyaan lisan.
3. **Image search** — Upload foto coffee shop, AI identifikasi dan cari yang mirip.
4. **Multi-turn memory** — Chat history persisten per user.
5. **Proactive suggestions** — Notifikasi push: "Cafe favorit Anda sedang ada promo!"