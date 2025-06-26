import React, { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export default function Model(props) {
  const { nodes, materials } = useGLTF('/cars/car2/scene-transformed.glb')
  
  const optimizedMaterials = useMemo(() => ({
    logo_tex: new THREE.MeshLambertMaterial({ 
      color: materials.logo_tex?.color || 0xffffff 
    }),
    paint: new THREE.MeshLambertMaterial({ 
      color: materials.paint?.color || 0xffffff 
    }),
    PaletteMaterial001: new THREE.MeshLambertMaterial({ 
      color: materials.PaletteMaterial001?.color || 0xffffff 
    }),
    PaletteMaterial002: new THREE.MeshLambertMaterial({ 
      color: materials.PaletteMaterial002?.color || 0xffffff 
    }),
    number: new THREE.MeshLambertMaterial({ 
      color: materials.number?.color || 0xffffff 
    }),
    wheel_metal: new THREE.MeshLambertMaterial({ 
      color: materials.wheel_metal?.color || 0xffffff 
    })
  }), [materials])
  
  return (
    <group {...props} dispose={null} scale={3.5}>
      <mesh 
        geometry={nodes.logos_Cube001_logo_tex_0.geometry} 
        material={optimizedMaterials.logo_tex} 
        position={[-0.109, 0.395, -0.748]} 
        frustumCulled={false}
      />
      <mesh 
        geometry={nodes.logos_Cube001_paint_0.geometry} 
        material={optimizedMaterials.paint} 
        position={[-0.109, 0.395, -0.748]} 
        frustumCulled={false}
      />
      <mesh 
        geometry={nodes.logos_Cube001_black_0.geometry} 
        material={optimizedMaterials.PaletteMaterial001} 
        position={[-0.109, 0.395, -0.748]} 
        frustumCulled={false}
      />
      <mesh 
        geometry={nodes.logos_Cube001_glass_0.geometry} 
        material={optimizedMaterials.PaletteMaterial002} 
        position={[-0.109, 0.395, -0.748]} 
        frustumCulled={false}
      />
      <mesh 
        geometry={nodes.logos_Cube001_number_0.geometry} 
        material={optimizedMaterials.number} 
        position={[-0.109, 0.395, -0.748]} 
        frustumCulled={false}
      />
      <mesh 
        geometry={nodes.logos_Cube001_wheel_metal_0.geometry} 
        material={optimizedMaterials.wheel_metal} 
        position={[-0.109, 0.395, -0.748]} 
        frustumCulled={false}
      />
    </group>
  )
}

useGLTF.preload('/cars/car2/scene-transformed.glb')

