import { type Config } from "tailwindcss";
import colors from "./tailwind/colors";
import backgroundImage from "./tailwind/backgroundImages";
import keyframes from "./tailwind/keyframes";
import animation from "./tailwind/animation";
import screens from "./tailwind/screens";

export default {
  content: {
    transform: (content) => content.replace(/taos:/g, ""),
    files: ["./src/**/*.{js,ts,jsx,tsx}"],
  },
  theme: {
    screens,
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        "rex-bold": ["Rex-Bold", "sans-serif"],
        "rex-bold-inline": ["Rex-BoldInline", "sans-serif"],
        "rex-light": ["Rex-Light", "sans-serif"],
      },
      colors,
      backgroundImage,
      keyframes,
      animation,
      // shadcn
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("autoprefixer")],
} satisfies Config;
