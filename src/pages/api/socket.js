import { Server } from 'socket.io';
import MidiPlayer from 'midi-player-js';
import fs from 'fs';
import path from 'path';

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    console.log('*First use, starting socket.io');

    const io = new Server(res.socket.server);
    
    io.on('connection', socket => {
      console.log('New client connected');

      socket.on('start', () => {
        const midiFilePath = path.join(process.cwd(), 'traccia.mid');
        const midiFile = fs.readFileSync(midiFilePath);

        const Player = new MidiPlayer.Player();
        
        Player.loadArrayBuffer(midiFile);

        const startTime = Date.now();

        Player.on('playing', (currentTick) => {
          const currentTime = Date.now() - startTime;
          socket.emit('midiTick', { tick: currentTick, time: currentTime });
        });

        Player.on('midiEvent', (event) => {
          if (event.name === 'Note on' || event.name === 'Note off') {
            const currentTime = Date.now() - startTime;
            socket.emit('midiEvent', {
              ...event,
              time: currentTime
            });
          }
        });

        Player.play();
        console.log('MIDI playback started');
      });
    });

    res.socket.server.io = io;
  } else {
    console.log('socket.io already running');
  }
  res.end();
};

export default ioHandler;
