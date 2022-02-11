[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/AdaptiveConsulting/ReactiveTraderCloud/CI)](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/actions?query=workflow%3ACI)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/AdaptiveConsulting/ReactiveTraderCloud)](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/releases/latest)
[![GitHub](https://img.shields.io/github/license/AdaptiveConsulting/ReactiveTraderCloud)](https://opensource.org/licenses/Apache-2.0)

[![image](https://raw.githubusercontent.com/AdaptiveConsulting/ReactiveTrader/master/images/adaptive-logo.png)](http://weareadaptive.com/)

# Reactive Trader®

Reactive Trader® is a real-time FX trading platform designed to showcase reactive programming principles across the full application stack.

Originally [written in WPF and .Net](https://github.com/AdaptiveConsulting/ReactiveTrader), and now in React/Redux, .Net and Node.js, we continue to evolve the platform to use the latest technologies.

Please see [our Showcase page](https://weareadaptive.com/showcase/) for a full list of the latest features.

![image](docs/reactive-trader.gif)


## Setting up the Test


1. Fork and clone the ReactiveTraderCloud repo

2. Navigate to `/src/client` and install Cypress ([from the Cypress website](https://docs.cypress.io/guides/getting-started/installing-cypress))

3. Start the application on localhost by hitting `npm run start`

4. Open a browser and navigate to http://localhost to see the application running. 

5. Navigate to `/src/client` to see the list of feature files

6. Now hit the command in different terminal `npx cypress open` to open the cypress interactive window.

7. Now, click on the feature file present on the Testrunner window to trigger the test.

8. If you want to run the test in terminal, please hit `npx cypress run --spec <path to feature file> --browser chrome`

9. Cucmber Report Integration is in progress currently.


## Setting up Cucmber Framework: 

1. Folow the steps from Cucumber official Readme. ```https://github.com/TheBrainFamily/cypress-cucumber-preprocessor#readme```

## Contributing

Please see our [contribution guidelines](./CONTRIBUTING.md).

## Who are we?

Reactive Trader was written by the team at [Adaptive](http://weareadaptive.com/), a consultancy that specialises in building real-time trading systems.

Please [contact us](https://weareadaptive.com/contact/) if you'd like to learn more, or follow us via our [blog](https://weareadaptive.com/category/blog/), [Twitter](https://twitter.com/WeAreAdaptive), or [LinkedIn](https://www.linkedin.com/company/adaptive-consulting-ltd/).

## License

This application is made available under the [Apache license v2.0](./LICENSE).
