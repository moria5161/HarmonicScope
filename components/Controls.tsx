import React from 'react';
import { HarmonicConfig } from '../types';
import { Settings2, Rotate3d, Layers, Eye } from 'lucide-react';

interface Props {
  config: HarmonicConfig;
  onChange: (newConfig: HarmonicConfig) => void;
}

const Controls: React.FC<Props> = ({ config, onChange }) => {
  
  const updateL = (val: number) => {
    const newL = Math.max(0, Math.min(10, val));
    // Reset m if it goes out of bounds
    const newM = Math.max(-newL, Math.min(newL, config.m));
    onChange({ ...config, l: newL, m: newM });
  };

  const updateM = (val: number) => {
    const newM = Math.max(-config.l, Math.min(config.l, val));
    onChange({ ...config, m: newM });
  };

  return (
    <div className="absolute right-6 top-6 w-80 pointer-events-auto z-20">
      <div className="bg-sci-800/90 backdrop-blur-md border border-sci-700 rounded-xl shadow-2xl p-6 text-slate-200">
        <div className="flex items-center gap-2 mb-6 text-sci-accent">
            <Settings2 size={18} />
            <h3 className="font-bold text-sm tracking-wide uppercase">Parameters</h3>
        </div>

        {/* Sliders */}
        <div className="space-y-6">
          {/* L Slider */}
          <div>
            <div className="flex justify-between mb-2">
                <label className="text-xs font-mono text-slate-400">Degree (l)</label>
                <span className="text-xs font-mono font-bold text-white">{config.l}</span>
            </div>
            <input 
                type="range" min="0" max="7" step="1" 
                value={config.l}
                onChange={(e) => updateL(parseInt(e.target.value))}
                className="w-full h-2 bg-sci-900 rounded-lg appearance-none cursor-pointer accent-sci-accent"
            />
            <div className="flex justify-between mt-1 text-[10px] text-slate-500 font-mono">
                <span>0</span><span>7</span>
            </div>
          </div>

          {/* M Slider */}
          <div>
            <div className="flex justify-between mb-2">
                <label className="text-xs font-mono text-slate-400">Order (m)</label>
                <span className="text-xs font-mono font-bold text-white">{config.m}</span>
            </div>
            <input 
                type="range" min={-config.l} max={config.l} step="1" 
                value={config.m}
                onChange={(e) => updateM(parseInt(e.target.value))}
                disabled={config.l === 0}
                className={`w-full h-2 bg-sci-900 rounded-lg appearance-none cursor-pointer accent-sci-accent ${config.l === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
             <div className="flex justify-between mt-1 text-[10px] text-slate-500 font-mono">
                <span>-{config.l}</span><span>+{config.l}</span>
            </div>
          </div>

          <div className="h-px bg-sci-700/50 my-4" />

          {/* Mode Selection */}
          <div className="space-y-3">
             <label className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <Eye size={14} /> Visualization Mode
             </label>
             <div className="flex bg-sci-900 rounded-lg p-1 border border-sci-700">
                <button
                    onClick={() => onChange({...config, mode: 'amplitude'})}
                    className={`flex-1 text-[10px] font-bold py-1.5 rounded ${config.mode === 'amplitude' ? 'bg-sci-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Amplitude |Y|
                </button>
                <button
                    onClick={() => onChange({...config, mode: 'density'})}
                    className={`flex-1 text-[10px] font-bold py-1.5 rounded ${config.mode === 'density' ? 'bg-sci-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Density |Y|²
                </button>
             </div>
          </div>

          {/* Visualization Toggles */}
          <div className="grid grid-cols-2 gap-3 pt-2">
             <button 
                onClick={() => onChange({...config, showWireframe: !config.showWireframe})}
                className={`flex items-center justify-center gap-2 p-2 rounded-lg text-xs font-medium transition-colors border ${config.showWireframe ? 'bg-sci-accent/20 border-sci-accent text-white' : 'bg-sci-900 border-sci-700 text-slate-400 hover:bg-sci-800'}`}
             >
                <Layers size={14} />
                Wireframe
             </button>

             <button 
                onClick={() => onChange({...config, showAxis: !config.showAxis})}
                className={`flex items-center justify-center gap-2 p-2 rounded-lg text-xs font-medium transition-colors border ${config.showAxis ? 'bg-sci-accent/20 border-sci-accent text-white' : 'bg-sci-900 border-sci-700 text-slate-400 hover:bg-sci-800'}`}
             >
                <Rotate3d size={14} />
                Axes
             </button>
          </div>
        </div>

        {/* Formula Hint */}
        <div className="mt-6 p-3 bg-black/20 rounded border border-white/5 text-[10px] text-slate-400 font-mono leading-relaxed">
            <span className="text-sci-accent">Def:</span> Y<sub>{config.l},{config.m}</sub> is an orthogonal basis function on S².
            <br />
            Visualized as r = {config.mode === 'amplitude' ? '|Y(θ,φ)|' : '|Y(θ,φ)|²'}
        </div>
      </div>
    </div>
  );
};

export default Controls;