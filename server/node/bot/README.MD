# Reactive Trader Cloud Symphony Bot

This NodeJS bot allows users to access Reactive Trader features via Symphony, an enteprise chat application.

![alt text]( /img/chat.png "Logo Title Text 1")

## Running the bot

### Symphony Authentication

* Generate a public/private key pair

* Copy the `.env.example` to `.env` and configure accordingly
```bash
# Name and email of your bot in Symphony
BOT_NAME=rt-bot 
BOT_ADDRESS=rt-bot@weareadaptive.com

# RT trader host and port you want your bot to use 
BROKER_HOST=www.reactivetrader.com
BROKER_PORT=443

# The path and name of the private key
#   The public key is copied and stored in the Public Key field of the bot
#   account on the Symphony Admin
PRIVATE_KEY_PATH=/path/to/private-key/dir/
PRIVATE_KEY_NAME=privatekey.pem

```

For a detailed breakdown of Symphony Auhentication see their [docs](https://developers.symphony.com/symphony-developer/docs/rsa-bot-authentication-workflow)

### Google Cloud Authentication

* DialogFlow requires a GC service account key which you can create [here](https://console.cloud.google.com/apis/credentials/serviceaccountkey).

* Set the environment variable `GOOGLE_APPLICATION_CREDENTIALS=/your/service-account/key.json` (not read by dotenv)

For a detailed breakdown of Google Cloud Authentication see their [docs](https://cloud.google.com/docs/authentication/getting-started)

### Starting the bot

```
 npm run start:dev
 or
 npm run debug
```

## Debugging

If the bot is not getting data from the broker, you can restart it from kubectl in the Google Cloud console
```
# NAMESPACE represents the bot-deployment you wish to update
gcloud container clusters get-credentials cluster --zone europe-west1-c --project adaptive-trader \
&& kubectl rollout restart deployment bot-deployment --namespace NAMESPACE
```
