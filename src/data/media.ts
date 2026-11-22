/**
 * Ressources visuelles.
 *
 * COUVERTURE OFFICIELLE : le site activetonpouvoir.com ne sert AUCUNE image de couverture
 * (inventaire vérifié : seuls logo.svg et icon.svg existent), et aucune édition du livre
 * n'est référencée publiquement. Conformément au brief, nous ne fabriquons pas la couverture.
 * Déposer le fichier officiel ici puis renseigner `src` : il remplacera automatiquement
 * la maquette neutre partout sur le site.
 */
export const couverture: { src: string | null; alt: string; largeur: number; hauteur: number } = {
  src: null,
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
  /** Cadrage (object-position) pour garder le sujet visible quand l'image est recadrée. */
  pos?: string;
};

export const px = (id: number, w: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}`;

/** Même photo, autre largeur (vignettes, srcset). */
export const taille = (p: Photo, w: number) => p.src.replace(/w=\d+/, `w=${w}`);

const p = (
  id: number,
  credit: string,
  alt: string,
  legende: string,
  o: { portrait?: boolean; pos?: string } = {}
): Photo => ({
  src: px(id, 1600),
  alt,
  credit,
  creditUrl: `https://www.pexels.com/photo/${id}/`,
  legende,
  largeur: o.portrait ? 1067 : 1600,
  hauteur: o.portrait ? 1600 : 1067,
  pos: o.pos,
});

