import { useFrame } from "@react-three/fiber";
import { useRef } from 'react';
import { OrbitControls } from '@react-three/drei';
import Car from "./Car";
import City from "./City";

// Constants
const CAMERA_CONFIG = {
  target: [-4, 1, -2],
  distance: 30,
  rotationSpeed: 0.1, // Controls the overall rotation speed
  limits: {
    azimuth: {
      min: -Math.PI / 2.5,
      max: Math.PI / 1.4
    },
    polar: {
      min: Math.PI / 3,
      max: Math.PI / 2
    
    }
  
  }
};

const MOVEMENT_CONFIG = {
  acceleration: 0.08,
  targetSpeed: 80,
  loop: {
    startPosition: -80,
    endPosition: 385
  }
};

const CITIES_CONFIG = [
  { position: [-485, -1.14, 70] },
  { position: [-20, -0.9, 70] },
  { position: [445, -0.695, 70] },
  { position: [820, -0.67, 70] }
];

export function Scene({ lightColor, play }) {
  const groupRef = useRef();
  const orbitControlsRef = useRef();
  const currentSpeedRef = useRef(0);
  const startTimeRef = useRef(null);
  const cameraStartTimeRef = useRef(null);
  const initialCameraRef = useRef({ azimuth: 0, polar: CAMERA_CONFIG.limits.polar.min });
  
  const targetSpeed = play ? MOVEMENT_CONFIG.targetSpeed : 0;

  useFrame(({ clock }) => {
// Handle camera rotation
if (orbitControlsRef.current) {
  // Store initial camera angles when component mounts
  if (!initialCameraRef.current.isSet) {
    initialCameraRef.current.azimuth = orbitControlsRef.current.getAzimuthalAngle();
    initialCameraRef.current.polar = orbitControlsRef.current.getPolarAngle();
    initialCameraRef.current.isSet = true;
  }

  if (!play) {
    // When not playing, reset to initial position
    cameraStartTimeRef.current = null;
    orbitControlsRef.current.setAzimuthalAngle(initialCameraRef.current.azimuth);
    orbitControlsRef.current.setPolarAngle(initialCameraRef.current.polar);
    return;
  }

  // Start rotation when play becomes true
  if (play && cameraStartTimeRef.current === null) {
    cameraStartTimeRef.current = clock.getElapsedTime();
  
  }

  if (play) {
    const t = (clock.getElapsedTime() - cameraStartTimeRef.current) * CAMERA_CONFIG.rotationSpeed;
    
    // Calculate smooth azimuth rotation starting from initial position
    const azimuthRange = CAMERA_CONFIG.limits.azimuth.max;
    const azimuthOffset = Math.sin(t) * (azimuthRange); 
    const azimuth = initialCameraRef.current.azimuth + azimuthOffset;
    
    // Calculate smooth polar angle starting from initial position
    const polarRange = CAMERA_CONFIG.limits.polar.max;
    const polarOffset = Math.sin(t) * (polarRange);
    const polar = initialCameraRef.current.polar + polarOffset;
    
    // Calculate smooth distance variation
    const distanceBase = CAMERA_CONFIG.distance;
    const distance = distanceBase + 
      Math.sin(t * 0.19) * 1.5 + 
      Math.sin(t * 0.07) * 0.5;
    
    orbitControlsRef.current.setAzimuthalAngle(azimuth);
    orbitControlsRef.current.setPolarAngle(polar);
    orbitControlsRef.current.minDistance = distance;
    orbitControlsRef.current.maxDistance = distance;
  }
}

    const updatePosition = () => {
      if (!groupRef.current) return;
      
      if (play && startTimeRef.current === null) {
        startTimeRef.current = clock.getElapsedTime();
      } else if (!play) {
        startTimeRef.current = null;
        currentSpeedRef.current = 0;
        return;
      }
      
      if (play) {
        currentSpeedRef.current += (targetSpeed - currentSpeedRef.current) * MOVEMENT_CONFIG.acceleration * 0.016;
      
      const { startPosition, endPosition } = MOVEMENT_CONFIG.loop;
      const totalDistance = endPosition - startPosition;
      const playingTime = clock.getElapsedTime() - startTimeRef.current;
      const time = playingTime * currentSpeedRef.current;
      
      const position = time % totalDistance;
      groupRef.current.position.x = startPosition + position;
      
      if (groupRef.current.position.x >= endPosition) {
        groupRef.current.position.x = startPosition;
      }
      }
    };

    
    updatePosition();
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

      <Car 
        position={[0, 0, -5]} 
        rotation={[0, 0 - Math.PI / 2, 0]} 
        lightColor={lightColor} 
      />
      
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
        ref={orbitControlsRef}
        enablePan={false} 
        enableZoom={true}
        enableRotate={false}
        minPolarAngle={CAMERA_CONFIG.limits.polar.min}
        maxPolarAngle={CAMERA_CONFIG.limits.polar.max}
        minAzimuthAngle={CAMERA_CONFIG.limits.azimuth.min}
        maxAzimuthAngle={CAMERA_CONFIG.limits.azimuth.max}
        minDistance={15}
        maxDistance={30}
        target={CAMERA_CONFIG.target}
      />
    </>
  );
}
