import { useEffect, useState } from "react";
import { ArrowUpRight, ChevronDown, MapPin } from "lucide-react";
import { Monogramme } from "../components/Atelier";
import { FondPhoto, PhotoCadre, Vignette } from "../components/Photo";
import { CadreDecoupe } from "../components/CadreDecoupe";
import { BoutonPeint } from "../components/BoutonPeint";
import { Parallax } from "../components/Parallax";
import { Icone } from "../components/Icone";
import { NavigationSections } from "../components/NavigationSections";

const SECTIONS_COMMUNAUTE = [
  { id: "community-opening", label: "Communauté" },
  { id: "community-cities", label: "Les villes" },
  { id: "community-stories", label: "Les récits" },
  { id: "community-portrait", label: "Héros du mois" },
  { id: "community-spaces", label: "Les espaces" },
  { id: "community-share", label: "Partager" },
];
import { communauteEspaces, herosDuMois, marque, temoignages, temoignagesCommunaute } from "../data/site";
import { espacePhotos, fonds, photos, villePhotos } from "../data/media";

const photoTissage = photos.motifA;

const villeParNom: Record<string, string> = {
  "Aminata K.": "Abidjan",
  "Kofi M.": "Dakar",
  "Prof. Bamba D.": "Bouaké",
  "Kofi Asante": "Douala",
  "Aisha Camara": "Paris",
  "Mariam Sylla": "Dakar",
};

const villes = ["Toutes", "Abidjan", "Bouaké", "Dakar", "Douala", "Paris"];
const histoires = [...temoignagesCommunaute, ...temoignages].map((temoignage) => ({
  temoignage,
  ville: villeParNom[temoignage.nom],
}));

type CibleEspace =
  | { type: "section"; cible: string; action: string }
  | { type: "email"; href: string; action: string };

function defilerVers(id: string) {
  const cible = document.getElementById(id);
  if (!cible) return;
  const reduireMouvement = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  cible.scrollIntoView({ behavior: reduireMouvement ? "auto" : "smooth", block: "start" });
}

const lienEmail = (sujet: string, corps: string) =>
  `mailto:${marque.emailMailto}?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corps)}`;

const cibleEspace: Record<string, CibleEspace> = {
  carte: { type: "section", cible: "community-cities", action: "Choisir une ville" },
  heros: { type: "section", cible: "community-portrait", action: "Lire le portrait" },
  temoignages: { type: "section", cible: "community-stories", action: "Lire les récits" },
  forum: {
    type: "email",
    href: lienEmail("Demande d’accès au forum — Active ton Superpouvoir", "Bonjour Nadine,\n\nJe souhaite demander l’accès au forum.\n\nMon prénom :\nMa ville :\nCe que j’aimerais y partager :\n"),
    action: "Demander l’accès par email",
  },
  mentors: {
    type: "email",
    href: lienEmail("Mentorat — Active ton Superpouvoir", "Bonjour Nadine,\n\nJe souhaite parler du mentorat.\n\nMon prénom :\nMa ville :\nJe souhaite : demander un mentor / proposer mon aide\n\nMerci !"),
    action: "Écrire à l’atelier",
  },
};

const etatEspace: Record<string, { label: string; detail: string }> = {
  carte: { label: "Ouvert maintenant", detail: "Choisis une ville" },
  heros: { label: "À découvrir", detail: "Lire le portrait" },
  temoignages: { label: "Ouvert maintenant", detail: "Lire les récits" },
  forum: { label: "Sur demande", detail: "Demander un accès" },
  mentors: { label: "Sur demande", detail: "Écrire à l’atelier" },
};

