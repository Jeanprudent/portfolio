import Link from "next/link"
import { SERVICES } from "@/data/portfolio-data"
import { Icon } from "@iconify/react"

export default function Page() {
  return (
    <section className="section-spacing container-max">
      <div className="text-center mb-12">
        <span className="section-label inline-flex items-center gap-2">
          <Icon icon="line-md:star-twotone" width={14} />
          Mes services
        </span>
        <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mt-4">Services</h1>
        <p className="text-(--text-secondary) max-w-2xl mx-auto mt-4">Découvrez les services proposés — cliquez sur un service pour en savoir plus.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {SERVICES.filter((s) => s.visible).map((service) => (
          <article key={service.id} className="glass-card p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                {/* icon fallback */}
                <Icon icon={service.icon} width={20} />
              </div>

              <div>
                <h3 className="font-heading font-semibold text-lg">{service.title}</h3>
                <p className="text-(--text-secondary) text-sm mt-2">{service.description}</p>

                <div className="mt-4">
                  <Link href={`/services/${service.slug}`} className="text-xs font-semibold inline-flex items-center gap-2">
                    En savoir plus
                    <Icon icon="line-md:arrow-right" width={14} />
                  </Link>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
