"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Swal from "sweetalert2"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await signIn(email, password)
      await Swal.fire({
        title: "Login Berhasil!",
        text: "Selamat datang kembali",
        icon: "success",
        confirmButtonText: "OK",
        background: "#1a1a2e",
        color: "#fff",
      })
      router.push("/")
    } catch (error: any) {
      Swal.fire({
        title: "Login Gagal",
        text: error.message || "Email atau password salah",
        icon: "error",
        confirmButtonText: "Coba Lagi",
        background: "#1a1a2e",
        color: "#fff",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="pixel-border bg-card/95 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-2xl pixel-text">Login</CardTitle>
        <CardDescription>Masuk ke akun KOGRAPH - APPS Anda</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pixel-border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pixel-border"
            />
          </div>
          <Button type="submit" className="w-full pixel-button" disabled={loading}>
            {loading ? "Loading..." : "Masuk"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
