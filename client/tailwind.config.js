/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'main-bg': '#e9decb',
        'primary-green': '#5f6f52',
        'primary-green-hover': '#748762',
        'primary-red': '#dc2626',
        'ring-green': '#66BB6A',
      },
    },
  },
  plugins: [],
};