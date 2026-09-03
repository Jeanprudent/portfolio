# Veille RSS → rédaction → brouillon sur le blog

Automatisation n8n qui, chaque matin, cherche un sujet d'actualité dans la niche
(dev web, SEO, conversion, automatisation), fait rédiger un article original par
Google Gemini, et le dépose **en brouillon** sur le blog via un webhook du site.

```
Cron 7h ─▶ Flux RSS ─▶ Scoring niche ─▶ Anti-doublon ─▶ Top 1
                                                          │
                                                          ▼
        /gestion/blog  ◀── POST /api/blog/webhook ◀── Basic LLM Chain
        (tu relis, tu publies)                       (Gemini + analyseur
                                                      de sortie structurée)
```

Rien n'est mis en ligne automatiquement. Le webhook force `published: false` :
l'article attend dans le back-office que tu cliques sur « Publier ».

---

## 1. Côté site (une fois)

Renseigne deux variables d'environnement — en local dans `.env.local`, et
**dans Vercel** (Project Settings → Environment Variables) pour la production.

| Variable | Où la trouver | Rôle |
|---|---|---|
| `BLOG_WEBHOOK_SECRET` | à générer : `openssl rand -hex 32` | Mot de passe du webhook. 32 caractères minimum, sinon la route se désactive. |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → `service_role` | Seule clé capable d'écrire dans `blog_posts` sans session admin. |

⚠️ `SUPABASE_SERVICE_ROLE_KEY` contourne le RLS. Elle n'a **pas** de préfixe
`NEXT_PUBLIC_`, donc elle n'est jamais envoyée au navigateur — voir
`lib/supabase-admin.ts`. Ne la copie nulle part ailleurs, et ne l'utilise que
depuis `app/api/**`.

Redéploie après avoir ajouté les variables sur Vercel.

## 2. Côté n8n (une fois)

**a. Les credentials**

| Credential | Type | Contenu | État |
|---|---|---|---|
| `Google Gemini(PaLM) Api account` | Google Gemini(PaLM) API | ta clé depuis aistudio.google.com | déjà branchée sur le nœud modèle |
| `Blog webhook — Jean Prudent` | Header Auth | **Name** : `Authorization` — **Value** : `Bearer <BLOG_WEBHOOK_SECRET>` (le mot `Bearer`, une espace, puis le secret) | **à créer** |

Le secret ne vit que dans cette credential : il n'apparaît nulle part dans le
fichier du workflow, qui peut donc être versionné sans risque.

**b. Importer le workflow**

n8n → Workflows → *Import from File* → `veille-rss-redaction-blog.json`.

**c. Rebrancher la credential du webhook**

Un seul nœud porte `id: "REMPLACER"` : **Publier l'article sur le site**.
Ouvre-le et sélectionne `Blog webhook — Jean Prudent` dans la liste.

**d. Vérifier l'URL du site**

Le nœud « Publier l'article sur le site » pointe vers
`https://jprudent-portfolio.vercel.app/api/blog/webhook`. Change-la le jour où
tu branches un vrai domaine.

## 3. Premier essai

Clique sur *Execute Workflow* (exécution manuelle) plutôt que d'activer le cron.
Le dernier nœud, « Lire le résultat », dit ce qui s'est passé :

| `resultat` | Signification |
|---|---|
| `brouillon_cree` | ✅ L'article attend dans `/gestion/blog`. Le champ `relecture` donne le lien. |
| `doublon_ignore` | Le slug existe déjà, rien n'a été écrit. Comportement normal, pas une panne. |
| *erreur levée* | Voir le tableau des codes ci-dessous. |

Puis active le workflow (bouton *Active* en haut à droite) pour le cron du matin.

---

## Les nœuds, un par un

