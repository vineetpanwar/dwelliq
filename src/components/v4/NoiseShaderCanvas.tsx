"use client";

import { useEffect, useRef } from "react";

// Custom GLSL ShaderMaterial — technique from webgl_custom_attributes_points2
// in the customize-3js repo. Uses Simplex-style noise in fragment shader
// to animate a warm gradient mesh that breathes like a living surface.
export default function NoiseShaderCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: import("three").WebGLRenderer;
    let scene: import("three").Scene;
    let camera: import("three").OrthographicCamera;
    let mesh: import("three").Mesh;

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    // Simplex-style gradient noise fragment shader
    // Blends three warm tones in animated fluid motion
    const fragmentShader = `
      uniform float uTime;
      uniform vec2 uResolution;
      varying vec2 vUv;

      // 2D hash
      vec2 hash2(vec2 p) {
        p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
        return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
      }

      // Gradient noise (value noise)
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(dot(hash2(i + vec2(0.0,0.0)), f - vec2(0.0,0.0)),
              dot(hash2(i + vec2(1.0,0.0)), f - vec2(1.0,0.0)), u.x),
          mix(dot(hash2(i + vec2(0.0,1.0)), f - vec2(0.0,1.0)),
              dot(hash2(i + vec2(1.0,1.0)), f - vec2(1.0,1.0)), u.x),
          u.y
        );
      }

      // Fractal Brownian Motion — 4 octaves
      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        vec2 shift = vec2(100.0);
        mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
        for (int i = 0; i < 4; i++) {
          v += a * noise(p);
          p = rot * p * 2.0 + shift;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = vUv;
        float t = uTime * 0.18;

        // Animate noise field
        vec2 q = vec2(
          fbm(uv + vec2(0.0, 0.0) + t * 0.4),
          fbm(uv + vec2(5.2, 1.3) + t * 0.3)
        );
        vec2 r = vec2(
          fbm(uv + 4.0 * q + vec2(1.7, 9.2) + t * 0.25),
          fbm(uv + 4.0 * q + vec2(8.3, 2.8) + t * 0.2)
        );
        float f = fbm(uv + 4.0 * r);

        // Warm palette: cream → stone → gold → deep warm
        vec3 cream  = vec3(0.992, 0.980, 0.965); // #FDFAF6
        vec3 stone  = vec3(0.961, 0.949, 0.933); // #F5F2EE
        vec3 gold   = vec3(0.788, 0.592, 0.290); // #C9974A at 0.6 sat
        vec3 deep   = vec3(0.941, 0.910, 0.871); // warm beige

        vec3 color = mix(cream, stone, clamp(f * f * 4.0, 0.0, 1.0));
        color = mix(color, gold,  clamp(length(q) * 0.4, 0.0, 1.0));
        color = mix(color, deep,  clamp(length(r) * 0.3, 0.0, 1.0));

        gl_FragColor = vec4(color, 1.0);
      }
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
          uResolution: { value: new THREE.Vector2(canvas!.clientWidth, canvas!.clientHeight) },
        },
      });

      mesh = new THREE.Mesh(geo, mat);
      scene.add(mesh);

      animate();
    }

    function animate() {
      frameRef.current = requestAnimationFrame(animate);
      const mat = mesh?.material as import("three").ShaderMaterial;
      if (mat?.uniforms) mat.uniforms.uTime.value = performance.now() * 0.001;
      renderer?.render(scene, camera);
    }

    function handleResize() {
      if (!canvas || !renderer) return;
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
      const mat = mesh?.material as import("three").ShaderMaterial;
      if (mat?.uniforms) {
        mat.uniforms.uResolution.value.set(canvas.clientWidth, canvas.clientHeight);
      }
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
    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ opacity: 0.85 }} />
  );
}
