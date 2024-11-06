/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  //Setup property
  theme: {
    extend: {
      colors: {
        blue: '#2997ff',
        gray: {
          DEFAULT: '#86868b',
          100: '#94928d',
          200: '#afafaf',
          300: '#42424570'
        },
        zinc: '#101010',

      },
    },
  },
  plugins: [],
}

