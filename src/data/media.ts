/**
 * Ressources visuelles — v2 :
 * 1. Série d'illustrations dédiée (public/images/, nommée par section du site) — source principale.
 * 2. Pages/motifs extraits du livre (public/book/) pour les textures de chapitre et les diagrammes,
 *    quand la nouvelle série n'a pas d'équivalent.
 * Aucune photo stock externe.
 */
export const couverture = {
  src: "/book/cover.jpg",
  alt: "Couverture du livre Active ton Superpouvoir ! de Nadine Zoro",
  largeur: 1000,
  hauteur: 1440,
};

export type Photo = {
  src: string;
  alt: string;
  credit: string;
  creditUrl: string;
  legende: string;
  largeur: number;
  hauteur: number;
  pos?: string;
};

/** Illustration de la nouvelle série (public/images/*.webp). */
const scene = (src: string, alt: string, legende: string, pos = "50% 50%"): Photo => ({
  src: `/images/${src}`,
  alt,
  credit: "Illustrations Active ton Superpouvoir",
  creditUrl: "",
  legende,
  largeur: 1536,
  hauteur: 1536,
  pos,
});

/** Portrait officiel de Nadine Zoro, repris du site DigiFemmes Côte d'Ivoire. */
const officiel = (src: string, alt: string, legende: string, pos = "50% 50%"): Photo => ({
  src: `/book/${src}`,
  alt,
  credit: "Portrait officiel — DigiFemmes Côte d’Ivoire",
  creditUrl: "https://digifemmes.com/a-propos/equipe",
  legende,
  largeur: 1080,
  hauteur: 1080,
  pos,
});

/** Page ou motif extrait du livre (public/book/*.jpg) — textures de chapitre, diagrammes. */
const livre = (src: string, alt: string, legende: string, pos = "50% 50%"): Photo => ({
  src: `/book/${src}`,
  alt,
  credit: "Livre « Active ton Superpouvoir ! »",
  creditUrl: "",
  legende,
  largeur: 1400,
  hauteur: 1810,
  pos,
});

