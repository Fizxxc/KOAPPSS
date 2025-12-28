import type { Timestamp } from "firebase/firestore"

export interface User {
  id: string
  email: string
  displayName: string
  role: "user" | "admin"
  photoURL?: string
  createdAt: Timestamp
  lastActive: Timestamp
  isActive?: boolean
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  imageUrl: string
  stock: number
  features: string[]
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface CartItem {
  productId: string
  productName: string
  productImage: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  userId: string
  userName: string
  userEmail: string
  items: CartItem[]
  totalAmount: number
  orderDetails: {
    customerName: string
    email: string
    phone: string
    notes?: string
  }
  paymentProof?: string // URL to payment proof image
  paymentStatus: "unpaid" | "pending_verification" | "verified" | "rejected"
  accountEmail?: string // Account credentials to be sent to customer
  accountPassword?: string
  accountSentAt?: Timestamp
  status: "pending" | "processing" | "completed" | "cancelled"
  createdAt: Timestamp
  updatedAt: Timestamp
  rated?: boolean
}

export interface Rating {
  id: string
  orderId: string
  userId: string
  userName: string
  rating: number
  comment: string
  createdAt: Timestamp
}

export interface Testimonial {
  id: string
  userId: string
  userName: string
  userPhoto?: string
  message: string
  rating: number
  isApproved: boolean
  createdAt: Timestamp
}

export interface Stats {
  id: string
  clientsSatisfied: number
  projectsCompleted: number
  averageRating: number
  responseTime: number // in minutes
  activeUsers: number
  updatedAt: Timestamp
}

export interface Notification {
  id: string
  userId: string
  type: "order" | "status_update" | "rating" | "general"
  title: string
  message: string
  read: boolean
  link?: string
  createdAt: Timestamp
}

export interface SiteSettings {
  id: string
  aboutUs: string
  contactEmail: string
  contactPhone: string
  contactWhatsapp: string
  faq: { question: string; answer: string }[]
  privacyPolicy: string
  telegramBotToken: string
  telegramChatId: string
  updatedAt: Timestamp
}
