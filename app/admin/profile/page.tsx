"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useAdminCheck } from "@/lib/hooks/use-admin-check"
import { Navbar } from "@/components/store/navbar"
import { Footer } from "@/components/store/footer"
import { ProfileInfo } from "@/components/profile/profile-info"
import { OrderHistory } from "@/components/profile/order-history"
import { NotificationsList } from "@/components/admin/notifications-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, ShoppingBag, Bell, Settings } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminProfilePage() {
  const { user, loading } = useAuth()
  const { isAdmin, loading: adminLoading } = useAdminCheck()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !adminLoading) {
      if (!user || !isAdmin) {
        router.push("/admin")
      }
    }
  }, [user, isAdmin, loading, adminLoading, router])

  if (loading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pixel-bg">
        <div className="text-center">
          <div className="animate-pulse-slow text-4xl mb-4 text-primary">Loading...</div>
        </div>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen pixel-bg flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl pixel-text text-primary mb-2">Profil Admin</h1>
          <p className="text-muted-foreground">Kelola profil dan informasi akun admin Anda</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid grid-cols-4 gap-2 bg-muted p-2 pixel-border">
            <TabsTrigger value="profile" className="pixel-button">
              <User className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="pixel-button">
              <ShoppingBag className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Orders</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="pixel-button">
              <Bell className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Notifikasi</span>
            </TabsTrigger>
            <TabsTrigger value="info" className="pixel-button">
              <Settings className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Info</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileInfo user={user} />
          </TabsContent>

          <TabsContent value="orders">
            <Card className="pixel-card">
              <CardHeader>
                <CardTitle className="pixel-text text-secondary">Semua Order</CardTitle>
              </CardHeader>
              <CardContent>
                <OrderHistory userId="all" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationsList isAdmin={true} />
          </TabsContent>

          <TabsContent value="info">
            <Card className="pixel-card">
              <CardHeader>
                <CardTitle className="pixel-text text-accent">Informasi Admin</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-primary/10 rounded border-2 border-primary">
                    <p className="text-sm text-muted-foreground">Role</p>
                    <p className="text-2xl font-bold text-primary">Administrator</p>
                  </div>
                  <div className="p-4 bg-secondary/10 rounded border-2 border-secondary">
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="text-2xl font-bold text-secondary">Active</p>
                  </div>
                  <div className="p-4 bg-accent/10 rounded border-2 border-accent">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-lg font-bold text-accent">{user.email}</p>
                  </div>
                  <div className="p-4 bg-success/10 rounded border-2 border-success">
                    <p className="text-sm text-muted-foreground">Nama</p>
                    <p className="text-lg font-bold text-success">{user.displayName}</p>
                  </div>
                </div>
                <div className="mt-6 p-6 bg-muted/50 rounded">
                  <h3 className="font-bold mb-3 text-lg">Hak Akses Admin:</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      Mengelola semua produk dan layanan
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-secondary rounded-full"></span>
                      Melihat dan mengubah status order
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-accent rounded-full"></span>
                      Mengatur statistik website secara manual
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-success rounded-full"></span>
                      Mengelola testimoni dan rating
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-warning rounded-full"></span>
                      Mengubah settings website (About, Contact, FAQ)
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}
