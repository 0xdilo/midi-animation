import React, { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export default function Model(props) {
  const { nodes, materials } = useGLTF("/cars/car4/scene-compressed.glb");

  const optimizedMaterials = useMemo(
    () => ({
      Car_paint: new THREE.MeshLambertMaterial({
        color: materials.Car_paint?.color || 0xaa44aa,
      }),
      PaletteMaterial001: new THREE.MeshLambertMaterial({
        color: materials.PaletteMaterial001?.color || 0x222222,
      }),
      Glass: new THREE.MeshLambertMaterial({
        color: materials.Glass?.color || 0x88ccff,
      }),
      PaletteMaterial002: new THREE.MeshLambertMaterial({
        color: materials.PaletteMaterial002?.color || 0xffffcc,
      }),
      PaletteMaterial003: new THREE.MeshLambertMaterial({
        color: materials.PaletteMaterial003?.color || 0xffaa44,
      }),
      PaletteMaterial004: new THREE.MeshLambertMaterial({
        color: materials.PaletteMaterial004?.color || 0xff3333,
      }),
      Turbofan: new THREE.MeshLambertMaterial({
        color: materials.Turbofan?.color || 0x666666,
      }),
      TurbofanTexture_F: new THREE.MeshLambertMaterial({
        color: materials.TurbofanTexture_F?.color || 0x555555,
      }),
      Radiator: new THREE.MeshLambertMaterial({
        color: materials.Radiator?.color || 0x444444,
      }),
      Fender_front: new THREE.MeshLambertMaterial({
        color: materials.Fender_front?.color || 0x333333,
      }),
      fender_rear: new THREE.MeshLambertMaterial({
        color: materials.fender_rear?.color || 0x333333,
      }),
      TurbofanTexture_R: new THREE.MeshLambertMaterial({
        color: materials.TurbofanTexture_R?.color || 0x555555,
      }),
      Tyre: new THREE.MeshLambertMaterial({
        color: materials.Tyre?.color || 0x222222,
      }),
      Shadow: new THREE.MeshLambertMaterial({
        color: materials.Shadow?.color || 0x111111,
      }),
    }),
    [materials],
  );

  return (
    <group {...props} dispose={null} scale={0.015}>
      <mesh
        geometry={nodes.Body_Car_paint_0.geometry}
        material={optimizedMaterials.Car_paint}
        rotation={[-Math.PI / 2, Math.PI / 2, 0]}
        scale={52.949}
        frustumCulled={false}
      />
      <mesh
        geometry={nodes.Body_Rubber_0.geometry}
        material={optimizedMaterials.PaletteMaterial001}
        rotation={[-Math.PI / 2, Math.PI / 2, 0]}
        scale={52.949}
        frustumCulled={false}
      />
      <mesh
        geometry={nodes.Body_Glass_0.geometry}
        material={optimizedMaterials.Glass}
        rotation={[-Math.PI / 2, Math.PI / 2, 0]}
        scale={52.949}
        frustumCulled={false}
      />
      <mesh
        geometry={nodes.Body_Headlgt_Glass_0.geometry}
        material={optimizedMaterials.PaletteMaterial002}
        rotation={[-Math.PI / 2, Math.PI / 2, 0]}
        scale={52.949}
        frustumCulled={false}
      />
      <mesh
        geometry={nodes.Indicator_Front_indicators_front_0.geometry}
        material={optimizedMaterials.PaletteMaterial003}
        position={[0, 0, 166.651]}
        rotation={[-Math.PI / 2, Math.PI / 2, 0]}
        scale={52.949}
        frustumCulled={false}
      />
      <mesh
        geometry={nodes.taillights_redLgt_0.geometry}
        material={optimizedMaterials.PaletteMaterial004}
        position={[98.01, 58.664, -249.742]}
        scale={6.971}
        frustumCulled={false}
      />
      <mesh
        geometry={nodes.frontWheels_Wheel_Stock_0.geometry}
        material={optimizedMaterials.PaletteMaterial001}
        position={[117.638, 19.895, 167.954]}
        rotation={[-Math.PI / 2, Math.PI / 2, 0]}
        scale={[31.022, 31.022, 41.546]}
        frustumCulled={false}
      />
      <mesh
        geometry={nodes.frontTurbofan_Turbofan_0.geometry}
        material={optimizedMaterials.Turbofan}
        position={[119.462, 19.897, 167.954]}
        rotation={[-Math.PI / 2, Math.PI / 2, 0]}
        scale={[28.635, 28.635, 38.349]}
        frustumCulled={false}
      />
      <mesh
        geometry={nodes.frontTurbofan_TurbofanTexture_F_0.geometry}
        material={optimizedMaterials.TurbofanTexture_F}
        position={[119.462, 19.897, 167.954]}
        rotation={[-Math.PI / 2, Math.PI / 2, 0]}
        scale={[28.635, 28.635, 38.349]}
        frustumCulled={false}
      />

      <mesh
        geometry={nodes.Radiator_Radiator_0.geometry}
        material={optimizedMaterials.Radiator}
        position={[29.034, 20.307, 256.589]}
        rotation={[-1.403, 0, 0]}
        scale={[18.445, 3.908, 16.165]}
        frustumCulled={false}
      />
      <mesh
        geometry={nodes.FrontFenders_Fender_front_0.geometry}
        material={optimizedMaterials.Fender_front}
        position={[97.881, 65.655, 235.074]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={100}
        frustumCulled={false}
      />
      <mesh
        geometry={nodes.RearFenders_fender_rear_0.geometry}
        material={optimizedMaterials.fender_rear}
        position={[0, 0, 166.651]}
        rotation={[-Math.PI / 2, Math.PI / 2, 0]}
        scale={52.949}
        frustumCulled={false}
      />
      <mesh
        geometry={nodes.rearTurbofan_TurbofanTexture_R_0.geometry}
        material={optimizedMaterials.TurbofanTexture_R}
        position={[121.157, 22.021, -194.1]}
        rotation={[-Math.PI / 2, Math.PI / 2, 0]}
        scale={[29.984, 29.984, 40.156]}
        frustumCulled={false}
      />
      <mesh
        geometry={nodes.Tyre_r_Tyre_0.geometry}
        material={optimizedMaterials.Tyre}
        position={[89.897, 22.019, -194.1]}
        rotation={[Math.PI / 6, 0, 0]}
        scale={[28.08, 44.656, 51.608]}
        frustumCulled={false}
      />

      <mesh
        geometry={nodes.Plane_Shadow_0.geometry}
        material={optimizedMaterials.Shadow}
        position={[-6.891, 0, -13.671]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[155.479, 317.274, 155.479]}
        frustumCulled={false}
      />
    </group>
  );
}

useGLTF.preload("/cars/car4/scene-compressed.glb");
