import React from "react";
import { useGLTF } from "@react-three/drei";

export default function Model(props) {
  const { nodes, materials } = useGLTF("/cars/car5/scene.gltf");
  return (
    <group {...props} dispose={null} scale={0.9}>
      <group
        position={[0, 1.903, 0]}
        rotation={[0, Math.PI / 2, 0]}
        scale={[6.629, 2.501, 2.96]}
      >
        <group position={[-0.41, 0.069, 0]} scale={[0.196, 0.52, 0.439]}>
          <mesh geometry={nodes.Object_5.geometry} material={materials.Body} />
          <mesh
            geometry={nodes.Object_6.geometry}
            material={materials.Carbon_Fiber}
          />
          <mesh
            geometry={nodes.Object_7.geometry}
            material={materials.Black_Plastic}
          />
          <mesh
            geometry={nodes.Object_8.geometry}
            material={materials.Window_Glass}
          />
          <mesh geometry={nodes.Object_9.geometry} material={materials.Gkass} />
          <mesh
            geometry={nodes.Object_10.geometry}
            material={materials.Black_Plastic_2}
          />
          <mesh
            geometry={nodes.Object_11.geometry}
            material={materials.Brakelamp}
          />
          <mesh
            geometry={nodes.Object_12.geometry}
            material={materials.Mirror}
          />
          <mesh
            geometry={nodes.Object_13.geometry}
            material={materials.Glass_2}
          />
          <mesh
            geometry={nodes.Object_14.geometry}
            material={materials.Chrome_Orange}
          />
          <mesh
            geometry={nodes.Object_15.geometry}
            material={materials.Chrome}
          />
          <mesh
            geometry={nodes.Object_16.geometry}
            material={materials.Exhaust}
          />
          <mesh geometry={nodes.Object_17.geometry} material={materials.Dark} />
        </group>
        <group position={[-0.726, -0.483, 0]} scale={[0.196, 0.52, 0.439]}>
          <mesh
            geometry={nodes.Object_19.geometry}
            material={materials.Silver_Metallic}
          />
          <mesh geometry={nodes.Object_20.geometry} material={materials.Dark} />
        </group>
        <group
          position={[-0.499, -0.426, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[0.196, 0.439, 0.52]}
        >
          <mesh geometry={nodes.Object_22.geometry} material={materials.Disk} />
          <mesh
            geometry={nodes.Object_23.geometry}
            material={materials.Disk_2}
          />
          <mesh
            geometry={nodes.Object_24.geometry}
            material={materials.Zinc_001_001}
          />
          <mesh
            geometry={nodes.Object_25.geometry}
            material={materials.Caliper}
          />
          <mesh
            geometry={nodes.Object_26.geometry}
            material={materials["screw-chrome"]}
          />
          <mesh
            geometry={nodes.Object_27.geometry}
            material={materials.Connector_blue}
          />
          <mesh
            geometry={nodes.Object_28.geometry}
            material={materials.Brass_pins}
          />
        </group>
        <group
          position={[0.472, -0.426, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[0.196, 0.439, 0.52]}
        >
          <mesh geometry={nodes.Object_30.geometry} material={materials.Disk} />
          <mesh
            geometry={nodes.Object_31.geometry}
            material={materials.Disk_2}
          />
          <mesh
            geometry={nodes.Object_32.geometry}
            material={materials.Zinc_001_001}
          />
          <mesh
            geometry={nodes.Object_33.geometry}
            material={materials.Caliper}
          />
          <mesh
            geometry={nodes.Object_34.geometry}
            material={materials["screw-chrome"]}
          />
          <mesh
            geometry={nodes.Object_35.geometry}
            material={materials.Connector_blue}
          />
          <mesh
            geometry={nodes.Object_36.geometry}
            material={materials.Brass_pins}
          />
        </group>
        <group
          position={[-0.5, -0.425, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[0.092, 0.206, 0.244]}
        >
          <mesh geometry={nodes.Object_38.geometry} material={materials.Rims} />
          <mesh
            geometry={nodes.Object_39.geometry}
            material={materials.Rims_2}
          />
          <mesh
            geometry={nodes.Object_40.geometry}
            material={materials["Material.001"]}
          />
        </group>
        <group
          position={[0.471, -0.425, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[0.092, 0.206, 0.244]}
        >
          <mesh geometry={nodes.Object_42.geometry} material={materials.Rims} />
          <mesh
            geometry={nodes.Object_43.geometry}
            material={materials.Rims_2}
          />
          <mesh
            geometry={nodes.Object_44.geometry}
            material={materials["Material.001"]}
          />
        </group>
        <group position={[0.709, 0.267, 0]} scale={[0.196, 0.52, 0.439]}>
          <mesh
            geometry={nodes.Object_50.geometry}
            material={materials.Carbon_Fiber_Wing}
          />
          <mesh
            geometry={nodes.Object_51.geometry}
            material={materials.Screw_dark_001_001}
          />
        </group>
        <mesh
          geometry={nodes.Object_46.geometry}
          material={materials.Tyres}
          position={[-0.5, -0.425, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[0.092, 0.206, 0.244]}
        />
        <mesh
          geometry={nodes.Object_48.geometry}
          material={materials.Tyres}
          position={[0.471, -0.425, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[0.092, 0.206, 0.244]}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/cars/car5/scene.gltf");
