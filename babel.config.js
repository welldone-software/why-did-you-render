/* eslint-disable no-console */

module.exports = function(api){
  const isDemo = api.env('demo')
  const isTest = api.env('test')

  const presets = [
    ['@babel/preset-env', {
      modules: isTest ? 'commonjs' : false
    }],
    '@babel/preset-react'
  ]

  const plugins = [
    'babel-plugin-lodash'
  ]

  if(isDemo || isTest){
    plugins.push('@babel/plugin-proposal-class-properties')
  }

  return {presets, plugins}
}
