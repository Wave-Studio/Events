import { type Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default {
  content: ["{routes,islands,components}/**/*.{ts,tsx}"],
  theme: {
    fontFamily: {
      "sans": ["Inter", "Comic Sans MS"]
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
  plugins: [typography()],
} as Config;
