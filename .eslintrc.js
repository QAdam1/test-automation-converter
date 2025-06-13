module.exports = {
  env: {
    node: true,
    es2020: true
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    project: "./tsconfig.json"
  },
  plugins: ["@typescript-eslint", "prettier"],
  rules: {
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "prettier/prettier": "error",
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "no-debugger": "warn",
    "no-duplicate-imports": "error",
    "no-unused-expressions": "error",
    "no-unused-vars": "off", // Using TypeScript's no-unused-vars instead
    "prefer-const": "error",
    "sort-imports": [
      "error",
      {
        ignoreCase: false,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ["none", "all", "multiple", "single"]
      }
    ]
  },
  ignorePatterns: [
    "dist",
    "node_modules",
    "coverage",
    "*.js",
    "*.d.ts",
    "vitest.config.ts"
  ]
}; 