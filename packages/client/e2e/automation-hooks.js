exports.setup = async (globalVars) => {
	console.log(`Global Setup`);
	globalVars.startTime = Date.now();
};

exports.teardown = async (globalVars) => {
	console.log(`Global Teardown`);
	console.log(`Time taken`, Date.now() - globalVars.startTime);
};

exports.beforeEach = async (globalVars, currentTestName) => {
	// console.log("Before", currentTestName);
};

exports.afterEach = async (globalVars, currentTestName) => {
	// console.log("After", currentTestName);
};
