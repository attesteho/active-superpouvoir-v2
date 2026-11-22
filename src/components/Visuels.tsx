import type { ReactNode } from "react";
import { PhotoCadre } from "./Photo";
import { Livre } from "./Livre";
import { VisuelProduit } from "./VisuelProduit";
import { ambianceProduit, type Photo } from "../data/media";
import type { Produit } from "../data/site";
import { usePetitEcran } from "../lib/motion";

/** Photo + légende éditoriale en dessous : une image qui s'explique, sans cadre ajouté. */
export function PhotoLegendee({
  photo,
  ratio = "4 / 3",
  ratioMobile,
  className = "",
  prioritaire = false,
  voile = false,
  children,
}: {
  photo: Photo;
  ratio?: string;
  ratioMobile?: string;
  className?: string;
  prioritaire?: boolean;
  voile?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className={`photo-legendee ${className}`}>
      <PhotoCadre photo={photo} ratio={ratio} ratioMobile={ratioMobile} prioritaire={prioritaire} voile={voile}>
        {children}
      </PhotoCadre>
      <p className="photo-legende">{photo.legende}</p>
    </div>
  );
}

/**
 * Une pièce de la boutique en situation : la photo d'ambiance donne le contexte d'usage,
 * l'objet (livre, deck, poster) la chevauche et reste identifiable au premier regard.
 */
export function ProduitScene({
  produit,
  miroir = false,
  flottera = false,
  taille,
}: {
  produit: Produit;
  miroir?: boolean;
  flottera?: boolean;
  taille?: number;
}) {
  const petit = usePetitEcran(640);
  const photo = ambianceProduit[produit.slug];
  const largeur = taille ?? (petit ? 128 : 172);
  return (
    <div className={`produit-scene ${miroir ? "produit-scene--miroir" : ""}`}>
      {photo && <PhotoCadre photo={photo} ratio="4 / 5" className="produit-scene-photo" sizes="(min-width: 1024px) 30vw, 70vw" />}
      <div className="produit-scene-objet">
        <VisuelProduit produit={produit} largeur={largeur} flottera={flottera} />
      </div>
    </div>
  );
}

/** Les trois pièces du kit : livre, journal, rituels. */
export function KitVisuel({ className = "" }: { className?: string }) {
  const petit = usePetitEcran(640);
  return (
    <div className={`relative flex h-[240px] items-center justify-center sm:h-[360px] ${className}`}>
      <div className="translate-y-3 rotate-[-9deg]">
        <Livre largeur={petit ? 88 : 132} inclinaison={-14} ouverture={0} interactif={false} />
      </div>
      <div className="-ml-7 rotate-[2deg] sm:-ml-14">
        <Livre largeur={petit ? 112 : 165} inclinaison={-16} ouverture={0} interactif={false} priere="Mon Journal de Superpouvoir" />
      </div>
      <div className="-ml-7 translate-y-5 rotate-[11deg] sm:-ml-14">
        <Livre largeur={petit ? 88 : 132} inclinaison={-12} ouverture={0} interactif={false} priere="Rituels — 60 jours" />
      </div>
    </div>
  );
}
