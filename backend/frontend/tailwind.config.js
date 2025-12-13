/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cinzel"', '"Libre Baskerville"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      colors: {
        // Custom RPG Palette
        rpg: {
          950: '#0a0a0a', // Deep background
          900: '#121212', // Surface
          800: '#1c1917', // Stone dark
          border: '#44403c', // Stone 700ish
          gold: '#d97706', // Amber 600
          'gold-glow': '#f59e0b', // Amber 500
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
