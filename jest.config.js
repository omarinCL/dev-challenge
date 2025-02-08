module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/tests'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    collectCoverage: true,
    clearMocks: true,
    coverageDirectory: "coverage",
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    verbose: true,
    testTimeout: 10000
};