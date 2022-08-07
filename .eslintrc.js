/** @type {import('eslint').Linter.Config} */
module.exports = {
  env: {
    browser: false,
    es2021: true,
    mocha: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:eslint-comments/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:node/recommended",
    "plugin:prettier/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  parserOptions: { project: "./tsconfig.json" },
  settings: { "import/resolver": { typescript: { project: "tsconfig.json" } } },
  rules: {
    "no-shadow": "error",
    "node/no-missing-import": "off",
    "node/no-unpublished-import": "off",
    "node/no-unpublished-require": "off",
    "eslint-comments/no-unused-disable": "error",
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-unused-vars": ["error", { ignoreRestSiblings: true }],
    "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
    "node/no-unsupported-features/es-syntax": ["error", { ignores: ["modules"] }],
  },
  overrides: [
    {
      files: ["**/*.{test,spec}.{ts,js}"],
      extends: [
        "plugin:mocha/recommended",
        "plugin:chai-expect/recommended",
        "plugin:chai-friendly/recommended",
      ],
      rules: {
        "func-names": "off",
        "mocha/no-mocha-arrows": "off",
      },
    },
  ],
};
