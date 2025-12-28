"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { updateStats } from "@/lib/firebase/utils"
import type { Stats } from "@/lib/firebase/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Users, CheckCircle, Star, Clock } from "lucide-react"
import Swal from "sweetalert2"

export function StatsManagement() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [responseTime, setResponseTime] = useState(5)

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "stats", "main"), (doc) => {
      if (doc.exists()) {
        const statsData = { id: doc.id, ...doc.data() } as Stats
        setStats(statsData)
        setResponseTime(statsData.responseTime)
      }
    })
    return () => unsubscribe()
  }, [])

  const handleUpdateResponseTime = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateStats({ responseTime })
      Swal.fire({
        title: "Berhasil!",
        text: "Response time berhasil diupdate",
        icon: "success",
        background: "#1a1a2e",
        color: "#fff",
      })
    } catch (error) {
      Swal.fire({
        title: "Gagal!",
        text: "Terjadi kesalahan",
        icon: "error",
        background: "#1a1a2e",
        color: "#fff",
      })
    }
  }

  if (!stats) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl pixel-text">Manajemen Stats (Realtime)</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="pixel-card animate-pulse-slow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Klien Puas</CardTitle>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl pixel-text text-primary">{stats.clientsSatisfied}</div>
            <p className="text-xs text-muted-foreground mt-2">Total klien yang puas</p>
          </CardContent>
        </Card>

        <Card className="pixel-card animate-pulse-slow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Project Selesai</CardTitle>
              <CheckCircle className="w-8 h-8 text-secondary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl pixel-text text-secondary">{stats.projectsCompleted}</div>
            <p className="text-xs text-muted-foreground mt-2">Total project completed</p>
          </CardContent>
        </Card>

        <Card className="pixel-card animate-pulse-slow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Rating</CardTitle>
              <Star className="w-8 h-8 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl pixel-text text-accent">{stats.averageRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground mt-2">Rating rata-rata</p>
          </CardContent>
        </Card>

        <Card className="pixel-card animate-pulse-slow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Response Time</CardTitle>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl pixel-text text-yellow-500">{stats.responseTime}m</div>
            <p className="text-xs text-muted-foreground mt-2">Waktu respons rata-rata</p>
          </CardContent>
        </Card>
      </div>

      <Card className="pixel-card">
        <CardHeader>
          <CardTitle className="pixel-text">Update Response Time Manual</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateResponseTime} className="space-y-4">
            <div className="space-y-2">
              <Label>Response Time (menit)</Label>
              <Input
                type="number"
                value={responseTime}
                onChange={(e) => setResponseTime(Number(e.target.value))}
                className="pixel-border"
                min="1"
              />
            </div>
            <Button type="submit" className="pixel-button">
              Update Response Time
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="pixel-card">
        <CardHeader>
          <CardTitle className="pixel-text">User Aktif Realtime</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-5xl pixel-text text-center text-primary animate-glow">{stats.activeUsers}</div>
          <p className="text-center text-muted-foreground mt-4">User aktif saat ini</p>
        </CardContent>
      </Card>
    </div>
  )
}