/** Illustrations et textures. */
export const photos = {
  // Héroïne générique (poses de secours réutilisées à plusieurs endroits)
  heroMonde: scene("19-accueil-scene-complete.webp", "Illustration : l'héroïne dans la scène complète de l'accueil.", "Ton superpouvoir, déployé dans le monde."),
  marche: scene("19-accueil-scene-complete.webp", "Illustration : l'héroïne dans la scène complète de l'accueil.", "Un pas après l'autre, le parcours continue."),
  pointe: scene("01-accueil-heroine.webp", "Illustration : l'héroïne de l'accueil, confiante.", "Et si c'était toi ?"),
  profilCreateur: scene("03-profil-createur.webp", "Illustration : profil de l'archétype Créateur.", "Ton profil de héros, révélé."),
  bureau: livre("illus-bureau.jpg", "Illustration du livre : une jeune héroïne écrit à son bureau, entourée de ses outils.", "Chaque chapitre se travaille au bureau, carnet ouvert."),
  ikigai: livre("illus-ikigai.jpg", "Illustration du livre : schéma et personnage autour de la notion d'Ikigai.", "L'Ikigai : là où tes talents rencontrent ta mission."),
  cheminHeros: livre("illus-chemin-heros.jpg", "Schéma du livre : trois silhouettes avancent sur un chemin jusqu'au sommet.", "Le Chemin du Héros : d'une étape à l'autre, jusqu'au sommet."),
  fondTalent: livre("fond-violet-talent.jpg", "Page du livre « Développe ton talent : de superpouvoir à compétence ».", "Chapitre IV — Développe ton talent."),
  fondDoutes: livre("fond-sarcelle-doutes.jpg", "Page du livre « Surmonter les obstacles et les doutes ».", "Chapitre V — Surmonter les obstacles et les doutes."),
  fondAligner: livre("fond-or-aligner.jpg", "Page du livre « Aligner talents et aspirations ».", "Chapitre VII — Aligner talents et aspirations."),
  fondCap: livre("fond-marine-cap.jpg", "Page du livre « Garder le cap ».", "Chapitre VIII — Garder le cap."),
  fondPartie4: livre("fond-corail-partie4.jpg", "Page du livre « Vivre pleinement avec ses superpouvoirs ».", "Partie 4 — Vivre pleinement avec ses superpouvoirs."),
  motifA: livre("motif-violet-a.jpg", "Motif du livre : icônes dessinées à la main sur fond indigo.", "Le motif qui ouvre chaque chapitre."),
  motifB: livre("motif-violet-b.jpg", "Motif du livre : icônes dessinées à la main sur fond violet.", "Le motif qui ouvre chaque chapitre."),
  nadine: officiel("nadine-zoro-digifemmes.jpg", "Photo de Nadine Zoro, autrice d'Active ton Superpouvoir !", "Nadine Zoro, autrice d'Active ton Superpouvoir !", "50% 15%"),

  /* ——— En-têtes de pages ——— */
  livreLecture: scene("11-livre-mockup.webp", "Mise en situation du livre Active ton Superpouvoir.", "Lire, c'est d'abord s'arrêter."),
  bibliotheque: scene("18-bibliotheque-pile-livres.webp", "Illustration : pile de livres et ressources de la bibliothèque.", "Une bibliothèque se parcourt par âge, par envie, par moment de vie."),
  boutique: scene("05-livre-couverture.webp", "Couverture illustrée du livre.", "Cinq pièces, chacune avec sa fonction dans la méthode."),
  cartesEntete: scene("09-cartes-antidoutes-eventail.webp", "Illustration : éventail des 30 cartes anti-doutes.", "Une carte se tire à la main, au moment précis où le doute parle."),
  defisEntete: scene("06-parcours-batisseur.webp", "Illustration : l'archétype Bâtisseur, en action.", "Sept, trente ou soixante jours : un pas par jour suffit."),
  quizEntete: scene("02-quiz-heroine.webp", "Illustration : l'héroïne du quiz.", "Dix questions, trois minutes, aucune mauvaise réponse."),
  apropos: officiel("nadine-zoro-digifemmes.jpg", "Photo de Nadine Zoro, entrepreneure sociale et autrice.", "Nadine Zoro, entrepreneure sociale et autrice.", "50% 15%"),
  contact: livre("illus-pointe.jpg", "Illustration du livre : l'héroïne pointe du doigt.", "Une seule adresse, et une vraie personne derrière."),
  ecoles: scene("04-parcours-explorateur.webp", "Illustration : l'archétype Explorateur.", "Programmes écoles : le livre et le défi de 7 jours, utilisés en classe."),
  auteure: officiel("nadine-zoro-digifemmes.jpg", "Photo de Nadine Zoro, autrice d'Active ton Superpouvoir !", "Nadine Zoro, autrice d'Active ton Superpouvoir !", "50% 15%"),

  /* ——— Accueil ——— */
  questionQuiz: scene("02-quiz-heroine.webp", "Illustration : l'héroïne du quiz.", "Prendre trois minutes pour se poser la bonne question."),
  doutesCartes: scene("10-carte-antidoute-face.webp", "Illustration : recto d'une carte anti-doute.", "Tirer une carte, lire le doute à voix haute, la retourner."),
  rituelMatin: scene("19-accueil-scene-complete.webp", "Illustration : la scène complète de l'accueil.", "Chaque matin, un pas de plus."),
  etoffes: livre("motif-violet-a.jpg", "Motif du livre sur fond indigo.", "Le fil du récit, tissé chapitre après chapitre."),
  citation: officiel("nadine-zoro-digifemmes.jpg", "Photo de Nadine Zoro, autrice d'Active ton Superpouvoir !", "Une question à laquelle toi seul·e réponds.", "50% 15%"),
  ressourceQuiz: scene("16-ressource-objectifs.webp", "Illustration : ressource « fixer ses objectifs ».", "Le quiz se passe sans inscription."),
  ressourceChapitre: scene("14-ressource-journal.webp", "Illustration : le journal de superpouvoir.", "Le premier chapitre ouvre la méthode."),
  ressourceAffirmations: scene("15-ressource-affirmations.webp", "Illustration : ressource « affirmations ».", "Des affirmations à lire chaque matin."),
  ressourceProjets: scene("17-ressource-projets.webp", "Illustration : ressource « passer à l'action ».", "Des idées de projets pour passer à l'action."),

  /* ——— Communauté ——— */
  communaute: scene("12-communaute-groupe.webp", "Illustration : groupe de la communauté.", "On avance mieux ensemble."),
  partage: scene("12-communaute-groupe.webp", "Illustration : groupe de la communauté.", "Ton histoire peut ouvrir une porte."),

  /* ——— Alias ponctuels ——— */
  tissage: livre("motif-violet-a.jpg", "Motif du livre sur fond indigo.", "Les profils du mouvement se tissent ensemble, comme ce motif."),
  metier: livre("motif-violet-b.jpg", "Motif du livre sur fond violet.", "La méthode se travaille chapitre après chapitre."),
  journal: scene("14-ressource-journal.webp", "Illustration : le journal de superpouvoir.", "Le Journal de Superpouvoir : passer de la lecture à l'exercice écrit."),
  dakar: livre("motif-violet-b.jpg", "Motif du livre sur fond violet.", "Dakar — l'une des villes où le mouvement est actif."),
  abidjan: livre("motif-violet-a.jpg", "Motif du livre sur fond indigo.", "Abidjan — ville d'origine du mouvement."),
} satisfies Record<string, Photo>;

