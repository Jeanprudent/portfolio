import { notFound } from "next/navigation"
import type { Metadata } from "next"

import ServiceHero from "@/components/services/ServiceHero"
import ServiceDefinition from "@/components/services/ServiceDefinition"
import ServiceWhy from "@/components/services/ServiceWhy"
import ServiceIncludes from "@/components/services/ServiceIncludes"
import ServiceProcess from "@/components/services/ServiceProcess"
import ServicePricing from "@/components/services/ServicePricing"
import ServiceFaq from "@/components/services/ServiceFaq"
import RelatedServices from "@/components/services/RelatedServices"
import ContactModal from "@/components/services/ContactModal"
import { ServiceJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd"

import { getService, getServiceSlugs } from "@/lib/supabase-data"
import { parseServiceContent } from "@/lib/service-content"
import { serviceSlug } from "@/lib/slug"
import { absoluteUrl } from "@/lib/site"
import {
  CONTACT_EMAIL,
  CONTACT_WHATSAPP,
  CONTACT_PHONE_DISPLAY,
} from "@/lib/contact-info"

const normalize = (slug: string) =>
  decodeURIComponent(String(slug ?? "")).trim().toLowerCase()

// Les slugs viennent de la base, avec repli sur le fichier : un service créé
// depuis le back-office doit être prérendu comme les autres.
export async function generateStaticParams() {
  const slugs = await getServiceSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const service = await getService(normalize(slug))
  if (!service) return { title: "Service introuvable" }

  const path = `/services/${service.slug ?? serviceSlug(service)}`
  const content = parseServiceContent(service.content)
  const description = content.hero.tagline || service.description

  // Le gabarit « %s | Jean Prudent » du layout consomme 15 caractères :
  // au-delà de 45 ici, le titre est tronqué dans les résultats Google.
  return {
    title: service.title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: service.title,
      description,
      url: absoluteUrl(path),
      images: service.banner ? [{ url: service.banner }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: service.title,
      description,
    },
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const service = await getService(normalize(slug))

  // Vrai 404 : rendre un message en 200 serait un soft 404, indexé par
  // Google comme du contenu valide.
  if (!service) notFound()

  const content = parseServiceContent(service.content)
  const currentSlug = service.slug ?? serviceSlug(service)

  return (
    <div className="container-max section-spacing">
      <ServiceJsonLd
        service={service}
        content={content}
        path={`/services/${currentSlug}`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Services", path: "/services" },
          { name: service.title, path: `/services/${currentSlug}` },
        ]}
      />

      <ServiceHero service={service} content={content} />

      {/* Encart de contact, en tête de colonne tant que la page est courte. */}
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <ServiceDefinition content={content} />
        </div>

        <aside className="md:sticky md:top-24 md:self-start">
          <div className="glass-card p-6">
            <h2 className="font-heading font-semibold text-lg mb-2">Intéressé ?</h2>
            <p className="text-sm text-(--text-secondary) mb-4">
              Discutons de votre projet et obtenez un devis personnalisé.
            </p>
            <ContactModal projectType={service.title} />
            <div className="mt-4 text-sm text-(--text-secondary) space-y-1">
              <div>
                Téléphone :{" "}
                <a href={`tel:+${CONTACT_WHATSAPP}`}>{CONTACT_PHONE_DISPLAY}</a>
              </div>
              <div>
                Email : <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <ServiceWhy content={content} />
      <ServiceIncludes content={content} />
      <ServiceProcess content={content} />
      <ServicePricing service={service} content={content} />
      <ServiceFaq content={content} />
      <RelatedServices currentSlug={currentSlug} />
    </div>
  )
}
