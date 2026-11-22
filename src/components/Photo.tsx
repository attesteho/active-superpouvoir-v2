import type { ReactNode } from "react";
import type { Photo } from "../data/media";

/** Cadre pour une illustration éditoriale (carte, vignette d'en-tête, etc.). */
export function PhotoCadre({
  photo,
  className = "",
  voile = false,
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
  return (
    <figure className={`photo-cadre relative overflow-hidden ${className}`}>
      <img
        src={photo.src}
        alt={photo.alt}
        loading="lazy"
        className="h-full w-full object-cover"
        style={{ objectPosition: photo.pos || "50% 50%" }}
      />
      {voile && <div className="absolute inset-0 bg-gradient-to-t from-paper/50 via-transparent to-transparent" />}
      {children}
    </figure>
  );
}

/**
 * Photo de fond d'une grande section : fondue en aplat (luminosity sur fond sombre,
 * multiply sur fond clair), jamais affichée pleine saturation.
 */
export function FondPhoto({ photo, mode = "luminosity", opacite = 0.16 }: { photo: Photo; mode?: "luminosity" | "multiply"; parallaxe?: boolean; opacite?: number }) {
  return (
    <img
      src={photo.src}
      alt=""
      aria-hidden="true"
      loading="lazy"
      className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      style={{ objectPosition: photo.pos || "50% 50%", opacity: opacite, mixBlendMode: mode }}
    />
  );
}

/** Petite image brute, décorative ou non. */
export function Vignette({
  photo,
  className = "",
  decoratif = true,
}: {
  photo: Photo;
  largeur?: number;
  className?: string;
  decoratif?: boolean;
  immediat?: boolean;
}) {
  return (
    <img
      src={photo.src}
      alt={decoratif ? "" : photo.alt}
      aria-hidden={decoratif || undefined}
      loading="lazy"
      className={`object-cover ${className}`}
      style={{ objectPosition: photo.pos || "50% 50%" }}
    />
  );
}
