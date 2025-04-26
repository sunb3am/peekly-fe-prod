/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        peekly: {
          orange: '#FF5C28',
          black: '#000000',
          'light-blue': '#F0F7FF',
          'light-pink': '#FFF0F7',
          'light-green': '#F0FFF4',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'peekly': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        'peekly': '1rem',
      },
    },
  },
  plugins: [],
};