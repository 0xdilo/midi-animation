import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';

export function PerformanceMonitor({ onUpdate }) {
  const [fps, setFps] = useState(0);
  const [memory, setMemory] = useState({ used: 0, total: 0 });
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const { gl, camera } = useThree();

  useFrame(() => {
    frameCount.current += 1;
    const currentTime = performance.now();
    
    if (currentTime - lastTime.current >= 1000) {
      const currentFps = Math.round((frameCount.current * 1000) / (currentTime - lastTime.current));
      setFps(currentFps);
      frameCount.current = 0;
      lastTime.current = currentTime;
      
      // Memory monitoring
      if (typeof performance !== 'undefined' && performance.memory) {
        const memInfo = {
          used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024)
        };
        setMemory(memInfo);
      }
      
      // WebGL info
      const info = gl.info;
      const stats = {
        fps: currentFps,
        memory: (typeof performance !== 'undefined' && performance.memory) ? memory.used : 0,
        geometries: info.memory.geometries,
        textures: info.memory.textures,
        programs: info.programs?.length || 0,
        calls: info.render.calls,
        triangles: info.render.triangles,
        points: info.render.points,
        lines: info.render.lines
      };
      
      if (onUpdate) onUpdate(stats);
    }
  });

  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
    return (
      <Html position={[0, 0, 0]} style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontFamily: 'monospace',
        fontSize: '12px',
        zIndex: 1000,
        minWidth: '200px',
        pointerEvents: 'none'
      }}>
        <div>FPS: {fps}</div>
        {typeof performance !== 'undefined' && performance.memory && (
          <div>Memory: {memory.used}MB / {memory.total}MB</div>
        )}
        <div>Geometries: {gl.info.memory.geometries}</div>
        <div>Textures: {gl.info.memory.textures}</div>
        <div>Draw Calls: {gl.info.render.calls}</div>
        <div>Triangles: {gl.info.render.triangles.toLocaleString()}</div>
        <div>Camera Position: X: {camera.position.x.toFixed(2)}, Y: {camera.position.y.toFixed(2)}, Z: {camera.position.z.toFixed(2)}</div>
        
      </Html>
    );
  }

  return null;
}