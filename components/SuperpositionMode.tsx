import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Environment } from '@react-three/drei';
import SuperpositionMesh from './SuperpositionMesh';
import ScientificAxes from './ScientificAxes';
import { SuperpositionConfig, HarmonicTerm } from '../types';
import { Plus, Trash2, Layers, Rotate3d, Info } from 'lucide-react';

const SuperpositionMode: React.FC = () => {
  const [config, setConfig] = useState<SuperpositionConfig>({
    terms: [
        { id: '1', l: 0, m: 0, weight: 1.0 }, // Start with S orbital
        { id: '2', l: 1, m: 0, weight: 0.5 }, // Add a bit of Pz
    ],
    amplitude: 4,
    showWireframe: true,
    showAxis: true,
    resolution: 128,
  });

  const addTerm = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    setConfig(prev => ({
        ...prev,
        terms: [...prev.terms, { id: newId, l: 1, m: 0, weight: 0.5 }]
    }));
  };

  const removeTerm = (id: string) => {
    if (config.terms.length <= 1) return;
    setConfig(prev => ({
        ...prev,
        terms: prev.terms.filter(t => t.id !== id)
    }));
  };

  const updateTerm = (id: string, updates: Partial<HarmonicTerm>) => {
    setConfig(prev => ({
        ...prev,
        terms: prev.terms.map(t => {
            if (t.id !== id) return t;
            const updated = { ...t, ...updates };
            // Constrain m based on l
            if (updates.l !== undefined) {
                updated.m = Math.min(updated.l, Math.max(-updated.l, updated.m));
            }
            if (updates.m !== undefined) {
                updated.m = Math.min(updated.l, Math.max(-updated.l, updated.m));
            }
            return updated;
        })
    }));
  };

  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [6, 4, 6], fov: 45 }}>
          <color attach="background" args={['#050505']} />
          <fog attach="fog" args={['#050505', 10, 30]} />
          
          <Suspense fallback={null}>
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4f46e5" />
            <Environment preset="city" />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            <SuperpositionMesh config={config} />
            <ScientificAxes visible={config.showAxis} />
            
            <OrbitControls enablePan={false} minDistance={3} maxDistance={15} />
          </Suspense>
        </Canvas>
      </div>

      {/* Info Overlay */}
      <div className="absolute left-6 top-24 max-w-sm pointer-events-none z-10">
        <div className="bg-sci-800/80 backdrop-blur-md border border-sci-700 p-6 rounded-xl shadow-2xl text-slate-200">
            <h2 className="text-xl font-bold font-mono text-white mb-1">Linear Combination</h2>
            <div className="text-sm font-mono text-sci-accent mb-3">f(θ,φ) = Σ c<sub className="text-[10px]">i</sub> Y<sub className="text-[10px]">l,m</sub></div>
            <p className="text-xs text-slate-400 leading-relaxed">
                Spherical Harmonics form an <strong>Orthonormal Basis</strong>. This means any function on the sphere can be represented as a weighted sum of these shapes.
            </p>
            <div className="mt-3 p-2 bg-sci-900/50 rounded text-xs text-slate-500 border border-white/5">
                <Info size={14} className="inline mr-1 -mt-0.5" />
                Try combining an <strong>s</strong> (l=0) and a <strong>p</strong> (l=1) orbital to see hybridization!
            </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute right-6 top-24 w-80 pointer-events-auto z-20 max-h-[calc(100vh-150px)] overflow-y-auto pr-1">
         <div className="space-y-4">
            
            {/* Term List */}
            {config.terms.map((term, index) => (
                <div key={term.id} className="bg-sci-800/90 backdrop-blur-md border border-sci-700 rounded-xl p-4 shadow-lg animate-in">
                    <div className="flex justify-between items-center mb-3 border-b border-white/5 pb-2">
                        <span className="font-mono text-xs font-bold text-sci-accent">Term {index + 1}</span>
                        <button 
                            onClick={() => removeTerm(term.id)}
                            disabled={config.terms.length === 1}
                            className="text-slate-500 hover:text-red-400 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>

                    <div className="space-y-3">
                        {/* L and M Selectors */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[10px] text-slate-400 font-mono mb-1">Degree (l)</label>
                                <input 
                                    type="number" min="0" max="5" 
                                    value={term.l}
                                    onChange={(e) => updateTerm(term.id, { l: parseInt(e.target.value) || 0 })}
                                    className="w-full bg-sci-900 border border-sci-700 rounded px-2 py-1 text-xs text-white font-mono focus:border-sci-accent outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] text-slate-400 font-mono mb-1">Order (m)</label>
                                <input 
                                    type="number" min={-term.l} max={term.l}
                                    value={term.m}
                                    onChange={(e) => updateTerm(term.id, { m: parseInt(e.target.value) || 0 })}
                                    className="w-full bg-sci-900 border border-sci-700 rounded px-2 py-1 text-xs text-white font-mono focus:border-sci-accent outline-none"
                                />
                            </div>
                        </div>

                        {/* Weight Slider */}
                        <div>
                             <div className="flex justify-between mb-1">
                                <label className="text-[10px] text-slate-400 font-mono">Weight (c)</label>
                                <span className="text-[10px] text-white font-mono">{term.weight.toFixed(2)}</span>
                            </div>
                            <input 
                                type="range" min="-2" max="2" step="0.1"
                                value={term.weight}
                                onChange={(e) => updateTerm(term.id, { weight: parseFloat(e.target.value) })}
                                className="w-full h-1.5 bg-sci-900 rounded-lg appearance-none cursor-pointer accent-sci-accent"
                            />
                        </div>
                    </div>
                </div>
            ))}

            <button 
                onClick={addTerm}
                className="w-full py-3 border-2 border-dashed border-sci-700 rounded-xl text-slate-400 hover:text-white hover:border-sci-accent hover:bg-sci-800/50 transition-all flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-wide"
            >
                <Plus size={16} /> Add Term
            </button>
            
            {/* Global Settings */}
            <div className="flex gap-2 justify-end pt-2">
                 <button 
                    onClick={() => setConfig({...config, showWireframe: !config.showWireframe})}
                    className={`p-2 rounded-lg transition-colors border ${config.showWireframe ? 'bg-sci-accent/20 border-sci-accent text-white' : 'bg-sci-800/80 border-sci-700 text-slate-400'}`}
                 >
                    <Layers size={16} />
                 </button>
                 <button 
                    onClick={() => setConfig({...config, showAxis: !config.showAxis})}
                    className={`p-2 rounded-lg transition-colors border ${config.showAxis ? 'bg-sci-accent/20 border-sci-accent text-white' : 'bg-sci-800/80 border-sci-700 text-slate-400'}`}
                 >
                    <Rotate3d size={16} />
                 </button>
            </div>

         </div>
      </div>
    </div>
  );
};

export default SuperpositionMode;