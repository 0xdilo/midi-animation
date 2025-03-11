import React from "react";
import { useGLTF } from "@react-three/drei";

export default function Model(props) {
  const { nodes, materials } = useGLTF("/cars/car2/scene.gltf");
  return (
    <group {...props} dispose={null} scale={2}>
      <group rotation={[-Math.PI / 2, 0, 0]} scale={1.053}>
        <mesh
          geometry={nodes.Object_2.geometry}
          material={materials["110EBsupersport"]}
        />
        <mesh geometry={nodes.Object_3.geometry} material={materials.ANSA} />
        <mesh geometry={nodes.Object_4.geometry} material={materials.Blight1} />
        <mesh geometry={nodes.Object_5.geometry} material={materials.Blight2} />
        <mesh geometry={nodes.Object_6.geometry} material={materials.Blight3} />
        <mesh
          geometry={nodes.Object_7.geometry}
          material={materials.Bugatti_EB110SS_By_Alex_Ka}
        />
        <mesh geometry={nodes.Object_8.geometry} material={materials.Hlight1} />
        <mesh geometry={nodes.Object_9.geometry} material={materials.Hlight2} />
        <mesh
          geometry={nodes.Object_10.geometry}
          material={materials.Hlight3}
        />
        <mesh geometry={nodes.Object_11.geometry} material={materials.Smoke} />
        <mesh
          geometry={nodes.Object_12.geometry}
          material={materials.black_aluminium}
        />
        <mesh
          geometry={nodes.Object_13.geometry}
          material={materials.black_chrome}
        />
        <mesh
          geometry={nodes.Object_14.geometry}
          material={materials.black_chrome2}
        />
        <mesh
          geometry={nodes.Object_15.geometry}
          material={materials.black_matte}
        />
        <mesh
          geometry={nodes.Object_16.geometry}
          material={materials.black_plastic}
        />
        <mesh geometry={nodes.Object_17.geometry} material={materials.bottom} />
        <mesh
          geometry={nodes.Object_18.geometry}
          material={materials.brakedisc}
        />
        <mesh
          geometry={nodes.Object_19.geometry}
          material={materials.brakelight_glass}
        />
        <mesh
          geometry={nodes.Object_20.geometry}
          material={materials.brakelight_grill}
        />
        <mesh
          geometry={nodes.Object_21.geometry}
          material={materials.carshadow}
        />
        <mesh geometry={nodes.Object_22.geometry} material={materials.chrome} />
        <mesh
          geometry={nodes.Object_23.geometry}
          material={materials.chrome_details}
        />
        <mesh geometry={nodes.Object_24.geometry} material={materials.emblem} />
        <mesh
          geometry={nodes.Object_25.geometry}
          material={materials.emblem_chrome}
        />
        <mesh geometry={nodes.Object_26.geometry} material={materials.engine} />
        <mesh
          geometry={nodes.Object_27.geometry}
          material={materials.exhaust}
        />
        <mesh geometry={nodes.Object_28.geometry} material={materials.floor} />
        <mesh
          geometry={nodes.Object_29.geometry}
          material={materials.floormat}
        />
        <mesh
          geometry={nodes.Object_30.geometry}
          material={materials.glas_sign}
        />
        <mesh geometry={nodes.Object_31.geometry} material={materials.grill1} />
        <mesh geometry={nodes.Object_32.geometry} material={materials.grill2} />
        <mesh geometry={nodes.Object_33.geometry} material={materials.grill3} />
        <mesh geometry={nodes.Object_34.geometry} material={materials.grillA} />
        <mesh geometry={nodes.Object_35.geometry} material={materials.grillB} />
        <mesh geometry={nodes.Object_36.geometry} material={materials.grillC} />
        <mesh
          geometry={nodes.Object_37.geometry}
          material={materials.headlight_glass}
        />
        <mesh
          geometry={nodes.Object_38.geometry}
          material={materials.material}
        />
        <mesh
          geometry={nodes.Object_39.geometry}
          material={materials.matte_details}
        />
        <mesh
          geometry={nodes.Object_40.geometry}
          material={materials.mirrors}
        />
        <mesh
          geometry={nodes.Object_41.geometry}
          material={materials.needforspeed}
        />
        <mesh
          geometry={nodes.Object_42.geometry}
          material={materials.plastic_details}
        />
        <mesh geometry={nodes.Object_43.geometry} material={materials.plate} />
        <mesh
          geometry={nodes.Object_44.geometry}
          material={materials.rear_bumper_plastic}
        />
        <mesh
          geometry={nodes.Object_45.geometry}
          material={materials.reflector_front}
        />
        <mesh
          geometry={nodes.Object_46.geometry}
          material={materials.reflector_side}
        />
        <mesh geometry={nodes.Object_47.geometry} material={materials.rim1} />
        <mesh class="this" geometry={nodes.Object_48.geometry} material={materials.rim2} />
        <mesh geometry={nodes.Object_49.geometry} material={materials.rim3} />
        <mesh
          geometry={nodes.Object_50.geometry}
          material={materials.rim_emb}
        />
        <mesh
          geometry={nodes.Object_51.geometry}
          material={materials.rimbolts}
          class="this"
        />
        <mesh geometry={nodes.Object_52.geometry} material={materials.roof} />
        <mesh geometry={nodes.Object_53.geometry} material={materials.suport} />
        <mesh
          geometry={nodes.Object_54.geometry}
          material={materials.supportlogo}
        />
        <mesh geometry={nodes.Object_55.geometry} material={materials.tire} />
        <mesh
          geometry={nodes.Object_56.geometry}
          material={materials.tire_side}
        />
        <mesh
          geometry={nodes.Object_57.geometry}
          material={materials.w_s_sign}
        />
        <mesh
          geometry={nodes.Object_58.geometry}
          material={materials.windoFS}
        />
        <mesh geometry={nodes.Object_59.geometry} material={materials.windoR} />
      </group>
    </group>
  );
}

useGLTF.preload("/cars/car2/scene.gltf");
