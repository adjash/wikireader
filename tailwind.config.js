/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1a202c", // Tailwind default dark blue-gray
        secondary: "#4a5568", // Tailwind default light blue-gray
        accent: "#3182ce", // Tailwind default blue
      },
    },
  },
  plugins: [],
};
