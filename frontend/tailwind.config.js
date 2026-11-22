/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Forest Green Primary Palette
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a', // Brand Forest Green
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        // Sage Green Accent
        sage: {
          50: '#f6f7f4',
          100: '#eaede4',
          200: '#d3dac8',
          300: '#b3bf9f',
          400: '#8fa075',
          500: '#718355',
          600: '#596844',
          700: '#475438',
          800: '#3b4530',
          900: '#333b2b',
        },
        // Gold Accent
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        // Warm Cream Canvas
        canvas: '#faf9f5',
        cream: '#f7f5ef',
        ink: '#1a2e1a',
        forest: '#166534',
        forestDark: '#14532d',
        muted: '#6b7280',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'Noto Sans Devanagari', 'Noto Sans Gurmukhi', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 12px 32px rgba(22, 101, 52, 0.08)',
        card: '0 1px 4px 0 rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 10px 25px -3px rgba(22, 101, 52, 0.12), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
        green: '0 4px 14px rgba(22, 163, 74, 0.25)',
      },
      backgroundImage: {
        'hero-pattern': "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(22,163,74,0.08) 0%, transparent 70%)",
        'green-gradient': 'linear-gradient(135deg, #166534 0%, #15803d 50%, #16a34a 100%)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-green': 'pulseGreen 2s infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0', transform: 'translateY(8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        pulseGreen: { '0%,100%': { boxShadow: '0 0 0 0 rgba(22,163,74,0.4)' }, '50%': { boxShadow: '0 0 0 8px rgba(22,163,74,0)' } },
      },
    },
  },
  plugins: [],
}
