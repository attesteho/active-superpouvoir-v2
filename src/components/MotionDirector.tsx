import { useEffect } from "react";
import gsap from "gsap";
import { useRoute } from "../lib/router";
import { mouvementReduit } from "../lib/motion";

/**
 * Couche motion globale volontairement non destructive.
 * Les pages possèdent déjà leurs propres timelines et ScrollTriggers :
 * ce directeur ne touche jamais à leur opacity, visibility ou transform.
 */
export function MotionDirector() {
  const { chemin } = useRoute();

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".site-under-intro");
    const stage = document.querySelector<HTMLElement>(".route-stage");
    if (!root || !stage) return;

    root.classList.add("motion-enabled");
    stage.classList.remove("route-stage--entering", "route-stage--reduced");
    void stage.offsetWidth;
    if (mouvementReduit()) {
      stage.classList.add("route-stage--reduced");
      return;
    }
    stage.classList.add("route-stage--entering");

    const magneticTargets = Array.from(
      stage.querySelectorAll<HTMLElement>(".btn, a.group"),
    );
    const cleanups: Array<() => void> = [];

    magneticTargets.forEach((target) => {
      const xTo = gsap.quickTo(target, "x", { duration: 0.34, ease: "power3.out" });
      const yTo = gsap.quickTo(target, "y", { duration: 0.34, ease: "power3.out" });
      const onMove = (event: PointerEvent) => {
        const box = target.getBoundingClientRect();
        xTo((event.clientX - (box.left + box.width / 2)) * 0.08);
        yTo((event.clientY - (box.top + box.height / 2)) * 0.08);
      };
      const onLeave = () => {
        xTo(0);
        yTo(0);
      };
      target.addEventListener("pointermove", onMove);
      target.addEventListener("pointerleave", onLeave);
      cleanups.push(() => {
        target.removeEventListener("pointermove", onMove);
        target.removeEventListener("pointerleave", onLeave);
        gsap.killTweensOf(target, "x,y");
        target.style.removeProperty("transform");
      });
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      stage.classList.remove("route-stage--entering");
    };
  }, [chemin]);

  useEffect(() => {
    if (mouvementReduit() || window.matchMedia("(hover: none)").matches) return;
    const aura = document.querySelector<HTMLElement>(".cursor-aura");
    if (!aura) return;
    const xTo = gsap.quickTo(aura, "x", { duration: 0.32, ease: "power3.out" });
    const yTo = gsap.quickTo(aura, "y", { duration: 0.32, ease: "power3.out" });
    const onMove = (event: PointerEvent) => {
      xTo(event.clientX);
      yTo(event.clientY);
      document.documentElement.style.setProperty("--pointer-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--pointer-y", `${event.clientY}px`);
    };
    const onDown = () => aura.classList.add("cursor-aura--pressed");
    const onUp = () => aura.classList.remove("cursor-aura--pressed");
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return <div aria-hidden="true" className="cursor-aura" />;
}
