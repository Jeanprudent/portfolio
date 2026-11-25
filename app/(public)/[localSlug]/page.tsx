import { notFound } from "next/navigation"
import type { Metadata } from "next"

import { LocalSeoPage } from "@/components/local/LocalSeoPage"
import { resolveLocalSlug, localPath, localTitle } from "@/lib/local-seo"
import { getLocalVilles } from "@/lib/supabase-data"
import { absoluteUrl, SITE_URL } from "@/lib/site"
import { CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/contact-info"

// Rendu à la demande : une ville activée dans /gestion/zones apparaît sans
// attendre un build, comme le reste des contenus Supabase. Un slug inconnu
// renvoie un vrai 404 via notFound().
export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ localSlug: string }>
}): Promise<Metadata> {
  const { localSlug } = await params
  const villes = await getLocalVilles()
  const page = resolveLocalSlug(localSlug, villes)
  if (!page) return { title: "Page introuvable" }

  const { expertise: e, ville: v } = page
  const titre = localTitle(e, v)
  const path = localPath(e, v)
  const description = `${e.nomCourt} ${v.prep} ${v.nom} (${v.pays}) : ${e.accroche} PME, TPE et entrepreneurs, devis gratuit sur WhatsApp.`.slice(0, 160)

  return {
    title: titre,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      title: `${titre} | Jean Prudent`,
      description,
      url: absoluteUrl(path),
      locale: "fr_FR",
      images: [{ url: e.image }],
    },
    twitter: { card: "summary_large_image", title: titre, description },
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ localSlug: string }>
}) {
  const { localSlug } = await params
  const villes = await getLocalVilles()
  const page = resolveLocalSlug(localSlug, villes)
  if (!page) notFound()

  const { expertise: e, ville: v } = page
  const titre = localTitle(e, v)
  const path = localPath(e, v)
  const faq = e.faq(v.nom)

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: e.nom,
    name: titre,
    description: e.accroche,
    url: absoluteUrl(path),
    areaServed: { "@type": "City", name: v.nom, address: { "@type": "PostalAddress", addressCountry: v.pays, addressRegion: v.region } },
    provider: {
      "@type": "Person",
      name: "Jean Prudent IDOHOU",
      url: SITE_URL,
      email: CONTACT_EMAIL,
      telephone: `+${CONTACT_PHONE}`,
    },
  }

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.r },
    })),
  }

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: e.nomCourt, item: absoluteUrl(`/services/${e.serviceSlug}`) },
      { "@type": "ListItem", position: 3, name: v.nom, item: absoluteUrl(path) },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <LocalSeoPage expertiseSlug={e.slug} ville={v} />
    </>
  )
}