| Nœud | Ce qu'il fait | Ce que tu peux régler |
|---|---|---|
| **Chaque matin à 7h** | Déclencheur cron `0 7 * * 1-5` | La fréquence. Un article par jour ouvré est déjà beaucoup. |
| **Flux RSS surveillés** | Liste des URL de flux | Ajoute/retire des flux. Chaque URL est un item. |
| **Lire le flux RSS** | Lit chaque flux | Rien. Un flux mort n'interrompt pas le run (*continue on error*). |
| **Noter la pertinence** | Filtre (14 jours max), score par mots-clés, trie | `KEYWORDS` et `MAX_AGE_DAYS`. C'est **le** réglage qui détermine la qualité des sujets. Seuil actuel : score ≥ 3. |
| **Écarter les sujets déjà traités** | Mémorise les URL vues aux exécutions précédentes | Rien. Évite de repayer des tokens sur un sujet déjà couvert. |
| **Choisir le sujet du jour** | Ne garde que le mieux noté | `maxItems` : passe à 2-3 pour plusieurs brouillons. |
| **Rédaction de l'article : Basic LLM Chain1** | Envoie le sujet au modèle et impose la structure de sortie | Le *system message* (ligne éditoriale, longueur, règles HTML). |
| ↳ **Google Gemini Chat Model1** | Le modèle : `models/gemini-3.1-flash-lite`, `maxOutputTokens` **8192**, `temperature` 0.4 | Le modèle, via la liste déroulante. Ne redescends pas `maxOutputTokens` : voir l'encadré ci-dessous. |
| ↳ **Correction automatique de la sortie** | Si le JSON est malformé, le renvoie au modèle avec l'erreur pour réparation | Supprimable si tu préfères que l'exécution échoue franchement. |
| ↳ **Structure de sortie de l'article** | Impose les 5 champs attendus par le webhook | Le schéma, si tu ajoutes un champ. |
| **Préparer l'article** | Lit la sortie, normalise slug/titre/tags, ajoute la mention de source | L'endroit où brancher une image de couverture. |
| **Publier l'article sur le site** | `POST /api/blog/webhook` | L'URL du site. |
| **Lire le résultat** | Traduit le code HTTP en message lisible | Rien. |

Les nœuds marqués ↳ sont des **sous-nœuds** : ils se branchent sous la chaîne
(connexions `ai_languageModel` et `ai_outputParser`), pas dans le flux
principal. C'est normal qu'ils n'aient pas d'entrée à gauche. Le modèle Gemini
alimente à la fois la chaîne et le correcteur ; l'analyseur structuré passe par
le correcteur avant d'atteindre la chaîne.

> ### ⚠️ « Model output doesn't fit required format »
>
> Cette erreur signifie presque toujours que la réponse du modèle a été
> **tronquée**, pas que le schéma est faux. Dans n8n, l'option
> *Maximum Number of Tokens* du nœud Gemini vaut **1024 par défaut** — très
> loin des 4000 à 5000 tokens que représentent 1500 à 2000 mots de HTML
> encapsulés dans une chaîne JSON. La génération s'arrête en plein milieu, le
> JSON n'a plus d'accolade fermante, et l'analyseur rejette.
>
> Le workflow fixe donc `maxOutputTokens` à **8192**. Si tu augmentes la
> longueur cible des articles, augmente-le en proportion. Si tu changes de
> modèle, vérifie que l'option est toujours renseignée : elle retombe à 1024
> dès qu'elle est vide.

### La sortie du modèle est contrainte

La case *Require Specific Output Format* de la chaîne est cochée, et l'analyseur
« Structure de sortie de l'article » lui est branché. Le modèle ne peut donc
renvoyer que ces cinq champs :

```json
{ "title": "…", "slug": "…", "excerpt": "…", "content": "<h2>…</h2><p>…</p>", "tags": ["SEO"] }
```

C'est ce qui rend l'étape de parsing fiable. Par sécurité, « Préparer l'article »
retire quand même un éventuel bloc de code Markdown autour du HTML ou du JSON :
c'est le réflexe le plus courant des modèles, et il ferait échouer le webhook
en 422.

---

## Contrat du webhook

`POST /api/blog/webhook` — en-tête `Authorization: Bearer <BLOG_WEBHOOK_SECRET>`

| Champ | Requis | Contrainte |
|---|---|---|
| `title` | oui | 10 à 160 caractères, une seule ligne |
| `content` | oui | **HTML** (voir ci-dessous), 200 000 caractères max. Minimum : 200 caractères de **texte**, mesurés après retrait des balises. |
| `slug` | non | `^[a-z0-9]+(-[a-z0-9]+)*$`. Calculé depuis le titre s'il est absent. |
| `excerpt` | non | 300 caractères max, une ligne. Extrait du contenu s'il est absent. |
| `cover_url` | non | URL absolue `http(s)`. `data:` refusé. |
| `tags` | non | 6 étiquettes max |

`published` n'est pas un champ d'entrée : il vaut toujours `false`.

**Le contenu doit être du HTML, pas du Markdown.** Il est nettoyé par la même
liste blanche que le rendu de l'article (`lib/sanitize.ts`) :

