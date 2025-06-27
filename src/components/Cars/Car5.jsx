import React, { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export default function Model(props) {
  const { nodes, materials } = useGLTF('/car5/scene.gltf')
  
  const optimizedMaterials = useMemo(() => ({
    Body: new THREE.MeshLambertMaterial({ 
      color: materials.Body?.color || 0x4444ff 
    }),
    EXT_PLAS: new THREE.MeshLambertMaterial({ 
      color: materials.EXT_PLAS?.color || 0x333333 
    }),
    TIRE: new THREE.MeshLambertMaterial({ 
      color: materials.TIRE?.color || 0x222222 
    }),
    material: new THREE.MeshLambertMaterial({ 
      color: materials.material?.color || 0x888888 
    }),
    EXT_GLASS: new THREE.MeshLambertMaterial({ 
      color: materials.EXT_GLASS?.color || 0x66aaff 
    }),
    chrome: new THREE.MeshLambertMaterial({ 
      color: materials.chrome?.color || 0xaaaaaa 
    }),
    BOLTS_RIM: new THREE.MeshLambertMaterial({ 
      color: materials.BOLTS_RIM?.color || 0x555555 
    })
  }), [materials])
  
  return (
    <group {...props} dispose={null} scale={0.008}>
      <mesh 
        geometry={nodes.ChassisPaint001_Body_0?.geometry} 
        material={optimizedMaterials.Body} 
        frustumCulled={false}
      />
      <mesh 
        geometry={nodes.ChassisColoured001_EXT_PLAS_0?.geometry} 
        material={optimizedMaterials.EXT_PLAS} 
        frustumCulled={false}
      />
      <mesh 
        geometry={nodes.Wheel2A_LF_TIRE_0?.geometry} 
        material={optimizedMaterials.TIRE} 
        frustumCulled={false}
      />
      <mesh 
        geometry={nodes.Wheel2A_LF001_RIM_0?.geometry} 
        material={optimizedMaterials.material} 
        frustumCulled={false}
      />
    </group>
  )
}

useGLTF.preload('/car5/scene.gltf')