/** Photographies documentaires choisies pour leur lien réel avec le contenu du livre. */
export const photos = {
  tissage: {
    src: px(24738158, 1600),
    alt: "Métier à tisser traditionnel en train de produire une étoffe colorée, gros plan sur les fils de chaîne.",
    credit: "Silvanus Solomon",
    creditUrl: "https://www.pexels.com/photo/handmade-scarf-in-a-village-24738158/",
    legende: "Le tissage : un fil seul ne fait pas l’étoffe. Les huit profils du livre fonctionnent ainsi.",
    largeur: 1600,
    hauteur: 1067,
  },
  metier: {
    src: px(32160896, 1400),
    alt: "Mains d’artisan tissant une étoffe sur un métier traditionnel.",
    credit: "Mounir El Barji",
    creditUrl: "https://www.pexels.com/photo/close-up-of-handcrafting-on-a-traditional-loom-32160896/",
    legende: "La méthode se travaille à la main, chapitre après chapitre.",
    largeur: 1400,
    hauteur: 933,
  },
  dakar: {
    src: px(18189687, 1600),
    alt: "Rue animée de Pikine, à Dakar, avec des passants en plein jour.",
    credit: "Amaury Michaux",
    creditUrl: "https://www.pexels.com/photo/people-walking-by-street-in-town-in-senegal-18189687/",
    legende: "Dakar — l’une des villes où le mouvement est actif.",
    largeur: 1600,
    hauteur: 1403,
  },
  abidjan: {
    src: px(2835625, 1400),
    alt: "Vue urbaine d’Abidjan, en Côte d’Ivoire.",
    credit: "Othniel Cisse",
    creditUrl: "https://www.pexels.com/photo/man-standing-in-middle-of-the-road-2835625/",
    legende: "Abidjan — ville d’origine du mouvement.",
    largeur: 1400,
    hauteur: 933,
  },
  journal: {
    src: px(6779632, 1600),
    alt: "Mains écrivant dans un carnet à spirale posé sur un bureau clair.",
    credit: "Artem Podrez",
    creditUrl: "https://www.pexels.com/photo/a-person-writing-on-a-notepad-6779632/",
    legende: "Le Journal de Superpouvoir : passer de la lecture à l’exercice écrit.",
    largeur: 1600,
    hauteur: 899,
  },

  /* ——— En-têtes de pages ——— */
  livreLecture: p(2228561, "Thought Catalog", "Une femme lit un livre, assise dans l’encadrement d’une fenêtre, en contre-jour.", "Lire, c’est d’abord s’arrêter. Le livre se lit seul·e, en famille ou en classe.", { pos: "50% 38%" }),
  bibliotheque: p(37330359, "mehmetakifarts", "Grande bibliothèque aux étagères de bois éclairées par des rampes chaudes.", "Une bibliothèque se parcourt par âge, par envie, par moment de vie.", { pos: "50% 55%" }),
  boutique: p(7594480, "Mikhail Nilov", "Carnets ouverts, lunettes et stylo posés sur un bureau en bois.", "Cinq pièces, chacune avec sa fonction dans la méthode."),
  cartesEntete: p(7179824, "cottonbro studio", "Des mains tiennent un éventail de cartes colorées sur un fond sombre.", "Une carte se tire à la main, le matin ou au moment précis où le doute parle.", { portrait: true, pos: "50% 40%" }),
  defisEntete: p(7283634, "Karola G / Kaboompics", "Une jeune femme assise sur un canapé écrit dans un carnet, écouteurs aux oreilles.", "Sept, trente ou soixante jours : un pas par jour suffit.", { pos: "50% 45%" }),
  quizEntete: p(5311443, "Karola G / Kaboompics", "Une femme étudie à une table, entourée de cahiers et de stylos.", "Dix questions, trois minutes, aucune mauvaise réponse.", { pos: "50% 45%" }),
  apropos: p(35610368, "B. Aristotlè Guweh Jr", "Des enfants et leur enseignante dans une salle de classe colorée au Liberia.", "Photographie d’illustration, Liberia : révéler les talents des jeunes Africains.", { pos: "50% 50%" }),
  contact: p(7335405, "MART PRODUCTION", "Feuilles couvertes d’écriture manuscrite à l’encre.", "Une seule adresse, et une vraie personne derrière.", { pos: "50% 40%" }),
  ecoles: p(5905554, "Katerina Holmes", "Une enseignante explique une leçon au tableau devant des élèves.", "Programmes écoles : le livre et le défi de 7 jours, utilisés en classe."),
  auteure: p(8497678, "Liliana Drew", "Une femme en veste blanche échange avec un jeune homme, assis sur un banc en plein air.", "Photographie d’illustration. Aucun portrait officiel de l’autrice n’est publié.", { pos: "28% 40%" }),

  /* ——— Accueil ——— */
  questionQuiz: p(7593766, "Mikhail Nilov", "Une jeune femme écrit ses réflexions dans un carnet.", "Prendre trois minutes pour se poser la bonne question."),
  doutesCartes: p(37589048, "DΛVΞ GΛRCIΛ", "Une main montre une carte au milieu d’un éventail de cartes.", "Tirer une carte, lire le doute à voix haute, la retourner."),
  rituelMatin: p(10060586, "Nataliya Vaitkevich", "Un carnet blanc, une tasse de café et un petit-déjeuner posés sur un lit.", "Le lundi matin, l’affirmation de la semaine tient en une page."),
  etoffes: p(38487457, "Raphhill", "Tissus africains imprimés aux motifs vifs sur un étal de marché.", "Étoffes de marché : le fil du récit de Fatoumata.", { pos: "50% 50%" }),
  citation: p(25849112, "Christian Alemu", "Portrait d’une femme aux tresses, le regard songeur, en extérieur.", "Une question à laquelle toi seul·e réponds.", { pos: "50% 30%" }),
  ressourceQuiz: p(7593768, "Mikhail Nilov", "Une femme en robe noire écrit dans un carnet.", "Le quiz se passe sans inscription."),
  ressourceChapitre: p(9051451, "Mike Jones", "Des mains tiennent un carnet ouvert couvert d’écriture.", "Le premier chapitre ouvre la méthode.", { portrait: true, pos: "50% 45%" }),

  /* ——— Communauté ——— */
  communaute: p(7971363, "Darlene Alderson", "Un groupe de jeunes adultes discute autour d’une table.", "On avance mieux ensemble.", { pos: "50% 40%" }),
  partage: p(12127116, "Adedire Abiodun", "Un groupe de jeunes assis ensemble, en pleine conversation.", "Ton histoire peut ouvrir une porte.", { portrait: true }),
} satisfies Record<string, Photo>;

