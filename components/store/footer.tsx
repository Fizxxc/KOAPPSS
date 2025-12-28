import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="pixel-border bg-card mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="pixel-text text-primary text-lg mb-4">KOGRAPH - APPS</h3>
            <p className="text-sm text-muted-foreground">
              Platform premium untuk aplikasi dan layanan digital berkualitas tinggi
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Link Cepat</h4>
            <div className="flex flex-col gap-2">
              <Link href="/about" className="text-sm hover:text-primary transition-colors">
                Tentang Kami
              </Link>
              <Link href="/contact" className="text-sm hover:text-primary transition-colors">
                Hubungi Kami
              </Link>
              <Link href="/faq" className="text-sm hover:text-primary transition-colors">
                FAQ
              </Link>
              <Link href="/privacy" className="text-sm hover:text-primary transition-colors">
                Kebijakan Privasi
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">Kontak</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>contact@kograph.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+62 812-3456-7890</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">Ikuti Kami</h4>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 KOGRAPH - APPS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
