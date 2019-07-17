## End-to-End testing using node.js, Protractor and Jasmine.

## Starting the GUI:

Clone the repo and install the necessary node modules:

-   `npm install` # Install Node modules listed in ./package.json
-   `npm start`   # Compile and launches the webpack dev server. By default, the client connects to a demo environment.

You can then browse the app at <http://localhost:3000>

## Run ui e2e tests:

Choose the right configuration and run it from root on local

-   `npm run webdriver-update`
-   `npm run e2e`

## Prerequisites:

### Install Node.js and Java (latest version).

## Setup for Protractor:

Protractor is an end-to-end test framework for Angular and AngularJS applications. Protractor runs tests against your application running in a real browser, interacting with it as a user would. Use npm to install Protractor globally with:

-   `npm install -g protractor`

This will install two command line tools, protractor and webdriver-manager. Try running protractor --version to make sure it's working. The webdriver-manager is a helper tool to easily get an instance of a Selenium Server running. Use it to download the necessary binaries with:

-   `webdriver-manager update`

Now start up a server with:

-   `webdriver-manager start`

This will start up a Selenium Server and will output a bunch of info logs. Your Protractor test will send requests to this server to control a local browser. You can see information about the status of the server at <http://localhost:4444/wd/hub>.

## Jasmine Framework :

It is a behavior-driven development framework for testing JavaScript code. It is an independent framework having clean and obvious syntax. So, ultimately it helps any end user or non-technical person to write test cases with simple and understandable manner. Jasmine is compatible with Protractor due to which all resources that are extracted from browsers can be used to make tests as promises. Those promises are resolved internally by using the “expect” command from Jasmine.

-   `npm install jasmine`

## Jasmine Spec Reporter:

The jasmine-spec-reporter can be used to enhance your Protractor tests execution report.
Install jasmine-spec-reporter via npm:

-   `npm install jasmine-spec-reporter`

## Contributing:

1.  Create your branch off develop:

-   Semantics: `<type>-<jira-ticket-id>-<descriptive-name>`
-   Examples:
    -   `git checkout -b test/rtc-666-name-of-feature`
    -   `git checkout -b feat/rtc-777_name_of_feature`
    -   `git checkout -b refactor/rtc-888_name_of_feature`

2.  Commit your changes (`git commit -am '<type>(<jira-token>): <subject>'`)
3.  Push to the branch (`git push origin feat/fooBar`)
4.  Open a pull request, completing the checklist.
