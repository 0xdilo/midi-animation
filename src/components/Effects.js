import { useThree, useFrame } from "@react-three/fiber";
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { UnrealBloomPass } from 'three-stdlib';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass';

export function Effects() {
  const { gl, scene, camera } = useThree();
  const composer = useRef();

  useEffect(() => {
    if (!gl || !scene || !camera) return;

    const effectComposer = new EffectComposer(gl);
    effectComposer.setSize(window.innerWidth, window.innerHeight);

    const renderPass = new RenderPass(scene, camera);
    effectComposer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.5,
      0.4,
      0.85
    );
    effectComposer.addPass(bloomPass);

    const filmPass = new FilmPass(1.35, 0.025, 648, false);
    effectComposer.addPass(filmPass);

    composer.current = effectComposer;
    
    const handleResize = () => {
      effectComposer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      effectComposer.dispose();
    };
  }, [gl, scene, camera]);

  useFrame(() => {
    if (composer.current) {
      composer.current.render();
    }
  }, 1);

  return null;
}
