"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function useAdminProtection() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/login")
    }
  }, [user, loading, router])

  return { user, loading }
}

export function useAdminCheck() {
  const { user, loading } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (!loading && user) {
      setIsAdmin(user.role === "admin")
    } else {
      setIsAdmin(false)
    }
  }, [user, loading])

  return { isAdmin, loading }
}
