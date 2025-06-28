import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { UnrealBloomPass } from "three-stdlib";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";

// Effect 1: Cartoon Shader
const cartoonShader = {
  uniforms: {
    tDiffuse: { value: null },
    resolution: { value: new THREE.Vector2(1920, 1080) },
  },
  vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec2 resolution;
    varying vec2 vUv;
    void main() {
      vec2 dxy = 8.0 / resolution;
      vec2 coord = dxy * floor(vUv / dxy);
      gl_FragColor = texture2D(tDiffuse, coord);
    }
  `,
};

// Effect 2: Gameboy Shader (Original Green + Dynamic Tint)
const gameboyShader = {
  uniforms: {
    tDiffuse: { value: null },
    gbResolution: { value: new THREE.Vector2(160, 144) },
    palette: {
      value: [
        0.73,
        0.88,
        0.59, // lightest
        0.51,
        0.69,
        0.36, // light
        0.31,
        0.48,
        0.21, // dark
        0.15,
        0.28,
        0.13, // darkest
      ],
    },
    tintColor: { value: new THREE.Color(1.0, 1.0, 1.0) }, // Default: No tint
  },
  vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec2 gbResolution;
    uniform float palette[12];
    uniform vec3 tintColor;
    varying vec2 vUv;

    vec3 getGBColor(float v) {
      if (v > 0.75) return vec3(palette[0], palette[1], palette[2]);
      else if (v > 0.5) return vec3(palette[3], palette[4], palette[5]);
      else if (v > 0.25) return vec3(palette[6], palette[7], palette[8]);
      else return vec3(palette[9], palette[10], palette[11]);
    }

    void main() {
      vec2 gbUV = floor(vUv * gbResolution) / gbResolution;
      vec4 color = texture2D(tDiffuse, gbUV);
      float minLum = 0.01;
      float maxLum = 0.05;
      float lum = (color.r + color.g + color.b) / 3.0;
      lum = clamp((lum - minLum) / (maxLum - minLum), 0.0, 1.0);
      vec3 gbColor = getGBColor(lum);
      gl_FragColor = vec4(gbColor * tintColor, 1.0);
    }
  `,
};

