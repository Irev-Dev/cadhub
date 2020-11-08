module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
    defaultLineHeights: true,
    standardFontWeights: true
  },
  purge: [],
  theme: {
    extend: {
      maxWidth: {
        '7xl': '80rem',
        '8xl': '96rem',
        '9xl': '110rem',
      },
      minHeight: {
        'md': '28rem'
      },
      fontFamily: {
        'ropa-sans': ['Ropa Sans', 'Arial', 'sans-serif'],
        'roboto': ['Roboto', 'Arial', 'sans-serif'],
      },
      skew: {
        '-20': "-20deg"
      },
      borderRadius: {
        half: '50%',
      }
    }
  },
  variants: {},
  plugins: []
}
