import { ArrowUpRight, Compass, Flame, Rocket, Users, Zap } from "lucide-react";
import { Link } from "../lib/router";

const promesses = [
  { icone: Compass, titre: "Je me découvre", detail: "Mes forces et mes talents" },
  { icone: Flame, titre: "Je dépasse mes doutes", detail: "Je change ma façon de penser" },
  { icone: Rocket, titre: "Je passe à l’action", detail: "Des défis concrets" },
  { icone: Users, titre: "Je fais partie d’une communauté", detail: "Qui m’inspire" },
];

export function HeroAccueil() {
  return (
    <section id="poste-00" className="relative overflow-hidden bg-ink-2 pt-[86px] sm:pt-[96px]">
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 xl:px-14">
        <div className="grid items-center gap-10 pb-12 pt-6 lg:grid-cols-12 lg:gap-8 lg:pb-16 lg:pt-10">
          <div className="lg:col-span-7">
            <p className="pastille">
              <Zap size={13} /> Active ton Superpouvoir
            </p>
            <h1 className="display-xl mt-5 max-w-xl uppercase text-paper">
              Et si ton <span className="livre whitespace-nowrap bg-jaune/70 px-1 text-paper">SuperPouvoir</span> était déjà en toi&nbsp;?
            </h1>
            <p className="mt-5 max-w-md text-[16px] leading-relaxed text-dim">
              Découvre tes talents, dépasse tes doutes et passe à l’action pour construire le futur que tu veux.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/quiz" className="btn btn-or">
                <Zap size={16} /> Découvre ton SuperPouvoir <ArrowUpRight size={15} />
              </Link>
              <Link to="/le-livre" className="btn btn-craie">
                Explorer le livre
              </Link>
            </div>
            <ul className="mt-7 flex flex-wrap gap-5 font-mono text-[11.5px] font-bold uppercase tracking-[0.1em] text-paper/70">
              <li>10 questions</li>
              <li>·</li>
              <li>3 minutes</li>
              <li>·</li>
              <li>8 profils</li>
            </ul>
          </div>

          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-[340px] rotate-2 overflow-hidden rounded-[28px] shadow-[18px_18px_0_rgba(50,16,68,0.14)] sm:max-w-[400px]">
              <img
                src="/book/cover.jpg"
                alt="Couverture du livre Active ton Superpouvoir, de Nadine Zoro"
                className="block h-auto w-full"
                width={1040}
                height={1330}
              />
            </div>
          </div>
        </div>

        <ul className="grid gap-4 border-t-2 border-paper/10 py-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {promesses.map(({ icone: Icone, titre, detail }) => (
            <li key={titre} className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange/12 text-orange">
                <Icone size={18} />
              </span>
              <div>
                <p className="font-display text-[14.5px] font-extrabold leading-tight text-paper">{titre}</p>
                <p className="text-[12.5px] text-dim-2">{detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
