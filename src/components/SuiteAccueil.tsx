import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowLeft, ArrowRight, ArrowUpRight, MoveRight, Mail, Check } from "lucide-react";
import { Etoile, Etiquette, Monogramme, Vu } from "./Atelier";
import { Livre } from "./Livre";
import { Link } from "../lib/router";
import { mouvementReduit, usePetitEcran } from "../lib/motion";
import { FondPhoto, PhotoCadre, Vignette } from "./Photo";
import { PhotoLegendee } from "./Visuels";
import { defiPhotos, fonds, photos, voixPhotos } from "../data/media";
import { defisMeta, fcfa, herosDuMois, kit, kitProduit, marque, temoignages } from "../data/site";
import missions from "../data/defis.json";

const ENCRE_DEFI = [
  "#FFB000",
  "color-mix(in srgb, #FFB000 84%, #321044)",
  "color-mix(in srgb, #FFB000 82%, #FFF0D9)",
];

const LOGOS_PRESSE = [
  { id: "rti", nom: "RTI", src: "/press-logos/rti.svg", largeur: 512, hauteur: 340 },
  { id: "fraternite-matin", nom: "Fraternité Matin", src: "/press-logos/fraternite-matin.png", largeur: 1630, hauteur: 599 },
  { id: "bbc", nom: "BBC Afrique", src: "/press-logos/bbc-afrique.svg", largeur: 300, hauteur: 42 },
  { id: "jeune-afrique", nom: "Jeune Afrique", src: "/press-logos/jeune-afrique.svg", largeur: 512, hauteur: 99 },
  { id: "tv5monde", nom: "TV5MONDE", src: "/press-logos/tv5monde.png", largeur: 500, hauteur: 164 },
] as const;

