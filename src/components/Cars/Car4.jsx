import React from 'react'
import { useGLTF } from '@react-three/drei'

export default function Model(props) {
  const { nodes, materials } = useGLTF('/cars/car4/scene-transformed.glb')
  return (
    <group {...props} dispose={null} scale={0.015}>
      <mesh geometry={nodes.Body_Car_paint_0.geometry} material={materials.Car_paint} rotation={[-Math.PI / 2, Math.PI / 2, 0]} scale={52.949} />
      <mesh geometry={nodes.Body_Rubber_0.geometry} material={materials.PaletteMaterial001} rotation={[-Math.PI / 2, Math.PI / 2, 0]} scale={52.949} />
      <mesh geometry={nodes.Body_Glass_0.geometry} material={materials.Glass} rotation={[-Math.PI / 2, Math.PI / 2, 0]} scale={52.949} />
      <mesh geometry={nodes.Body_Headlgt_Glass_0.geometry} material={materials.PaletteMaterial002} rotation={[-Math.PI / 2, Math.PI / 2, 0]} scale={52.949} />
      <mesh geometry={nodes.Indicator_Front_indicators_front_0.geometry} material={materials.PaletteMaterial003} position={[0, 0, 166.651]} rotation={[-Math.PI / 2, Math.PI / 2, 0]} scale={52.949} />
      <mesh geometry={nodes.taillights_redLgt_0.geometry} material={materials.PaletteMaterial004} position={[98.01, 58.664, -249.742]} scale={6.971} />
      <mesh geometry={nodes.frontWheels_Wheel_Stock_0.geometry} material={materials.PaletteMaterial001} position={[117.638, 19.895, 167.954]} rotation={[-Math.PI / 2, Math.PI / 2, 0]} scale={[31.022, 31.022, 41.546]} />
      <mesh geometry={nodes.frontTurbofan_Turbofan_0.geometry} material={materials.Turbofan} position={[119.462, 19.897, 167.954]} rotation={[-Math.PI / 2, Math.PI / 2, 0]} scale={[28.635, 28.635, 38.349]} />
      <mesh geometry={nodes.frontTurbofan_TurbofanTexture_F_0.geometry} material={materials.TurbofanTexture_F} position={[119.462, 19.897, 167.954]} rotation={[-Math.PI / 2, Math.PI / 2, 0]} scale={[28.635, 28.635, 38.349]} />

      <mesh geometry={nodes.Radiator_Radiator_0.geometry} material={materials.Radiator} position={[29.034, 20.307, 256.589]} rotation={[-1.403, 0, 0]} scale={[18.445, 3.908, 16.165]} />
      <mesh geometry={nodes.FrontFenders_Fender_front_0.geometry} material={materials.Fender_front} position={[97.881, 65.655, 235.074]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
      <mesh geometry={nodes.RearFenders_fender_rear_0.geometry} material={materials.fender_rear} position={[0, 0, 166.651]} rotation={[-Math.PI / 2, Math.PI / 2, 0]} scale={52.949} />
      <mesh geometry={nodes.rearTurbofan_TurbofanTexture_R_0.geometry} material={materials.TurbofanTexture_R} position={[121.157, 22.021, -194.1]} rotation={[-Math.PI / 2, Math.PI / 2, 0]} scale={[29.984, 29.984, 40.156]} />
      <mesh geometry={nodes.Tyre_r_Tyre_0.geometry} material={materials.Tyre} position={[89.897, 22.019, -194.1]} rotation={[Math.PI / 6, 0, 0]} scale={[28.08, 44.656, 51.608]} />

      <mesh geometry={nodes.Plane_Shadow_0.geometry} material={materials.Shadow} position={[-6.891, 0, -13.671]} rotation={[-Math.PI / 2, 0, 0]} scale={[155.479, 317.274, 155.479]} />
    </group>
  )
}

useGLTF.preload('/cars/car4/scene-transformed.glb')

