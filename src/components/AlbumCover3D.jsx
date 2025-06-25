import { useFrame } from "@react-three/fiber";
import { Image } from "@react-three/drei";
import { useRef, useState } from "react";

export default function AlbumCover3D({ onClick }) {
  const ref = useRef();
  const [isClicked, setIsClicked] = useState(false);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.5;
      ref.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  const handleClick = () => {
    setIsClicked(true);
    onClick();
  };

  return (
    <group ref={ref} onClick={handleClick}>
      <Image url="/00-COVER.jpeg" scale={[2, 2, 2]} transparent opacity={0.99} />
      <Image url="/00-COVER.jpeg" scale={[2, 2, 2]} rotation-y={Math.PI} transparent opacity={0.99} />
    </group>
  );
}

