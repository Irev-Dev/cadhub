
module.exports = (config, { env }) => {
  config.plugins.forEach((plugin) => {
    if (plugin.constructor.name === 'HtmlWebpackPlugin') {
      plugin.userOptions.favicon = './src/favicon.svg'
    }
  })
  config.module.rules.push({
    test: /\.(md|jscad\.js|py|scad|curv)$/i,
    use: 'raw-loader',
  });
  return config
}
