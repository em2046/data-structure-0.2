module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "jest"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jest/recommended",
    "plugin:prettier/recommended",
  ],
  rules: {
    "padding-line-between-statements": [
      "error",
      { blankLine: "always", prev: "*", next: ["return", "block-like"] },
      {
        blankLine: "always",
        prev: ["const", "let", "var", "block-like"],
        next: "*",
      },
      {
        blankLine: "never",
        prev: ["const", "let", "var"],
        next: ["const", "let", "var"],
      },
      { blankLine: "always", prev: "directive", next: "*" },
      { blankLine: "any", prev: "directive", next: "directive" },
    ],
    "capitalized-comments": [
      "error",
      "always",
      { ignoreConsecutiveComments: true },
    ],
    "spaced-comment": ["error", "always"],
  },
};
