"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Icon } from "@iconify/react"
import { supabase } from "@/lib/supabase"
import {
  AUTH_CHANNEL,
  SIGNED_OUT,
  clearActivity,
  isSessionExpired,
  readActivity,
  touchActivity,
} from "@/lib/admin-session"
import { cn } from "@/lib/utils"

/** Fréquence de rafraîchissement du cookie d'activité et du contrôle d'inactivité. */
const BATTEMENT_MS = 30_000

const EVENEMENTS_ACTIVITE = ["pointerdown", "keydown", "scroll", "visibilitychange"] as const

const NAV_ITEMS = [
  { label: "Vue d'ensemble", href: "/gestion", icon: "line-md:grid-3-twotone" },
  { label: "Contenu", href: "/gestion/content", icon: "line-md:document-list-twotone" },
  { label: "Projets", href: "/gestion/projects", icon: "line-md:briefcase-twotone" },
  { label: "Services", href: "/gestion/services", icon: "line-md:star-twotone" },
  { label: "Blog", href: "/gestion/blog", icon: "line-md:pencil-alt-twotone" },
  { label: "Design", href: "/gestion/design", icon: "line-md:paint-drop-twotone" },
  { label: "SEO", href: "/gestion/seo", icon: "line-md:search-twotone" },
  { label: "Paramètres", href: "/gestion/settings", icon: "line-md:cog-loop" },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [checking, setChecking] = useState(true)
  const canal = useRef<BroadcastChannel | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session && pathname !== "/gestion/login") {
        router.push("/gestion/login")
      } else {
        setUserEmail(session?.user?.email ?? null)
        setChecking(false)
      }
    })
  }, [pathname, router])

  /**
   * Fin de session : le signOut() révoque réellement le jeton côté Supabase,
   * là où le proxy se contente d'effacer les cookies.
   */
  const terminerSession = useCallback(
    async (expiree: boolean) => {
      await supabase.auth.signOut()
      clearActivity()
      canal.current?.postMessage(SIGNED_OUT)
      router.push(expiree ? "/gestion/login?expiree=1" : "/gestion/login")
    },
    [router]
  )

  // Durée de vie de la session : voir lib/admin-session.ts. Le cookie
  // d'activité est réécrit à chaque geste, et un onglet laissé ouvert se
  // déconnecte tout seul au bout de 30 minutes sans rien attendre du serveur.
  useEffect(() => {
    if (pathname === "/gestion/login") return

    touchActivity()
    let dernierEcrit = Date.now()

    const marquer = () => {
      // Contrôler avant d'écrire : revenir sur un onglet resté en arrière-plan
      // déclenche visibilitychange, qui ressusciterait une session déjà expirée.
      if (isSessionExpired(readActivity())) {
        terminerSession(true)
        return
      }
      if (Date.now() - dernierEcrit < BATTEMENT_MS) return
      dernierEcrit = Date.now()
      touchActivity()
    }

    for (const evenement of EVENEMENTS_ACTIVITE) {
      window.addEventListener(evenement, marquer, { passive: true })
    }

    const veille = setInterval(() => {
      if (isSessionExpired(readActivity())) terminerSession(true)
    }, BATTEMENT_MS)

    return () => {
      for (const evenement of EVENEMENTS_ACTIVITE) {
        window.removeEventListener(evenement, marquer)
      }
      clearInterval(veille)
    }
  }, [pathname, terminerSession])

  // Déconnexion partagée entre onglets : le canal couvre l'onglet actif,
  // onAuthStateChange rattrape ceux qui n'écoutaient pas encore.
  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return

    const bc = new BroadcastChannel(AUTH_CHANNEL)
    canal.current = bc
    bc.onmessage = (event) => {
      if (event.data === SIGNED_OUT && pathname !== "/gestion/login") {
        router.push("/gestion/login")
      }
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT" && pathname !== "/gestion/login") {
        router.push("/gestion/login")
      }
    })

    return () => {
      subscription.unsubscribe()
      bc.close()
      canal.current = null
    }
  }, [pathname, router])

  if (pathname === "/gestion/login") return <>{children}</>

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

  const handleSignOut = () => terminerSession(false)

  return (
    <div className="admin-shell min-h-screen flex" style={{ background: "#05050F" }}>
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
            <span style={{ background: "linear-gradient(135deg, #7C3AED, #A855F7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
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
        {/* overflow-x-clip et non overflow-auto : la valeur auto faisait de
            <main> un conteneur de defilement, alors que c'est la fenetre qui
            defile. Tout position:sticky a l'interieur se calait donc sur un
            conteneur sans course possible, et ne collait jamais. clip borne le
            debordement horizontal sans creer ce conteneur. */}
        <main className="flex-1 p-5 lg:p-7 overflow-x-clip">{children}</main>
      </div>
    </div>
  )
}
