"use client"

import { useAdminProtection } from "@/lib/hooks/use-admin-check"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export default function AdminPage() {
  const { user, loading } = useAdminProtection()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pixel-bg">
        <div className="text-center">
          <div className="animate-pulse-slow text-4xl mb-4">Loading...</div>
        </div>
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return null
  }

  return <AdminDashboard />
}
