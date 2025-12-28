# KOGRAPH - APPS 🎮

Toko aplikasi premium dengan UI pixel art style dan fitur lengkap!

## 🚀 Fitur Utama

- ✅ **Authentication System** - Login/Register untuk User & Admin
- ✅ **Admin Dashboard** - Manajemen produk, orders, settings, testimonial
- ✅ **Shopping Cart** - Keranjang belanja dengan realtime updates
- ✅ **QRIS Payment** - Upload bukti transfer, konfirmasi oleh admin
- ✅ **Auto Account Delivery** - Admin kirim akun (email/password) otomatis
- ✅ **Telegram Notifications** - Notifikasi order & pembayaran ke Telegram (dengan foto bukti)
- ✅ **Rating & Testimonial** - User bisa rating setelah pembelian
- ✅ **User Profile** - Order history, notifications, profile management
- ✅ **Realtime Stats** - Klien puas, project selesai, rating, response time
- ✅ **Active Users Tracking** - Tracking user aktif realtime
- ✅ **Content Management** - Admin kelola FAQ, About, Contact, Privacy

## 📋 Prerequisites

- Node.js 18+ dan npm/yarn/pnpm
- Firebase Project dengan Firestore Database
- Telegram Bot Token (untuk notifikasi order)

## ⚙️ Setup Instructions

### 1. Clone & Install Dependencies

```bash
npm install
# atau
yarn install
# atau
pnpm install
```

### 2. Setup Firebase

