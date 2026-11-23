/**
 * Icônes maison (src/icones/*.svg) — tracé 24×24, stroke="currentColor", même convention que lucide-react.
 * Chargées en texte brut au build (import.meta.glob), puis injectées dans un <svg> contrôlé en taille/couleur.
 */
const fichiers = import.meta.glob("../icones/*.svg", { eager: true, query: "?raw", import: "default" }) as Record<string, string>;

const interieur: Record<string, string> = {};
for (const chemin in fichiers) {
  const nom = chemin.split("/").pop()!.replace(".svg", "");
  const brut = fichiers[chemin];
  const match = brut.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  interieur[nom] = match ? match[1] : "";
}

export type NomIcone = keyof typeof interieur extends never ? string : string;

export function Icone({
  nom,
  taille = 20,
  className = "",
}: {
  nom:
    | "ampoule" | "calendrier" | "cible" | "coeur" | "compte" | "crayon" | "discussion" | "eclair"
    | "engrenage" | "etoile-logo" | "fleche-droite" | "fleche-gauche" | "fusee" | "groupe" | "horloge"
    | "lecture-video" | "livre-ouvert" | "menu" | "montagne" | "musique" | "palette" | "partage"
    | "projet" | "question" | "recherche" | "telechargement" | "trophee" | "validation";
  taille?: number;
  className?: string;
}) {
  const svg = interieur[nom];
  if (!svg) return null;
  return (
    <svg
      width={taille}
      height={taille}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
