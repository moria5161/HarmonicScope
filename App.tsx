import React, { useState } from 'react';
import SingleMode from './components/SingleMode';
import SuperpositionMode from './components/SuperpositionMode';
import { Atom, FunctionSquare, Camera } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'single' | 'multi'>('single');

  const handleScreenshot = () => {
    // Find the canvas element
    const canvas = document.querySelector('canvas');
    if (canvas) {
        // Create a temporary link
        const link = document.createElement('a');
        link.download = `harmonic-${activeTab}-${new Date().toISOString().slice(0,19)}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }
  };

  return (
    <div className="relative w-full h-screen bg-sci-900 overflow-hidden text-white selection:bg-sci-accent selection:text-white flex flex-col">
      
      {/* Header / Navigation */}
      <div className="absolute top-0 left-0 right-0 z-50 p-4 pointer-events-none">
        <div className="max-w-md mx-auto bg-sci-800/90 backdrop-blur-md border border-sci-700 rounded-full p-1.5 flex shadow-2xl pointer-events-auto">
            <button
                onClick={() => setActiveTab('single')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-full text-xs font-bold transition-all ${
                    activeTab === 'single' 
                    ? 'bg-sci-700 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
            >
                <Atom size={16} />
                Single Harmonic
            </button>
            <button
                onClick={() => setActiveTab('multi')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-full text-xs font-bold transition-all ${
                    activeTab === 'multi' 
                    ? 'bg-sci-700 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
            >
                <FunctionSquare size={16} />
                Linear Combination
            </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative">
        {activeTab === 'single' ? <SingleMode /> : <SuperpositionMode />}
      </div>

      {/* Shared Footer (Bottom Left Stack) */}
      <div className="absolute bottom-6 left-6 z-40 flex flex-col gap-3 items-start pointer-events-none">
         
         {/* Physics Coordinates Info */}
         <div className="text-[10px] text-slate-500 font-mono text-left max-w-xs bg-black/40 p-2 rounded backdrop-blur border border-white/5">
            <p className="text-white font-bold mb-1">Physics Coordinates</p>
            <p><span className="text-green-400">Z (Up)</span> = r cosθ</p>
            <p><span className="text-red-400">X</span> = r sinθ cosφ</p>
            <p><span className="text-blue-400">Y</span> = r sinθ sinφ</p>
         </div>

         {/* Legend & Actions Row */}
         <div className="flex items-center gap-4 pointer-events-auto">
             <div className="flex gap-4 text-xs font-mono bg-black/40 backdrop-blur px-4 py-2 rounded-full border border-white/10">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-sci-pos"></span> Positive (+)
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-sci-neg"></span> Negative (-)
                </div>
             </div>
             
             {/* Screenshot Button */}
             <button
                onClick={handleScreenshot}
                className="flex items-center gap-2 px-4 py-2 bg-sci-accent/10 hover:bg-sci-accent text-sci-accent hover:text-white border border-sci-accent/50 rounded-full text-xs font-bold shadow-lg transition-all backdrop-blur-sm"
                title="Save Image"
             >
                <Camera size={16} />
                <span className="hidden sm:inline">Save Image</span>
             </button>
         </div>
      </div>

    </div>
  );
};

export default App;