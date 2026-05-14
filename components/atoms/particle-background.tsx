'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function WaveGrid() {
  const lineCount = 40;        // Giảm một nửa (từ 80 -> 40) để tối ưu CPU
  const pointsCount = 100;     // Giảm một nửa (từ 200 -> 100) để tối ưu CPU
  const separation = 24;       // Tăng gấp đôi khoảng cách để giữ nguyên diện tích bao phủ

  const linesRef = useRef<THREE.Line[]>([]);

  // Khởi tạo các mảng Geometry tĩnh một lần duy nhất
  const geometries = useMemo(() => {
    const geos: THREE.BufferGeometry[] = [];
    for (let i = 0; i < lineCount; i++) {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(pointsCount * 3);

      for (let j = 0; j < pointsCount; j++) {
        positions[j * 3] = (j - pointsCount / 2) * separation;
        positions[j * 3 + 1] = 0;
        positions[j * 3 + 2] = (i - lineCount / 2) * separation;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geos.push(geometry);
    }
    return geos;
  }, [lineCount, pointsCount, separation]);

  // Vòng lặp Animation Frame (tương đương function animate())
  useFrame((state) => {
    const time = state.clock.getElapsedTime() * 0.25; // Chậm

    linesRef.current.forEach((line, i) => {
      if (!line) return;

      const positions = line.geometry.attributes.position.array as Float32Array;
      const z = (i - lineCount / 2) * separation;

      for (let j = 0; j < pointsCount; j++) {
        const x = (j - pointsCount / 2) * separation;
        const index = j * 3;

        // Mượt mà, biên độ thấp
        const wave1 = Math.sin(x * 0.005 + time) * 60;
        const wave2 = Math.sin(z * 0.008 + time * 0.8) * 45;
        const wave3 = Math.cos((x * 0.01) + (z * 0.01) - time) * 25;

        positions[index + 1] = wave1 + wave2 + wave3;
      }

      line.geometry.attributes.position.needsUpdate = true;
    });
  });

  return (
    <group position={[0, -80, 0]}>
      {geometries.map((geo, i) => (
        <group key={i}>
          {/* Lưới các đường Line */}
          {/* @ts-ignore */}
          <line ref={(el: any) => { if (el) linesRef.current[i] = el; }} geometry={geo}>
            <lineBasicMaterial
              color={0x4aa3df}
              transparent={true}
              opacity={0.1}
              blending={THREE.AdditiveBlending}
            />
          </line>

          {/* Lưới các hạt Points xen kẽ */}
          {i % 2 === 0 && (
            <points geometry={geo}>
              <pointsMaterial
                color={0xffffff}
                size={1.5}
                transparent={true}
                opacity={0.25}
                blending={THREE.AdditiveBlending}
              />
            </points>
          )}
        </group>
      ))}
    </group>
  );
}

export default function ParticleBackground() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none bg-[#0a1520]">
      <Canvas
        camera={{ position: [0, 200, 500], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <WaveGrid />
      </Canvas>
    </div>
  );
}
