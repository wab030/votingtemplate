
import globals from "globals";
import js from "@eslint/js";

export default [
  {
    ignores: ["tests/**"], // 
  },

  js.configs.recommended,
  
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021
      }
    }
  }
];