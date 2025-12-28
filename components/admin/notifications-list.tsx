"use client"

import { useState, useEffect } from "react"
import { collection, query, where, onSnapshot, orderBy, updateDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { useAuth } from "@/lib/auth-context"
import type { Notification } from "@/lib/firebase/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, Check } from "lucide-react"

interface NotificationsListProps {
  isAdmin?: boolean
}

export function NotificationsList({ isAdmin = false }: NotificationsListProps) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!user) return

    const q = isAdmin
      ? query(collection(db, "notifications"), where("type", "==", "order"), orderBy("createdAt", "desc"))
      : query(collection(db, "notifications"), where("userId", "==", user.id), orderBy("createdAt", "desc"))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Notification)
      setNotifications(notifData)
      setUnreadCount(notifData.filter((n) => !n.read).length)
    })

    return () => unsubscribe()
  }, [user, isAdmin])

  const markAsRead = async (notifId: string) => {
    await updateDoc(doc(db, "notifications", notifId), { read: true })
  }

  const markAllAsRead = async () => {
    const unreadNotifs = notifications.filter((n) => !n.read)
    await Promise.all(unreadNotifs.map((n) => updateDoc(doc(db, "notifications", n.id), { read: true })))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl pixel-text">Notifikasi</h2>
          {unreadCount > 0 && (
            <Badge className="pixel-border bg-accent text-accent-foreground animate-pulse-slow">
              {unreadCount} Baru
            </Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} size="sm" className="pixel-button">
            <Check className="w-4 h-4 mr-2" /> Tandai Semua Dibaca
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card className="pixel-card">
            <CardContent className="p-8 text-center text-muted-foreground">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Tidak ada notifikasi</p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notif) => (
            <Card
              key={notif.id}
              className={`pixel-card cursor-pointer hover:bg-muted/50 transition-colors ${!notif.read ? "border-primary border-2" : ""}`}
              onClick={() => !notif.read && markAsRead(notif.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-bold">{notif.title}</h4>
                      {!notif.read && <Badge className="pixel-border bg-primary text-xs">BARU</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{notif.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {notif.createdAt.toDate().toLocaleString("id-ID")}
                    </p>
                  </div>
                  <Bell
                    className={`w-5 h-5 ${!notif.read ? "text-primary animate-pulse-slow" : "text-muted-foreground"}`}
                  />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
