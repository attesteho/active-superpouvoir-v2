import { useCallback, useEffect, useState } from "react";
import { RouteProvider, useRoute } from "./lib/router";
import { Entete, Pied } from "./components/Chrome";
import { OuvertureLivre } from "./components/OuvertureLivre";
import Accueil from "./pages/Accueil";
import LeLivre from "./pages/LeLivre";
import Quiz from "./pages/Quiz";
import Cartes from "./pages/Cartes";
import Defis from "./pages/Defis";
import Bibliotheque from "./pages/Bibliotheque";
import { Boutique, FicheProduit } from "./pages/Boutique";
import Parcours from "./pages/Parcours";
import Communaute from "./pages/Communaute";
import { APropos, Contact, Introuvable } from "./pages/Annexes";
import { MotionDirector } from "./components/MotionDirector";
import { MotionLayer } from "./components/MotionLayer";
import { CartProvider } from "./lib/cart";
import { PanierPage, CommandePage, ConfirmationPage } from "./pages/Commande";

/** Fond papier : trame de calage très légère + grain d'impression. Aucun halo, aucun dégradé décoratif. */
function Fond() {
  return (
    <div className="pointer-events-none fixed -z-10" aria-hidden="true">
      <div className="absolute bg-ink" />
      <div className="warp absolute" />
      <div className="grain absolute" />
    </div>
  );
}

function Pages() {
  const { chemin } = useRoute();
  const [base] = chemin.split("#");
  const propre = base.replace(/\/+$/, "") || "/";

  useEffect(() => {
    document.title =
      {
        "/": "Active ton Superpouvoir ! — Nadine Zoro · La Fabrique des Héros",
        "/le-livre": "Le livre — Active ton Superpouvoir ! de Nadine Zoro",
        "/quiz": "Quiz — Découvre ton profil de héros",
        "/cartes": "30 Cartes Anti-Doutes — Active ton Superpouvoir",
        "/defis": "Les défis 7, 30 et 60 jours — Active ton Superpouvoir",
        "/bibliotheque": "La bibliothèque — Active ton Superpouvoir",
        "/boutique": "Boutique — Active ton Superpouvoir",
        "/panier": "Panier — Active ton Superpouvoir",
        "/commande": "Commande — Active ton Superpouvoir",
        "/confirmation": "Confirmation — Active ton Superpouvoir",
        "/communaute": "La communauté — Active ton Superpouvoir",
        "/a-propos": "Qui suis-je ? — Nadine Zoro",
        "/contact": "Contact — Active ton Superpouvoir",
      }[propre] || "Active ton Superpouvoir ! — Nadine Zoro";
  }, [propre]);

  if (propre === "/") return <Accueil />;
  if (propre === "/le-livre") return <LeLivre />;
  if (propre === "/quiz") return <Quiz />;
  if (propre === "/cartes") return <Cartes />;
  if (propre === "/defis") return <Defis />;
  if (propre === "/bibliotheque") return <Bibliotheque />;
  if (propre === "/boutique") return <Boutique />;
  if (propre.startsWith("/boutique/")) return <FicheProduit slug={propre.replace("/boutique/", "")} />;
  if (propre === "/panier") return <PanierPage />;
  if (propre === "/commande") return <CommandePage />;
  if (propre === "/confirmation") return <ConfirmationPage />;
  if (propre === "/parcours") return <Parcours id="explorateur" />;
  if (propre.startsWith("/parcours/")) return <Parcours id={propre.replace("/parcours/", "")} />;
  if (propre === "/communaute") return <Communaute />;
  if (propre === "/a-propos") return <APropos />;
  if (propre === "/contact") return <Contact />;
  return <Introuvable chemin={propre} />;
}

export default function App() {
  return (
    <CartProvider>
      <RouteProvider>
        <Coquille />
      </RouteProvider>
    </CartProvider>
  );
}

function Coquille() {
  const { chemin } = useRoute();
  const [intro, setIntro] = useState(() => {
    if (typeof window === "undefined") return false;
    const cheminInitial = window.location.hash.replace(/^#/, "") || "/";
    if (cheminInitial !== "/") return false;
    if (new URLSearchParams(window.location.search).get("preview") === "hero") return false;
    if (new URLSearchParams(window.location.search).get("ouverture") === "1") return true;
    try {
      return window.sessionStorage.getItem("fabrique-ouverture-v1") !== "terminee";
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (chemin !== "/" && intro) setIntro(false);
  }, [chemin, intro]);

  const terminer = useCallback(() => {
    try {
      window.sessionStorage.setItem("fabrique-ouverture-v1", "terminee");
    } catch {
      // L’expérience reste utilisable si le stockage de session est bloqué.
    }
    setIntro(false);
  }, []);

  return (
    <>
      <div className={`site-under-intro ${intro ? "site-under-intro--locked" : ""}`} aria-hidden={intro} inert={intro}>
        <Fond />
        <Entete />
        <main id="contenu">
          <div key={chemin} className="route-stage">
            <Pages />
          </div>
        </main>
        <Pied />
      </div>
      <MotionDirector />
      <MotionLayer pret={!intro} />
      {intro && <OuvertureLivre onTerminer={terminer} />}
    </>
  );
}
