import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orbitPrimary: "#504E76",
        orbitSecondary: "#C4C3E3",
        orbitGreen: "#A3B565",
        orbitBeige: "#FDF8E2",
        orbitSoftOrange: "#FCDD9D",
        orbitOrange: "#F1642E",
      },
    },
  },
  plugins: [],
}

export default config