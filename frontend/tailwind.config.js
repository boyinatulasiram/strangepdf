/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        strange: {
          crimson: '#C33149',
          lime: '#A8C256',
          cream: '#F3D9B1',
          tan: '#C29979',
          blood: '#A22522',
          dark: '#12070A',
          card: '#FBF2E3',
          border: '#D9B99B'
        }
      },
      fontFamily: {
        heading: ['"Bebas Neue"', 'Oswald', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"Space Grotesk"', 'monospace']
      },
      boxShadow: {
        'retro': '4px 4px 0px 0px #C29979',
        'retro-crimson': '4px 4px 0px 0px #A22522',
        'retro-lime': '4px 4px 0px 0px #708A29',
        'retro-lg': '6px 6px 0px 0px #C29979',
        'glow-crimson': '0 0 15px rgba(195, 49, 73, 0.45)',
        'glow-lime': '0 0 15px rgba(168, 194, 86, 0.45)'
      }
    },
  },
  plugins: [],
}
