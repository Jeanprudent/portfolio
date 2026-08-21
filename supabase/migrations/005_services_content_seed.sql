-- =============================================================================
-- 005 — Contenu rédactionnel des 4 fiches services
-- À exécuter dans le SQL Editor Supabase APRÈS 004_services_content.sql.
--
-- Remplit la colonne `content` des quatre services. À partir de là, les
-- fiches affichent leurs 8 sections, et TOUT reste modifiable depuis
-- /gestion/services — ce script donne un point de départ, pas un contenu figé.
--
-- Sources du contenu, rien n'est inventé :
--   - argumentaire des 4 temps : les long_description existantes
--   - cartes « ce qui est inclus » et facteurs de prix : les offres réelles
--   - délais annoncés dans le processus : les duration_days des offres
--   - engagements commerciaux (paiement, hébergement, rédaction, garantie) :
--     réponses de Jean Prudent du 21/08/2026
--
-- Aucune statistique n'est avancée : les bénéfices sont qualitatifs et
-- vérifiables, conformément à la décision du 20/08.
--
-- Ré-exécutable : écrase `content` pour les 4 slugs ci-dessous.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1) Création de sites web sur mesure
-- -----------------------------------------------------------------------------
update services set content = $json$
{
  "version": 1,
  "hero": {
    "tagline": "Un site rapide, pensé pour le mobile, conçu pour transformer vos visiteurs en clients. Rédaction comprise, livré en 7 à 30 jours selon la formule.",
    "badges": ["Mobile-first", "SEO local", "Rédaction comprise", "Dès 7 jours"]
  },
  "definition": {
    "title": "Un site vitrine, c'est quoi exactement ?",
    "body": "<p>C'est la version en ligne de votre établissement : ce que découvre un client qui cherche votre nom, votre métier ou votre quartier depuis son téléphone. Quelques pages qui présentent votre activité, vos prestations, vos réalisations, et surtout un moyen évident de vous joindre.</p><p>Ce n'est pas une brochure figée. Un site vitrine bien construit travaille en continu : il répond aux questions avant même l'appel, rassure sur votre sérieux, et apparaît dans les résultats de recherche quand quelqu'un cherche ce que vous faites à Cotonou.</p>",
    "highlight": "Un site vitrine ne vend pas en ligne : il déclenche le contact. C'est ce qui le distingue d'une boutique e-commerce."
  },
  "why": {
    "title": "Pourquoi une entreprise a besoin d'un site sur mesure",
    "problem": {
      "title": "Vos clients vous cherchent et ne trouvent rien",
      "text": "À Cotonou comme ailleurs, le premier réflexe est le téléphone. On tape le nom d'une entreprise, on regarde à quoi elle ressemble, on cherche un numéro. Sans site, ce parcours s'arrête net. Avec un site lent ou illisible sur mobile, il s'arrête aussi — simplement un peu plus tard."
    },
    "aggravation": {
      "title": "Chaque mois qui passe, ces demandes partent ailleurs",
      "text": "Un prospect qui ne vous trouve pas ne vous rappelle pas : il contacte le suivant sur la liste. Votre activité repose alors entièrement sur le bouche-à-oreille, qui ne grandit qu'à la vitesse de votre carnet d'adresses. Pendant ce temps, un concurrent mieux référencé capte les recherches que vous auriez dû recevoir."
    },
    "solution": {
      "title": "Un site construit autour de votre client, pas autour d'un gabarit",
      "text": "Je pars de votre activité et de ce que cherchent vos clients, pas d'un modèle à remplir. Structure, textes, parcours et boutons d'appel sont pensés pour une seule chose : qu'un visiteur intéressé sache quoi faire dans les dix secondes.",
      "benefits": [
        {
          "icon": "line-md:search-twotone",
          "title": "Trouvable sur Google",
          "text": "Structure et balises optimisées pour les recherches locales, afin d'apparaître quand on cherche votre métier à Cotonou."
        },
        {
          "icon": "line-md:phone-call-loop",
          "title": "Joignable en un geste",
          "text": "Appel, WhatsApp et formulaire accessibles depuis chaque page, sans avoir à chercher."
        },
        {
          "icon": "line-md:speed-twotone",
          "title": "Rapide même en 3G",
          "text": "Images compressées et code allégé : le site reste utilisable avec une connexion moyenne."
        },
        {
          "icon": "line-md:laptop-twotone",
          "title": "Lisible sur tous les écrans",
          "text": "Conçu d'abord pour le téléphone, puisque c'est là que vos visiteurs vous découvrent."
        }
      ]
    },
    "action": {
      "title": "Le meilleur moment pour lancer votre site, c'était il y a six mois",
      "text": "Le deuxième meilleur moment, c'est maintenant. Un premier échange suffit à cadrer le besoin et à savoir quelle formule correspond à votre situation — sans engagement.",
      "ctaLabel": "Demander un devis gratuit"
    }
  },
  "includes": {
    "title": "Ce qui est compris dans chaque projet",
    "items": [
      {
        "icon": "line-md:pencil-alt-twotone",
        "title": "Rédaction des textes",
        "text": "J'écris le contenu de vos pages à partir d'un échange sur votre activité. Vous n'avez pas de page blanche à remplir."
      },
      {
        "icon": "line-md:laptop-twotone",
        "title": "Design sur mesure",
        "text": "Une maquette pensée pour votre métier et votre image, validée avant la moindre ligne de code."
      },
      {
        "icon": "line-md:search-twotone",
        "title": "Référencement de base",
        "text": "Balises, structure des titres, vitesse et plan de site : les fondations pour être indexé correctement."
      },
      {
        "icon": "line-md:document-list-twotone",
        "title": "Formulaire de contact",
        "text": "Un formulaire qui arrive dans votre boîte mail, protégé contre les envois automatiques."
      },
      {
        "icon": "line-md:cloud-up-twotone",
        "title": "Mise en ligne accompagnée",
        "text": "Configuration du domaine et de l'hébergement, tests sur mobile et ordinateur avant l'ouverture au public."
      },
      {
        "icon": "line-md:confirm-circle-twotone",
        "title": "Un mois de corrections",
        "text": "Après la livraison, tout ajustement ou correction reste pris en charge pendant un mois."
      }
    ]
  },
  "process": {
    "title": "Comment se déroule un projet",
    "steps": [
      {
        "title": "Échange de cadrage",
        "text": "Trente minutes pour comprendre votre activité, vos clients et ce que le site doit déclencher. C'est là qu'on choisit la formule adaptée."
      },
      {
        "title": "Devis et acompte",
        "text": "Un devis détaillé, sans surprise. Le projet démarre au versement de l'acompte de 50 %."
      },
      {
        "title": "Maquette",
        "text": "Je vous présente le design des pages principales. Rien n'est développé tant que vous ne l'avez pas validé."
      },
      {
        "title": "Rédaction et intégration",
        "text": "J'écris les textes et construis le site. Vous suivez l'avancement sur un lien de prévisualisation."
      },
      {
        "title": "Révisions",
        "text": "Vous relisez et demandez vos ajustements, selon le nombre de révisions prévu dans votre formule."
      },
      {
        "title": "Mise en ligne et prise en main",
        "text": "Le site ouvre au public. Je vous montre comment le gérer au quotidien, et je reste disponible un mois pour les corrections."
      }
    ]
  },
  "pricing": {
    "intro": "Chaque projet est chiffré après un premier échange. Les montants ci-dessous sont des fourchettes indicatives, confirmées au devis. Le paiement se fait en deux fois : 50 % au démarrage, 50 % à la livraison.",
    "factors": [
      "Le nombre de pages à créer",
      "La présence d'un blog ou d'un espace actualités",
      "La vente en ligne et les moyens de paiement",
      "Les connexions à vos outils existants",
      "Le nombre de révisions souhaité",
      "L'urgence de la mise en ligne"
    ]
  },
  "faq": [
    {
      "q": "Combien de temps faut-il pour livrer un site ?",
      "a": "Sept jours pour un site vitrine de trois pages, quatorze jours pour un site de six pages avec blog et formulaires, et trente jours pour un projet e-commerce ou avec intégrations. Ces délais courent à partir de la validation de la maquette."
    },
    {
      "q": "Dois-je fournir les textes et les photos ?",
      "a": "La rédaction est comprise dans la prestation : j'écris vos textes à partir d'un échange sur votre activité. Pour les photos, vos propres visuels sont toujours préférables ; à défaut, je propose des images libres de droits adaptées."
    },
    {
      "q": "L'hébergement et le nom de domaine sont-ils compris ?",
      "a": "Non, ils restent à votre nom et à votre charge — c'est important, votre site doit vous appartenir. Je vous conseille sur le choix, et je m'occupe de toute la configuration technique."
    },
    {
      "q": "Comment se passe le paiement ?",
      "a": "En deux versements : 50 % à la commande pour démarrer le projet, 50 % à la livraison. Aucun frais caché ne s'ajoute au devis validé."
    },
    {
      "q": "Que se passe-t-il si je trouve un problème après la livraison ?",
      "a": "Les corrections restent prises en charge pendant un mois après la mise en ligne, sans surcoût. Au-delà, une formule de maintenance permet de garder le site à jour et sécurisé."
    },
    {
      "q": "Pourrai-je modifier mon site moi-même ?",
      "a": "Oui. Un espace d'administration vous permet de changer vos textes, vos images et vos actualités. Je vous forme à son utilisation lors de la mise en ligne."
    },
    {
      "q": "Travaillez-vous avec des clients hors de Cotonou ?",
      "a": "Oui. Le travail se fait aussi bien à distance qu'en présentiel, au Bénin comme à l'international. Les échanges se tiennent par visioconférence ou WhatsApp selon ce qui vous arrange."
    }
  ]
}
$json$::jsonb
where slug = 'creation-de-sites-web-sur-mesure';

