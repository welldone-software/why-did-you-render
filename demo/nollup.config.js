const replace = require('rollup-plugin-replace')
const babel = require('rollup-plugin-babel')
const node_resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs-alternate')

module.exports = {
  input: 'demo/src/index.js',
  output: {
    file: 'app._hash_.js',
    format: 'esm',
    assetFileNames: '[name][extname]'
  },
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.PORT': JSON.stringify(process.env.PORT)
    }),
    babel({
      exclude: 'node_modules/**'
    }),
    node_resolve(),
    commonjs()
  ]
}
