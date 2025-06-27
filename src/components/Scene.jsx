import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useState, useMemo, useCallback } from "react";
import { OrbitControls } from "@react-three/drei";
import { Suspense, lazy } from "react";
import * as THREE from "three";

const MainCar = lazy(() => import("./Car"));
const MainCar2 = lazy(() => import("./Car2"));
const MainCar3 = lazy(() => import("./Car3"));
const MainCar4 = lazy(() => import("./Car4"));
const MainCar5 = lazy(() => import("./Car5"));

import City from "./City";
import Car1 from "./Cars/Car1.jsx";
import Car2 from "./Cars/Car2.jsx";
import Car3 from "./Cars/Car3.jsx";
import Car4 from "./Cars/Car4.jsx";
import Car5 from "./Cars/Car5.jsx";

export const CARS_CONFIG = {
  spawnInterval: [2, 8], // Min and max seconds between spawns
  positions: [
    {
      z: 2.7,
      model: "Car1",
      rotation: [0, Math.PI / 2, 0],
      speed: 150,
    },
    {
      z: 2.4,
      model: "Car2",
      rotation: [0, Math.PI / 2, 0],
      speed: 160,
    },
    {
      z: 3,
      model: "Car3",
      rotation: [0, Math.PI / 2, 0],
      speed: 140,
    },
    {
      z: 2.7,
      model: "Car4",
      rotation: [0, Math.PI / 2, 0],
      speed: 155,
    },
    {
      z: 2.8,
      model: "Car5",
      rotation: [0, Math.PI / 2, 0],
      speed: 145,
    },
  ],
  startX: -400, // Where cars spawn from (left side)
  endX: 150, // Where cars disappear (right side)
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

export function Scene({
  lightColor,
  play,
  instruments,
  currentCarIndex,
  lastPausedPosition,
}) {
  const { camera } = useThree();
  const groupRef = useRef();
  const currentSpeedRef = useRef(0);
  const startTimeRef = useRef(null);
  const shakeIntensity = useRef(0);
  const controlsRef = useRef();
  const lastPositionRef = useRef(null);

  // State for spawned cars with object pooling
  const [oppositeCars, setOppositeCars] = useState([]);
  const lastSpawnTime = useRef(0);
  const carPool = useRef(new Map());
  const poolSize = 20;

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
        currentSpeedRef.current +=
          (targetSpeed - currentSpeedRef.current) *
          MOVEMENT_CONFIG.acceleration *
          0.016;
        const { startPosition, endPosition } = MOVEMENT_CONFIG.loop;
        const totalDistance = endPosition - startPosition;
        const playingTime = clock.getElapsedTime() - startTimeRef.current;
        const time = playingTime * currentSpeedRef.current;
        const position = time % totalDistance;
        groupRef.current.position.x =
          (lastPositionRef.current || startPosition) + position;

        if (groupRef.current.position.x >= endPosition) {
          groupRef.current.position.x = startPosition;
          lastPositionRef.current = null;
        }
      }
    };

    updatePosition();

    // Camera shake logic
    if (instruments && instruments[1] && instruments[1].shakeTrigger) {
      shakeIntensity.current = 0.1;
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

    // Optimized opposite cars logic with object pooling
    const now = clock.getElapsedTime();
    const deltaTime = 0.016;

    if (
      now - lastSpawnTime.current >
      getRandomBetween(...CARS_CONFIG.spawnInterval)
    ) {
      if (oppositeCars.length < poolSize) {
        const randomCarConfig =
          CARS_CONFIG.positions[
            Math.floor(Math.random() * CARS_CONFIG.positions.length)
          ];
        setOppositeCars((prev) => [
          ...prev,
          {
            id: now,
            model: randomCarConfig.model,
            position: [CARS_CONFIG.startX, -1, randomCarConfig.z],
            speed: randomCarConfig.speed,
            rotation: randomCarConfig.rotation,
          },
        ]);
      }
      lastSpawnTime.current = now;
    }

    setOppositeCars((prev) => {
      const updated = [];
      for (let i = 0; i < prev.length; i++) {
        const car = prev[i];
        const newX = car.position[0] + car.speed * deltaTime;
        if (newX < CARS_CONFIG.endX) {
          updated.push({
            ...car,
            position: [newX, car.position[1], car.position[2]],
          });
        }
      }
      return updated;
    });
  });

  return (
    <>
      <pointLight
        position={[-50, 5, 50]}
        intensity={10}
        color="#9933ff"
        distance={200}
        decay={2}
      />

      <Suspense fallback={null}>
        {currentCarIndex % 5 === 0 && (
          <MainCar
            position={[0, 0, -5]}
            rotation={[0, -Math.PI / 2, 0]}
            lightColor={lightColor}
          />
        )}
        {currentCarIndex % 5 === 1 && (
          <MainCar2
            position={[0, 0, -5]}
            rotation={[0, -Math.PI / 2, 0]}
            lightColor={lightColor}
          />
        )}
        {currentCarIndex % 5 === 2 && (
          <MainCar3
            position={[0, 0, -5]}
            rotation={[0, -Math.PI / 2, 0]}
            lightColor={lightColor}
          />
        )}
        {currentCarIndex % 5 === 3 && (
          <MainCar5
            position={[0, -1, -5]}
            rotation={[0, -Math.PI / 2, 0]}
            lightColor={lightColor}
          />
        )}
        {currentCarIndex % 5 === 4 && (
          <MainCar4
            position={[0, -0.6, -5]}
            rotation={[0, -Math.PI / 2, 0]}
            lightColor={lightColor}
          />
        )}
      </Suspense>

      <group ref={groupRef}>
        {CITIES_CONFIG.map((city, index) => (
          <City
            key={index}
            scale={0.01}
            position={city.position}
            rotation={[0, 0, 0]}
          />
        ))}
      </group>

      <OrbitControls
        position={[0, 0, 10]}
        target={[-3, 0, -5]}
        enablePan={false}
      />

      {oppositeCars.map((car) => {
        const CarComponent = { Car1, Car2, Car3, Car4, Car5 }[car.model];
        return (
          <CarComponent
            key={car.id}
            position={car.position}
            rotation={car.rotation}
          />
        );
      })}
    </>
  );
}

// Helper function to get random number between min and max
function getRandomBetween(min, max) {
  return Math.random() * (max - min) + min;
}
