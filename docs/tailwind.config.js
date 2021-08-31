const webConfig = require('../app/web/config/tailwind.config.js')
module.exports = {
  ...webConfig,
  purge: ['./src/**/*.html', './src/**/*.js', './src/**/*.ts', './src/**/*.tsx', './blog/**/*.md', './blog/**/*.mdx', './docs/**/*.md', './docs/**/*.mdx', './src/**/*.css'],
  plugins: []
}
