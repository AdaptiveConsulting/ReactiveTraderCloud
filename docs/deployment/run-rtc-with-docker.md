# Run Reactive Trader Cloud with docker (without kubernetes)

## Setup and validate docker
Follow the [docker setup instructions](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/blob/master/docs/deployment/docker-setup.md)

## Run
### already pre-built images
You can run Reactive Trader Cloud locally using pre-built Docker images by running the runAll script in the docker directory:
```bash
.deploy/docker/runAll
```

### your local rtc images
Follow the [local build instructions](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/blob/master/docs/deployment/build-rtc-locally.md)
```bash
.deploy/docker/runAll localBuildId
```

## See it running
This will download the 4 images required for Reactive Trader Cloud and run them. Check that they are running:

```bash
$ docker ps
CONTAINER ID        IMAGE                           COMMAND                  CREATED             STATUS              PORTS               NAMES
edce33456efd        reactivetrader/servers:0.1      "bash -c 'dotnet run "   6 minutes ago       Up 5 minutes                            analytics
dc5a84cfd971        reactivetrader/servers:0.1      "bash -c 'dotnet run "   6 minutes ago       Up 5 minutes                            blotter
2c37eb4f30f1        reactivetrader/servers:0.1      "bash -c 'dotnet run "   6 minutes ago       Up 6 minutes                            tradeexecution
aeb3cd1ffdfc        reactivetrader/servers:0.1      "bash -c 'dotnet run "   6 minutes ago       Up 6 minutes                            pricing
9285b85818ed        reactivetrader/servers:0.1      "bash -c 'dotnet run "   6 minutes ago       Up 6 minutes                            reference
e7994ff99e40        reactivetrader/broker:0.0       "/bin/sh -c 'crossbar"   11 minutes ago      Up 11 minutes                           broker
b766ac9c9709        reactivetrader/eventstore:0.0   "/bin/sh -c './run-no"   12 minutes ago      Up 11 minutes                           eventstore
07a7848c23c1        reactivetrader/web:0.0          "bash -c 'cp /localho"   12 minutes ago      Up 12 minutes                           web
```

Wait a short while for the services to start up, then in a browser navigate to the docker address (`localhost` for linux users and something like `192.168.99.100` for windows/mac users) and the web client will load.
