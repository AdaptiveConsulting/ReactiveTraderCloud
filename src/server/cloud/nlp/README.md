This package was created following this example [https://github.com/GoogleCloudPlatform/functions-framework-nodejs/blob/master/docs/typescript.md](https://github.com/GoogleCloudPlatform/functions-framework-nodejs/blob/master/docs/typescript.md)

# Intro

A Google Cloud Function to detect an intent on the `adaptive-trader` DialogFlow.


## Natural Language Process (NLP)

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