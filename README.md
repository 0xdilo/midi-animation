# Interactive MIDI Visualization

A real-time 3D visualization of MIDI tracks using Three.js and React, featuring a gta san andreas inspired driving experience through a city.
This project was created for a friend launching their own EP. 
The MIDI file contains two tracks: one for kicks and one for snares. The idea was to synchronize these tracks with the visuals.
Code is a mess btw


## 🎮 How It Works

The application creates a synchronized audio-visual experience by:

1. Loading a MIDI file on the server
2. Streaming MIDI events to the client via WebSocket
3. Translating MIDI events into visual effects:
   - Track 0: Controls neon light colors
   - Track 1: Triggers camera movements

## 🎵 MIDI Implementation

The visualization responds to two MIDI tracks:
- **Track 0:** Changes the car's neon light colors
- **Track 1:** Switches between normal and chase camera modes

## 🛠 Setup

1. Clone the repository:
```bash
git clone https://github.com/0xdilo/midi-animation.git
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser
