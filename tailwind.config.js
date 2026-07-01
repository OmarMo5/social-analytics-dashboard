/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: { 950:'#06060a', 900:'#0b0b13', 800:'#10101a', 700:'#161624', 600:'#1e1e30' },
        gold: { DEFAULT:'#e8b84b', lt:'#f5cc70', dk:'#c49535' },
        pos: '#22c55e',
        neg: '#ef4444',
        neu: '#64748b',
      },
      fontFamily: { arabic: ['"Cairo"','sans-serif'] },
    },
  },
  plugins: [],
};
