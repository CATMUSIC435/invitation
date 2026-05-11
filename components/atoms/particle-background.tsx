'use client';

import { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Sparkles, Float } from '@react-three/drei';
import * as THREE from 'three';

function InteractiveRig({ children }: { children: React.ReactNode }) {
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Chuẩn hóa tọa độ chuột từ -1 đến 1
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    // Parallax effect: di chuyển nhẹ camera theo trỏ chuột với lerp để tạo độ mượt
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, mouse.current.x * 2, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, mouse.current.y * 2, 0.05);
    
    // Luôn hướng camera về tâm
    state.camera.lookAt(0, 0, 0);
  });

  return <group>{children}</group>;
}

export default function ParticleBackground() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none bg-[#0a1520]">
      {/* Lớp gradient overlay tạo chiều sâu */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1520]/80 via-transparent to-[#0a1520]/80 z-10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0a1520_100%)] z-10"></div>
      
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        
        <InteractiveRig>
          {/* Nền sao lấp lánh (Background depth) */}
          <Stars 
            radius={50} 
            depth={50} 
            count={3000} 
            factor={4} 
            saturation={0} 
            fade 
            speed={0.5} 
          />

          {/* Các hạt bụi vàng lơ lửng (Foreground luxury elements) */}
          <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <Sparkles 
              count={150} 
              scale={12} 
              size={4} 
              speed={0.4} 
              opacity={0.3} 
              color="#c19d68" 
            />
          </Float>
          
          {/* Lớp hạt vàng nhỏ hơn ở giữa */}
          <Float speed={1.5} rotationIntensity={0.8} floatIntensity={1.5}>
            <Sparkles 
              count={300} 
              scale={20} 
              size={2} 
              speed={0.2} 
              opacity={0.15} 
              color="#d3b27d" 
            />
          </Float>
        </InteractiveRig>
      </Canvas>
    </div>
  );
}
