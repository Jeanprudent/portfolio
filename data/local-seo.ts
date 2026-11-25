/**
 * Pages SEO locales « expertise × ville ».
 *
 * Source de contenu (fichier) destinée à devenir, en Phase 2b, une table
 * Supabase éditable dans /gestion — même logique que data/portfolio-data.ts :
 * la base fera autorité, ce fichier restera le repli.
 *
 * Règle SEO : chaque expertise a un contenu PROPRE à sa thématique, et chaque
 * ville porte un contexte local RÉEL (intro, secteurs). On ne duplique jamais
 * une page en changeant seulement un nom.
 *
 * URL d'une page = `/{expertise.slug}-{ville.slug}` (ex. creation-site-web-cotonou).
 */

export type LocalFaq = { q: string; r: string }
export type Bloc = { titre: string; texte: string }

export type Expertise = {
  slug: string
  nom: string
  nomCourt: string
  icon: string
  /** Illustration de la section « pourquoi c'est décisif ». */
  image: string
  /** Slug de la fiche service existante, pour le maillage interne. */
  serviceSlug: string
  /** Promesse sous le H1. */
  accroche: string
  /** Paragraphe d'introduction thématique, localisé (mots-clés naturels). */
  intro: (villeNom: string) => string
  /** Requêtes ciblées, affichées en sous-titre « Ce que couvre cette page ». */
  motsCles: (villeNom: string) => string[]
  problemes: Bloc[]
  benefices: Bloc[]
  prestations: Bloc[]
  /** Cas d'usage concrets (profils d'entreprises locales). */
  casUsage: string[]
  process: Bloc[]
  pourquoi: Bloc[]
  faq: (villeNom: string) => LocalFaq[]
}

export type Ville = {
  slug: string
  nom: string
  prep: string
  region: string
  pays: string
  intro: string
  secteurs: string[]
  active: boolean
}

/* ------------------------------------------------------------------ */
/*  VILLES — Bénin.                                                     */
/* ------------------------------------------------------------------ */

export const VILLES: Ville[] = [
  {
    slug: "cotonou",
    nom: "Cotonou",
    prep: "à",
    region: "Littoral",
    pays: "Bénin",
    intro:
      "Cotonou concentre l'essentiel de l'activité économique du Bénin : commerces de Ganhi et Dantokpa, restaurants et hôtels de Fidjrossè et de la Haie Vive, cabinets de Cadjèhoun, importateurs et jeunes entreprises du numérique. Dans cette densité, une entreprise qu'on ne trouve pas en ligne laisse chaque jour des clients à ses concurrents mieux référencés.",
    secteurs: [
      "Commerces et boutiques (Ganhi, Dantokpa, Cadjèhoun)",
      "Restaurants, maquis et hôtels (Fidjrossè, Haie Vive)",
      "Cabinets, cliniques et prestataires de services",
      "Artisans, BTP et importateurs",
      "Startups et jeunes entreprises du numérique",
    ],
    active: true,
  },
  { slug: "porto-novo", nom: "Porto-Novo", prep: "à", region: "Ouémé", pays: "Bénin", intro: "", secteurs: [], active: false },
  { slug: "abomey-calavi", nom: "Abomey-Calavi", prep: "à", region: "Atlantique", pays: "Bénin", intro: "", secteurs: [], active: false },
  { slug: "parakou", nom: "Parakou", prep: "à", region: "Borgou", pays: "Bénin", intro: "", secteurs: [], active: false },
]

/* ------------------------------------------------------------------ */
/*  EXPERTISES — contenu propre à chaque thématique.                   */
/* ------------------------------------------------------------------ */

