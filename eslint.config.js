const reactPlugin = require('eslint-plugin-react');
const js = require('@eslint/js');
const globals = require('globals');
const { includeIgnoreFile } = require('@eslint/compat');
const pluginCypress = require('eslint-plugin-cypress/flat');

// TODO: remove once all deps are using the latest version
globals.browser['AudioWorkletGlobalScope'] = globals.browser['AudioWorkletGlobalScope '];
delete globals.browser['AudioWorkletGlobalScope '];


module.exports = [
  includeIgnoreFile(__dirname +'/.gitignore'),
  js.configs.recommended,
  pluginCypress.configs.globals,
  {
    plugins: {
      cypress: pluginCypress
    },
    rules: {
      'cypress/unsafe-to-chain-command': 'error'
    },
  },
  {
    ...reactPlugin.configs.flat.recommended,
    languageOptions: {
      ...reactPlugin.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.browser,
        ...globals.jest,
        ...globals.node,
        ...globals.console,
        flushConsoleOutput: 'readable',
      },
    },
    rules: {
      'semi': ['error', 'always'],
      'curly': 'error',
      'no-var': 'error',
      'quotes': ['error', 'single'],
      'no-console': 'error',
      'no-debugger': 'warn',
      'react/jsx-uses-vars': 'error',
      'react/jsx-uses-react': 'error',
      'no-unused-vars': ['error', {
        'ignoreRestSiblings': true,
        'varsIgnorePattern': '^_',
        'argsIgnorePattern': '^_',
        'caughtErrorsIgnorePattern': '^_',
        'destructuredArrayIgnorePattern': '^_'
      }],
      'eol-last': 'error',
      'object-curly-spacing': ['error', 'always'],
      'react/prop-types': 'off',
      'react/display-name': 'off',
      'space-before-function-paren': ['error', 'never'],
      'space-before-blocks': ['error', 'always'],
      'space-in-parens': ['error', 'never'],
      'comma-dangle': ['error', 'only-multiline'],
      'func-call-spacing': ['error', 'never'],
      'no-multi-spaces': 'error',
      'indent': ['error', 2]
    }
  }
];
