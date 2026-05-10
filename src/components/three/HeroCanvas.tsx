"use client";

import { useEffect, useRef } from "react";

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let Three: typeof import("three") | null = null;
    let renderer: import("three").WebGLRenderer | null = null;
    let scene: import("three").Scene;
    let camera: import("three").PerspectiveCamera;
    const particles: import("three").Points[] = [];

    async function init() {
      Three = await import("three");

      scene = new Three.Scene();
      camera = new Three.PerspectiveCamera(
        60,
        canvas!.clientWidth / canvas!.clientHeight,
        0.1,
        1000
      );
      camera.position.z = 80;

      renderer = new Three.WebGLRenderer({
        canvas: canvas!,
        alpha: true,
        antialias: true,
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(canvas!.clientWidth, canvas!.clientHeight, false);
      renderer.setClearColor(0x000000, 0);

      // Floating geometric particles — warm golden tones
      const colors = [0xc9974a, 0xd4a96a, 0xe8c88a, 0xa67c3b, 0xf5e6c8];

      for (let i = 0; i < 5; i++) {
        const count = 80;
        const geo = new Three.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const sizes = new Float32Array(count);

        for (let j = 0; j < count; j++) {
          positions[j * 3] = (Math.random() - 0.5) * 160;
          positions[j * 3 + 1] = (Math.random() - 0.5) * 100;
          positions[j * 3 + 2] = (Math.random() - 0.5) * 60;
          sizes[j] = Math.random() * 2 + 0.5;
        }

        geo.setAttribute("position", new Three.BufferAttribute(positions, 3));
        geo.setAttribute("size", new Three.BufferAttribute(sizes, 1));

        const mat = new Three.PointsMaterial({
          color: colors[i],
          size: 1.2,
          transparent: true,
          opacity: 0.35,
          sizeAttenuation: true,
        });

        const pts = new Three.Points(geo, mat);
        pts.userData.speed = 0.0003 + Math.random() * 0.0004;
        pts.userData.drift = {
          x: (Math.random() - 0.5) * 0.0002,
          y: (Math.random() - 0.5) * 0.0002,
        };
        scene.add(pts);
        particles.push(pts);
      }

      // Soft ambient wireframe room lines
      const roomGeo = new Three.BoxGeometry(120, 70, 60);
      const edges = new Three.EdgesGeometry(roomGeo);
      const lineMat = new Three.LineBasicMaterial({
        color: 0xc9974a,
        transparent: true,
        opacity: 0.06,
      });
      const room = new Three.LineSegments(edges, lineMat);
      room.position.z = -20;
      scene.add(room);

      // Furniture silhouette planes
      const planeMat = new Three.MeshBasicMaterial({
        color: 0xc9974a,
        transparent: true,
        opacity: 0.04,
        side: Three.DoubleSide,
      });

      // Sofa silhouette
      const sofaGeo = new Three.BoxGeometry(30, 10, 12);
      const sofa = new Three.Mesh(sofaGeo, planeMat);
      sofa.position.set(-15, -18, -10);
      scene.add(sofa);

      // Table
      const tableGeo = new Three.BoxGeometry(16, 3, 10);
      const table = new Three.Mesh(tableGeo, planeMat);
      table.position.set(5, -26, -5);
      scene.add(table);

      // Floor
      const floorGeo = new Three.PlaneGeometry(200, 100);
      const floorMat = new Three.MeshBasicMaterial({
        color: 0xf5e6c8,
        transparent: true,
        opacity: 0.03,
      });
      const floor = new Three.Mesh(floorGeo, floorMat);
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = -35;
      scene.add(floor);

      animate();
    }

    function animate() {
      animRef.current = requestAnimationFrame(animate);
      if (!renderer || !Three) return;

      const t = Date.now() * 0.001;

      particles.forEach((pts, i) => {
        pts.rotation.y += pts.userData.speed;
        pts.rotation.x += pts.userData.speed * 0.4;
        pts.position.x += Math.sin(t * 0.3 + i) * 0.02;
        pts.position.y += Math.cos(t * 0.2 + i) * 0.01;
      });

      camera.position.x = Math.sin(t * 0.08) * 4;
      camera.position.y = Math.cos(t * 0.06) * 2;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }

    function handleResize() {
      if (!canvas || !renderer || !Three) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    }

    init();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animRef.current);
      renderer?.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.9 }}
    />
  );
}
