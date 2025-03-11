import { Server } from "socket.io";
import MidiPlayer from "midi-player-js";
import fs from "fs";
import path from "path";

// Mapping of track names to file paths (for now, all point to the same file)
const TRACKS = {
  "Song 1": { midi: "traccia.mid", audio: "/traccia.mp3" },
  "Song 2": { midi: "traccia.mid", audio: "/traccia.mp3" },
  "Song 3": { midi: "traccia.mid", audio: "/traccia.mp3" },
};

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);
    let currentPlayer = null; // Store current player instance

    io.on("connection", (socket) => {
      // Get available tracks
      socket.on("getTracks", () => {
        const trackList = Object.keys(TRACKS).map(name => ({
          title: name,
          audio: TRACKS[name].audio
        }));
        socket.emit("trackList", trackList);
      });

      // Handle start playback for any track
      socket.on("playTrack", (trackTitle) => {
        // Stop any currently playing track
        if (currentPlayer) {
          currentPlayer.stop();
        }

        // Get track info or default to first track
        const trackInfo = TRACKS[trackTitle] || TRACKS["Song 1"];
        const midiFilePath = path.join(process.cwd(), trackInfo.midi);
        
        try {
          const midiFile = fs.readFileSync(midiFilePath);
          currentPlayer = new MidiPlayer.Player();
          currentPlayer.loadArrayBuffer(midiFile);

          const startTime = Date.now();

          // Throttle MIDI tick events to reduce network traffic
          let lastTickTime = 0;
          currentPlayer.on("playing", (currentTick) => {
            const now = Date.now();
            if (now - lastTickTime > 100) { // Only send ticks every 100ms
              lastTickTime = now;
              const currentTime = now - startTime;
              socket.emit("midiTick", { tick: currentTick, time: currentTime });
            }
          });

          currentPlayer.on("midiEvent", (event) => {
            if (event.name === "Note on" || event.name === "Note off") {
              const currentTime = Date.now() - startTime;
              socket.emit("midiEvent", {
                ...event,
                time: currentTime,
              });
            }
          });

          currentPlayer.play();
          
          // Return the audio file path to be played
          socket.emit("trackStarted", {
            title: trackTitle,
            audio: trackInfo.audio
          });
        } catch (error) {
          socket.emit("playbackError", { error: "Failed to load MIDI file" });
        }
      });

      // Handle stop command
      socket.on("stopTrack", () => {
        if (currentPlayer) {
          currentPlayer.stop();
        }
      });

      // Legacy support for old "start" event
      socket.on("start", () => {
        socket.emit("trackStarted", {
          title: "Song 1",
          audio: TRACKS["Song 1"].audio
        });
        
        const midiFilePath = path.join(process.cwd(), TRACKS["Song 1"].midi);
        try {
          const midiFile = fs.readFileSync(midiFilePath);
          currentPlayer = new MidiPlayer.Player();
          currentPlayer.loadArrayBuffer(midiFile);

          const startTime = Date.now();

          // Throttle MIDI tick events
          let lastTickTime = 0;
          currentPlayer.on("playing", (currentTick) => {
            const now = Date.now();
            if (now - lastTickTime > 100) { // Only send ticks every 100ms
              lastTickTime = now;
              const currentTime = now - startTime;
              socket.emit("midiTick", { tick: currentTick, time: currentTime });
            }
          });

          currentPlayer.on("midiEvent", (event) => {
            if (event.name === "Note on" || event.name === "Note off") {
              const currentTime = Date.now() - startTime;
              socket.emit("midiEvent", {
                ...event,
                time: currentTime,
              });
            }
          });

          currentPlayer.play();
        } catch (error) {
          // Silent error handling
        }
      });
    });

    res.socket.server.io = io;
  }
  res.end();
};

export default ioHandler;
