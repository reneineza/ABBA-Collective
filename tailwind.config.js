/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: "#1C1C1C",
          dark: "#121212",
          light: "#2E2E2E",
          muted: "#4A4A4A",
        },
        ivory: {
          DEFAULT: "#F5F2EB",
          light: "#FAF8F5",
          dark: "#EAE5D9",
          border: "#E2DDD0",
        },
        forest: {
          DEFAULT: "#1E3F20",
          dark: "#142B16",
          light: "#2B562E",
          muted: "#36683A",
        },
        gold: {
          DEFAULT: "#C4A661",
          light: "#D4B872",
          dark: "#A88B46",
          subtle: "rgba(196, 166, 97, 0.15)",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Inter", "Manrope", "sans-serif"],
      },
      letterSpacing: {
        widest: "0.25em",
        luxurious: "0.3em",
      },
      boxShadow: {
        subtle: "0 4px 20px -2px rgba(28, 28, 28, 0.05)",
        card: "0 10px 30px -5px rgba(28, 28, 28, 0.08)",
        gold: "0 4px 25px rgba(196, 166, 97, 0.2)",
      },
    },
  },
  plugins: [],
};