/* ————— 06 · LES DÉFIS : trois bandes, pas trois cartes ————— */
function Defis() {
  const [actif, setActif] = useState<number | null>(null);
  return (
    <section id="poste-06" className="champ relative">
      <div className="relative mx-auto w-full max-w-[1320px]">
        <Etiquette num="06" label="Les défis" />
        <div className="grid gap-12 pt-8 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Vu>
              <h2 className="display-l uppercase">
                De lecteur<br />à héros<br />
                <span className="text-or">en action.</span>
              </h2>
              <p className="text-dim mt-2">
                Les défis transforment la lecture en habitude, et l’habitude en superpouvoir. Rejoins des milliers de héros qui avancent chaque jour.
              </p>
              <Link to="/defis" className="btn btn-or mt-7">
                Rejoindre un défi <MoveRight size={16} />
              </Link>
            </Vu>
          </div>

          <ul className="flex flex-col lg:col-span-8">
            {defisMeta.map((d, i) => (
              <li key={d.id}>
              <div className="mb-3 overflow-hidden rounded-2xl sm:hidden"><Vignette photo={defiPhotos[d.id]} largeur={800} decoratif className="aspect-[16/9] w-full object-cover" /></div>
              <Link
                to={`/defis#defi-${d.id}`}
                  onMouseEnter={() => setActif(i)}
                  onMouseLeave={() => setActif(null)}
                  onFocus={() => setActif(i)}
                  onBlur={() => setActif(null)}
                  className="group flex items-center gap-5 border-t border-paper/15 px-1 py-6 transition-colors duration-300 last:border-b sm:gap-6 sm:px-2"
                  style={{ background: actif === i ? ENCRE_DEFI[i] : "transparent", color: actif === i ? "#FFF0D9" : "#321044" }}
                >
                  <span
                    className="w-14 shrink-0 text-center font-display text-3xl font-extrabold transition-colors sm:w-20 sm:text-4xl"
                    style={{ color: actif === i ? "#FFF0D9" : ENCRE_DEFI[i] }}
                  >
                    {d.jours}
                  </span>
                  <span className="flex-1">
                    <span className="block font-display text-lg font-extrabold uppercase sm:text-xl">{d.titre}</span>
                    <span className="mt-1 block opacity-75">{d.texte}</span>
                    <span className="mt-2 block font-mono text-xs font-bold uppercase opacity-70">
                      {(missions as Record<string, string[]>)[d.id][0]}
                    </span>
                  </span>
                  <span className="hidden h-20 w-28 shrink-0 overflow-hidden rounded-2xl sm:block"><Vignette photo={defiPhotos[d.id]} largeur={420} decoratif className="h-full w-full object-cover" /></span>
                  <span className="hidden shrink-0 rounded-full border px-3 py-1.5 font-body text-xs font-bold uppercase sm:block" style={{ borderColor: "currentColor" }}>
                    {d.offre}
                  </span>
                  <MoveRight size={26} className="shrink-0 transition-transform duration-300 group-hover:translate-x-2" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ————— 07 · LES VOIX ————— */
function Voix() {
  const [active, setActive] = useState(0);
  const principal = temoignages[active];
  const citation = useRef<HTMLDivElement>(null);
  const avancer = (sens: number) => setActive((index) => (index + sens + temoignages.length) % temoignages.length);

  useLayoutEffect(() => {
    const el = citation.current;
    if (!el || mouvementReduit()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el, { autoAlpha: 0, x: 34, y: 12, rotationY: 6 }, { autoAlpha: 1, x: 0, y: 0, rotationY: 0, duration: 0.82, ease: "power3.out" });
    }, el);
    return () => ctx.revert();
  }, [active]);

  return (
    <section id="poste-07" className="champ inverse relative overflow-hidden">
      <FondPhoto photo={fonds.voix} />
      <div className="voix-trame pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative z-10 mx-auto w-full max-w-[1320px]">
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Etiquette num="07" label="Les voix" fond="#FFF0D9" encre="#321044" />
            <h2 className="display-xl mt-3 uppercase">Le fil passe.<br /><span className="text-jaune">La voix reste.</span></h2>
          </div>
          <p className="text-dim lg:col-span-4 lg:col-start-9">
            Trois parcours, trois voix. Choisis une page : les mots et la personne derrière le récit apparaissent ensemble.
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <Vu className="lg:col-span-8">
            <figure className="voix-page relative">
              <div className="voix-page-top">
                <span>Archives du mouvement</span>
                <span className="flex items-center gap-1.5"><Etoile taille={14} fil="#FFB000" /> Pièce 0{active + 1}</span>
              </div>
              <div className="voix-page-number" aria-hidden="true">0{active + 1}</div>
              <div ref={citation} className="voix-page-copy">
                <p className="voix-page-kicker">Témoignage · paroles conservées</p>
                <blockquote aria-live="polite" aria-atomic="true" className="font-display text-[clamp(1.8rem,3.9vw,3.35rem)] font-extrabold uppercase">
                  « {principal.texte} »
                </blockquote>
              </div>
              <figcaption className="voix-page-author">
                <Monogramme initiales={principal.initiales} fil={principal.fil} taille={54} />
                <span>
                  <strong>{principal.nom}</strong>
                  <span>{principal.detail}</span>
                </span>
                <span className="voix-page-edition">Active ton<br />Superpouvoir</span>
              </figcaption>
              <div className="voix-page-foot"><span>La Fabrique des Héros</span><span>0{active + 1} / 0{temoignages.length}</span></div>
            </figure>
          </Vu>

          <div className="voix-controls lg:col-span-4">
            <div>
              <p className="label">Dossier des voix</p>
              <p className="mt-1 font-display font-extrabold uppercase">Feuillette les récits</p>
            </div>
            <figure key={active} className="voix-photo">
              <PhotoCadre photo={voixPhotos[active]} ratio="16 / 10" sizes="(min-width: 1024px) 30vw, 100vw" />
              <figcaption>{voixPhotos[active].legende}</figcaption>
            </figure>
            <div className="grid gap-3">
              {temoignages.map((t, i) => {
                const selectionne = active === i;
                return (
                  <button
                    key={t.nom}
                    type="button"
                    aria-pressed={selectionne}
                    aria-label={`Afficher le témoignage de ${t.nom}, ${String(i + 1).padStart(2, "0")} sur ${String(temoignages.length).padStart(2, "0")}`}
                    onClick={() => setActive(i)}
                    className={`voix-option flex items-center rounded-[16px] border text-left ${selectionne ? "voix-option--active" : ""}`}
                    style={{ "--voix-fil": t.fil } as React.CSSProperties}
                  >
                    <span className="voix-selector-index shrink-0">0{i + 1}</span>
                    <span className="flex-1">
                      <span className="block font-display font-extrabold uppercase">{t.nom}</span>
                      <span className="block opacity-80">{t.detail}</span>
                    </span>
                    <MoveRight size={18} className="shrink-0" />
                  </button>
                );
              })}
            </div>
            <div className="flex items-center justify-between border-t border-ink/25 pt-5">
              <div className="voix-pager-lines" aria-hidden="true">
                {temoignages.map((t, i) => <span key={t.nom} className={i === active ? "active" : ""} />)}
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => avancer(-1)} className="voix-control flex items-center justify-center rounded-full border border-ink/35" aria-label="Témoignage précédent"><ArrowLeft size={18} /></button>
                <button type="button" onClick={() => avancer(1)} className="voix-control flex items-center justify-center rounded-full border border-ink/35" aria-label="Témoignage suivant"><ArrowRight size={18} /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ————— 08 · HÉROS DU MOIS ————— */
function Heros() {
  return (
    <section id="poste-08" className="champ relative bg-jaune/12">
      <div className="relative mx-auto w-full max-w-[1320px]">
        <Etiquette num="08" label="Héros du mois" />
        <div className="grid gap-10 pt-8 lg:grid-cols-12 lg:items-center lg:gap-16">
          <Vu className="lg:col-span-4">
            <div className="relative mb-6">
              <PhotoCadre photo={photos.abidjan} ratio="3 / 4" className="rounded-[22px] ombre">
                <div className="pointer-events-none absolute inset-x-0 top-0 rounded-t-[22px] bg-paper/85 px-5 py-3">
                  <span className="text-xs font-semibold uppercase tracking-wide text-jaune">{herosDuMois.periode}</span>
                </div>
                <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 p-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-jaune font-display font-extrabold text-paper">
                    {herosDuMois.initiales}
                  </span>
                  <span className="rounded-full bg-paper px-3 py-1.5 text-xs font-semibold uppercase text-ink">
                    {herosDuMois.ville} · {herosDuMois.profil}
                  </span>
                </div>
              </PhotoCadre>
              <div className="duo-incrust absolute" style={{ ["--duo-bg" as string]: "#FFB000" }}><PhotoCadre photo={photos.etoffes} ratio="1 / 1" creditVisible={false} /></div>
            </div>
            <p className="text-dim-2 mt-3">
              Abidjan, ville du mouvement, et étoffes d’un marché africain. Photographies d’illustration — aucun portrait de la personne citée n’est publié.
            </p>
          </Vu>
          <Vu delay={120} className="lg:col-span-8">
            <h2 className="display-l uppercase">{herosDuMois.nom}</h2>
            <p className="text-dim mt-4">{herosDuMois.recit}</p>
            <p className="mt-6 border-l-[6px] border-or py-1 pl-5 font-display text-lg font-extrabold uppercase sm:text-xl">
              {herosDuMois.secret}
            </p>
            <Link to="/communaute" className="btn btn-or mt-7">
              Lire son interview <MoveRight size={16} />
            </Link>
          </Vu>
        </div>
      </div>
    </section>
  );
}

/* ————— 09 · LE KIT ————— */
function Kit() {
  const petit = usePetitEcran(640);
  return (
    <section id="poste-09" className="relative">
      <div className="relative mx-auto w-full max-w-[1320px] px-5 py-14 sm:px-8 sm:py-20 xl:px-12">
        <Etiquette num="09" label="L’offre de l’atelier" />
        <div className="champ inverse mt-8 grid items-center gap-10 overflow-hidden rounded-[28px] bg-paper ombre lg:grid-cols-12 lg:gap-16">
          <FondPhoto photo={fonds.kit} />
          <Vu className="lg:col-span-6">
            <div className="relative flex items-center justify-center py-6">
              <div className="translate-y-3 rotate-[-9deg]">
                <Livre largeur={petit ? 88 : 140} inclinaison={-14} ouverture={0} interactif={false} />
              </div>
              <div className="rotate-[2deg]">
                <Livre largeur={petit ? 112 : 175} inclinaison={-16} ouverture={0} interactif={false} priere="Mon Journal de Superpouvoir" />
              </div>
              <div className="translate-y-5 rotate-[11deg]">
                <Livre largeur={petit ? 88 : 140} inclinaison={-12} ouverture={0} interactif={false} priere="Rituels — 60 jours" />
              </div>
            </div>
          </Vu>

          <Vu delay={120} className="lg:col-span-6">
            <p className="label">Offre spéciale</p>
            <h2 className="display-l mt-2 uppercase">{kit.nom}</h2>
            <p className="text-dim mt-2">{kit.contenu}</p>
            <div className="mt-5 flex flex-wrap items-end gap-3 border-t border-ink/20 pt-5">
              <span className="font-display text-3xl font-extrabold text-jaune sm:text-4xl">{fcfa(kit.fcfa)}</span>
              <span className="text-dim-2 text-lg line-through">{fcfa(kit.barre)}</span>
            </div>
            <p className="text-dim-2 mt-3">
              Prix affiché par le mouvement. Ajoute-le au panier pour réserver ta pièce — l’atelier n’utilise pas de paiement en ligne.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to={`/boutique/${kitProduit.slug}`} className="btn btn-or !border-jaune">
                Commander le kit <ArrowUpRight size={16} />
              </Link>
              <Link to="/boutique" className="btn btn-craie">
                Le détail des pièces
              </Link>
            </div>
          </Vu>
        </div>
      </div>
    </section>
  );
}

/* ————— 10 · LE RITUEL ————— */
function Rituel() {
  const [mail, setMail] = useState("");
  const [pret, setPret] = useState(false);

  const lien = `mailto:${marque.email}?subject=${encodeURIComponent("Inscription — Rituel Hebdo")}&body=${encodeURIComponent(
    `Bonjour Nadine,\n\nJe souhaite recevoir le Rituel Hebdo (affirmation du lundi, défi de la semaine, histoire d’un héros).\n\nMon email : ${mail}\nMon prénom :\nMa ville :\n\nMerci !`
  )}`;

  return (
    <section id="poste-10" className="champ inverse relative overflow-hidden bg-paper text-ink">
      <FondPhoto photo={fonds.rituel} />
      <div className="trame-points pointer-events-none absolute inset-0 opacity-[0.18] invert" aria-hidden="true" />
      <div className="relative z-10 mx-auto grid w-full max-w-[1320px] gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <Etiquette num="10" label="Le rituel hebdo" fond="#FFF0D9" encre="#321044" />
          <Vu>
            <h2 className="display-l mt-3 uppercase">
              Une affirmation.<br />Un défi.<br />
              <span className="text-jaune">Chaque semaine.</span>
            </h2>
            <p className="text-dim mt-2">
              Rejoins +12 000 héros qui reçoivent chaque lundi leur dose de superpouvoir — gratuit, sans spam.
            </p>
            <PhotoLegendee photo={photos.rituelMatin} ratio="16 / 10" className="mt-6" />
          </Vu>
        </div>

        <div className="lg:col-span-6">
          <Vu delay={100}>
            <ul className="flex flex-col gap-3">
              {["Affirmation du lundi", "Défi de la semaine", "Histoire d’un héros"].map((x) => (
                <li key={x} className="flex items-center gap-2.5 font-display text-base font-extrabold uppercase">
                  <Check size={18} className="text-jaune" /> {x}
                </li>
              ))}
            </ul>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setPret(true);
                window.location.href = lien;
              }}
              className="mt-7 flex flex-col gap-3 sm:flex-row"
            >
              <label className="sr-only" htmlFor="mail-rituel">
                Ton adresse email
              </label>
              <input
                id="mail-rituel"
                type="email"
                required
                value={mail}
                onChange={(e) => setMail(e.target.value)}
                placeholder="ton@email.com"
                className="h-[52px] flex-1 rounded-full border border-ink/40 bg-transparent px-5 text-ink outline-none transition-colors placeholder:text-ink/45 focus:border-jaune"
              />
              <button type="submit" className="btn btn-or justify-center whitespace-nowrap">
                <Mail size={16} /> Je m’inscris
              </button>
            </form>
            <p className="text-dim-2 mt-4" role="status">
              {pret
                ? "Ta messagerie s’ouvre avec ta demande d’inscription. Envoie-la pour rejoindre le rituel."
                : "Ta demande s’ouvre dans ta messagerie et part directement à l’atelier — aucun formulaire fantôme, aucune donnée stockée à ton insu."}
            </p>
          </Vu>
        </div>
      </div>
    </section>
  );
}

/* ————— PRESSE ————— */
function Presse() {
  return (
    <section className="media-press-section" aria-labelledby="media-press-title">
      <div className="media-press-heading">
        <h2 id="media-press-title" className="label flex items-center gap-2">
          <Etoile taille={13} /> Ils parlent de nous
        </h2>
      </div>
      <ul className="media-press-logos">
        {LOGOS_PRESSE.map((media) => (
          <li key={media.id} className={`media-press-logo media-press-logo--${media.id}`}>
            <img src={media.src} alt={media.nom} width={media.largeur} height={media.hauteur} loading="lazy" decoding="async" />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function SuiteAccueil() {
  return (
    <>
      <Defis />
      <Voix />
      <Heros />
      <Kit />
      <Rituel />
      <Presse />
    </>
  );
}
