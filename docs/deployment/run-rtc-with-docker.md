# Run Reactive Trader Cloud with docker (without kubernetes)

- [Run Reactive Trader Cloud with docker (without kubernetes)](#run-reactive-trader-cloud-with-docker-without-kubernetes)
    - [Start RTC](#start-rtc)
    - [See it running](#see-it-running)
    - [Stop all the running containers](#stop-all-the-running-containers)

Running RTC with docker is extremely easy

## Start RTC
In terminal go to ../../src folder and execute the following command:
```bash
docker-compose up
```

## See it running
Open a browser, navigate to the docker address (`localhost`) and the web client will load.

## Stop all the running containers
```bash
docker-compose down
```
