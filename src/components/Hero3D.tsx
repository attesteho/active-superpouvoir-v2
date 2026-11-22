import { useEffect, useRef } from "react";
import * as THREE from "three";
import { mouvementReduit } from "../lib/motion";

/** Noyau de pouvoir : une matière lumineuse qui réagit au regard et au pointeur. */
export function Hero3D() {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = mount.current;
    if (!host) return;
    const reduced = mouvementReduit();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 0, 5.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0x9bd7c4, 0x020b0a, 1.6));
    const gold = new THREE.PointLight(0xffc61e, 13, 7);
    gold.position.set(-2.5, 2.4, 3);
    scene.add(gold);
    const ember = new THREE.PointLight(0xd63a16, 11, 6);
    ember.position.set(2.4, -1.4, 2.5);
    scene.add(ember);

    const power = new THREE.Group();
    scene.add(power);

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.78, 4),
      new THREE.MeshPhysicalMaterial({ color: 0xffc61e, emissive: 0xd63a16, emissiveIntensity: 0.55, roughness: 0.2, metalness: 0.25, clearcoat: 1, clearcoatRoughness: 0.12 })
    );
    power.add(core);

    const shell = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.03, 2),
      new THREE.MeshBasicMaterial({ color: 0xf2f0e8, wireframe: true, transparent: true, opacity: 0.42 })
    );
    power.add(shell);

    const ringMaterials = [
      new THREE.MeshBasicMaterial({ color: 0xffc61e, transparent: true, opacity: 0.9 }),
      new THREE.MeshBasicMaterial({ color: 0xd63a16, transparent: true, opacity: 0.86 }),
      new THREE.MeshBasicMaterial({ color: 0x2563eb, transparent: true, opacity: 0.7 }),
    ];
    const rings = [
      { radius: 1.42, tube: 0.018, rotation: [0.2, 0.3, 0.1] },
      { radius: 1.7, tube: 0.012, rotation: [1.2, -0.25, 0.65] },
      { radius: 2.0, tube: 0.009, rotation: [0.6, 1.1, -0.3] },
    ].map((definition, index) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(definition.radius, definition.tube, 8, 128), ringMaterials[index]);
      ring.rotation.set(...definition.rotation as [number, number, number]);
      power.add(ring);
      return ring;
    });

    const nodes = new THREE.Group();
    const nodeGeometry = new THREE.SphereGeometry(0.045, 12, 12);
    for (let index = 0; index < 18; index += 1) {
      const angle = (index / 18) * Math.PI * 2;
      const radius = 1.48 + (index % 3) * 0.17;
      const node = new THREE.Mesh(nodeGeometry, new THREE.MeshBasicMaterial({ color: index % 3 === 0 ? 0xffc61e : index % 3 === 1 ? 0xd63a16 : 0xf2f0e8 }));
      node.position.set(Math.cos(angle) * radius, Math.sin(angle * 1.7) * 0.28, Math.sin(angle) * radius);
      nodes.add(node);
    }
    power.add(nodes);

    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions: number[] = [];
    for (let index = 0; index < 160; index += 1) {
      const angle = index * 2.399;
      const radius = 1.9 + (index % 9) * 0.09;
      particlePositions.push(Math.cos(angle) * radius, (Math.sin(index * 1.83) * 0.5) * radius, Math.sin(angle) * radius);
    }
    particleGeometry.setAttribute("position", new THREE.Float32BufferAttribute(particlePositions, 3));
    const particles = new THREE.Points(particleGeometry, new THREE.PointsMaterial({ color: 0xffc61e, size: 0.022, transparent: true, opacity: 0.72 }));
    power.add(particles);

    const pointer = new THREE.Vector2();
    const target = new THREE.Vector2();
    const onPointerMove = (event: PointerEvent) => {
      const bounds = host.getBoundingClientRect();
      target.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      target.y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    };
    const onPointerLeave = () => target.set(0, 0);
    host.addEventListener("pointermove", onPointerMove);
    host.addEventListener("pointerleave", onPointerLeave);

    const resize = () => {
      const width = Math.max(1, host.clientWidth);
      const height = Math.max(1, host.clientHeight);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(host);

    let raf = 0;
    const start = performance.now();
    const render = (now: number) => {
      const time = (now - start) / 1000;
      pointer.lerp(target, reduced ? 1 : 0.06);
      power.rotation.y = reduced ? -0.2 : pointer.x * 0.18 + Math.sin(time * 0.3) * 0.04;
      power.rotation.x = reduced ? 0.05 : pointer.y * 0.13;
      core.rotation.x = time * 0.22;
      core.rotation.y = time * 0.35;
      shell.rotation.x = -time * 0.12;
      shell.rotation.y = time * 0.18;
      rings[0].rotation.z = time * 0.45;
      rings[1].rotation.x = time * 0.32;
      rings[2].rotation.y = -time * 0.24;
      nodes.rotation.y = -time * 0.18;
      particles.rotation.y = time * 0.08;
      core.scale.setScalar(1 + Math.sin(time * 1.8) * 0.035);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerleave", onPointerLeave);
      renderer.dispose();
      host.removeChild(renderer.domElement);
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach((material) => material.dispose());
        }
      });
    };
  }, []);

  return <div ref={mount} className="hero-3d-canvas" aria-hidden="true" />;
}
