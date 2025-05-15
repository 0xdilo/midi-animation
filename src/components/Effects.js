import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { UnrealBloomPass } from "three-stdlib";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";

const cartoonShader = {
  uniforms: {
    tDiffuse: { value: null },
    pixelSize: { value: 5.0 },
    resolution: { value: new THREE.Vector2(1920, 1080) },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float pixelSize;
    uniform vec2 resolution;
    varying vec2 vUv;

    void main() {
      vec2 dxy = pixelSize / resolution;
      vec2 coord = dxy * floor(vUv / dxy);
      gl_FragColor = texture2D(tDiffuse, coord);
    }
  `,
};

const neonWireframeShader = {
  uniforms: {
    tDiffuse: { value: null },
    neonColor: { value: new THREE.Vector3(0.3, 1.0, 1.0) }, // Cyan
    texelSize: { value: new THREE.Vector2(1 / 1920, 1 / 1080) },
    edgeThreshold: { value: 0.12 },
    glowStrength: { value: 2.5 },
    backgroundDarkness: { value: 0.15 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec3 neonColor;
    uniform vec2 texelSize;
    uniform float edgeThreshold;
    uniform float glowStrength;
    uniform float backgroundDarkness;
    varying vec2 vUv;

    // Sobel edge detection
    float sobelEdge(vec2 uv) {
      vec3 s00 = texture2D(tDiffuse, uv + texelSize * vec2(-1.0, -1.0)).rgb;
      vec3 s10 = texture2D(tDiffuse, uv + texelSize * vec2( 0.0, -1.0)).rgb;
      vec3 s20 = texture2D(tDiffuse, uv + texelSize * vec2( 1.0, -1.0)).rgb;
      vec3 s01 = texture2D(tDiffuse, uv + texelSize * vec2(-1.0,  0.0)).rgb;
      vec3 s21 = texture2D(tDiffuse, uv + texelSize * vec2( 1.0,  0.0)).rgb;
      vec3 s02 = texture2D(tDiffuse, uv + texelSize * vec2(-1.0,  1.0)).rgb;
      vec3 s12 = texture2D(tDiffuse, uv + texelSize * vec2( 0.0,  1.0)).rgb;
      vec3 s22 = texture2D(tDiffuse, uv + texelSize * vec2( 1.0,  1.0)).rgb;

      vec3 gx = -s00 - 2.0*s01 - s02 + s20 + 2.0*s21 + s22;
      vec3 gy = -s00 - 2.0*s10 - s20 + s02 + 2.0*s12 + s22;
      return length(gx) + length(gy);
    }

    void main() {
      float edge = sobelEdge(vUv);
      float edgeMask = smoothstep(edgeThreshold, edgeThreshold + 0.03, edge);

      // Glow: sample in a ring around the pixel
      float glow = 0.0;
      float samples = 0.0;
      for (float a = 0.0; a < 6.2831853; a += 1.5707963) { // 0, pi/2, pi, 3pi/2
        vec2 dir = vec2(cos(a), sin(a));
        glow += sobelEdge(vUv + dir * texelSize * 2.5);
        samples += 1.0;
      }
      glow = glow / samples;
      float glowMask = smoothstep(edgeThreshold * 0.5, edgeThreshold + 0.05, glow);

      // Compose neon color and dark background
      vec3 neon = neonColor * (edgeMask * 1.5 + glowMask * glowStrength);
      vec3 bg = texture2D(tDiffuse, vUv).rgb * backgroundDarkness;
      vec3 finalColor = mix(bg, neon, clamp(edgeMask + glowMask, 0.0, 1.0));

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
};


export function Effects({ currentSongIndex }) {
  const { gl, scene, camera } = useThree();
  const composer = useRef();

  useEffect(() => {
    if (!gl || !scene || !camera) return;

    const effectComposer = new EffectComposer(gl);
    effectComposer.setSize(window.innerWidth, window.innerHeight);

    const renderPass = new RenderPass(scene, camera);
    effectComposer.addPass(renderPass);

    if (currentSongIndex === 0) {
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.5,
        0.4,
        0.85
      );
      effectComposer.addPass(bloomPass);

      const filmPass = new FilmPass(1.35, 0.025, 648, false);
      effectComposer.addPass(filmPass);
    } else if (currentSongIndex === 1) {
      const cartoonPass = new ShaderPass(cartoonShader);
      effectComposer.addPass(cartoonPass);
    } else if (currentSongIndex === 2) {
      const wireframePass = new ShaderPass(neonWireframeShader);
      effectComposer.addPass(wireframePass);
    }

    composer.current = effectComposer;

    const handleResize = () => {
      effectComposer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      effectComposer.dispose();
    };
  }, [gl, scene, camera, currentSongIndex]); // Add currentSongIndex to dependencies

  useFrame(() => {
    if (composer.current) {
      composer.current.render();
    }
  }, 1);

  return null;
}

