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
- Tests use [Vitest](https://vitest.dev/)
- Streaming data abstractions are build with [RxJs](https://github.com/Reactive-Extensions/RxJS).
- Mapping Rx to React components with [react-rxjs](https://react-rxjs.org/).
- Connectivity to the backend is done via Hydra.
- Styles build using [Styled Components](https://www.styled-components.com/).
- Build system [Vite](https://vitejs.dev/)

## Local Development Setup

Please ensure you have

- [Node](https://nodejs.org)(v20+, suggest using nvm to manage node instances) and
- [Git](https://git-scm.com/downloads)

installed on your machine and on your path.

### Testing and Quality Checks

Run `npm run verify` before pushing to run type checking, linting, format checking, and tests.
This command is run as part of the continuous integration pipeline on GitHub actions.

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
cd src/client
npm install
```

Run the local (vite) dev server, by default this will point to the **dev** backend.

```sh
npm start
```

You can then browse the app at http://localhost:1917

To run while pointing to a local hydra backend.

```sh
npm start:local
```

### Additional command line options

Any VITE\_\* properties may be added to a `.env.local` file (not checked in).

Runs unit tests with Vitest.

```sh
npm run test
```

Create a production version of the application in the dist folder

```sh
npm run build
```

## Openfin

How to run a web server, to serve the client in OpenFin

```sh
npm run openfin:dev
```

and to run up the RT client using OpenFin

```sh
npm run openfin:run:blah
```

where blah is fx, credit, launcher

As a shortcut, to run the server and client in one command, use

```sh
npm run openfin:start:blah
```

For more insight into how NLP works in RT see their [doc](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/blob/master/server/cloud/nlp/README.md).

## Finsemble

How to run a web server, to serve the client in Finsemble

```sh
npm run finsemble:dev
```

The Finsemble client code is in an internal repo .. ask a colleague for details.

## Storybook

How to run local instance of RT storybook

```sh
npm run storybook
```

## End to End testing (web and openfin)

How to run e2e tests against the web

```sh
npm start
```

```sh
npm run e2e:web -- --headed --workers=1
```

arguments: --headed (launches a browser visible to the user) and --workers=2 (the tests run in parallel)

How to run e2e tests against openfin

```sh
npm run openfin:start:fx
npm run openfin:start:credit
```

```sh
npm run e2e:openfin -- --workers=1
```

_Tech Note: Since we are no longer using a middleware, we are able to serve Storybook from root (separate web server entirely from the main RT one) during development but for production, the build is all apart of the same bundle/server from /storybook/ which is handled in `.storybook/main.ts`._

There seems to be some issues with storybook cache on some machines, we can solve it by running it without the cache. We added --no-manager-cache to the storybook script

## Progressive Web App (PWA)

Reactive Trader can be installed as a progressive web application.

The [service worker](src/client/Web/serviceWorkerRegistration.ts) will need to be running for local development.

The settings for the PWA are configured in [`manifest.json`](public-pwa/manifest.json), plus various settings in index.html `<head>`. All attempts to date to bring iOS splash screens back to life have been fruitless, see [pwa-splash-screens](https://github.com/AdaptiveConsulting/blob/master/public-pwa/splashscreen) for reference.

## Token replacement

The PWA [`manifest.json`](public-pwa/manifest.json) file and the [OpenFin manifests](public-openfin) contain tokens in the form `{{token}}` that can be replaced at build time with environment-specific values (e.g. the application name may have an environment suffix).

## Deployment

Automatic branch, PR and Dev deployment (from master branch) is through [GitHub Actions](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/tree/master/.github/workflows).

Actions also make UAT and Prod builds available on Google Cloud - see [reactive-deployments](https://github.com/AdaptiveConsulting/reactive-deployments) for more details.
