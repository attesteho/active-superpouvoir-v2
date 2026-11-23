/** Socle éditorial du mouvement et de ses expériences. */

export const marque = {
  titre: "Active ton Superpouvoir !",
  autrice: "Nadine Zoro",
  signature: "La Fabrique des Héros",
  promesse:
    "Découvre ton superpouvoir unique, développe tes talents et trouve ta mission — à tout âge, à ton rythme, avec ta voix.",
  manifeste: ["Tu n’es pas", "un hasard.", "Tu es une réponse."],
  email: "nzoropro@gmail.com",
  emailSecondaire: "nzoroperso@gmail.com",
  emailMailto: "nzoropro@gmail.com,nzoroperso@gmail.com",
  whatsapp: "2250778454720",
  villes: ["Abidjan", "Dakar", "Paris", "Le Monde"],
  communaute: "+12 000 héros activés",
  communauteDetail: "en Côte d’Ivoire, Sénégal, France & au-delà",
  mission:
    "Active ton Superpouvoir est un mouvement dédié à aider les jeunes Africains à découvrir leurs talents uniques, activer leur mission de vie et bâtir leur avenir — avec courage et authenticité.",
  fondation:
    "Fondé par Nadine Zoro, autrice et coach de vie, le mouvement touche déjà plus de 12 000 héros en Côte d’Ivoire, au Sénégal, en France et au-delà.",
  presse: ["RTI", "Fraternité Matin", "BBC Afrique", "Jeune Afrique", "TV5 Monde"],
};

/** Les 4 outils au cœur de la méthode du livre. */
export const methode = [
  {
    num: "01",
    nom: "Radar Personnel",
    fil: "#321044",
    description: "Observe tes forces, tes envies et les sujets qui te mettent en mouvement.",
  },
  {
    num: "02",
    nom: "Ikigai",
    fil: "#321044",
    description: "La zone d’impact où se croisent ce que tu aimes, ce que tu fais bien et ce qui peut te faire vivre.",
  },
  {
    num: "03",
    nom: "Méthode CAP",
    fil: "#321044",
    description: "Clair – Action – Preuve : transforme une idée en mouvement concret.",
  },
  {
    num: "04",
    nom: "Chemin du Héros",
    fil: "#321044",
    description: "Relie tes talents à une mission qui a du sens pour toi.",
  },
];

export type Produit = {
  slug: string;
  nom: string;
  type: string;
  format: string;
  fcfa: number;
  eur: number;
  badge?: string;
  fil: string;
  description: string;
  ages: string[];
  avis: { nom: string; date: string; note: number; texte: string }[];
};

export const produits: Produit[] = [
  {
    slug: "active-ton-superpouvoir-livre",
    nom: "Active ton superpouvoir!",
    type: "Livre",
    format: "Physique",
    fcfa: 10000,
    eur: 15,
    badge: "Bestseller",
    fil: "#321044",
    description:
      "Le guide fondateur pour découvrir ton superpouvoir unique et bâtir ta mission de vie.",
    ages: ["Mini-Héros (8-12 ans)", "Explorateur (13-16 ans)", "Bâtisseur (17-22 ans)", "Mentor (23+ ans)"],
    avis: [
      { nom: "Amina K.", date: "15 mars 2026", note: 5, texte: "Ce livre a complètement changé ma façon de voir mes talents. Je le recommande à tous les jeunes !" },
      { nom: "Youssouf M.", date: "10 mars 2026", note: 4, texte: "Très inspirant, les exercices sont concrets et faciles à suivre. J’aurais aimé plus d’exemples." },
      { nom: "Fatou D.", date: "28 février 2026", note: 5, texte: "Ma fille de 14 ans l’a dévoré en une semaine. Elle a déjà commencé son Ikigai !" },
    ],
  },
  {
    slug: "mon-journal-de-superpouvoir",
    nom: "Mon Journal de Superpouvoir",
    type: "Workbook",
    format: "Physique + Digital",
    fcfa: 7000,
    eur: 10,
    fil: "#321044",
    description:
      "Le workbook compagnon avec tous les exercices pour activer ton superpouvoir au quotidien.",
    ages: ["Explorateur (13-16 ans)", "Bâtisseur (17-22 ans)", "Mentor (23+ ans)"],
    avis: [
      { nom: "Ibrahim T.", date: "20 mars 2026", note: 5, texte: "Le parfait compagnon du livre. Les exercices sont bien structurés et motivants." },
    ],
  },
  {
    slug: "30-cartes-anti-doutes",
    nom: "30 Cartes Anti-Doutes",
    type: "Cartes",
    format: "Physique + Digital",
    fcfa: 6000,
    eur: 9,
    fil: "#321044",
    description:
      "30 cartes d'affirmation pour combattre le doute et activer ta confiance.",
    ages: ["Explorateur (13-16 ans)", "Bâtisseur (17-22 ans)", "Mentor (23+ ans)"],
    avis: [],
  },
  {
    slug: "livre-de-rituels-60-jours",
    nom: "Livre de Rituels 60 Jours",
    type: "Rituels",
    format: "Physique",
    fcfa: 9000,
    eur: 13,
    badge: "Nouveau",
    fil: "#321044",
    description: "60 jours de rituels quotidiens pour ancrer ton superpouvoir dans ta vie.",
    ages: ["Bâtisseur (17-22 ans)", "Mentor (23+ ans)"],
    avis: [],
  },
  {
    slug: "poster-ikigai-a3",
    nom: "Poster Ikigai A3",
    type: "Poster",
    format: "Physique",
    fcfa: 3000,
    eur: 5,
    fil: "#321044",
    description: "Poster A3 à remplir pour trouver ta zone d’impact — ton Ikigai personnel.",
    ages: ["Explorateur (13-16 ans)", "Bâtisseur (17-22 ans)", "Mentor (23+ ans)"],
    avis: [],
  },
];

