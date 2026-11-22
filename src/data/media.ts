/**
 * Ressources visuelles — uniquement deux sources :
 * 1. Illustrations extraites du livre « Active ton Superpouvoir ! » (PDF, 144 pages).
 * 2. Visuels du design system fourni (captures de maquette), pour les éléments absents du livre.
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

/** Illustrations et textures issues du livre. */
export const photos = {
  bureau: livre("illus-bureau.jpg", "Illustration du livre : une jeune héroïne écrit à son bureau, entourée de ses outils.", "Chaque chapitre se travaille au bureau, carnet ouvert."),
  heroMonde: livre("illus-heros-monde.jpg", "Illustration du livre : la jeune héroïne se tient devant le monde, prête à agir.", "Ton superpouvoir, déployé dans le monde."),
  ikigai: livre("illus-ikigai.jpg", "Illustration du livre : schéma et personnage autour de la notion d'Ikigai.", "L'Ikigai : là où tes talents rencontrent ta mission."),
  marche: livre("illus-marche.jpg", "Illustration du livre : l'héroïne marche, sac au dos et cape au vent.", "Un pas après l'autre, le parcours continue."),
  pointe: livre("illus-pointe.jpg", "Illustration du livre : l'héroïne pointe du doigt, confiante.", "Et si c'était toi ?"),
  cheminHeros: livre("illus-chemin-heros.jpg", "Schéma du livre : trois silhouettes avancent sur un chemin jusqu'au sommet.", "Le Chemin du Héros : d'une étape à l'autre, jusqu'au sommet."),
  fondTalent: livre("fond-violet-talent.jpg", "Page du livre « Développe ton talent : de superpouvoir à compétence ».", "Chapitre IV — Développe ton talent."),
  fondDoutes: livre("fond-sarcelle-doutes.jpg", "Page du livre « Surmonter les obstacles et les doutes ».", "Chapitre V — Surmonter les obstacles et les doutes."),
  fondAligner: livre("fond-or-aligner.jpg", "Page du livre « Aligner talents et aspirations ».", "Chapitre VII — Aligner talents et aspirations."),
  fondCap: livre("fond-marine-cap.jpg", "Page du livre « Garder le cap ».", "Chapitre VIII — Garder le cap."),
  fondPartie4: livre("fond-corail-partie4.jpg", "Page du livre « Vivre pleinement avec ses superpouvoirs ».", "Partie 4 — Vivre pleinement avec ses superpouvoirs."),
  motifA: livre("motif-violet-a.jpg", "Motif du livre : icônes dessinées à la main sur fond indigo.", "Le motif qui ouvre chaque chapitre."),
  motifB: livre("motif-violet-b.jpg", "Motif du livre : icônes dessinées à la main sur fond violet.", "Le motif qui ouvre chaque chapitre."),
  nadine: livre("nadine-portrait.jpg", "Photo de Nadine Zoro, autrice, en quatrième de couverture du livre.", "Nadine Zoro, autrice d'Active ton Superpouvoir !"),

  /* ——— En-têtes de pages (alias thématiques) ——— */
  livreLecture: livre("illus-bureau.jpg", "Illustration du livre : lecture et écriture au bureau.", "Lire, c'est d'abord s'arrêter."),
  bibliotheque: livre("fond-or-aligner.jpg", "Page du livre « Aligner talents et aspirations ».", "Une bibliothèque se parcourt par âge, par envie, par moment de vie."),
  boutique: livre("illus-heros-monde.jpg", "Illustration du livre : l'héroïne face au monde.", "Cinq pièces, chacune avec sa fonction dans la méthode."),
  cartesEntete: livre("fond-sarcelle-doutes.jpg", "Page du livre « Surmonter les obstacles et les doutes ».", "Une carte se tire à la main, au moment précis où le doute parle."),
  defisEntete: livre("fond-violet-talent.jpg", "Page du livre « Développe ton talent ».", "Sept, trente ou soixante jours : un pas par jour suffit."),
  quizEntete: livre("illus-ikigai.jpg", "Illustration du livre autour de l'Ikigai.", "Dix questions, trois minutes, aucune mauvaise réponse."),
  apropos: livre("nadine-portrait.jpg", "Photo de Nadine Zoro, autrice.", "Nadine Zoro, entrepreneure sociale et autrice."),
  contact: livre("illus-pointe.jpg", "Illustration du livre : l'héroïne pointe du doigt.", "Une seule adresse, et une vraie personne derrière."),
  ecoles: livre("illus-marche.jpg", "Illustration du livre : l'héroïne en chemin.", "Programmes écoles : le livre et le défi de 7 jours, utilisés en classe."),
  auteure: livre("nadine-portrait.jpg", "Photo de Nadine Zoro, autrice.", "Nadine Zoro, autrice d'Active ton Superpouvoir !"),

  /* ——— Accueil ——— */
  questionQuiz: livre("illus-ikigai.jpg", "Illustration du livre autour de l'Ikigai.", "Prendre trois minutes pour se poser la bonne question."),
  doutesCartes: livre("fond-sarcelle-doutes.jpg", "Page du livre « Surmonter les obstacles et les doutes ».", "Tirer une carte, lire le doute à voix haute, la retourner."),
  rituelMatin: livre("illus-marche.jpg", "Illustration du livre : l'héroïne en marche.", "Chaque matin, un pas de plus."),
  etoffes: livre("motif-violet-a.jpg", "Motif du livre sur fond indigo.", "Le fil du récit, tissé chapitre après chapitre."),
  citation: livre("nadine-portrait.jpg", "Photo de Nadine Zoro, autrice.", "Une question à laquelle toi seul·e réponds."),
  ressourceQuiz: livre("illus-ikigai.jpg", "Illustration du livre autour de l'Ikigai.", "Le quiz se passe sans inscription."),
  ressourceChapitre: livre("illus-chemin-heros.jpg", "Schéma du livre : le Chemin du Héros.", "Le premier chapitre ouvre la méthode."),

  /* ——— Communauté ——— */
  communaute: livre("illus-pointe.jpg", "Illustration du livre : l'héroïne pointe du doigt.", "On avance mieux ensemble."),
  partage: livre("illus-marche.jpg", "Illustration du livre : l'héroïne en marche.", "Ton histoire peut ouvrir une porte."),

  /* ——— Alias ponctuels ——— */
  tissage: livre("motif-violet-a.jpg", "Motif du livre sur fond indigo.", "Les profils du mouvement se tissent ensemble, comme ce motif."),
  metier: livre("motif-violet-b.jpg", "Motif du livre sur fond violet.", "La méthode se travaille chapitre après chapitre."),
  journal: livre("illus-bureau.jpg", "Illustration du livre : écrire à son bureau.", "Le Journal de Superpouvoir : passer de la lecture à l'exercice écrit."),
  dakar: livre("motif-violet-b.jpg", "Motif du livre sur fond violet.", "Dakar — l'une des villes où le mouvement est actif."),
  abidjan: livre("motif-violet-a.jpg", "Motif du livre sur fond indigo.", "Abidjan — ville d'origine du mouvement."),
} satisfies Record<string, Photo>;

