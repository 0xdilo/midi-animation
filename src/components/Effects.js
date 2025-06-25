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
        0.73, 0.88, 0.59, // lightest
        0.51, 0.69, 0.36, // light
        0.31, 0.48, 0.21, // dark
        0.15, 0.28, 0.13  // darkest
      ]
    },
    tintColor: { value: new THREE.Color(1.0, 1.0, 1.0) } // Default: No tint
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

// Effect 3: Dot Screen Shader
const DotScreenShader = {
    uniforms: {
        'tDiffuse': { value: null },
        'tSize':    { value: new THREE.Vector2( 256, 256 ) },
        'center':   { value: new THREE.Vector2( 0.5, 0.5 ) },
        'angle':    { value: 1.57 },
        'scale':    { value: 1.0 }
    },
    vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); }`,
    fragmentShader: `
        uniform vec2 center;
        uniform float angle;
        uniform float scale;
        uniform vec2 tSize;
        uniform sampler2D tDiffuse;
        varying vec2 vUv;

        float pattern() {
            float s = sin( angle ), c = cos( angle );
            vec2 tex = vUv * tSize - center;
            vec2 point = vec2( c * tex.x - s * tex.y, s * tex.x + c * tex.y ) * scale;
            return ( sin( point.x ) * sin( point.y ) ) * 4.0;
        }

        void main() {
            vec4 color = texture2D( tDiffuse, vUv );
            float average = ( color.r + color.g + color.b ) / 3.0;
            gl_FragColor = vec4( vec3( average * 10.0 - 5.0 + pattern() ), color.a );
        }`
};

// Effect 4: Sobel Edge Detection Shader
const SobelOperatorShader = {
    uniforms: {
        'tDiffuse': { value: null },
        'resolution': { value: new THREE.Vector2() }
    },
    vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); }`,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform vec2 resolution;
        varying vec2 vUv;

        void main() {
            vec2 texel = vec2( 1.0 / resolution.x, 1.0 / resolution.y );
            const mat3 Gx = mat3( -1, -2, -1, 0, 0, 0, 1, 2, 1 );
            const mat3 Gy = mat3( -1, 0, 1, -2, 0, 2, -1, 0, 1 );

            float tx0y0 = texture2D( tDiffuse, vUv + texel * vec2( -1, -1 ) ).r;
            float tx1y0 = texture2D( tDiffuse, vUv + texel * vec2(  0, -1 ) ).r;
            float tx2y0 = texture2D( tDiffuse, vUv + texel * vec2(  1, -1 ) ).r;
            float tx0y1 = texture2D( tDiffuse, vUv + texel * vec2( -1,  0 ) ).r;
            float tx1y1 = texture2D( tDiffuse, vUv + texel * vec2(  0,  0 ) ).r;
            float tx2y1 = texture2D( tDiffuse, vUv + texel * vec2(  1,  0 ) ).r;
            float tx0y2 = texture2D( tDiffuse, vUv + texel * vec2( -1,  1 ) ).r;
            float tx1y2 = texture2D( tDiffuse, vUv + texel * vec2(  0,  1 ) ).r;
            float tx2y2 = texture2D( tDiffuse, vUv + texel * vec2(  1,  1 ) ).r;

            float Gx_val = tx0y0 * Gx[0][0] + tx1y0 * Gx[1][0] + tx2y0 * Gx[2][0] +
                           tx0y1 * Gx[0][1] + tx1y1 * Gx[1][1] + tx2y1 * Gx[2][1] +
                           tx0y2 * Gx[0][2] + tx1y2 * Gx[1][2] + tx2y2 * Gx[2][2];

            float Gy_val = tx0y0 * Gy[0][0] + tx1y0 * Gy[1][0] + tx2y0 * Gy[2][0] +
                           tx0y1 * Gy[0][1] + tx1y1 * Gy[1][1] + tx2y1 * Gy[2][1] +
                           tx0y2 * Gy[0][2] + tx1y2 * Gy[1][2] + tx2y2 * Gy[2][2];

            float G = sqrt( Gx_val * Gx_val + Gy_val * Gy_val );
            gl_FragColor = vec4( G, G, G, 1.0 );
        }`
};


export function Effects({ currentSongIndex, shaderColor }) {
  const { gl, scene, camera } = useThree();
  const composer = useRef();
  const gameboyPass = useRef();

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

    // Effect 0: Bloom and Film
    if (effectIndex === 0) {
      const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.5, 0.4, 0.85);
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
      if (pass.uniforms.tintColor) { // Check if uniform exists
        pass.uniforms.tintColor.value.set(shaderColor);
      }
      gameboyPass.current = pass;
      effectComposer.addPass(pass);
    } 
    // Effect 3: Dot Screen
    else if (effectIndex === 3) {
      const pass = new ShaderPass(DotScreenShader);
      if (pass.uniforms.scale) { // Check if uniform exists
        pass.uniforms.scale.value = 4;
      }
      effectComposer.addPass(pass);
    } 
    // Effect 4: Edge Detection
    else if (effectIndex === 4) {
      const pass = new ShaderPass(SobelOperatorShader);
      if (pass.uniforms.resolution) { // Check if uniform exists
        pass.uniforms.resolution.value.x = window.innerWidth * window.devicePixelRatio;
        pass.uniforms.resolution.value.y = window.innerHeight * window.devicePixelRatio;
      }
      effectComposer.addPass(pass);
    }

    composer.current = effectComposer;

    const handleResize = () => {
      effectComposer.setSize(window.innerWidth, window.innerHeight);
      const pass = effectComposer.passes[1];
      if (pass && pass.uniforms && pass.uniforms.resolution) {
          pass.uniforms.resolution.value.x = window.innerWidth * window.devicePixelRatio;
          pass.uniforms.resolution.value.y = window.innerHeight * window.devicePixelRatio;
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (composer.current) {
        composer.current.passes.forEach(pass => {
          if (pass.dispose) pass.dispose();
        });
        if (composer.current.renderTarget1) composer.current.renderTarget1.dispose();
        if (composer.current.renderTarget2) composer.current.renderTarget2.dispose();
      }
    };
  }, [gl, scene, camera, currentSongIndex, shaderColor]);

  useFrame((state, delta) => {
    if (composer.current) {
      composer.current.render(delta);
    }
  }, 1);

  return null;
}