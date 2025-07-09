import { includeIgnoreFile } from "@eslint/compat";
import prettier from "eslint-config-prettier";
import svelteConfig from "./svelte.config.js";
import { globalIgnores } from "eslint/config";
import svelte from "eslint-plugin-svelte";
import { fileURLToPath } from "node:url";
import ts from "typescript-eslint";
import globals from "globals";
import js from "@eslint/js";

const gitignorePath = fileURLToPath(new URL("./.gitignore", import.meta.url));

export default ts.config(
  includeIgnoreFile(gitignorePath),
  globalIgnores(["pb_data/types.d.ts"]),
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs.recommended,
  prettier,
  ...svelte.configs.prettier,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      "no-undef": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    files: ["**/*.svelte", "**/*.svelte.ts", "**/*.svelte.js"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        extraFileExtensions: [".svelte"],
        parser: ts.parser,
        svelteConfig,
      },
    },
  },
);
