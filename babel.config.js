const compact = require('lodash.compact')

module.exports = function(api){
  const isProd = process.env.NODE_ENV === 'production'
  const isTest = process.env.TEST === 'true'

  api.cache(false)

  const presets = [
    ['@babel/preset-env', {
      modules: isTest ? 'commonjs' : false
    }],
    '@babel/preset-react'
  ]

  const plugins = compact([
    (!isProd && !isTest) && 'react-hot-loader/babel',
    !isProd && '@babel/plugin-proposal-class-properties'
  ])

  return {presets, plugins}
}
