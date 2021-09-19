// While the raw-loader Webpack plugin actually makes these imports work, this
// eliminates noisy TypeScript errors by registering these file endings as types.
// Learned this method of registering modules from https://stackoverflow.com/a/57444766
declare module '*.md'
declare module '*.scad'
declare module '*.py'
declare module '*.jscad.js'
