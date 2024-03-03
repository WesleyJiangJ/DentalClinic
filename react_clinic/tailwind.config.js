// tailwind.config.js
const { nextui } = require("@nextui-org/react"); // NextUI
const withMT = require("@material-tailwind/react/utils/withMT"); // Material Tailwind

/** @type {import('tailwindcss').Config} */
module.exports = withMT({ // withMT was added when Material Tailwind was installed
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [nextui()],
});