/** Une image par étape de vie : parcours, bibliothèque, accueil. */
export const etapePhotos: Record<string, Photo> = {
  explorateur: livre("illus-marche.jpg", "Illustration du livre : l'héroïne en marche, sac au dos.", "13–16 ans : se chercher, et commencer à se trouver."),
  batisseur: livre("illus-pointe.jpg", "Illustration du livre : l'héroïne pointe du doigt, confiante.", "17–22 ans : choisir une direction, bâtir ses premiers projets."),
  createur: livre("illus-bureau.jpg", "Illustration du livre : l'héroïne crée à son bureau.", "23–35 ans : aligner ce que l'on fait et ce que l'on est."),
  reconnecteur: livre("illus-chemin-heros.jpg", "Schéma du livre : le Chemin du Héros.", "35 ans et plus : réactiver ce que la vie n'a pas éteint."),
};

/** Les quatre outils de la méthode. */
export const methodePhotos: Record<string, Photo> = {
  "01": livre("illus-ikigai.jpg", "Illustration du livre autour de l'Ikigai.", "Radar Personnel : observer ses forces."),
  "02": livre("illus-ikigai.jpg", "Illustration du livre autour de l'Ikigai.", "Ikigai : faire se croiser les envies et les besoins."),
  "03": livre("illus-bureau.jpg", "Illustration du livre : travail au bureau.", "Méthode CAP : clair, action, preuve."),
  "04": livre("illus-chemin-heros.jpg", "Schéma du livre : le Chemin du Héros.", "Chemin du Héros : relier ses talents à une mission."),
};

