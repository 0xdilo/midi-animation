import React, { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export default function Model({
  scale = 0.0005,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  ...props
}) {
  const { nodes, materials } = useGLTF("/city/scene-transformed.glb");
  
  // Optimize materials for performance
  const optimizedMaterials = useMemo(() => {
    const matCache = {};
    Object.keys(materials).forEach(key => {
      const originalMat = materials[key];
      matCache[key] = new THREE.MeshLambertMaterial({
        color: originalMat.color || 0xffffff,
        map: originalMat.map,
        transparent: originalMat.transparent || false,
        opacity: originalMat.opacity || 1,
      });
    });
    return matCache;
  }, [materials]);
  return (
    <group
      {...props}
      scale={scale}
      position={position}
      rotation={rotation}
      dispose={null}
    >
      <mesh
        geometry={nodes.pCube2_Paramount_0.geometry}
        material={optimizedMaterials.Paramount}
        position={[-21800, 170, -8650]}
        frustumCulled={false}
      />
      <mesh
        geometry={nodes.polySurface3_Paramount1GLOW_0.geometry}
        material={optimizedMaterials.Paramount1GLOW}
        position={[-22322.879, 4.84, -8661.039]}
        scale={1.026}
        frustumCulled={false}
      />
      <mesh
        geometry={nodes.pCube11_FillerBuildings1_0.geometry}
        material={optimizedMaterials.FillerBuildings1}
        position={[-18050, 170, -8450]}
        scale={[0.663, 1, 0.674]}
      />
      <mesh
        geometry={nodes.polySurface20_FillerBuildings1GLOW_0.geometry}
        material={optimizedMaterials.FillerBuildings1GLOW}
        position={[-16505.207, 810.33, -8439.369]}
        scale={[2.701, 1.237, 0.728]}
      />
      <mesh
        geometry={nodes.polySurface260_CityProps_0.geometry}
        material={optimizedMaterials.CityProps}
        position={[-15050, 0, -6400]}
      />
      <mesh
        geometry={nodes.polySurface791_CityProps1GLOW_0.geometry}
        material={optimizedMaterials.CityProps1GLOW}
        position={[-15050, 0, -6400]}
      />
      <mesh
        geometry={nodes.polySurface739_RedGLOW_0.geometry}
        material={optimizedMaterials.RedGLOW}
        position={[-15050, 0, -6400]}
      />
      <mesh
        geometry={nodes.polySurface739_GreenGlow_0.geometry}
        material={optimizedMaterials.GreenGlow}
        position={[-15050, 0, -7900]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      <mesh
        geometry={nodes.polySurface839_WhiteGlow1_0.geometry}
        material={optimizedMaterials.WhiteGlow1}
        position={[-22656.896, 0, 7394.786]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      <mesh
        geometry={nodes.pasted__ALPHA_OPAQUE_INT_BTM_elise_0.geometry}
        material={optimizedMaterials.elise}
        position={[-12163.745, 120.334, -8245.036]}
        rotation={[0, 1.429, 0]}
        scale={139.53}
      />
      <mesh
        geometry={nodes.pasted__ALPHA_OPAQUE_RUBBER_WFR_Tire_0.geometry}
        material={optimizedMaterials.Tire}
        position={[-12163.745, 120.334, -8245.036]}
        rotation={[0, 1.429, 0]}
        scale={139.53}
      />
      <mesh
        geometry={nodes.LM_Basketball9_Basketball_0.geometry}
        material={optimizedMaterials.Basketball}
      />
      <mesh
        geometry={nodes.LM_Clinic2_Clinic_0.geometry}
        material={optimizedMaterials.Clinic}
      />
      <mesh
        geometry={nodes.BD_ConcreteBlock1_RoadsGround_0.geometry}
        material={optimizedMaterials.RoadsGround}
      />
      <mesh
        geometry={nodes
          .LMProjects2_pasted__group65_pasted__pCube39_LMProjects1GLOW_0
          .geometry}
        material={optimizedMaterials.LMProjects1GLOW}
      />
      <mesh
        geometry={nodes.LMProjects2_pasted__group65_pasted__pCube40_LMProjects_0
          .geometry}
        material={optimizedMaterials.LMProjects}
      />
      <mesh
        geometry={nodes.polySurface836_WhiteGlow_0.geometry}
        material={optimizedMaterials.WhiteGlow}
        position={[-34950.596, 2071.557, -7859.899]}
        rotation={[Math.PI, Math.PI / 2, 0]}
        scale={0.868}
      />
      <mesh
        geometry={nodes.pasted__pPlane94_Laundrymat_0.geometry}
        material={optimizedMaterials.Laundrymat}
        position={[-12750, 29.253, -9200]}
      />
      <mesh
        geometry={nodes.pasted__pCube1_FishFactory_0.geometry}
        material={optimizedMaterials.FishFactory}
        position={[-5250, 425, -9100]}
      />
      <mesh
        geometry={nodes.pasted__pCube27_FishFactory1GLOW_0.geometry}
        material={optimizedMaterials.FishFactory1GLOW}
        position={[-2375.839, 1106.124, -8212.11]}
        scale={[0.264, 0.649, 0.261]}
      />
      <mesh
        geometry={nodes.pasted__pCube80_Pawnshop_0.geometry}
        material={optimizedMaterials.Pawnshop}
        position={[-25100, 450, -9050]}
      />
      <mesh
        geometry={nodes.pasted__loftedSurface3_Pawnshop1GLOW_0.geometry}
        material={optimizedMaterials.Pawnshop1GLOW}
        position={[-25100, 0, -8950]}
      />
    </group>
  );
}

useGLTF.preload("/city/scene-transformed.glb");
