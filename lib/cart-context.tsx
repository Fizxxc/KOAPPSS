"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import type { CartItem } from "./firebase/types"

interface CartContextType {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalAmount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])

  useEffect(() => {
    const savedCart = localStorage.getItem("kograph-cart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("kograph-cart", JSON.stringify(cart))
  }, [cart])

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.productId === item.productId)
      if (existingItem) {
        return prevCart.map((i) =>
          i.productId === item.productId ? { ...i, quantity: i.quantity + item.quantity } : i,
        )
      }
      return [...prevCart, item]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.productId !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart((prevCart) => prevCart.map((item) => (item.productId === productId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCart([])
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalAmount }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
