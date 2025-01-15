import { Canvas, useLoader, useFrame, useThree } from "@react-three/fiber";
import Car from "../components/Car"
import City from "../components/City"
import { OrbitControls } from '@react-three/drei'
import { useRef, useState, useEffect, useCallback } from 'react'
import io from 'socket.io-client';
import * as THREE from 'three'
import { UnrealBloomPass } from 'three-stdlib'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass'

const lightColors = [
  "#FF1493",
  "#00FF7F", 
  "#FF4500",
  "#1E90FF",
  "#FFD700",
  "#FF00FF",
  "#00FFFF",
  "#9400D3"
];

function Effects() {
  const { gl, scene, camera } = useThree();
  const composer = useRef();

  useEffect(() => {
    if (!gl || !scene || !camera) return;

    const effectComposer = new EffectComposer(gl);
    effectComposer.setSize(window.innerWidth, window.innerHeight);

    const renderPass = new RenderPass(scene, camera);
    effectComposer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.5,
      0.4,
      0.85
    );
    effectComposer.addPass(bloomPass);

    const filmPass = new FilmPass(
      1.35,
      0.025,
      648,
      false
    );
    effectComposer.addPass(filmPass);

    composer.current = effectComposer;
    
    const handleResize = () => {
      effectComposer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      effectComposer.dispose();
    };
  }, [gl, scene, camera]);

  useFrame((state) => {
    if (composer.current) {
      composer.current.render();
    }
  }, 1);

  return null;
}

