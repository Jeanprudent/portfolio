import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { HeroSection } from "@/components/sections/HeroSection"
import { StatsSection } from "@/components/sections/StatsSection"
import { ServicesSection } from "@/components/sections/ServicesSection"
import { ProjectsSection } from "@/components/sections/ProjectsSection"
import { AboutSection } from "@/components/sections/AboutSection"
import { SkillsSection } from "@/components/sections/SkillsSection"
import { TestimonialsSection } from "@/components/sections/TestimonialsSection"
import { FaqSection } from "@/components/sections/FaqSection"
import { ContactSection } from "@/components/sections/ContactSection"
import {
  getStats,
  getServices,
  getProjects,
  getTestimonials,
  getPortfolioConfig,
} from "@/lib/supabase-data"

// Toujours relire les données fraîches depuis Supabase (sinon Next.js
// prérend la page en statique au build et les modifs du backoffice
// ne sont jamais reflétées).
export const dynamic = "force-dynamic"

export default async function HomePage() {
  const [stats, services, projects, testimonials, config] = await Promise.all([
    getStats(),
    getServices(),
    getProjects(),
    getTestimonials(),
    getPortfolioConfig(),
  ])

  return (
    <>
      <Navbar />
      <main>
        <HeroSection config={config} />
        <StatsSection stats={stats} />
        <ServicesSection services={services} />
        <ProjectsSection projects={projects} />
        <AboutSection config={config} />
        <SkillsSection />
        <TestimonialsSection testimonials={testimonials} />
        <FaqSection />
        <ContactSection config={config} />
      </main>
      <Footer config={config} />
    </>
  )
}
