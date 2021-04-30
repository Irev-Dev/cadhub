// See this GH comment, https://github.com/facebook/docusaurus/issues/2961#issuecomment-735355912
module.exports = function (context, options) {
  return {
    name: 'postcss-tailwindcss-loader',
    configurePostCss(postcssOptions) {
      postcssOptions.plugins.push(
        require('postcss-import'),
        require('tailwindcss'),
        require('postcss-preset-env')({
          autoprefixer: {
            flexbox: 'no-2009',
          },
          stage: 4,
        })
      )
      return postcssOptions
    },
  }
}
