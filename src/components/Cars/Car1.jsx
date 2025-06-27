import React, { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { GeometryOptimizer } from '../../utils/GeometryOptimizer'

export default function Model(props) {
  const { nodes, materials } = useGLTF('/cars/car1/car1-transformed.glb')
  
  const [optimizedGeometries, optimizedMaterials] = useMemo(() => {
    const geometries = {
      Object_2: GeometryOptimizer.optimizeGeometry(nodes.Object_2?.geometry),
      Object_3: GeometryOptimizer.optimizeGeometry(nodes.Object_3?.geometry),
      Object_5: GeometryOptimizer.optimizeGeometry(nodes.Object_5?.geometry)
    };
    
    const mats = {
      PaletteMaterial001: new THREE.MeshLambertMaterial({ 
        color: materials.PaletteMaterial001?.color || 0x4444ff 
      }),
      PaletteMaterial002: new THREE.MeshLambertMaterial({ 
        color: materials.PaletteMaterial002?.color || 0x333333 
      }),
      material: new THREE.MeshLambertMaterial({ 
        color: materials.material?.color || 0x666666 
      })
    };
    
    return [geometries, mats];
  }, [nodes, materials])
  
  return (
    <group {...props} dispose={null} scale={0.02}>
      <mesh 
        geometry={optimizedGeometries.Object_2} 
        material={optimizedMaterials.PaletteMaterial001} 
        rotation={[-Math.PI, 0, 0]} 
        frustumCulled={true}
      />
      <mesh 
        geometry={optimizedGeometries.Object_3} 
        material={optimizedMaterials.PaletteMaterial002} 
        rotation={[-Math.PI, 0, 0]} 
        frustumCulled={true}
      />
      <mesh 
        geometry={optimizedGeometries.Object_5} 
        material={optimizedMaterials.material} 
        rotation={[-Math.PI, 0, 0]} 
        frustumCulled={true}
      />
    </group>
  )
}

useGLTF.preload('/cars/car1/car1-transformed.glb')

