import React from 'react';
import { HarmonicConfig, OrbitalType } from '../types';
import { BookOpen, Activity, Compass, Grid, Sigma } from 'lucide-react';
import { getCartesianPolynomialText } from '../utils/sphericalHarmonics';

interface Props {
  config: HarmonicConfig;
}

const getOrbitalType = (l: number): OrbitalType => {
  const map = ['s', 'p', 'd', 'f', 'g'];
  if (l < map.length) return map[l] as OrbitalType;
  return OrbitalType.COMPLEX;
};

const getOrientationDescription = (l: number, m: number): string => {
    if (l === 0) return "Symmetric (Spherical)";
    if (m === 0) return "Aligned with Z-axis (Vertical)";
    
    // Logic for rotation based on m
    if (m > 0) return `Aligned with Cos(${m}φ). (Often X-aligned)`;
    if (m < 0) return `Aligned with Sin(${Math.abs(m)}φ). (Often Y-aligned)`;
    
    return "Complex orientation";
};

const InfoPanel: React.FC<Props> = ({ config }) => {
  const type = getOrbitalType(config.l);
  const polynomial = getCartesianPolynomialText(config.l, config.m);
  const orientationDesc = getOrientationDescription(config.l, config.m);
  
  // Quick facts based on physics knowledge
  const angularNodes = config.l;
  const azimuthalNodes = Math.abs(config.m);
  const polarNodes = config.l - Math.abs(config.m);

  return (
    <div className="absolute left-6 top-24 w-72 pointer-events-none select-none z-10">
      <div className="bg-sci-800/80 backdrop-blur-md border border-sci-700 p-6 rounded-xl shadow-2xl text-slate-200">
        <h1 className="text-3xl font-bold font-mono text-white mb-2 tracking-tight">
          Y<sub className="text-lg">({config.l},{config.m})</sub>
        </h1>
        <h2 className="text-sci-accent font-mono text-sm uppercase tracking-widest mb-4">
          Spherical Harmonic
        </h2>

        <div className="space-y-4">
          
          {/* Polynomial Representation */}
          <div className="flex items-start gap-3 bg-sci-900/40 p-3 rounded-lg border border-sci-700/50">
             <div className="mt-1 text-sci-accent">
                <Sigma size={18} />
             </div>
             <div>
                <p className="font-semibold text-xs text-slate-400 uppercase">Cartesian Form</p>
                <p className="font-mono text-lg text-white mt-1 italic font-serif leading-tight">
                  {polynomial}
                </p>
             </div>
          </div>

          <div className="flex items-start gap-3">
             <div className="mt-1 p-1 bg-sci-700 rounded text-sci-accent">
                <Compass size={16} />
             </div>
             <div>
                <p className="font-semibold text-sm text-white">Orientation (m={config.m})</p>
                <p className="text-xs text-slate-400 leading-relaxed mt-1">
                  {orientationDesc}
                </p>
                {Math.abs(config.m) > 0 && (
                    <p className="text-[10px] text-sci-accent/80 mt-1">
                        Difference between ±m is a rotation of {90 / Math.abs(config.m)}° around Z.
                    </p>
                )}
             </div>
          </div>

          <div className="flex items-start gap-3">
             <div className="mt-1 p-1 bg-sci-700 rounded text-sci-accent">
                <Activity size={16} />
             </div>
             <div>
                <p className="font-semibold text-sm text-white">Angular Frequency (l={config.l})</p>
                <p className="text-xs text-slate-400 leading-relaxed mt-1">
                  Total nodes: {angularNodes}.
                </p>
             </div>
          </div>

          <div className="mt-4 pt-4 border-t border-sci-700/50">
             <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="flex flex-col bg-sci-900/50 p-2 rounded border border-sci-700/30">
                    <span className="text-slate-500">Orbital Type</span>
                    <span className="text-xl text-white font-bold uppercase">{type}</span>
                </div>
                <div className="flex flex-col bg-sci-900/50 p-2 rounded border border-sci-700/30">
                    <span className="text-slate-500">Polar Nodes</span>
                    <span className="text-xl text-white font-bold">{polarNodes}</span>
                </div>
                <div className="flex flex-col bg-sci-900/50 p-2 rounded border border-sci-700/30">
                    <span className="text-slate-500">Azimuth Nodes</span>
                    <span className="text-xl text-white font-bold">{azimuthalNodes}</span>
                </div>
                <div className="flex flex-col bg-sci-900/50 p-2 rounded border border-sci-700/30">
                    <span className="text-slate-500">Symmetry</span>
                    <span className="text-xs text-white font-bold mt-1">{config.m === 0 ? 'Axial' : `C${Math.abs(config.m)}`}</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;