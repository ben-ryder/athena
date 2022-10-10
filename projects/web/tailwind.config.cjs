/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@ben-ryder/jigsaw/dist/**/*.js",
    // even though Storybook is test related, the extra styles generated for production builds will be basically negligible
    "./.storybook/preview.tsx",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    ...(require("@ben-ryder/jigsaw").plugins)
  ],
}