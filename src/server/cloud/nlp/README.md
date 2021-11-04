This package was created following this example [https://github.com/GoogleCloudPlatform/functions-framework-nodejs/blob/master/docs/typescript.md](https://github.com/GoogleCloudPlatform/functions-framework-nodejs/blob/master/docs/typescript.md)

# Intro

A Google Cloud Function to detect an intent on the `adaptive-trader` DialogFlow.


## Scripts

**Note** - To run the solution locally you will need be able to authenticate using a service account to connect to dialogflow

`npm run start`

Will serve the function locally using the `functions-framework`

**Note** - Requires solution to have been compiled into `/build`

`npm run watch`

Will watch and compile the files whilst serving the function

`npm run lint` & `npm run fix`

Runs lint from [gts](https://github.com/google/gts)

`npm run compile`

Runs lint, cleans the solution and then compiles using `tsc` into the `build` folder

`npm run deploy`

Compiles the solution and then deploys the function using gcloud.

**Note** - You will need to have gcloud installed locally, logged in and appropriate permissions for the adaptive-trader project