export const kit = {
  nom: "Le Kit Complet du Héros",
  contenu: "Livre + Journal + Livre de Rituels + 30 Cartes Anti-doutes",
  fcfa: 14900,
  barre: 18500,
};

export const offres = [
  {
    nom: "Kit Digital",
    description: "Tout le nécessaire en format numérique pour commencer ton voyage : le Workbook PDF interactif, les 30 Cartes Anti-Doutes en PDF imprimable, et le Planificateur 90 Jours. Livraison instantanée par email.",
    contenu: ["Mon Journal de Superpouvoir", "30 Cartes Anti-Doutes"],
    avant: 13000,
    fcfa: 4000,
    eur: 7,
    remise: "-25%",
  },
  {
    nom: "Kit Complet Digital + Physique",
    description: "Le meilleur des deux mondes : reçois le carnet broché A5, le deck de cartes physique, le poster Ikigai + tous les PDFs digitaux. Le kit ultime pour transformer ta lecture en action.",
    contenu: ["Mon Journal de Superpouvoir", "30 Cartes Anti-Doutes", "Poster Ikigai A3"],
    avant: 16000,
    fcfa: 13000,
    eur: 20,
    remise: "-19%",
  },
  {
    nom: "Box Cadeau Premium",
    description: "Le cadeau parfait pour un jeune héros ! Tous les produits physiques dans un magnifique coffret brandé : livre, carnet, cartes, poster et rituels. Idéal pour anniversaires, rentrées scolaires et graduations. Inclut un message personnalisé.",
    contenu: ["Mon Journal de Superpouvoir", "30 Cartes Anti-Doutes", "Poster Ikigai A3", "Livre de Rituels 60 Jours"],
    avant: 25000,
    fcfa: 22000,
    eur: 35,
    remise: "-12%",
  },
  {
    nom: "Livre + Kit Complet",
    description: "L’expérience complète Active ton Superpouvoir : le livre fondateur + tous les outils d’accompagnement (physique et digital). Le parcours complet de transformation, du premier chapitre au 60e jour de rituels.",
    contenu: ["Active ton superpouvoir!", "Mon Journal de Superpouvoir", "30 Cartes Anti-Doutes", "Poster Ikigai A3", "Livre de Rituels 60 Jours"],
    avant: 35000,
    fcfa: 30000,
    eur: 45,
    remise: "-14%",
  },
];

export const kitProduit: Produit = {
  slug: "kit-complet-du-heros",
  nom: kit.nom,
  type: "Kit",
  format: "Physique",
  fcfa: kit.fcfa,
  eur: 32,
  badge: "Offre spéciale",
  fil: "#321044",
  description: "Le coffret complet pour passer de la découverte à la pratique : le livre, le journal, le livre de rituels et les 30 cartes Anti-doutes.",
  ages: ["Explorateur (13-16 ans)", "Bâtisseur (17-22 ans)", "Mentor (23+ ans)"],
  avis: [],
};

export type Etape = {
  id: string;
  age: string;
  nom: string;
  accroche: string;
  tags: string[];
  fil: string;
  texte: string;
  faq: { q: string; r: string }[];
};

