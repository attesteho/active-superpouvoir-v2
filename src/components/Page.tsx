import { type ReactNode } from "react";
import { Etiquette, Etoile, LignesMasquees, BandeKente } from "./Atelier";
import { PhotoCadre } from "./Photo";
import { Parallax } from "./Parallax";
import { type Photo } from "../data/media";

/** Photo du hero : cadre ivoire, bloc ambre décalé et légende sur plaque. */
export function HeroPhoto({ photo, ratio = "4 / 5" }: { photo: Photo; ratio?: string }) {
  return (
    <div className="hero-photo lg:col-span-5">
      <div className="hero-photo-cadre hero-photo-cadre--bd">
        <div className="hero-photo-bloc" aria-hidden="true" />
        <span className="hero-photo-sticker" aria-hidden="true">
          <Etoile taille={30} fil="#FFB000" />
        </span>
        <Parallax vitesse={0.82} ampleur={12}>
          <PhotoCadre photo={photo} ratio={ratio} ratioMobile="4 / 3" prioritaire creditVisible={false} className="hero-photo-img" sizes="(min-width: 1024px) 40vw, 100vw" />
        </Parallax>
      </div>
      <p className="hero-photo-legende">
        <Etoile taille={18} fil="#FFB000" />
        <span>{photo.legende}</span>
      </p>
    </div>
  );
}

/**
 * Hero de page (toutes les pages sauf l'accueil) : aplat aubergine, trame d'imprimerie, surtitre en pastille,
 * titre affiche, intro, et — quand une photo est fournie — une composition éditoriale à droite.
 * Sans photo, une grande étoile en contour tient la place.
 */
export function EntetePage({
  surtitre,
  lignes,
  enfants,
  fil = "#FFB000",
  photo,
  arrierePlan,
  arrierePlanPosition = "center right",
}: {
  surtitre: string;
  lignes: ReactNode[];
  intro?: string;
  enfants?: ReactNode;
  fil?: string;
  photo?: Photo;
  /** Texture/illustration de fond pleine largeur (ex. "/images/02-quiz-introduction.webp"). */
  arrierePlan?: string;
  /** Cadrage du fond (cf. manifest.json du lot de fonds) — "center right" par défaut. */
  arrierePlanPosition?: string;
  /** Conservé pour compatibilité : le hero a désormais une seule composition. */
  variante?: "bande" | "decale";
}) {
  const barre = fil === "#321044" ? "#F3781E" : fil;
  return (
    <header className="hero-page relative isolate overflow-hidden" style={{ ["--hero-accent" as string]: barre }}>
      {arrierePlan && (
        <img
          src={arrierePlan}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover"
          style={{ objectPosition: arrierePlanPosition }}
        />
      )}
      <div className="" style={{ background: barre }} />
      <div className="trame-points pointer-events-none absolute opacity-[0.05]" aria-hidden="true" />
      {!photo && (
        <svg className="hero-etoile" viewBox="0 0 100 100" aria-hidden="true">
          <polygon points="50,7 60,36.3 90.9,36.7 66.2,55.3 75.3,84.8 50,67 24.7,84.8 33.8,55.3 9.1,36.7 40,36.3" fill="none" stroke={barre} strokeWidth="1" />
        </svg>
      )}
      <div className="relative grid lg:grid-cols-12 lg:items-center">
        <div className={photo ? "lg:col-span-7" : "lg:col-span-9"}>
          <p className="hero-surtitre hero-surtitre--bd">
            <Etoile taille={14} fil="#FFB000" />
            {surtitre}
          </p>
          <h1 className="uppercase">
            <LignesMasquees lignes={lignes} />
          </h1>
          {enfants}
        </div>
        {photo && <HeroPhoto photo={photo} />}
      </div>
      <BandeKente hauteur={12} />
    </header>
  );
}

export function Bloc({
  titre,
  numero,
  children,
  fil = "#321044",
  className = "",
  id,
}: {
  titre?: string;
  numero?: string;
  children: ReactNode;
  fil?: string;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`bloc-page relative isolate overflow-hidden ${className}`} style={{ ["--bloc-fil" as string]: fil }}>
      {(titre || numero) && <Etiquette num={numero || "—"} label={titre || ""} fond={fil} />}
      {children}
    </section>
  );
}
