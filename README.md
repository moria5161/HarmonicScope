# HarmonicScope: Spherical Harmonics Visualizer

An interactive educational tool for visualizing Real Spherical Harmonics ($Y_{l,m}$) and their linear combinations. This project is built with React, Three.js (React Three Fiber), and Tailwind CSS.

## Features

- **Single Harmonic Mode**: Visualize individual harmonics up to $l=7$.
- **Linear Combination Mode**: Create weighted sums of multiple harmonics to visualize orbital hybridization and superposition.
- **Physics Accurate**: Uses standard physics conventions (Z-up) and provides Cartesian polynomial equivalents.
- **Interactive Controls**: Real-time adjustment of quantum numbers ($l, m$), phase visualization, and wireframe modes.
- **Export**: Save high-quality PNG snapshots of your visualizations.

## Deployment

This is a **pure frontend application**. It performs all mathematical calculations (Legendre polynomials) client-side in the browser.

**No API Keys Required**: This project does not use Google Gemini API or any other backend service.

### Deploy to Vercel

1. Push this code to a GitHub repository.
2. Import the repository in Vercel.
3. Vercel will automatically detect the Vite preset.
4. Click **Deploy**. (Leave Environment Variables empty).

## Development

```bash
npm install
npm run dev
```

## Tech Stack

- **React 18**
- **Vite**
- **Three.js / React Three Fiber** (3D Rendering)
- **Tailwind CSS** (Styling)
- **Lucide React** (Icons)
