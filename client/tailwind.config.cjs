/** @type {import('tailwindcss').Config} */
module.exports = {
  content: {
    files: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    relative: true,
  },
  theme: {
    extend: {},
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true,
  },
  debug: true
}
