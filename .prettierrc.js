module.exports = {
  printWidth: 140,
  semi: true,
  vueIndentScriptAndStyle: true,
  singleQuote: true,
  bracketSpacing: true,
  trailingComma: 'all',
  proseWrap: 'never',
  htmlWhitespaceSensitivity: 'strict',
  endOfLine: 'auto',
  plugins: ['prettier-plugin-packagejson'],
  overrides: [
    {
      files: '.*rc',
      options: {
        parser: 'json',
      },
    },
  ],
}
