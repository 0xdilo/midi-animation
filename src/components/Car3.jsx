import React, { useRef, useCallback } from "react";
import { useGLTF, SpotLight } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

export default function Model(props) {
  const { nodes, materials } = useGLTF("/car3/scene.gltf");
  const { lightColor = "#ffffff", isBackground = false } = props;

  const wheelRefs = {
    frontRight: useRef(),
    frontLeft: useRef(),
    backRight: useRef(),
    backLeft: useRef(),
  };

  const updateWheels = useCallback((delta) => {
    Object.values(wheelRefs).forEach((ref) => {
      if (ref.current) {
        ref.current.rotation.x += delta * 10;
      }
    });
  }, []);

  useFrame((state, delta) => {
    updateWheels(delta);
  });
  return (
    <group {...props} dispose={null}>
      <group position={[-0, -0.9, -1]} scale={0.022}>
        <group>
          <mesh
            geometry={nodes.CARBONENG_TexturedA002_0.geometry}
            material={materials["TexturedA.002"]}
            frustumCulled={false}
          />
          <mesh
            geometry={nodes.CARBONENG_Carbon1M002_0.geometry}
            material={materials["Carbon1M.002"]}
            frustumCulled={false}
          />
        </group>
        <group position={[0, 19.27, 10.478]} scale={100}>
          <mesh
            geometry={nodes.DoorLInterior_InteriorA_0.geometry}
            material={materials.InteriorA}
            frustumCulled={false}
          />
          <mesh
            geometry={nodes.DoorLInterior_InteriorColour1A_0.geometry}
            material={materials.InteriorColour1A}
            frustumCulled={false}
          />
        </group>
        <group position={[0, 19.27, 10.478]} scale={100}>
          <mesh
            geometry={nodes.DoorRInterior_InteriorA_0.geometry}
            material={materials.InteriorA}
            frustumCulled={false}
          />
          <mesh
            geometry={nodes.DoorRInterior_InteriorColour1A_0.geometry}
            material={materials.InteriorColour1A}
            frustumCulled={false}
          />
        </group>
        <group position={[0, 19.27, 10.478]} scale={100}>
          <mesh
            geometry={nodes.DriverSeatInterior_InteriorA_0.geometry}
            material={materials.InteriorA}
            frustumCulled={false}
          />
          <mesh
            geometry={nodes.DriverSeatInterior_InteriorColour1A_0.geometry}
            material={materials.InteriorColour1A}
            frustumCulled={false}
          />
        </group>
        <group position={[0, 19.27, 10.478]} scale={100}>
          <mesh
            geometry={nodes.GLASSS_GlassMtl002_0.geometry}
            material={materials["GlassMtl.002"]}
            frustumCulled={false}
          />
          <mesh
            geometry={nodes.GLASSS_GlassRed002_0.geometry}
            material={materials["GlassRed.002"]}
            frustumCulled={false}
          />
        </group>
        <group position={[0, 19.27, 10.478]} scale={100}>
          <mesh
            geometry={nodes.GLASS_INSIDE_GlassAmber002_0.geometry}
            material={materials["GlassAmber.002"]}
            frustumCulled={false}
          />
          <mesh
            geometry={nodes.GLASS_INSIDE_GlassRed002_0.geometry}
            material={materials["GlassRed.002"]}
            frustumCulled={false}
          />
          <mesh
            geometry={nodes.GLASS_INSIDE_GlassMtl002_0.geometry}
            material={materials["GlassMtl.002"]}
            frustumCulled={false}
          />
        </group>
        <group position={[0, 19.27, 10.478]} scale={100}>
          <mesh
            geometry={nodes.ManufacturerPlate_ManufacturerPlateD_0.geometry}
            material={materials.ManufacturerPlateD}
            frustumCulled={false}
          />
          <mesh
            geometry={nodes.ManufacturerPlate_Material002_0.geometry}
            material={materials["Material.002"]}
            frustumCulled={false}
          />
        </group>
        <group position={[0, 19.27, 10.478]} scale={100}>
          <mesh
            geometry={nodes.PassengerSeatInterior_InteriorA_0.geometry}
            material={materials.InteriorA}
            frustumCulled={false}
          />
          <mesh
            geometry={nodes.PassengerSeatInterior_InteriorColour1A_0.geometry}
            material={materials.InteriorColour1A}
            frustumCulled={false}
          />
        </group>
        <group
          ref={wheelRefs.frontLeft}
          position={[76.495, 38.473, 139.327]}
          scale={105.321}
        >
          <mesh
            geometry={nodes.WHEEL_FL_DISK2_0.geometry}
            material={materials.DISK2}
            frustumCulled={false}
          />
          <mesh
            geometry={nodes.WHEEL_FL_DISK1_0.geometry}
            material={materials.DISK1}
            frustumCulled={false}
          />
          <mesh
            geometry={nodes.WHEEL_FL_Wheel2A_0.geometry}
            material={materials.Wheel2A}
            frustumCulled={false}
          />
        </group>
        <group
          ref={wheelRefs.frontRight}
          position={[-77.56, 38.568, 139.327]}
          scale={[-105.321, 105.321, 105.321]}
        >
          <mesh
            geometry={nodes.WHEEL_FR_DISK2_0.geometry}
            material={materials.DISK2}
            frustumCulled={false}
          />
          <mesh
            geometry={nodes.WHEEL_FR_DISK1_0.geometry}
            material={materials.DISK1}
            frustumCulled={false}
          />
          <mesh
            geometry={nodes.WHEEL_FR_Wheel2A_0.geometry}
            material={materials.Wheel2A}
            frustumCulled={false}
          />
        </group>
        <group
          ref={wheelRefs.backLeft}
          position={[79.425, 37.839, -113.409]}
          scale={105.321}
        >
          <mesh
            geometry={nodes.WHEEL_RL_DISK2_0.geometry}
            material={materials.DISK2}
            frustumCulled={false}
          />
          <mesh
            geometry={nodes.WHEEL_RL_DISK1_0.geometry}
            material={materials.DISK1}
            frustumCulled={false}
          />
          <mesh
            geometry={nodes.WHEEL_RL_Wheel2A_0.geometry}
            material={materials.Wheel2A}
            frustumCulled={false}
          />
        </group>
        <group
          ref={wheelRefs.backRight}
          position={[-79.678, 37.935, -113.409]}
          scale={[-105.321, 105.321, 105.321]}
        >
          <mesh
            geometry={nodes.WHEEL_RR_DISK2_0.geometry}
            material={materials.DISK2}
            frustumCulled={false}
          />
          <mesh
            geometry={nodes.WHEEL_RR_DISK1_0.geometry}
            material={materials.DISK1}
            frustumCulled={false}
          />
          <mesh
            geometry={nodes.WHEEL_RR_Wheel2A_0.geometry}
            material={materials.Wheel2A}
            frustumCulled={false}
          />
        </group>
        <mesh
          geometry={nodes.BLACKBODY_Base002_0.geometry}
          material={materials["Base.002"]}
          position={[0, 19.27, 10.478]}
          scale={100}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.CALIPER_FL_CaliperGloss008_0.geometry}
          material={materials["CaliperGloss.008"]}
          position={[69.684, 36.89, 124.965]}
          rotation={[-2.784, -0.115, -0.264]}
          scale={105.321}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.CALIPER_FR_CaliperGloss008_0.geometry}
          material={materials["CaliperGloss.008"]}
          position={[-70.749, 36.985, 124.965]}
          rotation={[-2.784, 0.115, 0.264]}
          scale={[-105.321, 105.321, 105.321]}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.CALIPER_RL_CaliperGloss008_0.geometry}
          material={materials["CaliperGloss.008"]}
          position={[72.44, 37.524, -127.77]}
          rotation={[-2.77, -0.05, -0.092]}
          scale={105.321}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.CALIPER_RR_CaliperGloss008_0.geometry}
          material={materials["CaliperGloss.008"]}
          position={[-72.693, 37.619, -127.77]}
          rotation={[-2.77, 0.05, 0.092]}
          scale={[-105.321, 105.321, 105.321]}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.CARBON_Carbon1001_0.geometry}
          material={materials["Carbon1.001"]}
          position={[0, 19.27, 10.478]}
          scale={100}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.CARBON_2_Carbon2_0.geometry}
          material={materials.Carbon2}
          position={[0, 19.27, 10.478]}
          scale={100}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.CAR_PAINT_Paint_0.geometry}
          material={materials.Paint}
          position={[0, 19.27, 10.478]}
          scale={100}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.CHASSIS_Coloured002_0.geometry}
          material={materials["Coloured.002"]}
          position={[0, 19.27, 10.478]}
          scale={100}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.CHASSIS_BADGE_BadgeD_0.geometry}
          material={materials.BadgeD}
          position={[0, 19.27, 10.478]}
          scale={100}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.DoorLBase_Base002_0.geometry}
          material={materials["Base.002"]}
          position={[0, 19.27, 10.478]}
          scale={100}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.DoorLCarbon2_Carbon2002_0.geometry}
          material={materials["Carbon2.002"]}
          position={[0, 19.27, 10.478]}
          scale={100}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.DoorLColoured_Coloured002_0.geometry}
          material={materials["Coloured.002"]}
          position={[0, 19.27, 10.478]}
          scale={100}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.DoorLGlass_GlassMtl002_0.geometry}
          material={materials["GlassMtl.002"]}
          position={[0, 19.27, 10.478]}
          scale={100}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.DoorLGlassInside_GlassMtl002_0.geometry}
          material={materials["GlassMtl.002"]}
          position={[0, 19.27, 10.478]}
          scale={100}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.DoorLGrille9_Grille9A002_0.geometry}
          material={materials["Grille9A.002"]}
          position={[0, 19.27, 10.478]}
          scale={100}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.DoorLPaint_Paint_0.geometry}
          material={materials.Paint}
          position={[0, 19.27, 10.478]}
          scale={100}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.DoorRBase_Base002_0.geometry}
          material={materials["Base.002"]}
          position={[0, 19.27, 10.478]}
          scale={100}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.DoorRCarbon2_Carbon2002_0.geometry}
          material={materials["Carbon2.002"]}
          position={[0, 19.27, 10.478]}
          scale={100}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.DoorRColoured_Coloured002_0.geometry}
          material={materials["Coloured.002"]}
          position={[0, 19.27, 10.478]}
          scale={100}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.DoorRColoured001_Mirror_0.geometry}
          material={materials.Mirror}
          position={[0, 19.27, 10.478]}
          scale={100}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.DoorRGlass_GlassMtl002_0.geometry}
          material={materials["GlassMtl.002"]}
          position={[0, 19.27, 10.478]}
          scale={100}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.DoorRGlassInside_GlassMtl002_0.geometry}
          material={materials["GlassMtl.002"]}
          position={[0, 19.27, 10.478]}
          scale={100}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.DoorRGrille9_Grille9A002_0.geometry}
          material={materials["Grille9A.002"]}
          position={[0, 19.27, 10.478]}
          scale={100}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.DoorRPaint_Paint_0.geometry}
          material={materials.Paint}
          position={[0, 19.27, 10.478]}
          scale={100}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.DriverSeatBeltColoured_Coloured002_0.geometry}
          material={materials["Coloured.002"]}
          position={[0, 19.27, 10.478]}
          scale={100}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.ENGINE_EngineA002_0.geometry}
          material={materials["EngineA.002"]}
          position={[0, 19.27, 10.478]}
          scale={100}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.GRILLE_Grille8A_0.geometry}
          material={materials.Grille8A}
          position={[0, 19.27, 10.478]}
          scale={100}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.GRILLE6_Grille6A002_0.geometry}
          material={materials["Grille6A.002"]}
          position={[0, 19.27, 10.478]}
          scale={100}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.GRILLE7_Grille7A002_0.geometry}
          material={materials["Grille7A.002"]}
          position={[0, 19.27, 10.478]}
          scale={100}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.GRILLE9_Grille9A002_0.geometry}
          material={materials["Grille9A.002"]}
          position={[0, 19.27, 10.478]}
          scale={100}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.HandBrakeInterior_InteriorA_0.geometry}
          material={materials.InteriorA}
          position={[0, 19.27, 10.478]}
          scale={100}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.HoodCarbon1_GlassMtl_0.geometry}
          material={materials.GlassMtl}
          position={[0, 19.27, 10.478]}
          scale={100}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.HoodColoured_Coloured002_0.geometry}
          material={materials["Coloured.002"]}
          position={[0, 19.27, 10.478]}
          scale={100}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.HoodGrille1_Hood3BGrille1_0.geometry}
          material={materials.Hood3BGrille1}
          position={[0, 19.27, 10.478]}
          scale={100}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.HoodPaint_Paint_0.geometry}
          material={materials.Paint}
          position={[0, 19.27, 10.478]}
          scale={100}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.INTERIOR_InteriorA_0.geometry}
          material={materials.InteriorA}
          position={[0, 19.27, 10.478]}
          scale={100}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.LICENSE_License_0.geometry}
          material={materials.License}
          position={[0, 60.39, -209.605]}
          rotation={[0.014, 0, 0]}
          scale={[-14.03, 6.41, 104.727]}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.LIGHT_LightD_0.geometry}
          material={materials.LightD}
          position={[0, 19.27, 10.478]}
          scale={100}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.LicensePlate002_Material001_0.geometry}
          material={materials["Material.001"]}
          position={[0, 60.194, -209.625]}
          scale={100}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.PassengerSeatBeltColoured_Coloured002_0.geometry}
          material={materials["Coloured.002"]}
          position={[0, 19.27, 10.478]}
          scale={100}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.SHIFTER_InteriorA001_0.geometry}
          material={materials["InteriorA.001"]}
          position={[0, 19.27, 10.478]}
          scale={100}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.STEER_InteriorA_0.geometry}
          material={materials.InteriorA}
          position={[0, 19.27, 10.478]}
          scale={100}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.TOYOTA_Coloured003_0.geometry}
          material={materials["Coloured.003"]}
          position={[-0.619, 62.658, 223.739]}
          rotation={[0.029, 0, 0]}
          scale={100}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.TOYOTA2_Coloured003_0.geometry}
          material={materials["Coloured.003"]}
          position={[-0.013, 88.022, -203.537]}
          scale={100}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.TOYOTAm_Coloured003_0.geometry}
          material={materials["Coloured.003"]}
          position={[-0.619, 62.447, 223.711]}
          rotation={[0.029, 0, 0]}
          scale={100}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.TRBASE_Base002_0.geometry}
          material={materials["Base.002"]}
          position={[0, 19.27, 10.478]}
          scale={100}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.TRUNK_C_Coloured002_0.geometry}
          material={materials["Coloured.002"]}
          position={[0, 19.27, 10.478]}
          scale={100}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.TRUNK_CARBON_Carbon1001_0.geometry}
          material={materials["Carbon1.001"]}
          position={[-0.012, 95.282, -199.591]}
          scale={100}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.TR_CARBON_Carbon1001_0.geometry}
          material={materials["Carbon1.001"]}
          position={[0, 19.27, 10.478]}
          scale={100}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.TrunkDuckTailGlass_GlassMtl002_0.geometry}
          material={materials["GlassMtl.002"]}
          position={[-0.012, 94.86, -199.607]}
          scale={100}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.TrunkDuckTailPaint_Paint_0.geometry}
          material={materials.Paint}
          position={[-0.034, 100.35, -158.141]}
          scale={100}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.TrunkGlass_GlassMtl002_0.geometry}
          material={materials["GlassMtl.002"]}
          position={[-0.012, 103.894, -148.54]}
          scale={100}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.TrunkGlassInside_GlassMtl002_0.geometry}
          material={materials["GlassMtl.002"]}
          position={[0, 19.27, 10.478]}
          scale={100}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.TrunkInterior_InteriorA002_0.geometry}
          material={materials["InteriorA.002"]}
          position={[0, 19.27, 10.478]}
          scale={100}
          frustumCulled={false}
        />
        <mesh
          geometry={nodes.TrunkLight_LightD_0.geometry}
          material={materials.LightD}
          position={[0.014, 94.815, -199.54]}
          scale={100}
          frustumCulled={false}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/car3/scene.gltf");