/** Une photo par étape de vie : parcours, bibliothèque, accueil. */
export const etapePhotos: Record<string, Photo> = {
  explorateur: p(6698382, "cottonbro studio", "Une adolescente aux cheveux bouclés, allongée sur son lit, tient un carnet.", "13–16 ans : se chercher, et commencer à se trouver.", { pos: "50% 45%" }),
  batisseur: p(6147398, "Keira Burton", "Trois étudiants prennent des notes et travaillent sur un ordinateur, assis sur des marches.", "17–22 ans : choisir une direction, bâtir ses premiers projets.", { pos: "50% 40%" }),
  createur: p(9850082, "Ron Lach", "Deux créatrices échangent devant des croquis dans un atelier de création.", "23–35 ans : aligner ce que l’on fait et ce que l’on est.", { portrait: true, pos: "50% 35%" }),
  reconnecteur: p(7951772, "RDNE Stock project", "Portrait d’une femme mûre au regard pensif, devant un mur bleu-vert.", "35 ans et plus : réactiver ce que la vie n’a pas éteint.", { pos: "50% 30%" }),
};

/** Les quatre outils de la méthode. */
export const methodePhotos: Record<string, Photo> = {
  "01": p(6609456, "Antoni Shkraba", "Un jeune homme réfléchit, carnet et ordinateur sur les genoux, dans une bibliothèque.", "Radar Personnel : observer ses forces.", { portrait: true, pos: "40% 50%" }),
  "02": p(1181481, "Christina Morillo", "Deux femmes discutent devant un mur de notes adhésives.", "Ikigai : faire se croiser les envies et les besoins.", { pos: "60% 45%" }),
  "03": p(7181109, "Thirdman", "Trois personnes travaillent autour d’une table d’atelier avec un ordinateur et des matériaux.", "Méthode CAP : clair, action, preuve.", { pos: "50% 55%" }),
  "04": p(17717770, "Cz Jen", "Un sentier qui traverse un paysage vers l’horizon, en noir et blanc.", "Chemin du Héros : relier ses talents à une mission.", { portrait: true, pos: "50% 50%" }),
};

/** Une photo d'ambiance par pièce de la boutique : le livre en situation. */
export const ambianceProduit: Record<string, Photo> = {
  "active-ton-superpouvoir-livre": p(5311640, "Karola G / Kaboompics", "Une femme lit un livre à couverture rouge, installée sur un canapé.", "Le livre se lit à la maison comme en classe.", { pos: "62% 50%" }),
  "mon-journal-de-superpouvoir": p(7606032, "MART PRODUCTION", "Une jeune femme écrit dans un carnet jaune, assise chez elle.", "Le journal : passer de la lecture à l’exercice écrit.", { pos: "45% 50%" }),
  "30-cartes-anti-doutes": p(32771822, "DΛVΞ GΛRCIΛ", "Des mains tiennent un paquet de cartes illustrées.", "Le deck se tire à la main, chaque matin.", { pos: "45% 50%" }),
  "livre-de-rituels-60-jours": p(30937878, "Sami Abdullah", "Une personne écrit dans un carnet, une tasse de café à côté.", "Soixante matins, un rituel après l’autre.", { portrait: true, pos: "50% 50%" }),
  "poster-ikigai-a3": p(4770801, "cottonbro studio", "Un poster jaune et des photos épinglées sur un mur blanc.", "Le poster Ikigai s’accroche au-dessus du bureau.", { portrait: true, pos: "70% 40%" }),
  "kit-complet-du-heros": p(3993755, "reneereneee", "Un carnet ouvert, un ordinateur, un café et une viennoiserie sur une table, sous un plaid.", "Le kit : tout ce qu’il faut sur la table.", { pos: "40% 50%" }),
};

/** Les trois durées de défi. */
export const defiPhotos: Record<string, Photo> = {
  "7": p(8499607, "RDNE Stock project", "Une adolescente aux cheveux bouclés, assise dans un escalier, écrit dans un carnet le regard levé.", "7 jours pour se révéler.", { pos: "50% 35%" }),
  "30": p(6634701, "Karola G / Kaboompics", "Des mains tissent sur un métier à tisser, fils colorés tendus.", "30 jours pour construire une compétence, fil après fil.", { pos: "50% 50%" }),
  "60": p(39042315, "Alfredo Dacosta", "Un jeune diplômé tient son certificat lors d’une cérémonie.", "60 jours, jusqu’au certificat final.", { portrait: true, pos: "50% 35%" }),
};

