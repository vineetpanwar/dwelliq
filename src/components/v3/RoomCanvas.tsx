"use client";

import { useEffect, useRef } from "react";

// Inspired by Three.js CatmullRomCurve3 + TubeGeometry from the customize-3js repo
// Draws animated room floor plan paths as glowing tubes that write themselves on load
export default function RoomCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: import("three").WebGLRenderer;
    let scene: import("three").Scene;
    let camera: import("three").OrthographicCamera;
    const tubes: import("three").Mesh[] = [];
    const particles: import("three").Points[] = [];

    async function init() {
      const THREE = await import("three");

      scene = new THREE.Scene();
      const w = canvas!.clientWidth;
      const h = canvas!.clientHeight;
      const aspect = w / h;

      // Orthographic camera for a flat blueprint-like view
      const vSize = 55;
      camera = new THREE.OrthographicCamera(
        -vSize * aspect, vSize * aspect, vSize, -vSize, 0.1, 200
      );
      camera.position.z = 50;

      renderer = new THREE.WebGLRenderer({ canvas: canvas!, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(w, h, false);
      renderer.setClearColor(0x000000, 0);

      // ─ Room floor plan as CatmullRom curves ─────────────────────────────
      // Each curve = a room outline segment or furniture path
      const ROOM_PATHS: [number, number, number][][] = [
        // Main room outline — large L-shaped living room
        [[-40, -28, 0], [-40, 28, 0], [40, 28, 0], [40, -28, 0], [-40, -28, 0]],
        // Sofa outline
        [[-20, -8, 0], [-20, 4, 0], [8, 4, 0], [8, -8, 0], [-20, -8, 0]],
        // Coffee table
        [[-8, -4, 0], [-8, 0, 0], [4, 0, 0], [4, -4, 0], [-8, -4, 0]],
        // Floor lamp path — circle approximated
        [[18, 10, 0], [20, 12, 0], [22, 10, 0], [20, 8, 0], [18, 10, 0]],
        // Accent chair
        [[16, -10, 0], [16, -2, 0], [26, -2, 0], [26, -10, 0], [16, -10, 0]],
        // Area rug outline — larger
        [[-22, -10, 0], [-22, 6, 0], [14, 6, 0], [14, -10, 0], [-22, -10, 0]],
      ];

      const COLORS = [0xc9974a, 0xd4a96a, 0xe8c88a, 0xc9974a, 0xd4a96a, 0xc9974a];
      const OPACITIES = [0.4, 0.25, 0.18, 0.22, 0.2, 0.12];
      const RADII = [0.4, 0.3, 0.2, 0.2, 0.25, 0.15];

      ROOM_PATHS.forEach((pts, idx) => {
        const curvePoints = pts.map(([x, y, z]) => new THREE.Vector3(x, y, z));
        const curve = new THREE.CatmullRomCurve3(curvePoints, false, "catmullrom", 0.0);

        const geo = new THREE.TubeGeometry(curve, 60, RADII[idx], 6, false);
        const mat = new THREE.MeshBasicMaterial({
          color: COLORS[idx],
          transparent: true,
          opacity: 0,
        });
        const tube = new THREE.Mesh(geo, mat);
        tube.userData = {
          targetOpacity: OPACITIES[idx],
          delay: idx * 0.4,
          revealProgress: 0,
          revealDone: false,
        };
        scene.add(tube);
        tubes.push(tube);
      });

      // ─ Dimension lines (crosshair-style) ────────────────────────────────
      const lineMat = new THREE.LineBasicMaterial({
        color: 0xc9974a, transparent: true, opacity: 0.06, depthWrite: false,
      });
      for (let i = -40; i <= 40; i += 10) {
        const vGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(i, -28, 0),
          new THREE.Vector3(i, 28, 0),
        ]);
        scene.add(new THREE.Line(vGeo, lineMat));
      }
      for (let j = -28; j <= 28; j += 10) {
        const hGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-40, j, 0),
          new THREE.Vector3(40, j, 0),
        ]);
        scene.add(new THREE.Line(hGeo, lineMat));
      }

      // ─ Floating measurement dots ────────────────────────────────────────
      const dotGeo = new THREE.BufferGeometry();
      const dotPositions: number[] = [];
      for (let i = 0; i < 80; i++) {
        dotPositions.push(
          (Math.random() - 0.5) * 90,
          (Math.random() - 0.5) * 60,
          (Math.random() - 0.5) * 2
        );
      }
      dotGeo.setAttribute("position", new THREE.Float32BufferAttribute(dotPositions, 3));
      const dotMat = new THREE.PointsMaterial({
        color: 0xc9974a, size: 0.8, transparent: true, opacity: 0.15, sizeAttenuation: true,
      });
      const dots = new THREE.Points(dotGeo, dotMat);
      scene.add(dots);
      particles.push(dots);

      const startTime = Date.now();
      animate(THREE, startTime);
    }

    function animate(THREE: typeof import("three"), startTime: number) {
      frameRef.current = requestAnimationFrame(() => animate(THREE, startTime));
      const elapsed = (Date.now() - startTime) * 0.001;

      // Reveal tubes one by one
      tubes.forEach((tube) => {
        const mat = tube.material as import("three").MeshBasicMaterial;
        const { delay, targetOpacity } = tube.userData;
        const progress = Math.max(0, Math.min(1, (elapsed - delay) / 1.5));
        const eased = 1 - Math.pow(1 - progress, 3);
        mat.opacity = eased * targetOpacity;
      });

      // Gentle camera sway
      camera.position.x = Math.sin(elapsed * 0.08) * 2;
      camera.position.y = Math.cos(elapsed * 0.06) * 1.5;
      camera.lookAt(0, 0, 0);

      // Floating dots
      particles.forEach((pts) => {
        pts.rotation.z += 0.0003;
      });

      renderer.render(scene, camera);
    }

    function handleResize() {
      if (!canvas || !renderer) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const aspect = w / h;
      const vSize = 55;
      (camera as import("three").OrthographicCamera).left = -vSize * aspect;
      (camera as import("three").OrthographicCamera).right = vSize * aspect;
      (camera as import("three").OrthographicCamera).updateProjectionMatrix();
      renderer.setSize(w, h, false);
    }

    init();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(frameRef.current);
      renderer?.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
