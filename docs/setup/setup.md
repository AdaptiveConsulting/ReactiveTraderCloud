## NB! This manual is for running backend without docker, if you don't plan to debug back-end it may be easier to follow docker route:

[Understand rtc build and deployments guide](../deployment/readme.md)

#### Install .NET Core

Follow the instructions provided [here](https://www.microsoft.com/net)

Run `dotnet --info` to test that the install has been successful.

#### Get External Dependencies

Grab the source, then restore the packages used by the application

```bash
$ cd ./src/server/dotNet
$ dotnet restore
```

Alternatively on Windows, you can run `GetDependencies.bat` (this runs `dotnet restore` and downloads the relevant NuGet packages to your machine)

#### Install and start Event Store

If you want to persist data across sessions then you should run a local Event Store.

- [Download Event Store](https://eventstore.com/downloads/)
- Follow the [getting started instructions](https://eventstore.org/docs/getting-started/index.html?tabs=tabid-1%2Ctabid-dotnet-client%2Ctabid-dotnet-client-connect%2Ctabid-4) and run Event Store locally

Or, [use the docker image](https://hub.docker.com/r/eventstore/eventstore/).

#### Populate Event Store

Populate eventstore with the following command from the`/src/server/dotNet` directory:

```bash
$ dotnet run -p Adaptive.ReactiveTrader.Server.Launcher --populate-eventstore
```

Alternatively on Windows, you can run `Populate Event Store.bat` to add some dummy data

#### Run Broker (RabbitMQ)

RabbitMQ is required for RTC to properly run. If not installed, the server cannot communicate with the client.

- [Download and install RabbitMQ](https://www.rabbitmq.com/download.html): Follow the instructions to download, install and start RabbitMQ according to your OS and preferred method.
- However before starting it, [enable Web Stomp Pluggin](https://www.rabbitmq.com/web-stomp.html): The client uses Stomp library to communicate with RabbitMQ via a websocket. Run the following command to enable the pluggin:

```bash
$ rabbitmq-plugins enable rabbitmq_web_stomp
```

- [Browse RabbitMQ management](https://www.rabbitmq.com/management.html): If the management pluggin was installed, browse [RabbitMQ](http://localhost:15672/) and provide login `guest` and password `guess` to monitor the running exchanges and queues.

#### Start Services

To start the backend services, run the following command from the`/src/server/dotNet` directory:

```bash
$ dotnet run -p Adaptive.ReactiveTrader.Server.Launcher all
```

The services should now run and connect to Rabbitmq and Event Store.

To run each service individually, cd into each of the services (analytics, blotter, pricing, referenceDataRead, tradeExecution) and run `dotnet run`

On Windows, once the stand-alone Event Store and Rabbitmq are running, you can fire up the services by running `StartServices.bat`

This calls the Launcher console application and will start all the services, the messaging broker and Event Store.

The services can also be debugged from Visual Studio like any another console app.

#### Interactive Mode

The console process started via `dotnet run dev` from the Launcher project is interactive, and can be used to bring various services up and down. This lets you investigate how the application responds to component failures. Simply type 'help' within the Launcher process.

#### Client

For the web client follow these [instructions](../../src/client/README.md)

### Problem running the app?

If you find any issue running the app or anything is missing in the docs, please create [an issue on github](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/issues)
