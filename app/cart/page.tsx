"use client"

import { useCart } from "@/lib/cart-context"
import { Navbar } from "@/components/store/navbar"
import { Footer } from "@/components/store/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import Link from "next/link"

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalAmount } = useCart()

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pixel-bg flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Card className="pixel-card max-w-md w-full mx-4">
            <CardContent className="p-12 text-center space-y-6">
              <ShoppingBag className="w-20 h-20 mx-auto text-muted-foreground opacity-50" />
              <h2 className="text-2xl pixel-text">Keranjang Kosong</h2>
              <p className="text-muted-foreground">Belum ada produk di keranjang Anda</p>
              <Link href="/">
                <Button className="w-full pixel-button">Mulai Belanja</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen pixel-bg flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl pixel-text mb-8 text-primary">Keranjang Belanja</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card key={item.productId} className="pixel-card">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <img
                      src={item.productImage || "/placeholder.svg"}
                      alt={item.productName}
                      className="w-24 h-24 object-cover pixel-border"
                    />
                    <div className="flex-1 space-y-2">
                      <h3 className="font-bold text-lg">{item.productName}</h3>
                      <p className="text-primary font-bold">Rp {item.price.toLocaleString()}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 pixel-button"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.productId, Number.parseInt(e.target.value) || 1)}
                            className="w-16 text-center pixel-border"
                            min="1"
                          />
                          <Button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 pixel-button"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <Button
                          onClick={() => removeFromCart(item.productId)}
                          size="icon"
                          variant="destructive"
                          className="pixel-button"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Subtotal: Rp {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div>
            <Card className="pixel-card sticky top-24">
              <CardContent className="p-6 space-y-6">
                <h2 className="text-2xl pixel-text">Ringkasan</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>Rp {totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-4 border-t">
                    <span>Total</span>
                    <span className="text-primary">Rp {totalAmount.toLocaleString()}</span>
                  </div>
                </div>
                <Link href="/checkout">
                  <Button className="w-full pixel-button text-lg">Checkout</Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full pixel-button bg-transparent">
                    Lanjut Belanja
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
