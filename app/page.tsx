import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { HeroSection } from "@/components/sections/HeroSection"
import { StatsSection } from "@/components/sections/StatsSection"
import { ServicesSection } from "@/components/sections/ServicesSection"
import { WhyMeSection } from "@/components/sections/WhyMeSection"
import { ProcessSection } from "@/components/sections/ProcessSection"
import { AboutSection } from "@/components/sections/AboutSection"
import { TestimonialsSection } from "@/components/sections/TestimonialsSection"
import { FaqSection } from "@/components/sections/FaqSection"
import { ContactSection } from "@/components/sections/ContactSection"
import { HomeJsonLd } from "@/components/seo/JsonLd"
import {
  getStats,
  getServices,
  getTestimonials,
  getPortfolioConfig,
  getLocalVilles,
} from "@/lib/supabase-data"

// Toujours relire les données fraîches depuis Supabase (sinon Next.js
// prérend la page en statique au build et les modifs du backoffice
// ne sont jamais reflétées).
export const dynamic = "force-dynamic"

export default async function HomePage() {
  const [stats, services, testimonials, config, villes] = await Promise.all([
    getStats(),
    getServices(),
    getTestimonials(),
    getPortfolioConfig(),
    getLocalVilles(),
  ])

  return (
    <>
      <Navbar villes={villes} />
      <HomeJsonLd />
      <main>
        {/* Site vitrine : services + parcours (plus un portfolio). */}
        <HeroSection config={config} />
        <StatsSection stats={stats} />
        <ServicesSection services={services} />
        <AboutSection config={config} />
        <WhyMeSection />
        <ProcessSection />
        <TestimonialsSection testimonials={testimonials} />
        <FaqSection />
        <ContactSection config={config} />
      </main>
      <Footer config={config} />
    </>
  )
}
