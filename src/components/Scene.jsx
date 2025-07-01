import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useState, useMemo, useCallback } from "react";
import { OrbitControls } from "@react-three/drei";

import * as THREE from "three";

import MainCar from "./Car";
import MainCar2 from "./Car2";
import MainCar3 from "./Car3";
import MainCar4 from "./Car4";
import MainCar5 from "./Car5";

import City from "./City";

// Function to get available background cars excluding the current main car
const getAvailableBackgroundCars = (currentCarIndex) => {
  const allCars = [
    {
      model: "MainCar",
      component: MainCar,
      z: 2.7,
      speed: 120,
      rotation: [0, Math.PI / 2, 0],
    },
    {
      model: "MainCar2",
      component: MainCar2,
      z: 2.4,
      speed: 130,
      rotation: [0, Math.PI / 2, 0],
    },
    {
      model: "MainCar3",
      component: MainCar3,
      z: 3,
      speed: 125,
      rotation: [0, Math.PI / 2, 0],
    },
    {
      model: "MainCar5",
      component: MainCar5,
      z: 2.6,
      speed: 115,
      rotation: [0, Math.PI / 2, 0],
    },
    {
      model: "MainCar4",
      component: MainCar4,
      z: 2.8,
      speed: 135,
      rotation: [0, Math.PI, 0],
    },
  ];

  // Exclude the current main car (currentCarIndex % 5)
  const activeCarIndex = currentCarIndex % 5;
  return allCars.filter((_, index) => index !== activeCarIndex);
};

export const CARS_CONFIG = {
  spawnInterval: [3, 8], // Min and max seconds between spawns
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

import React, { memo } from "react";

// Memoized background car component for performance
const BackgroundCar = memo(
  ({ CarComponent, position, rotation, lightColor }) => (
    <CarComponent
      position={position}
      rotation={rotation}
      lightColor={lightColor}
      isBackground={true}
    />
  ),
);

export const Scene = memo(function Scene({
  lightColor,
  play,
  instruments,
  currentCarIndex,
  lastPausedPosition,
  isInteracting,
  setIsInteracting,
}) {
  const { camera, clock } = useThree();
  const groupRef = useRef();
  const currentSpeedRef = useRef(0);
  const startTimeRef = useRef(null);
  const shakeIntensity = useRef(0);
  const controlsRef = useRef();
  const lastPositionRef = useRef(null);
  const lastInteractionTime = useRef(null);

  // State for spawned cars with object pooling and performance optimization
  const [oppositeCars, setOppositeCars] = useState([]);
  const lastSpawnTime = useRef(0);
  const lastCarUpdateTime = useRef(0);
  const carPositions = useRef(new Map());
  const poolSize = 20;
  const frameCount = useRef(0);

  const targetSpeed = play ? MOVEMENT_CONFIG.targetSpeed : 0;

  useFrame(({ clock }, deltaTime) => {
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
          deltaTime;
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

    // Automatic camera movement
    if (controlsRef.current && !isInteracting) {
      const elapsedTime = clock.getElapsedTime();
      if (elapsedTime - lastInteractionTime.current > 2) {
        const currentAngle = controlsRef.current.getAzimuthalAngle();
        const targetAngle = Math.sin(elapsedTime * 0.2) * (Math.PI / 8);
        const smoothedAngle =
          currentAngle + (targetAngle - currentAngle) * 0.01;
        controlsRef.current.setAzimuthalAngle(smoothedAngle);

        // Smooth cinematic zoom movement
        const minZoomDistance = controlsRef.current.minDistance;
        const maxZoomDistance = controlsRef.current.maxDistance;

        // Use a very slow, gentle oscillation
        const zoomSpeed = 0.008; // Much much slower
        const zoomPhase = elapsedTime * zoomSpeed;

        // Gentle oscillation around middle distance, staying closer to mid-range
        const midDistance = (minZoomDistance + maxZoomDistance) * 0.5;
        const zoomAmplitude = (maxZoomDistance - minZoomDistance) * 0.15; // Only 15% of range
        const targetDistance =
          midDistance + zoomAmplitude * Math.sin(zoomPhase);

        // Very smooth interpolation
        const currentDistance = camera.position.distanceTo(
          controlsRef.current.target,
        );
        const newDistance = THREE.MathUtils.lerp(
          currentDistance,
          targetDistance,
          0.002,
        ); // Even smoother

        // Apply the new distance
        const direction = camera.position
          .clone()
          .sub(controlsRef.current.target)
          .normalize();
        camera.position
          .copy(controlsRef.current.target)
          .add(direction.multiplyScalar(newDistance));
      }
    }

    // Performance optimized car spawning and updates
    const now = clock.getElapsedTime();
    frameCount.current++;

    // Spawn new cars with low frequency
    if (now - lastSpawnTime.current > 0.1) {
      // Check every 100ms
      if (Math.random() < 0.05 && oppositeCars.length < 3) {
        // Low 5% spawn chance, max 3 cars
        const availableCars = getAvailableBackgroundCars(currentCarIndex);
        const randomCarConfig =
          availableCars[Math.floor(Math.random() * availableCars.length)];

        // Single batched state update
        setOppositeCars((prev) => {
          const cleaned = prev.filter(
            (car) => car.position[0] < CARS_CONFIG.endX,
          );

          return [
            ...cleaned,
            {
              id: Date.now() + Math.random(),
              model: randomCarConfig.model,
              component: randomCarConfig.component,
              position: [CARS_CONFIG.startX, -1, randomCarConfig.z],
              speed: randomCarConfig.speed,
              rotation: randomCarConfig.rotation,
            },
          ];
        });
      }
      lastSpawnTime.current = now;
    }

    // Update car positions every frame for smooth animation
    setOppositeCars((prev) => {
      if (prev.length === 0) return prev; // Skip if no cars

      return prev
        .map((car) => {
          const newX = car.position[0] + car.speed * deltaTime; // Use actual deltaTime for smooth movement
          return {
            ...car,
            position: [newX, car.position[1], car.position[2]],
          };
        })
        .filter((car) => car.position[0] < CARS_CONFIG.endX);
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
          position={[0, -1.1, -5]}
          rotation={[0, -Math.PI * 2, 0]}
          lightColor={lightColor}
        />
      )}

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
        ref={controlsRef}
        position={[0, 0, 10]}
        target={[-3, 0, -5]}
        enablePan={false}
        minDistance={10}
        maxDistance={50}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
        minAzimuthAngle={-Math.PI / 4}
        maxAzimuthAngle={Math.PI / 4}
        onStart={() => {
          setIsInteracting(true);
          lastInteractionTime.current = clock.getElapsedTime();
        }}
        onEnd={() => {
          setIsInteracting(false);
        }}
      />

      {oppositeCars.map((car) =>
        car.component ? (
          <BackgroundCar
            key={car.id}
            CarComponent={car.component}
            position={car.position}
            rotation={car.rotation}
            lightColor={lightColor}
          />
        ) : null,
      )}
    </>
  );
});

// Helper function to get random number between min and max
function getRandomBetween(min, max) {
  return Math.random() * (max - min) + min;
}
