export type VisualizationMode = 'amplitude' | 'density';

export interface HarmonicConfig {
  l: number; // Degree (Angular Momentum Quantum Number)
  m: number; // Order (Magnetic Quantum Number)
  amplitude: number; // Visual scaling factor
  showWireframe: boolean;
  showAxis: boolean;
  resolution: number; // Mesh resolution
  mode: VisualizationMode; // New: Toggle between |Y| and |Y|^2
}

export interface VertexData {
  positions: Float32Array;
  colors: Float32Array;
  indices: number[];
}

export enum OrbitalType {
  S = 's',
  P = 'p',
  D = 'd',
  F = 'f',
  G = 'g',
  COMPLEX = 'complex'
}