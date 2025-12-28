"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { collection, query, onSnapshot, Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { createProduct, updateProduct, deleteProduct } from "@/lib/firebase/utils"
import type { Product } from "@/lib/firebase/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Trash2 } from "lucide-react"
import Swal from "sweetalert2"

export function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    imageUrl: "",
    stock: 0,
    features: "",
  })

  useEffect(() => {
    const q = query(collection(db, "products"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Product)
      setProducts(productsData)
    })
    return () => unsubscribe()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const productData = {
      ...formData,
      features: formData.features.split(",").map((f) => f.trim()),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData)
        Swal.fire({
          title: "Berhasil!",
          text: "Produk berhasil diupdate",
          icon: "success",
          background: "#1a1a2e",
          color: "#fff",
        })
      } else {
        await createProduct(productData)
        Swal.fire({
          title: "Berhasil!",
          text: "Produk berhasil ditambahkan",
          icon: "success",
          background: "#1a1a2e",
          color: "#fff",
        })
      }
      setIsDialogOpen(false)
      resetForm()
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

  const handleDelete = async (productId: string) => {
    const result = await Swal.fire({
      title: "Hapus Produk?",
      text: "Produk akan dihapus permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
      background: "#1a1a2e",
      color: "#fff",
    })

    if (result.isConfirmed) {
      try {
        await deleteProduct(productId)
        Swal.fire({
          title: "Dihapus!",
          text: "Produk berhasil dihapus",
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
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl,
      stock: product.stock,
      features: product.features.join(", "),
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingProduct(null)
    setFormData({
      name: "",
      description: "",
      price: 0,
      category: "",
      imageUrl: "",
      stock: 0,
      features: "",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl pixel-text">Manajemen Produk</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()} className="pixel-button">
              <Plus className="w-4 h-4 mr-2" /> Tambah Produk
            </Button>
          </DialogTrigger>
          <DialogContent className="pixel-border bg-card max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="pixel-text">{editingProduct ? "Edit Produk" : "Tambah Produk Baru"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Nama Produk</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="pixel-border"
                />
              </div>
              <div className="space-y-2">
                <Label>Deskripsi</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  className="pixel-border"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Harga (Rp)</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    required
                    className="pixel-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Stok</Label>
                  <Input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    required
                    className="pixel-border"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Kategori</Label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="pixel-border"
                />
              </div>
              <div className="space-y-2">
                <Label>URL Gambar</Label>
                <Input
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  required
                  className="pixel-border"
                />
              </div>
              <div className="space-y-2">
                <Label>Fitur (pisahkan dengan koma)</Label>
                <Textarea
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  required
                  className="pixel-border"
                  placeholder="Fitur 1, Fitur 2, Fitur 3"
                />
              </div>
              <Button type="submit" className="w-full pixel-button">
                {editingProduct ? "Update" : "Tambah"} Produk
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="pixel-card">
            <CardHeader>
              <img
                src={product.imageUrl || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-48 object-cover pixel-border mb-4"
              />
              <CardTitle className="pixel-text text-lg">{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-2">{product.description}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-primary font-bold">Rp {product.price.toLocaleString()}</span>
                <span className="text-sm">Stok: {product.stock}</span>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleEdit(product)} variant="outline" size="sm" className="flex-1 pixel-button">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => handleDelete(product.id)}
                  variant="destructive"
                  size="sm"
                  className="flex-1 pixel-button"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
