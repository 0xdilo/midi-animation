import { Canvas } from "@react-three/fiber";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import io from "socket.io-client";
import { Effects } from "../components/Effects";
import { Scene } from "../components/Scene";
import dynamic from "next/dynamic";
import AlbumCover3D from "../components/AlbumCover3D";

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
  // --- State ---
  const [socket, setSocket] = useState(null);
  const [play, setPlay] = useState(false);
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
  const [currentCarIndex, setCurrentCarIndex] = useState(0);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [shaderColor, setShaderColor] = useState("rgb(255, 255, 255)");
  const [startClicked, setStartClicked] = useState(false);

  // --- Refs ---
  const audioRef = useRef(null);
  const startTimeRef = useRef(0);
  const audioPausedTimeRef = useRef(0);
  const timeoutsRef = useRef([]);
  const playRef = useRef(play);
  const currentTrackTitleRef = useRef(currentTrackTitle);
  const lastPausedPosition = useRef(null);
  const currentSongIndexRef = useRef(currentSongIndex);

  // --- Sync refs with state ---
  useEffect(() => {
    playRef.current = play;
  }, [play]);
  useEffect(() => {
    currentTrackTitleRef.current = currentTrackTitle;
  }, [currentTrackTitle]);
  useEffect(() => {
    currentSongIndexRef.current = currentSongIndex;
  }, [currentSongIndex]);

  // --- Update car/song index when track list changes ---
  useEffect(() => {
    if (currentTrackTitle && serverTracks.length > 0) {
      const idx = serverTracks.findIndex((t) => t.title === currentTrackTitle);
      if (idx !== -1) {
        if (currentCarIndex !== idx) setCurrentCarIndex(idx);
        if (currentSongIndex !== idx) setCurrentSongIndex(idx);
      }
    }
  }, [currentTrackTitle, serverTracks]);

  // --- Clear scheduled MIDI events ---
  const clearScheduledMidiEvents = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  // --- Handle MIDI event visuals ---
  const handleMidiEventVisuals = useCallback((event) => {
    const track = event.track > 1 ? 1 : event.track;
    const isNoteOn = event.name === "Note on";
    const intensity = isNoteOn ? event.velocity / 127 : 0;
    const shakeTrigger = isNoteOn && track === 1;

    if (isNoteOn && track === 0) {
      const pair = colorPairs[Math.floor(Math.random() * colorPairs.length)];
      setLightColor({ scene: pair.scene, directional: pair.light });
    }

    if (isNoteOn && currentSongIndexRef.current % 5 === 2) {
      const hue = (event.noteNumber * 10) % 360;
      setShaderColor(`hsl(${hue},100%,50%)`);
    } else {
      setShaderColor("rgb(255, 255, 255)");
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
  }, []);

  // --- Socket connection & handlers ---
  useEffect(() => {
    fetch("/api/socket"); // pre-warm

    const sock = io();
    setSocket(sock);

    sock.on("connect", () => {
      sock.emit("getTracks");
    });

    sock.on("trackList", (list) => {
      setServerTracks(list);
    });

    sock.on("trackStarted", (data) => {
      if (!audioRef.current) return;
      clearScheduledMidiEvents();
      setCurrentTrackTitle(data.title);
      const src = window.location.origin + data.audio;
      if (audioRef.current.src !== src) {
        audioRef.current.src = data.audio;
      }
      const resumeMs = data.resumedFrom || 0;
      audioRef.current.currentTime = resumeMs / 1000;
      startTimeRef.current = Date.now() - resumeMs;
      audioRef.current
        .play()
        .then(() => {
          setPlay(true);
          setIsFirstStart(false);
          audioPausedTimeRef.current = 0;
        })
        .catch(() => {
          setPlay(false);
        });
    });

    sock.on("trackStopped", (data) => {
      if (playRef.current && data.title === currentTrackTitleRef.current) {
        setPlay(false);
        clearScheduledMidiEvents();
      }
    });

    sock.on("trackEnded", (data) => {
      if (data.title === currentTrackTitleRef.current) {
        setPlay(false);
        clearScheduledMidiEvents();
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
        }
        audioPausedTimeRef.current = 0;
        setInstruments({ 0: { value: 1 }, 1: { value: 1 } });
      }
    });

    const midiHandler = (event) => {
      if (!playRef.current && event.name === "Note on") return;
      const now = Date.now();
      const elapsed = now - startTimeRef.current;
      const delay = event.time - elapsed;
      if (delay < -500) return;
      const id = setTimeout(
        () => {
          if (playRef.current) handleMidiEventVisuals(event);
        },
        Math.max(0, delay),
      );
      timeoutsRef.current.push(id);
    };

    sock.on("midiEvent", midiHandler);

    return () => {
      sock.off("midiEvent", midiHandler);
      sock.disconnect();
      clearScheduledMidiEvents();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, [clearScheduledMidiEvents, handleMidiEventVisuals]);

  // --- First start (play initial track) ---
  const handleFirstStart = useCallback(() => {
    if (!socket?.connected) {
      alert("Connecting... please wait a moment.");
      return;
    }
    if (serverTracks.length === 0) {
      alert("Tracks not loaded yet. Please wait.");
      return;
    }
    const first = serverTracks[0];
    if (!first) {
      alert("No tracks available.");
      return;
    }
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = 0.8;
    }
    audioPausedTimeRef.current = 0;
    socket.emit("playTrack", first.title, { resumeFrom: 0 });
    setStartClicked(true);
  }, [socket, serverTracks]);

  // --- Menu audio controls memo ---
  const menuAudioControls = useMemo(
    () => ({
      isPlaying: play,
      onPlay: (title) => {
        if (!socket?.connected) return;
        if (!audioRef.current) audioRef.current = new Audio();
        audioRef.current.volume = 0.8;
        if (currentTrackTitleRef.current !== title) {
          setCurrentTrackTitle(title);
        }
        const resumeMs =
          currentTrackTitleRef.current === title &&
          audioPausedTimeRef.current > 0
            ? audioPausedTimeRef.current * 1000
            : 0;
        socket.emit("playTrack", title, { resumeFrom: resumeMs });
      },
      onStop: () => {
        if (!socket?.connected || !currentTrackTitleRef.current) return;
        socket.emit("stopTrack");
        if (audioRef.current) {
          audioRef.current.pause();
          audioPausedTimeRef.current = audioRef.current.currentTime;
        }
        setPlay(false);
        clearScheduledMidiEvents();
      },
      onSkip: (next) => {
        if (!socket?.connected) return;
        if (!audioRef.current) audioRef.current = new Audio();
        setCurrentTrackTitle(next);
        audioPausedTimeRef.current = 0;
        socket.emit("playTrack", next, { resumeFrom: 0 });
      },
      onPrevious: (prev) => {
        if (!socket?.connected) return;
        if (!audioRef.current) audioRef.current = new Audio();
        setCurrentTrackTitle(prev);
        audioPausedTimeRef.current = 0;
        socket.emit("playTrack", prev, { resumeFrom: 0 });
      },
    }),
    [play, socket, clearScheduledMidiEvents],
  );

  // --- Album data for menu ---
  const albumData = useMemo(
    () =>
      serverTracks.map((track) => ({
        title: track.title,
        audioSrc: track.audio,
      })),
    [serverTracks],
  );

  // --- Render ---
  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <audio ref={audioRef} />
      {/* background grid overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(rgba(0,0,0,0.2) 1px, transparent 1px), " +
            "linear-gradient(90deg, rgba(0,0,0,0.2) 1px, transparent 1px)",
          backgroundSize: "2px 2px",
          pointerEvents: "none",
          zIndex: 15,
        }}
      />

      {/* logo */}
      <div
        style={{ position: "absolute", top: "20px", left: "20px", zIndex: 20 }}
      >
        <img src="/LOGOBIANCO.png" alt="logo" style={{ width: "150px" }} />
      </div>

      {/* menu button */}
      {!isFirstStart && (
        <button
          onClick={() => setMenuOpen((p) => !p)}
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
            textShadow: "2px 2px 0 #000",
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
        albumData={albumData}
        currentTrackTitle={currentTrackTitle}
      />

      {/* first-start screen */}
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
            transition: "opacity 1s",
            opacity: startClicked ? 0 : 1,
          }}
        >
          {/* album wrapper */}
          <div
            style={{
              width: "600px",
              height: "600px",
              flexShrink: 0,
              marginTop: "-50px",
            }}
          >
            <Canvas style={{ width: "100%", height: "100%" }}>
              <AlbumCover3D onClick={handleFirstStart} />
            </Canvas>
          </div>

          {/* play button under album */}

          <button
            style={{
              background: "none",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              fontSize: "20px",
              animation: "blink 1s infinite",
              marginTop: "20px",
              position: "absolute",
              bottom: "20%",
              fontFamily: '"Press Start 2P", cursive',
            }}
            onClick={handleFirstStart}
          >
            PRESS START TO PLAY
          </button>
        </div>
      )}

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap");
        @font-face {
          font-family: "aAnotherTag";
          src: url("/font/aAnotherTag.ttf") format("truetype");
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
      `}</style>

      {/* main 3D scene */}
      <Canvas
        dpr={0.6}
        shadows
        camera={{ position: [-10, 5, 2], fov: 60 }}
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
          color={lightColor.scene}
        />
        <Scene
          instruments={instruments}
          lightColor={lightColor.directional}
          play={play}
          currentCarIndex={currentCarIndex}
          lastPausedPosition={lastPausedPosition}
        />
        <Effects
          currentSongIndex={currentSongIndex}
          shaderColor={shaderColor}
        />
      </Canvas>
    </div>
  );
}
