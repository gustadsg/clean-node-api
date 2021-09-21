import config from "./jest.config";

const ciConfig = {
  ...config,
  coverageReporters: [
    "text", // show coverage on terminal
    "json",
    "lcov",
    "clover",
  ],
  collectCoverage: true,
};

export default ciConfig;
