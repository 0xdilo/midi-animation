import React from "react";
import { useGLTF } from "@react-three/drei";

export default function Model(props) {
  const { nodes, materials } = useGLTF("/cars/car3/scene.gltf");
  return (
    <group {...props} dispose={null} scale={2.7}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <mesh
          geometry={nodes.Object_2.geometry}
          material={materials["280z_Brake_lamp"]}
        />
        <mesh
          geometry={nodes.Object_3.geometry}
          material={materials["280z_CarPaint"]}
        />
        <mesh
          geometry={nodes.Object_4.geometry}
          material={materials["280z_Reverse_lamp"]}
        />
        <mesh
          geometry={nodes.Object_5.geometry}
          material={materials["280z_Carbon"]}
        />
        <mesh
          geometry={nodes.Object_6.geometry}
          material={materials["280z_Windows"]}
        />
        <mesh
          geometry={nodes.Object_7.geometry}
          material={materials["280z_Plastic"]}
        />
        <mesh
          geometry={nodes.Object_8.geometry}
          material={materials["280z_Lens"]}
        />
        <mesh
          geometry={nodes.Object_9.geometry}
          material={materials["280z_Chrome"]}
        />
        <mesh
          geometry={nodes.Object_10.geometry}
          material={materials["280z_Headlight_lamp"]}
        />
        <mesh
          geometry={nodes.Object_11.geometry}
          material={materials["280z_Turnsignal_lamp"]}
        />
        <mesh
          geometry={nodes.Object_12.geometry}
          material={materials["280z_Blackout"]}
        />
        <mesh
          geometry={nodes.Object_13.geometry}
          material={materials["280z_Brakes"]}
        />
        <mesh
          geometry={nodes.Object_14.geometry}
          material={materials.SSR_Rim}
        />
        <mesh
          geometry={nodes.Object_15.geometry}
          material={materials.SSR_Rim}
        />
        <mesh
          geometry={nodes.Object_16.geometry}
          material={materials.SSR_Rim}
        />
        <mesh
          geometry={nodes.Object_17.geometry}
          material={materials.SSR_Rim}
        />
        <mesh
          geometry={nodes.Object_18.geometry}
          material={materials.SSR_Tire}
        />
        <mesh
          geometry={nodes.Object_19.geometry}
          material={materials["280z_Textures"]}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/cars/car3/scene.gltf");
