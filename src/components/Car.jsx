import React, { useRef, useMemo, useEffect } from "react";
import { SpotLight, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Model(props) {
  const { nodes, materials } = useGLTF("/car/scene.gltf");
  const { lightColor = "#ffffff" } = props;

  // Create glowing materials for the headlights using useMemo to prevent recreation on every render
  const [lightMaterial1, lightMaterial2, sideLightMaterial] = useMemo(() => {
    const material1 = new THREE.MeshPhysicalMaterial({
      color: lightColor,
      emissive: lightColor,
      emissiveIntensity: 5,
      transparent: true,
      opacity: 0.9,
      metalness: 0,
      roughness: 0,
      transmission: 1,
      clearcoat: 1,
      toneMapped: false,
    });

    const material2 = material1.clone();

    // Create side light material that changes with headlights but starts red
    const sideMaterial = new THREE.MeshPhysicalMaterial({
      color: props.lightColor === "#ffffff" ? "#F00000" : props.lightColor,
      emissive: props.lightColor === "#ffffff" ? "#F00000" : props.lightColor,
      emissiveIntensity: 10, // Less intense than headlights
      transparent: true,
      opacity: 0.9,
      metalness: 0,
      roughness: 0,
      transmission: 10,
      clearcoat: 1,
      toneMapped: false,
    });
    
    return [material1, material2, sideMaterial];
  }, [lightColor, props.lightColor]);

  // Create refs for all wheel groups
  const wheelRefs = {
    frontRight: useRef(),
    frontLeft: useRef(),
    backRight: useRef(),
    backLeft: useRef(),
  };

  useFrame((state, delta) => {
    // Rotate all wheel groups anti-clockwise
    Object.values(wheelRefs).forEach((ref) => {
      if (ref.current) {
        ref.current.rotation.x += delta * 8; // Positive for anti-clockwise, adjust speed by changing 2
      }
    });
  });
  // Add cleanup for materials when component unmounts
  useEffect(() => {
    return () => {
      // Dispose materials when component unmounts to prevent memory leaks
      lightMaterial1.dispose();
      lightMaterial2.dispose();
      sideLightMaterial.dispose();
    };
  }, [lightMaterial1, lightMaterial2, sideLightMaterial]);

  return (
    <group {...props} dispose={null}>
      <group position={[0.035, 0, 0]} scale={[0.26, 0.307, 0.26]}>
        <mesh
          geometry={nodes.Object_4.geometry}
          material={materials["Material.001"]}
        />
        <mesh
          geometry={nodes.Object_5.geometry}
          material={materials["Material.002"]}
        />
        <mesh
          geometry={nodes.Object_6.geometry}
          material={materials["Material.006"]}
        />
        <mesh
          geometry={nodes.Object_7.geometry}
          material={materials["Material.007"]}
        />

        {/* Left headlight */}
        <mesh geometry={nodes.Object_8.geometry} material={lightMaterial1} />
        <mesh
          geometry={nodes.Object_9.geometry}
          material={materials["Material.011"]}
        />
        <group position={[-4, 0, 13]}>
          <SpotLight
            color={lightColor}
            intensity={0.1}
            angle={1}
            penumbra={1}
            distance={30}
            decay={2}
            power={5}
            castShadow={false}
            target-position={[Math.cos(15.7) * 10, 0.9, Math.sin(16.4) * 10]}
          />
        </group>

        {/* Right headlight */}
        <mesh geometry={nodes.Object_10.geometry} material={lightMaterial2} />
        <group position={[4, 0, 13]}>
          <SpotLight
            color={lightColor}
            intensity={0.1}
            angle={1}
            penumbra={1}
            distance={30}
            decay={2}
            power={5}
            castShadow={false}
            target-position={[Math.cos(15.7) * 10, 0.9, Math.sin(16) * 10]}
          />
        </group>
        <mesh
          geometry={nodes.Object_11.geometry}
          material={materials["Material.013"]}
        />
        <mesh
          geometry={nodes.Object_12.geometry}
          material={sideLightMaterial}
        />
        {/* Side light spotlight back */}
      </group>
      <group
        ref={wheelRefs.frontRight}
        position={[1.672, -0.25, -2.991]}
        scale={[0.26, 0.307, 0.26]}
      >
        <mesh
          geometry={nodes.Object_14.geometry}
          material={materials["Material.003"]}
        />
        <mesh
          geometry={nodes.Object_15.geometry}
          material={materials["Material.004"]}
        />
        <mesh
          geometry={nodes.Object_16.geometry}
          material={materials["Material.020"]}
        />
      </group>
      <group
        ref={wheelRefs.frontLeft}
        position={[-1.607, -0.25, -2.991]}
        rotation={[-Math.PI, 0, -Math.PI]}
        scale={[0.26, 0.307, 0.26]}
      >
        <mesh
          geometry={nodes.Object_18.geometry}
          material={materials["Material.003"]}
        />
        <mesh
          geometry={nodes.Object_19.geometry}
          material={materials["Material.004"]}
        />
        <mesh
          geometry={nodes.Object_20.geometry}
          material={materials["Material.020"]}
        />
      </group>
      <group
        ref={wheelRefs.backRight}
        position={[1.672, -0.266, 2.523]}
        scale={[0.26, 0.307, 0.26]}
      >
        <mesh
          geometry={nodes.Object_22.geometry}
          material={materials["Material.003"]}
        />
        <mesh
          geometry={nodes.Object_23.geometry}
          material={materials["Material.004"]}
        />
        <mesh
          geometry={nodes.Object_24.geometry}
          material={materials["Material.020"]}
        />
      </group>
      <group
        ref={wheelRefs.backLeft}
        position={[-1.607, -0.266, 2.523]}
        rotation={[-Math.PI, 0, -Math.PI]}
        scale={[0.26, 0.307, 0.26]}
      >
        <mesh
          geometry={nodes.Object_26.geometry}
          material={materials["Material.003"]}
        />
        <mesh
          geometry={nodes.Object_27.geometry}
          material={materials["Material.004"]}
        />
        <mesh
          geometry={nodes.Object_28.geometry}
          material={materials["Material.020"]}
        />
      </group>
      <group scale={[0.26, 0.307, 0.26]}>
        <mesh
          geometry={nodes.Object_30.geometry}
          material={materials.fpostersmallwall_textureproduct750x1000}
        />
        <mesh
          geometry={nodes.Object_31.geometry}
          material={materials["Material.010"]}
        />
      </group>
      <group scale={[0.26, 0.307, 0.26]}>
        <mesh
          geometry={nodes.Object_33.geometry}
          material={materials.fpostersmallwall_textureproduct750x1000}
        />
        <mesh
          geometry={nodes.Object_34.geometry}
          material={materials["Material.010"]}
        />
      </group>
      <group position={[0.014, 0, 0]} scale={[0.26, 0.307, 0.26]}>
        <mesh
          geometry={nodes.Object_38.geometry}
          material={materials["tofu_shop.002"]}
        />
        <mesh
          geometry={nodes.Object_39.geometry}
          material={materials["Material.034"]}
        />
      </group>
      <mesh
        geometry={nodes.Object_36.geometry}
        material={materials["Material.002"]}
        scale={[0.26, 0.307, 0.26]}
      />
    </group>
  );
}

useGLTF.preload("/car/scene.gltf");
