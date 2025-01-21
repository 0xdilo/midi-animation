// components/Menu.js
import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { TextureLoader } from "three";
import { FaGlobe, FaInstagram, FaTwitter } from "react-icons/fa"; // Icons for buttons and social links

export default function Menu(
  { menuOpen, setMenuOpen, onPlay, onStop, onSkip, onPrevious },
) {
  const [currentAlbum, setCurrentAlbum] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const iconSize = 100; // Control icon size from here

  useEffect(() => {
    // Only execute on client side
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Set initial size
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Example album data (replace with your actual data)
  const albums = [
    {
      title: "Song 1",
      cover: "/album.png", // Path to the album cover image
      audio: "/music1.mp3", // Path to the audio file
    },
    {
      title: "Song 2",
      cover: "/album2.png",
      audio: "/music2.mp3",
    },
    {
      title: "Song 3",
      cover: "/album3.png",
      audio: "/music3.mp3",
    },
  ];

  // Handle album selection
  const handleAlbumChange = (index) => {
    setCurrentAlbum(index);
  };

  // Handle play/stop toggle
  const handlePlayToggle = () => {
    if (isPlaying) {
      onStop();
    } else {
      onPlay(albums[currentAlbum].audio);
    }
    setIsPlaying(!isPlaying);
  };

  // Handle skip button click
  const handleSkip = () => {
    const nextAlbum = (currentAlbum + 1) % albums.length;
    setCurrentAlbum(nextAlbum);
    onSkip(albums[nextAlbum].audio);
  };

  // Handle previous button click
  const handlePrevious = () => {
    const prevAlbum = (currentAlbum - 1 + albums.length) % albums.length;
    setCurrentAlbum(prevAlbum);
    onPrevious(albums[prevAlbum].audio);
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: "50%",
        transform: `translateX(-50%) translateY(${menuOpen ? "0" : "100%"})`,
        zIndex: 25,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.85)",
        transition: "transform 0.3s ease",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
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
          "@media (max-width: 768px)": {
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
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <h2
            style={{
              color: "#fff",
              fontFamily: '"Press Start 2P", cursive',
              fontSize: "clamp(40px, 8vw, 60px)",
              textShadow: "4px 4px 0px #accbf1",
              marginBottom: "20px",
            }}
          >
          </h2>

          {/* 3D Album Cover */}
          <div
            style={{
              width: "min(80vw, 500px)",
              height: "min(80vw, 500px)",
              margin: "0 auto 0px",
            }}
          >
            <Canvas>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <LevitatingAlbumCover textureUrl={albums[currentAlbum].cover} />
            </Canvas>
          </div>

          {/* Album Title */}
          <h3
            style={{
              color: "#fff",
              fontFamily: '"Press Start 2P", cursive',
              fontSize: "clamp(24px, 5vw, 36px)",
              textShadow: "2px 2px 0px #000",
            }}
          >
            {albums[currentAlbum].title}
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
              onMouseEnter={(e) => e.currentTarget.style.color = "#FFDB58"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#fff"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
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
              {isPlaying
                ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
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
                )
                : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
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
              onMouseEnter={(e) => e.currentTarget.style.color = "#FFDB58"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#fff"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
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
            padding: "0px",
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
            onMouseEnter={(e) => e.currentTarget.style.color = "#1DA1F2"}
            onMouseLeave={(e) => e.currentTarget.style.color = "#fff"}
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
            onMouseEnter={(e) => e.currentTarget.style.color = "#E1306C"}
            onMouseLeave={(e) => e.currentTarget.style.color = "#fff"}
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
            onMouseEnter={(e) => e.currentTarget.style.color = "#FFDB58"}
            onMouseLeave={(e) => e.currentTarget.style.color = "#fff"}
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
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = "#FFDB58"}
        onMouseLeave={(e) => e.currentTarget.style.color = "#fff"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
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

// 3D Album Cover with Levitation Animation
function LevitatingAlbumCover({ textureUrl }) {
  const texture = new TextureLoader().load(textureUrl);
  const meshRef = useRef();

  // Add levitation animation
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(clock.getElapsedTime()) * 0.5; // Smooth up and down motion
      meshRef.current.rotation.y += 0.01; // Slow rotation
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[4, 4, 0.2]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}
