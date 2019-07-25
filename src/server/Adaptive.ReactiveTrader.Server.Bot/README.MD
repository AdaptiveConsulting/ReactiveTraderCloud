# Reactive Trader Cloud Symphony Bot

This NodeJS bot allows users to access Reactive Trader features via Symphony, an enteprise chat application.

![alt text]( /img/chat.png "Logo Title Text 1")


### Configuring the bot:

To run the applicaion make sure you have the following set in your enviromental variables:

```bash
# Name and email of your bot in Symphony
BOT_NAME=rt-bot 
BOT_ADDRESS=rt-bot@weareadaptive.com

# RT trader host and port you want your bot to use 
BROKER_HOST=web-demo.adaptivecluster.com
BROKER_PORT=80

# The private key of your symphony account
PRIVATE_KEY= '-----BEGIN PUBLIC KEY-----\nMIICIjANBgkqh...FUCAwEAAQ==\n-----END PUBLIC KEY-----'

```
For more information about Symphony's authentication flow, see thier website:
https://developers.symphony.com/restapi/docs/rsa-bot-authentication-workflow

### Running the bot:

Once you have set the Enviromental variables run the following command

```
 npm run dev
 or
 npm run dev:debug
```
