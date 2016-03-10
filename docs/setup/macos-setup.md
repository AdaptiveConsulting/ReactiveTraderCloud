## Getting Started on Mac OS X

### Setting up backend services

#### Get DNX

First you need to install the .NET Execution Environment, using the following [instructions](https://docs.asp.net/en/latest/getting-started/installing-on-mac.html)

Ensure that DNX for mono is installed by running `dnvm upgrade -r mono`

Run `dnvm list` to check that the framework version in use is mono.

```
Active Version              Runtime Architecture OperatingSystem Alias
------ -------              ------- ------------ --------------- -----
  *    1.0.0-rc1-update1    mono                 linux/osx       default
```

If it is not, run

```bash
$ dnvm use 1.0.0-rc1-update1 -r mono
```

#### Get External Dependencies 

Then you need to restore the packages used by the application

```bash
$ cd ./src/server
$ dnu restore
```

#### Start Services

All the services including the broker and an embedded Event Store can be started using the Launcher

```bash
$ cd Adaptive.ReactiveTrader.Server.Launcher
$ dnx run dev
```
You can run `dnx run` to see a list of other commands that can be run.

#### Interactive Mode

The console process started via `dnx run dev` is interactive, and can be used to bring various services up and down. This lets you investigate how the application responds to component failures. Simply type 'help' within the Launcher process.

### Client
For the web client follow these [instructions](../client.md)

### Problem running the app?

If you find any issue running the app or anything is missing the docs, please create [an issue on github](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/issues)