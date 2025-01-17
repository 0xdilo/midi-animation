// pages/index.js
import { Canvas } from "@react-three/fiber";
import { useState, useRef, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import { Effects } from '../components/Effects';
import { Scene } from '../components/Scene';

// Scene colors and their complementary directional light colors
const colorPairs = [
  { scene: "#FF1493", light: "#00EB6C" },  // Deep pink & Spring green
  { scene: "#00FF7F", light: "#FF0080" },  // Spring green & Deep pink
  { scene: "#FF4500", light: "#00BAFF" },  // Orange red & Deep sky blue
  { scene: "#1E90FF", light: "#E16F00" },  // Dodger blue & Dark orange
  { scene: "#FFD700", light: "#0028FF" },  // Gold & Blue
  { scene: "#FF00FF", light: "#00FF00" },  // Magenta & Lime
  { scene: "#00FFFF", light: "#FF0000" },  // Cyan & Red
  { scene: "#9400D3", light: "#6BFF2C" }   // Dark violet & Lime green
];

export default function Home() {
  const [socket, setSocket] = useState(null);
  const [play, setPlay] = useState(false);
  const [instruments, setInstruments] = useState({
    0: { value: 1 },
    1: { value: 1 }
  });
  const [lightColor, setLightColor] = useState('#ffffff');
  const [menuOpen, setMenuOpen] = useState(false);
  
  const audioRef = useRef(null);
  const startTimeRef = useRef(null);

  // Socket initialization
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

  // MIDI event handler
  const handleMidiEvent = (event) => {
    console.log("🎹 MIDI Event:", {
      data: event,
      timestamp: new Date().toISOString()
    });
    
    const track = event.track % 2;
    const isNoteOn = event.name === 'Note on';

    if (isNoteOn) {
      if (track === 0) {
        const randomPair = colorPairs[Math.floor(Math.random() * colorPairs.length)];
        console.log("💡 Track 0 - Changing colors:", randomPair);
        setLightColor({
          scene: randomPair.scene,
          directional: randomPair.light
        });
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

  // Start button handler
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
      {/* Grid Overlay */}
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

      {/* Logo */}
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
          MENU
        </button>
      )}

      {/* Menu Overlay */}
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
        <div style={{ textAlign: 'center' }}>
          <h2 style={{
            color: '#fff',
            fontFamily: '"Press Start 2P", cursive',
            fontSize: '40px',
            textShadow: '4px 4px 0px #accbf1',
            marginBottom: '50px'
          }}>
            MENU
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
            ].map((item) => (
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

      {/* Start Screen */}
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

      {/* Global Styles */}
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
          position: [-30, 5, 10],
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
          <directionalLight
        position={[-50, 20, 50]}
        intensity={2.5}
        color={lightColor.scene || "#eeaf61"}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={200}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
        <Scene 
          instruments={instruments} 
          lightColor={lightColor.directional}
          setLightColor={setLightColor}
          play={play}
        /> 
        <Effects />
      </Canvas>
    </div>
  );
}
