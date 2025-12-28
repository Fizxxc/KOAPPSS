"use client"

import type React from "react"

import { useState } from "react"
import type { User } from "@/lib/firebase/types"
import { updateUser } from "@/lib/firebase/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Edit, Save, X } from "lucide-react"
import Swal from "sweetalert2"

interface ProfileInfoProps {
  user: User
}

export function ProfileInfo({ user }: ProfileInfoProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [displayName, setDisplayName] = useState(user.displayName)
  const [photoURL, setPhotoURL] = useState(user.photoURL || "")
  const [loading, setLoading] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await updateUser(user.id, { displayName, photoURL: photoURL || undefined })
      await Swal.fire({
        title: "Berhasil!",
        text: "Profile berhasil diupdate",
        icon: "success",
        background: "#1a1a2e",
        color: "#fff",
      })
      setIsEditing(false)
    } catch (error) {
      Swal.fire({
        title: "Gagal!",
        text: "Terjadi kesalahan",
        icon: "error",
        background: "#1a1a2e",
        color: "#fff",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="pixel-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="pixel-text">Informasi Profile</CardTitle>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="pixel-button">
              <Edit className="w-4 h-4 mr-2" /> Edit
            </Button>
          ) : (
            <Button
              onClick={() => {
                setIsEditing(false)
                setDisplayName(user.displayName)
                setPhotoURL(user.photoURL || "")
              }}
              variant="outline"
              size="sm"
              className="pixel-button"
            >
              <X className="w-4 h-4 mr-2" /> Batal
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-6">
          <Avatar className="w-24 h-24 pixel-border">
            <AvatarImage src={photoURL || user.photoURL || "/placeholder.svg"} />
            <AvatarFallback className="text-3xl pixel-text">{user.displayName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold">{user.displayName}</h3>
              <Badge className="pixel-border bg-primary">{user.role === "admin" ? "ADMIN" : "USER"}</Badge>
            </div>
            <p className="text-muted-foreground">{user.email}</p>
            <p className="text-sm text-muted-foreground">
              Bergabung: {user.createdAt.toDate().toLocaleDateString("id-ID")}
            </p>
          </div>
        </div>

        {isEditing && (
          <form onSubmit={handleSave} className="space-y-4 pt-6 border-t">
            <div className="space-y-2">
              <Label htmlFor="displayName">Nama Lengkap</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="pixel-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="photoURL">URL Foto Profile (opsional)</Label>
              <Input
                id="photoURL"
                type="url"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                className="pixel-border"
                placeholder="https://example.com/photo.jpg"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full pixel-button">
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
