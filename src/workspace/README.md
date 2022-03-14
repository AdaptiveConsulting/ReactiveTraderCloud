# Openfin Workspace

<img src="./screenshot.PNG">

The Reactive Trader Openfin Workspace Provider is a standalone application that registers a platform provider with Openfin. It is built separately to the Reactive Trader client, and deployed to the Openfin bucket in Google Cloud Storage (under the subfolder/workspace)

The manifest file is available at - `http://openfin.dev|uat|prod.reactivetrader.com/workspace/config/workspace.json`

Branch builds are located at - 
`http://openfin.env.reactivetrader.com/branch/branch_name/workspace/config/workspace.json`

PR builds are located at -
`http://openfin.env.reactivetrader.com/pull/pr_id/workspace/config/workspace.json`


## Running Locally

Run the Workspace Provider 

- `npm run start` to start the server
- `openfin:run` to launch the provider

Reactive Trader client will need to be running to open any RT basedapps/views. `npm run openfin:dev` from the `src/client` directory

Reactive Analytics will need to be running to open the RA app/view. `npm run start` from the `ReactiveAnalytics/src` directory.

## Configs

Config files are located in [./config](./config).

Vite will replace placeholders at run/build time.

[workspace.json](./config/workspace.json) - This is the manifest file Openfin uses to run the workspace provider.

[snapshot.json](./config/snaphot.json) - An example of a 'snapshot'. This is what pages are saved as. The term snapshot and page are interchangeable.

`analytics, live-rates, trades & reactive-analytics.json` - Basic .json files that contain the bare minimum to launch a view in the Openfin browser using `platform.launchApp`

### Scripts

`npm start` - Starts the vite dev server

`npm run build` - Builds the application

`npm run openfin:run` - Launch the provider application in Openfin

`npm run openfin:start` - Start the server and launch the provider

`npm run kill`, `npm run kill:fin`, `npm run kill:rvm` - Kill the Openfin processes