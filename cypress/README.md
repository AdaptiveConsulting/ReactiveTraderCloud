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

2. Start the application on localhost by hitting `npm run start`

4. Open a browser and navigate to http://localhost:1917 to see the application running. 

5. Navigate to `/cypress/integration` to see the list of feature files

6. Now hit the command in different terminal `npx cypress open` to open the cypress interactive window.

7. Now, click on the feature file present on the Testrunner window to trigger the test.

8. If you want to run the test in terminal, please hit `npx cypress run --spec <path to feature file> --browser chrome`

9. To run test using command line, please use `npm run tests`

9. Cucumber Report Integration is in progress currently.

