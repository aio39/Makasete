const colors = require('tailwindcss/colors');

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {},
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.trueGray,
      indigo: colors.indigo,
      red: colors.rose,
      yellow: colors.amber,
      mint: {
        DEFAULT: '#39c5bb',
      },
    },
  },
  variants: {
    extend: {
      display: ['group-hover'],
      backgroundColor: ['group-hover'],
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // import tailwind forms
  ],
};
