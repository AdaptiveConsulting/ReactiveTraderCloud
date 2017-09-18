# Logs

Reactive Trader Cloud logs are setup differently for each deployment kind.

## Standard approach - Insalling everything on your machine
TODO

## Environment running in kubernetes on gcloud
- go to the [google cloud console][google-cloud-console]
- on the upper left, select *adaptive-trader*
- still on the upper left, select the 3 bars menu
- select **Logging** --> **Logs**
- get your [environment name][environment-name]
- under the **filter by**, choose: **GKE container** --> **cluster** --> *<ENVIRONMENT NAME>*

[google-cloud-console]: https://console.cloud.google.com/home/dashboard?project=adaptive-trader

[environment-name]: ./environment-name.md
