import { type Config } from "tailwindcss";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx}",
  ],
  theme: {
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
} as Config;
