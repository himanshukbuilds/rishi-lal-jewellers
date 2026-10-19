/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Exact Brand Reference Colors
        'champagne-gold': {
          DEFAULT: '#C2AA6A',
          light: '#D8C596',
          dark: '#A89052',
          50: '#FAF7EE',
          100: '#F4EEDB',
          200: '#E8DCB8',
          300: '#DCB7',
          400: '#CBB47C',
          500: '#C2AA6A',
          600: '#AD9454',
          700: '#8E773E',
          800: '#6F5C2C',
          900: '#4F411C',
        },
        'blush-pink': {
          DEFAULT: '#E8C0B8',
          light: '#F5DDD7',
          50: '#FAF2F0',
          100: '#F6E4E1',
          200: '#E8C0B8',
          300: '#DCA79E',
          400: '#C88D83',
        },
        'dusty-rose': {
          DEFAULT: '#DEB1A8',
          light: '#EBC4BD',
          dark: '#C89389',
          50: '#FAF3F1',
          100: '#F4E3DF',
          200: '#E8C5BE',
          300: '#DEB1A8',
        },
        'muted-emerald': {
          DEFAULT: '#A83244',
          light: '#BA4357',
          dark: '#871D2D',
          50: '#FDF4F5',
          100: '#FBE8E9',
          200: '#F6D2D5',
          300: '#EDB0B5',
          500: '#A83244',
          600: '#8E2536',
          700: '#751B2A',
        },
        'forest-green': {
          DEFAULT: '#8B1E2D',
          light: '#9E2436',
          dark: '#4A0B13',
          50: '#FAF0F1',
          100: '#F5E1E3',
          200: '#ECC4C8',
          500: '#8B1E2D',
          600: '#731422',
          700: '#4A0B13',
        },
        'rich-green': {
          DEFAULT: '#4A0B13',
          light: '#63101C',
          dark: '#2D050B',
          50: '#FAF0F1',
          100: '#F5E1E3',
          200: '#ECC4C8',
          500: '#4A0B13',
          600: '#38070E',
          700: '#2D050B',
        },
        'pure-white': '#FFFFFF',
        'elegant-black': '#000000',

        // Cohesive Theme Mappings for Existing Tailwind Components (Emerald maps to Royal Ruby / Crimson scale)
        emerald: {
          950: '#4A0B13', // Deep Royal Crimson / Maroon (Campaigns, dark showcases, footer)
          900: '#5C0E18',
          850: '#731422',
          800: '#8B1E2D', // Royal Ruby Red (Primary brand accent, primary buttons, active states)
          700: '#9E2436',
          600: '#A83244', // Muted Crimson / Rosewood
          500: '#BA4357',
          400: '#CE6475',
          300: '#E18B99',
          200: '#F0B8C1',
          100: '#F8D8DC',
          50: '#FAF0F1',
        },
        gold: {
          50: '#FAF7F0',
          100: '#F4EEDB',
          200: '#E8DCB8',
          300: '#D9C694',
          400: '#CBB47C',
          500: '#C2AA6A', // Core Champagne Gold
          600: '#AD9454',
          700: '#8E773E',
          800: '#6F5C2C',
          900: '#4F411C',
          muted: '#B49A58', // Muted Gold accent
        },
        rose: {
          50: '#FAF2F0',
          100: '#F6E4E1',
          200: '#E8C0B8', // Soft Blush Pink
          300: '#DEB1A8', // Dusty Rose
          400: '#CF9990',
          500: '#B87B71',
        },
        ivory: {
          50: '#F8F5EF', // Warm ivory page background
          100: '#FFFFFF', // Pure white
          200: '#F1ECE3', // Light surface
          300: '#E6DFD3', // Subtle border
          400: '#D9CFC0',
        },
        charcoal: {
          900: '#000000', // Elegant Black
          800: '#1A1A1A',
          700: '#292923', // Main text
          600: '#454545',
          500: '#716D64', // Secondary text
          400: '#9E9E9E',
        },
        'surface-light': '#F1ECE3',
        'border-subtle': '#E6DFD3',
        'text-main': '#292923',
        'text-sub': '#716D64',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 10px 30px -10px rgba(12, 35, 30, 0.08)',
        'luxury-hover': '0 20px 40px -15px rgba(12, 35, 30, 0.14)',
        'gold-glow': '0 2px 12px rgba(194, 170, 106, 0.18)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

