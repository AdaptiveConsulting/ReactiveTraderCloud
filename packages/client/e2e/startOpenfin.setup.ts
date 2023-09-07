import { NodeWebDriver, OpenFinSystem } from "@openfin/automation-helpers";
import { chromium, test as setup } from "@playwright/test"
import childProcess from "child_process";
import fsPromises from "fs/promises";
import path from "path";

async function run(openFinRVM:string, manifestUrl:string, chromeDriverPort:number, devToolsPort:number) {
	let chromiumDriver;
	let openFinRVMProcess;
  const RUNTIME_ADDRESS = process.env.OPENFIN_RUNTIME_ADDRESS ?? ""

	try {
		console.log("Removing any existing OpenFin processes");
    await import("fkill").then((killapps:any) => {
      killapps(
        [
          "OpenFin.exe",
          "OpenFinRVM.exe",
          "chromedriver.exe",
          "OpenFin",
          "OpenFinRVM",
          "chromedriver",
        ],
        { silent: true, force: true },
      )
    })

		// Spawn the OpenFin runtime with a specific debugging port and also
		// configure the selenium web driver to use the same port for debugger address
		console.log("Start OpenFin Runtime");
		openFinRVMProcess = childProcess.spawn(
			openFinRVM,
			[`--config=${manifestUrl}`, `--runtime-arguments="--remote-debugging-port=${devToolsPort}"`],
			{ shell: true }
		);

		try {
			// Cleanup the old screenshots from the last run
			await fsPromises.rm("./reports/screenshots/", { recursive: true, force: true });
		// eslint-disable-next-line no-empty
		} catch {}

		// Configure the chromedriver on a specific port and also communicate
		// this to the selenium driver
		await chromium.connectOverCDP(`${RUNTIME_ADDRESS}`);

		// Start the selenium webdriver with the ports for debugging and chrome driver
		// This allows for greater flexibility in term of configuration
		// but you could just call startSession on the SeleniumWebDriver
		console.log("Building the chrome webdriver");
		chromiumDriver = new NodeWebDriver()

 chromium.launchServer({port: devToolsPort, devtools: true, })

		// Set the webdriver in the global namespace to that any test helper methods
		// can access it directly, this will also set a global seleniumWebDriver
		// which can be use in tests to access the raw selenium methods
		globalThis.webDriver = new NodeWebDriver(chromiumDriver);

		console.log("Waiting for OpenFin runtime to be available...");
		await OpenFinSystem.waitForReady(10000);

	} 
	 catch (err) {
			console.error(err);
		}
}

setup("start openfin", async () => {
  // console.log("Removing any existing OpenFin processes")
  // // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // await import("fkill").then((killapps:any) => {
  //   killapps(
  //     [
  //       "OpenFin.exe",
  //       "OpenFinRVM.exe",
  //       "chromedriver.exe",
  //       "OpenFin",
  //       "OpenFinRVM",
  //       "chromedriver",
  //     ],
  //     { silent: true, force: true },
  //   )
  // })
  const testManifestUrl =
	"http://localhost:1917/config/rt-fx.json";
const chromeDriverPort = 1917;
const devToolsPort = 9090;

console.log('DevTools Port', devToolsPort);
console.log('ChromeDriver Port', chromeDriverPort);
const openFinRVM = path.join(process.env.dirname!, 'OpenFin', 'OpenFinRVM.exe');
console.log('OpenFinRVM', openFinRVM);

//   console.log("Removing any existing OpenFin processes")

//   exec("npm run openfin:start:fx")
//   await page.waitForTimeout(30000)
// These parameters could be supplied through command line options
run(openFinRVM, testManifestUrl, chromeDriverPort, devToolsPort)
	.then(() => console.log('Done'))
	.catch((err) => console.error(err));
})
