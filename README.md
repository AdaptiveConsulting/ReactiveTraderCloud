[![CircleCI](https://circleci.com/gh/AdaptiveConsulting/ReactiveTraderCloud/tree/master.svg?style=svg&circle-token=801547883329d22e505634493b58b26fbb742e46)](https://app.circleci.com/pipelines/github/AdaptiveConsulting/ReactiveTraderCloud?branch=master)

[![image](https://raw.githubusercontent.com/AdaptiveConsulting/ReactiveTrader/master/images/adaptive-logo.png)](http://weareadaptive.com/)

# Reactive Trader Cloud

Reactive Trader Cloud is a real-time FX trading platform designed to showcase reactive programming principles across the full application stack.

Originally [written in WPF and .Net](https://github.com/AdaptiveConsulting/ReactiveTrader), and now in React/Redux, .Net and Node.js, we continue to evolve the platform to use the latest technologies.

Please see [our Showcases page](https://weareadaptive.com/showcase/) for a full list of the latest features.

![image](docs/reactive-trader.gif)

## Demo
- [Web & Mobile](https://web-demo.adaptivecluster.com/)
- [OpenFin](https://install.openfin.co/download/?os=win&config=https%3A%2F%2Fweb-demo.adaptivecluster.com%2Fopenfin%2Fapp.json) - downloads OpenFin installer (zip)
 - [Finsemble](https://storage.googleapis.com/reactive-trader-finsemble/pkg/ReactiveTraderFinsembleSetup.exe) - downloads Finsemble installer (exe)
 - [Storybook](https://web-demo.adaptivecluster.com/storybook?path=/story/header--header) - to explore individual components developed from our [living styleguide](https://web-demo.adaptivecluster.com/styleguide)


## Installation

<details>
<summary>With Docker</summary>

1. Install Docker ([from the Docker website](https://www.docker.com/get-started))
2. Fork and clone the ReactiveTraderCloud repo ([see Contributing page](CONTRIBUTING.md))
3. From the src folder run: `docker-compose up`
4. Open a browser and navigate to http://localhost to see the application running
5. To shutdown the application run: `docker-compose down`
</details>

<details>
<summary>With Docker and Kubernetes</summary>

1. Follow the steps to run with Docker
2. From the src directory run `docker-compose build`
3. Set the environment variables:
```
export DOCKER_USER=localuser
export BUILD_VERSION=0.0.0
```
4. Run the following command: 
```
docker stack deploy --orchestrator kubernetes --compose-file ./docker-compose.yml rtcstack
```
5. To see your services and pods running, run:
```
kubectl get services
kubectl get pods
```
6. Open a browser and navigate to http://localhost to see the application running
7. To shutdown / remove stacK, run: `kubectl delete stack rtcstack`
</details>

<details>
<summary>Without Docker (for development/debugging)</summary>

1. Fork and clone the ReactiveTraderCloud repo ([see Contributing page](CONTRIBUTING.md))
2. Install dependencies & add them to your path:
 - [Node.js and npm](https://www.npmjs.com/get-npm)
 - [Git](https://git-scm.com/downloads)
 - [.Net Core SDK](https://www.microsoft.com/net)
 - [Event store](https://eventstore.com/downloads/)
 - [Crossbar](http://crossbar.io/docs/Installation-on-Windows/)
3. Start the server .Net components - from the folder: /src/server/dotNet, run:
```
dotnet restore
dotnet run -p Adaptive.ReactiveTrader.Server.Launcher --populate-eventstore
crossbar start
dotnet run -p Adaptive.ReactiveTrader.Server.Launcher all
```
4. Start the server Node components - from the srce/server/node directory run:
```
npm install
npm start
```
5. Install & start the client against the local server components - from the src/client folder run:
 ```
 npm install
 npm start:local-backend
 ```
6. Alternative commands:
- `npm run build:demo-backend` - to run the client against a demo backend running in the cloud
- `npm run test` - to run tests using Jest
</details>

## CI/CD
We practice continuous integration and deployment. Every merge to master causes a build and deployment to occur as follows:
![image](docs/CICD.jpg)

## Contributing
Please see our [contrubtion guidlines](./CONTRIBUTING.md).

## Who are we?

Reactive Trader was written by the team at [Adaptive](http://weareadaptive.com/), a consultancy that specialises in building real-time trading systems.

Please [contact us](https://weareadaptive.com/contact/) of you'd like to learn more, or follow us via our, [blog](https://weareadaptive.com/category/blog/), [Twitter](https://twitter.com/WeAreAdaptive), or [LinkedIn](https://www.linkedin.com/company/adaptive-consulting-ltd/)


## Our partners
OpenFin, Finsemble, Symphony, Glue42, ChartIQ, ag-grid, Google Cloud Platform

## License
This application is made available under the [Apache license v2.0](./LICENSE).
