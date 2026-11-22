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
    <section id="poste-00" className="relative overflow-hidden bg-ink pt-[104px]">
      <div className="mx-auto max-w-[1320px] px-5 pb-16 sm:px-8 xl:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <p className="pastille">
              <Zap size={13} /> Active ton Superpouvoir
            </p>
            <h1 className="display-l mt-4 uppercase text-paper">
              Et si ton <span className="livre inline-block whitespace-nowrap normal-case rounded-md bg-jaune/70 px-2 text-paper">SuperPouvoir</span> était déjà en toi&nbsp;?
            </h1>
            <p className="text-dim">
              Découvre tes talents, dépasse tes doutes et passe à l’action pour construire le futur que tu veux.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link to="/quiz" className="btn btn-or">
                <Zap size={16} /> Découvre ton SuperPouvoir <ArrowUpRight size={15} />
              </Link>
              <Link to="/le-livre" className="btn btn-craie">
                Explorer le livre
              </Link>
            </div>
            <ul className="mt-6 flex flex-wrap items-center gap-2.5 font-mono text-[12px] font-bold uppercase text-paper/60">
              <li>10 questions</li>
              <li>·</li>
              <li>3 minutes</li>
              <li>·</li>
              <li>8 profils</li>
            </ul>
          </div>

          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-[360px] rotate-2 overflow-hidden rounded-[28px] shadow-[18px_18px_0_rgba(47,15,73,0.14)]">
              <img
                src="/book/cover.jpg"
                alt="Couverture du livre Active ton Superpouvoir, de Nadine Zoro"
                className="block w-full"
                width={1040}
                height={1330}
              />
            </div>
          </div>
        </div>

        <ul className="mt-16 grid gap-x-8 gap-y-8 border-t border-paper/10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {promesses.map(({ icone: Icone, titre, detail }) => (
            <li key={titre} className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange/12 text-orange">
                <Icone size={18} />
              </span>
              <div>
                <p className="font-display text-[15px] font-extrabold leading-snug text-paper">{titre}</p>
                <p className="text-dim-2 mt-0.5">{detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
