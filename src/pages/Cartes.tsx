import { useMemo, useState } from "react";
import { Shuffle, ArrowUpRight } from "lucide-react";
import { EntetePage, Bloc } from "../components/Page";
import { CarteDoute, filCategorie } from "../components/CarteDoute";
import { Vu } from "../components/Atelier";
import { fcfa, lienCommande, produits } from "../data/site";
import toutes from "../data/cards.json";
import { ProduitScene } from "../components/Visuels";
import { photos } from "../data/media";

const deck = produits.find((p) => p.slug === "30-cartes-anti-doutes")!;

export default function Cartes() {
  const categories = useMemo(() => Array.from(new Set(toutes.map((c) => c.category))), []);
  const [filtre, setFiltre] = useState<string>("Toutes");
  const [tirage, setTirage] = useState(() => Math.floor(Math.random() * toutes.length));

  const visibles = filtre === "Toutes" ? toutes : toutes.filter((c) => c.category === filtre);
  const carte = toutes[tirage];

  const tirer = () => {
    let n = tirage;
    while (n === tirage) n = Math.floor(Math.random() * toutes.length);
    setTirage(n);
  };

  return (
    <>
      <EntetePage
        photo={photos.cartesEntete}
        variante="decale"
        surtitre="Chapitre V · 30 cartes anti-doutes"
        lignes={[<>Le doute se</>, <span key="s" className="livre font-normal text-or">retourne.</span>]}
        intro="Une carte par blocage mental : au recto la phrase qui te freine, au verso l’affirmation qui la désarme et une action à faire aujourd’hui. Dix familles, trente cartes, aucun contenu inventé — ce sont celles du mouvement."
        fil="#FFB000"
      />

      <Bloc numero="01" titre="Tirage" fil="#FFB000">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Vu>
              <h2 className="display-m">Tire la carte dont tu as besoin aujourd’hui</h2>
              <p className="mt-5 text-[16px] text-dim">
                Le matin, ou dans le moment précis où la petite voix se met à parler. Lis le doute à voix haute,
                retourne la carte, puis fais l’action. C’est le protocole complet.
              </p>
              <button type="button" onClick={tirer} className="btn btn-or mt-7">
                <Shuffle size={16} /> Tirer une autre carte
              </button>
              <p className="mt-4 text-[13px] text-dim-2" aria-live="polite">
                Carte #{String(carte.id).padStart(2, "0")} · {carte.category}
              </p>
            </Vu>
          </div>
          <div className="lg:col-span-7">
            <div className="mx-auto max-w-md" key={tirage}>
              <CarteDoute carte={carte} hauteur={380} />
            </div>
          </div>
        </div>
      </Bloc>

      <Bloc numero="02" titre="Le deck complet" fil="#FFB000">
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setFiltre("Toutes")}
            aria-pressed={filtre === "Toutes"}
            className={`min-h-[40px] border px-3.5 text-[13px] font-semibold transition-colors ${
              filtre === "Toutes" ? "border-or bg-or text-ink" : "border-paper/20 text-dim hover:border-paper/50"
            }`}
          >
            Toutes ({toutes.length})
          </button>
          {categories.map((c) => {
            const actif = filtre === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setFiltre(c)}
                aria-pressed={actif}
                className="min-h-[40px] border px-3.5 text-[13px] font-semibold transition-colors"
                style={{
                  borderColor: actif ? filCategorie[c] : "rgba(50,16,68,.24)",
                  background: actif ? filCategorie[c] : "transparent",
                  color: actif ? "#FFF0D9" : "rgba(50,16,68,.78)",
                }}
              >
                {c}
              </button>
            );
          })}
        </div>

        <p className="mb-6 text-[13.5px] text-dim-2" aria-live="polite">
          {visibles.length} carte{visibles.length > 1 ? "s" : ""} affichée{visibles.length > 1 ? "s" : ""} — clique pour retourner.
        </p>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibles.map((c, i) => (
            <Vu key={c.id} delay={Math.min(i, 6) * 60}>
              <CarteDoute carte={c} />
            </Vu>
          ))}
        </div>
      </Bloc>

      <Bloc numero="03" titre="Emporter le deck" fil="#FFB000">
        <div className="grid items-center gap-8 border border-paper/14 bg-ink-2 p-7 sm:p-10 lg:grid-cols-12">
          <div className="lg:col-span-4"><ProduitScene produit={deck} /></div>
          <div className="lg:col-span-5">
            <h2 className="display-m">{deck.nom}</h2>
            <p className="mt-4 max-w-2xl text-[16px] text-dim">{deck.description}</p>
            <p className="mt-4 text-[13.5px] text-dim-2">Format : {deck.format} — coffret physique ou PDF imprimable.</p>
          </div>
          <div className="flex flex-col justify-center gap-4 lg:col-span-3">
            <span className="font-display text-[40px] font-extrabold leading-none text-or">{fcfa(deck.fcfa)}</span>
            <span className="text-[15px] text-dim-2">ou {deck.eur} €</span>
            <a href={lienCommande(deck.nom)} className="btn btn-or">
              Commander le deck <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </Bloc>
    </>
  );
}
