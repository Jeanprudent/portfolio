import { Icon } from "@iconify/react"
import Link from "next/link"

const OVERVIEW_CARDS = [
  {
    label: "Services actifs",
    value: "4",
    icon: "line-md:star-twotone",
    href: "/gestion/services",
    color: "#7C3AED",
  },
  {
    label: "Projets publiés",
    value: "4",
    icon: "line-md:briefcase-twotone",
    href: "/gestion/projects",
    color: "#06B6D4",
  },
  {
    label: "Articles de blog",
    value: "0",
    icon: "line-md:pencil-alt-twotone",
    href: "/gestion/blog",
    color: "#A855F7",
  },
  {
    label: "Témoignages",
    value: "3",
    icon: "line-md:chat-twotone",
    href: "/gestion/content",
    color: "#F59E0B",
  },
]

const QUICK_ACTIONS = [
  { label: "Modifier le contenu", href: "/gestion/content", icon: "line-md:document-list-twotone" },
  { label: "Ajouter un projet", href: "/gestion/projects", icon: "line-md:plus-circle-twotone" },
  { label: "Écrire un article", href: "/gestion/blog", icon: "line-md:pencil-alt-twotone" },
  { label: "Réglages SEO", href: "/gestion/seo", icon: "line-md:search-twotone" },
  { label: "Personnaliser le design", href: "/gestion/design", icon: "line-md:paint-drop-twotone" },
  { label: "Paramètres généraux", href: "/gestion/settings", icon: "line-md:cog-loop" },
]

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="font-heading font-bold text-2xl text-white mb-1">
          Bonjour, Jean Prudent 👋
        </h1>
        <p className="text-white/50 text-sm">
          Gérez votre portfolio depuis ce tableau de bord.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {OVERVIEW_CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-xl p-5 flex flex-col gap-3 transition-all duration-200 hover:scale-[1.02]"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: `${card.color}20`, border: `1px solid ${card.color}30` }}
            >
              <Icon icon={card.icon} width={20} style={{ color: card.color }} />
            </div>
            <div>
              <p className="text-white font-bold text-2xl">{card.value}</p>
              <p className="text-white/50 text-xs mt-0.5">{card.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-white font-semibold text-base mb-4">Actions rapides</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center gap-3 p-4 rounded-xl transition-all duration-200 group hover:border-[rgba(124,58,237,0.4)]"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}
              >
                <Icon icon={action.icon} width={18} className="text-[#A855F7]" />
              </div>
              <span className="text-white/70 group-hover:text-white text-sm font-medium transition-colors duration-200">
                {action.label}
              </span>
              <Icon
                icon="line-md:arrow-right"
                width={14}
                className="text-white/20 group-hover:text-white/50 ml-auto transition-colors duration-200"
              />
            </Link>
          ))}
        </div>
      </div>

      {/* Portfolio link */}
      <div
        className="rounded-xl p-5 flex items-center justify-between"
        style={{
          background: "rgba(124,58,237,0.08)",
          border: "1px solid rgba(124,58,237,0.2)",
        }}
      >
        <div className="flex items-center gap-3">
          <Icon icon="line-md:external-link" width={20} className="text-[#7C3AED]" />
          <div>
            <p className="text-white font-medium text-sm">Voir votre portfolio en ligne</p>
            <p className="text-white/40 text-xs mt-0.5">Vérifiez le rendu public de votre site</p>
          </div>
        </div>
        <Link
          href="/"
          target="_blank"
          className="px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all duration-200"
          style={{ background: "rgba(124,58,237,0.25)", border: "1px solid rgba(124,58,237,0.4)" }}
        >
          Ouvrir
        </Link>
      </div>
    </div>
  )
}
