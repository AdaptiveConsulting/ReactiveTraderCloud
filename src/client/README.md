# Reactive Trader Client

The trading client GUI is a single page app (SPA) built using Typescript, React, RxJs and Styled components. Separate builds can be run in the browser, on mobile or desktop as a PWA, and as a desktop platform application using Openfin or Finsemble.

[High Level Technologies](#high-level-technologies)  
[Local Development Setup](#local-development-setup)  
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

## Local Development Setup

Please ensure you have

- [Node](https://nodejs.org)(V16.x, suggest using nvm to manage node instances) and
- [Git](https://git-scm.com/downloads)

installed on your machine and on your path.

### Testing and Quality Checks

Run `npm run verify` before pushing to run type checking, linting, format checking, and tests.
This command is run as part of the continuous integration pipeline on GitHub actions.

### Mac and Windows

There are no additional packages to install other than Git and a recent build of Node.

For Node 17+, on Windows, we have to suppress new DNS lookup behaviour as it interferes with the OpenFin CLI.

So this must be added to shell / profile:

    export NODE_OPTIONS=--dns-result-order=ipv4first

Ref: https://github.com/nodejs/node/issues/40702

### Linux

You might want to [increase the limit](http://stackoverflow.com/questions/16748737/grunt-watch-error-waiting-fatal-error-watch-enospc) on the number of files Linux will watch. [Here's why](https://github.com/coryhouse/react-slingshot/issues/6).

```
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

## Running the client locally

Clone the repo, then install the necessary node modules:

```sh
cd src/client
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

Any VITE\_\* properties may be added to a `.env.local` file (not checked in).

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

_Tech Note: this is running the standard react storybook local server (which is based on [webpack-dev-middleware](https://github.com/webpack/webpack-dev-middleware)) with a configured public path of /storybook, for deployment purposes.
This means that we need a customer middleware.js to redirect, therefore the landing page resolves to http://localhost:6006/storybook start url_

There seems to be some issues with storybook cache on some machines, we can solve it by running it without the cache. We added --no-manager-cache to the storybook script

## Progressive Web App (PWA)

Reactive Trader can be installed as a progressive web application.

The [service worker](src/serviceWorker.js) will need to be running for local development.

The settings for the PWA are configured in [`manifest.json`](public/manifest.json), plus various settings in index.html `<head>`. All attempts to date to bring iOS splash screens back to life have been fruitless, see [pwa-splash-screens](https://github.com/applification/pwa-splash-screens/blob/master/index.html) for reference, previous client [index.html](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/blob/chore/classic-retirement/src/client/public/index.html) and many angry comments on the web.

## Token replacement

The PWA [`manifest.json`](public/manifest.json) file and the [OpenFin manifests](public/openfin) contain tokens in the form `{{token}}` that can be replaced at build time with environment-specific values (e.g. the application name may have an environment suffix).

## Deployment

Automatic branch, PR and Dev deployment (from master branch) is through [GitHub Actions](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/tree/master/.github/workflows).

Actions also make UAT and Prod builds available on Google Cloud - see [reactive-deployments](https://github.com/AdaptiveConsulting/reactive-deployments) for more details.
