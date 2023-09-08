export async function setup(globalVars) {
	console.log(`Global Setup`);
	globalVars.startTime = Date.now();
}

export async function teardown(globalVars) {
	console.log(`Global Teardown`);
	console.log(`Time taken`, Date.now() - globalVars.startTime);
}

export async function beforeEach(globalVars, currentTestName) {
	// console.log("Before", currentTestName);
}

export async function afterEach(globalVars, currentTestName) {
	// console.log("After", currentTestName);
}
