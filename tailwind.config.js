/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: "'Noto Sans Variable', sans-serif"
      },
      container: {
        center: true,
        screens: {
          "2xl": "1300px"
        },
        padding: 12
      }
    },
  },
  plugins: [],
}
