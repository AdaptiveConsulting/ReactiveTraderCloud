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

#### Run Broker (Crossbar)

Crossbar.io is required for RTC to properly run. If not installed, the server cannot communicate with the client.
To install crossbar.io on Windows:

- [Download Crossbar](http://crossbar.io/docs/Installation-on-Windows/): At the time of writing, the download instructions for Crossbar on Windows aren't perfect. The following should work:
  - [Install Python 3.x 32bit](https://www.python.org/), tick the 'Add Python to PATH' checkbox in the installer
  - [Install PyWin](https://github.com/mhammond/pywin32/releases)
  - The dependency 'snappy' doesn't build on Windows, so use a pre-built version:
    - [Download snappy binary](https://www.lfd.uci.edu/~gohlke/pythonlibs/#python-snappy) (choose the appropriate binary for your version of Python)
    - Install it: `pip install python_snappy-0.5.4-cp37-cp37m-win32.whl` (or whichever `whl` file you downloaded in the previous step)
  - Install Crossbar: `pip install crossbar`
- Run `crossbar start` from the `\src\services\broker\.crossbar` working directory on the command line

To install crossbar.io on another OS, follow the instructions provided for [Linux](https://crossbar.io/docs/Installation-on-Linux/) or for [MacOS](http://crossbar.io/docs/Installation-on-Mac-OS-X/)

In a separate terminal, start Crossbar from the `/src/server/dotNet` folder or from the `\src\services\broker\.crossbar` folder (Windows) by running:

```bash
$ crossbar start
```

#### Start Services

To start the backend services, run the following command from the`/src/server/dotNet` directory:

```bash
$ dotnet run -p Adaptive.ReactiveTrader.Server.Launcher all
```

The services should now run and connect to Crossbar and Event Store.

To run each service individually, cd into each of the services (analytics, blotter, pricing, referenceDataRead, tradeExecution) and run `dotnet run`

On Windows, once the stand-alone Event Store and Crossbar are running, you can fire up the services by running `StartServices.bat`

This calls the Launcher console application and will start all the services, the messaging broker and Event Store.

The services can also be debugged from Visual Studio like any another console app.

#### Interactive Mode

The console process started via `dotnet run dev` from the Launcher project is interactive, and can be used to bring various services up and down. This lets you investigate how the application responds to component failures. Simply type 'help' within the Launcher process.

#### Client

For the web client follow these [instructions](../client.md)

### Problem running the app?

If you find any issue running the app or anything is missing in the docs, please create [an issue on github](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/issues)
