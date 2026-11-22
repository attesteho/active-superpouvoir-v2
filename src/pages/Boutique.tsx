import { useState } from "react";
import { ArrowLeft, Check, Info, MoveRight, ShoppingBag } from "lucide-react";
import { EntetePage, Bloc } from "../components/Page";
import { Vu } from "../components/Atelier";
import { CarteAvis, CarteLien } from "../components/CartesUI";
import { Link, useRoute } from "../lib/router";
import { fcfa, kit, kitProduit, lienCommande, offres, produits, type Produit } from "../data/site";
import { useCart } from "../lib/cart";
import { ProduitScene, KitVisuel } from "../components/Visuels";
import { photos } from "../data/media";

function AddButton({ produit, onAdded }: { produit: Produit; onAdded?: () => void }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const handleAdd = () => {
    add(produit);
    setAdded(true);
    onAdded?.();
    window.setTimeout(() => setAdded(false), 2400);
  };
  return (
    <button type="button" className="btn btn-or" onClick={handleAdd} aria-live="polite">
      {added ? <>Ajouté au panier <Check size={16} /></> : <>Ajouter au panier <ShoppingBag size={16} /> </>}
    </button>
  );
}

export function Boutique() {
  const [addedSlug, setAddedSlug] = useState<string | null>(null);
  return (
    <>
      <EntetePage
        photo={photos.boutique}
        variante="decale"
        surtitre="Boutique"
        lignes={[<>Le Kit du</>, <span key="s" className="livre font-normal text-or">Héros</span>]}
        intro="Livres, journaux, rituels et kits cadeaux pour activer ton superpouvoir et celui de tes proches."
        fil="#FFB000"
      />

      <Bloc numero="01" titre="Produits populaires" fil="#FFB000">
        <ul className="space-y-16">
          {produits.map((p, i) => (
            <li key={p.slug}>
              <Vu>
                <article className="grid items-center gap-8 lg:grid-cols-12">
                  <div className={`flex justify-center lg:col-span-4 ${i % 2 ? "lg:order-2" : ""}`}>
                    <ProduitScene produit={p} miroir={i % 2 === 1} />
                  </div>

                  <div className={`lg:col-span-8 ${i % 2 ? "lg:order-1" : ""}`}>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="label" style={{ color: p.fil }}>{p.type} · {p.format}</span>
                      {p.badge && <span className="border px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.12em]" style={{ borderColor: p.fil, color: p.fil }}>{p.badge}</span>}
                    </div>
                    <h2 className="mt-3 font-display text-[32px] font-extrabold leading-none sm:text-[40px]">{p.nom}</h2>
                    <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-dim">{p.description}</p>
                    <div className="mt-6 flex flex-wrap items-center gap-6">
                      <span className="font-display text-[30px] font-extrabold" style={{ color: p.fil }}>{fcfa(p.fcfa)}</span>
                      <span className="text-[15px] text-dim-2">ou {p.eur} €</span>
                      <span className="text-[13px] text-dim-2">{p.avis.length > 0 ? `${p.avis.length} avis publié${p.avis.length > 1 ? "s" : ""}` : "Aucun avis publié"}</span>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <AddButton produit={p} onAdded={() => setAddedSlug(p.slug)} />
                      <Link to={`/boutique/${p.slug}`} className="btn btn-craie">Voir la fiche <MoveRight size={16} /></Link>
                      {addedSlug === p.slug && <Link to="/panier" className="btn btn-craie">Voir le panier <ArrowLeft size={16} /></Link>}
                    </div>
                  </div>
                </article>
              </Vu>
            </li>
          ))}
        </ul>
      </Bloc>

      <Bloc numero="02" titre="Les kits à prix réduit" fil="#FFB000">
        <div className="grid items-center gap-8 border border-or/30 bg-or/[0.06] p-7 sm:p-12 lg:grid-cols-12">
          <KitVisuel className="lg:col-span-4" />
          <div className="lg:col-span-5">
            <p className="label text-or">Offre spéciale</p>
            <h2 className="display-l mt-3">{kit.nom}</h2>
            <p className="mt-4 text-[17px] text-dim">{kit.contenu}</p>
            <p className="mt-5 flex items-start gap-2 text-[13px] text-dim-2"><Info size={15} className="mt-0.5 shrink-0 text-or" /> Le mouvement affiche 14 900 FCFA (au lieu de 18 500). À titre d’information, la somme des quatre pièces vendues séparément au prix catalogue est de 32 000 FCFA : nous republions le prix annoncé sans le recalculer.</p>
          </div>
          <div className="flex flex-col gap-4 lg:col-span-3">
            <span className="font-display text-[46px] font-extrabold leading-none text-or">{fcfa(kit.fcfa)}</span>
            <span className="text-[17px] text-dim-2 line-through">{fcfa(kit.barre)}</span>
            <AddButton produit={kitProduit} onAdded={() => setAddedSlug(kitProduit.slug)} />
            {addedSlug === kitProduit.slug && <Link to="/panier" className="back-catalogue"><ShoppingBag size={15} /> Voir le panier</Link>}
          </div>
        </div>
      </Bloc>

      <Bloc numero="03" titre="Les offres groupées" fil="#FFB000">
        <div className="grid gap-6 md:grid-cols-2">
          {offres.map((offre) => (
            <article key={offre.nom} className="rounded-[24px] border border-paper/10 bg-ink-2 p-6 shadow-[0_8px_24px_rgba(50,16,68,0.08)] sm:p-8">
              <p className="label text-or">Bundle · {offre.remise}</p>
              <h2 className="mt-3 font-display text-[28px] font-extrabold leading-none">{offre.nom}</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-dim">{offre.description}</p>
              <ul className="mt-5 space-y-2 text-[13px] text-dim-2">
                {offre.contenu.map((item) => <li key={item}>✓ {item}</li>)}
              </ul>
              <div className="mt-6 flex flex-wrap items-end gap-4">
                <span className="font-display text-[34px] font-extrabold text-or">{fcfa(offre.fcfa)}</span>
                <span className="text-[14px] text-dim-2">{offre.eur} €</span>
                <span className="text-[14px] text-dim-2 line-through">{fcfa(offre.avant)}</span>
              </div>
              <a href={lienCommande(offre.nom)} className="btn btn-or mt-6">Ajouter au panier <ShoppingBag size={16} /></a>
            </article>
          ))}
        </div>
      </Bloc>
    </>
  );
}

