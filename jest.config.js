module.exports = {
    moduleFileExtensions: ["js", "ts", "json"],
    globals: {
        'ts-jest': {
          tsConfig: "<rootDir>/tsconfig.json",
          isolatedModules: true,
        }
      },
    roots: [
        '<rootDir>/src'
      ],
      testMatch: [
        '<rootDir>/src/test/**/*.steps.ts'
      ],    
    setupFiles: ["<rootDir>/src/jest/setEnvVars.ts"],
    preset: "ts-jest"
}; 