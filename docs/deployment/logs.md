# Logs

- [Logs](#logs)
    - [Standard approach - Installing everything on your machine](#standard-approach---installing-everything-on-your-machine)
    - [Environment running in kubernetes on gcloud](#environment-running-in-kubernetes-on-gcloud)
    - [Environment running with docker](#environment-running-with-docker)

Reactive Trader Cloud logs are setup differently for each deployment kind.

## Standard approach - Installing everything on your machine
TODO

## Environment running in kubernetes on gcloud
- get your [environment name][environment-name]
- go to the [google cloud console][google-cloud-console]
- on the upper left, select **adaptive-trader**
- still on the upper left, select the **3 bars menu**
- select:
    - **Logging**
    - --> **Logs**
- under the **filter by**, choose:
    - **GKE container**
    - --> **cluster**
    - --> **<ENVIRONMENT_NAME>**

## Environment running with docker
All logs will be shown on the console following the **./deploy/docker/runAll** command

[google-cloud-console]: https://console.cloud.google.com/home/dashboard?project=adaptive-trader
[environment-name]: ./environment-name.md
