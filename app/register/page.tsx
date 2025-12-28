import { RegisterForm } from "@/components/auth/register-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 pixel-bg">
      <div className="w-full max-w-md space-y-4">
        <RegisterForm />
        <p className="text-center text-sm text-muted-foreground">
          Sudah punya akun?{" "}
          <Link href="/login">
            <Button variant="link" className="p-0 h-auto pixel-text">
              Login sekarang
            </Button>
          </Link>
        </p>
        <Link href="/">
          <Button variant="outline" className="w-full pixel-border bg-transparent">
            Kembali ke Beranda
          </Button>
        </Link>
      </div>
    </div>
  )
}
