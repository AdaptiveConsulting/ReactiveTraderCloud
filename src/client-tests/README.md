# Client Tests

Collection of tests to be run to verify the application.


## Debug instructions

```json
// vscode
{
    "type": "node",
    "request": "launch",
    "name": "Debug e2e",
    "cwd": "${workspaceFolder}/src/client-tests",
    "program": "${workspaceFolder}/src/client-tests/node_modules/.bin/protractor",
    "args": [
        "./src/protractor.config.js", 
        "--specs=${file}"       // Optional. This will debug the current test suite.
    ],
    "env": {
        "BROWSER": "firefox"    // Optional. Default "chrome"
    }
}
```



