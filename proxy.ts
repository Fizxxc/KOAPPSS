import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  // This is a client-side routing protection
  // Actual auth protection is handled by the auth context
  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*"],
}
