import { absoluteUrl, SITE_URL } from "@/lib/site"
import { CONTACT_EMAIL, CONTACT_LOCATION, CONTACT_PHONE } from "@/lib/contact-info"
import { datePublication } from "@/lib/utils"
import type { Service, BlogPost } from "@/types/portfolio"
import type { ServiceContent } from "@/lib/service-content"

/**
 * Identifiants et constantes d'entités partagés par les schémas.
 *
 * Donner un `@id` stable à la personne, à l'activité et au site permet de les
 * relier entre eux (graphe d'entités) : Google et les moteurs IA comprennent
 * qu'il s'agit d'un seul et même acteur, ce qui renforce le signal local/GEO.
 */
const PERSON_ID = `${SITE_URL}/#person`
const BUSINESS_ID = `${SITE_URL}/#business`
const ORG_LOGO = absoluteUrl("/brand/full-color.png")
/** Profils publics officiels (réutilisés par Person et ProfessionalService). */
const SAME_AS = [
  "https://github.com/Jeanprudent",
  "https://www.linkedin.com/in/jean-prudent-idohou-4a1409287",
  "https://www.facebook.com/jean.prudent.2025",
]
/** Coordonnées de Cotonou (centre), pour la proximité locale. */
const GEO_COTONOU = { "@type": "GeoCoordinates", latitude: 6.3654, longitude: 2.4183 }

/**
 * Données structurées Schema.org, en JSON-LD.
 *
 * Le script est inséré dans le corps de la page : Google lit le JSON-LD où
 * qu'il se trouve, et le passer par <head> obligerait à remonter les
 * données jusqu'au layout.
 *
 * Note honnête sur FAQPage : depuis août 2023, Google réserve les résultats
 * enrichis FAQ aux sites gouvernementaux et de santé. Le balisage garde son
 * intérêt pour la compréhension sémantique, mais il ne faut pas en attendre
 * d'affichage particulier dans les résultats.
 */
function Script({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // Contenu maîtrisé, sérialisé par JSON.stringify : les caractères
      // spéciaux sont échappés, aucune saisie utilisateur n'est injectée brute.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

/** Fil d'Ariane : Accueil > … */
export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; path: string }[]
}) {
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [{ name: "Accueil", path: "/" }, ...items].map((it, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: it.name,
          item: absoluteUrl(it.path),
        })),
      }}
    />
  )
}

/** Fiche service : Service + offres + FAQ. */
export function ServiceJsonLd({
  service,
  content,
  path,
}: {
  service: Service
  content: ServiceContent
  path: string
}) {
  const offers = (service.offers ?? []).filter((o) => typeof o.price_min === "number")

  const service_ld = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: content.hero.tagline || service.description,
    url: absoluteUrl(path),
    ...(service.banner ? { image: absoluteUrl(service.banner) } : {}),
    provider: {
      "@type": "Person",
      name: "Jean Prudent IDOHOU",
      url: SITE_URL,
      email: CONTACT_EMAIL,
      telephone: `+${CONTACT_PHONE}`,
    },
    areaServed: [
      { "@type": "City", name: "Cotonou" },
      { "@type": "Country", name: "Bénin" },
    ],
    ...(offers.length
      ? {
          // Les prix sont déjà structurés en base : rien n'est ressaisi ici.
          offers: offers.map((o) => ({
            "@type": "Offer",
            name: o.name,
            description: o.description,
            priceCurrency: o.currency || "XOF",
            ...(o.price_max && o.price_max !== o.price_min
              ? {
                  priceSpecification: {
                    "@type": "PriceSpecification",
                    minPrice: o.price_min,
                    maxPrice: o.price_max,
                    priceCurrency: o.currency || "XOF",
                  },
                }
              : { price: o.price_min }),
          })),
        }
      : {}),
  }

  return (
    <>
      <Script data={service_ld} />
      {content.faq.length > 0 && (
        <Script
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: content.faq.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }}
        />
      )}
    </>
  )
}

/** Article de blog. */
export function ArticleJsonLd({ post }: { post: BlogPost }) {
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        ...(post.cover_url ? { image: absoluteUrl(post.cover_url) } : {}),
        datePublished: datePublication(post),
        dateModified: post.updated_at || post.created_at,
        author: {
          "@type": "Person",
          "@id": PERSON_ID,
          name: "Jean Prudent IDOHOU",
          url: SITE_URL,
        },
        // Google recommande un éditeur Organization doté d'un logo pour les
        // résultats enrichis Article.
        publisher: {
          "@type": "Organization",
          "@id": BUSINESS_ID,
          name: "Jean Prudent IDOHOU, Développeur web & designer",
          url: SITE_URL,
          logo: { "@type": "ImageObject", url: ORG_LOGO },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": absoluteUrl(`/blog/${post.slug}`),
        },
        ...(post.tags.length ? { keywords: post.tags.join(", ") } : {}),
      }}
    />
  )
}

/** Accueil : identité et activité locale. */
export function HomeJsonLd() {
  return (
    <>
      <Script
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          "@id": PERSON_ID,
          name: "Jean Prudent IDOHOU",
          url: SITE_URL,
          image: ORG_LOGO,
          email: CONTACT_EMAIL,
          telephone: `+${CONTACT_PHONE}`,
          jobTitle: "Développeur web & designer",
          worksFor: { "@id": BUSINESS_ID },
          address: {
            "@type": "PostalAddress",
            addressLocality: "Cotonou",
            addressCountry: "BJ",
          },
          sameAs: SAME_AS,
        }}
      />
      <Script
        data={{
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          "@id": BUSINESS_ID,
          name: "Jean Prudent IDOHOU, Développeur web & designer",
          url: SITE_URL,
          image: ORG_LOGO,
          logo: ORG_LOGO,
          email: CONTACT_EMAIL,
          telephone: `+${CONTACT_PHONE}`,
          priceRange: "$$",
          founder: { "@id": PERSON_ID },
          areaServed: [
            { "@type": "City", name: "Cotonou" },
            { "@type": "Country", name: "Bénin" },
          ],
          address: {
            "@type": "PostalAddress",
            addressLocality: "Cotonou",
            addressCountry: "BJ",
          },
          geo: GEO_COTONOU,
          sameAs: SAME_AS,
          description: CONTACT_LOCATION
            ? `Création de sites web, référencement naturel, maintenance WordPress et automatisation à ${CONTACT_LOCATION}.`
            : undefined,
        }}
      />
    </>
  )
}
