# Reactive Trader Client

The trading client GUI is a single page app (SPA) built using Typescript, React, RxJs and Styled components. Separate builds can be run as a desktop application using Openfin/Finsemble, in the browser, or on mobile as a PWA.

[High Level Technologies](#high-level-technologies)  
[DEV Machine Setup](#dev-machine-setup)  
[Running the client locally](#running-the-client-locally)  
[Openfin](#openfin)  
[Finsemble](#finsemble)  
[Storybook](#storybook)  
[Progressive Web App](#progressive-web-app)  
[Token replacement](#token-replacement)
[Deployment](#deployment)

## High level technologies

- HTML5, Typescript, Rx and React-RxJs
- Tests use [Jest](https://jestjs.io/)
- Streaming data abstractions are build with [RxJs](https://github.com/Reactive-Extensions/RxJS).
- Mapping Rx to React components with [react-rxjs](https://react-rxjs.org/).
- Connectivity to the backend is done via Hydra.
- Styles build using [Styled Components](https://www.styled-components.com/).
- Build system [Vite](https://vitejs.dev/)

## DEV Machine Setup

Please ensure you have [Node](https://nodejs.org)(>=v14) and [Git](https://git-scm.com/downloads) installed on your machine and on your path.

### Mac and Windows

There are no additional packages to install other than Git and a recent build of Node.

### Linux

You might want to [increase the limit](http://stackoverflow.com/questions/16748737/grunt-watch-error-waiting-fatal-error-watch-enospc) on the number of files Linux will watch. [Here's why](https://github.com/coryhouse/react-slingshot/issues/6).

```
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

## Running the client locally

Clone the repo, then install the necessary node modules:

```sh
cd /src/new-client (TODO: restore to 'client')
npm install
```

Run the local (vite) dev server, by default this will point to the **dev** backend.

```sh
npm start
```

You can then browse the app at http://localhost:1917

### Additional command line options

Run the client using mocks:

```sh
VITE_MOCKS=true npm start
```

Run the client with a back end on the cloud:

```sh
VITE_HYDRA_URL=wss://trading-web-gateway-rt-prod.demo.hydra.weareadaptive.com npm start
```

These properties are mutually exclusive, of course, and can be added individually to a `.env.local` file.

Runs unit tests with Jest.

```sh
npm run test
```

Create a production version of the application in the dist folder

```sh
npm run build
```

## Openfin

How to run local instance of RT client in OpenFin

```sh
npm run openfin:start
```

## Finsemble

How to run local instance of RT client in Finsemble

```sh
npm run finsemble:dev
```

## Storybook

How to run local instance of RT storybook

```sh
npm run storybook
```


## Progressive Web App (PWA)

Reactive Trader can be installed as a progressive web application.

The [service worker](src/serviceWorker.js) will need to be running for local development. For instructions on how to trust the self-signed localhost certificate, see [HTTPS and Create React App](https://medium.com/@danielgwilson/https-and-create-react-app-3a30ed31c904).

The settings for the PWA are configured in [`manifest.json`](public/manifest.json).

## Token replacement

The PWA [`manifest.json`](public/manifest.json) file and the [OpenFin manifests](public/openfin) contain tokens in the form `{{token}}` that can be replaced at build time with environment-specific values (e.g. the application name may have an environment suffix).

## Deployment

PR and dev deployment is through [GitHub Actions](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/tree/master/.github/workflows).

UAT and Prod deployment is through [reactive-deployments](https://github.com/AdaptiveConsulting/reactive-deployments)