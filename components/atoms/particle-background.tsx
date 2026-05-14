'use client';

import { useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function WaveGrid() {
  const lineCount = 40;
  const pointsCount = 100;
  const separation = 24;

  const uniforms = useMemo(() => ({
    uTime: { value: 0 }
  }), []);

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

  const vertexShader = `
    uniform float uTime;
    void main() {
      vec3 pos = position;
      float wave1 = sin(pos.x * 0.005 + uTime) * 60.0;
      float wave2 = sin(pos.z * 0.008 + uTime * 0.8) * 45.0;
      float wave3 = cos((pos.x * 0.01) + (pos.z * 0.01) - uTime) * 25.0;
      pos.y = wave1 + wave2 + wave3;
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      gl_PointSize = 1.5 * (300.0 / -mvPosition.z);
    }
  `;

  useFrame((state) => {
    uniforms.uTime.value = state.clock.getElapsedTime() * 0.25;
  });

  return (
    <group position={[0, -80, 0]}>
      {geometries.map((geo, i) => (
        <group key={i}>
          <line geometry={geo}>
            <shaderMaterial
              uniforms={uniforms}
              vertexShader={vertexShader}
              fragmentShader={\`
                void main() {
                  gl_FragColor = vec4(0.29, 0.64, 0.87, 0.1); // #4aa3df with 0.1 opacity
                }
              \`}
              transparent={true}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </line>
          {i % 2 === 0 && (
            <points geometry={geo}>
              <shaderMaterial
                uniforms={uniforms}
                vertexShader={vertexShader}
                fragmentShader={\`
                  void main() {
                    gl_FragColor = vec4(1.0, 1.0, 1.0, 0.25); // white with 0.25 opacity
                  }
                \`}
                transparent={true}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
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
