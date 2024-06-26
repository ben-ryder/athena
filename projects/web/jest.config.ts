import type { JestConfigWithTsJest } from 'ts-jest'

const jestConfig: JestConfigWithTsJest = {
	"testTimeout": 10000,
	"moduleFileExtensions": [
		"js",
		"json",
		"ts"
	],
	"rootDir": ".",
	"transform": {
		"^.+\\.ts$": ["ts-jest", {useESM: true}]
	},
	"collectCoverageFrom": [
		"**/*.ts"
	],
	"coverageDirectory": "../coverage",
	"testEnvironment": "node",
	"setupFiles": [
		"<rootDir>/tests/jest-shim.ts"
	]
}

export default jestConfig