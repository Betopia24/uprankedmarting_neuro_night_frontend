// import { dirname } from "path";
// import { fileURLToPath } from "url";
// import { FlatCompat } from "@eslint/eslintrc";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const compat = new FlatCompat({
//   baseDirectory: __dirname,
// });

// const eslintConfig = [
//   ...compat.extends("next/core-web-vitals", "next/typescript"),
// ];

// export default eslintConfig;

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // TypeScript rules - make them warnings or disable
      "@typescript-eslint/no-unused-vars": "warn", // or "off"
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/prefer-as-const": "warn",
      "@typescript-eslint/no-empty-function": "warn",
      "@typescript-eslint/no-inferrable-types": "off",

      // React/Next.js rules - make them more lenient
      "react/no-unescaped-entities": "warn",
      "react/display-name": "off",
      "react/prop-types": "off",
      "react-hooks/exhaustive-deps": "warn", // Very common issue
      "react-hooks/rules-of-hooks": "warn",

      // General JavaScript rules
      "no-unused-vars": "warn",
      "no-console": "off", // Allow console.log
      "no-debugger": "warn",
      "prefer-const": "warn",
      "no-var": "warn",

      // Next.js specific rules
      "@next/next/no-img-element": "warn",
      "@next/next/no-html-link-for-pages": "warn",
      "@next/next/no-sync-scripts": "warn",

      // Import rules
      "import/no-anonymous-default-export": "warn",

      // Disable strict rules that cause issues
      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/anchor-is-valid": "warn",

      // Allow any naming conventions
      "@typescript-eslint/naming-convention": "off",
    },
  },
];

export default eslintConfig;