/** Une image par étape de vie : parcours, bibliothèque, accueil — les 4 archétypes de la série dédiée. */
export const etapePhotos: Record<string, Photo> = {
  explorateur: scene("04-parcours-explorateur.webp", "Illustration : l'archétype Explorateur.", "13–16 ans : se chercher, et commencer à se trouver."),
  batisseur: scene("06-parcours-batisseur.webp", "Illustration : l'archétype Bâtisseur.", "17–22 ans : choisir une direction, bâtir ses premiers projets."),
  createur: scene("07-parcours-createur.webp", "Illustration : l'archétype Créateur.", "23–35 ans : aligner ce que l'on fait et ce que l'on est."),
  reconnecteur: scene("08-parcours-reconnecteur.webp", "Illustration : l'archétype Reconnecteur.", "35 ans et plus : réactiver ce que la vie n'a pas éteint."),
};

/** Les quatre outils de la méthode. */
export const methodePhotos: Record<string, Photo> = {
  "01": livre("illus-ikigai.jpg", "Illustration du livre autour de l'Ikigai.", "Radar Personnel : observer ses forces."),
  "02": livre("illus-ikigai.jpg", "Illustration du livre autour de l'Ikigai.", "Ikigai : faire se croiser les envies et les besoins."),
  "03": scene("16-ressource-objectifs.webp", "Illustration : ressource « fixer ses objectifs ».", "Méthode CAP : clair, action, preuve."),
  "04": livre("illus-chemin-heros.jpg", "Schéma du livre : le Chemin du Héros.", "Chemin du Héros : relier ses talents à une mission."),
};

/** Une image d'ambiance par pièce de la boutique. */
export const ambianceProduit: Record<string, Photo> = {
  "active-ton-superpouvoir-livre": livre("cover.jpg", "Couverture du livre Active ton Superpouvoir !", "Le livre fondateur."),
  "mon-journal-de-superpouvoir": scene("14-ressource-journal.webp", "Illustration : le journal de superpouvoir.", "Le journal : passer de la lecture à l'exercice écrit."),
  "30-cartes-anti-doutes": scene("10-carte-antidoute-face.webp", "Illustration : recto d'une carte anti-doute.", "Le deck se tire à la main, chaque matin."),
  "livre-de-rituels-60-jours": scene("08-parcours-reconnecteur.webp", "Illustration : l'archétype Reconnecteur.", "Soixante matins, un rituel après l'autre."),
  "poster-ikigai-a3": livre("illus-ikigai.jpg", "Illustration du livre autour de l'Ikigai.", "Le poster Ikigai s'accroche au-dessus du bureau."),
  "kit-complet-du-heros": scene("19-accueil-scene-complete.webp", "Illustration : la scène complète de l'accueil.", "Le kit : tout ce qu'il faut pour commencer."),
};

