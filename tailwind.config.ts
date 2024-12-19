import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],

  theme: {
    extend: {
      colors: {
        "primary": "#379584",
        "primary-hover": "#2a776a"
      }
    }
  },

  plugins: []
} as Config;
