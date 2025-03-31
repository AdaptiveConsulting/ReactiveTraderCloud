# Reactive Trader Client

The trading client GUI is a single page app (SPA) built using Typescript, React, RxJs and Styled Components. Separate builds can be run in the browser, on mobile or desktop as a PWA, and as a desktop platform application using Openfin or Finsemble.

[High Level Technologies](#high-level-technologies)  
[Local Development Setup](#local-development-setup)  
[Running the client locally](#running-the-client-locally)  
[Openfin](#openfin)  
[Finsemble](#finsemble)  
[Storybook](#storybook)  
[Progressive Web App](#progressive-web-app-or-pwa)  
[E2E Testing](#end-to-end-testing)  
[Token replacement](#token-replacement)  
[Deployment](#deployment)

## High level technologies

- Build system [Vite](https://vitejs.dev/)
- Tests use [Vitest](https://vitest.dev/)
- Streaming data abstractions are build with [RxJs](https://github.com/Reactive-Extensions/RxJS).
- Mapping Rx to React components with [react-rxjs](https://react-rxjs.org/).
- Styles build using [Styled Components](https://www.styled-components.com/).
- Connectivity to the backend is done via Hydra.

## Local Development Setup

Required:

- [Node](https://nodejs.org) (v20+ see "engine" spec in package.json - suggest using `nvm` to manage node instances)

VS Code / Plugins

Suggest ESLint, Prettier extensions for immediate code quality management, with configuration such as:

```json
  "editor.codeActionsOnSave": {
    "source.fixAll": "always",
    "source.addMissingImports": "explicit"
  },
  "editor.formatOnSave": true,
```

Suggest [vitest](https://marketplace.visualstudio.com/items?itemName=vitest.explorer) for running tests in the IDE (currently requires Node path to be explicitly stated as `"vitest.nodeExecutable"` in VS Code settings)

### Testing and Quality Checks

Run `npm run verify` before pushing any commits to origin to run type checking, linting, format checking, and tests. This command is run as part of the continuous integration pipeline on GitHub actions.

### Mac and Windows

There are no additional packages to install other than Git and a recent build of Node.

### Linux

You might want to [increase the limit](http://stackoverflow.com/questions/16748737/grunt-watch-error-waiting-fatal-error-watch-enospc) on the number of files Linux will watch. [Here's why](https://github.com/coryhouse/react-slingshot/issues/6).

```sh
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

## Running the client locally

Clone the repo, then install the necessary node modules:

```sh
npm install
```

Run the local (vite) dev server, by default this will point to the **dev** backend.

```sh
npm start
```

You can then browse the app at http://localhost:1917

### Additional commands

Any VITE\_\* properties may be added to a `.env.local` file (not checked in) or used to prefix an npm command.

Runs unit tests with Vitest.

```sh
npm run test
```

Create a production version of the application in the dist folder

```sh
npm run build
```

.. and run it

```sh
npm run serve
```

## Openfin

How to run a web server, to serve the client in OpenFin

```sh
npm run openfin:dev
```

and to run up the RT clients using OpenFin

```sh
npm run openfin:run:<app>
```

where `<app>` is `fx`, `credit`, `launcher`, or `limitchecker`

As a shortcut, to run the local dev server and client in one command, use

```sh
npm run openfin:start:<app>
```

#### Configs

Config files (OpenFin manifests) are located in [./public-openfin](./public-openfin).

Vite will replace placeholders at build time.

#### Troubleshooting

To debug OpenFin windows more easily (using Chromium devtools), check the relevant manifest for the appropriate port in e.g.

```json
    "arguments": "--remote-debugging-port=9092"
```

navigate to [chrome://inspect/#devices](chrome://inspect/#devices) in a Chrome tab

add the address in the dialog you get when you click "Configure ..."

```
http://localhost:<debug-port-from-above>
```

and any running OpenFin windows should be displayed, with Inspect links etc.

### NLP in the OpenFin Launcher and Workspace (below)

The OpenFin Launcher and Workspace Home UI have a search command line interface powered by [DialogFlow](https://cloud.google.com/dialogflow), where you can enter commands like

`buy 10m USDJPY`

For more insight into how NLP works see the diagflow function [doc](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/blob/master/packages/server/cloud/nlp/README.md).

### Workspace

<img src="./public-workspace/images/previews/home.PNG">

Reactive Trader Workspace is a standalone application built on the [Openfin Workspace](https://developers.openfin.co/of-docs/docs/overview-of-workspace) platform.
It is built and deployed as a separate app in the Openfin bucket in Google Cloud Storage (under the subfolder/workspace)

The manifest file is available at:
http://openfin.prod.reactivetrader.com/workspace/config/workspace.json

and at the same `/workspace/config/workspace.json` path on every other (openfin) deployment ..

#### Running Locally

Working with OpenFin workspace locally using the OpenFin CLI ...

`npm run openfin:dev` as above to serve RT apps, views and the workspace platform

`npm run openfin:run:workspace` to launch workspace (when running local dev server, you'll see the "provider" window first)

As a shortcut, to run the local dev server and client in one command, use

```sh
npm run openfin:start:workspace
```

#### Configs

Config files are located in [./public-workspace/config](./public-workspace/config).

Vite will replace placeholders at build time.

[workspace.json](./public-workspace/config/workspace.json) - This is the manifest file Openfin uses to run the workspace provider.

[snapshot.json](./public-workspace/config/snapshot.json) - A workspace window _layout_ or 'snapshot', saved from previous layout modifications - on launching this (from the Home UI) the Trading Workspace will be displayed.

`analytics, live-rates, trades.json` - Basic .json files that contain the bare minimum to launch a view in the Openfin browser using `platform.launchApp`

#### Working with Workspace Data

Workspace config for pages / snapshots is stored in IndexedDB - example below is retrieving a saved workspace snapshot

```javascript
db = indexedDB.open(
  "openfin-workspace-platform-workspaces-adaptive-workspace-provider-local",
  1,
)
db.onsuccess = () => {
  console.log("Success")
  dbResult = db.result
}
db.onerror = () => {
  console.error("BAH")
}

// check what object stores you have under that DB (can also just look in devtools)
dbResult.objectStoreNames

// open transaction, get the object store and grab the key for the saved workspace
// annoyingly you have to do this even to just "look" at the data
data = dbResult
  .transaction("workspaces")
  .objectStore("workspaces")
  .get("fc9cdd93-104c-4305-97fa-92ea5a560546")

console.log(data.result)
```

## Finsemble

How to run a web server, to serve the client in Finsemble

```sh
npm run finsemble:dev
```

The Finsemble platform code (conceptually similar to the Workspace platform above) is in an internal repo .. ask a colleague for details.

## Storybook

How to run local instance of RT storybook

```sh
npm run storybook
```

_Tech Note: Since we are no longer using a middleware, we are able to serve Storybook from root (separate web server entirely from the main RT one) during development but for production, the build is all apart of the same bundle/server from /storybook/ which is handled in `.storybook/main.ts`._

There seems to be some issues with storybook cache on some machines, we can solve it by running it without the cache. We added --no-manager-cache to the storybook script

## End to End testing

How to run e2e tests against the web

```sh
npm start
```

```sh
npm run e2e:web -- --headed --workers=1
```

arguments: --headed (launches a browser visible to the user) and --workers=1 to serialise the tests (use e.g. --workers=2 to run tests in parallel)

How to run e2e tests against openfin

```sh
npm run openfin:start:launcher
```

and launch all of the apps from the launcher

```sh
npm run e2e:openfin -- --workers=1
```

## Progressive Web App or PWA

Reactive Trader can be installed as a progressive web application.

The [service worker](src/client/Web/serviceWorkerRegistration.ts) will need to be running for local development.

The settings for the PWA are configured in [`manifest.json`](public-pwa/manifest.json), plus various settings in index.html `<head>`. All attempts to date to bring iOS splash screens back to life have been fruitless, see [pwa-splash-screens](https://github.com/applification/pwa-splash-screens/blob/master/index.html) for reference.

## Token replacement

The PWA [`manifest.json`](public-pwa/manifest.json) file and the [OpenFin manifests](public-openfin) contain tokens in the form `<BLAH>` that are replaced at build time with environment-specific values (e.g. the application name may have an environment suffix).
This is either driven by config/logic in the [workflow files](../../.github/workflows) or constants/logic in the vite build.

## Deployment

Automatic branch, PR and Dev deployment (from master branch) is through [GitHub Actions](../../.github/workflows).

Actions also make UAT (branch) and Prod (tag) builds available on Google Cloud.
