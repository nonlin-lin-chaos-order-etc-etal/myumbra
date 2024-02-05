module.exports = {
  extends: '../.eslintrc.js',
  parserOptions: {
    project: 'tsconfig.json',
    parser: '@typescript-eslint/parser',
  },
  globals: {
    env: true,
  },
};
