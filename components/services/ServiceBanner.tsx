import Image from "next/image"
import { Icon } from "@iconify/react"
import type { Service } from "@/types/portfolio"

export default function ServiceBanner({ service }: { service: Service }) {
  return (
    <div className="relative w-full h-56 md:h-64 rounded-2xl overflow-hidden mb-10">
      {service.banner ? (
        <Image
          src={service.banner}
          alt=""
          fill
          priority
          sizes="(min-width: 1200px) 1136px, 100vw"
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-(--bg-secondary)" />
      )}

      {/* Le voile doit être AU-DESSUS de la photo : rendu avant l'image, il
          était recouvert par elle et le titre reposait sur la photo brute. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.25) 100%)",
        }}
      />

      <div className="absolute inset-0 flex flex-col justify-center items-start p-6 md:p-8">
        <span className="inline-flex items-center gap-2 text-sm text-white/80 mb-2">
          <Icon icon={service.icon} width={18} aria-hidden />
          Service
        </span>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-white text-balance">
          {service.title}
        </h1>
        <p className="text-white/90 mt-2 max-w-2xl text-sm md:text-base">{service.description}</p>
      </div>
    </div>
  )
}