export const EXPERTISES: Expertise[] = [
  /* ================= CRÉATION DE SITE WEB ================= */
  {
    slug: "creation-site-web",
    nom: "Création de site web",
    nomCourt: "Création de site web",
    icon: "line-md:laptop-twotone",
    image: "/services/creation-de-sites-web-sur-mesure.webp",
    serviceSlug: "creation-de-sites-web-sur-mesure",
    accroche:
      "Un site vitrine ou e-commerce rapide, pensé pour le mobile et construit pour transformer vos visiteurs en clients, livré clé en main, avec un espace d'administration que vous gérez seul.",
    intro: (v) =>
      `La création d'un site internet ${v} ne consiste pas à poser un joli thème en ligne. Un commerce, un cabinet ou un restaurant ${v} a besoin d'un site qui se charge vite même en connexion mobile, qui donne envie d'appeler ou de commander, et qui apparaît quand un client tape votre activité sur Google. Je conçois des sites vitrines et des boutiques e-commerce sur mesure pour les entreprises ${v}, du choix du nom de domaine jusqu'à la formation à la prise en main.`,
    motsCles: (v) => [
      `création de site web ${v}`,
      `création de site internet ${v}`,
      "site vitrine professionnel",
      "site e-commerce",
      `développeur web ${v}`,
      "refonte de site WordPress",
    ],
    problemes: [
      { titre: "Une page Facebook ne suffit plus", texte: "Vos clients cherchent votre activité sur Google avant de vous contacter. Sans site, vous êtes invisible pour ceux qui ne vous connaissent pas encore." },
      { titre: "Un site illisible sur téléphone", texte: "Au Bénin, l'immense majorité des visites se font sur mobile. Un site qui s'affiche mal sur un smartphone fait fuir avant même le premier contact." },
      { titre: "Un site trop lent", texte: "En connexion moyenne, chaque seconde de chargement fait perdre des visiteurs. Un site léger et bien optimisé garde l'attention." },
      { titre: "Dépendre d'un prestataire pour tout", texte: "Changer un prix, une photo ou un horaire ne devrait jamais nécessiter un développeur ni une facture. Vous devez rester autonome." },
    ],
    benefices: [
      { titre: "Plus de contacts qualifiés", texte: "Des pages construites pour appeler, écrire sur WhatsApp ou commander, pas seulement pour être belles." },
      { titre: "Une image professionnelle", texte: "Un site soigné rassure et vous distingue d'un concurrent resté sur une simple page de réseau social." },
      { titre: "Une présence qui travaille 24h/24", texte: "Votre site présente votre offre, vos tarifs et vos coordonnées même quand vous dormez." },
      { titre: "Une base saine pour le référencement", texte: "Structure, vitesse et balisage posés dès le départ pour pouvoir progresser sur Google." },
    ],
    prestations: [
      { titre: "Site vitrine sur mesure", texte: "Design unique à votre image, arborescence claire, pages orientées contact et conversion. Pas de thème générique recyclé." },
      { titre: "Boutique e-commerce", texte: "Catalogue, panier et paiement adaptés aux usages locaux, avec commande et suivi possibles via WhatsApp." },
      { titre: "Refonte de site existant", texte: "Modernisation d'un site daté ou lent, sans perdre votre référencement acquis ni vos contenus utiles." },
      { titre: "Optimisation mobile & vitesse", texte: "Affichage impeccable sur tous les écrans et chargement rapide même en 3G/4G." },
      { titre: "Nom de domaine & hébergement", texte: "Achat du domaine, mise en ligne et configuration des e-mails professionnels, vous restez propriétaire de vos accès." },
      { titre: "Formation & autonomie", texte: "Un back-office simple et une prise en main guidée pour gérer vos contenus sans frais récurrents obligatoires." },
    ],
    casUsage: [
      "Un restaurant qui veut présenter son menu et prendre des réservations",
      "Une boutique qui souhaite vendre en ligne et recevoir les commandes sur WhatsApp",
      "Un cabinet qui a besoin d'un site sérieux pour inspirer confiance",
      "Un artisan ou un prestataire qui veut être trouvé sur Google",
      "Une entreprise dont le site actuel est lent, daté ou illisible sur mobile",
    ],
    process: [
      { titre: "Cadrage", texte: "On clarifie vos objectifs, votre cible et les pages nécessaires. Devis précis, sans surprise." },
      { titre: "Maquette", texte: "Vous validez le design et l'arborescence avant la moindre ligne de code." },
      { titre: "Développement", texte: "Je construis un site rapide, responsive et optimisé, avec vos contenus et vos photos." },
      { titre: "Mise en ligne & formation", texte: "Domaine, hébergement, mise en ligne, puis formation à la gestion de votre site." },
    ],
    pourquoi: [
      { titre: "Interlocuteur unique", texte: "Vous parlez directement à la personne qui conçoit votre site, en français et sur WhatsApp." },
      { titre: "Orienté résultats", texte: "Chaque page vise un contact, une commande ou un appel, pas la décoration." },
      { titre: "Technologies solides", texte: "Des sites performants (Next.js, WordPress) qui tiennent dans le temps." },
      { titre: "Suivi après livraison", texte: "Je reste disponible pour les évolutions, la maintenance et vos questions." },
    ],
    faq: (v) => [
      { q: `Combien coûte la création d'un site web ${v} ?`, r: `Le tarif dépend du type de site (vitrine, e-commerce, nombre de pages) et des fonctionnalités. Je propose des packs clairs à partir d'un budget d'entrée accessible aux PME et TPE ${v}, avec un devis détaillé avant de commencer. Écrivez-moi sur WhatsApp pour une estimation adaptée à votre projet.` },
      { q: "Combien de temps pour livrer un site vitrine ?", r: "Comptez en général 1 à 3 semaines selon la complexité, votre réactivité sur les contenus et les validations. Un e-commerce ou un projet sur mesure demande davantage. Le délai exact est fixé dès le cadrage." },
      { q: "Pourrai-je modifier mon site moi-même ?", r: "Oui. Je livre un back-office simple et je vous forme : modifier un texte, un prix, une photo ou publier une actualité se fait sans développeur et sans abonnement obligatoire." },
      { q: "Faites-vous aussi des sites e-commerce ?", r: "Oui. Je crée des boutiques en ligne avec catalogue, panier et paiement, pensées pour les habitudes locales : commande et suivi possibles par WhatsApp, et moyens de paiement adaptés au marché béninois." },
      { q: "Pouvez-vous refaire mon site actuel ?", r: "Oui. Une refonte modernise le design, la vitesse et la lisibilité mobile tout en préservant votre contenu et, autant que possible, votre référencement existant." },
      { q: "Mon site sera-t-il visible sur Google ?", r: "Le SEO technique est intégré dès la conception (structure, vitesse, balises, données structurées). C'est la base de l'indexation. Pour un positionnement durable sur des requêtes concurrentielles, un accompagnement SEO continu est recommandé en complément." },
      { q: "Gérez-vous le nom de domaine et l'hébergement ?", r: "Oui. Je m'occupe du domaine, de l'hébergement et de la mise en ligne. Vous restez propriétaire de votre domaine et de vos accès." },
      { q: `Travaillez-vous uniquement ${v} ?`, r: `Je suis basé ${v} et j'y accompagne beaucoup d'entreprises en direct, mais je travaille aussi à distance partout au Bénin et à l'international.` },
    ],
  },

  /* ================= RÉFÉRENCEMENT SEO ================= */
  {
    slug: "referencement-seo",
    nom: "Référencement SEO local",
    nomCourt: "Référencement SEO",
    icon: "line-md:search-twotone",
    image: "/services/optimisation-seo-visibilite-google.webp",
    serviceSlug: "optimisation-seo-visibilite-google",
    accroche:
      "Faites remonter votre entreprise dans Google et sur Google Maps pour capter les clients qui cherchent déjà vos services, sans dépendre indéfiniment de la publicité.",
    intro: (v) =>
      `Le référencement naturel ${v} consiste à apparaître au bon moment : quand un habitant ou une entreprise tape « votre métier ${v} » sur Google. Deux leviers comptent surtout en local : votre fiche Google Business (le « pack local » et Google Maps) et les pages de votre site optimisées pour les bonnes requêtes. Je travaille ces deux leviers ensemble pour transformer des recherches en appels, en messages WhatsApp et en devis, avec une progression mesurable mois après mois.`,
    motsCles: (v) => [
      `référencement naturel ${v}`,
      `référencement Google ${v}`,
      "SEO local",
      "fiche Google Business",
      `consultant SEO ${v}`,
      "audit SEO",
    ],
    problemes: [
      { titre: "Vous n'apparaissez pas sur Google", texte: "Si vos clients ne vous trouvent pas quand ils cherchent votre activité, ce sont vos concurrents qui récupèrent les appels et les commandes." },
      { titre: "Une fiche Google négligée", texte: "Une fiche Google Business incomplète ou mal gérée vous prive de la visibilité locale la plus rentable : celle de Google Maps et du pack local." },
      { titre: "De la pub qui s'arrête net", texte: "La publicité disparaît dès que vous coupez le budget. Le SEO construit une visibilité qui dure et qui coûte de moins en moins cher par contact." },
      { titre: "Un site lent ou mal structuré", texte: "Un site lent ou mal balisé plafonne dans les résultats, quel que soit le contenu. Les fondations techniques se corrigent." },
    ],
    benefices: [
      { titre: "Des contacts qui viennent à vous", texte: "Les visiteurs issus du SEO cherchaient déjà votre service : ils convertissent mieux qu'un trafic payant froid." },
      { titre: "Une visibilité durable", texte: "Une position gagnée reste, contrairement à une annonce qui s'éteint avec le budget." },
      { titre: "Un coût par client qui baisse", texte: "Plus votre référencement progresse, moins chaque nouveau contact vous coûte." },
      { titre: "Une présence sur Google Maps", texte: "Le pack local capte les recherches de proximité, souvent les plus proches de l'achat." },
    ],
    prestations: [
      { titre: "Audit SEO complet", texte: "Analyse technique, sémantique et concurrentielle de votre site pour identifier précisément ce qui bloque votre visibilité." },
      { titre: "Référencement local (Google Maps)", texte: "Optimisation de votre fiche Google Business : catégories, description, photos, horaires, avis et publications." },
      { titre: "Optimisation on-page", texte: "Mots-clés, balises title et meta, contenus et structure retravaillés pour coller aux recherches de vos clients." },
      { titre: "SEO technique", texte: "Vitesse, affichage mobile, indexation et données structurées : les fondations d'une progression durable." },
      { titre: "Contenu optimisé", texte: "Création de pages et d'articles qui répondent aux requêtes réelles et renforcent votre autorité sur votre secteur." },
      { titre: "Suivi & reporting", texte: "Positions, trafic et contacts suivis dans le temps, avec des actions correctives régulières." },
    ],
    casUsage: [
      "Un commerce qui veut sortir dans le Top 3 de Google Maps sur sa zone",
      "Un prestataire qui dépense en publicité sans résultat durable",
      "Un site qui existe mais que personne ne trouve sur Google",
      "Une entreprise qui veut se positionner sur des requêtes précises de son métier",
      "Un cabinet qui a besoin d'avis et d'une fiche Google crédible",
    ],
    process: [
      { titre: "Audit & mots-clés", texte: "On identifie les requêtes réellement tapées par vos clients et les freins actuels de votre site." },
      { titre: "Plan d'action", texte: "Priorisation des corrections techniques et des contenus à créer, avec des objectifs clairs." },
      { titre: "Optimisation", texte: "Mise en œuvre : technique, contenus, fiche Google Business, maillage interne." },
      { titre: "Suivi continu", texte: "Mesure des positions, ajustements et montée en puissance mois après mois." },
    ],
    pourquoi: [
      { titre: "Orienté contacts", texte: "L'objectif n'est pas le trafic pour le trafic, mais les appels, les messages et les devis." },
      { titre: "Connaissance du marché local", texte: "Je connais les habitudes de recherche et les requêtes du marché béninois." },
      { titre: "Transparence", texte: "Des rapports clairs, sans jargon : vous savez ce qui est fait et ce que ça rapporte." },
      { titre: "Méthodes durables", texte: "Pas de techniques risquées : une progression solide qui résiste aux mises à jour de Google." },
    ],
    faq: (v) => [
      { q: `En combien de temps voit-on des résultats SEO ${v} ?`, r: `Le référencement local donne souvent de premiers effets en quelques semaines (fiche Google, requêtes peu concurrentielles). Pour des positions durables sur des mots-clés disputés ${v}, comptez généralement 3 à 6 mois d'optimisation continue. Le SEO est un investissement de fond, pas un interrupteur.` },
      { q: "Garantissez-vous la première position sur Google ?", r: "Aucun professionnel sérieux ne peut garantir une position précise : Google seul décide. En revanche, je garantis un travail conforme aux bonnes pratiques et une progression mesurable de votre visibilité et de vos contacts." },
      { q: "Quelle différence entre SEO et Google Ads ?", r: "Google Ads achète une visibilité immédiate qui disparaît dès l'arrêt du budget. Le SEO construit une visibilité organique durable, plus rentable sur la durée. Les deux sont complémentaires selon votre urgence et votre budget." },
      { q: "Faut-il refaire mon site pour le SEO ?", r: "Pas forcément. Un audit détermine si votre site peut être optimisé ou si une refonte est plus rentable. Souvent, des corrections techniques et éditoriales suffisent à débloquer la situation." },
      { q: "Optimisez-vous ma fiche Google Business ?", r: "Oui, c'est un levier majeur du référencement local. Catégories, description, photos, horaires, gestion des avis et publications sont optimisés pour apparaître dans Google Maps et le pack local." },
      { q: "Proposez-vous un suivi mensuel ?", r: "Oui. Une formule de SEO continu couvre l'optimisation, la création de contenu et le suivi des positions avec un reporting régulier. Un audit ponctuel est aussi possible pour démarrer par un diagnostic." },
      { q: `Travaillez-vous avec des petites entreprises ${v} ?`, r: `Oui, j'accompagne surtout des PME, TPE et indépendants ${v} et au Bénin. Les prestations sont dimensionnées pour des budgets réalistes, avec des priorités claires pour un maximum d'impact.` },
      { q: "Gérez-vous aussi les avis clients ?", r: "Oui. Les avis Google pèsent fortement en local : je mets en place une stratégie simple pour en obtenir davantage et pour y répondre, ce qui renforce votre crédibilité et votre classement." },
    ],
  },

  /* ================= AUTOMATISATION IA ================= */
  {
    slug: "automatisation-ia",
    nom: "Automatisation IA",
    nomCourt: "Automatisation IA",
    icon: "line-md:cog-loop",
    image: "/services/automatisation-optimisation-digitale.webp",
    serviceSlug: "automatisation-optimisation-digitale",
    accroche:
      "Automatisez vos tâches répétitives et votre relation client avec l'IA et des workflows connectés, gagnez des heures chaque semaine et ne laissez plus aucun prospect sans réponse.",
    intro: (v) =>
      `L'automatisation et l'intelligence artificielle ne sont plus réservées aux grandes entreprises. Une PME ${v} peut, dès aujourd'hui, confier à un assistant automatique ses réponses WhatsApp, ses relances de devis ou la synchronisation de ses outils. Concrètement, je connecte votre site, votre messagerie, vos tableurs et votre CRM, et j'ajoute des agents IA là où ils font gagner du temps, pour que vous vous concentriez sur votre métier plutôt que sur les tâches répétitives.`,
    motsCles: (v) => [
      `automatisation ${v}`,
      "intelligence artificielle entreprise",
      "chatbot WhatsApp",
      "automatisation des processus",
      "workflow n8n",
      "IA pour PME",
    ],
    problemes: [
      { titre: "Des heures perdues sur des tâches répétitives", texte: "Ressaisies, relances, exports, réponses identiques : autant de temps qui ne sert pas à développer votre activité." },
      { titre: "Des prospects perdus faute de réactivité", texte: "Un message laissé sans réponse pendant des heures, c'est un client qui va voir ailleurs. Un assistant répond et qualifie en continu." },
      { titre: "Des outils qui ne se parlent pas", texte: "Site, WhatsApp, tableur, e-mail, CRM : quand rien n'est connecté, l'information se perd et les erreurs se multiplient." },
      { titre: "L'impression que « l'IA, c'est pas pour moi »", texte: "On commence petit, sur une tâche précise à fort gain, avec un retour sur investissement rapide et visible." },
    ],
    benefices: [
      { titre: "Du temps récupéré", texte: "Les tâches automatisées tournent seules : vous récupérez des heures chaque semaine." },
      { titre: "Zéro prospect oublié", texte: "Les demandes de la nuit et du week-end sont reçues, qualifiées et transmises automatiquement." },
      { titre: "Moins d'erreurs", texte: "Fini les doubles saisies et les oublis : l'information circule d'un outil à l'autre sans intervention." },
      { titre: "Une entreprise qui tient la charge", texte: "Vous traitez plus de demandes sans embaucher, en gardant le même niveau de service." },
    ],
    prestations: [
      { titre: "Chatbot & réponses automatiques", texte: "Un assistant qui répond à vos clients 24h/24, qualifie les demandes et transmet les prospects chauds sur WhatsApp." },
      { titre: "Automatisation des workflows (n8n)", texte: "Connexion de vos outils (site, e-mail, tableurs, CRM) pour supprimer les ressaisies et les oublis." },
      { titre: "Relances & suivi clients", texte: "Relances automatiques de devis, rappels de rendez-vous et messages de suivi, sans effort de votre part." },
      { titre: "Génération de contenu assistée", texte: "Rédaction d'articles, de descriptions produits et de publications accélérée par l'IA, avec validation humaine." },
      { titre: "Tableaux de bord", texte: "Vos données centralisées et mises à jour automatiquement pour décider vite et bien." },
    ],
    casUsage: [
      "Une boutique submergée de messages WhatsApp à trier et à qualifier",
      "Un prestataire qui oublie de relancer ses devis en attente",
      "Une équipe qui ressaisit les mêmes données dans plusieurs outils",
      "Un service client qui ne peut pas répondre la nuit et le week-end",
      "Une entreprise qui veut un tableau de bord à jour sans travail manuel",
    ],
    process: [
      { titre: "Diagnostic", texte: "On liste vos tâches chronophages et vos pertes de temps pour cibler les automatisations les plus rentables." },
      { titre: "Conception", texte: "Je conçois les workflows et l'enchaînement des outils, en commençant par les gains rapides." },
      { titre: "Mise en place", texte: "Déploiement, connexion des outils et tests sur vos cas réels." },
      { titre: "Suivi & ajustement", texte: "On mesure le temps gagné et on affine les automatisations dans le temps." },
    ],
    pourquoi: [
      { titre: "Des gains concrets", texte: "On vise le temps réellement économisé et les prospects récupérés, pas la technologie pour la technologie." },
      { titre: "Du sur-mesure", texte: "Des automatisations adaptées à vos outils et à votre façon de travailler, jamais une solution générique." },
      { titre: "Accessible aux PME", texte: "Des solutions pensées pour des budgets et des équipes réduits, avec un retour sur investissement rapide." },
      { titre: "Vous gardez le contrôle", texte: "L'humain valide ce qui compte : l'IA exécute, vous décidez." },
    ],
    faq: (v) => [
      { q: "L'automatisation est-elle adaptée à une petite entreprise ?", r: "Absolument. Même une TPE a des tâches répétitives (relances, réponses, ressaisies) qui, une fois automatisées, libèrent des heures chaque semaine. On commence sur un gain rapide, puis on étend." },
      { q: "Quels outils utilisez-vous pour automatiser ?", r: "Principalement n8n pour les workflows, couplé à des modèles d'IA et à vos outils existants (WhatsApp, e-mail, tableurs, CRM, site web). Le choix dépend de votre situation et des connexions nécessaires." },
      { q: "Un chatbot va-t-il remplacer le contact humain ?", r: "Non. Le chatbot filtre et répond aux questions courantes à toute heure, puis vous transmet les demandes sérieuses. Vous gardez la relation humaine là où elle compte, sans rater les prospects de la nuit et du week-end." },
      { q: `Combien coûte une automatisation ${v} ?`, r: `Cela dépend du nombre de tâches et d'outils à connecter. Je propose des formules allant d'une automatisation ciblée à des workflows complets, avec un devis après diagnostic. L'objectif est toujours un retour sur investissement rapide.` },
      { q: "Mes données sont-elles en sécurité ?", r: "Oui. Les automatisations s'appuient sur vos propres comptes et outils, avec des accès maîtrisés. On privilégie des solutions où vous restez propriétaire de vos données." },
      { q: "Faut-il des compétences techniques de mon côté ?", r: "Non. Je conçois, mets en place et documente les automatisations. Vous recevez un fonctionnement clair et je reste disponible pour les ajustements." },
      { q: `Pouvez-vous intervenir pour une entreprise ${v} ?`, r: `Oui. Je suis basé ${v} et j'accompagne les entreprises locales comme à distance. Le diagnostic se fait par appel ou rendez-vous, et la mise en place se pilote à distance.` },
    ],
  },
]
