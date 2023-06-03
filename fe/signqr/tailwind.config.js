/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ipurple: '#4C4C6D',
        igreen: '#1B9C85',
        iwhite: '#E8F6EF',
        iyellow: '#FFE194'
      }
    },
  },
  plugins: [],
}