import type { Metadata } from "next"
import { AProposContent } from "@/components/about/AProposContent"
import { getPortfolioConfig } from "@/lib/supabase-data"
import { absoluteUrl, SITE_URL } from "@/lib/site"
import { CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/contact-info"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "À propos : parcours & expertise digitale à Cotonou",
  description:
    "Qui est Jean Prudent IDOHOU : parcours, valeurs et expertise en création de site web, référencement et automatisation pour les PME et entrepreneurs au Bénin.",
  alternates: { canonical: "/a-propos" },
  openGraph: {
    type: "profile",
    title: "À propos : Jean Prudent, consultant digital à Cotonou",
    description:
      "Parcours, valeurs et expertise au service des PME et entrepreneurs au Bénin : site web, SEO et automatisation.",
    url: absoluteUrl("/a-propos"),
    locale: "fr_FR",
  },
}

export default async function Page() {
  const config = await getPortfolioConfig()

  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Jean Prudent IDOHOU",
    jobTitle: "Consultant & développeur web",
    url: absoluteUrl("/a-propos"),
    email: CONTACT_EMAIL,
    telephone: `+${CONTACT_PHONE}`,
    address: { "@type": "PostalAddress", addressLocality: "Cotonou", addressCountry: "Bénin" },
    knowsAbout: ["Création de site web", "Référencement SEO", "Automatisation", "WordPress", "Next.js"],
  }

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "À propos", item: absoluteUrl("/a-propos") },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <AProposContent config={config} />
    </>
  )
}
