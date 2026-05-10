"use client";

import { useEffect, useRef } from "react";

// Aurora shader — custom GLSL fragment shader technique
// Blends sinusoidal color bands like a northern lights effect
// Warm version: gold, cream, sage tones instead of green/blue
export default function AuroraCanvas({ dark = false }: { dark?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: import("three").WebGLRenderer;
    let scene: import("three").Scene;
    let camera: import("three").OrthographicCamera;

    const fragmentShader = `
      uniform float uTime;
      uniform vec2  uRes;
      varying vec2  vUv;

      float wave(float x, float freq, float phase) {
        return sin(x * freq + phase + uTime * 0.4) * 0.5 + 0.5;
      }

      void main() {
        vec2 uv = vUv;
        float t = uTime * 0.25;

        // Three aurora bands at different heights
        float band1 = smoothstep(0.0, 0.25, wave(uv.x, 2.8, 0.0) * 0.28 + 0.62 - uv.y);
        float band2 = smoothstep(0.0, 0.20, wave(uv.x, 3.4, 2.1) * 0.22 + 0.40 - uv.y);
        float band3 = smoothstep(0.0, 0.18, wave(uv.x, 4.2, 4.5) * 0.18 + 0.22 - uv.y);

        float slow1 = sin(uv.x * 1.5 + t * 0.6) * 0.5 + 0.5;
        float slow2 = sin(uv.x * 2.1 + t * 0.4 + 1.0) * 0.5 + 0.5;

        ${dark ? `
          // Dark warm palette: deep ink, soft gold glow
          vec3 bg    = vec3(0.039, 0.035, 0.031); // #0A0908
          vec3 gold  = vec3(0.788, 0.592, 0.290); // #C9974A
          vec3 sage  = vec3(0.290, 0.416, 0.345); // #4A6A58
          vec3 deep  = vec3(0.180, 0.160, 0.140); // warm dark mid
          vec3 col   = bg;
          col = mix(col, deep * 1.2, band1 * 0.7);
          col = mix(col, gold * 0.5, band1 * slow1 * 0.5);
          col = mix(col, sage * 0.6, band2 * 0.5);
          col = mix(col, gold * 0.3, band3 * slow2 * 0.4);
          col += gold * 0.04 * wave(uv.x, 8.0, t) * band1;
        ` : `
          // Light warm palette: cream, stone, gold
          vec3 cream = vec3(0.992, 0.980, 0.965); // #FDFAF6
          vec3 stone = vec3(0.961, 0.949, 0.933); // #F5F2EE
          vec3 gold  = vec3(0.900, 0.780, 0.600); // soft gold
          vec3 blush = vec3(0.980, 0.965, 0.945); // warm blush
          vec3 col   = cream;
          col = mix(col, stone,  band1 * 0.6);
          col = mix(col, gold,   band1 * slow1 * 0.25);
          col = mix(col, blush,  band2 * 0.4);
          col = mix(col, stone,  band3 * slow2 * 0.3);
          col += vec3(0.02, 0.01, 0.0) * wave(uv.x, 6.0, t) * band1;
        `}

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const vertexShader = `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
    `;

    async function init() {
      const THREE = await import("three");
      scene = new THREE.Scene();
      camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      renderer = new THREE.WebGLRenderer({ canvas: canvas!, antialias: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(canvas!.clientWidth, canvas!.clientHeight, false);

      const geo = new THREE.PlaneGeometry(2, 2);
      const mat = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uRes: { value: new THREE.Vector2(canvas!.clientWidth, canvas!.clientHeight) },
        },
      });

      scene.add(new THREE.Mesh(geo, mat));
      animate(mat);
    }

    function animate(mat: import("three").ShaderMaterial) {
      frameRef.current = requestAnimationFrame(() => animate(mat));
      mat.uniforms.uTime.value = performance.now() * 0.001;
      renderer?.render(scene, camera);
    }

    function handleResize() {
      if (!canvas || !renderer) return;
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    }

    init();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(frameRef.current);
      renderer?.dispose();
    };
  }, [dark]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}
