/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#050816',
          900: '#0b1020',
          800: '#111827',
        },
        ember: {
          500: '#ff4d4d',
          600: '#e63946',
          700: '#cc2f3f',
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,77,77,0.16), 0 20px 60px rgba(0,0,0,0.45)',
      },
      backgroundImage: {
        'hero-grid': 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)',
      },
    },
  },
  plugins: [],
};
