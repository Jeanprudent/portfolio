import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Supabase v2 stores sessions in localStorage, not cookies.
// Auth protection is handled client-side in app/admin/layout.tsx.
export function middleware(_request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
