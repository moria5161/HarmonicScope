
/**
 * Mathematical utilities for Real Spherical Harmonics.
 * 
 * References:
 * Y_{l,m} are spherical harmonics.
 * We use Real form for visualization (Atomic Orbitals style).
 */

// Basic Factorial
const factorial = (n: number): number => {
  if (n <= 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
};

// Double Factorial (n!!)
const doubleFactorial = (n: number): number => {
  if (n <= 1) return 1;
  let result = 1;
  for (let i = n; i >= 2; i -= 2) result *= i;
  return result;
};

/**
 * Calculates Associated Legendre Polynomial P_l^m(x)
 * Using recursive relations for numerical stability.
 * x = cos(theta)
 */
export const legendreP = (l: number, m: number, x: number): number => {
  const absM = Math.abs(m);
  if (absM > l) return 0;

  // 1. Compute P_m^m(x)
  let pmm = 1.0;
  if (absM > 0) {
    const somx2 = Math.sqrt((1.0 - x) * (1.0 + x));
    let fact = 1.0;
    for (let i = 1; i <= absM; i++) {
      pmm *= -fact * somx2;
      fact += 2.0;
    }
  }

  if (l === absM) return pmm;

  // 2. Compute P_{m+1}^m(x)
  let pmmp1 = x * (2.0 * absM + 1.0) * pmm;
  if (l === absM + 1) return pmmp1;

  // 3. Compute P_l^m(x)
  let pll = 0;
  for (let ll = absM + 2; ll <= l; ll++) {
    pll = ((2.0 * ll - 1.0) * x * pmmp1 - (ll + absM - 1.0) * pmm) / (ll - absM);
    pmm = pmmp1;
    pmmp1 = pll;
  }

  return pll;
};

/**
 * Normalization constant for Real Spherical Harmonics
 */
const normalization = (l: number, m: number): number => {
  const absM = Math.abs(m);
  const pre = ((2 * l + 1) / (4 * Math.PI)) * (factorial(l - absM) / factorial(l + absM));
  return Math.sqrt(pre);
};

/**
 * Evaluates Real Spherical Harmonic Y_{l,m}
 * theta: polar angle [0, PI]
 * phi: azimuthal angle [0, 2PI]
 */
export const realSphericalHarmonic = (l: number, m: number, theta: number, phi: number): number => {
  const N = normalization(l, m);
  const P = legendreP(l, m, Math.cos(theta)); // Pass cos(theta)
  
  if (m === 0) {
    return N * P;
  } else if (m > 0) {
    return Math.sqrt(2) * N * P * Math.cos(m * phi);
  } else {
    return Math.sqrt(2) * N * P * Math.sin(Math.abs(m) * phi);
  }
};

/**
 * Get color based on value (Blue for negative, Red for positive)
 */
export const getPhaseColor = (val: number): [number, number, number] => {
  // Normalize visually slightly
  const intensity = Math.min(1, Math.abs(val) * 2); 
  if (val > 0) {
    // Reddish (Warm)
    return [0.9, 0.2 + (1-intensity)*0.8, 0.2 + (1-intensity)*0.8]; 
  } else {
    // Blueish (Cool)
    return [0.2 + (1-intensity)*0.8, 0.5 + (1-intensity)*0.5, 1.0];
  }
};

/**
 * Returns the Cartesian polynomial representation text for common harmonics
 */
export const getCartesianPolynomialText = (l: number, m: number): string => {
  if (l === 0) return "1";
  
  if (l === 1) {
    if (m === -1) return "y";
    if (m === 0) return "z";
    if (m === 1) return "x";
  }

  if (l === 2) {
    if (m === -2) return "xy";
    if (m === -1) return "yz";
    if (m === 0) return "2z² - x² - y²";
    if (m === 1) return "xz";
    if (m === 2) return "x² - y²";
  }

  if (l === 3) {
    if (m === -3) return "y(3x² - y²)";
    if (m === -2) return "xyz";
    if (m === -1) return "y(4z² - x² - y²)";
    if (m === 0) return "z(2z² - 3x² - 3y²)";
    if (m === 1) return "x(4z² - x² - y²)";
    if (m === 2) return "z(x² - y²)";
    if (m === 3) return "x(x² - 3y²)";
  }

  return "High Order Polynomial";
};
