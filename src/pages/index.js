import { Canvas } from "@react-three/fiber";
import { useMemo, useCallback, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { Effects } from "../components/Effects";
import { Scene } from "../components/Scene";
import Menu from "../components/Menu"; // Import the new Menu component

const colorPairs = [
  { scene: "#FF1493", light: "#00EB6C" }, // Deep pink & Spring green
  { scene: "#00FF7F", light: "#FF0080" }, // Spring green & Deep pink
  { scene: "#FF4500", light: "#00BAFF" }, // Orange red & Deep sky blue
  { scene: "#1E90FF", light: "#E16F00" }, // Dodger blue & Dark orange
  { scene: "#FFD700", light: "#0028FF" }, // Gold & Blue
  { scene: "#FF00FF", light: "#00FF00" }, // Magenta & Lime
  { scene: "#00FFFF", light: "#FF0000" }, // Cyan & Red
  { scene: "#9400D3", light: "#6BFF2C" }, // Dark violet & Lime green
];

// Tracks data structure matching Menu.js album data
const TRACKS = {
  "Song 1": { audio: "/traccia.mp3" },
  "Song 2": { audio: "/traccia.mp3" },
  "Song 3": { audio: "/traccia.mp3" },
};

export default function Home() {
  const [socket, setSocket] = useState(null);
  const [play, setPlay] = useState(false);
  const [instruments, setInstruments] = useState({
    0: { value: 1 },
    1: { value: 1 },
  });
  const [lightColor, setLightColor] = useState("#ffffff");
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentCarIndex, setCurrentCarIndex] = useState(0);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isFirstStart, setIsFirstStart] = useState(true);
  const [audioPausedTime, setAudioPausedTime] = useState(0);

  const audioRef = useRef(null);
  const startTimeRef = useRef(null);
  const lastPausedPosition = useRef(null);
  const playingRef = useRef(false); // Ref to track play state for event handlers

  // Update the playingRef whenever play state changes
  useEffect(() => {
    playingRef.current = play;
  }, [play]);

  // Socket initialization
  useEffect(() => {
    console.log("Initializing socket connection...");
    fetch("/api/socket");
    const sock = io();
    setSocket(sock);

    sock.on("connect", () => {
      console.log("Socket Connected ✅");
    });

    sock.on("connect_error", (error) => {
      console.error("Socket Connection Error ❌:", error);
    });

    sock.on("error", (error) => {
      console.error("Socket Error ❌:", error);
    });

    sock.on("midiEvent", (event) => {
      // Only process events if we're playing (using ref for closure issues)
      if (playingRef.current) {
        const currentTime = Date.now() - startTimeRef.current;
        const delay = event.time - currentTime;

        setTimeout(() => {
          // Check again when the timeout fires in case play state changed
          if (playingRef.current) {
            handleMidiEvent(event);
          }
        }, Math.max(0, delay));
      }
    });

    return () => {
      if (sock) sock.disconnect();
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // MIDI event handler
  const handleMidiEvent = (event) => {
    console.log("🎹 MIDI Event:", {
      data: event,
      timestamp: new Date().toISOString(),
    });

    const track = event.track % 2;
    const isNoteOn = event.name === "Note on";
    const intensity = isNoteOn ? event.velocity / 127 : 0; // Normalize velocity (0-127) to 0-1
    const shakeTrigger = isNoteOn && track === 1; // Trigger shake for track 1 "Note on"

    if (isNoteOn && track === 0) {
      const randomPair = colorPairs[Math.floor(Math.random() * colorPairs.length)];
      console.log("💡 Track 0 - Changing colors:", randomPair);
      setLightColor({
        scene: randomPair.scene,
        directional: randomPair.light,
      });
    }

    setInstruments((prev) => ({
      ...prev,
      [track]: {
        value: isNoteOn ? 2 : 1,
        noteOn: isNoteOn,
        intensity: track === 1 ? intensity : 0, // Intensity for particles on track 1
        shakeTrigger: track === 1 ? shakeTrigger : false, // Shake for track 1
      },
    }));
  };

  // Start button handler
  const handleStart = useCallback(() => {
    console.log("🎮 Start Button Clicked");

    if (!socket?.connected) {
      console.error("❌ Socket not connected! Current socket state:", {
        socket: socket,
        connected: socket?.connected,
      });
      return;
    }

    if (!audioRef.current) {
      audioRef.current = new Audio("/traccia.mp3");
      audioRef.current.volume = 0.8;
    }

    if (audioPausedTime > 0) {
      const timeOffsetMs = audioPausedTime * 1000;
      startTimeRef.current = Date.now() - timeOffsetMs;
      audioRef.current.currentTime = audioPausedTime;
      console.log("🚀 Emitting start event with resume position:", { timeOffsetMs });
      socket.emit("start", { resumeFrom: timeOffsetMs });
    } else {
      console.log("🚀 Emitting initial start event");
      startTimeRef.current = Date.now();
      audioRef.current.currentTime = 0; // Ensure fresh start resets to 0
      setAudioPausedTime(0); // Reset paused time
      socket.emit("start");
    }

    audioRef.current.play()
      .then(() => {
        console.log("🎵 Audio started");
        setPlay(true);
        setIsFirstStart(false);
      })
      .catch((error) => {
        console.error("Audio playback error:", error);
        setPlay(false);
      });
  }, [socket, audioPausedTime]);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {/* Grid Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(rgba(0,0,0,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.2) 1px, transparent 1px)",
          backgroundSize: "2px 2px",
          pointerEvents: "none",
          zIndex: 15,
        }}
      />

      {/* Logo */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          zIndex: 20,
        }}
      >
        <img
          src="/logo.webp"
          alt="Logo"
          style={{
            width: "120px",
            height: "auto",
            filter:
              "drop-shadow(2px 2px 0px #000) drop-shadow(-2px -2px 0px #000)",
          }}
        />
      </div>

      {play && (
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          style={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 20,
            padding: "15px 30px",
            background: "rgba(0,0,0,0.7)",
            border: "2px solid #fff",
            color: "#fff",
            fontFamily: '"Press Start 2P", cursive',
            fontSize: "24px",
            cursor: "pointer",
            opacity: menuOpen ? 0 : 1,
            transition: "all 0.3s ease",
            textShadow: "2px 2px 0px #000",
            animation: menuOpen ? "none" : "blink 1s infinite",
          }}
        >
          MENU
        </button>
      )}

      {/* Menu Overlay */}
      <Menu
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        audioControls={{
          isPlaying: play,
          onPlay: (trackTitle) => {
            if (!socket?.connected) return;

            if (!audioRef.current) {
              audioRef.current = new Audio(TRACKS[trackTitle].audio);
            }
            audioRef.current.volume = 0.8;

            const timeOffsetMs = audioPausedTime * 1000;
            console.log(`Resuming from ${audioPausedTime} seconds / ${timeOffsetMs}ms`);

            audioRef.current.currentTime = audioPausedTime;
            startTimeRef.current = Date.now() - timeOffsetMs;
            socket.emit("playTrack", trackTitle, { resumeFrom: timeOffsetMs });

            audioRef.current.play()
              .then(() => {
                setPlay(true);
                setIsFirstStart(false);
              })
              .catch((err) => {
                console.error("Error resuming audio:", err);
              });

            const index = ["Song 1", "Song 2", "Song 3"].indexOf(trackTitle);
            setCurrentCarIndex(index);
            setCurrentSongIndex(index);
          },
          onStop: () => {
            if (audioRef.current) {
              const currentTime = audioRef.current.currentTime;
              setAudioPausedTime(currentTime);
              console.log(`Paused at time: ${currentTime} seconds`);
              audioRef.current.pause();
            }
            socket.emit("stopTrack");
            setPlay(false);
          },
          onSkip: (trackTitle) => {
            socket.emit("playTrack", trackTitle);
            audioRef.current.src = TRACKS[trackTitle].audio;
            audioRef.current.currentTime = 0;
            setAudioPausedTime(0);
            audioRef.current.play();
            const index = ["Song 1", "Song 2", "Song 3"].indexOf(trackTitle);
            setCurrentCarIndex(index);
            setCurrentSongIndex(index);
          },
          onPrevious: (trackTitle) => {
            socket.emit("playTrack", trackTitle);
            audioRef.current.src = TRACKS[trackTitle].audio;
            audioRef.current.currentTime = 0;
            setAudioPausedTime(0);
            audioRef.current.play();
            const index = ["Song 1", "Song 2", "Song 3"].indexOf(trackTitle);
            setCurrentCarIndex(index);
            setCurrentSongIndex(index);
          },
        }}
      />

      {/* Start Screen */}
      {/* todo fix */}
      {!play && isFirstStart && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 20,
          }}
        >
          <div
            style={{
              animation: "pulse 2s infinite",
              textAlign: "center",
              cursor: "pointer",
            }}
            onClick={handleStart}
          >
            <h1
              style={{
                color: "#fff",
                fontFamily: '"Press Start 2P", cursive',
                fontSize: "40px",
                textShadow: "4px 4px 0px #accbf1",
              }}
            >
              ROGIAN
            </h1>
            <button
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                fontFamily: '"Press Start 2P", cursive',
                cursor: "pointer",
                fontSize: "20px",
                textShadow: "2px 2px 0px #000",
                animation: "blink 1s infinite",
              }}
            >
              PRESS START BUTTON
            </button>
          </div>
        </div>
      )}

      {/* Global Styles */}
      <style jsx global>
        {`
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
      `}
      </style>

      <Canvas
        shadows
        camera={{
          position: [-10, 5, 2],
          fov: 60,
        }}
        style={{
          background: `url('/sunset.jpg') no-repeat center center`,
          backgroundSize: "cover",
        }}
        gl={{
          powerPreference: "high-performance",
          antialias: false,
          stencil: false,
          depth: false,
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
          currentCarIndex={currentCarIndex}
          lastPausedPosition={lastPausedPosition}
        />
        <Effects currentSongIndex={currentSongIndex} />
      </Canvas>
    </div>
  );
}
