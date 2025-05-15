import React from 'react'
import { useGLTF } from '@react-three/drei'

export default function Model(props) {
  const { nodes, materials } = useGLTF('/cars/car1/car1-transformed.glb')
  return (
    <group {...props} dispose={null} scale={0.02}>
      <mesh geometry={nodes.Object_2.geometry} material={materials.PaletteMaterial001} rotation={[-Math.PI, 0, 0]} />
      <mesh geometry={nodes.Object_3.geometry} material={materials.PaletteMaterial002} rotation={[-Math.PI, 0, 0]} />
      <mesh geometry={nodes.Object_5.geometry} material={materials.material} rotation={[-Math.PI, 0, 0]} />
    </group>
  )
}

useGLTF.preload('/cars/car1/car1-transformed.glb')