export const etapes: Etape[] = [
  {
    id: "explorateur",
    age: "13 – 16 ans",
    nom: "L’Explorateur",
    accroche: "Tu te cherches. Tu doutes parfois. Et c’est exactement là que tout commence.",
    tags: ["Identité", "Passions", "Confiance"],
    fil: "#321044",
    texte:
      "À 13-16 ans, tu es en pleine découverte de toi-même. Tu te demandes qui tu es, ce qui te passionne, ce que tu veux faire de ta vie. C’est normal — et c’est une force. Ce parcours t’aide à transformer tes doutes en superpouvoir.",
    faq: [
      { q: "Je ne sais pas ce que je veux faire plus tard, c’est grave ?", r: "Pas du tout. À 13-16 ans, ne pas savoir est la position de départ de tous les héros. Ce parcours est fait pour t’aider à trouver des pistes, pas des certitudes." },
      { q: "J’ai plusieurs passions, comment choisir ?", r: "Tu n’as pas à choisir maintenant. Le quiz te permet de voir quel profil de héros tu es — et ton profil peut combiner plusieurs passions en une mission unique." },
      { q: "Est-ce que ce programme est adapté à mon âge ?", r: "Oui, entièrement. Le livre, le journal et les cartes sont écrits dans un langage accessible, avec des exemples concrets pour les 13-16 ans." },
    ],
  },
  {
    id: "batisseur",
    age: "17 – 22 ans",
    nom: "Le Bâtisseur",
    accroche: "Tu construis ton avenir. Tu as des talents à affiner et des choix à faire.",
    tags: ["Orientation", "Talents", "Projets"],
    fil: "#321044",
    texte:
      "À 17-22 ans, tu es face à des choix concrets : orientation, études, premier emploi, projets. Tu as des talents — il est temps de les affiner et de les mettre au service d’une mission claire. Ce parcours t’aide à passer de l’idée à l’action.",
    faq: [
      { q: "J’ai raté mon orientation, est-ce que c’est trop tard ?", r: "Non. Beaucoup de héros ont changé de cap à 18, 20 ou 22 ans. Ce parcours t’aide à recalibrer ta direction à partir de tes vrais talents, pas des choix d’avant." },
      { q: "Comment concilier mes passions et un métier qui paie ?", r: "C’est exactement la question du parcours Bâtisseur. L’outil Ikigai dans le journal t’aide à trouver la zone où tes talents, ta passion et le marché se croisent." },
      { q: "Je suis étudiant, combien de temps ça prend par jour ?", r: "Le défi 30 jours demande 15-20 minutes par jour. Le journal peut se faire le week-end. C’est conçu pour s’intégrer dans un emploi du temps chargé." },
    ],
  },
  {
    id: "createur",
    age: "23 – 35 ans",
    nom: "Le Créateur",
    accroche: "Tu crées, tu innoves, tu impactes. Il est temps d’aligner carrière et mission.",
    tags: ["Carrière", "Leadership", "Impact"],
    fil: "#321044",
    texte:
      "À 23-35 ans, tu es dans ta phase de création. Tu travailles, tu entreprends, tu construis. Mais peut-être que quelque chose ne s’aligne pas encore — entre ce que tu fais et ce que tu es vraiment. Ce parcours t’aide à trouver cette cohérence.",
    faq: [
      { q: "J’ai un emploi stable mais je ne me sens pas à ma place, que faire ?", r: "C’est le signal d’alarme le plus fréquent à 23-35 ans. Ce parcours t’aide à clarifier ce qui te manque et à construire un plan de transition basé sur tes vrais talents." },
      { q: "Je veux entreprendre mais j’ai peur. Par où commencer ?", r: "Par ton profil de héros. Le quiz identifie ton archétype entrepreneurial — Créateur, Leader ou Connecteur — et te donne des pistes concrètes adaptées à ton style naturel." },
      { q: "Est-ce que c’est fait pour les entrepreneurs seulement ?", r: "Non. Que tu sois salarié, freelance ou étudiant en master, ce parcours t’aide à aligner ton rôle actuel avec ta mission profonde." },
    ],
  },
  {
    id: "reconnecteur",
    age: "35 ans et +",
    nom: "Le Reconnecteur",
    accroche: "Tu te reconnectes. Tes talents cachés attendent d’être réactivés.",
    tags: ["Mission", "Reconversion", "Sens"],
    fil: "#321044",
    texte:
      "À 35 ans et plus, tu as accumulé une expérience précieuse. Mais parfois, quelque chose s’est perdu en chemin — un élan, un sens, une mission. Ce parcours t’aide à te reconnecter à qui tu es vraiment et à réactiver ce que la vie n’a pas éteint.",
    faq: [
      { q: "Est-ce que c’est trop tard pour changer de vie à 40 ans ?", r: "Non. Le Reconnecteur est précisément l’étape où les changements les plus profonds se produisent — parce que tu as la maturité pour les tenir dans la durée." },
      { q: "J’ai l’impression que j’ai gaspillé mes talents. Comment avancer ?", r: "Aucun talent n’est gaspillé — il est simplement en attente. Le quiz te permet de les identifier à nouveau, et le parcours te donne les outils pour les réactiver concrètement." },
      { q: "Ce programme est-il adapté aux parents ou aux professionnels chevronnés ?", r: "Entièrement. Beaucoup de Reconnecteurs sont des parents, des managers ou des professionnels qui veulent retrouver du sens dans ce qu’ils font au quotidien." },
    ],
  },
];

