// Fixa o fuso do runner de testes no fuso real do usuário (BLS Idiomas opera
// só em America/Sao_Paulo). Sem isso, teste que crava instante/data local
// (ex.: `todayLocalDate`) só passa por acidente de onde o runner roda. Tem
// que vir antes de `require('next/jest')`, para vencer o `TZ` do shell.
process.env.TZ = 'America/Sao_Paulo';

const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.d.ts',
    '!src/**/index.js',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  // Configurações para evitar stack overflow com Next.js 16
  maxWorkers: 1,
  forceExit: true,
  detectOpenHandles: true,
  workerIdleMemoryLimit: '512MB',
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
