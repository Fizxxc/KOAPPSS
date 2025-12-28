"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth"
import { auth, db } from "@/lib/firebase/config"
import { doc, getDoc, setDoc, updateDoc, Timestamp } from "firebase/firestore"
import type { User } from "@/lib/firebase/types"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, displayName: string) => Promise<void>
  signOut: () => Promise<void>
  updateUserActivity: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))
        if (userDoc.exists()) {
          const userData = { id: userDoc.id, ...userDoc.data() } as User
          setUser(userData)
          // Update active status
          await updateDoc(doc(db, "users", firebaseUser.uid), {
            isActive: true,
            lastActive: Timestamp.now(),
          })
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password)
    const userDoc = await getDoc(doc(db, "users", result.user.uid))
    if (userDoc.exists()) {
      const userData = { id: userDoc.id, ...userDoc.data() } as User
      setUser(userData)
    }
  }

  const signUp = async (email: string, password: string, displayName: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    const newUser: Omit<User, "id"> = {
      email,
      displayName,
      role: "user",
      createdAt: Timestamp.now(),
      lastActive: Timestamp.now(),
      isActive: true,
    }
    await setDoc(doc(db, "users", result.user.uid), newUser)
    setUser({ id: result.user.uid, ...newUser })
  }

  const signOut = async () => {
    if (user) {
      await updateDoc(doc(db, "users", user.id), {
        isActive: false,
        lastActive: Timestamp.now(),
      })
    }
    await firebaseSignOut(auth)
    setUser(null)
  }

  const updateUserActivity = async () => {
    if (user) {
      await updateDoc(doc(db, "users", user.id), {
        lastActive: Timestamp.now(),
      })
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateUserActivity }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
