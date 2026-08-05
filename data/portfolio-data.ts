import type { Service, Project, Skill, Testimonial, Stat, Offer } from "@/types/portfolio"

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
    slug: "creation-de-sites-web-sur-mesure",
    description:
      "Je conçois des sites web professionnels sur mesure, pensés pour valoriser votre image, offrir une expérience utilisateur fluide et transformer vos visiteurs en clients.",
    long_description:
      `Problème : De nombreuses entreprises à Cotonou et au Bénin n'ont pas encore de présence en ligne adaptée aux besoins modernes : sites non responsives, navigation lente ou absence de conten[...]

Aggravation : Sans un site performant, ces entreprises manquent d'opportunités, perdent des clients face à la concurrence et peinent à être trouvées via les recherches locales sur Google. Cela en[...]

Solution : Je conçois des sites sur-mesure, mobile-first, rapides et optimisés pour le référencement local. Chaque projet inclut une stratégie de conversion pour transformer les visiteurs en clie[...]

Je travaille avec des PME, artisans et entrepreneurs à Cotonou pour créer des expériences web qui racontent votre histoire et génèrent des résultats mesurables. Mon approche est pragmatique : de[...]
`,
    banner: "/services/creation-de-sites-web-sur-mesure.svg",
    icon: "line-md:laptop-twotone",
    offers: [
      {
        id: "s1-o1",
        name: "Pack Starter",
        price: "150 000 à 300 000 XOF",
        price_min: 150000,
        price_max: 300000,
        currency: "XOF",
        duration_days: 7,
        description: "Site vitrine 3 pages, responsive, optimisation SEO basique et 1 révision.",
      },
      {
        id: "s1-o2",
        name: "Pack Business",
        price: "400 000 à 800 000 XOF",
        price_min: 400000,
        price_max: 800000,
        currency: "XOF",
        duration_days: 14,
        description: "Jusqu'à 6 pages, blog, formulaires, optimisation SEO local et 2 révisions.",
      },
      {
        id: "s1-o3",
        name: "Pack Premium",
        price: "1 200 000 à 3 000 000 XOF",
        price_min: 1200000,
        price_max: 3000000,
        currency: "XOF",
        duration_days: 30,
        description: "E‑commerce / intégrations, tableau admin, optimisation avancée et 1 mois de maintenance incluse.",
      },
    ],
    order_index: 0,
    visible: true,
  },
  {
    id: "2",
    title: "Optimisation SEO & visibilité Google",
    slug: "optimisation-seo-visibilite-google",
    description:
      "Améliorez votre visibilité et attirez un trafic qualifié. J'optimise votre site pour le référencement naturel afin d'améliorer votre positionnement sur Google.",
    long_description:
      `Problème : De nombreuses entreprises locales à Cotonou peinent à être trouvées en ligne, même lorsque leurs services sont demandés.

Aggravation : Sans visibilité, le flux de clients se réduit, la croissance stagne et les concurrents captent les recherches importantes. Cela se traduit par moins de contacts entrants et un coût d'[...]

Solution : J'effectue un audit SEO technique et sémantique, j'optimise le site pour le local (Google My Business, balises, contenus) et je mets en place un suivi pour mesurer les progrès et ajuster [...]

Mon approche est pragmatique : priorités claires, actions mesurables et suivi régulier pour améliorer votre positionnement localement et attirer des visiteurs qui convertissent.
`,
    banner: "/services/optimisation-seo-visibilite-google.svg",
    icon: "line-md:search-twotone",
    offers: [
      {
        id: "s2-o1",
        name: "Audit SEO",
        price: "75 000 à 150 000 XOF",
        price_min: 75000,
        price_max: 150000,
        currency: "XOF",
        duration_days: 3,
        description: "Audit technique et recommandations prioritaires pour améliorer la visibilité.",
      },
      {
        id: "s2-o2",
        name: "Référencement Local",
        price: "150 000 à 350 000 XOF",
        price_min: 150000,
        price_max: 350000,
        currency: "XOF",
        duration_days: 7,
        description: "Optimisation Google My Business, mots-clés locaux et microdonnées.",
      },
      {
        id: "s2-o3",
        name: "SEO Continu",
        price: "300 000 à 800 000 XOF / mois",
        price_min: 300000,
        price_max: 800000,
        currency: "XOF",
        duration_days: 30,
        description: "Gestion mensuelle du SEO: contenu, netlinking et rapports de performance.",
      },
    ],
    order_index: 1,
    visible: true,
  },
  {
    id: "3",
    title: "Maintenance & support WordPress",
    slug: "maintenance-support-wordpress",
    description:
      "Gardez votre site sécurisé, rapide et toujours à jour. Je prends en charge la maintenance technique de votre site pour garantir sa stabilité et sa sécurité.",
    long_description:
      `Problème : Les sites WordPress non maintenus deviennent lents, vulnérables et peuvent tomber en panne.

Aggravation : Une panne ou une faille entraîne perte de revenus, mauvaise expérience utilisateur et risque pour la réputation de l'entreprise. De plus, la dette technique s'accumule et les coûts d[...]

Solution : J'assure les mises à jour, sauvegardes régulières, optimisations de performance et interventions rapides pour limiter les risques et garantir la continuité du service. Je propose aussi [...]

Mes plans sont pensés pour les petites entreprises : interventions rapides, monitoring et rapports réguliers pour vous rassurer sur la santé de votre site.
`,
    banner: "/services/maintenance-support-wordpress.svg",
    icon: "line-md:cog-loop",
    offers: [
      {
        id: "s3-o1",
        name: "Maintenance Basique",
        price: "40 000 à 80 000 XOF / mois",
        price_min: 40000,
        price_max: 80000,
        currency: "XOF",
        duration_days: 30,
        description: "Mises à jour, sauvegardes hebdomadaires et monitoring sécurité.",
      },
      {
        id: "s3-o2",
        name: "Maintenance Pro",
        price: "120 000 à 250 000 XOF / mois",
        price_min: 120000,
        price_max: 250000,
        currency: "XOF",
        duration_days: 30,
        description: "Optimisation, corrections, support prioritaire et SLA réduit.",
      },
      {
        id: "s3-o3",
        name: "Intervention à la carte",
        price: "25 000 à 80 000 XOF",
        price_min: 25000,
        price_max: 80000,
        currency: "XOF",
        duration_days: 3,
        description: "Dépannage, migration ou corrections ponctuelles.",
      },
    ],
    order_index: 2,
    visible: true,
  },
  {
    id: "4",
    title: "Automatisation & optimisation digitale",
    slug: "automatisation-optimisation-digitale",
    description:
      "Automatisez vos tâches pour gagner du temps. Formulaires intelligents, emails automatiques et workflows n8n pour simplifier vos processus.",
    long_description:
      `Problème : Beaucoup d'entreprises passent trop de temps sur des tâches répétitives qui freinent la croissance.

Aggravation : Les erreurs manuelles, les délais de traitement et le manque de suivi entraînent des pertes de productivité et des opportunités manquées.

Solution : Je conçois des automatisations fiables (n8n, intégrations API) qui synchronisent vos outils, réduisent les tâches manuelles et libèrent du temps pour le cœur de votre activité.

Résultat : gains de productivité mesurables, meilleure réactivité commerciale et processus documentés pour une adoption rapide par vos équipes. J'accompagne aussi la formation pour garantir l'ad[...]
`,
    banner: "/services/automatisation-optimisation-digitale.svg",
    icon: "line-md:lightning-twotone-loop",
    offers: [
      {
        id: "s4-o1",
        name: "Automatisation Starter",
        price: "120 000 à 300 000 XOF",
        price_min: 120000,
        price_max: 300000,
        currency: "XOF",
        duration_days: 7,
        description: "Formulaire + email automatisés simples (n8n) pour gagner du temps.",
      },
      {
        id: "s4-o2",
        name: "Workflow Business",
        price: "350 000 à 900 000 XOF",
        price_min: 350000,
        price_max: 900000,
        currency: "XOF",
        duration_days: 14,
        description: "Intégrations CRM, API et synchronisations avancées.",
      },
      {
        id: "s4-o3",
        name: "Automatisation sur-mesure",
        price: "Devis personnalisé",
        duration_days: 21,
        description: "Solutions complexes et pipelines sur-mesure avec documentation.",
      },
    ],
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
    text: "Jean Prudent a transformé notre présence en ligne en quelques semaines. Notre site attire maintenant 3× plus de clients et nos ventes ont augmenté de 40%. Un travail exceptionnel et tr�[...]
    rating: 5,
    visible: true,
  },
  {
    id: "2",
    name: "Kofi Mensah",
    role: "Directeur Commercial",
    company: "TechAfrique",
    text: "Un travail remarquable ! Le site est non seulement magnifique mais aussi parfaitement optimisé pour Google. Nous sommes désormais en première page sur nos mots-clés principaux, et [...]
    rating: 5,
    visible: true,
  },
  {
    id: "3",
    name: "Aminata Traoré",
    role: "Entrepreneur",
    company: "Saveurs d'Afrique",
    text: "L'automatisation mise en place par Jean nous a fait gagner 10h par semaine. Les formulaires, emails et CRM se synchronisent parfaitement. Un investissement qui s'est rapidement rentabi[...]
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
