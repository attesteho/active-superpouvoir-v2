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
      <div className="mx-auto w-full max-w-[900px] px-5 pb-24 pt-40 sm:px-8">
        <h1 className="display-l">Ce chemin n’existe pas</h1>
        <p className="mt-5 text-dim">Le mouvement compte quatre étapes de vie. Choisis la tienne.</p>
        <div className="mt-8 flex flex-wrap gap-3">
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
          <span key="a" className="livre block max-w-3xl text-[0.52em] font-normal leading-[1.15] text-or">
            {e.accroche}
          </span>,
        ]}
        intro={e.texte}
        photo={etapePhotos[e.id]}
        fil={e.fil}
        enfants={
          <ul className="mt-8 flex flex-wrap gap-2">
            {e.tags.map((t) => (
              <li key={t} className="border-2 border-ink/50 px-3 py-1.5 font-mono text-[11.5px] font-bold uppercase tracking-[0.1em] text-ink">
                {t}
              </li>
            ))}
          </ul>
        }
      />

      <Bloc numero="01" titre="Ton parcours de lecture" fil={e.fil}>
        <Vu>
          <h2 className="display-l max-w-3xl">Les outils faits pour toi</h2>
        </Vu>
        <ol className="mt-10 space-y-px overflow-hidden border border-paper/12 bg-paper/12">
          {chemin.map((s, i) => {
            const p = produits.find((x) => x.nom.toLowerCase() === s.titre.toLowerCase())!;
            return (
              <li key={s.titre}>
                <Link to={`/boutique/${p.slug}`} className="group grid items-center gap-4 bg-ink-2 p-6 transition-colors hover:bg-ink-3 sm:grid-cols-12">
                  <span className="font-display text-[38px] font-extrabold leading-none sm:col-span-1" style={{ color: e.fil }}>
                    {i + 1}
                  </span>
                  <span className="sm:col-span-5">
                    <span className="block font-display text-[21px] font-extrabold leading-tight">{p.nom}</span>
                    <span className="label mt-1 block">{p.format}</span>
                  </span>
                  <span className="text-[14.5px] text-dim sm:col-span-5">{s.note}</span>
                  <MoveRight size={18} className="hidden text-paper/40 transition-transform group-hover:translate-x-1.5 group-hover:text-or sm:col-span-1 sm:block" />
                </Link>
              </li>
            );
          })}
        </ol>
      </Bloc>

      <Bloc numero="02" titre="Le défi de ton étape" fil={e.fil}>
        <div className="grid items-center gap-8 border border-paper/14 bg-ink-2 p-7 sm:p-10 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <span className="font-display text-[92px] font-extrabold leading-none" style={{ color: e.fil }}>
              {defi.jours}
            </span>
            <span className="label block">jours · gratuit</span>
          </div>
          <div className="lg:col-span-6">
            <h2 className="font-display text-[28px] font-extrabold">{defi.titre}</h2>
            <p className="mt-3 text-[15.5px] text-dim">{defi.texte}</p>
          </div>
          <div className="lg:col-span-3">
            <Link to="/defis#defi-7" className="btn btn-or w-full justify-center">
              Commencer le défi <MoveRight size={16} />
            </Link>
          </div>
        </div>
      </Bloc>

      <Bloc numero="03" titre="Profils héros" fil={e.fil}>
        <Vu>
          <h2 className="display-l max-w-3xl">
            Les archétypes qui <span className="livre font-normal" style={{ color: e.fil }}>te correspondent</span>
          </h2>
        </Vu>
        <ul className="mt-10 grid gap-6 lg:grid-cols-3">
          {donnees.arche.map((a, i) => (
            <Vu as="li" key={a.type} delay={i * 100}>
              <CarteArchetype a={a} index={i} />
            </Vu>
          ))}
        </ul>
        <Link to="/quiz" className="btn btn-craie mt-12">
          Découvrir lequel je suis <MoveRight size={16} />
        </Link>
      </Bloc>

      <Bloc numero="04" titre="Questions fréquentes" fil={e.fil}>
        <h2 className="display-l max-w-2xl">Tu te poses ces questions&nbsp;?</h2>
        <ul className="mt-10 border-t border-paper/12">
          {e.faq.map((f, i) => {
            const actif = ouvert === i;
            return (
              <li key={f.q} className="border-b border-paper/12">
                <button
                  type="button"
                  onClick={() => setOuvert(actif ? null : i)}
                  aria-expanded={actif}
                  className="flex w-full items-start justify-between gap-6 py-6 text-left transition-colors hover:text-or"
                >
                  <span className="font-display text-[19px] font-extrabold leading-snug sm:text-[23px]">{f.q}</span>
                  <span className="mt-1 shrink-0" style={{ color: e.fil }}>
                    {actif ? <Minus size={20} /> : <Plus size={20} />}
                  </span>
                </button>
                <div
                  className="grid transition-[grid-template-rows] duration-500"
                  style={{ gridTemplateRows: actif ? "1fr" : "0fr", visibility: actif ? "visible" : "hidden" }}
                  aria-hidden={!actif}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-3xl pb-6 text-[16px] leading-relaxed text-dim">{f.r}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </Bloc>

      <Bloc numero="05" titre="Changer d’étape" fil={e.fil}>
        <div className="grid gap-4 sm:grid-cols-3">
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
