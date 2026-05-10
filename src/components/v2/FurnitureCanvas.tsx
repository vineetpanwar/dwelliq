"use client";

import { useEffect, useRef } from "react";

// Inspired by the Three.js instancing scatter example from the customize-3js repo
// Uses InstancedMesh to render hundreds of furniture silhouettes efficiently
export default function FurnitureCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: import("three").WebGLRenderer;
    let scene: import("three").Scene;
    let camera: import("three").PerspectiveCamera;
    let sofaMesh: import("three").InstancedMesh;
    let tableMesh: import("three").InstancedMesh;
    let lampMesh: import("three").InstancedMesh;
    let chairMesh: import("three").InstancedMesh;

    async function init() {
      const THREE = await import("three");

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(50, canvas!.clientWidth / canvas!.clientHeight, 0.1, 500);
      camera.position.set(0, 0, 100);

      renderer = new THREE.WebGLRenderer({ canvas: canvas!, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(canvas!.clientWidth, canvas!.clientHeight, false);
      renderer.setClearColor(0x000000, 0);

      const goldMat = new THREE.MeshBasicMaterial({
        color: 0xc9974a,
        transparent: true,
        opacity: 0.12,
        wireframe: false,
      });

      const lineMat = new THREE.MeshBasicMaterial({
        color: 0xc9974a,
        transparent: true,
        opacity: 0.22,
        wireframe: true,
      });

      const COUNT = 60;

      // Sofa silhouette — wide flat box
      const sofaGeo = new THREE.BoxGeometry(8, 3, 4);
      sofaMesh = new THREE.InstancedMesh(sofaGeo, goldMat.clone(), COUNT);

      // Coffee table — thin wide box
      const tableGeo = new THREE.BoxGeometry(5, 1, 3);
      tableMesh = new THREE.InstancedMesh(tableGeo, lineMat.clone(), COUNT);

      // Floor lamp — tall thin cylinder
      const lampGeo = new THREE.CylinderGeometry(0.3, 0.5, 8, 6);
      lampMesh = new THREE.InstancedMesh(lampGeo, goldMat.clone(), COUNT);

      // Accent chair — smaller box
      const chairGeo = new THREE.BoxGeometry(4, 4, 3);
      chairMesh = new THREE.InstancedMesh(chairGeo, lineMat.clone(), COUNT);

      const matrix = new THREE.Matrix4();
      const spread = 140;

      const allMeshes = [sofaMesh, tableMesh, lampMesh, chairMesh];

      allMeshes.forEach((mesh) => {
        for (let i = 0; i < COUNT; i++) {
          const x = (Math.random() - 0.5) * spread;
          const y = (Math.random() - 0.5) * spread * 0.6;
          const z = (Math.random() - 0.5) * 60;
          const rx = Math.random() * Math.PI * 2;
          const ry = Math.random() * Math.PI * 2;
          const s = 0.5 + Math.random() * 1.5;

          matrix.makeRotationFromEuler(new THREE.Euler(rx, ry, 0));
          matrix.setPosition(x, y, z);
          matrix.scale(new THREE.Vector3(s, s, s));
          mesh.setMatrixAt(i, matrix);
          mesh.instanceMatrix.needsUpdate = true;
        }
        mesh.userData = {
          rotSpeed: (Math.random() - 0.5) * 0.0006,
          driftY: (Math.random() - 0.5) * 0.015,
        };
        scene.add(mesh);
      });

      // Animated horizontal scan line — from the custom attributes example
      const linePoints: import("three").Vector3[] = [];
      for (let i = 0; i < 200; i++) {
        linePoints.push(new THREE.Vector3(-100 + i, 0, 0));
      }
      const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
      const lineMesh = new THREE.Line(
        lineGeo,
        new THREE.LineBasicMaterial({ color: 0xc9974a, transparent: true, opacity: 0.08 })
      );
      scene.add(lineMesh);

      animate(THREE);
    }

    function animate(THREE: typeof import("three")) {
      frameRef.current = requestAnimationFrame(() => animate(THREE));
      const t = Date.now() * 0.001;

      const allMeshes = [sofaMesh, tableMesh, lampMesh, chairMesh];
      if (!allMeshes[0]) return;

      const matrix = new THREE.Matrix4();
      const quat = new THREE.Quaternion();
      const scale = new THREE.Vector3();
      const pos = new THREE.Vector3();

      allMeshes.forEach((mesh, mi) => {
        for (let i = 0; i < 60; i++) {
          mesh.getMatrixAt(i, matrix);
          matrix.decompose(pos, quat, scale);

          pos.y += mesh.userData.driftY * 0.5;
          if (pos.y > 60) pos.y = -60;
          if (pos.y < -60) pos.y = 60;

          const euler = new THREE.Euler().setFromQuaternion(quat);
          euler.y += mesh.userData.rotSpeed * (1 + mi * 0.2);
          euler.x += mesh.userData.rotSpeed * 0.3;
          quat.setFromEuler(euler);

          matrix.compose(pos, quat, scale);
          mesh.setMatrixAt(i, matrix);
        }
        mesh.instanceMatrix.needsUpdate = true;
      });

      camera.position.x = Math.sin(t * 0.06) * 8;
      camera.position.y = Math.cos(t * 0.04) * 4;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }

    function handleResize() {
      if (!canvas || !renderer) return;
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
