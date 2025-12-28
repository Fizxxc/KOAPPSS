"use client"

import type { Stats } from "@/lib/firebase/types"
import { Card, CardContent } from "@/components/ui/card"
import { Users, CheckCircle, Star, Clock } from "lucide-react"

interface StatsDisplayProps {
  stats: Stats
}

export function StatsDisplay({ stats }: StatsDisplayProps) {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        <Card className="pixel-card text-center animate-pulse-slow">
          <CardContent className="p-6">
            <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
            <div className="text-3xl md:text-4xl pixel-text text-primary mb-2">{stats.clientsSatisfied}</div>
            <p className="text-sm text-muted-foreground">Klien Puas</p>
          </CardContent>
        </Card>

        <Card className="pixel-card text-center animate-pulse-slow">
          <CardContent className="p-6">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-secondary" />
            <div className="text-3xl md:text-4xl pixel-text text-secondary mb-2">{stats.projectsCompleted}</div>
            <p className="text-sm text-muted-foreground">Project Selesai</p>
          </CardContent>
        </Card>

        <Card className="pixel-card text-center animate-pulse-slow">
          <CardContent className="p-6">
            <Star className="w-12 h-12 mx-auto mb-4 text-accent" />
            <div className="text-3xl md:text-4xl pixel-text text-accent mb-2">{stats.averageRating.toFixed(1)}</div>
            <p className="text-sm text-muted-foreground">Rating</p>
          </CardContent>
        </Card>

        <Card className="pixel-card text-center animate-pulse-slow">
          <CardContent className="p-6">
            <Clock className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
            <div className="text-3xl md:text-4xl pixel-text text-yellow-500 mb-2">{stats.responseTime}m</div>
            <p className="text-sm text-muted-foreground">Response Time</p>
          </CardContent>
        </Card>
      </div>

      <Card className="pixel-card text-center mt-8 animate-glow">
        <CardContent className="p-8">
          <div className="flex items-center justify-center gap-4">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
            <p className="text-xl pixel-text">
              <span className="text-primary text-3xl">{stats.activeUsers}</span> User Aktif Sekarang
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
