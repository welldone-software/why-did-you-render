/* eslint-disable no-console */
const compact = require('lodash/compact')

module.exports = function(api){
  const isDevelopment = api.env('development')
  const isTest = api.env('test')

  const presets = [
    ['@babel/preset-env', {
      modules: isTest ? 'commonjs' : false,
      exclude: ['babel-plugin-transform-classes']
    }],
    '@babel/preset-react'
  ]

  const plugins = compact([
    isDevelopment && 'react-hot-loader/babel',
    !isDevelopment && 'babel-plugin-lodash',
    (isDevelopment || isTest) && '@babel/plugin-proposal-class-properties'
  ])

  return {presets, plugins}
}
