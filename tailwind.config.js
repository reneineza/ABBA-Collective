/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ABBA brand palette (BRANDING/COLOR PALLETE): the DEFAULT of each family is
      // an official brand colour; the other shades are derived for UI states.
      colors: {
        charcoal: {
          DEFAULT: "#1C1C1C",
          dark: "#121212",
          light: "#2E2E2E",
          muted: "#4A4A4A",
        },
        ivory: {
          DEFAULT: "#F4EEE6",
          light: "#FAF7F2",
          dark: "#E9E0D3",
          border: "#DDD3C4",
        },
        olive: {
          DEFAULT: "#3B3418",
          dark: "#2A2511",
          light: "#4E4522",
          muted: "#5F5530",
        },
        gold: {
          DEFAULT: "#BFA355",
          light: "#CDB46E",
          dark: "#A38A42",
          subtle: "rgba(191, 163, 85, 0.15)",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "Playfair Display", "Georgia", "serif"],
        sans: ["futura-pt", "Jost", "sans-serif"],
      },
      letterSpacing: {
        widest: "0.25em",
        luxurious: "0.3em",
      },
      boxShadow: {
        subtle: "0 4px 20px -2px rgba(28, 28, 28, 0.05)",
        card: "0 10px 30px -5px rgba(28, 28, 28, 0.08)",
        gold: "0 4px 25px rgba(191, 163, 85, 0.2)",
      },
    },
  },
  plugins: [],
};
