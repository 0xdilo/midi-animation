import React, { useRef, useCallback, useMemo, useEffect } from "react";
import { useGLTF, useAnimations, SpotLight } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { GeometryOptimizer } from "../utils/GeometryOptimizer";
import * as THREE from "three";

export default function Model(props) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/car2/scene.gltf");
  const { actions } = useAnimations(animations, group);
  const { lightColor = "#ffffff" } = props;

  // Create glowing materials for the headlights
  const [lightMaterial1, lightMaterial2] = useMemo(() => {
    const material1 = new THREE.MeshPhysicalMaterial({
      color: lightColor,
      emissive: lightColor,
      emissiveIntensity: 4,
      transparent: true,
      opacity: 0.9,
      metalness: 0,
      roughness: 0,
      transmission: 0.8,
      clearcoat: 1,
      toneMapped: false,
    });

    const material2 = material1.clone();
    
    return [material1, material2];
  }, [lightColor]);

  // Add cleanup for materials when component unmounts
  useEffect(() => {
    return () => {
      lightMaterial1.dispose();
      lightMaterial2.dispose();
    };
  }, [lightMaterial1, lightMaterial2]);

  // Create refs for all wheel groups
  const wheelRefs = {
    frontRight: useRef(),
    frontLeft: useRef(),
    backRight: useRef(),
    backLeft: useRef(),
  };

  const updateWheels = useCallback((delta) => {
    Object.values(wheelRefs).forEach((ref) => {
      if (ref.current) {
        ref.current.rotation.x += delta * 8;
      }
    });
  }, []);

  useFrame((state, delta) => {
    updateWheels(delta);
  });
  return (
    <group ref={group} {...props} dispose={null}>
      <group position={[-0, -2.4, -2.6]} scale={3}>
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
          <group name="root">
            <group name="GLTF_SceneRootNode" rotation={[Math.PI / 2, 0, 0]}>
              <group
                name="Cube002_7"
                position={[0, 0.962, 2.039]}
                rotation={[(-29 * Math.PI) / 180, 0, 0]}
              >
                <mesh
                  name="Object_11"
                  geometry={nodes.Object_11.geometry}
                  material={materials["Material.003"]}
                  frustumCulled={false}
                />
                <mesh
                  name="Object_12"
                  geometry={nodes.Object_12.geometry}
                  material={materials["Material.007"]}
                  frustumCulled={false}
                />
                <mesh
                  name="Object_13"
                  geometry={nodes.Object_13.geometry}
                  material={materials["Material.002"]}
                  frustumCulled={false}
                />
                <mesh
                  name="Object_14"
                  geometry={nodes.Object_14.geometry}
                  material={materials["Material.008"]}
                  frustumCulled={false}
                />
                <mesh
                  name="Object_15"
                  geometry={nodes.Object_15.geometry}
                  material={lightMaterial1}
                  frustumCulled={false}
                />
              </group>
              <group name="Cube001_6" position={[0, 0.962, 2.039]}>
                <mesh
                  name="Object_4"
                  geometry={nodes.Object_4.geometry}
                  material={materials["Material.003"]}
                  frustumCulled={false}
                />
                <mesh
                  name="Object_5"
                  geometry={nodes.Object_5.geometry}
                  material={materials["Material.004"]}
                  frustumCulled={false}
                />
                <mesh
                  name="Object_6"
                  geometry={nodes.Object_6.geometry}
                  material={materials["Material.005"]}
                  frustumCulled={false}
                />
                <mesh
                  name="Object_7"
                  geometry={nodes.Object_7.geometry}
                  material={materials["Material.006"]}
                  frustumCulled={false}
                />
                <mesh
                  name="Object_8"
                  geometry={nodes.Object_8.geometry}
                  material={materials["Material.009"]}
                  frustumCulled={false}
                />
                <mesh
                  name="Object_9"
                  geometry={nodes.Object_9.geometry}
                  material={materials["Material.010"]}
                  frustumCulled={false}
                />
              </group>
              <group
                ref={wheelRefs.frontRight}
                name="Circle001_9"
                position={[0.691, 0.72, 1.748]}
                rotation={[-0.63, 0, Math.PI / 2]}
                scale={0.157}
              >
                <mesh
                  name="Object_17"
                  geometry={nodes.Object_17.geometry}
                  material={materials["Material.011"]}
                  frustumCulled={false}
                />
                <mesh
                  name="Object_18"
                  geometry={nodes.Object_18.geometry}
                  material={materials["Material.018"]}
                  frustumCulled={false}
                />
                <mesh
                  name="Object_19"
                  geometry={nodes.Object_19.geometry}
                  material={materials["Material.021"]}
                  frustumCulled={false}
                />
                <mesh
                  name="Object_20"
                  geometry={nodes.Object_20.geometry}
                  material={materials["Material.023"]}
                  frustumCulled={false}
                />
              </group>
              <group name="Cube005_10" position={[0, 0.962, 2.039]}>
                <mesh
                  name="Object_22"
                  geometry={nodes.Object_22.geometry}
                  material={materials["Material.003"]}
                  frustumCulled={false}
                />
                <mesh
                  name="Object_23"
                  geometry={nodes.Object_23.geometry}
                  material={materials["Material.001"]}
                  frustumCulled={false}
                />
              </group>
              <group
                name="Plane_11"
                position={[-0.001, 0.686, 2.178]}
                scale={[0.484, 0.124, 0.124]}
              >
                <mesh
                  name="Object_25"
                  geometry={nodes.Object_25.geometry}
                  material={lightMaterial1}
                  frustumCulled={false}
                />
              </group>
              <group
                name="Plane001_13"
                position={[-0.001, 0.701, 2.192]}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={[-0.241, 0.093, 0.093]}
              >
                <mesh
                  name="Object_27"
                  geometry={nodes.Object_27.geometry}
                  material={lightMaterial2}
                  frustumCulled={false}
                />
              </group>
              <group
                name="Cube006_14"
                position={[0, 0.02, 0]}
                scale={[1.054, 1, 1]}
              >
                <mesh
                  name="Object_29"
                  geometry={nodes.Object_29.geometry}
                  material={materials["Material.017"]}
                  frustumCulled={false}
                />
              </group>
              <group
                name="Cube007_15"
                position={[0, 0.764, -0.429]}
                rotation={[0.11, 0, Math.PI]}
                scale={[-0.061, 0.053, 0.061]}
              >
                <mesh
                  name="Object_31"
                  geometry={nodes.Object_31.geometry}
                  material={materials["Material.016"]}
                  frustumCulled={false}
                />
              </group>
              <group name="Cube009_16">
                <mesh
                  name="Object_33"
                  geometry={nodes.Object_33.geometry}
                  material={materials["Material.010"]}
                  frustumCulled={false}
                />
              </group>
              <group name="Cube008_17" position={[0, 0.962, 2.039]}>
                <mesh
                  name="Object_35"
                  geometry={nodes.Object_35.geometry}
                  material={materials["Material.012"]}
                  frustumCulled={false}
                />
                <mesh
                  name="Object_36"
                  geometry={nodes.Object_36.geometry}
                  material={materials["Material.014"]}
                  frustumCulled={false}
                />
                <mesh
                  name="Object_37"
                  geometry={nodes.Object_37.geometry}
                  material={materials.material_0}
                  frustumCulled={false}
                />
              </group>
              <group
                name="Cube010_18"
                position={[0, 0.739, 2.188]}
                rotation={[3.136, 0, 0]}
                scale={[-0.061, 0.053, 0.061]}
              >
                <mesh
                  name="Object_39"
                  geometry={nodes.Object_39.geometry}
                  material={materials["Material.016"]}
                  frustumCulled={false}
                />
              </group>
              <group
                ref={wheelRefs.backRight}
                name="Circle002_19"
                position={[0.691, 0.72, 0.035]}
                rotation={[-0.63, 0, Math.PI / 2]}
                scale={0.157}
              >
                <mesh
                  name="Object_41"
                  geometry={nodes.Object_41.geometry}
                  material={materials["Material.011"]}
                  frustumCulled={false}
                />
                <mesh
                  name="Object_42"
                  geometry={nodes.Object_42.geometry}
                  material={materials["Material.018"]}
                  frustumCulled={false}
                />
                <mesh
                  name="Object_43"
                  geometry={nodes.Object_43.geometry}
                  material={materials["Material.021"]}
                  frustumCulled={false}
                />
                <mesh
                  name="Object_44"
                  geometry={nodes.Object_44.geometry}
                  material={materials["Material.023"]}
                  frustumCulled={false}
                />
              </group>
              <group
                ref={wheelRefs.backLeft}
                name="Circle003_20"
                position={[-0.688, 0.72, 0.035]}
                rotation={[-2.511, 0, -Math.PI / 2]}
                scale={0.157}
              >
                <mesh
                  name="Object_46"
                  geometry={nodes.Object_46.geometry}
                  material={materials["Material.011"]}
                  frustumCulled={false}
                />
                <mesh
                  name="Object_47"
                  geometry={nodes.Object_47.geometry}
                  material={materials["Material.018"]}
                  frustumCulled={false}
                />
                <mesh
                  name="Object_48"
                  geometry={nodes.Object_48.geometry}
                  material={materials["Material.021"]}
                  frustumCulled={false}
                />
                <mesh
                  name="Object_49"
                  geometry={nodes.Object_49.geometry}
                  material={materials["Material.023"]}
                  frustumCulled={false}
                />
              </group>
              <group
                ref={wheelRefs.frontLeft}
                name="Circle004_21"
                position={[-0.688, 0.72, 1.748]}
                rotation={[-2.511, 0, -Math.PI / 2]}
                scale={0.157}
              >
                <mesh
                  name="Object_51"
                  geometry={nodes.Object_51.geometry}
                  material={materials["Material.011"]}
                  frustumCulled={false}
                />
                <mesh
                  name="Object_52"
                  geometry={nodes.Object_52.geometry}
                  material={materials["Material.018"]}
                  frustumCulled={false}
                />
                <mesh
                  name="Object_53"
                  geometry={nodes.Object_53.geometry}
                  material={materials["Material.021"]}
                  frustumCulled={false}
                />
                <mesh
                  name="Object_54"
                  geometry={nodes.Object_54.geometry}
                  material={materials["Material.023"]}
                  frustumCulled={false}
                />
              </group>
            </group>
          </group>
        </group>
      </group>
      <group position={[-1.1, -0.6, 3.9]}>
        <SpotLight
          color={lightColor}
          intensity={0.05}
          angle={0.8}
          penumbra={0.8}
          distance={25}
          decay={1.5}
          power={3}
          castShadow={false}
          target-position={[Math.cos(15.7) * 10, 0, Math.sin(16.4) * 10]}
        />
      </group>
      <group position={[1.1, -0.6, 3.9]}>
        <SpotLight
          color={lightColor}
          intensity={0.05}
          angle={0.8}
          penumbra={0.8}
          distance={25}
          decay={1.5}
          power={3}
          castShadow={false}
          target-position={[Math.cos(15.7) * 10, 0, -4]}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/car2/scene.gltf");
