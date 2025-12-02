import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { realSphericalHarmonic, getPhaseColor } from '../utils/sphericalHarmonics';
import { SuperpositionConfig } from '../types';

interface Props {
  config: SuperpositionConfig;
}

const SuperpositionMesh: React.FC<Props> = ({ config }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.LineSegments>(null);

  const geometry = useMemo(() => {
    const { terms, resolution, amplitude } = config;
    
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

        // Summation Logic: f = sum( c_i * Y_{l_i, m_i} )
        let totalValue = 0;
        for (const term of terms) {
            totalValue += term.weight * realSphericalHarmonic(term.l, term.m, theta, phi);
        }
        
        // We stick to Amplitude mode for superposition to clearly see constructive/destructive interference
        const absVal = Math.abs(totalValue);
        const radius = absVal * amplitude;

        // Convert to Cartesian
        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);

        // Physics Z-up mapped to Three.js Y-up
        const px = radius * sinTheta * cosPhi; // Physics X -> Three X
        const py = radius * cosTheta;          // Physics Z -> Three Y (Up)
        const pz = radius * sinTheta * sinPhi; // Physics Y -> Three Z (Depth)

        positions.push(px, py, pz);

        // Color based on phase of the TOTAL sum
        const [r, g, b] = getPhaseColor(totalValue);
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
  }, [config.terms, config.resolution, config.amplitude]);

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

export default SuperpositionMesh;