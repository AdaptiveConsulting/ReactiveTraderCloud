This package was created following this example [https://github.com/GoogleCloudPlatform/functions-framework-nodejs/blob/master/docs/typescript.md](https://github.com/GoogleCloudPlatform/functions-framework-nodejs/blob/master/docs/typescript.md)

# Intro

A Google Cloud Function to detect an intent in [DialogFlow](https://dialogflow.cloud.google.com/).

## Natural Language Processing (NLP)

NLP interprets and executes tasks based on natural language commands expressed by the user. It leverages the capabilities of NLP algorithms and models to understand the user's input, extract relevant information, and take the necessary actions on their behalf.

The search engine supports a wide range of commands.
Here are a few examples:

```
How is the currency market?
Show me all Fx prices?
What does the market look like?
What does FX look like?

How is Cable doing?
Price EURUSD
Quote EURUSD
Spot EURUSD
What is the current EURUSD rate?

Buy USDGBP 10M
Sell 20M JPYUSD

Show market
Show me my last 5 trades
Show me my last GBPUSD trades
What were my last 5 JPY trades
```

## Scripts

**Note** - To run the solution locally you will need be able to authenticate using a service account to connect to dialogflow

`npm run start`

Serve the function locally using the `functions-framework`

**Note** - Requires solution to have been compiled into `/build`

`npm run watch`

Will watch and compile the files whilst serving the function

`npm run lint`

Runs lint, using new ESLint "flat config" (enabled in VS Code folder settings with "eslint.useFlatConfig": true)

`npm run format:check`

Runs prettier on codebase, independent from ESLint, which just focuses on code quality

`npm run build`

Builds using `tsc` into the `build` folder

`npm run deploy`

Deploys the function in `build` to GCP Cloud Functions using gcloud CLI.

## GCloud Notes

1. You will need to have gcloud installed locally, logged in and appropriate permissions for the RT project in GCP.

2. Cloud Function Runtimes: using Node 20 currently .. for a list of available runtimes, run `gcloud functions runtimes list`
