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

  // --- Effects: Keep refs in sync with state ---
  useEffect(() => {
    playRef.current = play;
  }, [play]);
  useEffect(() => {
    currentTrackTitleRef.current = currentTrackTitle;
  }, [currentTrackTitle]);
  useEffect(() => {
    currentSongIndexRef.current = currentSongIndex;
  }, [currentSongIndex]);

  // --- Effect: Update car/song index when track or track list changes ---
  useEffect(() => {
    if (currentTrackTitle && serverTracks.length > 0) {
      const trackIndex = serverTracks.findIndex(
        (t) => t.title === currentTrackTitle
      );
      if (trackIndex !== -1) {
        if (currentCarIndex !== trackIndex) setCurrentCarIndex(trackIndex);
        if (currentSongIndex !== trackIndex) setCurrentSongIndex(trackIndex);
      }
    }
  }, [currentTrackTitle, serverTracks]);

  // --- Utility: Clear scheduled MIDI events ---
  const clearScheduledMidiEvents = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  // --- MIDI Event Visuals Handler ---
  const handleMidiEventVisuals = useCallback((event) => {
    const track = event.track > 1 ? 1 : event.track;
    const isNoteOn = event.name === "Note on";
    const intensity = isNoteOn ? event.velocity / 127 : 0;
    const shakeTrigger = isNoteOn && track === 1;

    if (isNoteOn && track === 0) {
      const randomPair =
        colorPairs[Math.floor(Math.random() * colorPairs.length)];
      setLightColor({
        scene: randomPair.scene,
        directional: randomPair.light,
      });
    }

    if (isNoteOn && currentSongIndexRef.current % 5 === 2) {
        const hue = (event.noteNumber * 10) % 360;
        setShaderColor(`hsl(${hue}, 100%, 50%)`);
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

  // --- Effect: Socket connection and event handlers ---
  useEffect(() => {
    fetch("/api/socket"); // Pre-warm the serverless function

    const sock = io();
    setSocket(sock);

    sock.on("connect", () => {
      sock.emit("getTracks");
    });

    sock.on("trackList", (trackList) => {
      setServerTracks(trackList);
    });

    sock.on("trackStarted", (data) => {
      if (!audioRef.current) return;
      clearScheduledMidiEvents();
      setCurrentTrackTitle(data.title);

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
        })
        .catch(() => {
          setPlay(false);
        });
    });

    sock.on("trackStopped", (data) => {
      if (
        playRef.current &&
        data.title === currentTrackTitleRef.current
      ) {
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

    const midiEventHandler = (event) => {
        if (!playRef.current && event.name === "Note on") return;
        const clientNow = Date.now();
        const elapsedTimeOnClientTimeline =
          clientNow - startTimeRef.current;
        const delay = event.time - elapsedTimeOnClientTimeline;

        if (delay < -500) return;

        const timeoutId = setTimeout(() => {
          if (playRef.current) {
            handleMidiEventVisuals(event);
          }
        }, Math.max(0, delay));
        timeoutsRef.current.push(timeoutId);
    }

    sock.on("midiEvent", midiEventHandler);

    return () => {
      sock.off("midiEvent", midiEventHandler);
      sock.disconnect();
      clearScheduledMidiEvents();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, [clearScheduledMidiEvents, handleMidiEventVisuals]);

  // --- First Start Handler ---
  const handleFirstStart = useCallback(() => {
    if (!socket?.connected) {
        alert("Connecting... please wait a moment and try again.");
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
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = 0.8;
    }
    audioPausedTimeRef.current = 0;
    socket.emit("playTrack", trackToPlay.title, { resumeFrom: 0 });
    setStartClicked(true);
  }, [socket, serverTracks]);


  // --- Menu Audio Controls ---
  const menuAudioControls = useMemo(
    () => ({
      isPlaying: play,
      onPlay: (trackTitle) => {
        if (!socket?.connected) return;
        if (!audioRef.current) audioRef.current = new Audio();
        audioRef.current.volume = 0.8;

        if (currentTrackTitleRef.current !== trackTitle) {
          setCurrentTrackTitle(trackTitle);
        }

        const resumeTimeMs =
          currentTrackTitleRef.current === trackTitle &&
            audioPausedTimeRef.current > 0
            ? audioPausedTimeRef.current * 1000
            : 0;

        socket.emit("playTrack", trackTitle, { resumeFrom: resumeTimeMs });
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
      onSkip: (nextTrackTitle) => {
        if (!socket?.connected) return;
        if (!audioRef.current) audioRef.current = new Audio();
        setCurrentTrackTitle(nextTrackTitle);
        audioPausedTimeRef.current = 0;
        socket.emit("playTrack", nextTrackTitle, { resumeFrom: 0 });
      },
      onPrevious: (prevTrackTitle) => {
        if (!socket?.connected) return;
        if (!audioRef.current) audioRef.current = new Audio();
        setCurrentTrackTitle(prevTrackTitle);
        audioPausedTimeRef.current = 0;
        socket.emit("playTrack", prevTrackTitle, { resumeFrom: 0 });
      },
    }),
    [play, socket, clearScheduledMidiEvents]
  );

  // --- Album Data for Menu ---
  const albumData = useMemo(
    () =>
      serverTracks.map((track) => ({
        title: track.title,
        audioSrc: track.audio,
      })),
    [serverTracks]
  );

  // --- Render ---
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
        <img src='/LOGOBIANCO.png' alt='logo' style={{ width: '200px' }} />
      </div>

      {!isFirstStart && (
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

      <Menu
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        audioControls={menuAudioControls}
        albumData={albumData}
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
            transition: 'opacity 1s',
            opacity: startClicked ? 0 : 1
          }}
        >
          <Canvas style={{ width: '100vw', height: '100vh' }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <AlbumCover3D onClick={handleFirstStart} />
          </Canvas>
          <button
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '20px',
              animation: 'blink 1s infinite',
              marginTop: '20px',
              position: 'absolute',
              bottom: '10%'
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
      `}</style>

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
          color={lightColor.scene}
        />
        <Scene
          instruments={instruments}
          lightColor={lightColor.directional}
          play={play}
          currentCarIndex={currentCarIndex}
          lastPausedPosition={lastPausedPosition}
        />
        <Effects currentSongIndex={currentSongIndex} shaderColor={shaderColor} />
      </Canvas>
    </div>
  );
}