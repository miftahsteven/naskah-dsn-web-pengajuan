/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        primary: {
          DEFAULT: '#006633',
          dark: '#004d26',
          light: '#1B7F4A',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#E8F5EE',
          foreground: '#006633',
        },
        accent: {
          DEFAULT: '#D4AF37',
          light: '#F0D060',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#F1EFE6',
          foreground: '#5A5A5A',
        },
        border: '#DDDBC9',
        input: '#DDDBC9',
        ring: '#006633',
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(0, 102, 51, 0.04)',
        'card': '0 8px 30px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 14px 40px rgba(0, 102, 51, 0.08)',
        'glow': '0 0 25px rgba(212, 175, 55, 0.35)',
        'glow-green': '0 0 25px rgba(0, 102, 51, 0.25)',
      },
    },
  },
  plugins: [],
};
