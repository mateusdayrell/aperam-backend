module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: 'airbnb-base',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-console': 'off',
    'class-methods-use-this': 'off',
    'no-param-reassign': 'off',
    'import-first': 'off',
    camelcase: 'off',
    'no-plusplus': 'off',
    'no-await-in-loop': 'off',
    'linebreak-style': 'off',
    'import/no-extraneous-dependencies': 'off',
  },
};
