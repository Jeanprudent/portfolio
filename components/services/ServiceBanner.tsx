import Image from "next/image"
import { Icon } from "@iconify/react"

export default function ServiceBanner({ service }: { service: any }) {
  return (
    <div className="relative w-full h-64 rounded-lg overflow-hidden mb-8">
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/10"></div>
      {service.banner ? (
        <img src={service.banner} alt={service.title} className="object-cover w-full h-full" />
      ) : (
        <div className="bg-gray-800 w-full h-full" />
      )}
      <div className="absolute inset-0 flex flex-col justify-center items-start p-8">
        <span className="inline-flex items-center gap-2 text-sm text-white/80 mb-2">
          <Icon icon={service.icon} width={18} />
          Service
        </span>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">{service.title}</h1>
        <p className="text-white/90 mt-2 max-w-2xl">{service.description}</p>
      </div>
    </div>
  )
}
