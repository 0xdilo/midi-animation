import React from 'react'
import { useGLTF } from '@react-three/drei'

export default function Model(props) {
  const { nodes, materials } = useGLTF('/cars/car3/scene-transformed.glb')
  return (
    <group {...props} dispose={null} scale={1.7} >
      <mesh geometry={nodes.Object_5.geometry} material={materials.bottom} position={[0.01, 0.294, 0.053]} rotation={[-Math.PI, 0, 0]} />
      <mesh geometry={nodes.Object_7.geometry} material={materials.PaletteMaterial001} position={[-0.55, 0.533, 0.093]} scale={0.198} />
      <mesh geometry={nodes.Object_11.geometry} material={materials.wheel} position={[1.003, 0.449, 1.816]} />
      <mesh geometry={nodes.Object_25.geometry} material={materials.PaletteMaterial002} position={[-0.028, 1.247, 0.757]} rotation={[-Math.PI / 2, 0, 0.476]} />
      <mesh geometry={nodes.Object_37.geometry} material={materials.Licence_Plate} position={[0.02, 0.821, -2.649]} rotation={[-Math.PI / 2, 0, 0]} />
      <mesh geometry={nodes.Object_47.geometry} material={materials.Livery} position={[0.01, 0.974, 0.135]} />
      <mesh geometry={nodes.Object_49.geometry} material={materials.engine_bay} position={[0.01, 0.559, 1.977]} rotation={[-Math.PI, 0, 0]} />
      <mesh geometry={nodes.Object_51.geometry} material={materials.material} position={[0.01, 0.559, 1.977]} rotation={[-Math.PI, 0, 0]} />
      <mesh geometry={nodes.Object_53.geometry} material={materials.exhaust} position={[-0.392, 0.404, -2.582]} />
      <mesh geometry={nodes.Object_55.geometry} material={materials.front_spoiler} position={[0.008, 0.346, 2.658]} rotation={[-Math.PI, 0, 0]} />
      <mesh geometry={nodes.Object_57.geometry} material={materials.Brake_Disc} position={[0.998, 0.449, 1.822]} />
      <mesh geometry={nodes.Object_72.geometry} material={materials.Brake_Caliper} position={[0.999, 0.528, 1.674]} />
      <mesh geometry={nodes.Object_80.geometry} material={materials.Glass} position={[0.01, 1.367, -0.471]} />
      <mesh geometry={nodes.Object_82.geometry} material={materials.headlights} position={[0.01, 0.825, 2.717]} rotation={[-Math.PI, 0, 0]} />
      <mesh geometry={nodes.Object_84.geometry} material={materials.PaletteMaterial003} position={[0.01, 0.174, 1.122]} rotation={[-Math.PI, 0, 0]} />
      <mesh geometry={nodes.Object_98.geometry} material={materials.radiator} position={[-0.001, 0.53, 2.809]} rotation={[Math.PI / 2, 0, 0]} />
      <mesh geometry={nodes.Object_114.geometry} material={materials.Spoiler} position={[-0.001, 1.376, -2.501]} rotation={[-Math.PI, 0, 0]} />
      <mesh geometry={nodes.Object_128.geometry} material={materials.Tail_Lights} position={[0.01, 1.095, -2.455]} rotation={[-Math.PI, 0, 0]} />
    </ group>
  )
}

useGLTF.preload('/cars/car3/scene-transformed.glb')

