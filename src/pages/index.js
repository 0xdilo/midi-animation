import { Canvas } from "@react-three/fiber";
import { useMemo, useCallback, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { Effects } from "../components/Effects"; // Assuming these paths are correct
import { Scene } from "../components/Scene";   // Assuming these paths are correct
import Menu from "../components/Menu";         // Assuming this path is correct

const colorPairs = [
  { scene: "#FF1493", light: "#00EB6C" },
  { scene: "#00FF7F", light: "#FF0080" },
  { scene: "#FF4500", light: "#00BAFF" },
  { scene: "#1E90FF", light: "#E16F00" },
  { scene: "#FFD700", light: "#0028FF" },
  { scene: "#FF00FF", light: "#00FF00" },
  { scene: "#00FFFF", light: "#FF0000" },
  { scene: "#9400D3", light: "#6BFF2C" },
];

// This local TRACKS is mainly for the Menu structure if needed before server data.
// The server will provide the definitive list with audio paths.
const LOCAL_TRACK_TITLES = ["Song 1", "Song 2", "Song 3"];


export default function Home() {
  const [socket, setSocket] = useState(null);
  const [play, setPlay] = useState(false); // Renamed from isPlaying for consistency
  const lastPausedPosition = useRef(null);

  const [instruments, setInstruments] = useState({
    0: { value: 1 }, // Default state for instruments
    1: { value: 1 },
  });
  const [lightColor, setLightColor] = useState({ scene: "#eeaf61", directional: "#ffffff" }); // Initial light colors
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentCarIndex, setCurrentCarIndex] = useState(0);
  const [currentSongIndex, setCurrentSongIndex] = useState(0); // Used by Effects
  const [isFirstStart, setIsFirstStart] = useState(true);

  // New state for track management from server
  const [serverTracks, setServerTracks] = useState([]); // To store tracks from server {title, audio}
  const [currentTrackTitle, setCurrentTrackTitle] = useState(null); // e.g., "Song 1"

  const audioRef = useRef(null);
  const startTimeRef = useRef(0); // Date.now() at the moment audio playback logically started at 0ms for sync
  const audioPausedTimeRef = useRef(0); // Stores audio.currentTime (in seconds) when paused
  const timeoutsRef = useRef([]); // To store and clear MIDI event timeouts

  // Ref to track play state for event handlers, avoiding stale closures
  const playRef = useRef(play);
  useEffect(() => {
    playRef.current = play;
  }, [play]);

  const currentTrackTitleRef = useRef(currentTrackTitle);
  useEffect(() => {
    currentTrackTitleRef.current = currentTrackTitle;
  }, [currentTrackTitle]);


  const clearScheduledMidiEvents = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    // Optionally reset visual cues tied to activeNotes if you use such a direct state
    // setInstruments({ 0: { value: 1 }, 1: { value: 1 } }); // Reset instruments if needed on clear
  };

  // MIDI event handler (your original logic for visuals)
  const handleMidiEventVisuals = (event) => {
    // This is your original logic for updating instruments and lightColor
    console.log("🎨 Applying MIDI Event to Visuals:", {
      data: event,
      timestamp: new Date().toISOString(),
    });

    const track = event.track % 2; // Assuming 2 tracks for visuals
    const isNoteOn = event.name === "Note on";
    const intensity = isNoteOn ? event.velocity / 127 : 0;
    const shakeTrigger = isNoteOn && track === 1;

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
        intensity: track === 1 ? intensity : 0,
        shakeTrigger: track === 1 ? shakeTrigger : false,
      },
    }));
  };


  // Socket initialization and event listeners
  useEffect(() => {
    // CRITICAL: Ping the API route to initialize the Socket.IO server
    fetch("/api/socket").then(() => {
      const sock = io();
      setSocket(sock);

      sock.on("connect", () => {
        console.log("Socket Connected ✅");
        sock.emit("getTracks"); // Get available tracks from server
      });

      sock.on("trackList", (trackList) => {
        console.log("Received track list:", trackList);
        setServerTracks(trackList);
        // If no track is selected yet, and we have tracks, maybe select the first one
        // but don't auto-play. The Menu component will use serverTracks.
      });

      sock.on("trackStarted", (data) => {
        console.log("🎬 Event: trackStarted", data);
        if (!audioRef.current) {
          console.error("Audio element not ready for trackStarted");
          return;
        }
        clearScheduledMidiEvents();
        setCurrentTrackTitle(data.title);

        const trackIndex = LOCAL_TRACK_TITLES.indexOf(data.title);
        if (trackIndex !== -1) {
          setCurrentCarIndex(trackIndex); // For Scene component
          setCurrentSongIndex(trackIndex); // For Effects component
        }

        // Ensure audio source is correct
        const expectedAudioSrc = window.location.origin + data.audio;
        if (audioRef.current.src !== expectedAudioSrc) {
          audioRef.current.src = data.audio; // Server provides web-accessible path
        }

        const resumeFromMs = data.resumedFrom || 0;
        audioRef.current.currentTime = resumeFromMs / 1000;
        startTimeRef.current = Date.now() - resumeFromMs; // Anchor point for event timing

        audioRef.current.play()
          .then(() => {
            setPlay(true);
            setIsFirstStart(false); // No longer the very first start
            audioPausedTimeRef.current = 0; // Reset paused time as we are playing
            console.log(
              `🎵 Audio playing '${data.title}'. Set currentTime to ${resumeFromMs / 1000}s. startTimeRef: ${startTimeRef.current}`,
            );
          })
          .catch((error) => {
            console.error("Audio playback error on trackStarted:", error);
            setPlay(false);
          });
      });

      sock.on("trackStopped", (data) => {
        console.log("🎬 Event: trackStopped", data);
        if (playRef.current && data.title === currentTrackTitleRef.current) {
          if (audioRef.current) {
            // audioRef.current.pause(); // Client pause action should handle this
            // audioPausedTimeRef.current is set by the client's explicit pause action
          }
          setPlay(false);
          clearScheduledMidiEvents(); // Stop any pending visual events
          console.log("Client acknowledged track stop.");
        }
      });

      sock.on("trackEnded", (data) => {
        console.log("🎬 Event: trackEnded", data.title);
        if (data.title === currentTrackTitleRef.current) {
          setPlay(false);
          clearScheduledMidiEvents();
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
          }
          audioPausedTimeRef.current = 0;
          // Optionally reset instruments to default visual state
          setInstruments({ 0: { value: 1 }, 1: { value: 1 } });
        }
      });

      sock.on("midiEvent", (event) => {
        if (!playRef.current && event.name === "Note on") {
          return; // Don't process if not playing
        }
        const clientNow = Date.now();
        const elapsedTimeOnClientTimeline = clientNow - startTimeRef.current;
        const delay = event.time - elapsedTimeOnClientTimeline;

        if (delay < -500) { // Event is too old, likely from before a seek/pause
          // console.warn(`Skipping very late MIDI event: ${event.name} ${event.noteNumber}. Delay: ${delay.toFixed(0)}ms`);
          return;
        }

        const timeoutId = setTimeout(() => {
          if (playRef.current) { // Double check play state when timeout fires
            handleMidiEventVisuals(event); // Your original visual handler
          }
        }, Math.max(0, delay));
        timeoutsRef.current.push(timeoutId);
      });

      // midiTick can be used for progress bars or other non-critical UI updates
      // socket.on("midiTick", (data) => { /* ... */ });


      sock.on("playbackError", (data) => {
        console.error("Socket Playback Error ❌:", data.error);
        alert(`Playback Error: ${data.error}`);
        setPlay(false);
      });

      sock.on("connect_error", (error) => {
        console.error("Socket Connection Error ❌:", error);
      });
      sock.on("error", (error) => {
        console.error("Socket Error ❌:", error);
      });

    }).catch(err => {
      console.error("Failed to fetch /api/socket to initialize:", err);
    });


    return () => {
      clearScheduledMidiEvents();
      if (socket) socket.disconnect();
      if (audioRef.current) {
        audioRef.current.pause();
        // audioRef.current.src = ""; // Optional: clear src on unmount
      }
    };
  }, []); // Empty dependency array: runs once on mount

  // Initial "PRESS START BUTTON" handler
  const handleFirstStart = useCallback(() => {
    if (!socket?.connected) {
      console.error("❌ Socket not connected for handleFirstStart!");
      return;
    }
    if (serverTracks.length === 0) {
      alert("Tracks not loaded yet. Please wait.");
      return;
    }

    const firstTrackTitle = LOCAL_TRACK_TITLES[0] || "Song 1"; // Fallback
    const trackToPlay = serverTracks.find(t => t.title === firstTrackTitle) || serverTracks[0];

    if (!trackToPlay) {
      alert("No tracks available to play.");
      return;
    }

    console.log(`🎮 First Start: Playing '${trackToPlay.title}'`);

    if (!audioRef.current) {
      audioRef.current = new Audio(); // Create audio element if not exists
      audioRef.current.volume = 0.8;
    }
    // The 'trackStarted' event will handle setting src, currentTime, and playing.
    setCurrentTrackTitle(trackToPlay.title); // Set current track
    audioPausedTimeRef.current = 0; // Ensure starting from beginning
    socket.emit("playTrack", trackToPlay.title, { resumeFrom: 0 });
    // setPlay(true) and setIsFirstStart(false) will be handled by 'trackStarted'
  }, [socket, serverTracks]);


  // --- Menu Actions ---
  const menuAudioControls = {
    isPlaying: play,
    onPlay: (trackTitle) => { // Resume or play selected track
      if (!socket?.connected) return;
      if (!audioRef.current) audioRef.current = new Audio();
      audioRef.current.volume = 0.8;

      const resumeTimeMs = (currentTrackTitleRef.current === trackTitle && audioPausedTimeRef.current > 0)
        ? audioPausedTimeRef.current * 1000
        : 0; // If different track, or no pause time, start from 0

      console.log(`MENU: Play/Resume '${trackTitle}' from ${resumeTimeMs}ms`);
      setCurrentTrackTitle(trackTitle); // Update the current track
      socket.emit("playTrack", trackTitle, { resumeFrom: resumeTimeMs });
    },
    onStop: () => { // Pause current track
      if (!socket?.connected || !currentTrackTitleRef.current) return;
      console.log(`MENU: Stop '${currentTrackTitleRef.current}'`);
      socket.emit("stopTrack");
      if (audioRef.current) {
        audioRef.current.pause();
        audioPausedTimeRef.current = audioRef.current.currentTime;
        console.log(`Audio paused at: ${audioPausedTimeRef.current}s`);
      }
      setPlay(false); // Update UI immediately
      clearScheduledMidiEvents();
    },
    onSkip: (nextTrackTitle) => { // Play next track from beginning
      if (!socket?.connected) return;
      if (!audioRef.current) audioRef.current = new Audio();
      console.log(`MENU: Skip to '${nextTrackTitle}'`);
      setCurrentTrackTitle(nextTrackTitle);
      audioPausedTimeRef.current = 0; // Reset pause time for new track
      socket.emit("playTrack", nextTrackTitle, { resumeFrom: 0 });
    },
    onPrevious: (prevTrackTitle) => { // Play previous track from beginning
      if (!socket?.connected) return;
      if (!audioRef.current) audioRef.current = new Audio();
      console.log(`MENU: Previous to '${prevTrackTitle}'`);
      setCurrentTrackTitle(prevTrackTitle);
      audioPausedTimeRef.current = 0;
      socket.emit("playTrack", prevTrackTitle, { resumeFrom: 0 });
    },
  };


  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <audio ref={audioRef} /> {/* Global audio element */}
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
        audioControls={menuAudioControls}
        // Pass serverTracks to Menu for dynamic track listing
        // The Menu component will need to be adapted to use this prop if it's not already
        albumData={serverTracks.map(track => ({ title: track.title, audioSrc: track.audio }))}
        currentTrackTitle={currentTrackTitle}
      />

      {/* Start Screen */}
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
            zIndex: 20, // Ensure it's above canvas but below menu if menu can open
          }}
        >
          <div
            style={{
              animation: "pulse 2s infinite",
              textAlign: "center",
              cursor: "pointer",
            }}
            onClick={handleFirstStart} // Use the new handler
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

        @keyframes menuSlide { /* Ensure your Menu component uses this or similar */
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        body {
          margin: 0;
          overflow: hidden;
          background-color: #000; /* Fallback background for canvas area */
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
          // visibility: play || !isFirstStart ? 'visible' : 'hidden' // Optionally hide canvas until first play
        }}
        gl={{
          powerPreference: "high-performance",
          antialias: false, // Kept from original
          stencil: false,   // Kept from original
          depth: false,     // Kept from original
        }}
      >
        <directionalLight
          position={[-50, 20, 50]}
          intensity={2.5}
          color={lightColor.scene || "#eeaf61"} // Use state for color
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
          instruments={instruments} // Pass instruments state
          lightColor={lightColor.directional} // Pass directional light color from state
          // setLightColor={setLightColor} // setLightColor is handled by MIDI event now
          play={play} // Pass play state
          currentCarIndex={currentCarIndex} // Pass car index
          lastPausedPosition={lastPausedPosition} // This ref seems unused in original Scene, review if needed
        />
        <Effects currentSongIndex={currentSongIndex} /> {/* Pass song index */}
      </Canvas>
    </div>
  );
}

