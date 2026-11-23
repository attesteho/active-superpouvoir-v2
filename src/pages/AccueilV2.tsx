import { Parallax } from "../components/Parallax";
import { CadreDecoupe } from "../components/CadreDecoupe";
import { BoutonPeint } from "../components/BoutonPeint";
import { Precharge } from "../components/Precharge";
import { EtincellesCurseur } from "../components/EtincellesCurseur";
import { Icone } from "../components/Icone";
import { NavigationSections } from "../components/NavigationSections";

const SECTIONS = [
  { id: "v2-hero", label: "Accueil" },
  { id: "v2-chapitre", label: "Trois techniques" },
];

/**
 * Accueil « v2 immersif » — assemble les 4 chantiers techniques (scroll +
 * parallaxe, découpe papier déchiré, étincelles au curseur, bouton peint +
 * précharge) autour des illustrations dédiées du site, dans l'esprit de
 * stayveluwe.com. Page de démonstration, pas encore reliée à la navigation
 * principale (voir App.tsx : accessible via la route /v2).
 */
export function AccueilV2() {
  return (
    <>
      <Precharge />
      <EtincellesCurseur />

      <NavigationSections sections={SECTIONS} />

      <section id="v2-hero" className="relative isolate flex min-h-screen items-center overflow-hidden bg-paper pb-24 pt-[96px]">
        {/* 1 · fond — dégradé + trame tissée, quasi fixe */}
        <Parallax vitesse={0.1} ampleur={18} className="absolute inset-0 -z-10">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 140% at 15% 10%, var(--color-violet) 0%, var(--color-paper) 55%, #190828 100%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, var(--color-ink) 0 2px, transparent 2px 26px), repeating-linear-gradient(-45deg, var(--color-or) 0 2px, transparent 2px 34px)",
            }}
          />
        </Parallax>

        <div className="relative mx-auto grid w-full max-w-[1320px] items-center gap-12 px-[var(--spacing-gouttiere)] lg:grid-cols-12">
          {/* 2 · premier plan — titre + CTA, vitesse normale */}
          <Parallax vitesse={1} className="relative z-10 lg:col-span-6">
            <span
              className="pastille"
              style={{ background: "color-mix(in srgb, var(--color-or) 18%, transparent)", color: "var(--color-or)" }}
            >
              <Icone nom="eclair" taille={13} /> Active ton Superpouvoir
            </span>
            <h1 className="display-xl mt-4 uppercase text-ink">
              Et si ton <span className="text-or">superpouvoir</span>
              <br /> se lisait à livre ouvert ?
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <BoutonPeint to="/quiz" variante="or" icone={<Icone nom="eclair" taille={16} />}>
                Découvre ton SuperPouvoir
              </BoutonPeint>
              <BoutonPeint to="/le-livre" variante="craie" inverse icone={<Icone nom="livre-ouvert" taille={16} />}>
                Explorer le livre
              </BoutonPeint>
            </div>
          </Parallax>

          {/* 3 · plan intermédiaire — illustration, avance plus lentement que le scroll */}
          <Parallax vitesse={0.5} ampleur={22} className="relative z-10 lg:col-span-6">
            <div className="relative mx-auto max-w-[460px]">
              <span className="hero-photo-sticker" aria-hidden="true">
                <Icone nom="eclair" taille={22} />
              </span>
              <CadreDecoupe variante="vague-bas-prononcee" className="hero-photo-cadre--bd shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
                <img
                  src="/images/19-accueil-scene-complete.webp"
                  alt="L'héroïne d'Active ton Superpouvoir, dans la scène complète de l'accueil."
                  className="h-full w-full object-cover"
                  loading="eager"
                  decoding="async"
                />
              </CadreDecoupe>
            </div>
          </Parallax>
        </div>
      </section>

      <section id="v2-chapitre" className="decoupe decoupe-vague-haut relative bg-ink px-[var(--spacing-gouttiere)] py-20 text-paper">
        <div className="mx-auto max-w-[760px] text-center">
          <p className="label justify-center text-paper/55">Le nouveau chapitre</p>
          <h2 className="display-l mt-2">Trois techniques, une seule histoire</h2>
          <p className="mx-auto mt-3 max-w-[56ch] text-dim">
            Défilement fluide, découpes en bord de page, étincelles qui suivent ton geste : la même attention que
            celle portée aux pages du livre, maintenant au défilement du site.
          </p>
        </div>
      </section>
    </>
  );
}
