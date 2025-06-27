import React, { useRef, useCallback } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

export default function Model(props) {
  const { nodes, materials } = useGLTF("/car5/scene.gltf");

  // Create refs for each wheel group
  const wheelRefs = {
    frontRight: useRef(),
    frontLeft: useRef(),
    backRight: useRef(),
    backLeft: useRef(),
  };

  // Function to update wheel rotations
  const updateWheels = useCallback((delta) => {
    Object.values(wheelRefs).forEach((ref) => {
      if (ref.current) {
        // Rotate around the X-axis (assuming wheels roll along the Z-axis of the car)
        ref.current.rotation.x += delta * 10; // Adjust the multiplier for desired speed
      }
    });
  }, []);

  // Use useFrame to call updateWheels every frame
  useFrame((state, delta) => {
    updateWheels(delta);
  });

  return (
    <group {...props} dispose={null}>
      <group scale={2.1}>
        {/* Front Right Wheel Group */}
        <group ref={wheelRefs.frontRight} position={[0.823, 0.285, 1.183]}>
          <mesh
            geometry={nodes.C_98_EC_38_08_98_EC_38_51_2B_C1_9A_Ctire_0.geometry}
            material={materials.Ctire}
          />
          <mesh
            geometry={
              nodes.CF0_69_A6_80_F0_69_A6_80_B9_C3_A9_6D_CRIM_MAT_0.geometry
            }
            material={materials.CRIM_MAT}
          />
          <mesh
            geometry={
              nodes.CF0_69_A6_80_F0_69_A6_80_B9_C3_A9_6D_Cwheel_badges_0
                .geometry
            }
            material={materials.Cwheel_badges}
          />
          <mesh
            geometry={
              nodes.CF0_69_A6_80_F0_69_A6_80_B9_C3_A9_6D_Crim_MEtal_0.geometry
            }
            material={materials.Crim_MEtal}
          />
          <mesh
            geometry={
              nodes.C_53_6A_16_001_88_53_6A_16_001_8F_A3_52_F5_Cbreak_disk_0
                .geometry
            }
            material={materials.Cbreak_disk}
          />
          <mesh
            geometry={
              nodes.C_08_A3_AC_18_08_A3_AC_20_EF_4C_8F_Ccalipers_0.geometry
            }
            material={materials.Ccalipers}
            rotation={[Math.PI, 0, 0]}
          />
          <mesh
            geometry={
              nodes.C_08_A3_AC_18_08_A3_AC_20_EF_4C_8F1_Ccaliper_logo_0.geometry
            }
            material={materials.Ccaliper_logo}
            rotation={[Math.PI, 0, 0]}
          />
        </group>
        {/* Front Left Wheel Group */}
        <group
          ref={wheelRefs.frontLeft}
          position={[-0.823, 0.285, 1.183]}
          rotation={[-Math.PI, 0, -Math.PI]}
        >
          <mesh
            geometry={
              nodes.C_98_EC_38_08_98_EC_38_51_2B_C1_9A_Ctire_0_1.geometry
            }
            material={materials.Ctire}
          />
          <mesh
            geometry={
              nodes.CF0_69_A6_80_F0_69_A6_80_B9_C3_A9_6D_CRIM_MAT_0_1.geometry
            }
            material={materials.CRIM_MAT}
          />
          <mesh
            geometry={
              nodes.CF0_69_A6_80_F0_69_A6_80_B9_C3_A9_6D_Cwheel_badges_0_1
                .geometry
            }
            material={materials.Cwheel_badges}
          />
          <mesh
            geometry={
              nodes.CF0_69_A6_80_F0_69_A6_80_B9_C3_A9_6D_Crim_MEtal_0_1.geometry
            }
            material={materials.Crim_MEtal}
          />
          <mesh
            geometry={
              nodes.C_53_6A_16_88_53_6A_16_8F_A3_52_F5_Cbreak_disk_0.geometry
            }
            material={materials.Cbreak_disk}
          />
          <mesh
            geometry={
              nodes.C_3D_82_F2_80_3D_82_F2_20_EF_4C_8F1_Ccaliper_logo_0.geometry
            }
            material={materials.Ccaliper_logo}
          />
          <mesh
            geometry={
              nodes.C_3D_82_F2_001_80_3D_82_F2_001_20_EF_4C_8F_Ccalipers_0
                .geometry
            }
            material={materials.Ccalipers}
          />
        </group>
        {/* Back Right Wheel Group */}
        <group ref={wheelRefs.backRight} position={[0.765, 0.305, -1.314]}>
          <mesh
            geometry={
              nodes.CB_F1_3B_B2_001_1B_F1_3B_B2_001_51_2B_C1_9A_Ctire_0.geometry
            }
            material={materials.Ctire}
          />
          <mesh
            geometry={
              nodes.CF6_AD_55_DF_F6_AD_55_DF_B9_C3_A9_6D_CRIM_MAT_0.geometry
            }
            material={materials.CRIM_MAT}
          />
          <mesh
            geometry={
              nodes.CF6_AD_55_DF_F6_AD_55_DF_B9_C3_A9_6D_Cwheel_badges_0
                .geometry
            }
            material={materials.Cwheel_badges}
          />
          <mesh
            geometry={
              nodes.CF6_AD_55_DF_F6_AD_55_DF_B9_C3_A9_6D_Crim_MEtal_0.geometry
            }
            material={materials.Crim_MEtal}
          />
          <mesh
            geometry={
              nodes.C_08_A3_AC_001_18_08_A3_AC_001_20_EF_4C_8F_Ccalipers_0
                .geometry
            }
            material={materials.Ccalipers}
          />
          <mesh
            geometry={
              nodes.C_5D_0B_3A_66_5D_0B_3A_8F_A3_52_F5_Cbreak_disk_0.geometry
            }
            material={materials.Cbreak_disk}
          />
          <mesh
            geometry={
              nodes.C_3D_82_F2_001_80_3D_82_F2_001_20_EF_4C_8F1_Ccaliper_logo_0
                .geometry
            }
            material={materials.Ccaliper_logo}
          />
        </group>
        {/* Back Left Wheel Group */}
        <group
          ref={wheelRefs.backLeft}
          position={[-0.765, 0.305, -1.314]}
          rotation={[-Math.PI, 0, -Math.PI]}
        >
          <mesh
            geometry={
              nodes.CB_F1_3B_B2_001_1B_F1_3B_B2_001_51_2B_C1_9A_Ctire_0_1
                .geometry
            }
            material={materials.Ctire}
          />
          <mesh
            geometry={
              nodes.CF6_AD_55_DF_F6_AD_55_DF_B9_C3_A9_6D_CRIM_MAT_0_1.geometry
            }
            material={materials.CRIM_MAT}
          />
          <mesh
            geometry={
              nodes.CF6_AD_55_DF_F6_AD_55_DF_B9_C3_A9_6D_Cwheel_badges_0_1
                .geometry
            }
            material={materials.Cwheel_badges}
          />
          <mesh
            geometry={
              nodes.CF6_AD_55_DF_F6_AD_55_DF_B9_C3_A9_6D_Crim_MEtal_0_1.geometry
            }
            material={materials.Crim_MEtal}
          />
          <mesh
            geometry={
              nodes.C_5D_0B_3A_001_66_5D_0B_3A_001_8F_A3_52_F5_Cbreak_disk_0
                .geometry
            }
            material={materials.Cbreak_disk}
          />
          <mesh
            geometry={
              nodes.C_3D_82_F2_80_3D_82_F2_20_EF_4C_8F_Ccalipers_0.geometry
            }
            material={materials.Ccalipers}
            rotation={[Math.PI, 0, 0]}
          />
          <mesh
            geometry={
              nodes.C_08_A3_AC_001_18_08_A3_AC_001_20_EF_4C_8F1_Ccaliper_logo_0
                .geometry
            }
            material={materials.Ccaliper_logo}
            rotation={[Math.PI, 0, 0]}
          />
        </group>
        <group position={[0, 0.014, 0]} rotation={[0.024, 0, 0]}>
          <mesh
            geometry={nodes.plate_Plate_0.geometry}
            material={materials.Plate}
          />
          <mesh
            geometry={nodes.Interiors1_Interiors_0.geometry}
            material={materials.Interiors}
          />
          <mesh
            geometry={nodes.Light_D_CLight_D_0.geometry}
            material={materials.CLight_D}
          />
          <mesh
            geometry={nodes.BaDGES_MESH_Cbadges_0.geometry}
            material={materials.Cbadges}
          />
          <mesh
            geometry={nodes.CGRILLE_3_grille_0.geometry}
            material={materials.grille}
          />
          <mesh
            geometry={nodes.PLASTIC_R_4_plastic_R_0.geometry}
            material={materials.plastic_R}
          />
          <mesh
            geometry={nodes.mirrors_MIRRORs_0.geometry}
            material={materials.MIRRORs}
          />
          <mesh
            geometry={nodes.BODY_mId_CAR_Paint_0.geometry}
            material={materials.CAR_Paint}
          />
          <mesh
            geometry={nodes.Lines_mesh_Lines_0.geometry}
            material={materials.Lines}
          />
          <mesh
            geometry={nodes.plastic_shine_Black_Color_0.geometry}
            material={materials.Black_Color}
          />
          <mesh
            geometry={nodes.Glass_Mesh_glass_0.geometry}
            material={materials.glass}
          />
          <mesh
            geometry={nodes.Limpiaparabrisas_Plastic_Color_0.geometry}
            material={materials.Plastic_Color}
          />
          <mesh
            geometry={nodes.Light_Case_Indicaros_0.geometry}
            material={materials.Indicaros}
          />
          <mesh
            geometry={nodes.LIGHT_GLASS_FORNT_glass_0.geometry}
            material={materials.glass}
          />
          <mesh
            geometry={nodes.PLASTIC_R2_plastic_R_0.geometry}
            material={materials.plastic_R}
          />
          <mesh
            geometry={nodes.Plastic_R_plastic_R_0.geometry}
            material={materials.plastic_R}
          />
          <mesh
            geometry={nodes.Indicators_2_Indicaros_0.geometry}
            material={materials.Indicaros}
          />
          <mesh
            geometry={nodes.Light_Ef_Indicaros_0.geometry}
            material={materials.Indicaros}
          />
          <mesh
            geometry={nodes.BODY_REAR_CAR_Paint_0.geometry}
            material={materials.CAR_Paint}
          />
          <mesh
            geometry={nodes.REAR_LIGhT_D_Rear_Light_C_0.geometry}
            material={materials.Rear_Light_C}
          />
          <mesh
            geometry={nodes.rEAR_LIGHT_RC_Light_Back_0.geometry}
            material={materials.Light_Back}
          />
          <mesh
            geometry={nodes.RED_GLASS_3_red_glass_0.geometry}
            material={materials.red_glass}
          />
          <mesh
            geometry={nodes.REAR_LIGHT_2_Rear_Light_C_0.geometry}
            material={materials.Rear_Light_C}
          />
          <mesh
            geometry={nodes.Rear_Light_CL_Rear_Light_C_0.geometry}
            material={materials.Rear_Light_C}
          />
          <mesh
            geometry={nodes.GLASS_REAR_glass_0.geometry}
            material={materials.glass}
          />
          <mesh
            geometry={nodes.RED_GLASS_2_red_glass_0.geometry}
            material={materials.red_glass}
          />
          <mesh
            geometry={nodes.ORANGE_GLASS_orange_glass_0.geometry}
            material={materials.orange_glass}
          />
          <mesh
            geometry={nodes.RED_GLASS_1_red_glass_0.geometry}
            material={materials.red_glass}
          />
          <mesh
            geometry={nodes.METAL_3_METAL_0.geometry}
            material={materials.METAL}
          />
          <mesh
            geometry={nodes.METAL_4_METAL_0.geometry}
            material={materials.METAL}
          />
          <mesh
            geometry={nodes.CHASSIS_MESH_Cunder_car_0.geometry}
            material={materials.Cunder_car}
          />
          <mesh
            geometry={nodes.Chassis_2_Plastic_Color_0.geometry}
            material={materials.Plastic_Color}
          />
          <mesh
            geometry={nodes.STW_Interiors_0.geometry}
            material={materials.Interiors}
          />
          <mesh
            geometry={nodes.METAL_2_METAL_0.geometry}
            material={materials.METAL}
          />
          <mesh
            geometry={nodes.GRID_1_grille_0.geometry}
            material={materials.grille}
          />
          <mesh
            geometry={nodes.CPLasTIC_R_5_plastic_R_0.geometry}
            material={materials.plastic_R}
          />
          <mesh
            geometry={nodes.Badges_1_Cbadges_0.geometry}
            material={materials.Cbadges}
          />
          <mesh
            geometry={nodes.PLASTIC_BLACK_Black_Color_0.geometry}
            material={materials.Black_Color}
          />
          <mesh
            geometry={nodes.CHASSIS_3_Cunder_car_0.geometry}
            material={materials.Cunder_car}
          />
          <mesh
            geometry={nodes.Glass_Light_glass_0.geometry}
            material={materials.glass}
          />
          <mesh
            geometry={nodes.CLINEs_2_Lines_0.geometry}
            material={materials.Lines}
          />
          <mesh
            geometry={nodes.Front_Light_1_CLight_D_0.geometry}
            material={materials.CLight_D}
          />
          <mesh
            geometry={nodes.Indicators_Light_Indicaros_0.geometry}
            material={materials.Indicaros}
          />
          <mesh
            geometry={nodes.Plastic_Front_Light_Indicaros_0.geometry}
            material={materials.Indicaros}
          />
          <mesh
            geometry={nodes.Cfont_light_case_Indicaros_0.geometry}
            material={materials.Indicaros}
          />
          <mesh
            geometry={nodes.BODY_fRONT_CAR_Paint_0.geometry}
            material={materials.CAR_Paint}
          />
          <mesh
            geometry={nodes.Indicator_Tablero_Indicaros_0.geometry}
            material={materials.Indicaros}
          />
          <mesh
            geometry={nodes.REAR_LIGHTS_C_Light_Back_0.geometry}
            material={materials.Light_Back}
          />
          <mesh
            geometry={nodes.CLines_4_Lines_0.geometry}
            material={materials.Lines}
          />
          <mesh
            geometry={nodes.GRILLE_2_grille_0.geometry}
            material={materials.grille}
          />
          <mesh
            geometry={nodes.Clines_6_Lines_0.geometry}
            material={materials.Lines}
          />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/car5/scene.gltf");
