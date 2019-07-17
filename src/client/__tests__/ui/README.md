## End-to-End testing using node.js, Protractor and Jasmine.

##Starting the GUI:

Clone the repo and install the necessary node modules:

1.  npm install  # Install Node modules listed in ./package.json
2.  npm start    # Compile and launches the webpack dev server. By default, the client connects to a demo environment.

You can then browse the app at <http://localhost:3000>

## Run Reactive Trader UI tests:

Choose the right configuration and run it from root on local

3.  npm run webdriver-update
4.  npm run e2e

## Setup for Protractor:

Protractor is an end-to-end test framework for Angular and AngularJS applications. Protractor runs tests against your application running in a real browser, interacting with it as a user would. Use npm to install Protractor globally with:

5.  npm install -g protractor --save-dev

This will install two command line tools, protractor and webdriver-manager. Try running protractor --version to make sure it's working. The webdriver-manager is a helper tool to easily get an instance of a Selenium Server running. Use it to download the necessary binaries with:

6.  webdriver-manager update

Now start up a server with:

7.  webdriver-manager start

This will start up a Selenium Server and will output a bunch of info logs. Your Protractor test will send requests to this server to control a local browser. You can see information about the status of the server at <http://localhost:4444/wd/hub>.

## Jasmine Framework :

It is a behavior-driven development framework for testing JavaScript code. It is an independent framework having clean and obvious syntax. So, ultimately it helps any end user or non-technical person to write test cases with simple and understandable manner. Jasmine is compatible with Protractor due to which all resources that are extracted from browsers can be used to make tests as promises. Those promises are resolved internally by using the “expect” command from Jasmine.

8.  npm install jasmine --save-dev

## Jasmine Spec Reporter:

The jasmine-spec-reporter can be used to enhance your Protractor tests execution report.
Install jasmine-spec-reporter via npm:

9.  npm install jasmine-spec-reporter --save-dev
