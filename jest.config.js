module.exports = {
	collectCoverage: true,
	coverageDirectory: "coverage",
	coverageProvider: "v8",
	setupFiles: ["<rootDir>/.jest/setEnvVars.js"],
	testEnvironment: "node",
	verbose: true,
};
