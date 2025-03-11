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
    edgeThreshold: { value: 0.1 },
    edgeColor: { value: new THREE.Vector3(0, 0, 0) },
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
    uniform float edgeThreshold;
    uniform vec3 edgeColor;
    varying vec2 vUv;

    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      vec2 texel = vec2(1.0 / 1920.0, 1.0 / 1080.0);

      vec4 left = texture2D(tDiffuse, vUv - vec2(texel.x, 0.0));
      vec4 right = texture2D(tDiffuse, vUv + vec2(texel.x, 0.0));
      vec4 up = texture2D(tDiffuse, vUv + vec2(0.0, texel.y));
      vec4 down = texture2D(tDiffuse, vUv - vec2(0.0, texel.y));

      float edge = length(color.rgb - left.rgb) + length(color.rgb - right.rgb) +
                   length(color.rgb - up.rgb) + length(color.rgb - down.rgb);
      edge = step(edgeThreshold, edge);

      vec3 finalColor = mix(color.rgb, edgeColor, edge);
      gl_FragColor = vec4(finalColor, color.a);
    }
  `,
};

const neonWireframeShader = {
  uniforms: {
    tDiffuse: { value: null },
    glowColor: { value: new THREE.Vector3(0, 1, 1) }, // Cyan neon glow
    wireframeThreshold: { value: 0.15 },
    glowIntensity: { value: 2.0 },
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
    uniform vec3 glowColor;
    uniform float wireframeThreshold;
    uniform float glowIntensity;
    varying vec2 vUv;

    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      vec2 texel = vec2(1.0 / 1920.0, 1.0 / 1080.0);

      vec4 left = texture2D(tDiffuse, vUv - vec2(texel.x, 0.0));
      vec4 right = texture2D(tDiffuse, vUv + vec2(texel.x, 0.0));
      vec4 up = texture2D(tDiffuse, vUv + vec2(0.0, texel.y));
      vec4 down = texture2D(tDiffuse, vUv - vec2(0.0, texel.y));

      float edge = length(color.rgb - left.rgb) + length(color.rgb - right.rgb) +
                   length(color.rgb - up.rgb) + length(color.rgb - down.rgb);
      float wireframe = step(wireframeThreshold, edge);

      vec3 finalColor = mix(color.rgb, glowColor * glowIntensity, wireframe);
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
      // Default bloom effect for Song 1
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
      // Cartoon shader for Song 2
      const cartoonPass = new ShaderPass(cartoonShader);
      effectComposer.addPass(cartoonPass);
    } else if (currentSongIndex === 2) {
      // Neon wireframe shader for Song 3
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
