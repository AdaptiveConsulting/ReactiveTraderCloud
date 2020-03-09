# Run Reactive Trader Cloud with kubernetes

- [Run Reactive Trader Cloud with kubernetes](#run-reactive-trader-cloud-with-kubernetes)
  - [Start RTC](#start-rtc)
  - [See your services and pods running](#see-your-services-and-pods-running)
  - [See it running](#see-it-running)
  - [Remove stack](#remove-stack)

## Start RTC

If you never ran docker-compose up and your images are not built,
in terminal go to ../../src folder and execute the following command:

```bash
docker-compose build
```

You may need to set the environment variables because the .env file won't be loaded unlike when running docker-compose.

```bash
export DOCKER_USER=localuser
export BUILD_VERSION=0.0.0
```

Run the following command:

```bash
docker stack deploy --orchestrator kubernetes --compose-file ./docker-compose.yml rtcstack
```

## See your services and pods running

```bash
kubectl get services
```

```bash
kubectl get pods
```

## See it running

Open a browser, navigate to the docker address (`localhost`) and the web client will load.

## Remove stack

```bash
kubectl delete stack rtcstack
```
