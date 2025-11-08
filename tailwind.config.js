/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        main: 'var(--sw-main)',
        sidebar: 'var(--sw-sidebar)',
        accent: 'var(--sw-accent)',
      },
    },
  },
  plugins: [],
};
