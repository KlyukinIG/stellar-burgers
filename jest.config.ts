import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@ui/(.*)$': '<rootDir>/src/components/ui/$1',
    '^@ui-pages/(.*)$': '<rootDir>/src/components/ui/pages/$1',
    '^@api$': '<rootDir>/src/utils/burger-api.ts',
    '^@utils-types$': '<rootDir>/src/utils/types.ts',
    '^@slices/(.*)$': '<rootDir>/src/services/slices/$1',
    '^@pages/(.*)$': '<rootDir>/src/pages/$1'
  },

  testMatch: ['**/__tests__/**/*.jest.(ts|tsx)', '**/?(*.)+(jest).(ts|tsx)'],

  transformIgnorePatterns: [
    '\\\\node_modules\\\\',
    '\\.pnp\\.[^\\\\]+$',
    ' / tests / '
  ],

  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
};

export default config;
