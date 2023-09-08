const { SeleniumWebDriver, OpenFinSystem } = require('@openfin/automation-helpers');
const childProcess = require('child_process');
const chromedriver = require('chromedriver');
const fkill = require('fkill');
const fs = require('fs');
const fsPromises = require('fs/promises');
const Mocha = require('mocha');
const path = require('path');
const { Builder } = require('selenium-webdriver');

/**
 * Run the selenium tests.
 * @param openFinRVM The location of the OpenFin RVM.
 * @param manifestUrl The url of the manifest to launch.
 * @param chromeDriverPort The port to use for chromedriver.
 * @param devToolsPort The port to use for devtools.
 */
async function run(openFinRVM, manifestUrl, chromeDriverPort, devToolsPort) {
	let seleniumDriver;
	let openFinRVMProcess;
	try {
		console.log('Removing any existing OpenFin processes');
		await fkill(
			['OpenFin.exe', 'OpenFinRVM.exe', 'chromedriver.exe', 'OpenFin', 'OpenFinRVM', 'chromedriver'],
			{ silent: true, force: true }
		);

		// Spawn the OpenFin runtime with a specific debugging port and also
		// configure the selenium web driver to use the same port for debugger address
		console.log('Start OpenFin Runtime');
		openFinRVMProcess = childProcess.spawn(
			openFinRVM,
			[`--config=${manifestUrl}`, `--runtime-arguments="--remote-debugging-port=${devToolsPort}"`],
			{ shell: true }
		);

		try {
			// Cleanup the old screenshots from the last run
			await fsPromises.rm('./reports/screenshots/', { recursive: true, force: true });
		} catch {}

		// Configure the chromedriver on a specific port and also communicate
		// this to the selenium driver
		await chromedriver.start([`--port=${chromeDriverPort}`], true);

		// Start the selenium webdriver with the ports for debugging and chrome driver
		// This allows for greater flexibility in term of configuration
		// but you could just call startSession on the SeleniumWebDriver
		console.log('Building the selenium webdriver');
		seleniumDriver = new Builder()
			.usingServer(`http://localhost:${chromeDriverPort}`)
			.withCapabilities({
				'goog:chromeOptions': {
					debuggerAddress: `localhost:${devToolsPort}`
				}
			})
			.forBrowser('chrome')
			.build();

		// Set the webdriver in the global namespace to that any test helper methods
		// can access it directly, this will also set a global seleniumWebDriver
		// which can be use in tests to access the raw selenium methods
		globalThis.webDriver = new SeleniumWebDriver(seleniumDriver);

		console.log('Waiting for OpenFin runtime to be available...');
		await OpenFinSystem.waitForReady(10000);

		await runMochaTests();
	} finally {
		try {
			if (seleniumDriver) {
				await seleniumDriver.quit();
			}
			chromedriver.stop();
			if (openFinRVMProcess) {
				await fkill(openFinRVMProcess.pid, { silent: true, force: true });
			}
		} catch (err) {
			console.error(err);
		}
	}
}

/**
 * Run tests using mocha.
 * @returns The test runner.
 */
async function runMochaTests() {
	return new Promise((resolve, reject) => {
		console.log();
		console.log('Running Tests with Mocha');

		const mocha = new Mocha();
		mocha.timeout(60000);

		mocha.addFile('./test/index.spec.js');

		const runner = mocha.run(resolve);

		runner.on('test', (test) => {
			// Set the current test name, which is used by screenshots to name the file
			globalThis.automation = globalThis.automation ?? {};
			globalThis.automation.currentTestName = test.title;
		});
	});
}

// The version of the chromedriver in the package.json should match the runtime version from the app manifest.
// e.g. if the manifest runtime version is 31.112.75.4 then the chromedriver version should be "112.0.0"
const testManifestUrl =
	'https://built-on-openfin.github.io/workspace-starter/workspace/v13.1.0/register-with-home/manifest.fin.json';
const chromeDriverPort = 5678;
const devToolsPort = 9122;

console.log('DevTools Port', devToolsPort);
console.log('ChromeDriver Port', chromeDriverPort);
const openFinRVM = path.join(process.env.LocalAppData, 'OpenFin', 'OpenFinRVM.exe');
console.log('OpenFinRVM', openFinRVM);

let isFile = false;
try {
	const stats = fs.statSync(openFinRVM);
	isFile = stats.isFile();
} catch {}
if (!isFile) {
	console.error('ERROR: OpenFinRVM is missing, exiting...');
	// eslint-disable-next-line unicorn/no-process-exit
	process.exit(1);
}

// These parameters could be supplied through command line options
run(openFinRVM, testManifestUrl, chromeDriverPort, devToolsPort)
	.then(() => console.log('Done'))
	.catch((err) => console.error(err));
