import type { BlogPost } from "@/types/portfolio"

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "7 erreurs qui tuent le taux de conversion de votre site web",
    slug: "erreurs-taux-conversion-site-web",
    excerpt:
      "Un site web magnifique peut quand même échouer à convertir. Voici les 7 erreurs les plus communes, et comment les corriger rapidement.",
    content: `<h2>Pourquoi votre site ne convertit pas ?</h2>
<p>Vous avez investi dans un site professionnel, vous avez du trafic, mais les contacts restent rares. Ce n'est pas une fatalité. Dans la grande majorité des cas, c'est l'une de ces 7 erreurs qui bloque vos conversions.</p>
<h2>1. Un titre qui ne parle pas à votre cible</h2>
<p>La première chose que voit un visiteur, c'est votre titre. S'il ne répond pas immédiatement à la question <strong>"qu'est-ce que vous faites pour MOI ?"</strong>, vous perdez l'attention en moins de 3 secondes.</p>
<p><strong>Mauvais :</strong> "Bienvenue chez Dupont &amp; Associés"<br><strong>Bon :</strong> "Nous aidons les PME béninoises à tripler leur visibilité Google en 90 jours"</p>
<h2>2. Un appel à l'action flou ou absent</h2>
<p>Chaque page de votre site doit avoir <strong>un seul objectif clair</strong> avec un bouton d'action visible. "En savoir plus" n'est pas un CTA. "Obtenir mon audit SEO gratuit" en est un.</p>
<h2>3. Un temps de chargement trop lent</h2>
<p>53% des utilisateurs mobiles quittent un site si le chargement dépasse 3 secondes. Compressez vos images, utilisez un bon hébergeur, optimisez votre code.</p>
<h2>4. Aucune preuve sociale</h2>
<p>Les avis, témoignages et logos clients sont vos meilleurs vendeurs. Un visiteur qui voit que 47 clients ont fait confiance à votre entreprise a beaucoup plus envie de passer à l'action.</p>
<h2>5. Un formulaire de contact trop long</h2>
<p>Chaque champ supplémentaire réduit vos conversions de 10 à 20%. Pour un premier contact, demandez uniquement le nom, l'email, et le besoin.</p>
<h2>6. Un design non responsive</h2>
<p>En 2025, plus de 70% du trafic web est mobile. Si votre site s'affiche mal sur smartphone, vous perdez la majorité de vos visiteurs potentiels.</p>
<h2>7. Pas de suivi analytics</h2>
<p>Sans données, vous naviguez à l'aveugle. Installez Google Analytics 4 et configurez des objectifs de conversion pour savoir d'où viennent vos leads.</p>
<h2>Conclusion</h2>
<p>Corriger ces 7 points peut doubler votre taux de conversion sans augmenter votre trafic. Commencez par le plus impactant pour vous et progressez étape par étape.</p>`,
    cover_url: "",
    tags: ["Web Design", "Conversion", "UX"],
    published: true,
    created_at: "2025-02-10T10:00:00Z",
    updated_at: "2025-02-10T10:00:00Z",
  },
  {
    id: "2",
    title: "SEO en 2025 : les 5 facteurs qui comptent vraiment pour Google",
    slug: "seo-2025-facteurs-google",
    excerpt:
      "L'algorithme de Google évolue constamment. Voici les 5 facteurs SEO prioritaires en 2025 pour améliorer votre positionnement durablement.",
    content: `<h2>Le SEO en 2025</h2>
<p>Le référencement naturel n'est plus ce qu'il était. Fini le bourrage de mots-clés. Google est devenu extraordinairement sophistiqué dans sa capacité à évaluer la qualité réelle d'un contenu.</p>
<h2>1. L'expérience utilisateur (Core Web Vitals)</h2>
<p>Google mesure précisément la qualité de l'expérience sur votre site :</p>
<ul>
<li><strong>LCP</strong> : le contenu principal s'affiche en moins de 2,5 secondes</li>
<li><strong>INP</strong> : temps de réponse aux interactions inférieur à 200ms</li>
<li><strong>CLS</strong> : les éléments ne sautent pas pendant le chargement</li>
</ul>
<h2>2. L'E-E-A-T (Expérience, Expertise, Autorité, Confiance)</h2>
<p>Google veut montrer du contenu créé par de vraies personnes expertes. Votre page "À propos", vos certifications, vos études de cas, tout cela renforce votre crédibilité.</p>
<h2>3. L'intention de recherche</h2>
<p>Écrire pour les mots-clés ne suffit plus. Il faut comprendre ce que l'utilisateur cherche <strong>vraiment</strong> et y répondre de la façon la plus complète possible.</p>
<h2>4. Les liens internes et l'architecture</h2>
<p>Une structure claire avec des liens internes logiques aide Google à comprendre votre site et distribue l'autorité vers vos pages prioritaires.</p>
<h2>5. Le contenu long et de qualité</h2>
<p>Les articles de 2000+ mots bien structurés surpassent systématiquement les contenus courts, pas parce qu'ils sont longs, mais parce qu'ils sont complets.</p>
<h2>Ma recommandation</h2>
<p>Concentrez-vous d'abord sur la technique (vitesse, mobile), puis sur le contenu (qualité, profondeur), puis sur les backlinks (qualité, pas quantité). Dans cet ordre.</p>`,
    cover_url: "",
    tags: ["SEO", "Google", "Marketing Digital"],
    published: true,
    created_at: "2025-03-05T10:00:00Z",
    updated_at: "2025-03-05T10:00:00Z",
  },
  {
    id: "3",
    title: "Automatisation n8n : comment j'ai économisé 10h par semaine pour un client",
    slug: "automatisation-n8n-workflow",
    excerpt:
      "Un cas concret d'automatisation avec n8n : comment j'ai relié les formulaires, les emails et le CRM d'une PME pour économiser 10 heures de travail manuel par semaine.",
    content: `<h2>Le problème</h2>
<p>Mon client gérait chaque semaine des dizaines de formulaires de contact, devait les copier dans son CRM, envoyer des emails de confirmation manuellement, puis relancer les prospects qui n'avaient pas répondu.</p>
<p>Résultat : <strong>10 heures perdues chaque semaine</strong> en tâches répétitives et sans valeur ajoutée.</p>
<h2>La solution : n8n</h2>
<p>n8n est un outil d'automatisation open-source qui permet de créer des "workflows", des séquences d'actions automatiques déclenchées par des événements.</p>
<h2>Le workflow mis en place</h2>
<ol>
<li><strong>Formulaire soumis</strong> → n8n reçoit les données via webhook</li>
<li><strong>Données nettoyées</strong> → validation et formatage automatique</li>
<li><strong>CRM mis à jour</strong> → le contact est créé dans HubSpot</li>
<li><strong>Email de confirmation</strong> → envoyé automatiquement au prospect</li>
<li><strong>Notification Slack</strong> → l'équipe est alertée en temps réel</li>
<li><strong>Relance automatique</strong> → si pas de réponse en 48h, email de suivi</li>
</ol>
<h2>Les résultats</h2>
<ul>
<li><strong>10 heures/semaine</strong> économisées dès la première semaine</li>
<li><strong>0 oubli</strong> de relance (avant : 30% des prospects non relancés)</li>
<li><strong>Réponse immédiate</strong> au prospect (avant : délai moyen de 4h)</li>
<li><strong>ROI en 3 semaines</strong> : l'investissement était remboursé</li>
</ul>
<h2>Est-ce que ça marche pour vous ?</h2>
<p>Si vous passez plus de 3 heures par semaine sur des tâches répétitives (emails, saisie, rapports, relances), l'automatisation peut transformer votre quotidien.</p>`,
    cover_url: "",
    tags: ["n8n", "Automatisation", "Productivité"],
    published: true,
    created_at: "2025-04-20T10:00:00Z",
    updated_at: "2025-04-20T10:00:00Z",
  },
]
