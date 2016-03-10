## Running with Visual Studio 2015 on Windows

Install Visual Studio 2015 - this will provide the tools required to run DNX.

Install a CLR image:
 
 ```sh
 dnvm upgrade  # Upgrade CNVM
 dnvm list     # Output the current set of versions
 ```
 
 `dnvm list` should give you an update similar to:

```
Active Version           Runtime Architecture Location                      Alias
------ -------           ------- ------------ --------                      -----
  *    1.0.0-rc1-update1 clr     x86          C:\Users\qiming\.dnx\runtimes default
```

#### Get External Dependencies 
Run `GetDependencies.bat` once to grab external dependencies (this runs `dnu restore`)

#### Run Services
To run all the services as well as an in-memory broker and Event Store, run `StartAll.bat`

This calls the Launcher console application and will starts all the services, the messaging broker and Event Store.

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