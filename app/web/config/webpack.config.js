
module.exports = (config, { env }) => {
  config.plugins.forEach((plugin) => {
    if (plugin.constructor.name === 'HtmlWebpackPlugin') {
      plugin.userOptions.favicon = './src/favicon.svg'
    }
  })
  return config
}
