const compact = require('lodash/compact');

module.exports = function(api) {
  const isProd = process.env.NODE_ENV === 'production';
  const isTest = process.env.NODE_ENV === 'test';

  api.cache(false);

  const presets = [
    ['@babel/preset-env', {
      modules: isTest ? 'commonjs' : false,
    }],
    ['@babel/preset-react', {
      runtime: 'automatic',
      development: true,
      importSource: `${__dirname}`,
    }],
  ];

  const plugins = compact([
    (!isProd && !isTest) && 'react-refresh/babel',
    !isProd && '@babel/plugin-transform-class-properties',
  ]);

  return { presets, plugins };
};
