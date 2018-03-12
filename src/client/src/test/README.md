# How to run

Run the following commands:

1.  Install node packages - `npm install`
2.  Run tests :
    a) default browser (Chrome) - `nightwatch`
    b) run with a different browser - `nightwatch --env firefox`

# Configuration:

Node Config Manager

Environment variables

NODE_CONFIG_DIR String ./config Config directory path
NODE_ENV String -- Node environment
NODE_CAMEL_CASE Boolean false Naming convention of variables

# Nightwatch integration with IDEs

## IntelliJ / Webstorm

Read and follow the step-by-step instruction on how to integrate Nightwatch into Webstorm to run and debug tests inside your IDE:
https://github.com/nightwatchjs/nightwatch/wiki/Debugging-Nightwatch-tests-in-WebStorm

## VSCode

1.  Create a new folder in the root directory called .vscode
2.  Add launch.json file in it
3.  Place the following configurantion inside:

{
"version": "0.2.0",
"configurations": [
{
"type": "node",
"request": "launch",
"name": "Nightwatch",
"program": "${workspaceRoot}/node_modules/nightwatch/bin/nightwatch",
"args": ["--env", "chrome"],
"console": "integratedTerminal"
}
],
"compounds": []
}

You can use different browser by changing the args value.
