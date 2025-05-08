// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",   // ✅ ให้ Tailwind ดูโค้ดใน src ด้วย
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};