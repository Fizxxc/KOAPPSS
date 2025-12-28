"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductManagement } from "./product-management"
import { OrderManagement } from "./order-management"
import { StatsManagement } from "./stats-management"
import { SettingsManagement } from "./settings-management"
import { NotificationsList } from "./notifications-list"
import { TestimonialManagement } from "./testimonial-management"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { LogOut, Package, ShoppingCart, BarChart3, Settings, Bell, MessageSquare } from "lucide-react"

export function AdminDashboard() {
  const { user, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState("products")

  return (
    <div className="min-h-screen pixel-bg">
      <header className="pixel-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl pixel-text text-primary">KOGRAPH - ADMIN</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm hidden md:inline">Admin: {user?.displayName}</span>
            <Button onClick={signOut} variant="outline" size="sm" className="pixel-button bg-transparent">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2 bg-muted p-2 pixel-border">
            <TabsTrigger value="products" className="pixel-button">
              <Package className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Produk</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="pixel-button">
              <ShoppingCart className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Order</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="pixel-button">
              <BarChart3 className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Stats</span>
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="pixel-button">
              <MessageSquare className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Testimoni</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="pixel-button">
              <Bell className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Notif</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="pixel-button">
              <Settings className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ProductManagement />
          </TabsContent>

          <TabsContent value="orders">
            <OrderManagement />
          </TabsContent>

          <TabsContent value="stats">
            <StatsManagement />
          </TabsContent>

          <TabsContent value="testimonials">
            <TestimonialManagement />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationsList isAdmin={true} />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
