import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#07080d",
          900: "#0b0d14",
          800: "#11141d",
          700: "#181c28",
          600: "#222838",
          500: "#2f3850",
        },
        accent: {
          500: "#7c5cff",
          400: "#a08cff",
          300: "#cbc0ff"
        },
        vibe: {
          chaotic: "#ff5d8f",
          wholesome: "#7ad7c3",
          productive: "#7c5cff",
          creative: "#ffb547"
        }
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Inter", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"]
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(124, 92, 255, 0.18), 0 12px 40px -12px rgba(124, 92, 255, 0.45)"
      }
    }
  },
  plugins: []
};

export default config;
