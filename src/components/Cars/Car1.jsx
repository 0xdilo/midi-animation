import React, { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export default function Model(props) {
  const { nodes, materials } = useGLTF('/cars/car1/car1-transformed.glb')
  
  const optimizedMaterials = useMemo(() => ({
    PaletteMaterial001: new THREE.MeshLambertMaterial({ 
      color: materials.PaletteMaterial001?.color || 0x4444ff 
    }),
    PaletteMaterial002: new THREE.MeshLambertMaterial({ 
      color: materials.PaletteMaterial002?.color || 0x333333 
    }),
    material: new THREE.MeshLambertMaterial({ 
      color: materials.material?.color || 0x666666 
    })
  }), [materials])
  
  return (
    <group {...props} dispose={null} scale={0.02}>
      <mesh 
        geometry={nodes.Object_2.geometry} 
        material={optimizedMaterials.PaletteMaterial001} 
        rotation={[-Math.PI, 0, 0]} 
        frustumCulled={false}
      />
      <mesh 
        geometry={nodes.Object_3.geometry} 
        material={optimizedMaterials.PaletteMaterial002} 
        rotation={[-Math.PI, 0, 0]} 
        frustumCulled={false}
      />
      <mesh 
        geometry={nodes.Object_5.geometry} 
        material={optimizedMaterials.material} 
        rotation={[-Math.PI, 0, 0]} 
        frustumCulled={false}
      />
    </group>
  )
}

useGLTF.preload('/cars/car1/car1-transformed.glb')

