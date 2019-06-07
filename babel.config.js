const compact = require('lodash/compact')

module.exports = function(api){
  const isDevelopment = process.env.NODE_ENV === 'development'
  const isTest = process.env.TEST === 'true'

  api.cache(false)

  const presets = [
    ['@babel/preset-env', {
      modules: isTest ? 'commonjs' : false,
      exclude: compact([
        !isDevelopment && 'babel-plugin-transform-classes'
      ])
    }],
    '@babel/preset-react'
  ]

  const plugins = compact([
    (isDevelopment && !isTest) && 'react-hot-loader/babel',
    'babel-plugin-lodash',
    (isDevelopment || isTest) && '@babel/plugin-proposal-class-properties'
  ])

  return {presets, plugins}
}
