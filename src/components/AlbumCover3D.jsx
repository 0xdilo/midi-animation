import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { TextureLoader } from "three";


export default function AlbumCover3D({ onClick }) {
  const ref = useRef();
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const rotation = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });

  const loader = new TextureLoader();
  const texture = loader.load("/00-COVER.jpeg");

  const handlePointerDown = (event) => {
    isDragging.current = true;
    velocity.current = { x: 0, y: 0 };
    previousMousePosition.current = {
      x: event.clientX || (event.touches && event.touches[0].clientX),
      y: event.clientY || (event.touches && event.touches[0].clientY),
    };
    event.target.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (!isDragging.current) return;

    const currentX =
      event.clientX || (event.touches && event.touches[0].clientX);
    const currentY =
      event.clientY || (event.touches && event.touches[0].clientY);

    const deltaX = currentX - previousMousePosition.current.x;
    const deltaY = currentY - previousMousePosition.current.y;

    velocity.current.x = deltaY * 0.01;
    velocity.current.y = deltaX * 0.01;

    rotation.current.y += velocity.current.y;
    rotation.current.x += velocity.current.x;

    previousMousePosition.current = { x: currentX, y: currentY };
  };

  const handlePointerUp = (event) => {
    isDragging.current = false;
    event.target.releasePointerCapture(event.pointerId);
    if (onClick) {
      onClick();
    }
  };

  useFrame((state, delta) => {
    if (ref.current) {
      if (!isDragging.current) {
        // Apply inertia
        velocity.current.x *= 0.95;
        velocity.current.y *= 0.95;

        // Add eternal rotation
        const eternalRotation = delta * 0.5;

        // Apply inertia rotation
        rotation.current.x += velocity.current.x;
        rotation.current.y += velocity.current.y + eternalRotation;
      }
      ref.current.rotation.x = rotation.current.x;
      ref.current.rotation.y = rotation.current.y;
      ref.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  return (
    <group ref={ref}>
      <mesh
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <boxGeometry args={[4, 4, 0.05]} />
        <meshBasicMaterial map={texture} transparent opacity={0.99} />
      </mesh>
    </group>
  );
}

