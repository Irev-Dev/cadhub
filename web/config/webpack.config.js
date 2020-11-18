const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

module.exports = (config, { env }) => {
  config.plugins.forEach((plugin) => {
    if (plugin.constructor.name === 'HtmlWebpackPlugin') {
      plugin.options.favicon = './src/favicon.svg'
    }
  })
  config.plugins.push(new MonacoWebpackPlugin())

  return config
}
