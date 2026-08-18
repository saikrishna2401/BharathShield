/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Noto Sans Telugu', 'Noto Sans Devanagari', 'Noto Sans Tamil', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Noto Sans Telugu', 'Noto Sans Devanagari', 'Noto Sans Tamil', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
