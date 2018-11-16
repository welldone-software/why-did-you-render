import {flatMap} from 'lodash'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import {terser} from 'rollup-plugin-terser'

import pkg from './package.json'

export default flatMap([false, true], shouldMinify => [
  {
    input: 'src/index.js',
    output: {
      name: 'whyDidYouRender',
      file: pkg.browser.replace('.min', shouldMinify ? '.min' : ''),
      format: 'umd',
      sourcemap: shouldMinify,
      sourcemapFile: pkg.browser.replace('.js', '.js.map')
    },
    plugins: [
      babel({
        exclude: 'node_modules/**'
      }),
      resolve(),
      commonjs(),
      shouldMinify && terser()
    ]
  },
  {
    input: 'src/index.js',
    output: [
      // {file: pkg.module, format: 'es'}
      // when https://github.com/TrySound/rollup-plugin-terser/issues/5 fixed
      {
        file: pkg.main.replace('.min', shouldMinify ? '.min' : ''),
        format: 'cjs',
        sourcemap: shouldMinify,
        sourcemapFile: pkg.main.replace('.js', '.js.map')
      }
    ],
    plugins: [
      babel({
        exclude: 'node_modules/**'
      }),
      resolve(),
      commonjs(),
      shouldMinify && terser()
    ],
    external: id => /lodash/.test(id)
  },
  {
    input: 'src/index.js',
    output: [
      {
        file: pkg.module.replace('.min', shouldMinify ? '.min' : ''),
        format: 'esm',
        sourcemap: shouldMinify,
        sourcemapFile: pkg.module.replace('.js', '.js.map')
      }
    ],
    plugins: [
      babel({
        exclude: 'node_modules/**'
      }),
      resolve(),
      commonjs(),
      shouldMinify && terser()
    ],
    external: id => /lodash/.test(id)
  }
])