function Scene({ instruments = {}, lightColor, setLightColor, cameraMode, play }) {
  const carRef = useRef();
  const cameraRef = useRef();
  const targetPositionRef = useRef(new THREE.Vector3(-35, 35, 85));
  const targetLookAtRef = useRef(new THREE.Vector3(-4, 2, 0));
  const timeoutRef = useRef(null);
  
  const generateNewCameraTarget = () => {
    const azimuth = THREE.MathUtils.lerp(-Math.PI / 1.89, Math.PI / 2.5, Math.random());
    const polar = THREE.MathUtils.lerp(Math.PI / 3, Math.PI / 2.2, Math.random());
    const distance = THREE.MathUtils.lerp(15, 25, Math.random());
    
    const x = distance * Math.sin(polar) * Math.cos(azimuth);
    const y = distance * Math.cos(polar);
    const z = distance * Math.sin(polar) * Math.sin(azimuth);
    
    targetPositionRef.current = new THREE.Vector3(x, y, z);
    
    targetLookAtRef.current = new THREE.Vector3(
      THREE.MathUtils.lerp(-6, -2, Math.random()),
      THREE.MathUtils.lerp(1, 3, Math.random()),
      THREE.MathUtils.lerp(-1, 1, Math.random())
    );
    
    timeoutRef.current = setTimeout(generateNewCameraTarget, THREE.MathUtils.lerp(5000, 8000, Math.random()));
  };
  
  useEffect(() => {
    generateNewCameraTarget();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useFrame(({ camera, clock }) => {
    if (!carRef.current) return;
    
    const time = clock.getElapsedTime();
    
    const midiIntensity = Math.min(
      Object.values(instruments).reduce((sum, inst) => sum + (inst.value - 1), 0),
      1.5
    );

    if (cameraMode === 'chase') {
      const idealOffset = new THREE.Vector3(-20, 15, 0);
      const idealLookat = new THREE.Vector3(10, 0, 0);
      
      idealOffset.y += Math.sin(time * 2) * midiIntensity * 4;
      idealOffset.x -= midiIntensity * 10;
      
      camera.position.lerp(idealOffset, 0.05);
      camera.lookAt(idealLookat);
      
      camera.rotation.z = Math.sin(time) * 0.1 * midiIntensity;
    } else if (cameraMode === 'normal') {
      const smoothness = 0.005;
      
      camera.position.lerp(targetPositionRef.current, smoothness);
      
      const currentLookAt = new THREE.Vector3();
      currentLookAt.copy(camera.position).add(camera.getWorldDirection(new THREE.Vector3()));
      
      currentLookAt.lerp(targetLookAtRef.current, smoothness);
      camera.lookAt(currentLookAt);
      
      const floatY = Math.sin(time * 0.5) * 0.2;
      const floatX = Math.cos(time * 0.3) * 0.2;
      camera.position.y += floatY;
      camera.position.x += floatX;
    }
  });
  useEffect(() => {
    console.log("🎮 Current State:", {
      track0: instruments[0],
      track1: instruments[1],
      cameraMode,
      lightColor
    });
  }, [instruments, cameraMode, lightColor]);

  const groupRef = useRef();
  const currentSpeedRef = useRef(0);
  const targetSpeed = play ? 80 : 0;
  const acceleration = 0.08;
  
  const loopConfig = {
    startPosition: -80,
    endPosition: 385,
    speed: currentSpeedRef.current
  };

  useFrame(({ clock }) => {
    if (groupRef.current) {
      currentSpeedRef.current += (targetSpeed - currentSpeedRef.current) * acceleration * 0.016;
      
      const totalDistance = loopConfig.endPosition - loopConfig.startPosition;
      const time = clock.getElapsedTime() * currentSpeedRef.current;
      
      const position = time % totalDistance;
      
      groupRef.current.position.x = loopConfig.startPosition + position;
      
      if (groupRef.current.position.x >= loopConfig.endPosition) {
        groupRef.current.position.x = loopConfig.startPosition;
      }
    }
  });

  return (
    <>
      <directionalLight
        position={[-50, 20, 50]}
        intensity={2.5}
        color="#eeaf61"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={200}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      
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
        onLightColorChange={(color) => console.log("🚗 Car received new light color:", color)}
      />
      <group ref={groupRef}>
        <City 
          scale={0.01} 
          position={[-485, -1.14 , 70]} 
          rotation={[0,0,0]}
        />
        <City 
          scale={0.01}  
          position={[-20, -0.9, 70]} 
          rotation={[0,0,0]}
        />
        <City 
          scale={0.01} 
          position={[445, -0.695, 70]} 
          rotation={[0,0,0]}
        />
        <City 
          scale={0.01} 
          position={[820, -0.67, 70]} 
          rotation={[0,0,0]}
        />
      </group>
      {cameraMode === 'normal' && (
        <OrbitControls 
          enablePan={true} 
          enableZoom={true} 
          enableRotate={true}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2.2}
          minAzimuthAngle={-Math.PI / 1.89}
          maxAzimuthAngle={Math.PI / 2.5}
          minDistance={10}
          maxDistance={30}
          target={[-4, 1, -2]}
        />
      )}
    </>
  )
}

export default function Home() {
  const [socket, setSocket] = useState(null);
  const [play, setPlay] = useState(false);
  const [instruments, setInstruments] = useState({
    0: { value: 1 },
    1: { value: 1 }
  });
  const [lightColor, setLightColor] = useState('#ffffff');
  const [cameraMode, setCameraMode] = useState('normal');
  const [menuOpen, setMenuOpen] = useState(false);
  
  const audioRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    console.log("Initializing socket connection...");
    fetch('/api/socket');
    const sock = io();
    setSocket(sock);
    
    sock.on('connect', () => {
      console.log("Socket Connected ✅");
    });

    sock.on('connect_error', (error) => {
      console.error("Socket Connection Error ❌:", error);
    });

    sock.on('error', (error) => {
      console.error("Socket Error ❌:", error);
    });
    
    sock.on('midiEvent', (event) => {
      const currentTime = Date.now() - startTimeRef.current;
      const delay = event.time - currentTime;

      setTimeout(() => {
        handleMidiEvent(event);
      }, Math.max(0, delay));
    });
    
    return () => {
      if (sock) sock.disconnect();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  const handleMidiEvent = (event) => {
    console.log("🎹 MIDI Event:", {
      data: event,
      timestamp: new Date().toISOString()
    });
    
    const track = event.track % 2;
    const isNoteOn = event.name === 'Note on';

    if (isNoteOn) {
      if (track === 0) {
        const randomColor = lightColors[Math.floor(Math.random() * lightColors.length)];
        console.log("💡 Track 0 - Changing light to:", randomColor);
        setLightColor(randomColor);
      } else if (track === 1) {
        console.log("🎥 Track 1 - Activating chase camera");
        setCameraMode('chase');
      }
    } else {
      if (track === 1) {
        console.log("🎥 Track 1 - Returning to normal camera");
        setCameraMode('normal');
      }
    }

    setInstruments(prev => ({
      ...prev,
      [track]: {
        value: isNoteOn ? 2 : 1,
        noteOn: isNoteOn
      }
    }));
  };

  const handleStart = useCallback(() => {
    console.log("🎮 Start Button Clicked");
    
    if (!socket?.connected) {
      console.error("❌ Socket not connected! Current socket state:", {
        socket: socket,
        connected: socket?.connected
      });
      return;
    }
    
    audioRef.current = new Audio('/traccia.mp3');
    audioRef.current.volume = 0.8;
    
    console.log("🚀 Emitting start event");
    startTimeRef.current = Date.now();
    socket.emit("start");
    
    audioRef.current.play()
      .then(() => {
        console.log("🎵 Audio started");
        setPlay(true);
      })
      .catch(error => {
        console.error("Audio playback error:", error);
        setPlay(false);
      });
  }, [socket]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(rgba(0,0,0,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.2) 1px, transparent 1px)',
        backgroundSize: '2px 2px',
        pointerEvents: 'none',
        zIndex: 15,
      }}/>

      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 20,
      }}>
        <img 
          src="/logo.webp" 
          alt="Logo" 
          style={{
            width: '120px',
            height: 'auto',
            filter: 'drop-shadow(2px 2px 0px #000) drop-shadow(-2px -2px 0px #000)',
          }}
        />
      </div>

      {play && (
        <button
          onClick={() => setMenuOpen(prev => !prev)}
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 30,
            padding: '15px 30px',
            background: 'rgba(0,0,0,0.7)',
            border: '2px solid #fff',
            color: '#fff',
            fontFamily: '"Press Start 2P", cursive',
            fontSize: '24px',
            cursor: 'pointer', 
            opacity: menuOpen ? 0 : 1,
            transition: 'all 0.3s ease',
            textShadow: '2px 2px 0px #000',
            animation: menuOpen ? 'none' : 'blink 1s infinite',
          }}
        >
          SYSTEM MENU
        </button>
      )}

      <div style={{
        position: 'absolute',
        bottom: 0,
        left: '50%',
        transform: `translateX(-50%) translateY(${menuOpen ? '0' : '100%'})`,
        zIndex: 25,
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.85)',
        transition: 'transform 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <div style={{
          textAlign: 'center',
        }}>
          <h2 style={{
            color: '#fff',
            fontFamily: '"Press Start 2P", cursive',
            fontSize: '40px',
            textShadow: '4px 4px 0px #accbf1',
            marginBottom: '50px'
          }}>
            SYSTEM MENU
          </h2>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}>
            {[
              { name: 'GITHUB', url: '#' },
              { name: 'TWITTER', url: '#' },
              { name: 'PORTFOLIO', url: '#' }
            ].map((item, index) => (
              <a
                key={item.name}
                href={item.url}
                style={{
                  display: 'block',
                  padding: '20px 40px',
                  color: '#fff',
                  textDecoration: 'none',
                  fontFamily: '"Press Start 2P", cursive',
                  fontSize: '24px',
                  textShadow: '2px 2px 0px #000',
                  transition: 'all 0.2s ease',
                  transform: 'scale(1)',
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#accbf1';
                  e.target.style.transform = 'scale(1.1)';
                  e.target.style.textShadow = '4px 4px 0px #000';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#fff';
                  e.target.style.transform = 'scale(1)';
                  e.target.style.textShadow = '2px 2px 0px #000';
                }}
              >
                {`> ${item.name}`}
              </a>
            ))}
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            style={{
              marginTop: '50px',
              background: 'none',
              border: 'none',
              color: '#fff',
              fontFamily: '"Press Start 2P", cursive',
              fontSize: '20px',
              cursor: 'pointer',
              textShadow: '2px 2px 0px #000',
              animation: 'blink 1s infinite'
            }}
          >
            PRESS TO CLOSE
          </button>
        </div>
      </div>

      {!play && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.85)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 20,
        }}>
          <div style={{
            animation: 'pulse 2s infinite',
            textAlign: 'center'
          }}>
            <h1 style={{
              color: '#fff',
              fontFamily: '"Press Start 2P", cursive',
              fontSize: '40px',
              textShadow: '4px 4px 0px #accbf1',
              marginBottom: '50px'
            }}>
              I DRIVE
            </h1>
            <button
              onClick={handleStart}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                fontFamily: '"Press Start 2P", cursive',
                fontSize: '20px',
                cursor: 'pointer',
                textShadow: '2px 2px 0px #000',
                animation: 'blink 1s infinite'
              }}
            >
              PRESS START BUTTON
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        @keyframes blink {
          0% { opacity: 1; }
          50% { opacity: 0; }
          100% { opacity: 1; }
        }

        @keyframes menuSlide {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        body {
          margin: 0;
          overflow: hidden;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
      <Canvas 
        shadows 
        camera={{ 
          position: [-30, 0, 10],
          fov: 20,
        }}
        style={{
          background: `url('/sunset.jpg') no-repeat center center`,
          backgroundSize: 'cover'
        }}
        gl={{
          powerPreference: "high-performance",
          antialias: false,
          stencil: false,
          depth: false
        }}
      >
        <Scene 
          instruments={instruments} 
          lightColor={lightColor}
          setLightColor={setLightColor}
          cameraMode={cameraMode}
          play={play}
        /> 
        <Effects />
      </Canvas>
    </div>
  )
}
