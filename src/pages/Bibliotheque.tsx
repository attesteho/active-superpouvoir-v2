import { useMemo, useState } from "react";
import { ArrowUpRight, MoveRight } from "lucide-react";
import { EntetePage, Bloc } from "../components/Page";
import { Vu } from "../components/Atelier";
import { BibliothequeCarousel } from "../components/BibliothequeCarousel";
import { Link } from "../lib/router";
import { etapes, produits, ressourcesGratuites } from "../data/site";
import extras from "../data/parcours-extras.json";
import { PhotoCadre } from "../components/Photo";
import { Tilt } from "../components/CartesUI";
import { PhotoLegendee } from "../components/Visuels";
import { etapePhotos, photos } from "../data/media";

const AGES = ["Tous les âges", "Mini-Héros (8-12 ans)", "Explorateur (13-16 ans)", "Bâtisseur (17-22 ans)", "Mentor (23+ ans)"];
const FORMATS = ["Tous les formats", "Physique", "Digital", "Physique + Digital"];
const TYPES = ["Tous les types", "Livre", "Workbook", "Cartes", "Rituels", "Poster"];

const extrasTypes = extras as Record<string, { steps: { titre: string; note: string }[]; arche: { type: string; archetype: string; tagline: string }[] }>;

export default function Bibliotheque() {
  const [age, setPage] = useState(AGES[0]);
  const [format, setFormat] = useState(FORMATS[0]);
  const [type, setType] = useState(TYPES[0]);
  const [etape, setEtape] = useState(etapes[0].id);

  const visibles = useMemo(
    () =>
      produits.filter(
        (p) =>
          (age === AGES[0] || p.ages.includes(age)) &&
          (format === FORMATS[0] || p.format === format) &&
          (type === TYPES[0] || p.type === type)
      ),
    [age, format, type]
  );

  const courante = etapes.find((e) => e.id === etape)!;
  const chemin = extrasTypes[etape].steps.filter((s) => produits.some((p) => p.nom.toLowerCase() === s.titre.toLowerCase()));

  const Selecteur = ({ label, valeur, options, onChange }: { label: string; valeur: string; options: string[]; onChange: (v: string) => void }) => (
    <label className="block">
      <span className="label mb-2 block">{label}</span>
      <select
        value={valeur}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[46px] w-full border border-paper/22 bg-ink-2 px-3 text-[14.5px] outline-none transition-colors focus:border-or"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-ink-2">
            {o}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <>
      <EntetePage
        photo={photos.bibliotheque}
        surtitre="La bibliothèque"
        lignes={[<>Tes outils de</>, <span key="s" className="livre whitespace-nowrap font-normal text-or">transformation</span>]}
        intro="Livres, journaux, cartes et rituels pour activer ton superpouvoir. Choisis le parcours adapté à ton âge et découvre les ressources gratuites."
        fil="#FFB000"
      />

      <Bloc numero="01" titre="Nos produits" fil="#FFB000">
        <div className="grid gap-4 sm:grid-cols-3">
          <Selecteur label="Tranche d’âge" valeur={age} options={AGES} onChange={setPage} />
          <Selecteur label="Format" valeur={format} options={FORMATS} onChange={setFormat} />
          <Selecteur label="Type" valeur={type} options={TYPES} onChange={setType} />
        </div>

        <p className="mt-6 text-[13.5px] text-dim-2" aria-live="polite">
          {visibles.length} pièce{visibles.length > 1 ? "s" : ""} sur {produits.length}
        </p>

        <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-dim">
          Choisis une pièce pour lire son descriptif, son format et son prix. Sa fiche détaille le contenu, les âges conseillés et les avis, puis te permet de l’ajouter au panier.
        </p>

        <BibliothequeCarousel produits={visibles} />

        {visibles.length === 0 && (
          <p className="mt-6 border border-paper/14 bg-ink-2 p-6 text-[15px] text-dim">
            Aucune pièce ne combine ces trois critères. Élargis un filtre pour retrouver le catalogue.
          </p>
        )}
      </Bloc>

      <Bloc numero="02" titre="Ton parcours de lecture" fil="#FFB000">
        <h2 className="display-l max-w-3xl">
          Ton parcours <span className="livre font-normal text-or">personnalisé</span>
        </h2>

        <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Choisir une étape de vie">
          {etapes.map((e) => {
            const actif = e.id === etape;
            return (
              <button
                key={e.id}
                role="tab"
                aria-selected={actif}
                onClick={() => setEtape(e.id)}
                className="min-h-[44px] border px-4 text-[13.5px] font-semibold transition-colors"
                style={{ borderColor: actif ? e.fil : "rgba(50,16,68,.24)", background: actif ? e.fil : "transparent", color: actif ? "#FFF0D9" : "rgba(50,16,68,.78)" }}
              >
                {e.nom} · {e.age}
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="livre text-[24px] leading-snug" style={{ color: courante.fil }}>
              {courante.accroche}
            </p>
            <p className="mt-4 text-[15px] text-dim">{courante.texte}</p>
            <Link to={`/parcours/${courante.id}`} className="btn btn-craie mt-6">
              Voir le parcours complet <MoveRight size={16} />
            </Link>
<PhotoLegendee photo={etapePhotos[courante.id]} ratio="4 / 3" className="mt-8" />
          </div>

          <ol className="reading-path self-start overflow-hidden border border-paper/12 bg-paper/12 lg:col-span-8" aria-label={`Étapes conseillées pour ${courante.nom}`}>
            {chemin.map((s, i) => {
              const p = produits.find((x) => x.nom.toLowerCase() === s.titre.toLowerCase())!;
              return (
                <li key={s.titre}>
                  <Link to={`/boutique/${p.slug}`} className="reading-path-link group">
                    <span className="reading-path-number">{String(i + 1).padStart(2, "0")}</span>
                    <span className="reading-path-copy">
                      <span className="reading-path-title">{p.nom}</span>
                      <span className="reading-path-note">{s.note}</span>
                    </span>
                    <MoveRight size={16} className="reading-path-arrow" aria-hidden="true" />
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </Bloc>

      <Bloc numero="03" titre="Ressources gratuites" fil="#FFB000">
        <Vu>
          <h2 className="display-l">Commencer gratuitement</h2>
          <p className="mt-4 max-w-2xl text-[16px] text-dim">Télécharge nos ressources gratuites pour découvrir la méthode avant d’aller plus loin.</p>
          <Link to="/quiz" className="btn btn-or mt-6">
            Passer le quiz <ArrowUpRight size={16} />
          </Link>
        </Vu>

        <ul className="mt-10 grid gap-8 sm:grid-cols-2">
          {ressourcesGratuites.map((r, i) => (
            <li key={r.titre}>
              <Tilt className="h-full">
                <article className="ressource-carte">
                  <PhotoCadre photo={r.titre.includes("Quiz") ? photos.ressourceQuiz : photos.ressourceChapitre} ratio="16 / 10" creditVisible={false}>
                    <span className="ressource-num">{String(i + 1).padStart(2, "0")}</span>
                  </PhotoCadre>
                  <div className="ressource-corps">
                    <h3>{r.titre}</h3>
                    <p>{r.texte}</p>
                    <span className="ressource-etat">{r.etat}</span>
                  </div>
                </article>
              </Tilt>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-2xl text-[13px] text-dim-2">
          De nouveaux supports à télécharger viendront bientôt compléter cette sélection.
        </p>
      </Bloc>
    </>
  );
}
