/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'green-vs': {
          100: 'var(--color-green-vs-100)', 200: 'var(--color-green-vs-200)',
          300: 'var(--color-green-vs-300)', 400: 'var(--color-green-vs-400)',
          500: 'var(--color-green-vs-500)', 600: 'var(--color-green-vs-600)',
          700: 'var(--color-green-vs-700)', 800: 'var(--color-green-vs-800)',
          900: 'var(--color-green-vs-900)',
        },
        'amber-vs': {
          100: 'var(--color-amber-vs-100)', 200: 'var(--color-amber-vs-200)',
          300: 'var(--color-amber-vs-300)', 400: 'var(--color-amber-vs-400)',
          500: 'var(--color-amber-vs-500)', 600: 'var(--color-amber-vs-600)',
          700: 'var(--color-amber-vs-700)', 800: 'var(--color-amber-vs-800)',
          900: 'var(--color-amber-vs-900)',
        },
        'red-vs': {
          100: 'var(--color-red-vs-100)', 200: 'var(--color-red-vs-200)',
          300: 'var(--color-red-vs-300)', 400: 'var(--color-red-vs-400)',
          500: 'var(--color-red-vs-500)', 600: 'var(--color-red-vs-600)',
          700: 'var(--color-red-vs-700)', 800: 'var(--color-red-vs-800)',
          900: 'var(--color-red-vs-900)',
        },
        'blue-vs': {
          100: 'var(--color-blue-vs-100)', 200: 'var(--color-blue-vs-200)',
          300: 'var(--color-blue-vs-300)', 400: 'var(--color-blue-vs-400)',
          500: 'var(--color-blue-vs-500)', 600: 'var(--color-blue-vs-600)',
          700: 'var(--color-blue-vs-700)', 800: 'var(--color-blue-vs-800)',
          900: 'var(--color-blue-vs-900)',
        },
        'gray-vs': {
          100: 'var(--color-gray-vs-100)', 200: 'var(--color-gray-vs-200)',
          300: 'var(--color-gray-vs-300)', 400: 'var(--color-gray-vs-400)',
          500: 'var(--color-gray-vs-500)', 600: 'var(--color-gray-vs-600)',
          700: 'var(--color-gray-vs-700)', 800: 'var(--color-gray-vs-800)',
          900: 'var(--color-gray-vs-900)',
        },
      },
      fontFamily: {
        title: ['"Segoe UI Emoji"', 'sans-serif'],
      },
      keyframes: {
        'slide-in-from-left': {
          from: { transform: 'translateX(-100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-in-from-right': {
          from: { transform: 'translateX(100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        }
      },
      animation: {
        'slide-in-from-left': 'slide-in-from-left 0.3s ease-out',
        'slide-in-from-right': 'slide-in-from-right 0.3s ease-out',
      }
    },
  },
  plugins: [],
};
