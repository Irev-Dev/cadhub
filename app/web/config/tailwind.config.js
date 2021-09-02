module.exports = {
  purge: ['src/**/*.{js,jsx,ts,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      animation: {
        'bounce-sm-slow': 'bounce-sm 5s linear infinite',
        'twist-sm-slow': 'twist-sm 10s infinite',
      },
      backgroundImage: () => ({
        texture: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%236a49c3' fill-opacity='0.47' fill-rule='evenodd'/%3E%3C/svg%3E");`,
      }),
      borderRadius: {
        half: '50%',
      },
      colors: {
        'ch-gray': {
          900: '#0D0D13',
          800: '#1A1A1D',
          750: '#222222',
          760: '#232532',
          700: '#2A3038',
          600: '#3B3E4B',
          500: '#9F9FB4',
          400: '#A4A4B0',
          300: '#CFCFD8',
        },
        'ch-purple': {
          400: '#3B0480',
          450: '#671BC6',
          500: '#8732F2',
          600: '#A663FA',
        },
        'ch-purple-gray': {
          200: '#DBDBEC',
        },
        'ch-blue': {
          600: '#79B2F8',
          500: '5098F1',
          300: '#08466F'
        },
        'ch-pink': {
          800: '#93064F',
          500: '#DF5CA0',
          300: '#F98CC5',
        },
      },
      cursor: {
        grab: 'grab'
      },
      fontFamily: {
        'ropa-sans': ['"Ropa Sans"', 'Arial', 'sans-serif'],
        roboto: ['Roboto', 'Arial', 'sans-serif'],
        'fira-code': ['"Fira Code"', 'monospace'],
        'fira-sans': ['"Fira Sans"', 'sans-serif'],
      },
      gridAutoColumns: {
        'preview-layout': 'minmax(30rem, 1fr) minmax(auto, 2fr)',
      },
      keyframes: {
        'bounce-sm': {
          '0%, 100%': {
            transform: 'translateY(-3%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
        'twist-sm': {
          '0%, 100%': {
            transform: 'rotateY(4deg)',
          },
          '50%': {
            transform: 'perspective(100px)',
          },
        },
      },
      maxWidth: {
        '7xl': '80rem',
        '8xl': '96rem',
        '9xl': '110rem',
      },
      minHeight: {
        md: '28rem',
      },
      skew: {
        '-20': '-20deg',
      },
    },
  },
  variants: {},
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
}
