import { type Config } from "tailwindcss";
import typography from "@tailwindcss/typography";
import containers from "npm:@tailwindcss/container-queries";

export default {
  content: ["{routes,islands,components}/**/*.{ts,tsx}"],
  theme: {
    fontFamily: {
      sans: [
        "Inter",
        "ui-sans-serif",
        "system-ui",
        "sans-serif",
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol",
        "Noto Color Emoji",
      ],
    },
    extend: {
      colors: {
        theme: {
          normal: "#DC6843",
        },
      },
      borderColor: {
        DEFAULT: "#D1D5DB",
      },
    },
  },
  plugins: [typography(), containers],
} as Config;
