"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Icon } from "@iconify/react"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { label: "Vue d'ensemble", href: "/admin", icon: "line-md:grid-3-twotone" },
  { label: "Contenu", href: "/admin/content", icon: "line-md:document-list-twotone" },
  { label: "Projets", href: "/admin/projects", icon: "line-md:briefcase-twotone" },
  { label: "Services", href: "/admin/services", icon: "line-md:star-twotone" },
  { label: "Blog", href: "/admin/blog", icon: "line-md:pencil-alt-twotone" },
  { label: "Design", href: "/admin/design", icon: "line-md:paint-drop-twotone" },
  { label: "SEO", href: "/admin/seo", icon: "line-md:search-twotone" },
  { label: "Paramètres", href: "/admin/settings", icon: "line-md:cog-loop" },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session && pathname !== "/admin/login") {
        router.push("/admin/login")
      } else {
        setUserEmail(session?.user?.email ?? null)
        setChecking(false)
      }
    })
  }, [pathname, router])

  if (pathname === "/admin/login") return <>{children}</>

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#05050F" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(124,58,237,0.2)" }}>
            <Icon icon="line-md:loading-loop" width={24} className="text-[#A855F7]" />
          </div>
          <p className="text-white/40 text-sm">Vérification...</p>
        </div>
      </div>
    )
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#05050F" }}>
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:flex",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{
          background: "rgba(10,5,32,0.95)",
          backdropFilter: "blur(24px)",
          borderRight: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <Link href="/" className="font-heading font-bold text-lg">
            <span style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Jean
            </span>
            <span className="text-white">Prudent</span>
          </Link>
          <span className="px-2 py-0.5 rounded-md text-xs font-semibold" style={{ background: "rgba(124,58,237,0.2)", color: "#A855F7" }}>
            Admin
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  active
                    ? "text-white"
                    : "text-white/50 hover:text-white/80 hover:bg-white/5"
                )}
                style={active ? {
                  background: "rgba(124,58,237,0.2)",
                  border: "1px solid rgba(124,58,237,0.3)",
                  color: "#fff",
                } : undefined}
              >
                <Icon icon={item.icon} width={18} className={active ? "text-[#A855F7]" : ""} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-3 mb-3 px-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "rgba(124,58,237,0.2)" }}
            >
              <Icon icon="line-md:person-twotone" width={18} className="text-[#A855F7]" />
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-medium truncate">Jean Prudent</p>
              <p className="text-white/40 text-xs truncate">{userEmail}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-white/50 hover:text-white/80 hover:bg-white/5 transition-all duration-200"
            >
              <Icon icon="line-md:external-link" width={14} />
              Portfolio
            </Link>
            <button
              onClick={handleSignOut}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
            >
              <Icon icon="line-md:logout" width={14} />
              Déconnecter
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header
          className="sticky top-0 z-30 flex items-center justify-between px-5 h-14 lg:px-7"
          style={{
            background: "rgba(5,5,15,0.85)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5"
            aria-label="Menu"
          >
            <Icon icon="line-md:menu" width={22} />
          </button>
          <div className="hidden lg:flex items-center gap-2 text-white/40 text-sm">
            <Icon icon="line-md:home-twotone" width={15} />
            <span>/</span>
            <span className="text-white">
              {NAV_ITEMS.find((n) => n.href === pathname)?.label ?? "Dashboard"}
            </span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-white/40">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              En ligne
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 lg:p-7 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
