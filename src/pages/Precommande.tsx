import { useEffect, useRef } from "react";
import { PanierPage } from "./Commande";
import { useCart } from "../lib/cart";
import { produits } from "../data/site";

const livre = produits[0];

/**
 * Lien de précommande dédié (partagé tel quel, notamment sur mobile/WhatsApp) : la page du panier
 * elle-même, avec le livre déjà positionné par défaut (quantité 1, modifiable comme n'importe
 * quelle pièce du panier) — rien n'est ajouté si le livre y figure déjà. Enchaîne ensuite sur le
 * même parcours de commande (« Passer à la commande ») que le reste du site.
 */
export default function Precommande() {
  const { items, add } = useCart();
  const deja = useRef(false);

  useEffect(() => {
    if (deja.current) return;
    deja.current = true;
    if (!items.some((item) => item.produit.slug === livre.slug)) add(livre, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <PanierPage />;
}
