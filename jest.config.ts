// filepath: /Users/edu/Projects/recipe-app/jest.config.ts
import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "\\.(css|scss|sass)$": "identity-obj-proxy",
  },
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.jest.json", // Usa el archivo específico para Jest
      },
    ],
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(@babel|lodash-es|uuid|nanoid|pocketbase|next-toast-notify)/)",
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "!**/node_modules/**",
    "!**/utils/**",
    "!components/recipeForm/unityOptions.ts",
    "!app/context/recipes/recipeActionTypes.ts",
  ],
  coverageReporters: ["text", "lcov"],
};

export default config;