-- -----------------------------------------------------------------------------
-- 2) Optimisation SEO & visibilité Google
-- -----------------------------------------------------------------------------
update services set content = $json$
{
  "version": 1,
  "hero": {
    "tagline": "Apparaissez quand vos clients cherchent votre métier. Audit technique, référencement local et suivi mensuel des positions.",
    "badges": ["Référencement local", "Audit technique", "Google My Business", "Suivi mensuel"]
  },
  "definition": {
    "title": "Le référencement naturel, concrètement",
    "body": "<p>Le référencement naturel — ou SEO — regroupe tout ce qui fait qu'un site apparaît dans les résultats de Google sans payer de publicité. Trois choses comptent : que Google puisse lire votre site correctement, qu'il comprenne de quoi vous parlez, et qu'il vous juge assez fiable pour vous montrer.</p><p>Pour une entreprise locale, l'enjeu tient en une phrase : être là au moment où quelqu'un cherche votre métier à Cotonou. Pas dans six mois, pas en trente-cinquième position.</p>",
    "highlight": "Le référencement n'achète pas de visibilité, il la construit. C'est plus lent que la publicité, mais ça ne s'arrête pas quand on cesse de payer."
  },
  "why": {
    "title": "Pourquoi travailler son référencement",
    "problem": {
      "title": "Votre site existe, mais personne ne le trouve",
      "text": "Beaucoup d'entreprises de Cotonou ont un site que seuls leurs clients existants consultent, parce qu'on leur en a donné l'adresse. Sur une recherche du type « plombier Cotonou » ou « traiteur Akpakpa », elles n'apparaissent nulle part."
    },
    "aggravation": {
      "title": "Sans visibilité, il faut payer pour exister",
      "text": "Quand le référencement naturel ne rapporte rien, la seule façon d'être vu est d'acheter de la publicité. Le flux s'arrête dès qu'on coupe le budget, et le coût d'acquisition grimpe à mesure que la concurrence enchérit. Les recherches qui vous revenaient de droit alimentent les autres."
    },
    "solution": {
      "title": "Un travail méthodique, mesuré chaque mois",
      "text": "Je commence par un audit technique et sémantique pour identifier ce qui bloque réellement. Ensuite, priorités claires, corrections mesurables, et un suivi mensuel des positions pour ajuster le tir plutôt que d'avancer à l'aveugle.",
      "benefits": [
        {
          "icon": "line-md:search-twotone",
          "title": "Visible sur les recherches locales",
          "text": "Optimisation pour les requêtes qui associent votre métier à votre ville ou votre quartier."
        },
        {
          "icon": "line-md:speed-twotone",
          "title": "Un site que Google peut lire",
          "text": "Vitesse, structure des titres, données structurées : les fondations techniques qui conditionnent tout le reste."
        },
        {
          "icon": "line-md:document-list-twotone",
          "title": "Des progrès vérifiables",
          "text": "Positions suivies, pages qui ramènent du trafic, requêtes à travailler ensuite : un rapport lisible, pas un tableau de chiffres."
        },
        {
          "icon": "line-md:star-twotone",
          "title": "Une fiche Google soignée",
          "text": "Google My Business complété et tenu à jour : horaires, photos, avis, c'est souvent le premier contact."
        }
      ]
    },
    "action": {
      "title": "Commencez par savoir où vous en êtes",
      "text": "L'audit initial dit précisément ce qui vous freine et ce qui rapportera le plus vite. C'est le point de départ le plus utile, et il ne vous engage à rien pour la suite.",
      "ctaLabel": "Demander un audit"
    }
  },
  "includes": {
    "title": "Ce que couvre une prestation SEO",
    "items": [
      {
        "icon": "line-md:search-twotone",
        "title": "Audit technique",
        "text": "Indexation, vitesse, mobile, liens cassés, contenus dupliqués : l'état des lieux de ce qui empêche Google de bien lire votre site."
      },
      {
        "icon": "line-md:document-list-twotone",
        "title": "Recherche de mots-clés",
        "text": "Les requêtes que tapent réellement vos clients, classées par intérêt et par difficulté."
      },
      {
        "icon": "line-md:pencil-alt-twotone",
        "title": "Optimisation des pages",
        "text": "Titres, descriptions, structure des contenus et maillage entre vos pages."
      },
      {
        "icon": "line-md:star-twotone",
        "title": "Référencement local",
        "text": "Fiche Google My Business, cohérence de vos coordonnées et données structurées de localisation."
      },
      {
        "icon": "line-md:speed-twotone",
        "title": "Performance technique",
        "text": "Temps de chargement et stabilité d'affichage, deux critères que Google prend en compte directement."
      },
      {
        "icon": "line-md:confirm-circle-twotone",
        "title": "Rapport de suivi",
        "text": "Chaque mois en formule continue : positions, trafic, et les actions prévues pour le mois suivant."
      }
    ]
  },
  "process": {
    "title": "Comment se déroule une mission",
    "steps": [
      {
        "title": "Audit initial",
        "text": "Trois jours pour analyser le site, la concurrence locale et les requêtes visées. Vous recevez un rapport avec les priorités classées par impact."
      },
      {
        "title": "Corrections techniques",
        "text": "On règle d'abord ce qui bloque : indexation, vitesse, mobile. Sans ces fondations, le reste ne sert à rien."
      },
      {
        "title": "Optimisation des contenus",
        "text": "Réécriture des titres et descriptions, restructuration des pages, création des contenus manquants."
      },
      {
        "title": "Référencement local",
        "text": "Fiche Google My Business, cohérence des coordonnées et balisage des données de localisation."
      },
      {
        "title": "Suivi et ajustement",
        "text": "En formule continue, un point mensuel sur les positions gagnées et les prochaines actions."
      }
    ]
  },
  "pricing": {
    "intro": "L'audit se facture une fois ; le référencement local est un chantier ponctuel ; le SEO continu est un abonnement mensuel. Paiement en deux fois pour les prestations ponctuelles, mensuel pour l'accompagnement.",
    "factors": [
      "Le nombre de pages à analyser et optimiser",
      "L'état technique du site au départ",
      "Le niveau de concurrence sur vos requêtes",
      "Le volume de contenus à écrire ou réécrire",
      "La présence ou non d'une fiche Google My Business",
      "La durée de l'accompagnement souhaité"
    ]
  },
  "faq": [
    {
      "q": "En combien de temps voit-on des résultats ?",
      "a": "Les corrections techniques produisent un effet en quelques semaines. Pour des gains de position durables sur des requêtes concurrentielles, comptez trois à six mois. Toute promesse de résultat immédiat doit vous alerter."
    },
    {
      "q": "Pouvez-vous garantir la première place sur Google ?",
      "a": "Non, et personne ne le peut sérieusement : Google ne vend pas de position en référencement naturel. Ce que je garantis, c'est un travail méthodique sur les critères qui comptent, et un suivi qui montre précisément ce qui progresse."
    },
    {
      "q": "Faut-il refaire mon site pour améliorer le référencement ?",
      "a": "Pas nécessairement. L'audit le dira. Beaucoup de sites gagnent nettement avec des corrections techniques et une réécriture des contenus. Une refonte ne s'impose que si la base technique est vraiment inexploitable."
    },
    {
      "q": "Quelle différence entre l'audit et le référencement local ?",
      "a": "L'audit est un diagnostic : il identifie et hiérarchise les problèmes, sans les corriger. Le référencement local est la mise en œuvre : optimisation de la fiche Google My Business, des mots-clés géolocalisés et des données structurées."
    },
    {
      "q": "Le SEO continu, à quoi ça sert une fois le site optimisé ?",
      "a": "Le référencement n'est pas un état, c'est une position relative : vos concurrents travaillent aussi, et Google fait évoluer ses critères. L'accompagnement mensuel maintient l'acquis et va chercher de nouvelles requêtes."
    },
    {
      "q": "Travaillez-vous sur des sites WordPress ?",
      "a": "Oui, comme sur la plupart des technologies. WordPress est même un terrain courant, avec ses points de blocage habituels : extensions trop nombreuses, images non compressées, thèmes lourds."
    }
  ]
}
$json$::jsonb
where slug = 'optimisation-seo-visibilite-google';

