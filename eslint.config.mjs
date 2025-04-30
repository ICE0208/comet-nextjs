import { defineConfig } from "eslint/config";
import prettier from "eslint-plugin-prettier";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import react from "eslint-plugin-react";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  {
    extends: compat.extends(
      "next/core-web-vitals",
      "next/typescript",
      "prettier"
    ),

    plugins: {
      prettier,
      "@typescript-eslint": typescriptEslint,
      react,
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",

      parserOptions: {
        project: ["tsconfig.json"],

        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    rules: {
      "prettier/prettier": "error",
      "no-console": "warn",
      "@typescript-eslint/no-unused-vars": "error",
      "prefer-const": "error",
      "arrow-body-style": ["error", "as-needed"],
      "object-shorthand": "error",
      "no-param-reassign": "error",
      "no-nested-ternary": "error",
      "react/jsx-pascal-case": "error",
      "react/self-closing-comp": "error",
      "react/jsx-no-useless-fragment": "error",
    },
  },
]);
