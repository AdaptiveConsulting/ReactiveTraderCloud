## NB! This manual is for running backend without docker, if you don't plan to debug back-end it may be easier to follow docker route: [Understand rtc build and deployments guide](../../deployment/understand-rtc-build-and-deployments.md)

#### Client
For the web client follow these [instructions](../client.md)

## Running with Visual Studio 2019 on Windows

Install Visual Studio 2019 Pro or Community. Upon running the installation, be sure to install the following optional components:
  - .NET Framework 4.6.2
  - .NET Core 2.1 development tools

RTC will require these components in order to compile the solutions.

VS 2019 comes with a git client installed.  Simply import this github project and build the 2 solutions.

#### Get External Dependencies 
Run `GetDependencies.bat` once to grab external dependencies (this runs `dotnet restore` and downloads the relevant NuGet packages to your machine)

#### Set up and run stand-alone Event Store
If you want to persist data across sessions then you should run a local Event Store. 
- [Download Event Store](https://geteventstore.com/downloads)
- Follow the [getting started instructions](https://eventstore.org/docs/getting-started/index.html?tabs=tabid-1%2Ctabid-dotnet-client%2Ctabid-dotnet-client-connect%2Ctabid-4) and run Event Store locally
- Run `Populate Event Store.bat` to add some dummy data

#### Run Broker (Crossbar)
Crossbar.io is required for RTC to properly run.  If not installed, the server cannot communicate with the client.
To install crossbar.io:
- [Download Crossbar](http://crossbar.io/docs/Installation-on-Windows/): At the time of writing, the download instructions for Crossbar on Windows aren't perfect. The following should work:
  - [Install Python 3.x 32bit](https://www.python.org/), tick the 'Add Python to PATH' checkbox in the installer
  - [Install PyWin](https://github.com/mhammond/pywin32/releases)
  - The dependency 'snappy' doesn't build on Windows, so use a pre-built version:
    - [Download snappy binary](https://www.lfd.uci.edu/~gohlke/pythonlibs/#python-snappy) (choose the appropriate binary for your version of Python)
    - Install it: `pip install python_snappy-0.5.4-cp37-cp37m-win32.whl` (or whichever `whl` file you downloaded in the previous step)
  - Install Crossbar: `pip install crossbar`
- Run `crossbar start` from the `\src\services\broker\.crossbar` working directory on the command line

#### Run Services
Once the stand-alone Event Store and Crossbar are running, you can fire up the services by running `StartServices.bat` 

This calls the Launcher console application and will start all the services, the messaging broker and Event Store.

The services can also be debugged from Visual Studio like any another console app.

### Problem running the app?

If you find any issue running the app or anything is missing the docs, please create [an issue on github](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/issues)
