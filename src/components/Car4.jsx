import React, { useRef, useCallback } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

export default function Model(props) {
  const { nodes, materials } = useGLTF("/car4/scene.gltf");

  // Create refs for wheel groups
  const wheelRefs = {
    frontRight: useRef(),
    frontLeft: useRef(),
    backRight: useRef(),
    backLeft: useRef(),
  };

  const updateWheels = useCallback((delta) => {
    Object.values(wheelRefs).forEach((ref) => {
      if (ref.current) {
        ref.current.rotation.x += delta * 8;
      }
    });
  }, []);

  useFrame((state, delta) => {
    updateWheels(delta);
  });
  return (
    <group {...props} dispose={null}>
      <group position={[0.006, 0.666, -0.441]} scale={3.795}>
        <group position={[0.001, 0.027, 0.778]} scale={0.358}>
          <mesh
            geometry={nodes.Object_69.geometry}
            material={materials.Livery}
          />
          <mesh
            geometry={nodes.Object_70.geometry}
            material={materials.engine_bay}
          />
        </group>
        <group position={[0.001, 0.134, -0.118]} scale={0.358}>
          <mesh
            geometry={nodes.Object_88.geometry}
            material={materials.Livery}
          />
          <mesh
            geometry={nodes.Object_89.geometry}
            material={materials.interior1}
          />
        </group>
        <group position={[0.001, 0.191, 0.411]} scale={0.358}>
          <mesh
            geometry={nodes.Object_95.geometry}
            material={materials.Livery}
          />
          <mesh
            geometry={nodes.Object_96.geometry}
            material={materials.Mirror}
          />
        </group>
        <group position={[0.001, 0.25, -0.454]} scale={0.358}>
          <mesh
            geometry={nodes.Object_130.geometry}
            material={materials.Livery}
          />
          <mesh
            geometry={nodes.Object_131.geometry}
            material={materials.interior1}
          />
        </group>
        <mesh
          geometry={nodes.Object_5.geometry}
          material={materials.bottom}
          position={[0.001, -0.133, 0.177]}
          rotation={[-Math.PI, 0, 0]}
          scale={0.358}
        />
        <mesh
          geometry={nodes.Object_7.geometry}
          material={materials.interior_black}
          position={[-0.199, -0.048, 0.191]}
          scale={0.071}
        />
        <mesh
          geometry={nodes.Object_9.geometry}
          material={materials.interior_black}
          position={[0.233, -0.048, 0.191]}
          scale={0.071}
        />
        <group
          ref={wheelRefs.frontRight}
          position={[0.357, -0.078, 0.808]}
          scale={0.358}
        >
          <mesh
            geometry={nodes.Object_11.geometry}
            material={materials.wheel}
          />
        </group>
        <mesh
          geometry={nodes.Object_13.geometry}
          material={materials.Shock_Absorber}
          position={[0.294, -0.077, -0.353]}
          scale={0.358}
        />
        <mesh
          geometry={nodes.Object_15.geometry}
          material={materials.Shock_Absorber}
          position={[-0.291, -0.077, 0.809]}
          scale={0.358}
        />
        <group
          ref={wheelRefs.frontLeft}
          position={[-0.354, -0.078, 0.808]}
          scale={0.358}
        >
          <mesh
            geometry={nodes.Object_17.geometry}
            material={materials.wheel}
          />
        </group>
        <group
          ref={wheelRefs.backRight}
          position={[0.347, -0.077, -0.354]}
          scale={0.358}
        >
          <mesh
            geometry={nodes.Object_19.geometry}
            material={materials.wheel}
          />
        </group>
        <mesh
          geometry={nodes.Object_21.geometry}
          material={materials.Shock_Absorber}
          position={[-0.291, -0.077, -0.353]}
          scale={0.358}
        />
        <group
          ref={wheelRefs.backLeft}
          position={[-0.344, -0.077, -0.354]}
          scale={0.358}
        >
          <mesh
            geometry={nodes.Object_23.geometry}
            material={materials.wheel}
          />
        </group>
        <mesh
          geometry={nodes.Object_25.geometry}
          material={materials.gauges}
          position={[-0.012, 0.208, 0.429]}
          rotation={[-Math.PI / 2, 0, 0.476]}
          scale={0.358}
        />
        <mesh
          geometry={nodes.Object_27.geometry}
          material={materials.gauges}
          position={[0.019, 0.198, 0.415]}
          rotation={[-Math.PI / 2, 0, 0.633]}
          scale={0.358}
        />
        <mesh
          geometry={nodes.Object_29.geometry}
          material={materials.gauges}
          position={[0.041, 0.186, 0.392]}
          rotation={[-Math.PI / 2, 0, 0.769]}
          scale={0.358}
        />
        <mesh
          geometry={nodes.Object_31.geometry}
          material={materials.gauges}
          position={[0.057, 0.164, 0.368]}
          rotation={[-Math.PI / 2, 0, 0.748]}
          scale={0.358}
        />
        <mesh
          geometry={nodes.Object_33.geometry}
          material={materials.Shock_Absorber}
          position={[0.294, -0.077, 0.809]}
          scale={0.358}
        />
        <mesh
          geometry={nodes.Object_35.geometry}
          material={materials.material_0}
          position={[0.001, -0.154, 1.204]}
          rotation={[-Math.PI, 0, 0]}
          scale={0.358}
        />
        <mesh
          geometry={nodes.Object_37.geometry}
          material={materials.Licence_Plate}
          position={[0.005, 0.056, -0.79]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={0.358}
        />
        <mesh
          geometry={nodes.Object_39.geometry}
          material={materials.screw}
          position={[-0.077, 0.335, -0.694]}
          rotation={[2.643, 0, -Math.PI / 2]}
          scale={0.379}
        />
        <mesh
          geometry={nodes.Object_41.geometry}
          material={materials.screw}
          position={[-0.077, 0.342, -0.738]}
          rotation={[2.643, 0, -Math.PI / 2]}
          scale={0.379}
        />
        <mesh
          geometry={nodes.Object_43.geometry}
          material={materials.screw}
          position={[0.072, 0.335, -0.694]}
          rotation={[0.498, 0, Math.PI / 2]}
          scale={0.379}
        />
        <mesh
          geometry={nodes.Object_45.geometry}
          material={materials.screw}
          position={[0.072, 0.342, -0.738]}
          rotation={[0.498, 0, Math.PI / 2]}
          scale={0.379}
        />
        <mesh
          geometry={nodes.Object_47.geometry}
          material={materials.Livery}
          position={[0.001, 0.11, 0.206]}
          scale={0.358}
        />
        <mesh
          geometry={nodes.Object_49.geometry}
          material={materials.engine_bay}
          position={[0.001, -0.038, 0.865]}
          rotation={[-Math.PI, 0, 0]}
          scale={0.358}
        />
        <mesh
          geometry={nodes.Object_51.geometry}
          material={materials.material}
          position={[0.001, -0.038, 0.865]}
          rotation={[-Math.PI, 0, 0]}
          scale={0.358}
        />
        <mesh
          geometry={nodes.Object_53.geometry}
          material={materials.exhaust}
          position={[-0.143, -0.094, -0.766]}
          scale={0.358}
        />
        <mesh
          geometry={nodes.Object_55.geometry}
          material={materials.front_spoiler}
          position={[0.001, -0.115, 1.109]}
          rotation={[-Math.PI, 0, 0]}
          scale={0.358}
        />
        <mesh
          geometry={nodes.Object_57.geometry}
          material={materials.Brake_Disc}
          position={[0.355, -0.078, 0.81]}
          scale={0.358}
        />
        <mesh
          geometry={nodes.Object_59.geometry}
          material={materials.Brake_Disc}
          position={[0.35, -0.078, -0.351]}
          scale={0.358}
        />
        <mesh
          geometry={nodes.Object_61.geometry}
          material={materials.Brake_Disc}
          position={[-0.353, -0.078, 0.81]}
          scale={0.358}
        />
        <mesh
          geometry={nodes.Object_63.geometry}
          material={materials.Brake_Disc}
          position={[-0.348, -0.078, -0.351]}
          scale={0.358}
        />
        <mesh
          geometry={nodes.Object_65.geometry}
          material={materials.Livery}
          position={[0.001, -0.047, 1.095]}
          scale={0.358}
        />
        <mesh
          geometry={nodes.Object_67.geometry}
          material={materials.Livery}
          position={[0.001, -0.048, 1.095]}
          scale={0.358}
        />
        <mesh
          geometry={nodes.Object_72.geometry}
          material={materials.Brake_Caliper}
          position={[0.355, -0.049, 0.757]}
          scale={0.358}
        />
        <mesh
          geometry={nodes.Object_74.geometry}
          material={materials.Brake_Caliper}
          position={[-0.353, -0.049, 0.757]}
          scale={0.358}
        />
        <mesh
          geometry={nodes.Object_76.geometry}
          material={materials.Brake_Caliper}
          position={[-0.351, -0.05, -0.404]}
          scale={0.358}
        />
        <mesh
          geometry={nodes.Object_78.geometry}
          material={materials.Brake_Caliper}
          position={[0.354, -0.05, -0.404]}
          scale={0.358}
        />
        <mesh
          geometry={nodes.Object_80.geometry}
          material={materials.Glass}
          position={[0.001, 0.251, -0.01]}
          scale={0.358}
        />
        <mesh
          geometry={nodes.Object_82.geometry}
          material={materials.headlights}
          position={[0.001, 0.057, 1.13]}
          rotation={[-Math.PI, 0, 0]}
          scale={0.358}
        />
        <mesh
          geometry={nodes.Object_84.geometry}
          material={materials.interior1}
          position={[0.001, -0.176, 0.559]}
          rotation={[-Math.PI, 0, 0]}
          scale={0.358}
        />
        <mesh
          geometry={nodes.Object_86.geometry}
          material={materials.interior1}
          position={[0.001, -0.176, 0.559]}
          rotation={[-Math.PI, 0, 0]}
          scale={0.358}
        />
        <mesh
          geometry={nodes.Object_91.geometry}
          material={materials.Livery}
          position={[0.394, 0.138, -0.028]}
          scale={0.358}
        />
        <mesh
          geometry={nodes.Object_93.geometry}
          material={materials.Livery}
          position={[-0.392, 0.138, -0.028]}
          scale={0.358}
        />
        <mesh
          geometry={nodes.Object_98.geometry}
          material={materials.radiator}
          position={[-0.002, -0.049, 1.163]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={0.358}
        />
        <mesh
          geometry={nodes.Object_100.geometry}
          material={materials.Livery}
          position={[0.002, 0.036, -0.743]}
          scale={0.358}
        />
        <mesh
          geometry={nodes.Object_102.geometry}
          material={materials.rivet}
          position={[-0.403, 0.078, 0.889]}
          scale={0.358}
        />
        <mesh
          geometry={nodes.Object_104.geometry}
          material={materials.Shock_Absorber}
          position={[0.259, 0.046, 0.807]}
          scale={0.358}
        />
        <mesh
          geometry={nodes.Object_106.geometry}
          material={materials.Shock_Absorber}
          position={[-0.257, 0.046, 0.807]}
          scale={0.358}
        />
        <mesh
          geometry={nodes.Object_108.geometry}
          material={materials.Shock_Absorber}
          position={[-0.257, 0.046, -0.354]}
          scale={0.358}
        />
        <mesh
          geometry={nodes.Object_110.geometry}
          material={materials.Shock_Absorber}
          position={[0.259, 0.046, -0.354]}
          scale={0.358}
        />
        <mesh
          geometry={nodes.Object_112.geometry}
          material={materials.Livery}
          position={[0.001, -0.061, 0.206]}
          scale={0.358}
        />
        <mesh
          geometry={nodes.Object_114.geometry}
          material={materials.Spoiler}
          position={[-0.002, 0.254, -0.737]}
          rotation={[-Math.PI, 0, 0]}
          scale={0.358}
        />
        <mesh
          geometry={nodes.Object_116.geometry}
          material={materials.interior1}
          position={[-0.186, 0.138, 0.286]}
          rotation={[-1.203, 0, -Math.PI]}
          scale={0.358}
        />
        <mesh
          geometry={nodes.Object_118.geometry}
          material={materials.Shock_Absorber}
          position={[0.259, 0.044, 0.807]}
          scale={0.358}
        />
        <mesh
          geometry={nodes.Object_120.geometry}
          material={materials.Shock_Absorber}
          position={[-0.256, 0.044, 0.807]}
          scale={0.358}
        />
        <mesh
          geometry={nodes.Object_122.geometry}
          material={materials.Shock_Absorber}
          position={[-0.256, 0.044, -0.354]}
          scale={0.358}
        />
        <mesh
          geometry={nodes.Object_124.geometry}
          material={materials.Shock_Absorber}
          position={[0.259, 0.044, -0.354]}
          scale={0.358}
        />
        <mesh
          geometry={nodes.Object_126.geometry}
          material={materials.interior_black}
          position={[-0.203, 0.156, 0.331]}
          rotation={[-1.111, 0, 0]}
          scale={0.033}
        />
        <mesh
          geometry={nodes.Object_128.geometry}
          material={materials.Tail_Lights}
          position={[0.001, 0.153, -0.72]}
          rotation={[-Math.PI, 0, 0]}
          scale={0.358}
        />
        <mesh
          geometry={nodes.Object_133.geometry}
          material={materials.Window_frames}
          position={[0.001, 0.278, -0.395]}
          rotation={[-Math.PI, 0, 0]}
          scale={0.358}
        />
        <mesh
          geometry={nodes.Object_135.geometry}
          material={materials.Wipers}
          position={[0.002, 0.229, -0.586]}
          rotation={[1.518, 0, -3.063]}
          scale={0.358}
        />
        <mesh
          geometry={nodes.Object_137.geometry}
          material={materials.Wipers}
          position={[-0.201, 0.206, 0.524]}
          rotation={[-3.041, -1.192, -0.336]}
          scale={0.358}
        />
        <mesh
          geometry={nodes.Object_139.geometry}
          material={materials.Wipers}
          position={[0.024, 0.208, 0.544]}
          rotation={[-2.626, -1.441, 0.024]}
          scale={0.358}
        />
        <mesh
          geometry={nodes.Object_141.geometry}
          material={materials.Wipers}
          position={[0.201, 0.171, 0.55]}
          rotation={[-2.012, -1.41, 0.632]}
          scale={0.358}
        />
        <mesh
          geometry={nodes.Object_143.geometry}
          material={materials.Wipers}
          position={[-0.015, 0.167, 0.582]}
          rotation={[-2.729, -1.213, -0.044]}
          scale={0.358}
        />
        <mesh
          geometry={nodes.Object_145.geometry}
          material={materials.Wipers}
          position={[-0.007, 0.163, 0.554]}
          rotation={[-Math.PI, 0, 0]}
          scale={0.358}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/car4/scene.gltf");
