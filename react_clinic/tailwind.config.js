// tailwind.config.js
import { nextui } from "@nextui-org/react"; // NextUI
import withMT from "@material-tailwind/react/utils/withMT"; // Material Tailwind

/** @type {import('tailwindcss').Config} */
export default withMT({ // withMT was added when Material Tailwind was installed
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [nextui({
    themes: {
      light: {
        colors: {
          primary: '#1E1E1E',
        },
      },
      dark: {
        colors: {},
      },
    },
  })],
});