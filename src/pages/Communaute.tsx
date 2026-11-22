import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronDown, MapPin, MessageCircle, MoveRight } from "lucide-react";
import { Monogramme } from "../components/Atelier";
import { FondPhoto, PhotoCadre, Vignette } from "../components/Photo";
import { Link } from "../lib/router";
import { communauteEspaces, herosDuMois, marque, temoignages, temoignagesCommunaute } from "../data/site";
import type { Photo } from "../data/media";
import { espacePhotos, fonds, photos, villePhotos } from "../data/media";

const photoTissage: Photo = {
  src: "https://images.pexels.com/photos/32160896/pexels-photo-32160896.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600",
  alt: "Un artisan tisse une étoffe sur un métier traditionnel à Fès, au Maroc; photo d’illustration, pas une image de Fatoumata Diallo ou de Pont d’Or.",
  credit: "Mounir El Barji / Pexels",
  creditUrl: "https://www.pexels.com/photo/close-up-of-handcrafting-on-a-traditional-loom-32160896/",
  legende: "Savoir-faire textile, Fès, Maroc; illustration du récit, pas du lieu ni de l’entreprise cités.",
  largeur: 1600,
  hauteur: 1067,
};

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
      <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
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
      <p className="mt-2 text-[12px] leading-snug text-paper/65">{photo.legende}</p>
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
    return <p className="border-2 border-paper/20 bg-ink-2 p-6 text-[15px] text-dim">Aucun témoignage n’est associé à cette ville pour le moment.</p>;
  }

  const i = Math.min(actif, n - 1);
  const { temoignage: t, ville } = liste[i];
  const profil = "profil" in t && typeof t.profil === "string" ? t.profil : "Voix du mouvement";
  const aller = (sens: number) => setActif((a) => (a + sens + n) % n);

  return (
    <div>
      <div className="paroles-scene">
        <figure className="paroles-photo" key={`${t.nom}-${ville}`}>
          <Vignette photo={villePhotos[ville] ?? photos.abidjan} largeur={1100} decoratif immediat className="h-full w-full object-cover" />
          <figcaption><span>{ville}</span><span>Image d’illustration</span></figcaption>
        </figure>
        <div className="paroles-citation">
          <div className="paroles-haut">
            <span>Récit {String(i + 1).padStart(2, "0")} sur {String(n).padStart(2, "0")}</span>
            <span className="paroles-profil">{profil}</span>
          </div>
          <span className="paroles-icone" aria-hidden="true"><MessageCircle size={22} strokeWidth={1.8} /></span>
          <blockquote className="paroles-texte" aria-live="polite">
            {t.texte}
          </blockquote>
          <footer className="paroles-auteur">
            <Monogramme initiales={t.initiales} fil="#FFB000" taille={56} />
            <span>
              <strong>{t.nom}</strong>
              <em>{t.detail}</em>
            </span>
            <span className="paroles-ville"><MapPin size={14} aria-hidden="true" /> {ville}</span>
          </footer>
          <div className="paroles-controles">
            <button type="button" onClick={() => aller(-1)} aria-label="Témoignage précédent" disabled={n < 2}><ArrowLeft size={17} /></button>
            <span className="paroles-compteur">{String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</span>
            <button type="button" onClick={() => aller(1)} aria-label="Témoignage suivant" disabled={n < 2}><ArrowRight size={17} /></button>
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
              <span className="paroles-extrait"><MessageCircle size={15} aria-hidden="true" /><span>{h.temoignage.texte.replace(/\s+/g, " ").slice(0, 92).trimEnd()}…</span></span>
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
      <section className="community-opening relative border-b border-paper/12 bg-ink text-paper" aria-labelledby="community-title">
        <div className="community-opening-inner mx-auto grid w-full max-w-[1440px] gap-9 px-5 py-12 sm:px-8 sm:py-16 xl:px-14">
          <div className="community-opening-copy">
            <p className="label community-opening-kicker">La Fabrique des Héros <span aria-hidden="true">/</span> Communauté</p>
            <h1 id="community-title" className="mt-5">
              On avance <span className="community-opening-accent">mieux</span> quand on avance ensemble.
            </h1>
            <p className="community-opening-intro mt-6 max-w-2xl">
              Des jeunes qui osent essayer, des adultes qui transmettent et des idées qui passent d’une personne à l’autre. Découvre les voix et les espaces du mouvement.
            </p>
            <div className="community-opening-actions mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={() => defilerVers("community-stories")} className="btn btn-or">
                Lire les histoires <MoveRight size={16} />
              </button>
              <button type="button" onClick={() => defilerVers("community-cities")} className="btn btn-craie">
                Choisir une ville <MapPin size={16} />
              </button>
            </div>
            <p className="community-opening-counts" aria-label={`${histoires.length} récits publiés dans ${villes.length - 1} villes`}>
              <span><strong>{String(histoires.length).padStart(2, "0")}</strong> récits publiés</span>
              <span><strong>{String(villes.length - 1).padStart(2, "0")}</strong> villes citées</span>
            </p>
          </div>
          <div className="community-opening-figure">
            <PhotoCadre photo={photos.communaute} ratio="4 / 3" ratioMobile="16 / 10" creditVisible={false} prioritaire sizes="(min-width: 1024px) 48vw, 100vw" />
            <p className="community-opening-caption">Photo d’illustration — un groupe de jeunes adultes en discussion.</p>
          </div>
        </div>
      </section>

      <section id="community-cities" className="community-cities relative isolate scroll-mt-20 overflow-hidden bg-paper py-14 text-paper sm:py-[4.5rem]" aria-labelledby="community-cities-title">
<FondPhoto photo={fonds.villes} mode="multiply" opacite={0.3} />
        <div className="mx-auto grid w-full max-w-[1440px] gap-8 px-5 sm:px-8 xl:grid-cols-[.72fr_1.28fr] xl:px-14">
          <div>
            <p className="label text-bordeaux">Les récits, ville par ville</p>
            <h2 id="community-cities-title" className="display-l mt-4 max-w-xl">Chaque voix a <span className="livre font-normal text-bordeaux">son lieu.</span></h2>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-paper/75">Choisis une ville pour retrouver les témoignages qui y sont associés. Les noms ci-dessous viennent des récits publiés sur le site.</p>
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
            <p className="mt-4 text-[13px] text-paper/65" role="status" aria-live="polite">
              {histoiresVisibles.length} {histoiresVisibles.length > 1 ? "histoires affichées" : "histoire affichée"}
              {villeActive !== "Toutes" ? ` · ${villeActive}` : " · toutes les villes"}
            </p>
            <VillePanel ville={villeActive} />
          </div>
        </div>
      </section>

      <section id="community-stories" className="community-stories scroll-mt-20 bg-ink py-14 text-paper sm:py-20" aria-labelledby="community-stories-title">
        <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 xl:px-14">
          <div className="community-stories-heading mb-10">
            <div>
              <p className="label community-stories-kicker"><span>Paroles partagées</span><span className="community-stories-count">{String(histoiresVisibles.length).padStart(2, "0")} récits</span></p>
              <h2 id="community-stories-title" className="display-l mt-3">Les mots de la <span className="livre font-normal text-bordeaux">communauté.</span></h2>
            </div>
            <p className="max-w-md text-[14px] leading-relaxed text-paper/70">Chaque histoire reste celle de la personne qui la raconte. Les photos montrent uniquement les villes en guise d’illustration.</p>
          </div>
          <Paroles histoires={histoiresVisibles} />
        </div>
      </section>

      <section id="community-portrait" className="community-hero-of-month scroll-mt-20 border-y-2 border-ink/10 bg-paper py-16 text-ink sm:py-24" aria-labelledby="community-portrait-title">
        <div className="mx-auto grid w-full max-w-[1440px] items-center gap-8 px-5 sm:px-8 lg:grid-cols-[.85fr_1.15fr] xl:gap-14 xl:px-14">
          <div>
            <div className="relative pb-10 pr-6 sm:pr-10">
<PhotoCadre photo={photoTissage} ratio="4 / 3" className="border-2 border-ink/15" />
<div className="duo-incrust absolute bottom-0 right-0 w-[40%]" style={{ ["--duo-bg" as string]: "#FFF0D9" }}><PhotoCadre photo={photos.etoffes} ratio="4 / 5" creditVisible={false} /></div>
</div>
            <p className="mt-3 text-[11.5px] leading-relaxed text-paper/65">Photo d’illustration du tissage, prise à Fès au Maroc; elle ne montre ni Fatoumata Diallo ni Pont d’Or.</p>
          </div>
          <div>
            <p className="label text-bordeaux">Portrait d’archive · {herosDuMois.periode}</p>
            <h2 id="community-portrait-title" className="display-l mt-4 max-w-3xl">{herosDuMois.nom}<span className="text-bordeaux">.</span></h2>
            <p className="mt-3 flex items-center gap-2 text-[13.5px] font-semibold text-paper/70"><MapPin size={15} aria-hidden="true" /> {herosDuMois.ville} · Profil {herosDuMois.profil}</p>
            <p className="mt-6 text-[16px] leading-relaxed text-paper/85">{herosDuMois.recit}</p>
            <blockquote className="mt-6 border-l-[5px] border-bordeaux pl-5 font-display text-[clamp(1.35rem,3vw,2.2rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-bordeaux">{herosDuMois.secret}</blockquote>
            <button type="button" aria-expanded={interviewOuverte} aria-controls="community-interview" onClick={() => setInterviewOuverte((ouverte) => !ouverte)} className="mt-7 inline-flex items-center gap-2 border-b-2 border-ink pb-2 text-[13px] font-bold uppercase tracking-[0.1em] transition-colors hover:border-bordeaux hover:text-bordeaux focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bordeaux">
              {interviewOuverte ? "Fermer l’interview" : "Lire l’interview"}
              <ChevronDown size={16} className={`transition-transform ${interviewOuverte ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>
            <dl id="community-interview" hidden={!interviewOuverte} className="mt-7 space-y-5 border-t border-ink/15 pt-6">
              {herosDuMois.interview.map((item) => <div key={item.q}><dt className="font-display text-[18px] font-extrabold leading-snug">{item.q}</dt><dd className="mt-2 text-[15px] leading-relaxed text-paper/70">« {item.r} »</dd></div>)}
            </dl>
          </div>
        </div>
      </section>

      <section id="community-spaces" className="community-spaces inverse relative isolate overflow-hidden bg-ink py-16 text-paper sm:py-20" aria-labelledby="community-spaces-title">
<FondPhoto photo={fonds.espaces} />
        <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 xl:px-14">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div><p className="label text-or">La suite t’appartient</p><h2 id="community-spaces-title" className="display-l mt-3 max-w-3xl">Trouve ton <span className="livre font-normal text-or">prochain pas.</span></h2></div>
            <p className="max-w-lg text-[15px] leading-relaxed text-ink/75">Explore un espace déjà disponible, ou écris à l’atelier pour demander l’accès aux espaces membres.</p>
          </div>
          <ul className="community-space-list mt-9">
            {communauteEspaces.map((espace, index) => {
              const cible = cibleEspace[espace.id];
              const etat = etatEspace[espace.id];
              const className = "community-space-link group";
              const contenu = <><span className="community-space-photo"><Vignette photo={espacePhotos[espace.id]} largeur={640} decoratif className="h-full w-full object-cover" /></span><span className="community-space-top"><span className="font-display text-[13px] font-extrabold text-or">{String(index + 1).padStart(2, "0")}</span><span className="community-space-status">{etat.label}</span></span><h3>{espace.titre}</h3><p>{espace.texte}</p><span className="community-space-action">{etat.detail} <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" /></span></>;
              return <li key={espace.id}>{cible.type === "section" ? <button type="button" onClick={() => defilerVers(cible.cible)} className={className}>{contenu}</button> : <a href={cible.href} className={className} aria-label={`${espace.titre} — ${cible.action}`}>{contenu}</a>}</li>;
            })}
          </ul>
          <div className="community-quiz-callout mt-8">
            <div><p className="label text-ink/70">Besoin d’un point de départ ?</p><p className="mt-2 max-w-2xl font-display text-[21px] font-extrabold leading-tight">Commence par découvrir ton profil, puis choisis l’espace qui te ressemble.</p><p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-ink/75">Le quiz est gratuit et te donne une première direction. Tu peux ensuite revenir ici pour lire, échanger ou demander un accompagnement.</p></div>
            <Link to="/quiz" className="btn btn-or shrink-0">Commencer par le quiz <ArrowRight size={16} /></Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-3"><Link to="/defis" className="btn btn-or">Rejoindre un défi collectif <ArrowRight size={16} /></Link><Link to="/quiz" className="btn btn-craie">Découvrir mon profil</Link><Link to="/bibliotheque" className="btn btn-craie">Explorer la bibliothèque</Link></div>
        </div>
      </section>

      <section id="community-share" className="community-share inverse relative isolate overflow-hidden bg-bordeaux py-14 text-ink sm:py-20" aria-labelledby="community-share-title">
<Vignette photo={photos.partage} largeur={1600} decoratif className="community-share-photo" />
        <div className="relative mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-5 sm:px-8 lg:flex-row lg:items-end lg:justify-between xl:px-14">
          <div className="max-w-3xl"><p className="label text-or">À toi de jouer</p><h2 id="community-share-title" className="display-l mt-3">Ton histoire peut ouvrir une porte.</h2><p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/75">Le bouton prépare un email à l’atelier. Rien n’est envoyé ni publié automatiquement : tu peux relire ton message avant de l’envoyer.</p></div>
          <a href={sujetTemoignage} className="btn btn-or shrink-0">Partager mon histoire <ArrowUpRight size={16} /></a>
        </div>
      </section>
    </>
  );
}
