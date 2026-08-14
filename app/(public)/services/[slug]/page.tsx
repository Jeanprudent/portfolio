import ServiceBanner from "@/components/services/ServiceBanner"
import ServiceOffers from "@/components/services/ServiceOffers"
import ContactModal from "@/components/services/ContactModal"
import { SERVICES } from "@/data/portfolio-data"

export async function generateStaticParams() {
  return SERVICES
    .filter((s) => typeof s.slug === "string" && s.slug.length > 0)
    .map((s) => ({ slug: s.slug as string }))
}

// Next 16 : `params` est une Promise, il faut l'attendre. La lire de façon
// synchrone renvoyait `undefined` → toutes les fiches affichaient
// « Service introuvable ».
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  // Normalize the incoming slug (handle URL encoding and casing)
  const { slug: rawSlug } = await params
  const slug = decodeURIComponent(String(rawSlug ?? "")).trim().toLowerCase()

  const service = SERVICES.find((s) => ((s.slug ?? "").toLowerCase() === slug))

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

          <div className="mt-8">
            <h3 className="font-semibold text-lg mb-3">Offres</h3>
            <ServiceOffers offers={service.offers || []} serviceTitle={service.title} />
          </div>
        </div>

        <aside className="sticky top-24">
          <div className="glass-card p-6">
            <h4 className="font-semibold mb-2">Intéressé ?</h4>
            <p className="text-sm text-(--text-secondary) mb-4">Discutons de votre projet et obtenez un devis personnalisé.</p>
            <ContactModal projectType={service.title} />
            <div className="mt-4 text-sm text-(--text-secondary)">
              <div>Téléphone: <a href="tel:+2290192175002">+229 01 92 17 50 02</a></div>
              <div>Email: <a href="mailto:jeanprudent03@gmail.com">jeanprudent03@gmail.com</a></div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
