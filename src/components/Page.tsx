import { type ReactNode } from "react";
import { Etiquette, Etoile, LignesMasquees, BandeKente } from "./Atelier";
import { PhotoCadre } from "./Photo";
import { type Photo } from "../data/media";

/** Photo du hero : cadre ivoire, bloc ambre décalé et légende sur plaque. */
export function HeroPhoto({ photo, ratio = "4 / 5" }: { photo: Photo; ratio?: string }) {
  return (
    <div className="hero-photo lg:col-span-5">
      <div className="hero-photo-bloc" aria-hidden="true" />
      <PhotoCadre photo={photo} ratio={ratio} ratioMobile="4 / 3" prioritaire creditVisible={false} className="hero-photo-img" sizes="(min-width: 1024px) 40vw, 100vw" />
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
  intro,
  enfants,
  fil = "#FFB000",
  photo,
}: {
  surtitre: string;
  lignes: ReactNode[];
  intro?: string;
  enfants?: ReactNode;
  fil?: string;
  photo?: Photo;
  /** Conservé pour compatibilité : le hero a désormais une seule composition. */
  variante?: "bande" | "decale";
}) {
  const barre = fil === "#321044" ? "#F3781E" : fil;
  return (
    <header className="hero-page relative isolate overflow-hidden" style={{ ["--hero-accent" as string]: barre }}>
      <div className="" style={{ background: barre }} />
      <div className="trame-points pointer-events-none absolute opacity-[0.05]" aria-hidden="true" />
      {!photo && (
        <svg className="hero-etoile" viewBox="0 0 100 100" aria-hidden="true">
          <polygon points="50,7 60,36.3 90.9,36.7 66.2,55.3 75.3,84.8 50,67 24.7,84.8 33.8,55.3 9.1,36.7 40,36.3" fill="none" stroke={barre} strokeWidth="1" />
        </svg>
      )}
      <div className="relative grid lg:grid-cols-12 lg:items-center">
        <div className={photo ? "lg:col-span-7" : "lg:col-span-9"}>
          <p className="hero-surtitre">{surtitre}</p>
          <h1 className="uppercase">
            <LignesMasquees lignes={lignes} />
          </h1>
          {intro && <p className="text-dim">{intro}</p>}
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
}: {
  titre?: string;
  numero?: string;
  children: ReactNode;
  fil?: string;
  className?: string;
}) {
  return (
    <section className={`${className}`}>
      {(titre || numero) && <Etiquette num={numero || "—"} label={titre || ""} fond={fil} />}
      {children}
    </section>
  );
}
