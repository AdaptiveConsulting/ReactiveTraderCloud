## Getting Started on Mac OS X

### Setting up backend services

#### Get DNX

Install .NET Core, following instructions [here](https://www.microsoft.com/net)

Run `dotnet --info` to test that the install has been successful.


#### Get External Dependencies 

Grab the source, then restore the packages used by the application

```bash
$ cd ./src/server
$ dotnet restore
```


#### Install Event Store

Follow the instructions provided [here](https://geteventstore.com/downloads/)


#### Install Crossbar.io

Follow the instructions provided [here](http://crossbar.io/docs/Installation-on-Mac-OS-X/)


#### Start Services

Start eventstore, and run `crossbar start` from the `/src/server` directory.

Populate eventstore with the following command from the`/src/server` directory:

```bash
$ dotnet run -p Adaptive.ReactiveTrader.Server.Launcher --populate-eventstore
```
Then to start the backaend services, run the following command from the`/src/server` directory: 

```bash
$ dotnet run -p Adaptive.ReactiveTrader.Server.Launcher all
```


#### Interactive Mode

The console process started via `dotnet run dev` from the Launcher project is interactive, and can be used to bring various services up and down. This lets you investigate how the application responds to component failures. Simply type 'help' within the Launcher process.


### Client

For the web client follow these [instructions](../client.md)


### Problem running the app?

If you find any issue running the app or anything is missing the docs, please create [an issue on github](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/issues)