-- -----------------------------------------------------------------------------
-- 3) Maintenance & support WordPress
-- -----------------------------------------------------------------------------
update services set content = $json$
{
  "version": 1,
  "hero": {
    "tagline": "Mises à jour, sauvegardes, sécurité et performance. Votre site reste en ligne, rapide et protégé, sans que vous ayez à y penser.",
    "badges": ["Sauvegardes régulières", "Mises à jour", "Surveillance sécurité", "Intervention rapide"]
  },
  "definition": {
    "title": "Pourquoi un site WordPress demande de l'entretien",
    "body": "<p>WordPress fait tourner une grande partie du web, ce qui en fait aussi une cible privilégiée. Le cœur du logiciel, le thème et chaque extension reçoivent des mises à jour régulières, souvent liées à des failles de sécurité découvertes après coup.</p><p>Un site laissé sans suivi accumule les versions en retard. Il ralentit, s'expose, et finit par tomber au pire moment — généralement celui où un client tentait de vous contacter.</p>",
    "highlight": "La maintenance ne se voit pas quand elle est faite. Elle se voit brutalement quand elle ne l'est pas."
  },
  "why": {
    "title": "Pourquoi confier la maintenance",
    "problem": {
      "title": "Un site qui vieillit sans qu'on s'en aperçoive",
      "text": "Personne ne surveille les mises à jour, les sauvegardes n'ont jamais été testées, et le site met de plus en plus de temps à s'afficher. Tant que la page s'ouvre, tout semble aller — jusqu'au jour où ce n'est plus le cas."
    },
    "aggravation": {
      "title": "Une panne coûte toujours plus cher que l'entretien",
      "text": "Une faille exploitée, c'est un site indisponible, parfois affiché comme dangereux par Google, et une réputation à reconstruire. Sans sauvegarde récente, la remise en état se compte en jours. La dette technique s'accumule, et le rattrapage finit par dépasser largement ce qu'aurait coûté un suivi régulier."
    },
    "solution": {
      "title": "Un entretien discret et régulier",
      "text": "Je m'occupe des mises à jour, des sauvegardes et de la surveillance. Vous recevez un rapport à intervalle régulier, et une intervention rapide si quelque chose casse — sans avoir à comprendre ce qui se passe sous le capot.",
      "benefits": [
        {
          "icon": "line-md:security-twotone",
          "title": "Failles refermées vite",
          "text": "Le cœur, le thème et les extensions restent à jour, avec vérification après chaque intervention."
        },
        {
          "icon": "line-md:cloud-up-twotone",
          "title": "Sauvegardes vérifiées",
          "text": "Des copies régulières, et surtout la certitude qu'elles se restaurent réellement."
        },
        {
          "icon": "line-md:speed-twotone",
          "title": "Un site qui reste rapide",
          "text": "Base de données nettoyée, images compressées, cache surveillé : la performance ne se dégrade pas avec le temps."
        },
        {
          "icon": "line-md:phone-call-loop",
          "title": "Quelqu'un à appeler",
          "text": "En cas de problème, vous avez un interlocuteur qui connaît déjà votre site."
        }
      ]
    },
    "action": {
      "title": "Le bon moment, c'est avant la panne",
      "text": "Un premier audit de sécurité fait le point sur les extensions obsolètes et les portes restées ouvertes. C'est rapide, et cela suffit souvent à mesurer l'urgence.",
      "ctaLabel": "Faire vérifier mon site"
    }
  },
  "includes": {
    "title": "Ce que couvre la maintenance",
    "items": [
      {
        "icon": "line-md:cog-loop",
        "title": "Mises à jour suivies",
        "text": "Cœur WordPress, thème et extensions, appliqués puis vérifiés — une mise à jour peut casser un affichage."
      },
      {
        "icon": "line-md:cloud-up-twotone",
        "title": "Sauvegardes régulières",
        "text": "Copies hebdomadaires conservées hors du serveur du site, et restauration testée."
      },
      {
        "icon": "line-md:security-twotone",
        "title": "Surveillance sécurité",
        "text": "Détection des tentatives d'intrusion, des fichiers modifiés et des extensions abandonnées par leur auteur."
      },
      {
        "icon": "line-md:speed-twotone",
        "title": "Optimisation continue",
        "text": "Nettoyage de la base, compression des images, réglages de cache."
      },
      {
        "icon": "line-md:document-list-twotone",
        "title": "Rapport d'activité",
        "text": "Ce qui a été fait, ce qui a été corrigé, ce qui mérite votre attention."
      },
      {
        "icon": "line-md:confirm-circle-twotone",
        "title": "Interventions incluses",
        "text": "Les corrections courantes font partie de la formule, sans facturation à l'acte."
      }
    ]
  },
  "process": {
    "title": "Comment ça commence",
    "steps": [
      {
        "title": "Audit de sécurité",
        "text": "État des lieux : versions en retard, extensions à risque, sauvegardes existantes, performance actuelle."
      },
      {
        "title": "Remise à niveau",
        "text": "Mises à jour de rattrapage, suppression des extensions inutiles, première sauvegarde complète."
      },
      {
        "title": "Mise sous surveillance",
        "text": "Installation du suivi et programmation des sauvegardes automatiques."
      },
      {
        "title": "Entretien courant",
        "text": "Interventions régulières et rapport d'activité, selon la formule choisie."
      }
    ]
  },
  "pricing": {
    "intro": "La maintenance est un abonnement mensuel, sans engagement de durée. Les interventions ponctuelles se facturent à la mission. Un audit de sécurité initial peut être nécessaire si le site a été longtemps laissé sans suivi.",
    "factors": [
      "Le nombre d'extensions installées",
      "La présence d'une boutique en ligne",
      "L'ancienneté du site et son retard de mises à jour",
      "La fréquence de sauvegarde souhaitée",
      "Le délai d'intervention garanti",
      "Le volume de modifications de contenu demandées"
    ]
  },
  "faq": [
    {
      "q": "Mon site n'est pas sous WordPress, pouvez-vous quand même intervenir ?",
      "a": "Cela dépend de la technologie. Parlons-en : si je ne peux pas assurer un suivi sérieux, je vous le dirai plutôt que d'accepter une mission que je maîtriserais mal."
    },
    {
      "q": "Que se passe-t-il si mon site tombe en pleine nuit ?",
      "a": "L'intervention démarre dès la prise de connaissance, avec un délai plus court en formule Pro. La sauvegarde récente permet dans la plupart des cas de remettre le site en ligne rapidement, avant même d'avoir identifié la cause."
    },
    {
      "q": "Suis-je engagé sur une durée ?",
      "a": "Non. La maintenance est mensuelle et s'arrête quand vous le souhaitez. Vous gardez évidemment vos sauvegardes et vos accès."
    },
    {
      "q": "Puis-je continuer à modifier mon site moi-même ?",
      "a": "Bien sûr. La maintenance porte sur la partie technique, pas sur vos contenus. Prévenez-moi simplement si vous installez une nouvelle extension, pour que je la surveille."
    },
    {
      "q": "Que couvre exactement une intervention à la carte ?",
      "a": "Un dépannage précis, une migration vers un autre hébergeur, ou une correction ponctuelle. C'est la bonne formule si vous ne voulez pas d'abonnement mais avez un problème identifié."
    },
    {
      "q": "Les mises à jour peuvent-elles casser mon site ?",
      "a": "Cela arrive, et c'est justement pourquoi elles ne s'appliquent pas à l'aveugle. Sauvegarde avant, vérification après, et retour arrière immédiat si l'affichage change."
    }
  ]
}
$json$::jsonb
where slug = 'maintenance-support-wordpress';

