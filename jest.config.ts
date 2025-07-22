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
        tsconfig: "<rootDir>/tsconfig.jest.json",
      },
    ],
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(@babel|lodash-es|uuid|nanoid|pocketbase|next-toast-notify|@fullcalendar|@fullcalendar/core|@fullcalendar/react|@fullcalendar/daygrid|@fullcalendar/timegrid|@fullcalendar/interaction)/)",
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "!**/node_modules/**",
    "!components/recipeForm/unityOptions.ts",
    "!app/layout.tsx",
    "!app/api/userInteractions/aiChat/promptAi.ts",
    "!app/api/userInteractions/aiChat/route.ts",
    "!app/planner/page.tsx",
    "!components/PlannerCalendar.tsx",
  ],
  coverageReporters: ["text", "lcov"],
};

export default config;
