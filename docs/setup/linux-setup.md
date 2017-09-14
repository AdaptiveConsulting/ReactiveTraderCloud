## Installation

### Docker

The way to run ReactiveTrader on Linux is by using Docker. You can find the tutorial [here](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/blob/master/docs/deployment/readme.md).


### Linux 

These instructions have been tested on Ubuntu 14.04


#### Install .NET Core

Follow the instructions provided [here](https://www.microsoft.com/net).

Running `dotnet --info` should give something like:

```sh
$ dotnet --info
.NET Command Line Tools (1.0.0-preview1-002702)

Product Information:
 Version:     1.0.0-preview1-002702
 Commit Sha:  6cde21225e

Runtime Environment:
 OS Name:     ubuntu
 OS Version:  14.04
 OS Platform: Linux
 RID:         ubuntu.14.04-x64
```


#### Install Event Store

Follow the instructions provided [here](http://docs.geteventstore.com/server/3.6.0/installing-from-debian-repositories/)


#### Install Crossbar.io

Follow the instructions provided [here](http://crossbar.io/docs/Installation-on-Ubuntu/)


## Running Reactive Trader

Start Event Store by running

```bash
$ sudo service eventstore start
```

In a separate terminal, start Crossbar from the `/src/server` folder by running:

```bash
$ crossbar start
```

From the `/src/server` working directory, install the packages required by running:

```bash
$ dotnet restore
```

Populate eventstore with the following command:

```bash
$ dotnet run -p Adaptive.ReactiveTrader.Server.Launcher --populate-eventstore
```

Then run the services:

```bash
$ dotnet run -p Adaptive.ReactiveTrader.Server.Launcher all
```

The services should now run and connect to Crossbar and Event Store.

To run each service individually, cd into each of the services (analytics, blotter, pricing, referenceDataRead, tradeExecution) and run `dotnet run`

Run the client app by following the instructions [here](../client.md)

### Problem running the app?

If you find any issue running the app or anything is missing the docs, please create [an issue on github](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/issues)