/** Les trois durées de défi. */
export const defiPhotos: Record<string, Photo> = {
  "7": scene("04-parcours-explorateur.webp", "Illustration : l'archétype Explorateur.", "7 jours pour se révéler."),
  "30": scene("06-parcours-batisseur.webp", "Illustration : l'archétype Bâtisseur.", "30 jours pour construire une compétence."),
  "60": scene("08-parcours-reconnecteur.webp", "Illustration : l'archétype Reconnecteur.", "60 jours, jusqu'au sommet."),
};

/** Les quatre défis communautaires. */
export const hashtagPhotos: Record<string, Photo> = {
  "#MonSuperpouvoir": scene("01-accueil-heroine.webp", "Illustration : l'héroïne de l'accueil.", "Ce que tu fais naturellement, et qui aide les autres."),
  "#LettrePourMoiFutur": scene("14-ressource-journal.webp", "Illustration : le journal de superpouvoir.", "Écrire à son toi du futur."),
  "#MaMissionEnUnMot": livre("illus-chemin-heros.jpg", "Schéma du livre : le Chemin du Héros.", "Un seul mot, qui dit tout."),
  "#MonIkigai": livre("illus-ikigai.jpg", "Illustration du livre autour de l'Ikigai.", "Ce que tu aimes, ce que tu fais bien."),
};

/** Photographies d'illustration des voix du mouvement. */
export const voixPhotos: Photo[] = [
  scene("01-accueil-heroine.webp", "Illustration : l'héroïne de l'accueil.", "Illustration : une confiance qui s'affirme."),
  scene("03-profil-createur.webp", "Illustration : profil de l'archétype Créateur.", "Illustration : un profil de héros révélé."),
  scene("19-accueil-scene-complete.webp", "Illustration : la scène complète de l'accueil.", "Illustration : un pas après l'autre."),
];

/** Photographie d'une ville où le mouvement est actif. */
const ville = (src: string, alt: string, legende: string, pos = "50% 50%"): Photo => ({
  src: `/images/villes/${src}`,
  alt,
  credit: "",
  creditUrl: "",
  legende,
  largeur: 1536,
  hauteur: 1024,
  pos,
});

/** Villes citées dans les récits. */
export const villePhotos: Record<string, Photo> = {
  Abidjan: ville("abidjan.webp", "Vue aérienne du Plateau et de la lagune Ébrié, à Abidjan.", "Abidjan — ville d'origine du mouvement.", "50% 40%"),
  Dakar: ville("dakar.webp", "Vue de la Corniche de Dakar et du Monument de la Renaissance africaine.", "Dakar.", "50% 35%"),
  Paris: ville("paris.webp", "Vue de la Tour Eiffel depuis les toits parisiens.", "Paris.", "50% 35%"),
  Douala: ville("douala.webp", "Vue d'une avenue animée du centre-ville de Douala.", "Douala.", "50% 45%"),
  Bouaké: ville("bouake.webp", "Vue d'une rue de Bouaké avec sa mosquée.", "Bouaké.", "50% 35%"),
};

/** Les espaces de la communauté. */
export const espacePhotos: Record<string, Photo> = {
  carte: livre("illus-pointe.jpg", "Illustration du livre : l'héroïne pointe du doigt.", "Carte des héros."),
  heros: scene("03-profil-createur.webp", "Illustration : profil de l'archétype Créateur.", "Héros du mois."),
  temoignages: scene("12-communaute-groupe.webp", "Illustration : groupe de la communauté.", "Témoignages."),
  forum: livre("illus-bureau.jpg", "Illustration du livre : travail au bureau.", "Forum."),
  mentors: livre("illus-chemin-heros.jpg", "Schéma du livre : le Chemin du Héros.", "Mentors.", "50% 15%"),
};

/** Photos de fond des grandes sections : posées en teinte aplat (fusion), jamais en dégradé. */
export const fonds = {
  etabli: photos.bureau,
  etapes: photos.cheminHeros,
  doutes: photos.fondDoutes,
  voix: photos.pointe,
  rituel: photos.marche,
  kit: photos.heroMonde,
  pied: photos.fondCap,
  villes: photos.motifA,
  espaces: photos.motifB,
};

export const mentionPhotos =
  "Illustrations dédiées d'Active ton Superpouvoir, et pages/motifs du livre pour les textures de chapitre.";