export function FicheProduit({ slug }: { slug: string }) {
  const p = produits.find((x) => x.slug === slug) || (slug === kitProduit.slug ? kitProduit : undefined);
  const { add } = useCart();
  const { aller } = useRoute();
  const [added, setAdded] = useState(false);

  if (!p) {
    return (
      <div className="mx-auto w-full max-w-[900px] px-5 pb-24 pt-40 sm:px-8">
        <h1 className="display-l">Cette pièce n’existe pas</h1>
        <p className="mt-5 text-dim">Le catalogue compte cinq pièces et un kit. Retourne à la boutique pour les retrouver.</p>
        <Link to="/boutique" className="btn btn-or mt-8"><ArrowLeft size={16} /> Retour à la boutique</Link>
      </div>
    );
  }

  const autres = produits.filter((x) => x.slug !== p.slug).slice(0, 3);
  const ajouter = () => {
    add(p);
    setAdded(true);
  };

  return (
    <>
      <EntetePage
        surtitre={`Boutique · ${p.type} · ${p.format}`}
        lignes={[<span key="t">{p.nom}</span>]}
        fil={p.fil}
        enfants={<Link to="/boutique" className="mt-8 inline-flex items-center gap-2 text-[13.5px] text-dim-2 transition-colors hover:text-or"><ArrowLeft size={15} /> Tout le catalogue</Link>}
      />

      <Bloc numero="01" titre="La pièce" fil={p.fil}>
        <div className="grid gap-12 lg:grid-cols-12">
          <Vu className="flex justify-center lg:col-span-5"><ProduitScene produit={p} flottera /></Vu>
          <div className="lg:col-span-7">
            <Vu>
              <p className="text-[17px] leading-relaxed text-dim">{p.description}</p>
              <div className="mt-8 flex flex-wrap items-end gap-5 border-t border-paper/12 pt-6"><span className="font-display text-[44px] font-extrabold leading-none" style={{ color: p.fil }}>{fcfa(p.fcfa)}</span><span className="pb-2 text-[16px] text-dim-2">ou {p.eur} €</span></div>
              <div className="mt-6"><p className="label mb-3">Tranches d’âge conseillées</p><ul className="flex flex-wrap gap-2">{p.ages.map((a) => <li key={a} className="border border-paper/20 px-3 py-1.5 text-[12.5px] text-dim">{a}</li>)}</ul></div>
              <div className="mt-8 flex flex-wrap gap-3">
                <button type="button" className="btn btn-or" onClick={ajouter}>{added ? <>Ajouté au panier <Check size={16} /></> : <>Ajouter au panier <ShoppingBag size={16} /></>}</button>
                {added && <button type="button" className="btn btn-craie" onClick={() => aller("/panier")}>Poursuivre la commande <MoveRight size={16} /></button>}
                <Link to="/bibliotheque" className="btn btn-craie">Comparer les pièces</Link>
              </div>
              <p className="mt-4 text-[13px] text-dim-2">Après l’ajout, poursuis depuis le panier pour renseigner les étapes de commande. Le checkout est une démonstration front : aucun paiement réel n’est demandé.</p>
            </Vu>
          </div>
        </div>
      </Bloc>

      <Bloc numero="02" titre="Avis des lecteurs" fil={p.fil}>
        {p.avis.length === 0 ? <p className="border border-paper/12 bg-ink-2 p-7 text-[15.5px] text-dim">Aucun avis n’est publié pour cette pièce. Nous n’en inventons pas : les avis affichés sur ce site sont exactement ceux du mouvement.</p> : <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{p.avis.map((a, i) => <Vu as="li" key={a.nom} delay={i * 90}><CarteAvis avis={a} /></Vu>)}</ul>}
      </Bloc>

      <Bloc numero="03" titre="À mettre sur le même établi" fil={p.fil}>
        <ul className="grid gap-6 sm:grid-cols-3">{autres.map((a) => <li key={a.slug}><CarteLien produit={a} /></li>)}</ul>
      </Bloc>
    </>
  );
}
