/** @type {import('tailwindcss').Config} */
module.exports = {
  // Все файлы, где используются классы NativeWind (className="...")
  content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
};
