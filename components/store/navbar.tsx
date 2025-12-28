"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, User, LogOut, Menu, Home, Info, Phone, Shield, HelpCircle } from "lucide-react"

export function Navbar() {
  const { user, signOut } = useAuth()
  const { totalItems } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="pixel-border bg-card sticky top-0 z-50 backdrop-blur">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <h1 className="text-xl md:text-2xl pixel-text text-primary hover:text-accent transition-colors">
              KOGRAPH - APPS
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/">
              <Button variant="ghost" className="pixel-button bg-transparent">
                <Home className="w-4 h-4 mr-2" /> Beranda
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="ghost" className="pixel-button bg-transparent">
                <Info className="w-4 h-4 mr-2" /> Tentang
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="ghost" className="pixel-button bg-transparent">
                <Phone className="w-4 h-4 mr-2" /> Kontak
              </Button>
            </Link>
            <Link href="/faq">
              <Button variant="ghost" className="pixel-button bg-transparent">
                <HelpCircle className="w-4 h-4 mr-2" /> FAQ
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/cart">
              <Button variant="outline" className="relative pixel-button bg-transparent">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 pixel-border bg-accent text-accent-foreground animate-pulse-slow">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>

            {user ? (
              <>
                <Link href={user.role === "admin" ? "/admin" : "/profile"}>
                  <Button variant="outline" className="pixel-button bg-transparent">
                    <User className="w-5 h-5" />
                  </Button>
                </Link>
                <Button onClick={signOut} variant="outline" className="hidden md:flex pixel-button bg-transparent">
                  <LogOut className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button className="pixel-button">Login</Button>
              </Link>
            )}

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="icon" className="pixel-button bg-transparent">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="pixel-border bg-card">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link href="/" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start pixel-button bg-transparent">
                      <Home className="w-4 h-4 mr-2" /> Beranda
                    </Button>
                  </Link>
                  <Link href="/about" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start pixel-button bg-transparent">
                      <Info className="w-4 h-4 mr-2" /> Tentang Kami
                    </Button>
                  </Link>
                  <Link href="/contact" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start pixel-button bg-transparent">
                      <Phone className="w-4 h-4 mr-2" /> Hubungi Kami
                    </Button>
                  </Link>
                  <Link href="/faq" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start pixel-button bg-transparent">
                      <HelpCircle className="w-4 h-4 mr-2" /> FAQ
                    </Button>
                  </Link>
                  <Link href="/privacy" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start pixel-button bg-transparent">
                      <Shield className="w-4 h-4 mr-2" /> Kebijakan Privasi
                    </Button>
                  </Link>
                  {user && (
                    <Button
                      onClick={signOut}
                      variant="outline"
                      className="w-full justify-start pixel-button bg-transparent"
                    >
                      <LogOut className="w-4 h-4 mr-2" /> Logout
                    </Button>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
