const replace = require('@rollup/plugin-replace');
const babel = require('@rollup/plugin-babel').default;
const nodeResolve = require('rollup-plugin-node-resolve');
const alias = require('rollup-plugin-alias');
const commonjs = require('rollup-plugin-commonjs-alternate');
const refresh = require('rollup-plugin-react-refresh');

module.exports = {
  input: 'demo/src/index.js',
  output: {
    file: 'app._hash_.js',
    format: 'esm',
    assetFileNames: '[name][extname]',
  },
  plugins: [
    alias({
      entries: {
        '@welldone-software/why-did-you-render': `${__dirname}/../src/index.js`,
      },
    }),
    replace({
      preventAssignment: true,
      values: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'process.env.PORT': JSON.stringify(process.env.PORT),
      }
    }),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
    }),
    nodeResolve({
      mainFields: ['module', 'browser', 'main'],
    }),
    commonjs({}),
    refresh(),
  ],
};
