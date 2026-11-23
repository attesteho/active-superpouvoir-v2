import { useMemo, useState } from "react";
import { Shuffle } from "lucide-react";
import { EntetePage, Bloc } from "../components/Page";
import { NavigationSections } from "../components/NavigationSections";

const SECTIONS_CARTES = [
  { id: "cartes-tirage", label: "Tirage" },
  { id: "cartes-deck", label: "Le deck complet" },
  { id: "cartes-emporter", label: "Emporter le deck" },
];
import { CarteDoute, filCategorie } from "../components/CarteDoute";
import { Vu } from "../components/Atelier";
import { BoutonPeint } from "../components/BoutonPeint";
import { Icone } from "../components/Icone";
import { fcfa, produits } from "../data/site";
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
      <NavigationSections sections={SECTIONS_CARTES} />

      <EntetePage
        photo={photos.cartesEntete}
        arrierePlan="/images/05-cartes-antidoutes.webp"
        variante="decale"
        surtitre="Chapitre V · 30 cartes anti-doutes"
        lignes={[<>Le doute se</>, <span key="s" className="livre font-normal text-or">retourne.</span>]}
        intro="Une carte par blocage mental : au recto la phrase qui te freine, au verso l’affirmation qui la désarme et une action à faire aujourd’hui. Dix familles, trente cartes, aucun contenu inventé — ce sont celles du mouvement."
        fil="#FFB000"
      />

      <Bloc id="cartes-tirage" numero="01" titre="Tirage" fil="#FFB000" className="champ">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Vu className="flex flex-col items-start gap-5">
              <h2 className="display-m">Tire la carte dont tu as besoin aujourd’hui</h2>
              <p className="text-dim">
                Le matin, ou dans le moment précis où la petite voix se met à parler. Lis le doute à voix haute,
                retourne la carte, puis fais l’action. C’est le protocole complet.
              </p>
              <BoutonPeint onClick={tirer} icone={<Shuffle size={16} />}>
                Tirer une autre carte
              </BoutonPeint>
              <p className="text-dim-2" aria-live="polite">
                Carte #{String(carte.id).padStart(2, "0")} · {carte.category}
              </p>
            </Vu>
          </div>
          <div className="lg:col-span-7">
            <div className="fond-tisse flex items-center justify-center overflow-hidden rounded-[32px] p-8 sm:p-12" key={tirage}>
              <div className="w-full max-w-sm">
                <CarteDoute carte={carte} hauteur={520} />
              </div>
            </div>
          </div>
        </div>
      </Bloc>

      <Bloc id="cartes-deck" numero="02" titre="Le deck complet" fil="#FFB000" className="champ">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setFiltre("Toutes")}
            aria-pressed={filtre === "Toutes"}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              filtre === "Toutes" ? "border-or bg-or text-ink" : "border-paper/20 text-paper/70 hover:border-paper/50"
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
                className="rounded-full border px-4 py-2 text-sm font-semibold transition-colors"
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

        <p className="mt-6 text-dim-2" aria-live="polite">
          {visibles.length} carte{visibles.length > 1 ? "s" : ""} affichée{visibles.length > 1 ? "s" : ""} — clique pour retourner.
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibles.map((c, i) => (
            <Vu key={c.id} delay={Math.min(i, 6) * 60}>
              <CarteDoute carte={c} />
            </Vu>
          ))}
        </div>
      </Bloc>

      <Bloc id="cartes-emporter" numero="03" titre="Emporter le deck" fil="#FFB000" className="champ">
        <div className="ombre grid items-center gap-8 rounded-[26px] border border-paper/14 bg-ink-2 p-8 sm:p-10 lg:grid-cols-12 lg:gap-10 lg:p-12">
          <div className="lg:col-span-4">
            <ProduitScene produit={deck} />
          </div>
          <div className="flex flex-col gap-2 lg:col-span-5">
            <h2 className="display-m">{deck.nom}</h2>
            <p className="text-dim">{deck.description}</p>
            <p className="text-dim-2">Format : {deck.format} — coffret physique ou PDF imprimable.</p>
          </div>
          <div className="flex flex-col items-start gap-2 lg:col-span-3">
            <span className="font-display text-3xl font-extrabold text-or">{fcfa(deck.fcfa)}</span>
            <span className="text-dim-2">ou {deck.eur} €</span>
            <BoutonPeint to={`/boutique/${deck.slug}`} icone={<Icone nom="fleche-droite" taille={16} />}>
              Commander le deck
            </BoutonPeint>
          </div>
        </div>
      </Bloc>
    </>
  );
}
