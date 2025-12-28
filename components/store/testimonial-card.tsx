import type { Testimonial } from "@/lib/firebase/types"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

interface TestimonialCardProps {
  testimonial: Testimonial
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <Card className="pixel-card">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-4">
          <Avatar className="w-12 h-12 pixel-border">
            <AvatarImage src={testimonial.userPhoto || "/placeholder.svg"} />
            <AvatarFallback>{testimonial.userName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-bold">{testimonial.userName}</h4>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < testimonial.rating ? "fill-accent text-accent" : "text-muted"}`}
                />
              ))}
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground italic">"{testimonial.message}"</p>
        <p className="text-xs text-muted-foreground">{testimonial.createdAt.toDate().toLocaleDateString("id-ID")}</p>
      </CardContent>
    </Card>
  )
}