-- -----------------------------------------------------------------------------
-- 4) Automatisation & optimisation digitale
-- -----------------------------------------------------------------------------
update services set content = $json$
{
  "version": 1,
  "hero": {
    "tagline": "Devis, relances, saisie, rapports : les tâches répétitives s'exécutent seules. Vos outils actuels restent en place, ils se parlent enfin.",
    "badges": ["n8n", "Intégrations API", "Sans changer d'outils", "Dès 7 jours"]
  },
  "definition": {
    "title": "Automatiser, ça veut dire quoi ?",
    "body": "<p>Automatiser, c'est confier à une machine les enchaînements que vous refaites à l'identique chaque semaine : recopier une commande d'un formulaire vers un tableur, envoyer la même relance trois jours après un devis, préparer le récapitulatif du lundi matin.</p><p>Il ne s'agit pas de remplacer vos outils. Vos formulaires, votre messagerie, vos tableurs et votre CRM restent en place — on les connecte pour que l'information circule sans passer par un copier-coller.</p>",
    "highlight": "Une tâche de dix minutes répétée chaque jour, c'est plus de quarante heures par an. C'est là que l'automatisation se rentabilise."
  },
  "why": {
    "title": "Pourquoi automatiser maintenant",
    "problem": {
      "title": "Vous refaites chaque semaine les mêmes gestes",
      "text": "Recopier des informations d'un outil à l'autre, relancer manuellement, reconstituer un tableau de suivi. Chaque geste est court, aucun n'est difficile, et ensemble ils occupent une part sérieuse de vos journées."
    },
    "aggravation": {
      "title": "Ce temps ne revient jamais, et les oublis coûtent cher",
      "text": "Une relance oubliée, c'est un devis qui s'éteint sans réponse. Une saisie erronée, c'est une commande à rattraper. Plus l'activité grandit, plus ces tâches s'accumulent — jusqu'à devenir la raison pour laquelle vous ne développez pas."
    },
    "solution": {
      "title": "Des enchaînements fiables, construits sur vos outils actuels",
      "text": "Je conçois des automatisations avec n8n et des connexions directes à vos applications. Chaque enchaînement est documenté et testé, pour que vous sachiez exactement ce qui se déclenche et quand.",
      "benefits": [
        {
          "icon": "line-md:speed-twotone",
          "title": "Du temps récupéré chaque semaine",
          "text": "Les tâches répétitives s'exécutent sans vous, y compris la nuit et le week-end."
        },
        {
          "icon": "line-md:confirm-circle-twotone",
          "title": "Plus d'oubli de relance",
          "text": "Les suivis partent au bon moment, systématiquement, sans dépendre de votre mémoire."
        },
        {
          "icon": "line-md:cog-loop",
          "title": "Vos outils inchangés",
          "text": "Pas de migration ni de nouvel abonnement : on relie l'existant."
        },
        {
          "icon": "line-md:document-list-twotone",
          "title": "Tout est documenté",
          "text": "Chaque enchaînement est expliqué, pour rester compréhensible et modifiable après mon départ."
        }
      ]
    },
    "action": {
      "title": "Commencez par la tâche qui vous pèse le plus",
      "text": "Inutile de tout automatiser d'un coup. Un premier enchaînement bien choisi se met en place en une semaine et rend le gain immédiatement visible.",
      "ctaLabel": "Identifier ce qui peut être automatisé"
    }
  },
  "includes": {
    "title": "Ce que comprend une mission",
    "items": [
      {
        "icon": "line-md:search-twotone",
        "title": "Analyse de vos tâches",
        "text": "On liste ensemble ce qui se répète, et on estime le temps réellement consommé par chacune."
      },
      {
        "icon": "line-md:cog-loop",
        "title": "Conception des enchaînements",
        "text": "Construction sous n8n, avec gestion des cas d'erreur — un enchaînement qui échoue en silence est pire que pas d'automatisation."
      },
      {
        "icon": "line-md:cloud-up-twotone",
        "title": "Connexion à vos outils",
        "text": "Formulaires, messagerie, tableurs, CRM, facturation : liaison via leurs interfaces officielles."
      },
      {
        "icon": "line-md:confirm-circle-twotone",
        "title": "Tests en conditions réelles",
        "text": "Chaque enchaînement tourne sur vos vraies données avant d'être mis en service."
      },
      {
        "icon": "line-md:document-list-twotone",
        "title": "Documentation",
        "text": "Un guide clair de ce qui se déclenche, quand, et comment intervenir si besoin."
      },
      {
        "icon": "line-md:pencil-alt-twotone",
        "title": "Formation de vos équipes",
        "text": "Une automatisation que personne ne comprend finit contournée. La prise en main fait partie de la mission."
      }
    ]
  },
  "process": {
    "title": "Comment se déroule une mission",
    "steps": [
      {
        "title": "Repérage",
        "text": "On identifie les tâches répétitives et on estime le temps qu'elles coûtent. Toutes ne méritent pas d'être automatisées."
      },
      {
        "title": "Priorisation",
        "text": "On commence par ce qui rapporte le plus de temps pour le moins d'effort, afin de mesurer le gain vite."
      },
      {
        "title": "Construction",
        "text": "Développement des enchaînements et connexion à vos outils, avec traitement des cas particuliers."
      },
      {
        "title": "Tests",
        "text": "Mise à l'épreuve sur vos données réelles, y compris les situations qui se passent mal."
      },
      {
        "title": "Mise en service et formation",
        "text": "Activation, remise de la documentation et prise en main par vos équipes."
      }
    ]
  },
  "pricing": {
    "intro": "Le tarif dépend du nombre d'enchaînements et de la complexité des connexions. Les abonnements aux outils tiers, quand ils sont nécessaires, restent à votre charge et à votre nom. Paiement en deux fois, comme pour les autres prestations.",
    "factors": [
      "Le nombre d'enchaînements à construire",
      "Le nombre d'outils à connecter entre eux",
      "L'existence ou non d'une interface de connexion officielle",
      "Le volume de données à traiter",
      "Le besoin d'hébergement dédié pour n8n",
      "L'ampleur de la formation à prévoir"
    ]
  },
  "faq": [
    {
      "q": "Faut-il changer mes outils actuels ?",
      "a": "Non, c'est même le principe : on relie ce que vous utilisez déjà. Un changement d'outil n'est proposé que si l'actuel n'offre aucun moyen de connexion, et ce sera dit clairement avant de commencer."
    },
    {
      "q": "Qu'est-ce que n8n ?",
      "a": "Un outil d'automatisation qui relie des applications entre elles. Sa particularité : il peut être hébergé sur votre propre serveur, donc vos données ne transitent pas chez un tiers — un vrai sujet quand on traite des informations clients."
    },
    {
      "q": "Que se passe-t-il si une automatisation tombe en panne ?",
      "a": "Chaque enchaînement gère ses cas d'erreur et vous alerte plutôt que d'échouer en silence. La documentation explique comment reprendre la main manuellement en attendant la correction."
    },
    {
      "q": "Combien de temps pour une première automatisation ?",
      "a": "Sept jours pour un enchaînement simple, du type formulaire vers email. Quatorze jours pour des intégrations CRM ou des synchronisations avancées. Trois semaines pour des pipelines sur mesure avec documentation complète."
    },
    {
      "q": "Mes données sont-elles en sécurité ?",
      "a": "Les connexions passent par les interfaces officielles de chaque outil, avec des accès dédiés et révocables. Quand la sensibilité le justifie, n8n est installé sur votre propre hébergement."
    },
    {
      "q": "Pourrai-je modifier les automatisations moi-même ensuite ?",
      "a": "Oui. n8n s'utilise visuellement, et la documentation remise explique la logique de chaque enchaînement. Beaucoup de clients font eux-mêmes les ajustements courants."
    }
  ]
}
$json$::jsonb
where slug = 'automatisation-optimisation-digitale';

-- -----------------------------------------------------------------------------
-- 5) Vérification — les 4 lignes doivent afficher 8 clés et une FAQ remplie
-- -----------------------------------------------------------------------------
select
  order_index,
  slug,
  jsonb_array_length(content->'faq')                       as nb_questions,
  jsonb_array_length(content->'includes'->'items')         as nb_inclus,
  jsonb_array_length(content->'process'->'steps')          as nb_etapes,
  jsonb_array_length(content->'why'->'solution'->'benefits') as nb_benefices
from services
order by order_index;
