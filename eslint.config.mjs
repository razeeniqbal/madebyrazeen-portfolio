import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Local build-check output (NEXT_DIST_DIR=.next-verify).
    ".next-verify/**",
    // Other tools' local worktrees (not part of this project).
    ".kilo/**",
  ]),
]);

export default eslintConfig;
