import { useState } from "react";
import { ArrowLeft, MoveRight, Plus, Minus } from "lucide-react";
import { EntetePage, Bloc } from "../components/Page";
import { Vu } from "../components/Atelier";
import { CarteArchetype } from "../components/CartesUI";
import { Link } from "../lib/router";
import { defisMeta, etapes, produits } from "../data/site";
import extras from "../data/parcours-extras.json";
import { PhotoCadre } from "../components/Photo";
import { etapePhotos } from "../data/media";

const extrasTypes = extras as Record<string, { steps: { titre: string; note: string }[]; arche: { type: string; archetype: string; tagline: string }[] }>;

export default function Parcours({ id }: { id: string }) {
  const e = etapes.find((x) => x.id === id);
  const [ouvert, setOuvert] = useState<number | null>(0);

  if (!e) {
    return (
      <div className="champ flex flex-col items-start gap-4">
        <h1 className="display-l">Ce chemin n’existe pas</h1>
        <p className="text-dim">Le mouvement compte quatre étapes de vie. Choisis la tienne.</p>
        <div className="flex flex-wrap gap-3">
          {etapes.map((x) => (
            <Link key={x.id} to={`/parcours/${x.id}`} className="btn btn-craie">
              {x.nom}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  const donnees = extrasTypes[e.id];
  const chemin = donnees.steps.filter((s) => produits.some((p) => p.nom.toLowerCase() === s.titre.toLowerCase()));
  const defi = defisMeta[0];

  return (
    <>
      <EntetePage
        surtitre={`Ton étape de vie · ${e.age}`}
        lignes={[
          <span key="n">{e.nom}</span>,
          <span key="a" className="livre block font-normal text-or">
            {e.accroche}
          </span>,
        ]}
        intro={e.texte}
        photo={etapePhotos[e.id]}
        fil={e.fil}
        enfants={
          <ul className="flex flex-wrap gap-2">
            {e.tags.map((t) => (
              <li key={t} className="rounded-full border border-paper/25 bg-ink-2 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wide text-paper/70">
                {t}
              </li>
            ))}
          </ul>
        }
      />

      <Bloc numero="01" titre="Ton parcours de lecture" fil={e.fil} className="champ">
        <Vu className="mb-8 block">
          <h2 className="display-l">Les outils faits pour toi</h2>
        </Vu>
        <ol className="space-y-px overflow-hidden rounded-[18px] border border-paper/12 bg-paper/12">
          {chemin.map((s, i) => {
            const p = produits.find((x) => x.nom.toLowerCase() === s.titre.toLowerCase())!;
            return (
              <li key={s.titre}>
                <Link
                  to={`/boutique/${p.slug}`}
                  className="group grid items-center gap-2 bg-ink-2 p-5 transition-colors hover:bg-ink-3 sm:grid-cols-12 sm:gap-4 sm:p-6"
                >
                  <span className="font-display text-2xl font-extrabold sm:col-span-1" style={{ color: e.fil }}>
                    {i + 1}
                  </span>
                  <span className="sm:col-span-5">
                    <span className="block font-display font-extrabold">{p.nom}</span>
                    <span className="label block">{p.format}</span>
                  </span>
                  <span className="text-dim sm:col-span-5">{s.note}</span>
                  <MoveRight size={18} className="hidden text-paper/40 transition-transform group-hover:translate-x-1.5 group-hover:text-or sm:col-span-1 sm:block" />
                </Link>
              </li>
            );
          })}
        </ol>
      </Bloc>

      <Bloc numero="02" titre="Le défi de ton étape" fil={e.fil} className="champ">
        <div className="ombre grid items-center gap-6 rounded-[22px] border border-paper/14 bg-ink-2 p-6 sm:p-8 lg:grid-cols-12 lg:gap-8 lg:p-10">
          <div className="flex items-center gap-3 lg:col-span-3 lg:flex-col lg:items-start lg:gap-1">
            <span className="font-display text-4xl font-extrabold" style={{ color: e.fil }}>
              {defi.jours}
            </span>
            <span className="label block">jours · gratuit</span>
          </div>
          <div className="lg:col-span-6">
            <h2 className="font-display text-xl font-extrabold">{defi.titre}</h2>
            <p className="text-dim">{defi.texte}</p>
          </div>
          <div className="lg:col-span-3">
            <Link to="/defis#defi-7" className="btn btn-or w-full justify-center">
              Commencer le défi <MoveRight size={16} />
            </Link>
          </div>
        </div>
      </Bloc>

      <Bloc numero="03" titre="Profils héros" fil={e.fil} className="champ">
        <Vu className="mb-8 block">
          <h2 className="display-l">
            Les archétypes qui{" "}
            <span className="livre font-normal" style={{ color: e.fil }}>
              te correspondent
            </span>
          </h2>
        </Vu>
        <ul className="grid gap-6 lg:grid-cols-3">
          {donnees.arche.map((a, i) => (
            <Vu as="li" key={a.type} delay={i * 100}>
              <CarteArchetype a={a} index={i} />
            </Vu>
          ))}
        </ul>
        <Link to="/quiz" className="btn btn-craie mt-8">
          Découvrir lequel je suis <MoveRight size={16} />
        </Link>
      </Bloc>

      <Bloc numero="04" titre="Questions fréquentes" fil={e.fil} className="champ">
        <h2 className="display-l mb-6">Tu te poses ces questions&nbsp;?</h2>
        <ul className="border-t border-paper/12">
          {e.faq.map((f, i) => {
            const actif = ouvert === i;
            return (
              <li key={f.q} className="border-b border-paper/12">
                <button
                  type="button"
                  onClick={() => setOuvert(actif ? null : i)}
                  aria-expanded={actif}
                  className="flex w-full items-start justify-between gap-4 py-5 text-left transition-colors hover:text-or"
                >
                  <span className="font-display text-lg font-extrabold">{f.q}</span>
                  <span className="shrink-0" style={{ color: e.fil }}>
                    {actif ? <Minus size={20} /> : <Plus size={20} />}
                  </span>
                </button>
                <div
                  className="grid transition-[grid-template-rows] duration-500"
                  style={{ gridTemplateRows: actif ? "1fr" : "0fr", visibility: actif ? "visible" : "hidden" }}
                  aria-hidden={!actif}
                >
                  <div className="overflow-hidden">
                    <p className="pb-5 text-dim">{f.r}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </Bloc>

      <Bloc numero="05" titre="Changer d’étape" fil={e.fil} className="champ">
        <div className="grid gap-6 sm:grid-cols-3">
          {etapes.filter((x) => x.id !== e.id).map((x) => (
            <Link key={x.id} to={`/parcours/${x.id}`} className="etape-tuile group">
              <PhotoCadre photo={etapePhotos[x.id]} ratio="4 / 5" ratioMobile="16 / 10" voile creditVisible={false} sizes="(min-width: 640px) 30vw, 100vw">
                <span className="etape-tuile-texte"><span>{x.age}</span><strong>{x.nom}</strong><em><ArrowLeft size={14} /> Changer d’étape</em></span>
              </PhotoCadre>
            </Link>
          ))}
        </div>
      </Bloc>
    </>
  );
}
