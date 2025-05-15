import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useState } from "react";
import { OrbitControls } from "@react-three/drei";
import { Suspense, lazy } from "react";

const MainCar = lazy(() => import("./Car"));
const MainCar2 = lazy(() => import("./Car2"));
const MainCar3 = lazy(() => import("./Car3"));

import City from "./City";
import Car1 from "./Cars/Car1.jsx";
import Car2 from "./Cars/Car2.jsx";
import Car3 from "./Cars/Car3.jsx";
import Car4 from "./Cars/Car4.jsx";


export const CARS_CONFIG = {
  spawnInterval: [2, 8], // Min and max seconds between spawns
  speed: 150,
  positions: [
    {
      z: 2.7,
      model: "Car1",
      rotation: [0, Math.PI / 2, 0],
    },
    {
      z: 2.4,
      model: "Car2",
      rotation: [0, Math.PI / 2, 0],
    },
    {
      z: 3,
      model: "Car4",
      rotation: [0, Math.PI / 2, 0],
    },
    {
      z: 2.7,
      model: "Car4",
      rotation: [0, Math.PI / 2, 0],
    },
  ],
  startX: -400, // Where cars spawn from (left side)
  endX: 150, // Where cars disappear (right side)
};

// Constants
const CAMERA_CONFIG = {
  target: [-4, 1, -2],
  distance: 30,
  rotationSpeed: 0.1, // Controls the overall rotation speed
  limits: {
    azimuth: {
      min: -Math.PI / 2.5,
      max: Math.PI / 1.4,
    },
    polar: {
      min: Math.PI / 3,
      max: Math.PI / 2,
    },
  },
};

const MOVEMENT_CONFIG = {
  acceleration: 0.08,
  targetSpeed: 80,
  loop: {
    startPosition: -80,
    endPosition: 385,
  },
};

const CITIES_CONFIG = [
  { position: [-485, -1.14, 70] },
  { position: [-20, -0.9, 70] },
  { position: [445, -0.695, 70] },
  { position: [820, -0.67, 70] },
];

export function Scene({ lightColor, play, instruments, currentCarIndex, lastPausedPosition }) {
  const { camera } = useThree();
  const groupRef = useRef();
  const currentSpeedRef = useRef(0);
  const startTimeRef = useRef(null);
  const shakeIntensity = useRef(0);
  const controlsRef = useRef();
  const lastPositionRef = useRef(null);

  // State for spawned cars
  const [oppositeCars, setOppositeCars] = useState([]);
  const lastSpawnTime = useRef(0);

  const targetSpeed = play ? MOVEMENT_CONFIG.targetSpeed : 0;

  useFrame(({ clock }) => {
    const updatePosition = () => {
      if (!groupRef.current) return;

      if (groupRef.current.position.x === 0) {
        groupRef.current.position.x = MOVEMENT_CONFIG.loop.startPosition;
      }

      if (!play && startTimeRef.current !== null) {
        const currentPosition = groupRef.current.position.x;
        lastPositionRef.current = currentPosition;
        startTimeRef.current = null;
        currentSpeedRef.current = 0;
        groupRef.current.position.x = currentPosition;
        lastPausedPosition.current = currentPosition;
        return;
      }

      if (play && startTimeRef.current === null) {
        startTimeRef.current = clock.getElapsedTime();
        if (lastPositionRef.current !== null) {
          groupRef.current.position.x = lastPositionRef.current;
        } else if (lastPausedPosition.current !== null) {
          groupRef.current.position.x = lastPausedPosition.current;
        }
      }

      if (play) {
        currentSpeedRef.current += (targetSpeed - currentSpeedRef.current) * MOVEMENT_CONFIG.acceleration * 0.016;
        const { startPosition, endPosition } = MOVEMENT_CONFIG.loop;
        const totalDistance = endPosition - startPosition;
        const playingTime = clock.getElapsedTime() - startTimeRef.current;
        const time = playingTime * currentSpeedRef.current;
        const position = time % totalDistance;
        groupRef.current.position.x = (lastPositionRef.current || startPosition) + position;

        if (groupRef.current.position.x >= endPosition) {
          groupRef.current.position.x = startPosition;
          lastPositionRef.current = null;
        }
      }
    };

    updatePosition();

    // Camera shake logic
    if (instruments && instruments[1] && instruments[1].shakeTrigger) {
      shakeIntensity.current = 0.5;
    }
    if (shakeIntensity.current > 0) {
      const shakeX = (Math.random() - 0.5) * shakeIntensity.current;
      const shakeY = (Math.random() - 0.5) * shakeIntensity.current;
      camera.position.x += shakeX;
      camera.position.y += shakeY;
      shakeIntensity.current *= 0.9;
      if (shakeIntensity.current < 0.01) shakeIntensity.current = 0;
    }

    // Make sure controls are updated
    if (controlsRef.current) {
      controlsRef.current.update();
    }

    // Opposite cars logic
    const now = clock.getElapsedTime();
    if (now - lastSpawnTime.current > getRandomBetween(...CARS_CONFIG.spawnInterval)) {
      const randomCarConfig = CARS_CONFIG.positions[Math.floor(Math.random() * CARS_CONFIG.positions.length)];
      const speed = CARS_CONFIG.speed;
      setOppositeCars((prev) => [
        ...prev,
        {
          id: now,
          model: randomCarConfig.model,
          position: [CARS_CONFIG.startX, -1, randomCarConfig.z],
          speed: speed,
          rotation: randomCarConfig.rotation,
        },
      ]);
      lastSpawnTime.current = now;
    }

    setOppositeCars((prev) =>
      prev.map((car) => ({
        ...car,
        position: [car.position[0] + car.speed * 0.016, car.position[1], car.position[2]],
      })).filter((car) => car.position[0] < CARS_CONFIG.endX)
    );
  });

  return (
    <>
      <pointLight position={[-50, 5, 50]} intensity={10} color="#9933ff" distance={200} decay={2} />

      <Suspense fallback={null}>
        {currentCarIndex === 0 && (
          <MainCar
            position={[0, 0, -5]}
            rotation={[0, -Math.PI / 2, 0]}
            lightColor={lightColor}
          />
        )}
        {currentCarIndex === 1 && (
          <MainCar2
            position={[0, 0, -5]}
            rotation={[0, -Math.PI / 2, 0]}
            lightColor={lightColor}
          />
        )}
        {currentCarIndex === 2 && (
          <MainCar3
            position={[0, 0, -5]}
            rotation={[0, -Math.PI / 2, 0]}
            lightColor={lightColor}
          />
        )}
      </Suspense>


      <group ref={groupRef}>
        {CITIES_CONFIG.map((city, index) => (
          <City key={index} scale={0.01} position={city.position} rotation={[0, 0, 0]} />
        ))}
      </group>

      <OrbitControls
        position={[0, 0, 10]}
        target={[-3, 0, -5]}
        enablePan={false}
      />

      {oppositeCars.map((car) => {
        const CarComponent = { Car1, Car2, Car3, Car4 }[car.model];
        return <CarComponent key={car.id} position={car.position} rotation={car.rotation} />;
      })}
    </>
  );
}

// Helper function to get random number between min and max
function getRandomBetween(min, max) {
  return Math.random() * (max - min) + min;
}
