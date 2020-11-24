const compact = require('lodash/compact')

module.exports = function(api){
  const isProd = process.env.NODE_ENV === 'production'
  const isTest = process.env.TEST === 'true'
  const isUseClassicJSX = process.env.USE_CLASSIC_JSX === 'true'

  api.cache(false)

  const presets = [
    ['@babel/preset-env', {
      modules: isTest ? 'commonjs' : false
    }],
    ['@babel/preset-react', {
      runtime: isUseClassicJSX ? 'classic' : 'automatic',
      development: true,
      importSource: isUseClassicJSX ? undefined : `${__dirname}`
    }]
  ]

  const plugins = compact([
    (!isProd && !isTest) && 'react-hot-loader/babel',
    !isProd && '@babel/plugin-proposal-class-properties'
  ])

  return {presets, plugins}
}
