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
    gbResolution: { value: new THREE.Vector2(160, 144) },
    palette: {
      value: [
        0.73, 0.88, 0.59, // lightest
        0.51, 0.69, 0.36, // light
        0.31, 0.48, 0.21, // dark
        0.15, 0.28, 0.13  // darkest
      ]
    }
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
    uniform vec2 gbResolution;
    uniform float palette[12];
    varying vec2 vUv;

    vec3 getGBColor(float v) {
      if (v > 0.75) return vec3(palette[0], palette[1], palette[2]);
      else if (v > 0.5) return vec3(palette[3], palette[4], palette[5]);
      else if (v > 0.25) return vec3(palette[6], palette[7], palette[8]);
      else return vec3(palette[9], palette[10], palette[11]);
    }

    void main() {
      // Downscale to Game Boy resolution, then upscale
      vec2 gbUV = floor(vUv * gbResolution) / gbResolution;
      vec4 color = texture2D(tDiffuse, gbUV);

      // Auto-contrast: remap luminance to [0,1]
      float minLum = 0.01; // tweak for your scene
      float maxLum = 0.05; // tweak for your scene
      float lum = (color.r + color.g + color.b) / 3.0;
      lum = clamp((lum - minLum) / (maxLum - minLum), 0.0, 1.0);

      vec3 gbColor = getGBColor(lum);

      gl_FragColor = vec4(gbColor, 1.0);
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
      wireframePass.uniforms.gbResolution.value.set(160, 144);
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

