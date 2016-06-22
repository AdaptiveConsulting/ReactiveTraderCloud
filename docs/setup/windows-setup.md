## Running with Visual Studio 2015 on Windows

Install Visual Studio 2015 - a free community edition is available. Then install .NET Core from [here](https://www.microsoft.com/net/core). Also ensure that the NuGet package manager extension is up to date.

That's it! You should be all set to go. Open a cmd prompt and type `dotnet --info` and you should see something like this:

```sh
C:\> dotnet --info
.NET Command Line Tools (1.0.0-preview1-002702)

Product Information:
 Version:     1.0.0-preview1-002702
 Commit Sha:  6cde21225e

Runtime Environment:
 OS Name:     Windows
 OS Version:  10.0.10586
 OS Platform: Windows
 RID:         win10-x64
```

#### Get External Dependencies 
Run `GetDependencies.bat` once to grab external dependencies (this runs `dotnet restore` and downloads the relevant NuGet packages to your machine)

#### Run Services
To run all the services as well as an in-memory broker and Event Store, run `StartAll.bat`

This calls the Launcher console application and will start all the services, the messaging broker and Event Store.

The services can also be debugged from Visual Studio like any another console app.

#### Client
For the web client follow these [instructions](../client.md)

### Advanced

#### Set up stand-alone Event Store and Broker (Crossbar)
If you want to persist data across sessions then you should run a local Event Store. 

- [Download Event Store](https://geteventstore.com/downloads)
- Follow the [getting started instructions](http://docs.geteventstore.com/introduction/) and run Event Store locally
- Run `Populate Event Store.bat` to add some dummy data

For Crossbar,

- [Download Crossbar](http://crossbar.io/docs/Installation-on-Windows/)
- Run `crossbar start` from the `/src/server` working directory on the command line

Once the stand-alone Event Store and Crossbar are running, you can fire up the services by running `StartServices.bat` 

### Problem running the app?

If you find any issue running the app or anything is missing the docs, please create [an issue on github](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/issues)