import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { realSphericalHarmonic, getPhaseColor } from '../utils/sphericalHarmonics';
import { HarmonicConfig } from '../types';

interface Props {
  config: HarmonicConfig;
}

const HarmonicMesh: React.FC<Props> = ({ config }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.LineSegments>(null);

  // Memoize geometry calculation to avoid expensive re-computation on every frame
  const geometry = useMemo(() => {
    const { l, m, resolution, amplitude, mode } = config;
    
    // We construct a grid
    const widthSegments = resolution;
    const heightSegments = resolution; 

    const positions: number[] = [];
    const colors: number[] = [];
    const indices: number[] = [];

    // 1. Generate Vertices
    for (let y = 0; y <= heightSegments; y++) {
      const v = y / heightSegments;
      const theta = v * Math.PI; // Polar angle [0, PI]

      for (let x = 0; x <= widthSegments; x++) {
        const u = x / widthSegments;
        const phi = u * 2 * Math.PI; // Azimuthal angle [0, 2PI]

        // Calculate Y_{l,m}
        const Y = realSphericalHarmonic(l, m, theta, phi);
        
        // Determine radius for visualization
        const absY = Math.abs(Y);
        let radius = 0;
        
        if (mode === 'density') {
           // Probability density |Y|^2
           radius = absY * absY * amplitude;
        } else {
           // Amplitude |Y| (Standard)
           radius = absY * amplitude;
        }

        // Convert spherical to cartesian
        // x = r sin(theta) cos(phi)
        // y = r sin(theta) sin(phi)
        // z = r cos(theta)
        // Mapping: Math Z -> Three Y (Up), Math X -> Three X, Math Y -> Three Z (Depth)
        
        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);

        const px = radius * sinTheta * cosPhi;
        const py = radius * cosTheta; 
        const pz = radius * sinTheta * sinPhi; 

        positions.push(px, py, pz);

        // Color based on phase (sign of Y)
        const [r, g, b] = getPhaseColor(Y);
        colors.push(r, g, b);
      }
    }

    // 2. Generate Indices
    for (let y = 0; y < heightSegments; y++) {
      for (let x = 0; x < widthSegments; x++) {
        const a = (widthSegments + 1) * y + x;
        const b = (widthSegments + 1) * (y + 1) + x;
        const c = (widthSegments + 1) * (y + 1) + (x + 1);
        const d = (widthSegments + 1) * y + (x + 1);

        indices.push(a, d, b);
        indices.push(b, d, c);
      }
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geom.setIndex(indices);
    geom.computeVertexNormals();

    return geom;
  }, [config.l, config.m, config.resolution, config.amplitude, config.mode]);

  // Clean up geometry when it updates to prevent memory leaks
  useEffect(() => {
    return () => geometry.dispose();
  }, [geometry]);

  return (
    <group>
      <mesh ref={meshRef} geometry={geometry}>
        <meshPhysicalMaterial 
            vertexColors={true} 
            side={THREE.DoubleSide} 
            metalness={0.2}
            roughness={0.4}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
        />
      </mesh>

      {config.showWireframe && (
        <lineSegments ref={wireframeRef}>
            <wireframeGeometry args={[geometry]} />
            <lineBasicMaterial color="#ffffff" transparent opacity={0.1} />
        </lineSegments>
      )}
    </group>
  );
};

export default HarmonicMesh;