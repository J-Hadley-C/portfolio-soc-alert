/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0a0505',
        surface: '#140a0a',
        elevated: '#1f1010',
        divider: '#2e1616',
        accent: {
          DEFAULT: '#ff2b2b',
          dim: '#3a0a0a',
          muted: '#b91c1c',
        },
        'accent-orange': {
          DEFAULT: '#ff8c00',
          dim: '#3a1f00',
          muted: '#c96a00',
        },
        critical: '#f85149',
        high: '#e3b341',
        medium: '#3fb950',
        info: '#58a6ff',
      },
      fontFamily: {
        display: ['Oswald', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      fontSize: {
        'hero': ['clamp(3rem,8vw,6rem)', { lineHeight: '0.95', letterSpacing: '-0.01em' }],
        'hero-sub': ['clamp(1.5rem,3.5vw,2.5rem)', { lineHeight: '1.1' }],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out both',
        'blink': 'blink 1s step-end infinite',
        'slow-zoom': 'slowZoom 14s ease-in-out infinite alternate',
        'scan-line': 'scanLine 4s linear infinite',
        'pulse-alert': 'pulseAlert 2.5s ease-in-out infinite',
        'grid-drift': 'gridDrift 12s linear infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        slowZoom: {
          '0%': { transform: 'scale(1) translate(0, 0)' },
          '100%': { transform: 'scale(1.18) translate(-1.5%, -1.5%)' },
        },
        scanLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        pulseAlert: {
          '0%, 100%': { opacity: '0.15' },
          '50%': { opacity: '0.45' },
        },
        gridDrift: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '60px 60px' },
        },
      },
    },
  },
  plugins: [],
}
