import { useState, type CSSProperties, type ReactNode } from "react";
import { taille, type Photo } from "../data/media";

/**
 * Photographie éditoriale : ratio réservé (aucun saut de mise en page), fond d'attente,
 * srcset pour ne charger que la bonne largeur, attribution facultative masquée par défaut,
 * et dégradé de lisibilité
 * uniquement si du texte est posé dessus. Le ratio peut différer entre mobile et bureau.
 */
export function PhotoCadre({
  photo,
  ratio = "16 / 9",
  ratioMobile,
  className = "",
  voile = false,
  creditVisible = false,
  prioritaire = false,
  sizes = "(min-width: 1024px) 60vw, 100vw",
  children,
}: {
  photo: Photo;
  ratio?: string;
  ratioMobile?: string;
  className?: string;
  voile?: boolean;
  creditVisible?: boolean;
  prioritaire?: boolean;
  sizes?: string;
  children?: ReactNode;
}) {
  const [chargee, setChargee] = useState(false);
  const [erreur, setErreur] = useState(false);
  const style = { "--r": ratio, "--rm": ratioMobile ?? ratio } as CSSProperties;

  return (
    <figure className={`photo-cadre ${className}`} style={style}>
      {!erreur && (
        <img
          ref={(el) => {
            if (el && el.complete && el.naturalWidth > 0 && !chargee) setChargee(true);
          }}
          src={taille(photo, 1200)}
          srcSet={`${taille(photo, 640)} 640w, ${taille(photo, 1000)} 1000w, ${taille(photo, 1600)} 1600w`}
          sizes={sizes}
          alt={photo.alt}
          width={photo.largeur}
          height={photo.hauteur}
          loading={prioritaire ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={prioritaire ? "high" : "auto"}
          onLoad={() => setChargee(true)}
          onError={() => setErreur(true)}
          style={{ objectPosition: photo.pos, opacity: chargee ? 1 : 0, transition: "opacity .6s ease, scale .9s cubic-bezier(.16,1,.3,1)" }}
        />
      )}
      {erreur && <div className="photo-secours" role="img" aria-label={photo.alt} />}
      {voile && <div className="photo-voile" aria-hidden="true" />}
      {children}
      {creditVisible && (
        <figcaption className="photo-credit">
          Photo&nbsp;
          <a href={photo.creditUrl} target="_blank" rel="noreferrer noopener">
            {photo.credit}
          </a>
        </figcaption>
      )}
    </figure>
  );
}

/**
 * Photo de fond d'une grande section : niveaux de gris fondus dans la couleur de la section
 * (luminosity sur aplat sombre, multiply sur aplat clair). Aucun dégradé.
 */
export function FondPhoto({
  photo,
  mode = "luminosity",
  parallaxe = true,
  opacite,
}: {
  photo: Photo;
  mode?: "luminosity" | "multiply";
  parallaxe?: boolean;
  opacite?: number;
}) {
  return (
    <div className={`fond-photo fond-photo--${mode}`} data-parallaxe={parallaxe ? "1" : undefined} style={opacite === undefined ? undefined : { opacity: opacite }} aria-hidden="true">
      <img src={taille(photo, 1600)} alt="" loading="lazy" decoding="async" />
    </div>
  );
}

/** Petite image brute (vignettes, bandeaux). `decoratif` : le texte voisin porte déjà le sens. */
export function Vignette({
  photo,
  largeur = 640,
  className = "",
  decoratif = false,
  immediat = false,
}: {
  photo: Photo;
  largeur?: number;
  className?: string;
  decoratif?: boolean;
  immediat?: boolean;
}) {
  return (
    <img
      src={taille(photo, largeur)}
      alt={decoratif ? "" : photo.alt}
      width={photo.largeur}
      height={photo.hauteur}
      loading={immediat ? "eager" : "lazy"}
      decoding="async"
      className={className}
      style={{ objectPosition: photo.pos }}
    />
  );
}
