const js = require("@eslint/js");
const tseslint = require("typescript-eslint");
const importPlugin = require("eslint-plugin-import");
const prettierRecommended = require("eslint-plugin-prettier/recommended");
const globals = require("globals");

module.exports = tseslint.config(
  {
    ignores: ["dist/**", ".serverless/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  prettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    settings: {
      "import/resolver": {
        typescript: true,
      },
    },
    rules: {
      "import/prefer-default-export": "off",
      "import/extensions": ["error", { ts: "never" }],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "off",
      "prettier/prettier": ["error", { printWidth: 80 }],
    },
  },
  {
    files: ["eslint.config.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
);