/** Une image d'ambiance par pièce de la boutique. */
export const ambianceProduit: Record<string, Photo> = {
  "active-ton-superpouvoir-livre": livre("cover.jpg", "Couverture du livre Active ton Superpouvoir !", "Le livre fondateur."),
  "mon-journal-de-superpouvoir": livre("illus-bureau.jpg", "Illustration du livre : écrire à son bureau.", "Le journal : passer de la lecture à l'exercice écrit."),
  "30-cartes-anti-doutes": livre("fond-sarcelle-doutes.jpg", "Page du livre « Surmonter les obstacles et les doutes ».", "Le deck se tire à la main, chaque matin."),
  "livre-de-rituels-60-jours": livre("illus-marche.jpg", "Illustration du livre : l'héroïne en marche.", "Soixante matins, un rituel après l'autre."),
  "poster-ikigai-a3": livre("illus-ikigai.jpg", "Illustration du livre autour de l'Ikigai.", "Le poster Ikigai s'accroche au-dessus du bureau."),
  "kit-complet-du-heros": livre("illus-heros-monde.jpg", "Illustration du livre : l'héroïne face au monde.", "Le kit : tout ce qu'il faut pour commencer."),
};

/** Les trois durées de défi. */
export const defiPhotos: Record<string, Photo> = {
  "7": livre("illus-marche.jpg", "Illustration du livre : l'héroïne en marche.", "7 jours pour se révéler."),
  "30": livre("illus-bureau.jpg", "Illustration du livre : travail au bureau.", "30 jours pour construire une compétence."),
  "60": livre("illus-chemin-heros.jpg", "Schéma du livre : le Chemin du Héros.", "60 jours, jusqu'au sommet."),
};

/** Les quatre défis communautaires. */
export const hashtagPhotos: Record<string, Photo> = {
  "#MonSuperpouvoir": livre("illus-pointe.jpg", "Illustration du livre : l'héroïne pointe du doigt.", "Ce que tu fais naturellement, et qui aide les autres."),
  "#LettrePourMoiFutur": livre("illus-bureau.jpg", "Illustration du livre : écrire à son bureau.", "Écrire à son toi du futur."),
  "#MaMissionEnUnMot": livre("illus-chemin-heros.jpg", "Schéma du livre : le Chemin du Héros.", "Un seul mot, qui dit tout."),
  "#MonIkigai": livre("illus-ikigai.jpg", "Illustration du livre autour de l'Ikigai.", "Ce que tu aimes, ce que tu fais bien."),
};

/** Photographies d'illustration des voix du mouvement. */
export const voixPhotos: Photo[] = [
  livre("illus-bureau.jpg", "Illustration du livre : travail au bureau.", "Illustration : un bureau, un carnet, une question."),
  livre("illus-marche.jpg", "Illustration du livre : l'héroïne en marche.", "Illustration : un pas après l'autre."),
  livre("illus-pointe.jpg", "Illustration du livre : l'héroïne pointe du doigt.", "Illustration : une confiance qui s'affirme."),
];

/** Villes citées dans les récits — motif du livre, sans photo documentaire. */
export const villePhotos: Record<string, Photo> = {
  Abidjan: livre("motif-violet-a.jpg", "Motif du livre sur fond indigo.", "Abidjan."),
  Dakar: livre("motif-violet-b.jpg", "Motif du livre sur fond violet.", "Dakar."),
  Paris: livre("motif-violet-a.jpg", "Motif du livre sur fond indigo.", "Paris."),
  Douala: livre("motif-violet-b.jpg", "Motif du livre sur fond violet.", "Douala."),
  Bouaké: livre("motif-violet-a.jpg", "Motif du livre sur fond indigo.", "Bouaké."),
};

/** Les espaces de la communauté. */
export const espacePhotos: Record<string, Photo> = {
  carte: livre("illus-pointe.jpg", "Illustration du livre : l'héroïne pointe du doigt.", "Carte des héros."),
  heros: livre("illus-heros-monde.jpg", "Illustration du livre : l'héroïne face au monde.", "Héros du mois."),
  temoignages: livre("illus-marche.jpg", "Illustration du livre : l'héroïne en marche.", "Témoignages."),
  forum: livre("illus-bureau.jpg", "Illustration du livre : travail au bureau.", "Forum."),
  mentors: livre("illus-chemin-heros.jpg", "Schéma du livre : le Chemin du Héros.", "Mentors."),
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
  "Visuels issus du livre « Active ton Superpouvoir ! » et du design system du mouvement.";
