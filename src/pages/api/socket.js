import { Server } from "socket.io";
import MidiPlayer from "midi-player-js";
import fs from "fs";
import path from "path";

// Helper function to calculate MIDI ticks from milliseconds
// This is an approximation - MIDI timing depends on tempo changes in the file
function msToTicks(ms, bpm = 120) {
  // MIDI files typically use 960 ticks per beat
  const ticksPerBeat = 960;
  const beatsPerSecond = bpm / 60;
  const ticksPerSecond = ticksPerBeat * beatsPerSecond;
  return Math.floor((ms / 1000) * ticksPerSecond);
}

// Mapping of track names to file paths (for now, all point to the same file)
const TRACKS = {
  "Song 1": { midi: "public/traccia.mid", audio: "public/traccia.mp3" },
  "Song 2": { midi: "public/traccia.mid", audio: "public/traccia.mp3" },
  "Song 3": { midi: "public/traccia.mid", audio: "public/traccia.mp3" },
};

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);
    let currentPlayer = null; // Store current player instance
    let lastPausedTick = 0;
    let lastPausedTimeMs = 0;
    let startTime = 0; // Track when playback started

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
      socket.on("playTrack", (trackTitle, options = {}) => {
        const resumeFromMs = options.resumeFrom || 0;
        const resumeTicks = msToTicks(resumeFromMs);

        if (currentPlayer) {
          currentPlayer.stop();
        }

        const trackInfo = TRACKS[trackTitle] || TRACKS["Song 1"];
        const midiFilePath = path.join(process.cwd(), trackInfo.midi);

        try {
          const midiFile = fs.readFileSync(midiFilePath);
          currentPlayer = new MidiPlayer.Player();
          currentPlayer.loadArrayBuffer(midiFile);

          startTime = Date.now() - resumeFromMs;
          let effectiveResumeTicks = resumeTicks;

          // If resuming from a pause and no new resumeFrom is provided, use last paused position
          if (resumeFromMs === lastPausedTimeMs && lastPausedTick > 0) {
            effectiveResumeTicks = lastPausedTick;
            console.log(`Resuming from last paused tick ${effectiveResumeTicks} (time ${resumeFromMs}ms)`);
          } else if (resumeFromMs > 0) {
            console.log(`Resuming from provided time ${resumeFromMs}ms / ${resumeTicks} ticks`);
          } else {
            lastPausedTick = 0; // Reset if starting fresh
            lastPausedTimeMs = 0;
            console.log("Starting from beginning");
          }

          if (effectiveResumeTicks > 0) {
            currentPlayer.skipToTick(effectiveResumeTicks);
          }

          let lastTickTime = 0;
          currentPlayer.on("playing", (currentTick) => {
            const now = Date.now();
            if (now - lastTickTime > 100) {
              lastTickTime = now;
              const currentTime = now - startTime;
              socket.emit("midiTick", { tick: currentTick, time: currentTime });
            }
          });

          currentPlayer.on("midiEvent", (event) => {
            if (event.name === "Note on" || event.name === "Note off") {
              const currentTime = Date.now() - startTime;
              socket.emit("midiEvent", { ...event, time: currentTime });
            }
          });

          currentPlayer.play();
          socket.emit("trackStarted", {
            title: trackTitle,
            audio: trackInfo.audio,
            resumedFrom: resumeFromMs
          });
        } catch (error) {
          console.error("MIDI playback error:", error);
          socket.emit("playbackError", { error: "Failed to load MIDI file" });
        }
      });

      // Handle stop command
      socket.on("stopTrack", () => {
        if (currentPlayer && currentPlayer.isPlaying()) {
          lastPausedTick = currentPlayer.getCurrentTick(); // Store the current MIDI tick
          lastPausedTimeMs = Date.now() - startTime; // Store the elapsed time in milliseconds
          console.log(`Stopped at tick ${lastPausedTick}, time ${lastPausedTimeMs}ms`);
          currentPlayer.stop();
        }
      });

      // Legacy support for old "start" event
      socket.on("start", (options = {}) => {
        const resumeFromMs = options.resumeFrom || 0;
        const resumeTicks = msToTicks(resumeFromMs);

        socket.emit("trackStarted", {
          title: "Song 1",
          audio: TRACKS["Song 1"].audio,
          resumedFrom: resumeFromMs
        });

        const midiFilePath = path.join(process.cwd(), TRACKS["Song 1"].midi);
        try {
          const midiFile = fs.readFileSync(midiFilePath);
          currentPlayer = new MidiPlayer.Player();
          currentPlayer.loadArrayBuffer(midiFile);

          startTime = Date.now() - resumeFromMs;
          let effectiveResumeTicks = resumeTicks;

          if (resumeFromMs === lastPausedTimeMs && lastPausedTick > 0) {
            effectiveResumeTicks = lastPausedTick;
            console.log(`Resuming from last paused tick ${effectiveResumeTicks} (time ${resumeFromMs}ms)`);
          } else if (resumeFromMs > 0) {
            console.log(`Resuming from provided time ${resumeFromMs}ms / ${resumeTicks} ticks`);
          } else {
            lastPausedTick = 0;
            lastPausedTimeMs = 0;
            console.log("Starting from beginning");
          }

          if (effectiveResumeTicks > 0) {
            currentPlayer.skipToTick(effectiveResumeTicks);
          }

          let lastTickTime = 0;
          currentPlayer.on("playing", (currentTick) => {
            const now = Date.now();
            if (now - lastTickTime > 100) {
              lastTickTime = now;
              const currentTime = now - startTime;
              socket.emit("midiTick", { tick: currentTick, time: currentTime });
            }
          });

          currentPlayer.on("midiEvent", (event) => {
            if (event.name === "Note on" || event.name === "Note off") {
              const currentTime = Date.now() - startTime;
              socket.emit("midiEvent", { ...event, time: currentTime });
            }
          });

          currentPlayer.play();
        } catch (error) {
          console.error("MIDI playback error:", error);
        }
      });
    });

    res.socket.server.io = io;
  }
  res.end();
};

export default ioHandler;
