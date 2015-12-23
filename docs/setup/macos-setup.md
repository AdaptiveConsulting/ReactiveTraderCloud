## Getting Started on Mac OS X

TODO: check

### Get DNX

Instructions [here](https://docs.asp.net/en/latest/getting-started/installing-on-mac.html)

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
$ dnx -p Adaptive.ReactiveTrader.Server.Launcher run init-es
```

#### Start Services

All the services including the broker can be started using the Launcher

```bash
$ cd server
$ dnx -p Adaptive.ReactiveTrader.Server.Launcher run a b exec p ref mb
```

The services should now run and connect to EventStore

Run the client app by following the instructions [here](../src/client/README.md)