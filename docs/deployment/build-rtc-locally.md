# You want to: build RTC locally

## Docker images
- `Build`: we use several docker images to build RTC:
    - **Base images**:
        - *Crossbar*: base for Broker
        - *Dotnet*: base for Servers
        - *Eventstore*: base for PopulatedEventstore
        - *Nginx*: base for web, nsgate and minikubegate
        - *Node*: base to build web content
    - **RTC**:
        - *servers*: An image to run all backends services containers:
            - Analytics
            - Blotter
            - Broker
            - Pricing
            - ReferenceDataRead
            - TradeExecution
        - *Web*: This service host the static content and act as a proxy in fron of the broker
        - *PopulatedEventstore*: A populated version of the eventstore image. We use servers to populate
        - *Broker*: A crossbar image with the configuration
    - **Utilities**:
        - *Gcloud*: image used for the clis Gcloud and Kubectl
        - *Minikugegate*: image that give access to RTC when running on local minikube cluster
        - *Nsgate*: image that give access to RTC when running on google cloud
        - *Testtools*: image with simple utilitise to connect and debug other services

## Procedure
### Setup and validate docker
follow the [docker setup instructions](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/blob/master/docs/deployment/docker-setup.md)

### Run Reactive Trader Cloud locally via Docker
You can run Reactive Trader Cloud locally using pre-built Docker images by navigating to the `docker` folder and running the `./runAll` script

```bash
$ cd deploy/docker/
$ ./runAll
```

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

## Build containers from source
First define an `BUILD_ID` for your build. It's a string used to identify the images. For documentation, we will use *localbuild*

You will find scripts to help build/run/test Reactive Trader components:
- prepare (to build and push)
- runAll
- testAll
- killAll

To build, run the following with the `BUILD_ID`, in this example we'll use `localbuild`
```bash
./deploy/docker/prepare build rtc localbuild
```

This will run the following tasks:

- Build the .NET services container by
  - Downloading the base Docker image for .NET Core from https://hub.docker.com/r/weareadaptive/dotnet/
  - Build the server binaries in that container with the checked out server source code
  - Create a new `reactivetrader/servers` Docker image from the built services container tagged with the `BUILD_ID` provided and save locally

- Build the messaging broker container by
  - Download the crossbar Docker image from https://hub.docker.com/r/weareadaptive/crossbar/
  - Build the broker image by applying the checked out crossbar config file
  - Create a new `reactivetrader/broker` Docker image from the built broker container tagged with the `BUILD_ID` provided and save locally

- Build the client container by
  - Download the nodejs Docker image from https://hub.docker.com/r/weareadaptive/node/
  - Build the client app in that container with the checked out client source code and save the built client app files
  - Download the nginx Docker image from https://hub.docker.com/r/weareadaptive/nginx/
  - Copy the built client app files to the nginx container
  - Create a new `reactivetrader/web` Docker image from the nginx container with the client app files tagged with the `BUILD_ID` provided and save locally

- Build the eventstore container by
  - Download the Docker image for eventstore from https://hub.docker.com/r/weareadaptive/eventstore/
  - Run the built `reactivetrader/servers` container with a special flag and the eventstore container to populate data into the eventstore container
  - Create a new `reactivetrader/eventstore` Docker image from the eventstore container which now has the data populated, tagged with the `BUILD_ID` provided and save locally

The 4 `reactivetrader` images will contain all the components needed to run Reactive Trader Cloud. The `servers` image contain binaries for all server micro-services and can be run with a flag to indicate which service to run. 


Check the generated docker images by:
```bash
docker images
```
Will output something like:
```bash
REPOSITORY                  TAG                 IMAGE ID            CREATED             SIZE
reactivetrader/eventstore   0.0                 4b320ebaea77        6 minutes ago       562.1 MB
reactivetrader/eventstore   0.0.localbuild      4b320ebaea77        6 minutes ago       562.1 MB
reactivetrader/web          0.0                 0a215f2c76f7        8 minutes ago       146.5 MB
reactivetrader/web          0.0.localbuild      0a215f2c76f7        8 minutes ago       146.5 MB
weareadaptive/websrc        localbuild          c848e9f8affb        14 minutes ago      435.8 MB
reactivetrader/broker       0.0                 ec5c0bce868d        17 minutes ago      387 MB
reactivetrader/broker       0.0.localbuild      ec5c0bce868d        17 minutes ago      387 MB
reactivetrader/servers      0.1                 31ad537d4432        18 minutes ago      1.913 GB
reactivetrader/servers      0.1.localbuild      31ad537d4432        18 minutes ago      1.913 GB
weareadaptive/serverssrc    localbuild          48595078a5bb        21 minutes ago      823.3 MB
weareadaptive/node          6.2                 9b0abe35bff5        7 days ago          433.7 MB
weareadaptive/dotnet        0.0                 e49fd48a6619        2 weeks ago         698.1 MB
weareadaptive/crossbar      0.1                 97d364615d31        4 weeks ago         387 MB
weareadaptive/nginx         0.0                 07994306ed18        5 months ago        132.8 MB
weareadaptive/eventstore    0.0                 e2cbb26040c9        5 months ago        293.6 MB
```

Note that only these containers are used to run ReactiveTrader with the `1` build number:
```bash
reactivetrader/eventstore   0.0.localbuild       0df22c060d23        8 seconds ago       562.1 MB
reactivetrader/web          0.0.localbuild       d0412eae6ff5        15 seconds ago      146.5 MB
reactivetrader/broker       0.0.localbuild       addab85a78aa        4 minutes ago       387 MB
reactivetrader/servers      0.0.localbuild       cbc536864104        4 minutes ago       1.913 GB
```

You can then run the built images by passing the `BUILD_ID` to the `./runAll` script
```bash
$ .deploy/docker/runAll localbuild
```

Open a browser, navigate to the docker address (`localhost` for linux users and something like `10.0.75.2` for windows/mac users) and the web client will load.


## Test ReactiveTrader
After having started ReactiveTrader, you can run the tests. The tests use the **reactivetrader/servers** to connect backends.

If you build/run with a `build_id` (ie: `1`): 
```bash
./deploy/docker/testAll localbuild
```

This should output something like this:
```bash
 
xUnit.net .NET CLI test runner (64-bit .NET Core ubuntu.14.04-x64)
  Discovering: Adaptive.ReactiveTrader.Server.IntegrationTests
  Discovered:  Adaptive.ReactiveTrader.Server.IntegrationTests
  Starting:    Adaptive.ReactiveTrader.Server.IntegrationTests

...
some test data
...

  Finished:    Adaptive.ReactiveTrader.Server.IntegrationTests
=== TEST EXECUTION SUMMARY ===
   Adaptive.ReactiveTrader.Server.IntegrationTests  Total: 8, Errors: 0, Failed: 0, Skipped: 0, Time: 9.464s
```

## Stop all the running containers
You can stop all the containers with:
```bash
$ ./deploy/docker/killAll
```
