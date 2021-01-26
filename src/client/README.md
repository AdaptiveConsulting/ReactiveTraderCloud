# Reactive Trader Client

The trading client GUI is a single page app (SPA) built using Typescript, React, Redux and Styled components. It can run as a desktop application using Openfin/Finsemble/Glue42, in the browser, or on mobile as a PWA.

[High Level Technologies](#high-level-technologies)  
[DEV Machine Setup](#dev-machine-setup)  
[Running the client locally](#running-the-client-locally)  
[Openfin](#openfin)  
[Progressive Web App](#progressive-web-app)  
[Token replacement](#token-replacement)  

## High level technologies

- HTML5, Typescript, Redux and React
- Tests use [Jest](https://jestjs.io/)
- Streaming data abstractions are build with [RxJs](https://github.com/Reactive-Extensions/RxJS).
- GUI state management is done with [redux](https://redux.js.org/).
- Connectivity to the backend is done via [RxStomp](https://github.com/stomp-js/rx-stomp).
- Styles build using [Styled Components](https://www.styled-components.com/).

## DEV Machine Setup

Please ensure you have [Node](https://nodejs.org)(>=v10), [npm](https://github.com/npm/npm)(>=v5) and [Git](https://git-scm.com/downloads) installed on your machine and on your path.

### Mac and Windows

There are no additional packages to install other than Git and a recent build of Node.

### Linux

You might want to [increase the limit](http://stackoverflow.com/questions/16748737/grunt-watch-error-waiting-fatal-error-watch-enospc) on the number of files Linux will watch. [Here's why](https://github.com/coryhouse/react-slingshot/issues/6).

```
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

## Running the client locally

Clone the repo and install the necessary node modules:

```sh
cd /src/client/
npm install  # Install Node modules listed in ./package.json
npm start    # Compile and launch the webpack dev server. By default, the client connects to the dev environment.
```

You can then browse the app at [http://localhost:3000](http://localhost:3000)

### Additional command line options

Run the client with pointing to your local backend server:

```sh
npm run start:local-backend
```

Run the client with a back end on the cloud:

```sh
npm run start:dev-backend

# or

npm run start:demo-backend
```

Runs unit tests with Jest.

```sh
npm run test
```

Create a production version of the application in the dist folder

```sh
npm run build

# You can also build versions for particular enviroment
npm run build:demo-backend
npm run build:dev-backend

```

## Openfin

How to run local instance of RT client in OpenFin

1. Start the client locally per above steps

2. Start openfin

```sh
npm run openfin
```

### Openfin launcher

```sh
npm run openfin:launcher
```

## Pogressive Web App (PWA)

Reactive Trader can be installed as a progressive web application.

For local development, use `npm run start:https` to run in secure mode.

For instructions on how to trust the self-signed localhost certificate, see [HTTPS and Create React App](https://medium.com/@danielgwilson/https-and-create-react-app-3a30ed31c904).

The [service worker](src/serviceWorker.js) also needs to be running.

The settings for the PWA are configured in [`manifest.json`](public/manifest.json).

### Token replacement

The PWA [`manifest.json`](public/manifest.json) file and the [OpenFin manifests](public/openfin) contain tokens in the form `{{token}}` that can be replaced at build or run time with environment-specific values (e.g. the application name may have an environment suffix).

#### Local token replacement

When running the client locally with `npm start`, the tokens are replaced with [`copy-webpack-plugin`](https://webpack.js.org/plugins/copy-webpack-plugin/).

This happens in [`config-overrides.js`](config-overrides.js), which is used by [`react-app-rewired`](https://github.com/timarney/react-app-rewired) to replace the tokens while copying the manifest files.

It only takes place when `NODE_ENV === development`, i.e. when `npm start` is used, and it uses environment variables defined in the `.env.development` file, e.g. `ENVIRONMENT_NAME`.

#### Docker token replacement

When running in docker, i.e. in a deployment environment, the token replacement is done by the nginx web server, also with environment variables.

For this, we don't use the `nginx/nginx` base docker image, but instead the `openresty/openresty` docker image, which adds Lua scripting modules to nginx that allows us to do this.

#### nginx config

The file [`nginx/ngnix.conf`](nginx/nginx.conf) declares the environment variables to pull in, e.g.:
```
env ENVIRONMENT_NAME;
```

The file [`nginx/default.conf`](nginx/default.conf) uses a [resty template](https://github.com/bungle/lua-resty-template) to do the token replacement with environment variables, as files like `manifest.json` and `openfin/app.json` are being served.

For more info, see the [`Dockerfile`](Dockerfile).

#### Providing environment variables

When running docker locally (with `docker-compose up`), the environment variables are defined in the [`.env`](../.env) file.

When running in the cloud, the environment variables for each kubernetes pod are provide by a [config map](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/), e.g.:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: client-config
  namespace: uat
data:
  environment-name: uat
```
To see how the config is mapped, refer to [`client-deployment.yaml`](../services/kubernetes/per-deployment/client-deployment.yaml).
