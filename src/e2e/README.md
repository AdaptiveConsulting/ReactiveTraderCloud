# e2e test pack

A collection of e2e tests based on protractor and jasmine frameworks.

## Execution

### Docker mode
The easiest way to run the tests is in docker mode:  
1. From /src folder run:  
`docker-compose build`
2. Change protractor.config.js to have:  
`baseUrl: 'http://localhost'`
3. Then to start the system and the tests:  
`docker-compose -f docker-compose.e2e.yml -f docker-compose.yml up`

### Local run mode
1. Pre-requisite: navigate to e2e folder and install all the needed dependencies  
`npm install`
2. Start RT locally one of the ways described [here](../../README.md##installation)
3. To run the tests navigate to e2e folder and run:  
`npm run e2e`

## How to contribute
You can contribute to our test code same way as for our prod code: [Contributing page](../../CONTRIBUTING.md)

## Debugging
You can debug e2e tests in VSCode via creating the following run configuration:
```json
// vscode
{
  "type": "node",
  "request": "launch",
  "name": "Debug e2e",
  "cwd": "${workspaceFolder}/src/e2e",
  "program": "${workspaceFolder}/src/e2e/node_modules/.bin/protractor",
  "args": [
    "./src/protractor.config.js",
    "--baseUrl=http://localhost", // Optional. Default "http://localhost:3000"
    "--specs=${file}" // Optional. This will debug the current test suite.
  ],
  "env": {
    "BROWSER": "chrome" // Optional. ["chrome", "firefox", "chromeheadless"] Default "chromeheadless"
  }
}
```