// Effect 3: Glitch Shader
const glitchShader = {
  uniforms: {
    tDiffuse: { value: null },
    time: { value: 0.0 },
  },
  vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); }`,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float time;
    varying vec2 vUv;

    float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    void main() {
        vec2 uv = vUv;
        float t = time * 2.0;

        vec4 color = texture2D(tDiffuse, uv);
        
        // Calculate brightness/luminance
        float luminance = dot(color.rgb, vec3(0.299, 0.587, 0.114));
        
        // Detect colored areas more aggressively to preserve both materials and light cones
        float maxColor = max(color.r, max(color.g, color.b));
        float minColor = min(color.r, min(color.g, color.b));
        float colorSaturation = (maxColor - minColor) / (maxColor + 0.001);
        
        // Preserve bright areas OR highly saturated areas (lights and light cones)
        float brightThreshold = 0.4; // Threshold for very bright areas (light materials)
        float saturationThreshold = 1.0; // Higher threshold for colored areas (light cones)
        
        // Check for very bright areas (emissive materials)
        float brightnessPreservation = smoothstep(brightThreshold - 0.1, brightThreshold + 0.1, luminance);
        
        // Check for colored areas even if not super bright (light cones)
        float saturationPreservation = smoothstep(saturationThreshold - 0.05, saturationThreshold + 0.05, colorSaturation);
        
        // Use OR logic - preserve if either bright OR colored
        float colorPreservation = max(brightnessPreservation, saturationPreservation);
        
        // Convert to grayscale
        float gray = luminance;
        vec3 grayColor = vec3(gray);
        
        // Mix between grayscale and original color based on brightness
        vec3 finalColor = mix(grayColor, color.rgb, colorPreservation);
        
        gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
};

// Effect 4: Ripple Shader
const RippleShader = {
  uniforms: {
    tDiffuse: { value: null },
    time: { value: 0.0 },
    frequency: { value: 20.0 },
    amplitude: { value: 0.01 },
  },
  vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); }`,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float time;
    uniform float frequency;
    uniform float amplitude;
    varying vec2 vUv;

    void main() {
      vec2 p = vUv;
      float ripple = sin((p.x * frequency) + time) * sin((p.y * frequency) + time) * amplitude;
      p.x += ripple;
      p.y += ripple;
      gl_FragColor = texture2D(tDiffuse, p);
    }
  `,
};

export function Effects({ currentSongIndex, shaderColor }) {
  const { gl, scene, camera, clock } = useThree();
  const composer = useRef();
  const gameboyPass = useRef();
  const watercolorPass = useRef();
  const ripplePass = useRef();

  // Update gameboy shader tint color when prop changes
  useEffect(() => {
    if (gameboyPass.current && gameboyPass.current.uniforms.tintColor) {
      gameboyPass.current.uniforms.tintColor.value.set(shaderColor);
    }
  }, [shaderColor]);

  useEffect(() => {
    if (!gl || !scene || !camera) return;

    const effectComposer = new EffectComposer(gl);
    effectComposer.setSize(window.innerWidth, window.innerHeight);

    const renderPass = new RenderPass(scene, camera);
    effectComposer.addPass(renderPass);

    const effectIndex = currentSongIndex % 5;
    gameboyPass.current = null; // Reset ref
    watercolorPass.current = null;
    ripplePass.current = null;

    // Effect 0: Bloom and Film
    if (effectIndex === 0) {
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.5,
        0.4,
        0.85,
      );
      effectComposer.addPass(bloomPass);
      const filmPass = new FilmPass(1.35, 0.025, 648, false);
      effectComposer.addPass(filmPass);
    }
    // Effect 1: Cartoon
    else if (effectIndex === 1) {
      const cartoonPass = new ShaderPass(cartoonShader);
      effectComposer.addPass(cartoonPass);
    }
    // Effect 2: Gameboy
    else if (effectIndex === 2) {
      const pass = new ShaderPass(gameboyShader);
      if (pass.uniforms.tintColor) {
        // Check if uniform exists
        pass.uniforms.tintColor.value.set(shaderColor);
      }
      gameboyPass.current = pass;
      effectComposer.addPass(pass);
    }
    // Effect 3: Glitch
    else if (effectIndex === 3) {
      const pass = new ShaderPass(glitchShader);
      watercolorPass.current = pass;
      effectComposer.addPass(pass);
    }
    // Effect 4: Ripple
    else if (effectIndex === 4) {
      const pass = new ShaderPass(RippleShader);
      ripplePass.current = pass;
      effectComposer.addPass(pass);
    }

    composer.current = effectComposer;

    const handleResize = () => {
      effectComposer.setSize(window.innerWidth, window.innerHeight);
      const pass = effectComposer.passes[1];
      if (pass && pass.uniforms && pass.uniforms.resolution) {
        pass.uniforms.resolution.value.x =
          window.innerWidth * window.devicePixelRatio;
        pass.uniforms.resolution.value.y =
          window.innerHeight * window.devicePixelRatio;
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (composer.current) {
        composer.current.passes.forEach((pass) => {
          if (pass.dispose) pass.dispose();
        });
        if (composer.current.renderTarget1)
          composer.current.renderTarget1.dispose();
        if (composer.current.renderTarget2)
          composer.current.renderTarget2.dispose();
      }
    };
  }, [gl, scene, camera, currentSongIndex, shaderColor]);

  useFrame((state, delta) => {
    if (composer.current) {
      const { clock } = state;
      if (watercolorPass.current) {
        watercolorPass.current.uniforms.time.value = clock.getElapsedTime();
      }
      if (ripplePass.current) {
        ripplePass.current.uniforms.time.value = clock.getElapsedTime();
      }
      composer.current.render(delta);
    }
  }, 1);

  return null;
}
