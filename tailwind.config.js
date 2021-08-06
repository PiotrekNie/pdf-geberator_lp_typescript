module.exports = {
  purge: ['./src/**/*.html', './src/**/*.js', './src/**/*.scss'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ['Klavika', 'Arial', 'sans-serif'],
    },
    extend: {
      maxWidth: {
        min: 'min-content',
        max: 'max-content',
        xxs: '15.5rem',
      },
      container: {
        center: true,
      },
      screens: {
        sm: '576px',
        md: '768px',
        lg: '992px',
        xl: '1200px',
      },
    },
  },
  variants: {
    extend: {
      textDecoration: ['active'],
    },
  },
  // eslint-disable-next-line global-require
  plugins: [require('@tailwindcss/ui'), require('@tailwindcss/forms')],
};
