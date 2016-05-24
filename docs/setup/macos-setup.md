## Getting Started on Mac OS X

### Setting up backend services

#### Get DNX

First you need to install mono by following the instructions [here](http://www.mono-project.com/docs/getting-started/install/mac/)

TODO: test `mono --version`

Install .NET Core, following instructions [here](https://www.microsoft.com/net)

TODO: test `dotnet --info`


#### Get External Dependencies 

Then you need to restore the packages used by the application

```bash
$ cd ./src/server
$ dotnet restore
```


#### Start Services

All the services including the broker and an embedded Event Store can be started using the Launcher

```bash
$ cd Adaptive.ReactiveTrader.Server.Launcher
$ dotnet run all
```


#### Interactive Mode

The console process started via `dotnet run dev` from the Launcher project is interactive, and can be used to bring various services up and down. This lets you investigate how the application responds to component failures. Simply type 'help' within the Launcher process.


### Client

For the web client follow these [instructions](../client.md)


### Problem running the app?

If you find any issue running the app or anything is missing the docs, please create [an issue on github](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/issues)