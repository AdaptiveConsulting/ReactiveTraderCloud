Adaptive Server
===============

## Getting Started on Windows

### Get DNX
Instructions [here](http://blogs.msdn.com/b/sujitdmello/archive/2015/04/23/step-by-step-installation-instructions-for-getting-dnx-on-your-laptop.aspx)

#### Get External Dependencies 
Run 'Get Dependencies.bat' once to grab external dependencies (this runs `dnu restore`)

#### Set up a local Event Store and populate with sample data
Currently we require a local event store to be created if you want to write and read events
* [Download Event Store]( https://geteventstore.com/downloads)
* Follow the [getting started instructions](http://docs.geteventstore.com/introduction/)
* Run `Populate Event Store.bat`

#### Start Services
* Run `Message Broker Instance.bat` first
* Run `Pricing Instance.bat`
* Run `Reference Instance.bat`


## Getting Started on Mac OS X

### Get DNX

TODO

Instructions [here](http://blogs.msdn.com/b/sujitdmello/archive/2015/04/23/step-by-step-installation-instructions-for-getting-dnx-on-your-laptop.aspx)

#### Get External Dependencies 

```bash
$ cd server
$ dnu restore
```

#### Set up a local Event Store and populate with sample data
Currently we require a local event store to be created if you want to write and read events
* [Download Event Store (Get Event Store 3.x for OS X)]( https://geteventstore.com/downloads)
* Follow the [Running the event store section for OS X](http://docs.geteventstore.com/server/3.3.0/) (Event Store is 3.3 at the time of writting, look at the latest version 'Running the event store section')
* Populate the Event store with some initial data

```bash
$ dnx -p Adaptive.ReactiveTrader.Server.ReferenceDataWrite refDataWritePopulate
```

#### Start Services

Each service needs to be started in a separate shell window

TODO create a shell script which starts everything

* Start the messaging broker

```bash
$ cd server
$ dnx -p Adaptive.ReactiveTrader.MessageBroker run
```

* Run the reference data service

```bash
$ cd server
$ dnx -p Adaptive.ReactiveTrader.Server.ReferenceDataRead run
```

* Run the pricing service

```bash
$ cd server
$ dnx -p Adaptive.ReactiveTrader.Server.Pricing run
```
