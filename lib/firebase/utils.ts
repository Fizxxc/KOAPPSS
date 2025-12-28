import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  Timestamp,
  addDoc,
} from "firebase/firestore"
import { db } from "./config"
import type { User, Product, Order, Rating, Testimonial, Stats, Notification, SiteSettings } from "./types"

// Users
export const createUser = async (userId: string, userData: Omit<User, "id">) => {
  await setDoc(doc(db, "users", userId), userData)
}

export const getUser = async (userId: string) => {
  const userDoc = await getDoc(doc(db, "users", userId))
  return userDoc.exists() ? ({ id: userDoc.id, ...userDoc.data() } as User) : null
}

export const updateUser = async (userId: string, updates: Partial<User>) => {
  await updateDoc(doc(db, "users", userId), { ...updates, lastActive: Timestamp.now() })
}

// Products
export const createProduct = async (productData: Omit<Product, "id">) => {
  const docRef = await addDoc(collection(db, "products"), productData)
  return docRef.id
}

export const updateProduct = async (productId: string, updates: Partial<Product>) => {
  await updateDoc(doc(db, "products", productId), { ...updates, updatedAt: Timestamp.now() })
}

export const deleteProduct = async (productId: string) => {
  await deleteDoc(doc(db, "products", productId))
}

// Orders
export const createOrder = async (orderData: Omit<Order, "id">) => {
  const docRef = await addDoc(collection(db, "orders"), orderData)
  return docRef.id
}

export const updateOrderStatus = async (orderId: string, status: Order["status"]) => {
  await updateDoc(doc(db, "orders", orderId), { status, updatedAt: Timestamp.now() })
}

// Ratings
export const createRating = async (ratingData: Omit<Rating, "id">) => {
  const docRef = await addDoc(collection(db, "ratings"), ratingData)
  await updateDoc(doc(db, "orders", ratingData.orderId), { rated: true })
  return docRef.id
}

// Testimonials
export const createTestimonial = async (testimonialData: Omit<Testimonial, "id">) => {
  const docRef = await addDoc(collection(db, "testimonials"), testimonialData)
  return docRef.id
}

// Notifications
export const createNotification = async (notificationData: Omit<Notification, "id">) => {
  const docRef = await addDoc(collection(db, "notifications"), notificationData)
  return docRef.id
}

// Stats
export const getStats = async () => {
  const statsDoc = await getDoc(doc(db, "stats", "main"))
  return statsDoc.exists() ? ({ id: statsDoc.id, ...statsDoc.data() } as Stats) : null
}

export const updateStats = async (updates: Partial<Stats>) => {
  await updateDoc(doc(db, "stats", "main"), { ...updates, updatedAt: Timestamp.now() })
}

// Site Settings
export const getSiteSettings = async () => {
  const settingsDoc = await getDoc(doc(db, "settings", "main"))
  return settingsDoc.exists() ? ({ id: settingsDoc.id, ...settingsDoc.data() } as SiteSettings) : null
}

export const updateSiteSettings = async (updates: Partial<SiteSettings>) => {
  await updateDoc(doc(db, "settings", "main"), { ...updates, updatedAt: Timestamp.now() })
}

// Realtime Active Users
export const updateActiveUsers = async () => {
  const usersQuery = query(collection(db, "users"), where("isActive", "==", true))
  const snapshot = await getDocs(usersQuery)
  await updateDoc(doc(db, "stats", "main"), {
    activeUsers: snapshot.size,
    updatedAt: Timestamp.now(),
  })
}
