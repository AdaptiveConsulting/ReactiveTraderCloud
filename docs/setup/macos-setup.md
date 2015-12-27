## Getting Started on Mac OS X

### Setting up backend services

#### Get DNX

First you need to install the .NET Execution Environment, using the following [instructions](https://docs.asp.net/en/latest/getting-started/installing-on-mac.html)

#### Get External Dependencies 

Then you need to restore the packages used by the application

```bash
$ cd server
$ dnu restore
```

#### Start Services

All the services including the broker and an embedded EventStore can be started using the Launcher

```bash
$ cd Adaptive.ReactiveTrader.Server.Launcher
$ dnx run dev
```

### Client
For the web client follow these [instructions](../../src/client/README.md)

### Problem running the app?

If you find any issue running the app or anything is missing the docs, please create [an issue on github](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/issues)