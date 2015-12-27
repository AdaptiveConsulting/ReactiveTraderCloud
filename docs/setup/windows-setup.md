## Running with Visual Studio 2015 on Windows

Install Visual Studio 2015 - this will provide the tools required to run DNX.

Install a clr image by running `dnvm upgrade` from the command line. Running `dnvm list` should then give you something like the following:

```
Active Version           Runtime Architecture Location                      Alias
------ -------           ------- ------------ --------                      -----
  *    1.0.0-rc1-update1 clr     x86          C:\Users\qiming\.dnx\runtimes default
```

#### Get External Dependencies 
Run `GetDependencies.bat` once to grab external dependencies (this runs `dnu restore`)

#### Run Services
To run all the services as well as an in-memory broker and Eventstore, run `StartAll.bat`

This calls the Launcher console application and will starts all the services, the messaging broker and EventStore.

The services can also be debugged from Visual Studio like any another console app.

#### Client
For the web client follow these [instructions](../../src/client/README.md)

### Advanced

#### Set up stand-alone Eventstore and Broker (Crossbar)
If you want to persist data across sessions then you should run a local Eventstore. 

- [Download Event Store](https://geteventstore.com/downloads)
- Follow the [getting started instructions](http://docs.geteventstore.com/introduction/) and run Eventstore locally
- Run `Populate Event Store.bat` to add some dummy data

For Crossbar,

- [Download Crossbar](http://crossbar.io/docs/Installation-on-Windows/)
- Run `crossbar start` from the `/src/server` working directory on the command line

Once the stand-alone Eventstore and Crossbar are running, you can fire up the services by running `StartServices.bat` 

### Problem running the app?

If you find any issue running the app or anything is missing the docs, please create [an issue on github](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/issues)