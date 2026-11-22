import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { kitProduit, produits, type Produit } from "../data/site";

export type CartItem = {
  produit: Produit;
  quantite: number;
};

type CartValue = {
  items: CartItem[];
  count: number;
  total: number;
  add: (produit: Produit, quantite?: number) => void;
  updateQuantity: (slug: string, quantite: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

const STORAGE_KEY = "fabrique-panier-v1";
const catalogue = [...produits, kitProduit];
const CartContext = createContext<CartValue | null>(null);

function lirePanier(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const brut = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]") as Array<{ slug?: string; quantite?: number }>;
    return brut
      .map((item) => ({
        produit: catalogue.find((produit) => produit.slug === item.slug),
        quantite: Math.max(1, Math.min(9, Number(item.quantite) || 1)),
      }))
      .filter((item): item is CartItem => Boolean(item.produit));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(lirePanier);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items.map(({ produit, quantite }) => ({ slug: produit.slug, quantite }))));
    } catch {
      // Le panier reste utilisable si le stockage local est indisponible.
    }
  }, [items]);

  const add = useCallback((produit: Produit, quantite = 1) => {
    setItems((current) => {
      const exists = current.find((item) => item.produit.slug === produit.slug);
      if (exists) {
        return current.map((item) =>
          item.produit.slug === produit.slug ? { ...item, quantite: Math.min(9, item.quantite + quantite) } : item
        );
      }
      return [...current, { produit, quantite: Math.max(1, Math.min(9, quantite)) }];
    });
  }, []);

  const updateQuantity = useCallback((slug: string, quantite: number) => {
    setItems((current) =>
      quantite <= 0
        ? current.filter((item) => item.produit.slug !== slug)
        : current.map((item) => (item.produit.slug === slug ? { ...item, quantite: Math.min(9, quantite) } : item))
    );
  }, []);

  const remove = useCallback((slug: string) => updateQuantity(slug, 0), [updateQuantity]);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((sum, item) => sum + item.quantite, 0),
      total: items.reduce((sum, item) => sum + item.produit.fcfa * item.quantite, 0),
      add,
      updateQuantity,
      remove,
      clear,
    }),
    [add, clear, items, remove, updateQuantity]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart doit être utilisé dans CartProvider");
  return context;
}
