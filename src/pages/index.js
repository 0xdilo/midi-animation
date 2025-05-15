import { Canvas } from "@react-three/fiber";
import { useCallback, useEffect, useRef, useState } from "react"; // Removed useMemo as it wasn't used here
import io from "socket.io-client";
import { Effects } from "../components/Effects";
import { Scene } from "../components/Scene";
import dynamic from "next/dynamic";
const Menu = dynamic(() => import("../components/Menu"), { ssr: false });

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

export default function Home() {
  const [socket, setSocket] = useState(null);
  const [play, setPlay] = useState(false);
  const lastPausedPosition = useRef(null);

  const [instruments, setInstruments] = useState({
    0: { value: 1 },
    1: { value: 1 },
  });
  const [lightColor, setLightColor] = useState({
    scene: "#eeaf61",
    directional: "#ffffff",
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [isFirstStart, setIsFirstStart] = useState(true);

  const [serverTracks, setServerTracks] = useState([]);
  const [currentTrackTitle, setCurrentTrackTitle] = useState(null);
  // Initialize currentCarIndex and currentSongIndex to 0
  const [currentCarIndex, setCurrentCarIndex] = useState(0);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  const audioRef = useRef(null);
  const startTimeRef = useRef(0);
  const audioPausedTimeRef = useRef(0);
  const timeoutsRef = useRef([]);

  const playRef = useRef(play);
  useEffect(() => {
    playRef.current = play;
  }, [play]);

  const currentTrackTitleRef = useRef(currentTrackTitle);
  useEffect(() => {
    currentTrackTitleRef.current = currentTrackTitle;
    console.log("👑 Current Track Title Updated:", currentTrackTitle);
  }, [currentTrackTitle]);

  // Effect to update car/song index when track title or server tracks list changes
  useEffect(() => {
    if (currentTrackTitle && serverTracks.length > 0) {
      const trackIndex = serverTracks.findIndex(
        (t) => t.title === currentTrackTitle,
      );
      if (trackIndex !== -1) {
        // Only update if the index is actually different to prevent unnecessary re-renders
        if (currentCarIndex !== trackIndex) {
          console.log(
            `EFFECT: Updating currentCarIndex. Title: ${currentTrackTitle}, Old Index: ${currentCarIndex}, New Index: ${trackIndex}`,
          );
          setCurrentCarIndex(trackIndex);
        }
        if (currentSongIndex !== trackIndex) {
          console.log(
            `EFFECT: Updating currentSongIndex. Title: ${currentTrackTitle}, Old Index: ${currentSongIndex}, New Index: ${trackIndex}`,
          );
          setCurrentSongIndex(trackIndex);
        }
      } else {
        console.warn(
          `EFFECT: Track title "${currentTrackTitle}" not found in serverTracks. Car/Song index not changed. Current car index: ${currentCarIndex}`,
        );
        // Optional: Fallback to a default if title becomes invalid
        // if (currentCarIndex !== 0) setCurrentCarIndex(0);
        // if (currentSongIndex !== 0) setCurrentSongIndex(0);
      }
    } else if (!currentTrackTitle && serverTracks.length > 0) {
      // If tracks are loaded but no title is set (e.g., after stop/end and before new selection)
      // you might want to revert to a default car, or keep the last one.
      // For now, it keeps the last one until a new title is set.
      // If you want to reset to car 0 when no track is active:
      // if (currentCarIndex !== 0) setCurrentCarIndex(0);
      // if (currentSongIndex !== 0) setCurrentSongIndex(0);
    }
  }, [currentTrackTitle, serverTracks, currentCarIndex, currentSongIndex]); // Added currentCarIndex/SongIndex to dependencies for the conditional set

  const clearScheduledMidiEvents = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const handleMidiEventVisuals = (event) => {
    // ... (no changes in this function)
    console.log("🎨 Applying MIDI Event to Visuals:", {
      data: event,
      timestamp: new Date().toISOString(),
    });

    const track = event.track % 2;
    const isNoteOn = event.name === "Note on";
    const intensity = isNoteOn ? event.velocity / 127 : 0;
    const shakeTrigger = isNoteOn && track === 1;

    if (isNoteOn && track === 0) {
      const randomPair =
        colorPairs[Math.floor(Math.random() * colorPairs.length)];
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

  useEffect(() => {
    fetch("/api/socket")
      .then(() => {
        const sock = io();
        setSocket(sock);

        sock.on("connect", () => {
          console.log("Socket Connected ✅");
          sock.emit("getTracks");
        });

        sock.on("trackList", (trackList) => {
          console.log("Received track list:", trackList);
          setServerTracks(trackList);
          // If no track is selected and this is the first load,
          // handleFirstStart will pick the first track.
          // If a track was already playing and list updates, useEffect will handle it.
        });

        sock.on("trackStarted", (data) => {
          console.log("🎬 Event: trackStarted", data);
          if (!audioRef.current) {
            console.error("Audio element not ready for trackStarted");
            return;
          }
          clearScheduledMidiEvents();
          setCurrentTrackTitle(data.title); // This will trigger the useEffect to update car/song index

          const expectedAudioSrc = window.location.origin + data.audio;
          if (audioRef.current.src !== expectedAudioSrc) {
            audioRef.current.src = data.audio;
          }

          const resumeFromMs = data.resumedFrom || 0;
          audioRef.current.currentTime = resumeFromMs / 1000;
          startTimeRef.current = Date.now() - resumeFromMs;

          audioRef.current
            .play()
            .then(() => {
              setPlay(true);
              setIsFirstStart(false);
              audioPausedTimeRef.current = 0;
              console.log(
                `🎵 Audio playing '${data.title}'. Set currentTime to ${resumeFromMs / 1000
                }s. startTimeRef: ${startTimeRef.current}`,
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
            setPlay(false);
            clearScheduledMidiEvents();
            console.log("Client acknowledged track stop.");
            // currentTrackTitle remains, so car does not change on stop.
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
            setInstruments({ 0: { value: 1 }, 1: { value: 1 } });
            // Optionally set currentTrackTitle to null if you want the car to reset
            // setCurrentTrackTitle(null);
          }
        });

        sock.on("midiEvent", (event) => {
          // ... (no changes in this function)
          if (!playRef.current && event.name === "Note on") {
            return;
          }
          const clientNow = Date.now();
          const elapsedTimeOnClientTimeline =
            clientNow - startTimeRef.current;
          const delay = event.time - elapsedTimeOnClientTimeline;

          if (delay < -500) {
            return;
          }

          const timeoutId = setTimeout(() => {
            if (playRef.current) {
              handleMidiEventVisuals(event);
            }
          }, Math.max(0, delay));
          timeoutsRef.current.push(timeoutId);
        });

        sock.on("playbackError", (data) => {
          // ... (no changes)
        });
        sock.on("connect_error", (error) => {
          // ... (no changes)
        });
        sock.on("error", (error) => {
          // ... (no changes)
        });
      })
      .catch((err) => {
        console.error("Failed to fetch /api/socket to initialize:", err);
      });

    return () => {
      // ... (no changes)
    };
  }, []); // Empty dependency array: runs once on mount

  const handleFirstStart = useCallback(() => {
    if (!socket?.connected) {
      console.error("❌ Socket not connected for handleFirstStart!");
      return;
    }
    if (serverTracks.length === 0) {
      alert("Tracks not loaded yet. Please wait.");
      return;
    }

    const trackToPlay = serverTracks[0];

    if (!trackToPlay) {
      alert("No tracks available to play.");
      return;
    }

    console.log(`🎮 First Start: Playing '${trackToPlay.title}'`);

    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = 0.8;
    }
    // setCurrentTrackTitle will be set by the 'trackStarted' event,
    // which in turn triggers the useEffect for car/song index.
    audioPausedTimeRef.current = 0;
    socket.emit("playTrack", trackToPlay.title, { resumeFrom: 0 });
  }, [socket, serverTracks]);

  const menuAudioControls = {
    isPlaying: play,
    onPlay: (trackTitle) => {
      if (!socket?.connected) return;
      if (!audioRef.current) audioRef.current = new Audio();
      audioRef.current.volume = 0.8;

      // Set currentTrackTitle immediately to trigger visual change via useEffect
      // This provides quicker feedback before server confirmation.
      if (currentTrackTitleRef.current !== trackTitle) {
        setCurrentTrackTitle(trackTitle);
      }

      const resumeTimeMs =
        currentTrackTitleRef.current === trackTitle &&
          audioPausedTimeRef.current > 0
          ? audioPausedTimeRef.current * 1000
          : 0;

      console.log(`MENU: Play/Resume '${trackTitle}' from ${resumeTimeMs}ms`);
      socket.emit("playTrack", trackTitle, { resumeFrom: resumeTimeMs });
    },
    onStop: () => {
      if (!socket?.connected || !currentTrackTitleRef.current) return;
      console.log(`MENU: Stop '${currentTrackTitleRef.current}'`);
      socket.emit("stopTrack");
      if (audioRef.current) {
        audioRef.current.pause();
        audioPausedTimeRef.current = audioRef.current.currentTime;
        console.log(`Audio paused at: ${audioPausedTimeRef.current}s`);
      }
      setPlay(false);
      clearScheduledMidiEvents();
      // currentTrackTitle remains, so car does not change on stop.
    },
    onSkip: (nextTrackTitle) => {
      if (!socket?.connected) return;
      if (!audioRef.current) audioRef.current = new Audio();

      console.log(`MENU: Skip to '${nextTrackTitle}'`);
      setCurrentTrackTitle(nextTrackTitle); // Trigger useEffect for car/song index
      audioPausedTimeRef.current = 0;
      socket.emit("playTrack", nextTrackTitle, { resumeFrom: 0 });
    },
    onPrevious: (prevTrackTitle) => {
      if (!socket?.connected) return;
      if (!audioRef.current) audioRef.current = new Audio();

      console.log(`MENU: Previous to '${prevTrackTitle}'`);
      setCurrentTrackTitle(prevTrackTitle); // Trigger useEffect for car/song index
      audioPausedTimeRef.current = 0;
      socket.emit("playTrack", prevTrackTitle, { resumeFrom: 0 });
    },
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <audio ref={audioRef} />
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

      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          zIndex: 20,
        }}
      >
        <p
          style={{
            color: "#fff",
            fontFamily: "aAnotherTag",
            fontSize: "50px",
            margin: 0,
          }}
        >
          ROGIAN
        </p>
      </div>

      {!isFirstStart && (
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          style={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 20, // Ensure this is below menu's zIndex if menu is open
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

      <Menu
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        audioControls={menuAudioControls}
        albumData={serverTracks.map((track) => ({
          title: track.title,
          audioSrc: track.audio,
        }))}
        currentTrackTitle={currentTrackTitle}
      />

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
            onClick={handleFirstStart}
          >
            <p
              style={{
                color: "#fff",
                fontFamily: "aAnotherTag",
                fontSize: "200px",
                margin: 0,
              }}
            >
              ROGIAN
            </p>
            <button
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                fontSize: "20px",
                animation: "blink 1s infinite",
              }}
            >
              PRESS START BUTTON
            </button>
          </div>
        </div>
      )}

      <style jsx global>
        {`
          /* ... (global styles remain the same) ... */
          @import url("https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap");

          @font-face {
            font-family: "aAnotherTag";
            src: url("/font/aAnotherTag.ttf") format("truetype");
            font-weight: normal;
            font-style: normal;
          }
          @keyframes pulse {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
            100% {
              transform: scale(1);
            }
          }

          @keyframes blink {
            0% {
              opacity: 1;
            }
            50% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }

          @keyframes menuSlide {
            from {
              transform: translateY(100%);
            }
            to {
              transform: translateY(0);
            }
          }

          body {
            margin: 0;
            overflow: hidden;
            background-color: #000;
          }

          * {
            box-sizing: border-box;
          }
        `}
      </style>

      <Canvas
        dpr={0.6}
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
        />
        <Scene
          instruments={instruments}
          lightColor={lightColor.directional}
          play={play}
          currentCarIndex={currentCarIndex} // This is the crucial prop
          lastPausedPosition={lastPausedPosition}
        />
        <Effects currentSongIndex={currentSongIndex} /> {/* This is also crucial */}
      </Canvas>
    </div>
  );
}

