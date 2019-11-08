# e2e

Collection of tests to be run to verify the application.

## Debug instructions

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
        "--baseUrl=http://localhost",   // Optional. Default "http://localhost:3000"
        "--specs=${file}"               // Optional. This will debug the current test suite.
    ],
    "env": {
        "BROWSER": "chrome"             // Optional. ["chrome", "firefox", "chromeheadless"] Default "chromeheadless"
    }
}
```



