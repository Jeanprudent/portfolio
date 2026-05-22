import type { Service, Project, Skill, Testimonial, Stat } from "@/types/portfolio"

export const STATS: Stat[] = [
  {
    id: "1",
    label: "Ans d'expérience",
    value: 2,
    suffix: "+",
    icon: "line-md:calendar-twotone",
    order_index: 0,
  },
  {
    id: "2",
    label: "Projets livrés",
    value: 15,
    suffix: "+",
    icon: "line-md:confirm-circle-twotone",
    order_index: 1,
  },
  {
    id: "3",
    label: "Clients satisfaits",
    value: 96,
    suffix: "%",
    icon: "line-md:emoji-smile-twotone",
    order_index: 2,
  },
  {
    id: "4",
    label: "Disponibilité",
    value: 100,
    suffix: "%",
    icon: "line-md:cloud-up-twotone",
    order_index: 3,
  },
]

export const SERVICES: Service[] = [
  {
    id: "1",
    title: "Création de sites web sur mesure",
    description:
      "Je conçois des sites web professionnels sur mesure, pensés pour valoriser votre image, offrir une expérience utilisateur fluide et transformer vos visiteurs en clients.",
    icon: "line-md:laptop-twotone",
    order_index: 0,
    visible: true,
  },
  {
    id: "2",
    title: "Optimisation SEO & visibilité Google",
    description:
      "Améliorez votre visibilité et attirez un trafic qualifié. J'optimise votre site pour le référencement naturel afin d'améliorer votre positionnement sur Google.",
    icon: "line-md:search-twotone",
    order_index: 1,
    visible: true,
  },
  {
    id: "3",
    title: "Maintenance & support WordPress",
    description:
      "Gardez votre site sécurisé, rapide et toujours à jour. Je prends en charge la maintenance technique de votre site pour garantir sa stabilité et sa sécurité.",
    icon: "line-md:cog-loop",
    order_index: 2,
    visible: true,
  },
  {
    id: "4",
    title: "Automatisation & optimisation digitale",
    description:
      "Automatisez vos tâches pour gagner du temps. Formulaires intelligents, emails automatiques et workflows n8n pour simplifier vos processus.",
    icon: "line-md:lightning-twotone-loop",
    order_index: 3,
    visible: true,
  },
]

export const PROJECTS: Project[] = [
  {
    id: "1",
    title: "E-commerce Premium",
    description:
      "Boutique en ligne pour une PME locale avec paiement intégré, gestion des stocks et tableau de bord admin. Performance Lighthouse 98/100.",
    image_url: "/projects/project-1.jpg",
    project_url: "#",
    tags: ["Next.js", "Stripe", "Supabase"],
    category: "web",
    featured: true,
    order_index: 0,
  },
  {
    id: "2",
    title: "Site Corporate SEO",
    description:
      "Site vitrine professionnel pour un cabinet de conseil avec SEO technique optimisé. Passage de la page 8 à la page 1 de Google en 3 mois.",
    image_url: "/projects/project-2.jpg",
    project_url: "#",
    tags: ["WordPress", "Elementor", "SEO"],
    category: "seo",
    featured: true,
    order_index: 1,
  },
  {
    id: "3",
    title: "Portfolio Artiste",
    description:
      "Portfolio interactif avec galerie animée, espace client et système de commande en ligne. Design glassmorphisme avec Framer Motion.",
    image_url: "/projects/project-3.jpg",
    project_url: "#",
    tags: ["React", "Framer Motion", "Cloudinary"],
    category: "web",
    featured: false,
    order_index: 2,
  },
  {
    id: "4",
    title: "Automatisation CRM n8n",
    description:
      "Workflow automatisé reliant formulaires, emails et CRM via n8n pour une startup. Économie de 10h/semaine dès la première semaine.",
    image_url: "/projects/project-4.jpg",
    project_url: "#",
    tags: ["n8n", "Make", "API REST"],
    category: "automatisation",
    featured: false,
    order_index: 3,
  },
]

export const SKILLS: Skill[] = [
  // Frontend
  { id: "1", name: "HTML / CSS", icon: "logos:html-5", category: "frontend", level: 95 },
  { id: "2", name: "JavaScript", icon: "logos:javascript", category: "frontend", level: 88 },
  { id: "3", name: "React", icon: "logos:react", category: "frontend", level: 85 },
  { id: "4", name: "Next.js", icon: "simple-icons:nextdotjs", category: "frontend", level: 82 },
  { id: "5", name: "TailwindCSS", icon: "logos:tailwindcss-icon", category: "frontend", level: 90 },
  // CMS
  { id: "6", name: "WordPress", icon: "logos:wordpress-icon", category: "cms", level: 92 },
  { id: "7", name: "Elementor", icon: "simple-icons:elementor", category: "cms", level: 88 },
  // SEO
  { id: "8", name: "SEO Technique", icon: "line-md:search-twotone", category: "seo", level: 85 },
  { id: "9", name: "Google Analytics", icon: "logos:google-analytics", category: "seo", level: 80 },
  // Tools
  { id: "10", name: "Figma", icon: "logos:figma", category: "design", level: 78 },
  { id: "11", name: "n8n", icon: "simple-icons:n8n", category: "tools", level: 75 },
  { id: "12", name: "Git / GitHub", icon: "logos:git-icon", category: "tools", level: 82 },
]

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Marie Dupont",
    role: "Gérante",
    company: "Boutique Chic",
    text: "Jean Prudent a transformé notre présence en ligne en quelques semaines. Notre site attire maintenant 3× plus de clients et nos ventes ont augmenté de 40%. Un travail exceptionnel et un suivi impeccable !",
    rating: 5,
    visible: true,
  },
  {
    id: "2",
    name: "Kofi Mensah",
    role: "Directeur Commercial",
    company: "TechAfrique",
    text: "Un travail remarquable ! Le site est non seulement magnifique mais aussi parfaitement optimisé pour Google. On est en première page sur nos mots-clés principaux. Je recommande vivement.",
    rating: 5,
    visible: true,
  },
  {
    id: "3",
    name: "Aminata Traoré",
    role: "Entrepreneur",
    company: "Saveurs d'Afrique",
    text: "L'automatisation mise en place par Jean nous a fait gagner 10h par semaine. Les formulaires, emails et CRM se synchronisent parfaitement. Un investissement qui s'est remboursé en moins d'un mois !",
    rating: 5,
    visible: true,
  },
]

export const PROJECT_CATEGORIES = [
  { id: "all", label: "Tous" },
  { id: "web", label: "Sites Web" },
  { id: "seo", label: "SEO" },
  { id: "automatisation", label: "Automatisation" },
]
