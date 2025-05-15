import React from 'react'
import { useGLTF } from '@react-three/drei'

export default function Model(props) {
  const { nodes, materials } = useGLTF('/cars/car2/scene-transformed.glb')
  return (
    <group {...props} dispose={null} scale={3.5}>
      <mesh geometry={nodes.logos_Cube001_logo_tex_0.geometry} material={materials.logo_tex} position={[-0.109, 0.395, -0.748]} />
      <mesh geometry={nodes.logos_Cube001_paint_0.geometry} material={materials.paint} position={[-0.109, 0.395, -0.748]} />
      <mesh geometry={nodes.logos_Cube001_black_0.geometry} material={materials.PaletteMaterial001} position={[-0.109, 0.395, -0.748]} />
      <mesh geometry={nodes.logos_Cube001_glass_0.geometry} material={materials.PaletteMaterial002} position={[-0.109, 0.395, -0.748]} />
      <mesh geometry={nodes.logos_Cube001_number_0.geometry} material={materials.number} position={[-0.109, 0.395, -0.748]} />
      <mesh geometry={nodes.logos_Cube001_wheel_metal_0.geometry} material={materials.wheel_metal} position={[-0.109, 0.395, -0.748]} />
    </group>
  )
}

useGLTF.preload('/cars/car2/scene-transformed.glb')

