// components/Menu.js
import { useEffect, useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { TextureLoader } from "three";
import { FaGlobe, FaInstagram, FaBandcamp } from "react-icons/fa";

// Static cover paths, assuming order matches serverTracks from server
// If serverTracks has more items than this array, covers will cycle.
const albumCovers = [
  "/album.webp",
  "/album2.webp",
  "/album3.webp",
  "/album4.webp",
  "/album5.webp",
];

export default function Menu({
  menuOpen,
  setMenuOpen,
  audioControls,
  albumData = [], // Expects array like [{ title: "Song 1", audioSrc: "/path" }, ...]
  currentTrackTitle,
  isFirstStart = false,
}) {
  const [currentAlbumIndex, setCurrentAlbumIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isClosing, setIsClosing] = useState(false);
  const iconSize = windowSize.width <= 768 ? 50 : 100;

  useEffect(() => {
    if (audioControls) {
      setIsPlaying(audioControls.isPlaying);
    }
  }, [audioControls?.isPlaying]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (albumData && albumData.length > 0) {
      if (currentTrackTitle) {
        const idx = albumData.findIndex(
          (album) => album.title === currentTrackTitle,
        );
        if (idx !== -1) {
          setCurrentAlbumIndex(idx);
        } else {
          // Fallback if currentTrackTitle isn't in albumData (e.g. list updated)
          setCurrentAlbumIndex(0);
        }
      } else {
        // Default to first album if no specific title is set yet
        setCurrentAlbumIndex(0);
      }
    }
  }, [currentTrackTitle, albumData]);

  const handlePlayToggle = () => {
    if (!albumData || albumData.length === 0) return;
    const currentTrackInfo = albumData[currentAlbumIndex];
    if (!currentTrackInfo) return;

    if (isPlaying) {
      audioControls?.onStop();
    } else {
      audioControls?.onPlay(currentTrackInfo.title);
    }
  };

  const handleSkip = () => {
    if (!albumData || albumData.length === 0) return;
    const nextAlbumIdx = (currentAlbumIndex + 1) % albumData.length;
    const nextTrackInfo = albumData[nextAlbumIdx];
    if (!nextTrackInfo) return;
    // setCurrentAlbumIndex will be updated via useEffect reacting to currentTrackTitle prop change
    audioControls?.onSkip(nextTrackInfo.title);
  };

  const handlePrevious = () => {
    if (!albumData || albumData.length === 0) return;
    const prevAlbumIdx =
      (currentAlbumIndex - 1 + albumData.length) % albumData.length;
    const prevTrackInfo = albumData[prevAlbumIdx];
    if (!prevTrackInfo) return;
    // setCurrentAlbumIndex will be updated via useEffect reacting to currentTrackTitle prop change
    audioControls?.onPrevious(prevTrackInfo.title);
  };

  const currentAlbumDisplay = albumData[currentAlbumIndex];
  const currentCover =
    albumCovers[currentAlbumIndex % albumCovers.length] || "/album.webp"; // Fallback cover

  // Handle menu close animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setMenuOpen(false);
      setIsClosing(false);
    }, 300); // Match animation duration
  };

  // Don't show menu on first start screen to prevent layout issues
  if ((!menuOpen && !isClosing) || isFirstStart) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100dvh",
        background: "rgba(0,0,0,0.95)",
        zIndex: isFirstStart ? -1 : 1000,
        display: isFirstStart ? "none" : "flex",
        flexDirection: "column",
        justifyContent:
          windowSize.width <= 768 ? "space-between" : "space-evenly",
        alignItems: "center",
        padding: windowSize.width <= 768 ? "8px 10px" : "20px",
        boxSizing: "border-box",
        overflow: "hidden", // No scrolling allowed
        animation: isClosing
          ? "menuSlideOut 0.3s ease-in"
          : "menuSlide 0.3s ease-out",
        visibility: isFirstStart ? "hidden" : "visible",
        opacity: isFirstStart ? 0 : 1,
        transform: isClosing ? "translateY(100%)" : "translateY(0)",
      }}
    >
      {/* Album cover */}
      <div
        style={{
          width:
            windowSize.width <= 768 ? "min(500px, 50vh)" : "min(600px, 60vh)",
          height:
            windowSize.width <= 768 ? "min(500px, 50vh)" : "min(600px, 60vh)",
          marginBottom: windowSize.width <= 768 ? "5px" : "20px",
          marginTop: windowSize.width <= 768 ? "15px" : "0px",
          flexShrink: 0,
        }}
      >
        <Canvas>
          <ambientLight intensity={1} />
          <pointLight position={[10, 10, 10]} />
          <LevitatingAlbumCover textureUrl={currentCover} />
        </Canvas>
      </div>

      {/* Track info */}
      <div
        style={{
          textAlign: "center",
          color: "#fff",
          padding: "0 10px",
          flexShrink: 0,
        }}
      >
        <h2
          style={{
            fontSize:
              windowSize.width <= 768 ? "18px" : "clamp(16px, 4vw, 24px)",
            marginBottom: windowSize.width <= 768 ? "5px" : "10px",
            fontFamily: '"Press Start 2P", cursive',
            lineHeight: 1.2,
            wordBreak: "break-word",
            textShadow: "2px 2px 0px #000",
          }}
        >
          {currentAlbumDisplay?.title || "Loading Tracks..."}
        </h2>
        <p
          style={{
            fontSize:
              windowSize.width <= 768 ? "7px" : "clamp(10px, 3vw, 10px)",
            fontFamily: '"Press Start 2P", cursive',

            opacity: 0.8,
            marginBottom: 0,
          }}
        >
          {currentAlbumIndex + 1} / {albumData.length}
        </p>
      </div>

      {/* Controls */}
      <div
        style={{
          display: "flex",
          marginBottom: "30px",
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <button
          onClick={handlePrevious}
          style={{
            padding: "15px",
            background: "transparent",
            color: "#fff",
            border: "0",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "60px",
            height: "60px",
            transition: "color 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#FFDB58")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#fff")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            width={iconSize}
            height={iconSize}
            fill="currentColor"
            style={{
              transform: "rotate(180deg)",
              transition: "fill 0.2s ease",
            }}
          >
            <g>
              <rect x="36" y="54" width="9" height="9" />
              <polygon points="27,36 36,36 36,27 27,27 27,18 18,18 18,71.667 18,81 27,81 27,72 36,72 36,63 27,63  " />
              <rect x="36" y="36" width="9" height="9" />
              <rect x="72" y="54" width="9" height="9" />
              <polygon points="63,36 72,36 72,27 63,27 63,18 54,18 54,45 45,45 45,54 54,54 54,71.667 54,81 63,81 63,72 72,72 72,63 63,63  " />
              <rect x="72" y="36" width="9" height="9" />
              <rect x="81" y="45" width="9" height="9" />
            </g>
          </svg>
        </button>
        <button
          onClick={handlePlayToggle}
          style={{
            padding: "10px",
            background: "rgba(0,0,0,0)",
            border: "2px solid #fff",
            color: "#fff",
            cursor: "pointer",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "60px",
            height: "60px",
            transition: "color 0.2s ease, border-color 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#FFDB58";
            e.currentTarget.style.borderColor = "#FFDB58";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#fff";
            e.currentTarget.style.borderColor = "#fff";
          }}
        >
          {isPlaying ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              width={iconSize}
              height={iconSize}
              fill="currentColor"
              style={{
                transition: "fill 0.2s ease",
              }}
            >
              <g>
                <polygon points="55,37 55,49 55,61 55,73 64,73 64,61 64,49 64,37" />
                <polygon points="37,49 37,61 37,73 46,73 46,61 46,49 46,37 37,37" />
              </g>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              width={iconSize}
              height={iconSize}
              fill="currentColor"
            >
              <g>
                <rect x="55" y="55" width="9" height="9" />
                <polygon points="46,37 55,37 55,28 46,28 46,19 37,19 37,72.667 37,82 46,82 46,73 55,73 55,64 46,64  " />
                <rect x="55" y="37" width="9" height="9" />
                <rect x="64" y="46" width="9" height="9" />
              </g>
            </svg>
          )}
        </button>
        <button
          onClick={handleSkip}
          style={{
            padding: "15px",
            background: "rgba(0,0,0,0)",
            border: "0",
            color: "#fff",
            cursor: "pointer",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "60px",
            height: "60px",

            transition: "color 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#FFDB58")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#fff")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            width={iconSize}
            height={iconSize}
            fill="currentColor"
            style={{
              transition: "fill 0.2s ease",
            }}
          >
            <g>
              <rect x="36" y="54" width="9" height="9" />
              <polygon points="27,36 36,36 36,27 27,27 27,18 18,18 18,71.667 18,81 27,81 27,72 36,72 36,63 27,63  " />
              <rect x="36" y="36" width="9" height="9" />
              <rect x="72" y="54" width="9" height="9" />
              <polygon points="63,36 72,36 72,27 63,27 63,18 54,18 54,45 45,45 45,54 54,54 54,71.667 54,81 63,81 63,72 72,72 72,63 63,63  " />
              <rect x="72" y="36" width="9" height="9" />
              <rect x="81" y="45" width="9" height="9" />
            </g>
          </svg>
        </button>
      </div>

      {/* Bottom section with social links and download */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: windowSize.width <= 768 ? "8px" : "15px",
          flexShrink: 0,
        }}
      >
        {/* Social Links */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: windowSize.width <= 768 ? "15px" : "20px",
            width: "100%",
            marginBottom: windowSize.width <= 768 ? "5px" : "10px",
          }}
        >
          <a
            href="https://rogian.bandcamp.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#fff",
              fontSize: windowSize.width <= 768 ? "24px" : "30px",
              textDecoration: "none",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#FFDB58")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#fff")}
          >
            <FaBandcamp />
          </a>
          <a
            href="https://www.instagram.com/rogian_van_lucas/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#fff",
              fontSize: windowSize.width <= 768 ? "24px" : "30px",
              textDecoration: "none",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#FFDB58")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#fff")}
          >
            <FaInstagram />
          </a>
          <a
            href="https://linktr.ee/rogian"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#fff",
              fontSize: windowSize.width <= 768 ? "24px" : "30px",
              textDecoration: "none",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#FFDB58")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#fff")}
          >
            <FaGlobe />
          </a>
        </div>

        {/* Download button */}
        <button
          style={{
            background: "#FFDB58",
            border: "2px solid #FFDB58",
            color: "#000",
            cursor: "pointer",
            padding: windowSize.width <= 768 ? "8px 16px" : "12px 24px",
            fontSize: windowSize.width <= 768 ? "10px" : "14px",
            fontFamily: '"Press Start 2P", cursive',
            borderRadius: "0",
            textShadow: "none",
            fontWeight: "bold",
            textTransform: "uppercase",
            letterSpacing: "1px",
            animation: "pulse 2s infinite",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#fff";
            e.currentTarget.style.borderColor = "#fff";
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#FFDB58";
            e.currentTarget.style.borderColor = "#FFDB58";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          DOWNLOAD NOW
        </button>
      </div>

      {/* Close button */}
      <button
        onClick={handleClose}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "10px",
          display: "block",
          transition: "color 0.2s ease",
          color: "#fff",
          zIndex: 1001,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#FFDB58")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#fff")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          width={windowSize.width <= 768 ? 40 : 60}
          height={windowSize.width <= 768 ? 40 : 60}
          fill="currentColor"
        >
          <g>
            <rect x="53" y="36" width="9" height="9" />
            <rect x="35" y="54" width="9" height="9" />
            <rect x="26" y="63" width="9" height="9" />
            <rect x="62" y="27" width="9" height="9" />
            <rect x="35" y="36" width="9" height="9" />
            <rect x="44" y="45" width="9" height="9" />
            <rect x="53" y="54" width="9" height="9" />
            <rect x="62" y="63" width="9" height="9" />
            <rect x="26" y="27" width="9" height="9" />
          </g>
        </svg>
      </button>
    </div>
  );
}

function LevitatingAlbumCover({ textureUrl }) {
  const texture = useMemo(() => {
    if (!textureUrl) return null; // Handle undefined textureUrl
    const loader = new TextureLoader();
    return loader.load(textureUrl);
  }, [textureUrl]);

  const meshRef = useRef();
  const lastTimeRef = useRef(0);

  useFrame(({ clock }) => {
    const currentTime = clock.getElapsedTime();
    if (currentTime - lastTimeRef.current > 0.03 && meshRef.current) {
      meshRef.current.position.y = Math.sin(currentTime) * 0.3;
      meshRef.current.rotation.y += 0.005;
      lastTimeRef.current = currentTime;
    }
  });

  useEffect(() => {
    return () => {
      if (texture) {
        texture.dispose();
      }
    };
  }, [texture]);

  if (!texture) return null; // Don't render mesh if texture isn't loaded/available

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[4, 4, 0.2]} />
      <meshBasicMaterial map={texture} transparent opacity={0.99} />
    </mesh>
  );
}
