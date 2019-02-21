/* eslint-disable */
/* tslint:disable */

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

// This script exists to mimic the functionality that will ultimately be provided
// by the OpenFin services API. It's primary purpose is to deploy the shared assets
// needed by Excel to a common location, and to start the ExcelService process
fin.desktop.main(() => {
    var consoleLog;
    var consoleError;
    var excelServiceUuid = '886834D1-4651-4872-996C-7B2578E953B9';
    var installFolder = '%localappdata%\\OpenFin\\shared\\assets\\excel-api-addin';
    var servicePath = 'OpenFin.ExcelService.exe';
    var addInPath = 'OpenFin.ExcelApi-AddIn.xll';
    var excelServiceEventTopic = 'excelServiceEvent';
    // This promise resolves when the ExcelService is ready
    var excelServicePromise = Promise.resolve()
        .then(configureLogger)
        .then(assertServiceIsNotRunning)
        .then(() => Promise.resolve()
        .then(deploySharedAssets)
        .then(tryInstallAddIn)
        .then(startExcelService)
        .catch(err => console.error(err)))
        .catch(() => consoleLog('Service Already Running: Skipping Deployment and Registration'));
    function configureLogger() {
        return new Promise(resolve => {
            fin.desktop.System.getMinLogLevel(logLevel => {
                if (logLevel === fin.desktop.System.logLevels.INFO) {
                    consoleLog = console.log;
                    consoleError = console.error;
                }
                else {
                    consoleLog = () => { };
                    consoleError = () => { };
                }
                resolve();
            });
        });
    }
    // Technically there is a small window of time between when the UUID is
    // registered as an external application and when the service is ready to
    // receive commands. This edge-case will be best handled in the future 
    // with the availability of plugins and services from the fin API
    function assertServiceIsNotRunning() {
        return new Promise((resolve, reject) => {
            fin.desktop.System.getAllExternalApplications(extApps => {
                var excelServiceIndex = extApps.findIndex(extApp => extApp.uuid === excelServiceUuid);
                if (excelServiceIndex >= 0) {
                    reject();
                }
                else {
                    resolve();
                }
            });
        });
    }
    function deploySharedAssets() {
        return new Promise((resolve, reject) => {
            fin.desktop.Application.getCurrent().getManifest(manifest => {
                fin.desktop.System.launchExternalProcess({
                    alias: 'excel-api-addin',
                    target: servicePath,
                    arguments: `-d "${installFolder}" -c ${manifest.runtime.version}`,
                    listener: result => {
                        consoleLog(`Asset Deployment completed! Exit Code: ${result.exitCode}`);
                        resolve();
                    }
                }, () => consoleLog('Deploying Shared Assets'), err => reject(err));
            });
        });
    }
    function tryInstallAddIn(connected) {
        var xllInstalledCookie = 'openfin-xll-installed';
        return new Promise((resolve, reject) => {
            if (document.cookie.includes(xllInstalledCookie)) {
                consoleLog('Add-In previously installed');
                resolve();
            }
            else {
                fin.desktop.System.launchExternalProcess({
                    path: `${installFolder}\\${servicePath}`,
                    arguments: `-i "${installFolder}"`,
                    listener: result => {
                        if (result.exitCode === 0) {
                            consoleLog('Add-In Installed');
                            document.cookie = `${xllInstalledCookie}; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
                            resolve();
                        }
                        else {
                            reject(new Error(`Installation failed. Exit code: ${result.exitCode}`));
                        }
                    }
                }, () => consoleLog('Installing Add-In'), err => reject(err));
            }
        });
    }
    function startExcelService() {
        return new Promise((resolve, reject) => {
            var onExcelServiceEvent;
            fin.desktop.InterApplicationBus.subscribe('*', excelServiceEventTopic, onExcelServiceEvent = () => {
                consoleLog('Excel Service Alive');
                fin.desktop.InterApplicationBus.unsubscribe('*', excelServiceEventTopic, onExcelServiceEvent);
                resolve();
            });
            chrome.desktop.getDetails(function (details) {
                fin.desktop.System.launchExternalProcess({
                    target: `${installFolder}\\${servicePath}`,
                    arguments: '-p ' + details.port,
                    uuid: excelServiceUuid,
                }, process => {
                    consoleLog('Service Launched: ' + process.uuid);
                }, error => {
                    reject('Error starting Excel service');
                });
            });
        });
    }
    // This is a very shallow polyfill for the services API
    window.fin.desktop.Service = {
        connect: serviceOpts => {
            var serviceUuid = serviceOpts.uuid;
            if (serviceUuid !== excelServiceUuid) {
                console.error('Unknown service UUID!');
            }
            return excelServicePromise;
        }
    };
});
//# sourceMappingURL=service-loader.js.map

/***/ })
/******/ ]);