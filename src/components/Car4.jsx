import React, { useRef, useCallback, useMemo, useEffect } from "react";
import { useGLTF, SpotLight } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { GeometryOptimizer } from "../utils/GeometryOptimizer";
import * as THREE from "three";

export default function Model(props) {
  const { nodes, materials } = useGLTF("/car4/scene.gltf");
  const { lightColor = "#ffffff" } = props;

  // Create refs for wheel groups
  const wheelRefs = {
    frontLeft: useRef(),
    frontRight: useRef(),
  };

  // Create glowing headlight materials
  const [headlightMaterial, headlightMaterial2] = useMemo(() => {
    const material1 = new THREE.MeshPhysicalMaterial({
      color: lightColor,
      emissive: lightColor,
      emissiveIntensity: 3.5,
      transparent: true,
      opacity: 0.8,
      metalness: 0,
      roughness: 0,
      transmission: 0.8,
      toneMapped: false,
    });

    const material2 = material1.clone();

    return [material1, material2];
  }, [lightColor]);

  const updateWheels = useCallback((delta) => {
    Object.values(wheelRefs).forEach((ref) => {
      if (ref.current) {
        ref.current.rotation.y += delta * 8;
      }
    });
  }, []);

  useFrame((state, delta) => {
    updateWheels(delta);
  });

  // Add cleanup for materials when component unmounts
  // Disabled cleanup to prevent disposing materials still in use
  // useEffect(() => {
  //   return () => {
  //     headlightMaterial.dispose();
  //     headlightMaterial2.dispose();
  //   };
  // }, [headlightMaterial, headlightMaterial2]);
  return (
    <group {...props} dispose={null}>
      <group scale={0.03}>
        <group
          position={[-80.022, 0, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={100}
        >
          <mesh
            geometry={nodes.body_glaaa_0.geometry}
            material={headlightMaterial}
          />
          <mesh
            geometry={nodes.body_Black_Metal_Paint_0.geometry}
            material={materials.Black_Metal_Paint}
          />
          <mesh
            geometry={nodes.body_black4_0.geometry}
            material={materials.black4}
          />
          <mesh
            geometry={nodes["body_����������������001_0"].geometry}
            material={materials[".001"]}
          />
          <mesh
            geometry={nodes["body_����������������003_0"].geometry}
            material={materials[".003"]}
          />
          <mesh
            geometry={nodes["body_����������������_0"].geometry}
            material={materials.material}
          />
          <mesh
            geometry={nodes.body_Glass001_0.geometry}
            material={materials["Glass.001"]}
          />
          <mesh
            geometry={nodes.body_material_8_0.geometry}
            material={materials.material_8}
          />
        </group>
        <group
          position={[-80.022, 0, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={100}
        >
          <mesh
            geometry={nodes.body001_material_8_0.geometry}
            material={materials.material_8}
          />
          <mesh
            geometry={nodes["body001_����������������008_0"].geometry}
            material={materials[".008"]}
          />
        </group>
        <group
          position={[-36.47, 60.668, 55.643]}
          rotation={[Math.PI, 0, 0]}
          scale={70.043}
        >
          <mesh
            geometry={nodes.mirrors_Black_Metal_Paint_0.geometry}
            material={materials.Black_Metal_Paint}
          />
          <mesh
            geometry={nodes.mirrors_Glass002_0.geometry}
            material={materials["Glass.002"]}
          />
        </group>
        <group
          ref={wheelRefs.frontLeft}
          position={[-85.066, 23.564, 31.483]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={21.449}
        >
          <mesh
            geometry={nodes.Cylinder_Material001_0_Material001_0.geometry}
            material={materials["Material.001"]}
          />
          <mesh
            geometry={nodes.Cylinder_Material001_0_Material004_0.geometry}
            material={materials["Material.004"]}
          />
          <mesh
            geometry={
              nodes["Cylinder_Material001_0_����������������005_0"].geometry
            }
            material={materials[".005"]}
          />
          <mesh
            geometry={
              nodes["Cylinder_Material001_0_����������������004_0"].geometry
            }
            material={materials[".004"]}
          />
          <mesh
            geometry={
              nodes["Cylinder_Material001_0_����������������006_0"].geometry
            }
            material={materials[".006"]}
          />
          <mesh
            geometry={
              nodes["Cylinder_Material001_0_����������������007_0"].geometry
            }
            material={materials[".007"]}
          />
        </group>
        <group
          ref={wheelRefs.frontRight}
          position={[87.572, 23.564, 31.483]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={21.449}
        >
          <mesh
            geometry={nodes.Cylinder_Material001_0001_Material001_0.geometry}
            material={materials["Material.001"]}
          />
          <mesh
            geometry={nodes.Cylinder_Material001_0001_Material004_0.geometry}
            material={materials["Material.004"]}
          />
          <mesh
            geometry={
              nodes["Cylinder_Material001_0001_����������������005_0"].geometry
            }
            material={materials[".005"]}
          />
          <mesh
            geometry={
              nodes["Cylinder_Material001_0001_����������������004_0"].geometry
            }
            material={materials[".004"]}
          />
          <mesh
            geometry={
              nodes["Cylinder_Material001_0001_����������������006_0"].geometry
            }
            material={materials[".006"]}
          />
          <mesh
            geometry={
              nodes["Cylinder_Material001_0001_����������������007_0"].geometry
            }
            material={materials[".007"]}
          />
        </group>
        <mesh
          geometry={nodes["body002_����������������002_0"].geometry}
          material={headlightMaterial}
          position={[-80.238, 0, -0.194]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={100}
        />
        <mesh
          geometry={nodes.Object_5_leather_black001_0.geometry}
          material={materials["leather_black.001"]}
          position={[18.833, 43.99, 21.695]}
          rotation={[-Math.PI / 2, -0.029, -Math.PI / 2]}
          scale={62.361}
        />
      </group>
      <group position={[-4, 0.2, -1]}>
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
      <group position={[-4, 0.2, 1]}>
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

useGLTF.preload("/car4/scene.gltf");