/** Les quatre défis communautaires. */
export const hashtagPhotos: Record<string, Photo> = {
  "#MonSuperpouvoir": p(28100852, "illustrate Digital Ug", "Les mains d’un artisan au travail dans un atelier de menuiserie en Ouganda.", "Ce que tu fais naturellement, et qui aide les autres.", { pos: "50% 50%" }),
  "#LettrePourMoiFutur": p(6260145, "RDNE Stock project", "Une main écrit une lettre manuscrite.", "Écrire à son toi du futur.", { pos: "50% 50%" }),
  "#MaMissionEnUnMot": p(114107, "Miguel Á. Padriñán", "Un stylo plume posé sur une page d’écriture calligraphiée.", "Un seul mot, qui dit tout.", { pos: "50% 50%" }),
  "#MonIkigai": p(15543114, "Walls.io", "Un tableau blanc couvert de notes adhésives colorées.", "Ce que tu aimes, ce que tu fais bien.", { portrait: true, pos: "50% 50%" }),
};

/** Photographies d'illustration des trois voix — jamais présentées comme les personnes citées. */
export const voixPhotos: Photo[] = [
  p(34162713, "Tosin Olowoleni", "Des élèves en uniforme suivent un cours dans une salle de classe.", "Illustration : salle de classe en Afrique de l’Ouest.", { pos: "50% 50%" }),
  p(35856106, "Enoch Wafula", "Étals de tissus et de vêtements colorés dans un marché de Nairobi.", "Illustration : marché textile à Nairobi, pas la boutique de Kofi.", { pos: "50% 50%" }),
  p(5905923, "Katerina Holmes", "Une enseignante invite une élève à poser sa question en classe.", "Illustration : une classe, un tableau, une question.", { portrait: true, pos: "50% 30%" }),
];

/** Villes citées dans les récits. Les photos non prises sur place sont signalées dans la légende. */
export const villePhotos: Record<string, Photo> = {
  Abidjan: photos.abidjan,
  Dakar: p(37904482, "Lom Doudou", "Un minibus coloré circule dans une rue de Dakar devant une église blanche.", "Dakar, Sénégal.", { pos: "50% 55%" }),
  Paris: p(16923189, "Diego F. Parra", "Toits et façades haussmanniens de Paris vus d’en haut.", "Paris, France.", { pos: "50% 50%" }),
  Douala: p(15171980, "Stephane Fabrice Bassangue", "Un jeune homme lit un livre devant un ordinateur, à Douala, au Cameroun.", "Douala, Cameroun.", { pos: "50% 40%" }),
  Bouaké: p(3766706, "Lawrence Baganiah", "Un enseignant gesticule devant une classe, en Afrique de l’Ouest.", "Photo d’illustration (Ghana) : une classe, comme celles de Bouaké. Non prise à Bouaké.", { pos: "50% 40%" }),
};

/** Les espaces de la communauté. */
export const espacePhotos: Record<string, Photo> = {
  carte: p(17290985, "K", "Vue aérienne d’un grand marché et de rues animées à Yaoundé.", "Carte des héros.", { pos: "50% 50%" }),
  heros: photos.tissage,
  temoignages: p(7598553, "cottonbro studio", "Une femme parle devant des micros dans un studio de podcast.", "Témoignages.", { pos: "50% 40%" }),
  forum: p(7579310, "Antoni Shkraba", "Un groupe de jeunes adultes discute en cercle.", "Forum.", { pos: "50% 50%" }),
  mentors: p(4260094, "August de Richelieu", "Un adulte et un enfant en pleine conversation dans un salon.", "Mentors.", { pos: "60% 40%" }),
};

/** Photos de fond des grandes sections : posées en teinte aplat (fusion), jamais en dégradé. */
export const fonds = {
  etabli: p(28100852, "illustrate Digital Ug", "", ""),
  etapes: p(27787406, "Thom Gonzalez", "", ""),
  doutes: p(7335405, "MART PRODUCTION", "", ""),
  voix: p(12127116, "Adedire Abiodun", "", ""),
  rituel: p(30937878, "Sami Abdullah", "", ""),
  kit: p(3993755, "reneereneee", "", ""),
  pied: p(37904482, "Lom Doudou", "", ""),
  villes: p(16923189, "Diego F. Parra", "", ""),
  espaces: p(17290985, "K", "", ""),
};

/** Les légendes sont factuelles : aucune photo n'est présentée comme l'autrice ou un lecteur du livre. */
export const mentionPhotos =
  "Photos d’illustration. Elles ne représentent ni l’autrice ni les lecteurs du livre.";
