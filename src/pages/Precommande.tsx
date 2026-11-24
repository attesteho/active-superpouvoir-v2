import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { EntetePage, Bloc } from "../components/Page";
import { ProduitScene } from "../components/Visuels";
import { BoutonPeint } from "../components/BoutonPeint";
import { Icone } from "../components/Icone";
import { useRoute } from "../lib/router";
import { useCart } from "../lib/cart";
import { fcfa, produits } from "../data/site";

const livre = produits[0];

/**
 * Lien de précommande dédié (partagé tel quel, notamment sur mobile/WhatsApp) : uniquement le
 * livre, quantité à 1 par défaut. « Précommander » vide le panier existant et n'y place que cette
 * pièce, pour ne jamais mélanger une précommande avec une sélection en cours ailleurs sur le site,
 * puis enchaîne sur le même parcours de commande (coordonnées → livraison → paiement, confirmation
 * par email et WhatsApp) que le reste de la boutique.
 */
export default function Precommande() {
  const [quantite, setQuantite] = useState(1);
  const { clear, add } = useCart();
  const { aller } = useRoute();

  const changer = (delta: number) => setQuantite((q) => Math.max(1, Math.min(9, q + delta)));

  const precommander = () => {
    clear();
    add(livre, quantite);
    aller("/commande");
  };

  return (
    <>
      <EntetePage
        surtitre="Précommande"
        lignes={[<>Réserve ton</>, <span key="s" className="livre font-normal text-or">exemplaire</span>]}
        fil="#FFB000"
      />

      <Bloc fil="#FFB000" className="champ">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="flex justify-center lg:col-span-5">
            <ProduitScene produit={livre} flottera />
          </div>

          <div className="flex flex-col gap-5 lg:col-span-7">
            <span className="label" style={{ color: livre.fil }}>{livre.type} · {livre.format}</span>
            <h2 className="display-m">{livre.nom}</h2>
            <p className="text-dim">{livre.description}</p>

            <div className="flex flex-wrap items-end gap-3">
              <span className="font-display text-3xl font-extrabold md:text-4xl" style={{ color: livre.fil }}>{fcfa(livre.fcfa)}</span>
              <span className="text-dim-2">ou {livre.eur} €</span>
              <span className="text-dim-2">/ exemplaire</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-paper/12 bg-ink-2 p-4">
              <span className="label">Quantité</span>
              <div className="quantity-control" aria-label={`Quantité de ${livre.nom}`}>
                <button type="button" onClick={() => changer(-1)} aria-label="Retirer une unité"><Minus size={14} /></button>
                <span aria-live="polite">{quantite}</span>
                <button type="button" onClick={() => changer(1)} aria-label="Ajouter une unité"><Plus size={14} /></button>
              </div>
              <span className="ml-auto font-display text-lg font-extrabold" style={{ color: livre.fil }}>
                {fcfa(livre.fcfa * quantite)}
              </span>
            </div>

            <BoutonPeint variante="or" taille="lg" onClick={precommander} className="w-full sm:w-auto" icone={<Icone nom="fleche-droite" taille={16} />}>
              Précommander maintenant
            </BoutonPeint>

            <p className="text-dim-2">
              Étape suivante : tes coordonnées, puis confirmation par email ou WhatsApp. Aucun paiement réel n’est pris ici.
            </p>
          </div>
        </div>
      </Bloc>
    </>
  );
}
