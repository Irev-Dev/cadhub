const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

module.exports = (config, { env }) => {
  config.plugins.forEach((plugin) => {
    if (plugin.constructor.name === 'HtmlWebpackPlugin') {
      plugin.options.favicon = './src/favicon.svg'
    } else if (plugin.constructor.name === 'CopyPlugin') {
      plugin.patterns.push({
        from: './src/cascade/js/StandardLibraryIntellisense.ts',
        to: 'js/StandardLibraryIntellisense.ts',
      })
      plugin.patterns.push({
        from: './src/cascade/static_node_modules/opencascade.js/dist/oc.d.ts',
        to: 'opencascade.d.ts',
      })
      plugin.patterns.push({
        from: '../node_modules/three/src/Three.d.ts',
        to: 'Three.d.ts',
      })
      plugin.patterns.push({
        from: './src/cascade/fonts',
        to: 'fonts',
      })
      plugin.patterns.push({
        from: './src/cascade/textures',
        to: 'textures',
      })
    }
  })
  config.plugins.push(new MonacoWebpackPlugin())
  config.module.rules[0].oneOf.push({
    test: /opencascade\.wasm\.wasm$/,
    type: 'javascript/auto',
    loader: 'file-loader',
  })

  return config
}
