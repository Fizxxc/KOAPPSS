"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Navbar } from "@/components/store/navbar"
import { Footer } from "@/components/store/footer"
import { ProfileInfo } from "@/components/profile/profile-info"
import { OrderHistory } from "@/components/profile/order-history"
import { NotificationsList } from "@/components/admin/notifications-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, ShoppingBag, Bell } from "lucide-react"

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pixel-bg">
        <div className="text-center">
          <div className="animate-pulse-slow text-4xl mb-4">Loading...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen pixel-bg flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl pixel-text mb-8 text-primary">Profil Saya</h1>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid grid-cols-3 gap-2 bg-muted p-2 pixel-border">
            <TabsTrigger value="profile" className="pixel-button">
              <User className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="pixel-button">
              <ShoppingBag className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Pesanan</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="pixel-button">
              <Bell className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Notifikasi</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileInfo user={user} />
          </TabsContent>

          <TabsContent value="orders">
            <OrderHistory userId={user.id} />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationsList isAdmin={false} />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}
