import React, { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export default function Model(props) {
  const { nodes, materials } = useGLTF('/cars/car3/scene-transformed.glb')
  
  const optimizedMaterials = useMemo(() => ({
    bottom: new THREE.MeshLambertMaterial({ 
      color: materials.bottom?.color || 0xffffff 
    }),
    PaletteMaterial001: new THREE.MeshLambertMaterial({ 
      color: materials.PaletteMaterial001?.color || 0xffffff 
    }),
    wheel: new THREE.MeshLambertMaterial({ 
      color: materials.wheel?.color || 0xffffff 
    }),
    PaletteMaterial002: new THREE.MeshLambertMaterial({ 
      color: materials.PaletteMaterial002?.color || 0xffffff 
    }),
    Licence_Plate: new THREE.MeshLambertMaterial({ 
      color: materials.Licence_Plate?.color || 0xffffff 
    }),
    Livery: new THREE.MeshLambertMaterial({ 
      color: materials.Livery?.color || 0xffffff 
    }),
    engine_bay: new THREE.MeshLambertMaterial({ 
      color: materials.engine_bay?.color || 0xffffff 
    }),
    material: new THREE.MeshLambertMaterial({ 
      color: materials.material?.color || 0xffffff 
    }),
    exhaust: new THREE.MeshLambertMaterial({ 
      color: materials.exhaust?.color || 0xffffff 
    }),
    front_spoiler: new THREE.MeshLambertMaterial({ 
      color: materials.front_spoiler?.color || 0xffffff 
    }),
    Brake_Disc: new THREE.MeshLambertMaterial({ 
      color: materials.Brake_Disc?.color || 0xffffff 
    }),
    Brake_Caliper: new THREE.MeshLambertMaterial({ 
      color: materials.Brake_Caliper?.color || 0xffffff 
    }),
    Glass: new THREE.MeshLambertMaterial({ 
      color: materials.Glass?.color || 0xffffff 
    }),
    headlights: new THREE.MeshLambertMaterial({ 
      color: materials.headlights?.color || 0xffffff 
    }),
    PaletteMaterial003: new THREE.MeshLambertMaterial({ 
      color: materials.PaletteMaterial003?.color || 0xffffff 
    }),
    radiator: new THREE.MeshLambertMaterial({ 
      color: materials.radiator?.color || 0xffffff 
    }),
    Spoiler: new THREE.MeshLambertMaterial({ 
      color: materials.Spoiler?.color || 0xffffff 
    }),
    Tail_Lights: new THREE.MeshLambertMaterial({ 
      color: materials.Tail_Lights?.color || 0xffffff 
    })
  }), [materials])
  
  return (
    <group {...props} dispose={null} scale={1.7} >
      <mesh 
        geometry={nodes.Object_5.geometry} 
        material={optimizedMaterials.bottom} 
        position={[0.01, 0.294, 0.053]} 
        rotation={[-Math.PI, 0, 0]} 
        frustumCulled={false}
      />
      <mesh 
        geometry={nodes.Object_7.geometry} 
        material={optimizedMaterials.PaletteMaterial001} 
        position={[-0.55, 0.533, 0.093]} 
        scale={0.198} 
        frustumCulled={false}
      />
      <mesh 
        geometry={nodes.Object_11.geometry} 
        material={optimizedMaterials.wheel} 
        position={[1.003, 0.449, 1.816]} 
        frustumCulled={false}
      />
      <mesh 
        geometry={nodes.Object_25.geometry} 
        material={optimizedMaterials.PaletteMaterial002} 
        position={[-0.028, 1.247, 0.757]} 
        rotation={[-Math.PI / 2, 0, 0.476]} 
        frustumCulled={false}
      />
      <mesh 
        geometry={nodes.Object_37.geometry} 
        material={optimizedMaterials.Licence_Plate} 
        position={[0.02, 0.821, -2.649]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        frustumCulled={false}
      />
      <mesh 
        geometry={nodes.Object_47.geometry} 
        material={optimizedMaterials.Livery} 
        position={[0.01, 0.974, 0.135]} 
        frustumCulled={false}
      />
      <mesh 
        geometry={nodes.Object_49.geometry} 
        material={optimizedMaterials.engine_bay} 
        position={[0.01, 0.559, 1.977]} 
        rotation={[-Math.PI, 0, 0]} 
        frustumCulled={false}
      />
      <mesh 
        geometry={nodes.Object_51.geometry} 
        material={optimizedMaterials.material} 
        position={[0.01, 0.559, 1.977]} 
        rotation={[-Math.PI, 0, 0]} 
        frustumCulled={false}
      />
      <mesh 
        geometry={nodes.Object_53.geometry} 
        material={optimizedMaterials.exhaust} 
        position={[-0.392, 0.404, -2.582]} 
        frustumCulled={false}
      />
      <mesh 
        geometry={nodes.Object_55.geometry} 
        material={optimizedMaterials.front_spoiler} 
        position={[0.008, 0.346, 2.658]} 
        rotation={[-Math.PI, 0, 0]} 
        frustumCulled={false}
      />
      <mesh 
        geometry={nodes.Object_57.geometry} 
        material={optimizedMaterials.Brake_Disc} 
        position={[0.998, 0.449, 1.822]} 
        frustumCulled={false}
      />
      <mesh 
        geometry={nodes.Object_72.geometry} 
        material={optimizedMaterials.Brake_Caliper} 
        position={[0.999, 0.528, 1.674]} 
        frustumCulled={false}
      />
      <mesh 
        geometry={nodes.Object_80.geometry} 
        material={optimizedMaterials.Glass} 
        position={[0.01, 1.367, -0.471]} 
        frustumCulled={false}
      />
      <mesh 
        geometry={nodes.Object_82.geometry} 
        material={optimizedMaterials.headlights} 
        position={[0.01, 0.825, 2.717]} 
        rotation={[-Math.PI, 0, 0]} 
        frustumCulled={false}
      />
      <mesh 
        geometry={nodes.Object_84.geometry} 
        material={optimizedMaterials.PaletteMaterial003} 
        position={[0.01, 0.174, 1.122]} 
        rotation={[-Math.PI, 0, 0]} 
        frustumCulled={false}
      />
      <mesh 
        geometry={nodes.Object_98.geometry} 
        material={optimizedMaterials.radiator} 
        position={[-0.001, 0.53, 2.809]} 
        rotation={[Math.PI / 2, 0, 0]} 
        frustumCulled={false}
      />
      <mesh 
        geometry={nodes.Object_114.geometry} 
        material={optimizedMaterials.Spoiler} 
        position={[-0.001, 1.376, -2.501]} 
        rotation={[-Math.PI, 0, 0]} 
        frustumCulled={false}
      />
      <mesh 
        geometry={nodes.Object_128.geometry} 
        material={optimizedMaterials.Tail_Lights} 
        position={[0.01, 1.095, -2.455]} 
        rotation={[-Math.PI, 0, 0]} 
        frustumCulled={false}
      />
    </group>
  )
}

useGLTF.preload('/cars/car3/scene-transformed.glb')

