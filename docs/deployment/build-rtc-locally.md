# You want to: build RTC locally

- [You want to: build RTC locally](#you-want-to-build-rtc-locally)
    - [Docker images](#docker-images)
    - [Procedure](#procedure)
        - [Setup and validate docker](#setup-and-validate-docker)
        - [Build containers from source](#build-containers-from-source)

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
follow the [docker setup instructions][docker-setup]

### Build containers from source
First define a [build id][builid] for your build. It's a string used to identify the images. For this documentation, we will use *localbuild*

You will find scripts to help build/run/test Reactive Trader components:
- prepare (to build and push)
- runAll
- testAll
- killAll

To build, run the following with the [build id][buildid], in this example we'll use *localbuild*
```bash
./deploy/docker/prepare build RTC localbuild
```

This will run the following tasks:

- Build the .NET services container by
  - Downloading the [base Docker image for .NET Core][dotnetcore-image]
  - Build the server binaries in that container with the checked out server source code
  - Create a new `reactivetrader/servers` Docker image from the built services container tagged with the [build id][build-id] provided and save locally

- Build the messaging broker container by
  - Download the [crossbar Docker base image][crossbar-image]
  - Build the broker image by applying the checked out crossbar config file
  - Create a new `reactivetrader/broker` Docker image from the built broker container tagged with the [build id][build-id] provided and save locally

- Build the client container by
  - Download the [nodejs base Docker image][nodejs-image]
  - Build the client app in that container with the checked out client source code and save the built client app files
  - Download the [nginx Docker base image][nginx-image]
  - Copy the built client app files to the nginx container
  - Create a new `reactivetrader/web` Docker image from the nginx container with the client app files tagged with the [build id][build-id] provided and save locally

- Build the eventstore container by
  - Download the [base Docker image for eventstore][eventstore-image]
  - Run the built `reactivetrader/servers` container with a special flag and the eventstore container to populate data into the eventstore container
  - Create a new `reactivetrader/eventstore` Docker image from the eventstore container which now has the data populated, tagged with the [build id][build-id] provided and save locally

The [4 `reactivetrader` images][docker-hub] will contain all the components needed to run Reactive Trader Cloud. The `servers` image contain binaries for all server micro-services and can be run with a flag to indicate which service to run. 


Check the generated docker images:
```bash
docker images
```
Will output something like:
```bash
REPOSITORY                  TAG                 IMAGE ID            CREATED             SIZE
reactivetrader/eventstore   0.0                 a2137e0ed763        19 minutes ago      562MB
reactivetrader/eventstore   0.0.localbuild      a2137e0ed763        19 minutes ago      562MB
reactivetrader/web          0.0                 d3d529b6cb35        19 minutes ago      139MB
reactivetrader/web          0.0.localbuild      d3d529b6cb35        19 minutes ago      139MB
reactivetrader/broker       0.0                 e14bf8686e42        23 minutes ago      830MB
reactivetrader/broker       0.0.localbuild      e14bf8686e42        23 minutes ago      830MB
reactivetrader/servers      0.1                 a26ebd967a2b        24 minutes ago      2.05GB
reactivetrader/servers      0.1.localbuild      a26ebd967a2b        24 minutes ago      2.05GB
weareadaptive/serverssrc    localbuild          7db7dab3d324        25 minutes ago      1.05GB
weareadaptive/crossbar      17.5                57da26d57567        5 weeks ago         830MB
appropriate/curl            latest              f73fee23ac74        6 weeks ago         5.35MB
weareadaptive/nginx         1.12                a6292ecfcd04        2 months ago        107MB
weareadaptive/dotnet        1.1                 06a8bb1d4f25        8 months ago        1.05GB
d4w/nsenter                 latest              9e4f13a0901e        11 months ago       83.8kB
weareadaptive/node          6.2                 9b0abe35bff5        15 months ago       434MB
weareadaptive/eventstore    0.0                 e2cbb26040c9        20 months ago       294MB
```

Note that only these containers are used to run ReactiveTrader with the `localbuild` build number:
```bash
reactivetrader/eventstore   0.0.localbuild       0df22c060d23        8 seconds ago       562.1 MB
reactivetrader/web          0.0.localbuild       d0412eae6ff5        15 seconds ago      146.5 MB
reactivetrader/broker       0.0.localbuild       addab85a78aa        4 minutes ago       387 MB
reactivetrader/servers      0.0.localbuild       cbc536864104        4 minutes ago       1.913 GB
```

[docker-setup]: ./docker-setup.md
[build-id]: ./build-id.md
[dotnetcore-image]: https://store.docker.com/community/images/weareadaptive/dotnet/
[crossbar-image]: https://store.docker.com/community/images/weareadaptive/crossbar/
[eventstore-image]: https://store.docker.com/community/images/weareadaptive/eventstore/
[nodejs-image]: https://store.docker.com/community/images/weareadaptive/node/
[nginx-image]: https://store.docker.com/community/images/weareadaptive/nginx/
[docker-hub]: https://store.docker.com/profiles/reactivetrader/