/** Photo de la ville choisie : le filtre devient un lieu. « Toutes » montre les trois villes principales. */
function VillePanel({ ville }: { ville: string }) {
  if (ville === "Toutes") {
    return (
      <div className="grid grid-cols-3 gap-3 mt-6">
        {["Abidjan", "Dakar", "Paris"].map((v) => (
          <PhotoCadre key={v} photo={villePhotos[v]} ratio="3 / 4" voile creditVisible={false} sizes="25vw">
            <span className="ville-etiquette">{v}</span>
          </PhotoCadre>
        ))}
      </div>
    );
  }
  const photo = villePhotos[ville];
  return (
    <div className="mt-6" key={ville}>
      <PhotoCadre photo={photo} ratio="16 / 8" ratioMobile="4 / 3" voile>
        <span className="ville-etiquette">{ville}</span>
      </PhotoCadre>
      <p className="text-paper/65 mt-3 text-sm">{photo.legende}</p>
    </div>
  );
}

type Histoire = (typeof histoires)[number];

/** Témoignage éditorial : citation fixe, une photo de contexte et un choix explicite de récit. */
function Paroles({ histoires: liste }: { histoires: Histoire[] }) {
  const [actif, setActif] = useState(0);
  const n = liste.length;

  useEffect(() => setActif(0), [n]);

  if (!n) {
    return <p className="carte border border-paper/20 bg-ink-2 text-dim p-6">Aucun témoignage n’est associé à cette ville pour le moment.</p>;
  }

  const i = Math.min(actif, n - 1);
  const { temoignage: t, ville } = liste[i];
  const profil = "profil" in t && typeof t.profil === "string" ? t.profil : "Voix du mouvement";
  const aller = (sens: number) => setActif((a) => (a + sens + n) % n);

  return (
    <div className="mt-8">
      <div className="paroles-scene">
        <figure className="paroles-photo" key={`${t.nom}-${ville}`}>
          <Vignette photo={villePhotos[ville] ?? photos.abidjan} largeur={1100} decoratif immediat className="object-cover" />
          <figcaption><span>{ville}</span><span>Image d’illustration</span></figcaption>
        </figure>
        <div className="paroles-citation">
          <div className="paroles-haut">
            <span>Récit {String(i + 1).padStart(2, "0")} sur {String(n).padStart(2, "0")}</span>
            <span className="paroles-profil">{profil}</span>
          </div>
          <span className="paroles-icone" aria-hidden="true"><Icone nom="discussion" taille={22} /></span>
          <blockquote className="paroles-texte" aria-live="polite">
            {t.texte}
          </blockquote>
          <div className="paroles-auteur">
            <Monogramme initiales={t.initiales} fil="#FFB000" taille={56} />
            <span>
              <strong>{t.nom}</strong>
              <em>{t.detail}</em>
            </span>
            <span className="paroles-ville"><MapPin size={14} aria-hidden="true" /> {ville}</span>
          </div>
          <div className="paroles-controles">
            <button type="button" onClick={() => aller(-1)} aria-label="Témoignage précédent" disabled={n < 2}><Icone nom="fleche-gauche" taille={17} /></button>
            <span className="paroles-compteur">{String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</span>
            <button type="button" onClick={() => aller(1)} aria-label="Témoignage suivant" disabled={n < 2}><Icone nom="fleche-droite" taille={17} /></button>
          </div>
        </div>
      </div>

      <ul className="paroles-liste">
        {liste.map((h, k) => (
          <li key={h.temoignage.nom}>
            <button type="button" className="paroles-vignette" aria-pressed={k === i} onClick={() => setActif(k)}>
              <span className="paroles-vignette-tete">
                <Monogramme initiales={h.temoignage.initiales} fil={k === i ? "#321044" : "#FFB000"} taille={38} />
                <span>
                  <strong>{h.temoignage.nom}</strong>
                  <em>{h.ville}</em>
                </span>
              </span>
              <span className="paroles-extrait"><Icone nom="discussion" taille={15} /><span>{h.temoignage.texte.replace(/\s+/g, " ").slice(0, 92).trimEnd()}…</span></span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Communaute() {
  const [villeActive, setVilleActive] = useState("Toutes");
  const [interviewOuverte, setInterviewOuverte] = useState(false);
  const histoiresVisibles = histoires.filter(({ ville }) => villeActive === "Toutes" || ville === villeActive);
  const sujetTemoignage = lienEmail(
    "Mon témoignage — Active ton Superpouvoir",
    "Bonjour Nadine,\n\nVoici mon histoire :\n\nMon prénom :\nMon âge et ma ville :\nMon profil de héros :\nCe que le livre ou le défi a changé pour moi :\n\nJ’accepte que mon témoignage soit publié : oui / non\n",
  );

  return (
    <>
      <NavigationSections sections={SECTIONS_COMMUNAUTE} />

      <section id="community-opening" className="community-opening inverse fond-tisse champ relative isolate overflow-hidden text-ink" aria-labelledby="community-title">
        <img
          src="/images/09-communaute.webp"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover opacity-25 mix-blend-luminosity"
          style={{ objectPosition: "center right" }}
        />
        <div className="community-opening-inner">
          <div className="community-opening-copy">
            <p className="label community-opening-kicker text-ink/70">La Fabrique des Héros <span aria-hidden="true">/</span> Communauté</p>
            <h1 id="community-title" className="display-xl">
              On avance <span className="community-opening-accent souligne text-or">mieux</span> quand on avance ensemble.
            </h1>
            <p className="community-opening-intro text-dim">
              Des jeunes qui osent essayer, des adultes qui transmettent et des idées qui passent d’une personne à l’autre. Découvre les voix et les espaces du mouvement.
            </p>
            <div className="community-opening-actions flex flex-wrap gap-3 mt-7">
              <BoutonPeint onClick={() => defilerVers("community-stories")} icone={<Icone nom="fleche-droite" taille={16} />}>
                Lire les histoires
              </BoutonPeint>
              <BoutonPeint onClick={() => defilerVers("community-cities")} variante="craie" inverse icone={<MapPin size={16} />}>
                Choisir une ville
              </BoutonPeint>
            </div>
            <p className="community-opening-counts" aria-label={`${histoires.length} récits publiés dans ${villes.length - 1} villes`}>
              <span><strong>{String(histoires.length).padStart(2, "0")}</strong> récits publiés</span>
              <span><strong>{String(villes.length - 1).padStart(2, "0")}</strong> villes citées</span>
            </p>
          </div>
          <div className="community-opening-figure">
            <CadreDecoupe variante="vague-bas-douce">
              <Parallax vitesse={0.85} ampleur={10}>
                <PhotoCadre photo={photos.communaute} ratio="4 / 3" ratioMobile="16 / 10" creditVisible={false} prioritaire sizes="(min-width: 1024px) 48vw, 100vw" />
              </Parallax>
            </CadreDecoupe>
            <p className="community-opening-caption text-ink/60 mt-3 text-[12.5px]">Photo d’illustration — un groupe de jeunes adultes en discussion.</p>
          </div>
        </div>
      </section>

      <section id="community-cities" className="community-cities champ relative isolate scroll-mt-20 overflow-hidden bg-ink text-paper" aria-labelledby="community-cities-title">
<FondPhoto photo={fonds.villes} mode="multiply" opacite={0.3} />
        <div className="grid gap-10 xl:gap-16 xl:grid-cols-[.72fr_1.28fr]">
          <div>
            <p className="label text-or">Les récits, ville par ville</p>
            <h2 id="community-cities-title" className="display-l">Chaque voix a <span className="livre font-normal text-or">son lieu.</span></h2>
            <p className="text-paper/75 max-w-[48ch]">Choisis une ville pour retrouver les témoignages qui y sont associés. Les noms ci-dessous viennent des récits publiés sur le site.</p>
          </div>
          <div className="self-end">
            <div className="community-city-filters" role="group" aria-label="Filtrer les témoignages par ville">
              {villes.map((ville, index) => {
                const active = villeActive === ville;
                const count = ville === "Toutes" ? histoires.length : histoires.filter((histoire) => histoire.ville === ville).length;
                return (
                  <button key={ville} type="button" aria-pressed={active} onClick={() => setVilleActive(ville)} className={`community-city-filter ${active ? "is-active" : ""}`}>
                    <span className="community-city-number">{String(index).padStart(2, "0")}</span>
                    {ville}
                    <span className="community-city-count">{count}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-paper/65 mt-1 text-sm" role="status" aria-live="polite">
              {histoiresVisibles.length} {histoiresVisibles.length > 1 ? "histoires affichées" : "histoire affichée"}
              {villeActive !== "Toutes" ? ` · ${villeActive}` : " · toutes les villes"}
            </p>
            <VillePanel ville={villeActive} />
          </div>
        </div>
      </section>

      <section id="community-stories" className="community-stories champ scroll-mt-20 bg-ink text-paper" aria-labelledby="community-stories-title">
        <div className="flex flex-col gap-2">
          <div className="community-stories-heading flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="label community-stories-kicker flex items-center gap-3"><span>Paroles partagées</span><span className="community-stories-count pastille">{String(histoiresVisibles.length).padStart(2, "0")} récits</span></p>
              <h2 id="community-stories-title" className="display-l">Les mots de la <span className="livre font-normal text-or">communauté.</span></h2>
            </div>
            <p className="text-paper/70 max-w-[42ch]">Chaque histoire reste celle de la personne qui la raconte. Les photos montrent uniquement les villes en guise d’illustration.</p>
          </div>
          <Paroles histoires={histoiresVisibles} />
        </div>
      </section>

      <section id="community-portrait" className="community-hero-of-month inverse fond-tisse champ scroll-mt-20 text-ink" aria-labelledby="community-portrait-title">
        <div className="grid items-center gap-10 lg:gap-16 lg:grid-cols-[.85fr_1.15fr]">
          <div>
            <div className="relative">
<PhotoCadre photo={photoTissage} ratio="4 / 3" className="border-ink/15" />
<div
  className="duo-incrust absolute"
  style={{
    ["--duo-bg" as string]: "#FFF0D9",
    // Deux règles `.duo-incrust` coexistent dans index.css (une plus ancienne en
    // bas-gauche, une plus récente en bas-droite) : sans ces overrides explicites,
    // elles se mélangent (left + right + aspect-ratio en conflit) et l’incrustation
    // se retrouve mal positionnée, bordée en carré au lieu du portrait attendu.
    right: "auto",
    left: "-1.25rem",
    bottom: "-1.5rem",
    width: "42%",
    maxWidth: "190px",
    aspectRatio: "1 / 1",
  }}
>
  <PhotoCadre photo={photos.etoffes} ratio="4 / 5" creditVisible={false} />
</div>
</div>
            <p className="text-ink/65 mt-10 text-sm">Photo d’illustration du tissage, prise à Fès au Maroc; elle ne montre ni Fatoumata Diallo ni Pont d’Or.</p>
          </div>
          <div>
            <p className="label text-or">Portrait d’archive · {herosDuMois.periode}</p>
            <h2 id="community-portrait-title" className="display-l">{herosDuMois.nom}<span className="text-or">.</span></h2>
            <p className="flex items-center gap-2 font-semibold text-ink/75 mt-2"><MapPin size={15} aria-hidden="true" /> {herosDuMois.ville} · Profil {herosDuMois.profil}</p>
            <p className="text-ink/85 mt-4 leading-relaxed">{herosDuMois.recit}</p>
            <blockquote className="border-l-[5px] border-or pl-5 my-6 font-display text-[clamp(1.35rem,3vw,2.2rem)] font-extrabold text-or">{herosDuMois.secret}</blockquote>
            <button type="button" aria-expanded={interviewOuverte} aria-controls="community-interview" onClick={() => setInterviewOuverte((ouverte) => !ouverte)} className="inline-flex items-center gap-2 rounded-full border border-ink/40 px-5 py-2.5 text-[12.5px] font-bold uppercase tracking-wide transition-colors hover:border-or hover:text-or focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-or">
              {interviewOuverte ? "Fermer l’interview" : "Lire l’interview"}
              <ChevronDown size={16} className={`transition-transform ${interviewOuverte ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>
            <dl id="community-interview" hidden={!interviewOuverte} className="mt-6 space-y-5 border-t border-ink/15 pt-6">
              {herosDuMois.interview.map((item) => <div key={item.q}><dt className="font-display text-[15px] font-extrabold">{item.q}</dt><dd className="text-ink/70 mt-1">« {item.r} »</dd></div>)}
            </dl>
          </div>
        </div>
      </section>

      <section id="community-spaces" className="community-spaces inverse champ relative isolate overflow-hidden bg-paper text-ink" aria-labelledby="community-spaces-title">
<FondPhoto photo={fonds.espaces} />
        <div className="">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div><p className="label text-or">La suite t’appartient</p><h2 id="community-spaces-title" className="display-l">Trouve ton <span className="livre font-normal text-or">prochain pas.</span></h2></div>
            <p className="text-ink/75 max-w-[42ch]">Explore un espace déjà disponible, ou écris à l’atelier pour demander l’accès aux espaces membres.</p>
          </div>
          <ul className="community-space-list">
            {communauteEspaces.map((espace, index) => {
              const cible = cibleEspace[espace.id];
              const etat = etatEspace[espace.id];
              const className = "community-space-link group";
              const contenu = <><span className="community-space-photo"><Vignette photo={espacePhotos[espace.id]} largeur={640} decoratif className="object-cover" /></span><span className="community-space-top"><span className="font-display font-extrabold text-or">{String(index + 1).padStart(2, "0")}</span><span className="community-space-status">{etat.label}</span></span><h3>{espace.titre}</h3><p>{espace.texte}</p><span className="community-space-action">{etat.detail} <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" /></span></>;
              return <li key={espace.id}>{cible.type === "section" ? <button type="button" onClick={() => defilerVers(cible.cible)} className={className}>{contenu}</button> : <a href={cible.href} className={className} aria-label={`${espace.titre} — ${cible.action}`}>{contenu}</a>}</li>;
            })}
          </ul>
          <div className="community-quiz-callout">
            <div><p className="label text-ink/70">Besoin d’un point de départ ?</p><p className="font-display font-extrabold mt-1">Commence par découvrir ton profil, puis choisis l’espace qui te ressemble.</p><p className="text-ink/75 mt-1">Le quiz est gratuit et te donne une première direction. Tu peux ensuite revenir ici pour lire, échanger ou demander un accompagnement.</p></div>
            <BoutonPeint to="/quiz" className="shrink-0" icone={<Icone nom="fleche-droite" taille={16} />}>Commencer par le quiz</BoutonPeint>
          </div>
          <div className="flex flex-wrap gap-3 mt-8"><BoutonPeint to="/defis" icone={<Icone nom="fleche-droite" taille={16} />}>Rejoindre un défi collectif</BoutonPeint><BoutonPeint to="/quiz" variante="craie" inverse>Découvrir mon profil</BoutonPeint><BoutonPeint to="/bibliotheque" variante="craie" inverse>Explorer la bibliothèque</BoutonPeint></div>
        </div>
      </section>

      <section id="community-share" className="community-share inverse fond-tisse champ relative isolate overflow-hidden text-ink" aria-labelledby="community-share-title">
{/* La photo se fond dans le bas de la section (au lieu de s'arrêter net) pour éviter
    que la jonction avec le pied de page — même texture `fond-tisse` sombre, sans
    marge — ne donne l'impression que l'image/la section a été coupée. */}
<Vignette
  photo={photos.partage}
  largeur={1600}
  decoratif
  className="community-share-photo [mask-image:linear-gradient(to_bottom,black,black_55%,transparent_94%)] [-webkit-mask-image:linear-gradient(to_bottom,black,black_55%,transparent_94%)]"
/>
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl"><p className="label text-or">À toi de jouer</p><h2 id="community-share-title" className="display-l">Ton histoire peut ouvrir une porte.</h2><p className="text-ink/75">Le bouton prépare un email à l’atelier. Rien n’est envoyé ni publié automatiquement : tu peux relire ton message avant de l’envoyer.</p></div>
          <BoutonPeint href={sujetTemoignage} className="shrink-0" icone={<ArrowUpRight size={16} />}>Partager mon histoire</BoutonPeint>
        </div>
      </section>
    </>
  );
}
