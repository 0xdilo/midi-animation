import React from "react";
import { useGLTF } from "@react-three/drei";

export default function Model(props) {
  const { nodes, materials } = useGLTF("/cars/car1/car1.gltf");
  return (
    <group {...props} dispose={null} scale={0.02}>
      <group rotation={[-Math.PI, 0, 0]}>
        <mesh
          geometry={nodes.Object_2.geometry}
          material={materials.clearglass}
        />
        <mesh
          geometry={nodes.Object_3.geometry}
          material={materials.interior_second}
        />
        <mesh
          geometry={nodes.Object_4.geometry}
          material={materials.interior_seventh}
        />
        <mesh
          geometry={nodes.Object_5.geometry}
          material={materials.material}
        />
        <mesh
          geometry={nodes.Object_6.geometry}
          material={materials.mattemetal}
        />
        <mesh
          geometry={nodes.Object_7.geometry}
          material={materials.mattemetal}
        />
        <mesh
          geometry={nodes.Object_8.geometry}
          material={materials.LicPlate_black}
        />
        <mesh
          geometry={nodes.Object_9.geometry}
          material={materials.LicPlate_blue}
        />
        <mesh
          geometry={nodes.Object_10.geometry}
          material={materials.LicPlate_white}
        />
        <mesh
          geometry={nodes.Object_11.geometry}
          material={materials.LicPlate_yellow}
        />
        <mesh geometry={nodes.Object_12.geometry} material={materials.blue} />
        <mesh geometry={nodes.Object_13.geometry} material={materials.blue} />
        <mesh
          geometry={nodes.Object_14.geometry}
          material={materials.brakedisk}
        />
        <mesh geometry={nodes.Object_15.geometry} material={materials.chrome} />
        <mesh
          geometry={nodes.Object_16.geometry}
          material={materials.interior_fifth}
        />
        <mesh geometry={nodes.Object_17.geometry} material={materials.mirror} />
        <mesh
          geometry={nodes.Object_18.geometry}
          material={materials.material_22}
        />
        <mesh
          geometry={nodes.Object_19.geometry}
          material={materials.material_22}
        />
        <mesh geometry={nodes.Object_20.geometry} material={materials.white} />
        <mesh
          geometry={nodes.Object_21.geometry}
          material={materials.clearglass}
        />
        <mesh
          geometry={nodes.Object_22.geometry}
          material={materials.clearglass}
        />
        <mesh
          geometry={nodes.Object_23.geometry}
          material={materials.clearglass}
        />
        <mesh
          geometry={nodes.Object_24.geometry}
          material={materials.clearglass}
        />
        <mesh
          geometry={nodes.Object_25.geometry}
          material={materials.clearglass}
        />
        <mesh
          geometry={nodes.Object_26.geometry}
          material={materials.clearglass}
        />
        <mesh geometry={nodes.Object_27.geometry} material={materials.black} />
        <mesh geometry={nodes.Object_28.geometry} material={materials.black} />
        <mesh geometry={nodes.Object_29.geometry} material={materials.black} />
        <mesh geometry={nodes.Object_30.geometry} material={materials.black} />
        <mesh geometry={nodes.Object_31.geometry} material={materials.black} />
        <mesh geometry={nodes.Object_32.geometry} material={materials.black} />
        <mesh geometry={nodes.Object_33.geometry} material={materials.black} />
        <mesh geometry={nodes.Object_34.geometry} material={materials.black} />
        <mesh geometry={nodes.Object_35.geometry} material={materials.black} />
        <mesh geometry={nodes.Object_36.geometry} material={materials.black} />
        <mesh geometry={nodes.Object_37.geometry} material={materials.black} />
        <mesh geometry={nodes.Object_38.geometry} material={materials.black} />
        <mesh geometry={nodes.Object_39.geometry} material={materials.black} />
        <mesh geometry={nodes.Object_40.geometry} material={materials.black} />
        <mesh geometry={nodes.Object_41.geometry} material={materials.black} />
        <mesh geometry={nodes.Object_42.geometry} material={materials.black} />
        <mesh geometry={nodes.Object_43.geometry} material={materials.black} />
        <mesh geometry={nodes.Object_44.geometry} material={materials.black} />
        <mesh geometry={nodes.Object_45.geometry} material={materials.black} />
        <mesh geometry={nodes.Object_46.geometry} material={materials.black} />
        <mesh geometry={nodes.Object_47.geometry} material={materials.black} />
        <mesh geometry={nodes.Object_48.geometry} material={materials.black} />
        <mesh geometry={nodes.Object_49.geometry} material={materials.black} />
        <mesh geometry={nodes.Object_50.geometry} material={materials.black} />
        <mesh geometry={nodes.Object_51.geometry} material={materials.black} />
        <mesh geometry={nodes.Object_52.geometry} material={materials.black} />
        <mesh geometry={nodes.Object_53.geometry} material={materials.black} />
        <mesh geometry={nodes.Object_54.geometry} material={materials.black} />
        <mesh geometry={nodes.Object_55.geometry} material={materials.black} />
        <mesh geometry={nodes.Object_56.geometry} material={materials.black} />
        <mesh geometry={nodes.Object_57.geometry} material={materials.black} />
        <mesh geometry={nodes.Object_58.geometry} material={materials.black} />
        <mesh geometry={nodes.Object_59.geometry} material={materials.black} />
        <mesh geometry={nodes.Object_60.geometry} material={materials.black} />
        <mesh geometry={nodes.Object_61.geometry} material={materials.black} />
        <mesh geometry={nodes.Object_62.geometry} material={materials.black} />
        <mesh geometry={nodes.Object_63.geometry} material={materials.black} />
        <mesh geometry={nodes.Object_64.geometry} material={materials.black} />
        <mesh geometry={nodes.Object_65.geometry} material={materials.black} />
        <mesh geometry={nodes.Object_66.geometry} material={materials.black} />
        <mesh geometry={nodes.Object_67.geometry} material={materials.black} />
        <mesh geometry={nodes.Object_68.geometry} material={materials.black} />
        <mesh geometry={nodes.Object_69.geometry} material={materials.black} />
        <mesh geometry={nodes.Object_70.geometry} material={materials.black} />
        <mesh geometry={nodes.Object_71.geometry} material={materials.black} />
        <mesh geometry={nodes.Object_72.geometry} material={materials.black} />
        <mesh geometry={nodes.Object_73.geometry} material={materials.black} />
        <mesh geometry={nodes.Object_74.geometry} material={materials.black} />
        <mesh geometry={nodes.Object_75.geometry} material={materials.black} />
        <mesh geometry={nodes.Object_76.geometry} material={materials.black} />
        <mesh
          geometry={nodes.Object_77.geometry}
          material={materials.carpaint}
        />
        <mesh
          geometry={nodes.Object_78.geometry}
          material={materials.carpaint}
        />
        <mesh
          geometry={nodes.Object_79.geometry}
          material={materials.carpaint}
        />
        <mesh
          geometry={nodes.Object_80.geometry}
          material={materials.carpaint}
        />
        <mesh
          geometry={nodes.Object_81.geometry}
          material={materials.carpaint}
        />
        <mesh
          geometry={nodes.Object_82.geometry}
          material={materials.carpaint}
        />
        <mesh
          geometry={nodes.Object_83.geometry}
          material={materials.carpaint}
        />
        <mesh
          geometry={nodes.Object_84.geometry}
          material={materials.carpaint}
        />
        <mesh
          geometry={nodes.Object_85.geometry}
          material={materials.carpaint}
        />
        <mesh
          geometry={nodes.Object_86.geometry}
          material={materials.carpaint}
        />
        <mesh
          geometry={nodes.Object_87.geometry}
          material={materials.carpaint}
        />
        <mesh
          geometry={nodes.Object_88.geometry}
          material={materials.carpaint}
        />
        <mesh
          geometry={nodes.Object_89.geometry}
          material={materials.carpaint}
        />
        <mesh
          geometry={nodes.Object_90.geometry}
          material={materials.carpaint}
        />
        <mesh
          geometry={nodes.Object_91.geometry}
          material={materials.carpaint}
        />
        <mesh
          geometry={nodes.Object_92.geometry}
          material={materials.carpaint}
        />
        <mesh
          geometry={nodes.Object_93.geometry}
          material={materials.carpaint}
        />
        <mesh
          geometry={nodes.Object_94.geometry}
          material={materials.carpaint}
        />
        <mesh geometry={nodes.Object_95.geometry} material={materials.chrome} />
        <mesh geometry={nodes.Object_96.geometry} material={materials.chrome} />
        <mesh geometry={nodes.Object_97.geometry} material={materials.chrome} />
        <mesh geometry={nodes.Object_98.geometry} material={materials.chrome} />
        <mesh geometry={nodes.Object_99.geometry} material={materials.chrome} />
        <mesh
          geometry={nodes.Object_100.geometry}
          material={materials.chrome}
        />
        <mesh
          geometry={nodes.Object_101.geometry}
          material={materials.chrome}
        />
        <mesh
          geometry={nodes.Object_102.geometry}
          material={materials.chrome}
        />
        <mesh
          geometry={nodes.Object_103.geometry}
          material={materials.chrome}
        />
        <mesh
          geometry={nodes.Object_104.geometry}
          material={materials.chrome}
        />
        <mesh
          geometry={nodes.Object_105.geometry}
          material={materials.chrome}
        />
        <mesh
          geometry={nodes.Object_106.geometry}
          material={materials.chrome}
        />
        <mesh
          geometry={nodes.Object_107.geometry}
          material={materials.chrome}
        />
        <mesh
          geometry={nodes.Object_108.geometry}
          material={materials.chrome}
        />
        <mesh
          geometry={nodes.Object_109.geometry}
          material={materials.chrome}
        />
        <mesh
          geometry={nodes.Object_110.geometry}
          material={materials.chrome}
        />
        <mesh
          geometry={nodes.Object_111.geometry}
          material={materials.chrome}
        />
        <mesh
          geometry={nodes.Object_112.geometry}
          material={materials.interior}
        />
        <mesh
          geometry={nodes.Object_113.geometry}
          material={materials.interior}
        />
        <mesh
          geometry={nodes.Object_114.geometry}
          material={materials.interior}
        />
        <mesh
          geometry={nodes.Object_115.geometry}
          material={materials.interior}
        />
        <mesh
          geometry={nodes.Object_116.geometry}
          material={materials.interior_eighth}
        />
        <mesh
          geometry={nodes.Object_117.geometry}
          material={materials.interior_eighth}
        />
        <mesh
          geometry={nodes.Object_118.geometry}
          material={materials.interior_eighth}
        />
        <mesh
          geometry={nodes.Object_119.geometry}
          material={materials.interior_eighth}
        />
        <mesh
          geometry={nodes.Object_120.geometry}
          material={materials.interior_eighth}
        />
        <mesh
          geometry={nodes.Object_121.geometry}
          material={materials.interior_eighth}
        />
        <mesh
          geometry={nodes.Object_122.geometry}
          material={materials.interior_eighth}
        />
        <mesh
          geometry={nodes.Object_123.geometry}
          material={materials.interior_eighth}
        />
        <mesh
          geometry={nodes.Object_124.geometry}
          material={materials.interior_eighth}
        />
        <mesh
          geometry={nodes.Object_125.geometry}
          material={materials.interior_eighth}
        />
        <mesh
          geometry={nodes.Object_126.geometry}
          material={materials.interior_eighth}
        />
        <mesh
          geometry={nodes.Object_127.geometry}
          material={materials.interior_eighth}
        />
        <mesh
          geometry={nodes.Object_128.geometry}
          material={materials.interior_eighth}
        />
        <mesh
          geometry={nodes.Object_129.geometry}
          material={materials.interior_eighth}
        />
        <mesh
          geometry={nodes.Object_130.geometry}
          material={materials.interior_eighth}
        />
        <mesh
          geometry={nodes.Object_131.geometry}
          material={materials.interior_forth}
        />
        <mesh
          geometry={nodes.Object_132.geometry}
          material={materials.interior_forth}
        />
        <mesh
          geometry={nodes.Object_133.geometry}
          material={materials.interior_forth}
        />
        <mesh
          geometry={nodes.Object_134.geometry}
          material={materials.interior_forth}
        />
        <mesh
          geometry={nodes.Object_135.geometry}
          material={materials.interior_sixth}
        />
        <mesh
          geometry={nodes.Object_136.geometry}
          material={materials.interior_sixth}
        />
        <mesh
          geometry={nodes.Object_137.geometry}
          material={materials.interior_sixth}
        />
        <mesh
          geometry={nodes.Object_138.geometry}
          material={materials.interior_sixth}
        />
        <mesh
          geometry={nodes.Object_139.geometry}
          material={materials.interior_sixth}
        />
        <mesh
          geometry={nodes.Object_140.geometry}
          material={materials.interior_sixth}
        />
        <mesh
          geometry={nodes.Object_141.geometry}
          material={materials.interior_sixth}
        />
        <mesh
          geometry={nodes.Object_142.geometry}
          material={materials.interior_sixth}
        />
        <mesh
          geometry={nodes.Object_143.geometry}
          material={materials.interior_third}
        />
        <mesh
          geometry={nodes.Object_144.geometry}
          material={materials.interior_third}
        />
        <mesh
          geometry={nodes.Object_145.geometry}
          material={materials.interior_third}
        />
        <mesh
          geometry={nodes.Object_146.geometry}
          material={materials.orangeglass}
        />
        <mesh
          geometry={nodes.Object_147.geometry}
          material={materials.orangeglass}
        />
        <mesh
          geometry={nodes.Object_148.geometry}
          material={materials.orangeglass}
        />
        <mesh
          geometry={nodes.Object_149.geometry}
          material={materials.redglass}
        />
        <mesh
          geometry={nodes.Object_150.geometry}
          material={materials.redglass}
        />
        <mesh
          geometry={nodes.Object_151.geometry}
          material={materials.redglass}
        />
        <mesh
          geometry={nodes.Object_152.geometry}
          material={materials.redglass}
        />
        <mesh
          geometry={nodes.Object_153.geometry}
          material={materials.redglass}
        />
        <mesh
          geometry={nodes.Object_154.geometry}
          material={materials.redglass}
        />
        <mesh
          geometry={nodes.Object_155.geometry}
          material={materials.redglass}
        />
        <mesh
          geometry={nodes.Object_156.geometry}
          material={materials.redglass}
        />
        <mesh
          geometry={nodes.Object_157.geometry}
          material={materials.redglass}
        />
        <mesh
          geometry={nodes.Object_158.geometry}
          material={materials.redglass}
        />
        <mesh
          geometry={nodes.Object_159.geometry}
          material={materials.redglass}
        />
        <mesh
          geometry={nodes.Object_160.geometry}
          material={materials.redglass}
        />
        <mesh
          geometry={nodes.Object_161.geometry}
          material={materials.rim_second}
        />
        <mesh
          geometry={nodes.Object_162.geometry}
          material={materials.rim_second}
        />
        <mesh
          geometry={nodes.Object_163.geometry}
          material={materials.rim_second}
        />
        <mesh
          geometry={nodes.Object_164.geometry}
          material={materials.rim_second}
        />
        <mesh geometry={nodes.Object_165.geometry} material={materials.tire} />
        <mesh geometry={nodes.Object_166.geometry} material={materials.tire} />
        <mesh geometry={nodes.Object_167.geometry} material={materials.tire} />
        <mesh geometry={nodes.Object_168.geometry} material={materials.tire} />
        <mesh geometry={nodes.Object_169.geometry} material={materials.tire} />
        <mesh geometry={nodes.Object_170.geometry} material={materials.tire} />
        <mesh geometry={nodes.Object_171.geometry} material={materials.tire} />
        <mesh geometry={nodes.Object_172.geometry} material={materials.tire} />
        <mesh geometry={nodes.Object_173.geometry} material={materials.tire} />
        <mesh geometry={nodes.Object_174.geometry} material={materials.tire} />
        <mesh geometry={nodes.Object_175.geometry} material={materials.tire} />
        <mesh geometry={nodes.Object_176.geometry} material={materials.tire} />
        <mesh geometry={nodes.Object_177.geometry} material={materials.tire} />
        <mesh geometry={nodes.Object_178.geometry} material={materials.tire} />
        <mesh geometry={nodes.Object_179.geometry} material={materials.tire} />
        <mesh geometry={nodes.Object_180.geometry} material={materials.tire} />
        <mesh geometry={nodes.Object_181.geometry} material={materials.tire} />
        <mesh geometry={nodes.Object_182.geometry} material={materials.tire} />
        <mesh geometry={nodes.Object_183.geometry} material={materials.tire} />
        <mesh geometry={nodes.Object_184.geometry} material={materials.tire} />
        <mesh geometry={nodes.Object_185.geometry} material={materials.tire} />
        <mesh geometry={nodes.Object_186.geometry} material={materials.tire} />
        <mesh geometry={nodes.Object_187.geometry} material={materials.tire} />
        <mesh geometry={nodes.Object_188.geometry} material={materials.tire} />
        <mesh geometry={nodes.Object_189.geometry} material={materials.white} />
        <mesh geometry={nodes.Object_190.geometry} material={materials.white} />
        <mesh geometry={nodes.Object_191.geometry} material={materials.white} />
        <mesh
          geometry={nodes.Object_192.geometry}
          material={materials.windowglass}
        />
        <mesh
          geometry={nodes.Object_193.geometry}
          material={materials.windowglass}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/cars/car1/car1.gltf");
