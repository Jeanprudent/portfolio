import { Icon } from "@iconify/react"

export default function ServiceOffers({ offers, serviceTitle }: { offers: any[]; serviceTitle: string }) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {offers.map((offer) => (
        <div key={offer.id} className="glass-card p-5">
          <h4 className="font-semibold text-lg mb-1">{offer.name}</h4>
          <p className="text-sm text-(--text-secondary) mb-3">{offer.description}</p>
          <div className="flex items-center justify-between mt-4">
            <div>
              <div className="text-sm text-(--text-secondary)">Durée</div>
              <div className="font-semibold">{offer.duration_days} jours</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-(--text-secondary)">Prix indicatif</div>
              <div className="font-heading font-bold">{offer.price}</div>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <a
              href={`mailto:jeanprudent03@gmail.com?subject=Demande de devis: ${encodeURIComponent(
                serviceTitle + " - " + offer.name,
              )}&body=Bonjour%2C%0A%0AJe+souhaite+en+savoir+plus+sur+l'offre+${encodeURIComponent(offer.name)}+pour+le+service+${encodeURIComponent(
                serviceTitle,
              )}.%0A%0AMon+nom%3A%0AEmail%3A%0AMessage%3A%0A%0A%C2%A0%0A`}
              className="btn-primary text-xs inline-flex items-center"
            >
              Choisir cette offre
            </a>
            <a
              href={`mailto:jeanprudent03@gmail.com?subject=Demande d'information: ${encodeURIComponent(serviceTitle)}&body=Bonjour%2C%0A%0AJ'aimerais+discuter+de+mon+projet.+%0A%0AMon+nom%3A%0AEmail%3A%0AMessage%3A%0A%0A%C2%A0%0A`}
              className="btn-secondary text-xs inline-flex items-center"
            >
              Demander plus d'infos
            </a>
          </div>
        </div>
      ))}
    </div>
  )
}
