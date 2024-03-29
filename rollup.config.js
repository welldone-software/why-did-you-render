import fs from 'fs';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import license from 'rollup-plugin-license';

const loadJSON = (path) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url)));

const pkg = loadJSON('./package.json');

const banner = `
<%= pkg.name %> <%= pkg.version %>
MIT Licensed 
Generated by <%= pkg.authors[0] %>
Generated at <%= moment().format('YYYY-MM-DD') %>
`;

export default [
  {
    input: 'src/index.js',
    external: ['lodash', 'react'],
    output: [
      {
        name: 'whyDidYouRender',
        file: pkg.main,
        format: 'umd',
        sourcemap: true,
        exports: 'default',
        globals: {
          lodash: 'lodash',
          react: 'react',
        },
      },
    ],
    plugins: [
      babel({
        exclude: 'node_modules/**',
        babelHelpers: 'bundled',
      }),
      resolve(),
      commonjs(),
      license({
        sourcemap: true,
        banner,
      }),
    ],
  },
];
