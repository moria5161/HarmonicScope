import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Environment } from '@react-three/drei';
import HarmonicMesh from './components/HarmonicMesh';
import Controls from './components/Controls';
import InfoPanel from './components/InfoPanel';
import ScientificAxes from './components/ScientificAxes';
import { HarmonicConfig } from './types';

const App: React.FC = () => {
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
    <div className="relative w-full h-screen bg-sci-900 overflow-hidden text-white selection:bg-sci-accent selection:text-white">
      
      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [6, 4, 6], fov: 45 }}>
          <color attach="background" args={['#050505']} />
          <fog attach="fog" args={['#050505', 10, 30]} />
          
          <Suspense fallback={null}>
            {/* Lighting */}
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4f46e5" />
            
            <Environment preset="city" />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            {/* Main Object */}
            <HarmonicMesh config={config} />
            
            {/* Custom Scientific Axes */}
            <ScientificAxes visible={config.showAxis} />
            
            <OrbitControls 
                enablePan={false} 
                minDistance={3} 
                maxDistance={15}
                autoRotate={false}
                autoRotateSpeed={1}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* UI Overlay */}
      <InfoPanel config={config} />
      <Controls config={config} onChange={setConfig} />

      {/* Legend / Footer */}
      <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end pointer-events-none">
         <div className="flex gap-4 text-xs font-mono bg-black/40 backdrop-blur px-4 py-2 rounded-full border border-white/10">
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-sci-pos"></span> Positive Phase (+)
            </div>
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-sci-neg"></span> Negative Phase (-)
            </div>
         </div>
         
         <div className="text-[10px] text-slate-500 font-mono text-right max-w-xs bg-black/40 p-2 rounded backdrop-blur">
            <p className="text-white font-bold mb-1">Physics Coordinates</p>
            <p><span className="text-green-400">Z (Up)</span> = r cosθ</p>
            <p><span className="text-red-400">X</span> = r sinθ cosφ</p>
            <p><span className="text-blue-400">Y</span> = r sinθ sinφ</p>
         </div>
      </div>

    </div>
  );
};

export default App;