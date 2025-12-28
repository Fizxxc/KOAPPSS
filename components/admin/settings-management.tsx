"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { updateSiteSettings } from "@/lib/firebase/utils"
import type { SiteSettings } from "@/lib/firebase/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Plus, Trash2 } from "lucide-react"
import Swal from "sweetalert2"

export function SettingsManagement() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    aboutUs: "",
    contactEmail: "",
    contactPhone: "",
    contactWhatsapp: "",
    privacyPolicy: "",
    faq: [] as { question: string; answer: string }[],
  })

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "settings", "main"),
      (doc) => {
        if (doc.exists()) {
          const settingsData = { id: doc.id, ...doc.data() } as SiteSettings
          setSettings(settingsData)
          setFormData({
            aboutUs: settingsData.aboutUs || "",
            contactEmail: settingsData.contactEmail || "",
            contactPhone: settingsData.contactPhone || "",
            contactWhatsapp: settingsData.contactWhatsapp || "",
            privacyPolicy: settingsData.privacyPolicy || "",
            faq: settingsData.faq || [],
          })
        }
        setLoading(false)
      },
      (error) => {
        console.error("[v0] Settings fetch error:", error)
        setLoading(false)
      },
    )
    return () => unsubscribe()
  }, [])

  const addFAQItem = () => {
    setFormData({
      ...formData,
      faq: [...formData.faq, { question: "", answer: "" }],
    })
  }

  const removeFAQItem = (index: number) => {
    setFormData({
      ...formData,
      faq: formData.faq.filter((_, i) => i !== index),
    })
  }

  const updateFAQItem = (index: number, field: "question" | "answer", value: string) => {
    const newFaq = [...formData.faq]
    newFaq[index][field] = value
    setFormData({ ...formData, faq: newFaq })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateSiteSettings(formData)
      Swal.fire({
        title: "Berhasil!",
        text: "Settings berhasil diupdate",
        icon: "success",
        background: "#fff",
        color: "#333",
      })
    } catch (error) {
      console.error("[v0] Settings update error:", error)
      Swal.fire({
        title: "Gagal!",
        text: "Terjadi kesalahan saat update settings",
        icon: "error",
        background: "#fff",
        color: "#333",
      })
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-pulse">Loading settings...</div>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">Settings not initialized!</p>
        <p className="text-sm text-muted-foreground">Run: npm run init-firestore</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl pixel-text text-primary">Site Settings</h2>

      <Card className="pixel-card">
        <CardHeader>
          <CardTitle className="pixel-text">Update Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Tentang Kami</Label>
              <Textarea
                value={formData.aboutUs}
                onChange={(e) => setFormData({ ...formData, aboutUs: e.target.value })}
                className="pixel-border min-h-[100px]"
                placeholder="Deskripsi tentang perusahaan..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Email Kontak</Label>
                <Input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  className="pixel-border"
                />
              </div>
              <div className="space-y-2">
                <Label>Nomor Telepon</Label>
                <Input
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  className="pixel-border"
                  placeholder="+62 812-3456-7890"
                />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp (dengan kode negara)</Label>
                <Input
                  value={formData.contactWhatsapp}
                  onChange={(e) => setFormData({ ...formData, contactWhatsapp: e.target.value })}
                  className="pixel-border"
                  placeholder="6281234567890"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Kebijakan Privasi</Label>
              <Textarea
                value={formData.privacyPolicy}
                onChange={(e) => setFormData({ ...formData, privacyPolicy: e.target.value })}
                className="pixel-border min-h-[150px]"
                placeholder="Kebijakan privasi perusahaan..."
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-lg">FAQ (Pertanyaan yang Sering Diajukan)</Label>
                <Button type="button" onClick={addFAQItem} size="sm" className="pixel-button">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah FAQ
                </Button>
              </div>

              {formData.faq.map((item, index) => (
                <Card key={index} className="p-4 bg-muted/50">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <Label className="text-sm">FAQ #{index + 1}</Label>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeFAQItem(index)}
                        className="pixel-button"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <Input
                      value={item.question}
                      onChange={(e) => updateFAQItem(index, "question", e.target.value)}
                      placeholder="Pertanyaan..."
                      className="pixel-border"
                    />
                    <Textarea
                      value={item.answer}
                      onChange={(e) => updateFAQItem(index, "answer", e.target.value)}
                      placeholder="Jawaban..."
                      className="pixel-border"
                      rows={3}
                    />
                  </div>
                </Card>
              ))}
            </div>

            <Button type="submit" className="w-full pixel-button bg-primary text-white hover:bg-primary/90">
              Simpan Semua Perubahan
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
