/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  extend: {
    clipPath: {
      customPolygon: 'polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 0 50%, 0% 0%)',
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}