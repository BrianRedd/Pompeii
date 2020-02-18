// eslint-disable-next-line no-unused-vars
const { defaults } = require("jest-config");

module.exports = {
  testResultsProcessor: "jest-bamboo-formatter",
  watchPathIgnorePatterns: ["<rootDir>/jest.json"],
  setupFilesAfterEnv: [
    "<rootDir>/src/utils/setupTests.js",
    "jest-mock-console/dist/setupTestFramework.js"
  ],
  collectCoverageFrom: ["src/**/*.{js,jsx,mjs}"],
  setupFiles: ["<rootDir>/config/polyfills.js"],
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.{js,jsx,mjs}",
    "<rootDir>/src/**/?(*.)(spec|test).{js,jsx,mjs}"
  ],
  testEnvironment: "jsdom",
  testURL: "http://localhost",
  transform: {
    "^.+\\.(js|jsx|mjs)$": "<rootDir>/node_modules/babel-jest",
    "^.+\\.css$": "<rootDir>/config/jest/cssTransform.js",
    "^(?!.*\\.(js|jsx|mjs|css|json)$)": "<rootDir>/config/jest/fileTransform.js"
  },
  transformIgnorePatterns: ["[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs)$"],
  moduleNameMapper: {
    "^react-native$": "react-native-web"
  },
  moduleFileExtensions: [
    "web.js",
    "js",
    "json",
    "web.jsx",
    "jsx",
    "node",
    "mjs"
  ],
  globals: {
    window: true,
    XMLHttpRequest: true
  },
  snapshotSerializers: ["enzyme-to-json/serializer"],
  verbose: true
};