export const defisMeta = [
  {
    id: "7",
    jours: 7,
    titre: "Révèle ton superpouvoir",
    offre: "Gratuit",
    fil: "#321044",
    texte:
      "7 jours pour découvrir qui tu es vraiment. Chaque jour, une mission simple et puissante pour révéler ton superpouvoir unique. Gratuit et ouvert à tous !",
    phases: [] as string[],
    stats: [["7", "jours"], ["7", "missions"], ["0€", "gratuit"]],
  },
  {
    id: "30",
    jours: 30,
    titre: "Construis ta compétence",
    offre: "Premium",
    fil: "#321044",
    texte:
      "30 jours de micro-actions quotidiennes pour transformer tes talents en compétences. 4 semaines thématiques : Identité, Talent, Courage, Vision.",
    phases: ["Identité", "Talent", "Courage", "Vision"],
    stats: [["30", "jours"], ["30", "missions"], ["4", "phases"]],
  },
  {
    id: "60",
    jours: 60,
    titre: "Active ton superpouvoir",
    offre: "Premium",
    fil: "#321044",
    texte:
      "Le parcours complet de transformation. 60 jours de rituels quotidiens, 4 phases de 15 jours pour devenir le héros de ta propre histoire. Certificat final inclus.",
    phases: ["Réveil — Qui suis-je ?", "Construction — Mes talents", "Courage — Mes défis", "Vision — Mon futur"],
    stats: [["60", "jours"], ["60", "missions"], ["4", "phases"]],
  },
];

export const hashtags = [
  { tag: "#MonSuperpouvoir", titre: "Mon Superpouvoir", texte: "Partage une chose que tu fais naturellement, sans effort, et qui aide les autres." },
  { tag: "#LettrePourMoiFutur", titre: "Lettre pour moi futur", texte: "Écris une lettre à ton toi du futur. Publique ou privée, c’est toi qui choisis." },
  { tag: "#MaMissionEnUnMot", titre: "Ma mission en un mot", texte: "Résume ta mission de vie en un seul mot. Un mot qui dit tout." },
  { tag: "#MonIkigai", titre: "Mon Ikigai", texte: "Partage ton diagramme Ikigai : ce que tu aimes, ce que tu fais bien, ce dont le monde a besoin, ce pour quoi on te paierait." },
];

export const temoignages = [
  { initiales: "AK", nom: "Aminata K.", detail: "15 ans · Abidjan, Côte d’Ivoire", fil: "#321044", texte: "Ce livre m’a aidée à comprendre que mon talent pour écouter les gens n’était pas une faiblesse. C’est maintenant ma plus grande force. Je veux devenir psychologue." },
  { initiales: "KM", nom: "Kofi M.", detail: "24 ans · Dakar, Sénégal", fil: "#321044", texte: "J’avais peur de me lancer dans l’entrepreneuriat. Le défi 30 jours m’a donné la structure et la confiance pour ouvrir ma boutique. Je n’aurais pas cru ça possible." },
  { initiales: "BD", nom: "Prof. Bamba D.", detail: "Enseignante · Bouaké", fil: "#321044", texte: "J’ai utilisé ce programme avec mes élèves de Terminale. En un trimestre, leur rapport à eux-mêmes a complètement changé. Certains ont trouvé leur voie pour la première fois." },
];

