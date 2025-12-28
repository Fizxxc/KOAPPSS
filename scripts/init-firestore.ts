import { initializeApp } from "firebase/app"
import { getFirestore, collection, doc, setDoc, addDoc, Timestamp } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function initializeFirestore() {
  console.log("🚀 Initializing Firestore with client SDK...")

  try {
    // Initialize Stats
    await setDoc(doc(db, "stats", "main"), {
      clientsSatisfied: 150,
      projectsCompleted: 200,
      averageRating: 4.9,
      responseTime: 5,
      activeUsers: 0,
      updatedAt: Timestamp.now(),
    })
    console.log("✓ Stats initialized")

    // Initialize Settings with quality content
    await setDoc(doc(db, "settings", "main"), {
      aboutUs:
        "KOGRAPH - APPS adalah platform terpercaya untuk menyediakan aplikasi dan layanan digital berkualitas premium. Kami berdedikasi untuk menghadirkan solusi teknologi terbaik yang membantu bisnis Anda berkembang. Dengan tim profesional berpengalaman lebih dari 5 tahun, kami telah melayani ratusan klien dari berbagai industri dengan tingkat kepuasan mencapai 98%. Setiap project dikerjakan dengan detail, passion, dan komitmen untuk memberikan hasil terbaik.",
      contactEmail: "contact@kograph.com",
      contactPhone: "+62 812-3456-7890",
      contactWhatsapp: "6281234567890",
      faq: [
        {
          question: "Bagaimana cara memesan aplikasi atau layanan?",
          answer:
            "Sangat mudah! Pilih produk atau layanan yang Anda inginkan, klik 'Tambah ke Keranjang', kemudian lanjutkan ke halaman checkout. Isi detail pesanan Anda dengan lengkap, lakukan pembayaran via QRIS, upload bukti transfer, dan tim kami akan segera memproses pesanan Anda.",
        },
        {
          question: "Metode pembayaran apa saja yang tersedia?",
          answer:
            "Kami menerima pembayaran melalui QRIS untuk kemudahan Anda. Setelah scan QR code dan transfer, upload bukti pembayaran Anda. Tim kami akan verifikasi dalam 5-15 menit dan segera mengirimkan akun aplikasi yang Anda pesan.",
        },
        {
          question: "Berapa lama waktu pengerjaan project?",
          answer:
            "Waktu pengerjaan bervariasi tergantung kompleksitas project. Website sederhana biasanya 3-7 hari kerja, aplikasi mobile 14-30 hari kerja, dan bot atau automation 1-5 hari kerja. Kami selalu berusaha menyelesaikan project tepat waktu tanpa mengurangi kualitas.",
        },
        {
          question: "Apakah ada garansi atau after-sales service?",
          answer:
            "Ya! Setiap project dilengkapi dengan garansi 30 hari untuk bug fixing dan penyesuaian minor. Kami juga menyediakan layanan maintenance dan support berkelanjutan dengan biaya terjangkau. Kepuasan Anda adalah prioritas kami.",
        },
        {
          question: "Apakah saya bisa request fitur custom?",
          answer:
            "Tentu saja! Kami sangat terbuka untuk request fitur custom sesuai kebutuhan bisnis Anda. Tim kami akan mendiskusikan requirement Anda secara detail dan memberikan solusi terbaik. Hubungi kami untuk konsultasi gratis.",
        },
        {
          question: "Bagaimana cara tracking progress pengerjaan?",
          answer:
            "Anda dapat login ke dashboard untuk melihat status order dan history pesanan Anda. Kami juga memberikan update berkala melalui WhatsApp dan email. Transparansi adalah kunci kepercayaan kami kepada klien.",
        },
      ],
      privacyPolicy:
        "Kami di KOGRAPH - APPS sangat menghargai privasi dan keamanan data Anda. Semua informasi pribadi yang Anda berikan (nama, email, nomor telepon) hanya akan digunakan untuk keperluan transaksi dan komunikasi terkait layanan kami. Kami tidak akan membagikan, menjual, atau menyebarkan data Anda kepada pihak ketiga tanpa izin Anda. Data transaksi disimpan dengan enkripsi dan sistem keamanan tingkat tinggi. Kami berkomitmen untuk menjaga kepercayaan Anda dengan melindungi setiap informasi yang Anda percayakan kepada kami.",
      updatedAt: Timestamp.now(),
    })
    console.log("✓ Site settings initialized")

    // Sample products
    const products = [
      {
        name: "Premium Bot Discord",
        description:
          "Bot Discord custom dengan fitur lengkap untuk server Anda. Dilengkapi dengan moderasi otomatis, sistem leveling, music player berkualitas tinggi, custom commands, auto-response, welcome message, dan masih banyak lagi. Cocok untuk gaming community, study group, atau bisnis server.",
        price: 500000,
        category: "Bot",
        imageUrl: "/pixel-art-discord-bot.jpg",
        stock: 10,
        features: [
          "Custom Commands & Slash Commands",
          "Auto Moderation System",
          "High Quality Music Player",
          "Leveling & Economy System",
          "Auto Response & Welcome",
          "Dashboard Web Panel",
          "24/7 Uptime Guaranteed",
          "Free Updates & Support",
        ],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      },
      {
        name: "Website Toko Online Premium",
        description:
          "Website toko online profesional dengan admin dashboard yang powerful. Dilengkapi dengan sistem pembayaran otomatis, notifikasi real-time, manajemen produk unlimited, analitik penjualan, responsive design untuk semua device, dan optimasi SEO untuk meningkatkan visibility di Google.",
        price: 2000000,
        category: "Website",
        imageUrl: "/pixel-art-online-store.jpg",
        stock: 5,
        features: [
          "Responsive & Mobile Friendly",
          "Admin Dashboard Lengkap",
          "Payment Gateway Integration",
          "Real-time Notifications",
          "SEO Optimized",
          "Product Management",
          "Order Tracking System",
          "Analytics & Reports",
        ],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      },
      {
        name: "Mobile App Android Premium",
        description:
          "Aplikasi Android native dengan performa maksimal dan UI modern mengikuti Material Design guidelines. Mendukung push notifications, offline mode, cloud sync, dan integrasi dengan berbagai API. Siap publish ke Google Play Store dengan dokumentasi lengkap.",
        price: 3000000,
        category: "Mobile App",
        imageUrl: "/pixel-art-android-app.jpg",
        stock: 3,
        features: [
          "Native Android Performance",
          "Material Design UI/UX",
          "Push Notifications",
          "Offline Mode Support",
          "Cloud Sync Integration",
          "Multi-language Support",
          "Google Play Ready",
          "Documentation Included",
        ],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      },
      {
        name: "Telegram Bot Automation",
        description:
          "Bot Telegram pintar untuk automasi bisnis Anda. Bisa digunakan untuk customer service otomatis, broadcast message, scheduling posts, form collection, payment notification, dan integrasi dengan sistem Anda. Mudah digunakan dan efisien untuk meningkatkan produktivitas.",
        price: 750000,
        category: "Bot",
        imageUrl: "/pixel-art-discord-bot.jpg",
        stock: 15,
        features: [
          "Auto Response System",
          "Broadcast Messages",
          "Inline Keyboard Menu",
          "Payment Notifications",
          "Data Collection Forms",
          "API Integration Ready",
          "Multi-admin Support",
          "Cloud Hosted",
        ],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      },
      {
        name: "Landing Page Premium",
        description:
          "Landing page yang menarik dan conversion-focused untuk produk atau layanan Anda. Desain modern dengan animasi smooth, loading cepat, SEO optimized, dan mobile responsive. Termasuk form contact, integration dengan analytics, dan A/B testing ready.",
        price: 1200000,
        category: "Website",
        imageUrl: "/pixel-art-online-store.jpg",
        stock: 8,
        features: [
          "Modern & Attractive Design",
          "Conversion Optimized",
          "Fast Loading Speed",
          "SEO & Analytics Ready",
          "Contact Form Integration",
          "A/B Testing Support",
          "Responsive Design",
          "Easy Content Update",
        ],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      },
    ]

    for (const product of products) {
      await addDoc(collection(db, "products"), product)
    }
    console.log("✓ Sample products created")

    console.log("\n🎉 Firestore initialization complete!")
    console.log("📝 Default content telah diisi dengan konten berkualitas")
    console.log("✅ Admin dapat mengubah semua konten melalui dashboard")
  } catch (error) {
    console.error("❌ Error initializing Firestore:", error)
    throw error
  }
}

initializeFirestore()
  .then(() => {
    console.log("✨ Done! You can now use the application.")
    process.exit(0)
  })
  .catch((error) => {
    console.error("Fatal error:", error)
    process.exit(1)
  })
