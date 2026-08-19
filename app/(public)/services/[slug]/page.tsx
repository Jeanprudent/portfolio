import ServiceBanner from "@/components/services/ServiceBanner"
import ServiceOffers from "@/components/services/ServiceOffers"
import ContactModal from "@/components/services/ContactModal"
import { SERVICES } from "@/data/portfolio-data"
import { serviceSlug } from "@/lib/slug"
import { CONTACT_EMAIL, CONTACT_WHATSAPP, CONTACT_PHONE_DISPLAY } from "@/lib/contact-info"

// Le contenu riche des fiches (long_description, offres, bannière) vit dans
// data/portfolio-data.ts : la table `services` de Supabase ne porte pas ces
// colonnes. On résout donc toujours depuis SERVICES, en calculant le slug de
// la même façon que les cartes de la page d'accueil.
export async function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: serviceSlug(s) }))
}

// Next 16 : `params` est une Promise, il faut l'attendre. La lire de façon
// synchrone renvoyait `undefined` → toutes les fiches affichaient
// « Service introuvable ».
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  // Normalize the incoming slug (handle URL encoding and casing)
  const { slug: rawSlug } = await params
  const slug = decodeURIComponent(String(rawSlug ?? "")).trim().toLowerCase()

  const service = SERVICES.find((s) => serviceSlug(s).toLowerCase() === slug)

  if (!service) {
    return (
      <div className="container-max section-spacing">
        <h2>Service introuvable</h2>
        <p>Le service demandé est introuvable.</p>
      </div>
    )
  }

  // Safe handling of optional long_description
  const longDesc = service.long_description ?? service.description ?? ""
  const paragraphs = longDesc
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)

  return (
    <div className="container-max section-spacing">
      <ServiceBanner service={service} />

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h2 className="font-heading font-bold text-2xl mb-4">Pourquoi ce service est important à Cotonou & au Bénin</h2>
          {/* prose-jp (et non `prose`, qui n'existe pas ici) : sans lui les
              paragraphes se collent les uns aux autres. */}
          <div className="prose-jp max-w-none">
            {paragraphs.length ? (
              paragraphs.map((p: string, i: number) => <p key={i}>{p}</p>)
            ) : (
              <p>{service.description}</p>
            )}
          </div>

        </div>

        <aside className="md:sticky md:top-24 md:self-start">
          <div className="glass-card p-6">
            <h4 className="font-semibold mb-2">Intéressé ?</h4>
            <p className="text-sm text-(--text-secondary) mb-4">Discutons de votre projet et obtenez un devis personnalisé.</p>
            <ContactModal projectType={service.title} />
            <div className="mt-4 text-sm text-(--text-secondary)">
              <div>
                Téléphone : <a href={`tel:+${CONTACT_WHATSAPP}`}>{CONTACT_PHONE_DISPLAY}</a>
              </div>
              <div>
                Email : <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Les offres sortent de la colonne 2/3 : sur la même largeur que la
          bannière, les 3 cartes respirent au lieu d'être tassées. */}
      {service.offers?.length ? (
        <section className="mt-14">
          <h2 className="font-heading font-bold text-2xl mb-2">Offres</h2>
          <p className="text-(--text-secondary) text-sm mb-6 max-w-2xl">
            Des formules claires, ajustables à votre contexte. Les prix sont indicatifs et
            confirmés après un premier échange.
          </p>
          <ServiceOffers offers={service.offers} serviceTitle={service.title} />
        </section>
      ) : null}
    </div>
  )
}
