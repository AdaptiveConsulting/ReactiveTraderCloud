# Logs

- [Logs](#logs)
    - [Remote Environment running in on gcloud](#environment-running-in-on-gcloud)
    - [Local Environment running with docker](#environment-running-with-docker)

## Remote Environment running on gcloud
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

## Local Environment running with docker
All logs will be shown on the console following the `docker-compose up` command

[google-cloud-console]: https://console.cloud.google.com/home/dashboard?project=adaptive-trader
[environment-name]: ./environment-name.md
