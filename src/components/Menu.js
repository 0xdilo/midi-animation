// components/Menu.js
import { useEffect, useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { TextureLoader } from "three";
import { FaGlobe, FaInstagram, FaTwitter } from "react-icons/fa";

// Static cover paths, assuming order matches serverTracks from server
// If serverTracks has more items than this array, covers will cycle.
const albumCovers = ["/album.png", "/album2.png", "/album3.png"];

export default function Menu({
  menuOpen,
  setMenuOpen,
  audioControls,
  albumData = [], // Expects array like [{ title: "Song 1", audioSrc: "/path" }, ...]
  currentTrackTitle,
}) {
  const [currentAlbumIndex, setCurrentAlbumIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const iconSize = 100;

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
    albumCovers[currentAlbumIndex % albumCovers.length] || "/album.png"; // Fallback cover

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: "50%",
        transform: `translateX(-50%) translateY(${menuOpen ? "0" : "100%"})`,
        zIndex: 25, // Ensure this is high enough, but index.js button is 20
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.85)",
        transition: "transform 0.3s ease",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        // zIndex: 1000, // This was in original, ensure it's what you want relative to other elements
      }}
    >
      <div
        style={{
          textAlign: "center",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          padding: "20px 0",
          overflow: "hidden",
          "@media (maxWidth: 768px)": {
            padding: "0",
          },
        }}
      >
        <div
          style={{
            height: "100%",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            "&::-webkitScrollbar": {
              display: "none",
            },
          }}
        >
          <div
            style={{
              width: "min(90vw, 600px)",
              height: "min(90vw, 600px)",
              margin: "0 auto 0px",
              marginTop: "100px",
            }}
          >
            <Canvas>
              <ambientLight intensity={1} />
              <pointLight position={[10, 10, 10]} />
              <LevitatingAlbumCover textureUrl={currentCover} />
            </Canvas>
          </div>

          <h3
            style={{
              color: "#fff",
              fontFamily: '"Press Start 2P", cursive',
              fontSize: "clamp(24px, 5vw, 36px)",
              textShadow: "2px 2px 0px #000",
              marginTop: "50px",
            }}
          >
            {currentAlbumDisplay?.title || "Loading Tracks..."}
          </h3>

          {/* Control Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              marginBottom: "30px",
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
                padding: "15px",
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
        </div>
        {/* Social Links */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "15px",
            padding: "0px", // Was 20px, check if 0px is intended
            width: "100%",
          }}
        >
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#fff",
              fontSize: "30px",
              textDecoration: "none",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#1DA1F2")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#fff")}
          >
            <FaTwitter />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#fff",
              fontSize: "30px",
              textDecoration: "none",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#E1306C")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#fff")}
          >
            <FaInstagram />
          </a>
          <a
            href="https://yourportfolio.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#fff",
              fontSize: "30px",
              textDecoration: "none",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#FFDB58")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#fff")}
          >
            <FaGlobe />
          </a>
        </div>
      </div>

      <button
        onClick={() => setMenuOpen(false)}
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "10px",
          display: "block",
          transition: "color 0.2s ease",
          color: "#fff",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#FFDB58")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#fff")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          width={windowSize.width <= 768 ? 40 : 90}
          height={windowSize.width <= 768 ? 40 : 90}
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
