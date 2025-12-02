/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        sci: {
          900: '#0a0b14',
          800: '#131525',
          700: '#1f2438',
          accent: '#3b82f6',
          pos: '#ef4444',
          neg: '#3b82f6',
        }
      },
      animation: {
        'in': 'enter 300ms ease-out',
      },
      keyframes: {
        enter: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        }
      }
    },
  },
  plugins: [],
}