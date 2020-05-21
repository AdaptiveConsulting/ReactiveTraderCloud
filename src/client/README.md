# Reactive Trader Client

## Pogressive Web App (PWA)

Reactive Trader can be installed as a progressive web application.

For local development, use `npm run start:https` to run in secure mode.

For instructions on how to trust the self-signed localhost certificate, see [HTTPS and Create React App](https://medium.com/@danielgwilson/https-and-create-react-app-3a30ed31c904).

The [service worker](src/serviceWorker.js) also needs to be running.

The settings for the PWA are configured in [`manifest.json`](public/manifest.json).

## Token replacement

The [`manifest.json`](public/manifest.json) file contains tokens in the form `{{token}}` that can be replaced at build or run time with environment-specific values (e.g. the application name may have an environment suffix).

### Local token replacement

When running the client locally with `npm start`, the tokens are replaced with [`copy-webpack-plugin`](https://webpack.js.org/plugins/copy-webpack-plugin/).

This happens in [`config-overrides.js`](config-overrides.js), which is used by [`react-app-rewired`](https://github.com/timarney/react-app-rewired) to replace the tokens while copying the manifest file.

It only takes place when `NODE_ENV === development`, i.e. when `npm start` is used, and it uses environment variables defined in the `.env.development` file, e.g. `ENVIRONMENT_NAME`.

### Docker token replacement

When running in docker, i.e. in a deployment environment, the token replacement is done by the nginx web server, also with environment variables.

For this, we don't use the `nginx/nginx` base docker image, but instead the `openresty/openresty` docker image, which adds Lua scripting modules to nginx that allows us to do this.

#### nginx config

The file [`nginx/ngnix.conf`](nginx/nginx.conf) declares the environment variables to pull in, e.g.:
```
env ENVIRONMENT_NAME;
```

The file [`nginx/default.conf`](nginx/default.conf) uses a [resty template](https://github.com/bungle/lua-resty-template) to do the token replacement with environment variables, as `manifest.json` is being served.

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
For more info, see [`client-deployment.yaml`](../services/kubernetes/client-deployment.yaml).