export const temoignagesCommunaute = [
  { initiales: "KA", nom: "Kofi Asante", detail: "19 ans, Douala", profil: "Explorateur", fil: "#321044", texte: "Avant de découvrir mon profil Explorateur, je me sentais perdu. On me disait que j’étais instable parce que je voulais tout essayer. Maintenant je sais que ma curiosité est ma force. J’ai lancé un podcast sur les métiers méconnus en Afrique et ça cartonne !" },
  { initiales: "AC", nom: "Aisha Camara", detail: "28 ans, Paris", profil: "Guérisseur", fil: "#321044", texte: "Le quiz m’a révélée Guérisseur. Au début je n’ai pas compris, puis j’ai réalisé que j’ai toujours été celle vers qui les gens viennent quand ça ne va pas. J’ai décidé de me former en coaching et j’accompagne maintenant des jeunes de la diaspora dans leur quête d’identité." },
  { initiales: "MS", nom: "Mariam Sylla", detail: "16 ans, Dakar", profil: "Leader", fil: "#321044", texte: "Je suis la plus jeune derrière le mouvement, et fière de l’être ! Mon profil Leader m’a donné confiance pour créer le club « Héros du Lycée » dans mon établissement." },
];

export const herosDuMois = {
  nom: "Fatoumata Diallo",
  initiales: "FD",
  ville: "Abidjan",
  profil: "Connecteur",
  fil: "#321044",
  periode: "Héros de Mars 2026",
  recit:
    "À 24 ans, Fatoumata a quitté son poste stable dans une banque pour lancer « Pont d’Or », une plateforme qui connecte les artisans ivoiriens avec les marchés internationaux. Sa famille ne comprenait pas. « On m’a dit que j’étais folle de quitter un CDI », raconte-t-elle. Aujourd’hui, Pont d’Or emploie 8 personnes et a permis à 120 artisans de tripler leurs revenus.",
  secret:
    "« J’ai compris que mon talent n’était pas de fabriquer des choses, mais de créer des liens entre les gens. Je suis un pont vivant. » Fatoumata incarne le profil Connecteur à la perfection : son réseau est son superpouvoir.",
  interview: [
    { q: "Quel conseil donnerais-tu à un jeune qui hésite à suivre sa passion ?", r: "N’attends pas d’être prêt. J’ai lancé Pont d’Or avec un téléphone et un carnet. La perfection est l’ennemie du début." },
    { q: "Comment as-tu géré la pression familiale ?", r: "J’ai invité ma mère à rencontrer mes premiers artisans. Quand elle a vu leurs yeux briller, elle a compris. Parfois, il faut montrer au lieu d’expliquer." },
    { q: "Ta routine quotidienne ?", r: "Chaque matin, j’écris trois connexions que je veux créer dans la journée. Pas des tâches — des liens humains." },
  ],
};

export const communauteEspaces = [
  { id: "carte", titre: "Carte des Héros", texte: "Découvre où se trouvent les héros du mouvement à travers l’Afrique et le monde." },
  { id: "heros", titre: "Héros du Mois", texte: "Chaque mois, un membre de la communauté est mis en lumière pour son parcours inspirant." },
  { id: "temoignages", titre: "Témoignages", texte: "Lis les histoires des héros qui ont activé leur superpouvoir et partage la tienne." },
  { id: "forum", titre: "Forum", texte: "Échange avec d’autres héros par tranche d’âge ou par thème : talent, carrière, confiance…" },
  { id: "mentors", titre: "Mentors", texte: "Trouve un mentor certifié pour t’accompagner dans ton parcours héroïque." },
];

/** Ressources gratuites complémentaires. */
export const ressourcesGratuites = [
  { titre: 'Quiz "Quel est ton superpouvoir ?"', texte: "La version PDF du quiz avec un guide de scoring. Découvre ton profil de héros !", etat: "Télécharger (PDF) ↓" },
  { titre: "Premier chapitre gratuit", texte: "Lis le premier chapitre du livre gratuitement et découvre les bases de la méthode.", etat: "Télécharger (PDF) ↓" },
];

export const affirmations = [
  "Je mérite la joie, l’abondance et la paix.",
  "Le courage n’est pas l’absence de peur. C’est faire un pas malgré elle.",
  "Ce qui te vient facilement a de la valeur.",
  "Ne pas savoir encore n’est pas un échec. C’est le début de l’exploration.",
  "Ton rêve a été mis en toi exactement parce que tu es capable de le porter.",
  "La constance bat la vitesse.",
];

export const navigation = [
  { href: "#/quiz", label: "Découvre-toi" },
  { href: "#/defis", label: "Mes défis" },
  { href: "#/le-livre", label: "Le livre" },
  { href: "#/communaute", label: "Communauté" },
  { href: "#/cartes", label: "Cartes anti-doutes" },
  { href: "#/bibliotheque", label: "Bibliothèque" },
  { href: "#/a-propos", label: "Qui suis-je ?" },
];

export const fcfa = (n: number) => n.toLocaleString("fr-FR").replace(/\u202f|\u00a0/g, " ") + " FCFA";
