"use client"

import type { Product } from "@/lib/firebase/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/cart-context"
import { ShoppingCart, Package } from "lucide-react"
import Swal from "sweetalert2"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      productName: product.name,
      productImage: product.imageUrl,
      quantity: 1,
      price: product.price,
    })

    Swal.fire({
      title: "Ditambahkan!",
      text: `${product.name} ditambahkan ke keranjang`,
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
      background: "#1a1a2e",
      color: "#fff",
    })
  }

  return (
    <Card className="pixel-card hover:scale-105 transition-transform duration-300">
      <CardHeader>
        <img
          src={product.imageUrl || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-56 object-cover pixel-border mb-4 hover:opacity-80 transition-opacity"
        />
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="pixel-text text-lg">{product.name}</CardTitle>
          <Badge className="pixel-border bg-primary text-primary-foreground shrink-0">{product.category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>

        <div className="space-y-2">
          <h4 className="text-sm font-bold flex items-center gap-2">
            <Package className="w-4 h-4" /> Fitur:
          </h4>
          <ul className="text-xs space-y-1">
            {product.features.slice(0, 3).map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="text-primary">▸</span> {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <div className="text-2xl pixel-text text-primary">Rp {product.price.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Stok: {product.stock}</div>
          </div>
          <Button onClick={handleAddToCart} disabled={product.stock === 0} className="pixel-button">
            <ShoppingCart className="w-4 h-4 mr-2" />
            {product.stock === 0 ? "Habis" : "Beli"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
