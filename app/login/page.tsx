import { LoginForm } from "@/components/auth/login-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 pixel-bg">
      <div className="w-full max-w-md space-y-4">
        <LoginForm />
        <p className="text-center text-sm text-muted-foreground">
          Belum punya akun?{" "}
          <Link href="/register">
            <Button variant="link" className="p-0 h-auto pixel-text">
              Daftar sekarang
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
