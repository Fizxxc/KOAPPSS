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

export function RegisterForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      Swal.fire({
        title: "Password Tidak Cocok",
        text: "Pastikan password dan konfirmasi password sama",
        icon: "error",
        confirmButtonText: "OK",
        background: "#1a1a2e",
        color: "#fff",
      })
      return
    }

    if (password.length < 6) {
      Swal.fire({
        title: "Password Terlalu Pendek",
        text: "Password minimal 6 karakter",
        icon: "error",
        confirmButtonText: "OK",
        background: "#1a1a2e",
        color: "#fff",
      })
      return
    }

    setLoading(true)

    try {
      await signUp(email, password, displayName)
      await Swal.fire({
        title: "Registrasi Berhasil!",
        text: "Akun Anda telah dibuat",
        icon: "success",
        confirmButtonText: "OK",
        background: "#1a1a2e",
        color: "#fff",
      })
      router.push("/")
    } catch (error: any) {
      Swal.fire({
        title: "Registrasi Gagal",
        text: error.message || "Terjadi kesalahan saat membuat akun",
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
        <CardTitle className="text-2xl pixel-text">Daftar</CardTitle>
        <CardDescription>Buat akun baru di KOGRAPH - APPS</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Nama Lengkap</Label>
            <Input
              id="displayName"
              type="text"
              placeholder="John Doe"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              className="pixel-border"
            />
          </div>
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
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="pixel-border"
            />
          </div>
          <Button type="submit" className="w-full pixel-button" disabled={loading}>
            {loading ? "Loading..." : "Daftar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