- gardé : `p h2 h3 h4 h5 h6 ul ol li strong em u s code pre blockquote a br hr span`
- supprimé : `script`, `iframe`, `style`, tous les attributs d'événement
  (`onclick`…), les URL `javascript:`, `data:` et protocole-relatives (`//…`)
- supprimé **sur ce chemin uniquement** : `img`. La balise reste autorisée dans
  `lib/sanitize.ts` pour les articles écrits à la main dans l'éditeur TipTap,
  mais une URL d'image inventée par un modèle ne donnerait qu'une image cassée.
  Pour illustrer un article automatisé, passe par `cover_url`.

Une réponse en Markdown est rejetée en 422 (« Contenu sans structure HTML »)
plutôt que stockée en pavé illisible.

### Codes de réponse

| Code | Signification | Quoi faire |
|---|---|---|
| `201` | Brouillon créé | Rien. Relire dans `/gestion/blog`. |
| `401` | Secret absent ou faux | La credential Header Auth ne correspond pas à `BLOG_WEBHOOK_SECRET`. Vérifie le préfixe `Bearer `. |
| `409` | Slug déjà pris | Normal. Le sujet a déjà été traité. |
| `422` | Champ invalide | La réponse liste les champs fautifs dans `details`. |
| `429` | Plus de 20 appels en 10 min | Boucle n8n emballée : regarde les exécutions. |
| `503` | `BLOG_WEBHOOK_SECRET` ou `SUPABASE_SERVICE_ROLE_KEY` manquante | Étape 1 non faite, ou déploiement Vercel pas relancé. |

### Tester le webhook sans n8n

```bash
curl -X POST https://jprudent-portfolio.vercel.app/api/blog/webhook \
  -H "Authorization: Bearer $BLOG_WEBHOOK_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Article de test du webhook",
    "content": "<h2>Test</h2><p>Un contenu de plus de deux cents caractères de texte, parce que le webhook mesure le texte réel une fois les balises retirées, et non la longueur brute du HTML. En dessous de ce seuil, il répond 422 en indiquant le nombre de caractères trouvés, ce qui permet de corriger sans deviner.</p>",
    "tags": ["Test"]
  }'
```

Attendu : `201` avec un `slug` et un `review_url`. Rejoue la même commande :
`409`.

---

## Ajouter une image de couverture

Le champ `cover_url` est accepté mais laissé vide par le workflow. Pour le
remplir, insère un nœud HTTP Request avant « Préparer l'article » (Unsplash,
Pexels…) et ajoute la ligne dans le nœud « Préparer l'article » :

```js
cover_url: "https://images.unsplash.com/photo-xxxxx?w=1200",
```

Le site n'héberge pas l'image : il stocke l'URL telle quelle. Si le service
distant disparaît, la couverture disparaît aussi — remplace-la à la main dans
`/gestion/blog` pour un article que tu veux garder.

## Ce qui coûte de l'argent

Un article ≈ un appel `gemini-3.1-flash-lite`, quelques milliers de tokens en
sortie. Les garde-fous qui limitent la dépense :

- le scoring écarte les sujets hors niche **avant** l'appel au modèle ;
- l'anti-doublon écarte les sujets déjà vus **avant** l'appel au modèle ;
- « Choisir le sujet du jour » limite à un article par exécution.

Pour réduire encore : passe le cron à 2 fois par semaine.

Le nœud « Correction automatique de la sortie » ne coûte rien tant que le JSON
est valide. Il ne déclenche un second appel au modèle que lorsqu'il faut
réparer une sortie malformée.

**Si la qualité ou la longueur déçoit**, `flash-lite` est le plus petit modèle
de la gamme et 1500 mots structurés en français sont exigeants pour lui. Change
le modèle dans la liste déroulante du nœud « Google Gemini Chat Model1 » — rien
d'autre à recâbler, la credential et le schéma de sortie restent valables.

La longueur cible se règle à deux endroits qui doivent rester d'accord : la
ligne « 1500 à 2000 mots » du *system message*, et la description du champ
`content` dans l'analyseur de sortie.

## Fichiers du site concernés

| Fichier | Rôle |
|---|---|
| `app/api/blog/webhook/route.ts` | Le webhook : authentification, validation, nettoyage, anti-doublon, insertion |
| `lib/supabase-admin.ts` | Client Supabase `service_role`, réservé aux route handlers |
| `lib/sanitize.ts` | Liste blanche HTML, partagée avec le rendu de l'article |
| `lib/slug.ts` | `slugify()`, utilisé quand n8n n'envoie pas de slug |
