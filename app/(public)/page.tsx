import { notFound } from "next/navigation"

// Root route handled by app/page.tsx — this avoids route group conflict
export default function PublicGroupPage() {
  notFound()
}