1. Buat project di [Firebase Console](https://console.firebase.google.com/)
2. Enable **Authentication** (Email/Password)
3. Enable **Firestore Database**
4. Copy **Firebase Config**:
   - Project Settings → General → Your apps
   - Pilih Web app atau create new
   - Salin semua config (apiKey, authDomain, dll)

**TIDAK PERLU Service Account!** - Kami pakai client SDK saja untuk kesederhanaan

### 3. Setup Telegram Bot

1. Chat dengan [@BotFather](https://t.me/botfather) di Telegram
2. Ketik `/newbot` dan ikuti instruksi
3. Salin **Bot Token** yang diberikan
4. Untuk mendapatkan Chat ID:
   - Chat dengan bot Anda
   - Kirim pesan apa saja
   - Buka: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
   - Lihat `"chat":{"id": XXXXX}` di response JSON

### 4. Configure Environment Variables

Salin file `.env.local.example` ke `.env.local`:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` dan isi semua values:

```env
# Firebase Client (dari Firebase Console → Project Settings)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Telegram Bot
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=123456789
```

### 5. Initialize Database

Jalankan script untuk setup collections dan data awal:

```bash
npm run init-firestore
```

Script ini akan membuat:
- Collection: `products`, `stats`, `settings` dengan data berkualitas
- Sample products dengan deskripsi lengkap
- FAQ, About, Contact content yang profesional

### 6. Setup Firestore Rules

Di Firebase Console → Firestore Database → Rules, gunakan rules ini:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read for all (public access untuk store)
    match /{document=**} {
      allow read: if true;
    }
    
    // Only authenticated users can write to their own data
    match /users/{userId} {
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Only authenticated users can create orders
    match /orders/{orderId} {
      allow create: if request.auth != null;
      allow update: if request.auth != null;
    }
    
    // Only authenticated users can write notifications
    match /notifications/{notificationId} {
      allow create, update: if request.auth != null;
    }
    
    // Admin collections - semua authenticated user bisa write
    // (Security dihandle di aplikasi level)
    match /products/{productId} {
      allow write: if request.auth != null;
    }
    
    match /stats/{statsId} {
      allow write: if request.auth != null;
    }
    
    match /settings/{settingsId} {
      allow write: if request.auth != null;
    }
    
    match /testimonials/{testimonialId} {
      allow write: if request.auth != null;
    }
    
    match /ratings/{ratingId} {
      allow write: if request.auth != null;
    }
    
    match /activeUsers/{userId} {
      allow write: if request.auth != null;
    }
  }
}
```

### 7. Setup Admin User

Buat admin user pertama dengan cara:

1. Register akun baru di `/register`
2. Buka Firebase Console → Firestore Database
3. Buka collection `users` → Pilih user yang baru dibuat
4. Edit document, tambahkan field:
   - Field: `role`
   - Type: `string`
   - Value: `admin`
5. Save

Sekarang user tersebut adalah admin dan bisa akses `/admin`!

### 8. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## 🎨 Upload QRIS Image

Ganti file `public/qris.jpg` dengan QR Code QRIS Anda sendiri untuk pembayaran.

## 📁 Struktur Project

```
kograph-apps/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes (serverless)
│   ├── login/             # Login page
│   ├── register/          # Register page
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout with QRIS
│   ├── profile/           # User profile & order history
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── faq/               # FAQ page
│   └── privacy/           # Privacy policy
├── components/            # React components
│   ├── admin/            # Admin components
│   ├── auth/             # Auth components
│   ├── store/            # Store frontend components
│   └── rating/           # Rating components
├── lib/                   # Utilities & contexts
│   ├── firebase/         # Firebase config & utils
│   ├── hooks/            # Custom React hooks
│   ├── auth-context.tsx  # Auth context
│   ├── cart-context.tsx  # Shopping cart context
│   └── telegram.ts       # Telegram bot utils
├── public/               # Static files
│   └── qris.jpg         # QR Code QRIS (ganti dengan milik Anda!)
└── scripts/              # Utility scripts
    └── init-firestore.ts # Database initialization
```

## 🚀 Deploy to Vercel

1. Push ke GitHub repository
2. Import project di [Vercel](https://vercel.com)
3. Tambahkan Environment Variables di Vercel Dashboard (sama seperti .env.local)
4. Deploy!

## 📝 Cara Penggunaan

### Untuk Admin:

1. Login dengan akun admin (yang sudah di-set role admin)
2. Dashboard → Kelola produk, orders, settings
3. Tambah produk dengan klik "Add Product"
4. Terima order & verifikasi pembayaran (bukti muncul di Telegram)
5. Kirim akun ke customer (email/password)
6. Update stats realtime (response time bisa diubah manual)
7. Kelola FAQ, About, Contact content di Settings
8. Approve/reject testimonial dari customers

### Untuk Customer:

1. Register akun baru atau browse tanpa login
2. Browse produk di homepage
3. Tambah ke cart → Checkout
4. Upload bukti transfer QRIS
5. Tunggu konfirmasi admin (max 5-15 menit)
6. Terima akun via notifikasi
7. Rating setelah pembelian selesai

## 🎯 Fitur Realtime

- Active users count (update otomatis)
- Stats: klien puas, project selesai, rating (update realtime)
- Response time (admin bisa ubah manual)
- Order notifications untuk admin
- Payment status updates
- Testimonial updates (admin approve/reject)

## 🛠️ Tech Stack

- **Next.js 16** (App Router) - Framework React terbaru
- **React 19** - Library UI
- **TypeScript** - Type safety
- **Firebase** (Firestore, Auth) - Backend as a Service
- **Tailwind CSS v4** - Styling dengan pixel art theme
- **SweetAlert2** - Beautiful alerts
- **Press Start 2P** - Pixel Font
- **Lucide Icons** - Icon library

## 🔧 Troubleshooting

### Firebase Error: "INVALID_LOGIN_CREDENTIALS"
- Pastikan email dan password benar
- Cek apakah Email/Password authentication sudah di-enable di Firebase Console

### Settings/FAQ Loading Terus
- Pastikan sudah run `npm run init-firestore`
- Cek Firestore Database apakah collection `settings` sudah ada

### Telegram Notification Tidak Masuk
- Cek bot token dan chat ID sudah benar
- Pastikan sudah chat bot minimal sekali
- Cek console log di server untuk error details

### Payment Gagal
- Cek console browser (F12) untuk error details
- Pastikan bukti pembayaran sudah diupload
- Cek network tab untuk melihat response API

## 📞 Support

Jika ada masalah atau pertanyaan:
1. Cek console browser (F12) untuk error messages
2. Cek logs di Vercel Dashboard jika sudah deploy
3. Buka issue di GitHub repository

## 📄 License

MIT License - Silakan gunakan untuk project komersial atau personal Anda!

---

**Dibuat dengan ❤️ menggunakan v0 by Vercel**
