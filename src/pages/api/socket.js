import { Server } from "socket.io";
import MidiPlayer from "midi-player-js";
import fs from "fs";
import path from "path";

// Helper function to calculate MIDI ticks from milliseconds
// Uses player's tempo and division for better accuracy if available
function msToTicksAccurate(ms, player) {
  if (
    !player ||
    typeof player.division !== "number" ||
    typeof player.tempo !== "number" ||
    player.tempo === 0
  ) {
    const defaultBpm = 120;
    const defaultTicksPerBeat =
      player && typeof player.division === "number" ? player.division : 960; // Common default
    const beatsPerSecond = defaultBpm / 60;
    const ticksPerSecond = defaultTicksPerBeat * beatsPerSecond;

    return Math.floor((ms / 1000) * ticksPerSecond);
  }
  // player.tempo is microseconds per beat
  // player.division is ticks per beat
  const ticksPerMillisecond = (player.division * 1000) / player.tempo;
  return Math.floor(ms * ticksPerMillisecond);
}

const TRACKS = {
  "Song 1": { midi: "public/traccia.mid", audio: "/traccia.mp3" }, // Ensure audio path is web-accessible
  "Song 2": { midi: "public/traccia.mid", audio: "/traccia.mp3" },
  "Song 3": { midi: "public/traccia.mid", audio: "/traccia.mp3" },
};

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);
    let currentPlayer = null;
    let lastPausedTickByTrack = {}; // Store last paused tick per track title
    let lastPlayedTrackTitle = null; // Keep track of the song instance being controlled
    let serverGlobalStartTime = 0; // Reference: Date.now() at client's 0ms playback point

    const playTrackLogic = (socket, trackTitle, options = {}) => {
      const clientReportedAudioTimeMs = options.resumeFrom || 0;

      if (currentPlayer) {
        currentPlayer.stop(); // Stop any existing player
      }

      const trackInfo = TRACKS[trackTitle];
      if (!trackInfo) {
        socket.emit("playbackError", {
          error: `Track "${trackTitle}" not found.`,
        });
        return;
      }
      const midiFilePath = path.join(process.cwd(), trackInfo.midi);

      try {
        const midiFile = fs.readFileSync(midiFilePath);
        currentPlayer = new MidiPlayer.Player();
        currentPlayer.loadArrayBuffer(midiFile);

        // Align server's time reference with the client's audio timeline
        serverGlobalStartTime = Date.now() - clientReportedAudioTimeMs;

        let effectiveResumeTicks = 0;

        // Check if we are resuming the *exact same track instance* that was paused
        if (
          trackTitle === lastPlayedTrackTitle &&
          lastPausedTickByTrack[trackTitle] !== undefined &&
          clientReportedAudioTimeMs > 0 // And client is actually trying to resume
        ) {
          effectiveResumeTicks = lastPausedTickByTrack[trackTitle];
        } else if (clientReportedAudioTimeMs > 0) {
          // Seeking to a specific time (could be a new play at offset, or resume without exact prior pause tick)
          effectiveResumeTicks = msToTicksAccurate(
            clientReportedAudioTimeMs,
            currentPlayer, // Pass player for potentially better tick calculation
          );
          // If we are seeking, clear any old tick for this track as it might not correspond
          delete lastPausedTickByTrack[trackTitle];
        } else {
          // Starting from the beginning
          delete lastPausedTickByTrack[trackTitle]; // Clear any old tick
        }

        // --- MODIFIED SEEKING LOGIC ---
        const reportedTotalTicks = currentPlayer.getTotalTicks(); // Get it for logging

        if (effectiveResumeTicks > 0) {
          currentPlayer.skipToTick(effectiveResumeTicks);
          // We are now relying on skipToTick to handle the value correctly,
          // as the previous check against getTotalTicks() was failing due to it returning 0.
        }
        // --- END OF MODIFIED SEEKING LOGIC ---

        lastPlayedTrackTitle = trackTitle; // Update the currently playing track title

        let lastTickEmitTime = 0;
        const tickEmitInterval = 100; // ms, throttle tick updates

        currentPlayer.on("playing", (currentTickEvent) => {
          const now = Date.now();
          if (now - lastTickEmitTime > tickEmitInterval) {
            lastTickEmitTime = now;
            const eventTime = now - serverGlobalStartTime;
            socket.emit("midiTick", {
              tick: currentTickEvent.tick,
              time: eventTime, // Timestamp relative to shared timeline
            });
          }
        });

        currentPlayer.on("midiEvent", (event) => {
          if (event.name === "Note on" || event.name === "Note off") {
            const eventTime = Date.now() - serverGlobalStartTime; // Use Date.now() for fresh timestamp
            socket.emit("midiEvent", { ...event, time: eventTime });
          }
        });

        currentPlayer.on("endOfFile", () => {
          socket.emit("trackEnded", { title: trackTitle });
          if (currentPlayer) currentPlayer.stop(); // Ensure player is stopped
          delete lastPausedTickByTrack[trackTitle];
          // lastPlayedTrackTitle = null; // Or keep it to allow replaying the last track
        });

        currentPlayer.play(); // Play the MIDI

        // Emit trackStarted AFTER play() has been called.
        // The values for totalTicks and durationMs will be what the player reports at this stage.
        const currentTotalTicks = currentPlayer.getTotalTicks();
        const currentDurationMs = currentPlayer.getSongTime() * 1000;

        socket.emit("trackStarted", {
          title: trackTitle,
          audio: trackInfo.audio,
          resumedFrom: clientReportedAudioTimeMs, // Client uses this to sync its audio.currentTime and startTimeRef
          totalTicks: currentTotalTicks,
          durationMs: currentDurationMs,
        });
      } catch (error) {
        socket.emit("playbackError", {
          error: `Failed to load or play MIDI for "${trackTitle}": ${error.message}`,
        });
      }
    };

    io.on("connection", (socket) => {
      socket.on("getTracks", () => {
        const trackList = Object.keys(TRACKS).map((name) => ({
          title: name,
          audio: TRACKS[name].audio, // Client needs this to load the audio
        }));
        socket.emit("trackList", trackList);
      });

      socket.on("playTrack", (trackTitle, options = {}) => {
        playTrackLogic(socket, trackTitle, options);
      });

      socket.on("stopTrack", () => {
        if (currentPlayer && lastPlayedTrackTitle) {
          // Check if player is actually playing to get a meaningful current tick for pause
          if (currentPlayer.isPlaying()) {
            const currentTick = currentPlayer.getCurrentTick();
            // midi-player-js docs say getCurrentTick() returns a number.
            if (typeof currentTick === "number") {
              lastPausedTickByTrack[lastPlayedTrackTitle] = currentTick;
              const serverElapsedMs = Date.now() - serverGlobalStartTime;
            } else {
            }
          } else {
            // If player was already stopped or finished, lastPausedTickByTrack might already be set or should be from endOfFile
          }
          currentPlayer.stop(); // Stop the player regardless
          socket.emit("trackStopped", { title: lastPlayedTrackTitle }); // Inform client
        } else {
        }
      });

      // Legacy "start" event: map to playTrackLogic for "Song 1"
      socket.on("start", (options = {}) => {
        playTrackLogic(socket, "Song 1", options);
      });

      socket.on("disconnect", () => {
        if (currentPlayer) {
          currentPlayer.stop();
          currentPlayer = null; // Clear the player instance
        }

      });
    });
    res.socket.server.io = io;
  } else {
  }
  res.end();
};

export default ioHandler;

