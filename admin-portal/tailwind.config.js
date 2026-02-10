/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10b981', // Emerald
          dark: '#059669',
          light: '#34d399',
        },
        secondary: {
          DEFAULT: '#3b82f6', // blue
          dark: '#1d4ed8',
          light: '#60a5fa',
        },
        background: '#f8fafc',
        surface: '#ffffff',
      },
    },
  },
  plugins: [],
}

