import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Environment } from '@react-three/drei';
import HarmonicMesh from './HarmonicMesh';
import Controls from './Controls';
import InfoPanel from './InfoPanel';
import ScientificAxes from './ScientificAxes';
import { HarmonicConfig } from '../types';

const SingleMode: React.FC = () => {
  const [config, setConfig] = useState<HarmonicConfig>({
    l: 2,
    m: 0,
    amplitude: 4,
    showWireframe: true,
    showAxis: true,
    resolution: 128, 
    mode: 'amplitude'
  });

  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 z-0">
        <Canvas 
          camera={{ position: [6, 4, 6], fov: 45 }}
          gl={{ preserveDrawingBuffer: true }}
        >
          <color attach="background" args={['#050505']} />
          <fog attach="fog" args={['#050505', 10, 30]} />
          
          <Suspense fallback={null}>
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4f46e5" />
            <Environment preset="city" />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            <HarmonicMesh config={config} />
            <ScientificAxes visible={config.showAxis} />
            
            <OrbitControls 
                enablePan={false} 
                minDistance={3} 
                maxDistance={15}
            />
          </Suspense>
        </Canvas>
      </div>

      <InfoPanel config={config} />
      <Controls config={config} onChange={setConfig} />
    </div>
  );
};

export default SingleMode;