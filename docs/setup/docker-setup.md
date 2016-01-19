# Running on Docker

The following instructions have been tested on: 
- Windows 7 / 10
- Ubuntu 14.04.3 / 15.10
- OS X 10.11.2 (15C50) / kernel 15.2.0

If you have any issues with this process, please have a look [here](docker-issues.md). We have listed some of the known problems that may occur.

## Install docker for your OS

Follow the steps [here](https://docs.docker.com/engine/installation/) for instructions for your specific OS/distribution.

We also propose a [complete guide for Ubuntu 14.04.3](ubuntu-complete-guide.md).

## Check your docker
#### Start toolbox for Windows/Mac user:
Launch `Docker Quickstart Terminal` - this will start a default virtual machine on which your containers will run. You'll see something like

```
                        ##         .
                  ## ## ##        ==
               ## ## ## ## ##    ===
           /"""""""""""""""""\___/ ===
      ~~~ {~~ ~~~~ ~~~ ~~~~ ~~~ ~ /  ===- ~~~
           \______ o           __/
             \    \         __/
              \____\_______/

docker is configured to use the default machine with IP 192.168.99.100
For help getting started, check out the docs at https://docs.docker.com
``` 

Note the IP address as we'll use it to load the client later.

Docker toolbox runs an Ubuntu virtual machine. This VM automatically shares your user folders. Building ReactiveTrader needs to share some code with the containers inside the VM. Please make sure that your cloned project is under your user folder. E.g.: `c:\Users\myname\repository\reactivetradercloud` is perfect. 

#### Linux users
Just check that docker is running with:

```bash
docker ps
```
This should output:

```bash
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES

```

## Clone the repository

For windows user, note that the line ending on your OS is `CRLF`. All scripts are written in bash and most of them will run inside Linux containers. The expected line ending are `LF` and `CRLF` will break some of the script.
This can be easily fixed by asking git to not update `LF` to `CRLF` when cloning the repository. 

Before cloning :
```bash
git config --global core.autocrlf false
```

## End to end

If all you want is to quickly run ReactiveTrader, you can move to the [Run Reactive Trader part](#run-reactive-trader).

This step will control that everything is working:  
 - download all the base containers to build the project
 - build all services
 - run ReactiveTrader
 - test ReactiveTrader
 - stop ReactiveTrader
 
```bash
cd deploy/e2e
./e2e.sh
```

If everything is fine, you should see something like that at the end of the script:
```bash
  Finished:    Adaptive.ReactiveTrader.Server.IntegrationTests
=== TEST EXECUTION SUMMARY ===
   Adaptive.ReactiveTrader.Server.IntegrationTests  Total: 8, Errors: 0, Failed: 0, Skipped: 0, Time: 9.818s

==============================
Stop ReactiveTrader containers

e34c506a599c555c91987923aa46752db106ea829c24db13cc3c998b14109317
93d6c3027f19540fedb197c0767d9f45fa730b9a86df25489a5840c97c21af3b
83640cd4e0e3537999fa5d42a9d26a3167ddd75ee54634956f12e8bffc82156d
105d166f2b85300a6563b9a8b79409270693fc28eb6b7713bcac8a98bd1f2e1b
8f00e46caf8b811593cc2b61f11ea214f2e524fc2b51e22a7dbc4dc0f1491e21
5e954aec1ec2872bb530b270c2bfb20cfcd885b2c466e4124487e0e42f5c9751
267be6d366486d63601678db8e94d363df4967fc8be50c2cd1bac11c1978c471
2b37c25a5876615bffbf23cdf5f2b85ffd08d68f89b3562501715059466df13c
 
=============
Time details:
Tue Jan 19 11:19:32 GMT 2016
Tue Jan 19 11:33:23 GMT 2016
```

Note that the time for all this process is mostly defined by your internet bandwidth.

## Build
 
If the e2e step has passed, you are now confident that the setup is fine.  
We can look at how to manually build `Reactive Trader`.

Move to the docker folder
```bash
cd ../docker
```

You will find these scripts:
- prepare (to build and push)
- runAll
- testAll
- killAll

First, define a `BUILD_ID`. It's a string that will tag your containers. `mytest` or `1` are good choices. Here we will use `localtest`.    
Then build all the ReactiveTrader services.
```bash
./prepare build services localtest
```

After this, the only part of the process that will take time is the installation of the front-end npm packages.

You can look to your generated docker images:
```bash
docker images
```
Will output something like that:
```bash
REPOSITORY                  TAG                 IMAGE ID            CREATED             VIRTUAL SIZE
reactivetrader/eventstore   0.0                 0df22c060d23        8 seconds ago       562 MB
reactivetrader/eventstore   0.0.localtest       0df22c060d23        8 seconds ago       562 MB
reactivetrader/web          0.0.localtest       d0412eae6ff5        15 seconds ago      137.4 MB
reactivetrader/web          0.0                 d0412eae6ff5        15 seconds ago      137.4 MB
weareadaptive/websrc        localtest           2617473c8e0a        4 minutes ago       416.2 MB
reactivetrader/broker       0.0.localtest       addab85a78aa        4 minutes ago       379.7 MB
reactivetrader/broker       0.0                 addab85a78aa        4 minutes ago       379.7 MB
reactivetrader/servers      0.0                 cbc536864104        4 minutes ago       922.6 MB
reactivetrader/servers      0.0.localtest       cbc536864104        4 minutes ago       922.6 MB
weareadaptive/serverssrc    localtest           f087cc2f13b9        4 minutes ago       796.6 MB
reactivetrader/eventstore   0.0.e2e             292529cdbf08        9 minutes ago       562 MB
reactivetrader/web          0.0.e2e             9c2baae50848        10 minutes ago      135.1 MB
weareadaptive/websrc        e2e                 8d1667ee1b31        19 minutes ago      416.2 MB
reactivetrader/broker       0.0.e2e             eaf678a92116        20 minutes ago      379.7 MB
reactivetrader/servers      0.0.e2e             662a6b27781f        20 minutes ago      947 MB
weareadaptive/serverssrc    e2e                 d69f307fc29d        21 minutes ago      796.6 MB
weareadaptive/node          0.0                 67d6845f9120        9 days ago          414.9 MB
weareadaptive/testtools     1.1                 ab6e2b210d47        11 days ago         227.3 MB
weareadaptive/nginx         0.0                 ae19d8b9954e        12 days ago         132.8 MB
weareadaptive/eventstore    0.0                 9e4aeaff3d81        12 days ago         293.6 MB
weareadaptive/mono          0.0                 7e5be450434d        12 days ago         796.3 MB
weareadaptive/crossbar      0.0                 dda530e30ef9        12 days ago         379.7 MB
```

Note that only these containers are used to run ReactiveTrader with the `localtest` version:
```bash
reactivetrader/eventstore   0.0.localtest       0df22c060d23        8 seconds ago       562 MB
reactivetrader/web          0.0.localtest       d0412eae6ff5        15 seconds ago      137.4 MB
reactivetrader/broker       0.0.localtest       addab85a78aa        4 minutes ago       379.7 MB
reactivetrader/servers      0.0.localtest       cbc536864104        4 minutes ago       922.6 MB
```

## Run Reactive Trader

If you have followed the `build` step before, use the `build_id` you have defined:
```bash
$ ./runAll localtest
```

Otherwise, you can run the app by using our pre-built containers.
In order to run the latest one, execute:
```bash
$ cd deploy/docker
$ ./runAll
```

Note that if you run pre-built containers, some downloads will occur at this point.

Then inspect the running containers:

```bash
$ docker ps
```

Should give you something similar to:

```bash
$ docker ps
CONTAINER ID        IMAGE                             COMMAND                  CREATED             STATUS              PORTS               NAMES
ba36323ecc73        reactivetrader/servers:0.0.769    "bash -c 'dnx -p Adap"   29 seconds ago      Up 23 seconds                           analytics
e116fa85abdb        reactivetrader/servers:0.0.769    "bash -c 'dnx -p Adap"   30 seconds ago      Up 24 seconds                           blotter
b69e619c1059        reactivetrader/servers:0.0.769    "bash -c 'dnx -p Adap"   31 seconds ago      Up 25 seconds                           tradeexecution
fa50bfc6a88a        reactivetrader/servers:0.0.769    "bash -c 'dnx -p Adap"   32 seconds ago      Up 26 seconds                           pricing
93f19b26ee0f        reactivetrader/servers:0.0.769    "bash -c 'dnx -p Adap"   33 seconds ago      Up 27 seconds                           reference
86d3f0ce7e9e        reactivetrader/broker:0.0.769     "/bin/sh -c 'crossbar"   34 seconds ago      Up 28 seconds                           broker
8cea2e5eceec        reactivetrader/eventstore:0.0.769 "/bin/sh -c './run-no"   35 seconds ago      Up 29 seconds                           eventstore
05c18462d3c5        reactivetrader/web:0.0.769        "bash -c 'cp /localho"   35 seconds ago      Up 30 seconds                           web
```

Open a browser, navigate to the docker address (`localhost` for linux users and something like `192.168.99.100` for windows/mac users) and the web client will load.

## Test ReactiveTrader
After having started ReactiveTrader, you can run the test script to controll that everything is fine.

If you build/run with a `build_id` (ie: `localtest`): 
```bash
./testAll localtest
```

else
```bash
./testAll
```

This should output something like this:
```bash
<!DOCTYPE html><html lang=en><head><meta charset=utf-8><meta name=viewport content="width=1024"><meta http-equiv=X-UA-Compatible content="IE=edge,chrome=1"><title>Event Store - {{ $state.current.data.title }}</title><link rel=stylesheet href=css/main.min.css><link rel=apple-touch-icon href=apple-touch-icon.png><link rel=icon type=image/png href=favicon.png><meta name=msapplication-TileImage content=es-tile.png><meta name=msapplication-TileColor content=#6BA300></head><body><div ui-view></div><script data-main=js/app.min.js src=js/requirejs.min.js></script></body></html> 
Starting local tests ...
xUnit.net DNX Runner (64-bit DNX 4.5.1)
  Discovering: Adaptive.ReactiveTrader.Server.IntegrationTests
  Discovered:  Adaptive.ReactiveTrader.Server.IntegrationTests
  Starting:    Adaptive.ReactiveTrader.Server.IntegrationTests
{
  "Updates": [
    {
      "UpdateType": "Added",
      "CurrencyPair": {
        "Symbol": "EURUSD",
        "RatePrecision": 5,
        "PipsPosition": 4
      }
    },
    {
      "UpdateType": "Added",
      "CurrencyPair": {
        "Symbol": "USDJPY",
        "RatePrecision": 3,
        "PipsPosition": 2
      }
    },
    {
      "UpdateType": "Added",
      "CurrencyPair": {
        "Symbol": "GBPUSD",
        "RatePrecision": 5,
        "PipsPosition": 4
      }
    },
    {
      "UpdateType": "Added",
      "CurrencyPair": {
        "Symbol": "GBPJPY",
        "RatePrecision": 3,
        "PipsPosition": 2
      }
    },
    {
      "UpdateType": "Added",
      "CurrencyPair": {
        "Symbol": "EURJPY",
        "RatePrecision": 3,
        "PipsPosition": 2
      }
    },
    {
      "UpdateType": "Added",
      "CurrencyPair": {
        "Symbol": "AUDUSD",
        "RatePrecision": 5,
        "PipsPosition": 4
      }
    },
    {
      "UpdateType": "Added",
      "CurrencyPair": {
        "Symbol": "NZDUSD",
        "RatePrecision": 5,
        "PipsPosition": 4
      }
    },
    {
      "UpdateType": "Added",
      "CurrencyPair": {
        "Symbol": "EURCAD",
        "RatePrecision": 5,
        "PipsPosition": 4
      }
    },
    {
      "UpdateType": "Added",
      "CurrencyPair": {
        "Symbol": "EURAUD",
        "RatePrecision": 5,
        "PipsPosition": 4
      }
    }
  ],
  "IsStateOfTheWorld": true,
  "IsStale": false
}
{
  "Symbol": "XXXXXA",
  "BasePnl": 0.0,
  "BaseTradedAmount": 0.0
}
{
  "Symbol": "XXXXXA",
  "BasePnl": 0.0,
  "BaseTradedAmount": 0.0
}
{
  "Trades": [
    {
      "TradeId": 2,
      "CurrencyPair": "XXXXXB",
      "Notional": 1000000,
      "DealtCurrency": "XXX",
      "Direction": "Buy",
      "SpotRate": 1.0,
      "TradeDate": "2016-01-19 11:50:28Z",
      "ValueDate": "2016-01-21 11:50:28Z",
      "Status": "Done"
    }
  ],
  "IsStateOfTheWorld": false,
  "IsStale": false
}
  Finished:    Adaptive.ReactiveTrader.Server.IntegrationTests
=== TEST EXECUTION SUMMARY ===
   Adaptive.ReactiveTrader.Server.IntegrationTests  Total: 8, Errors: 0, Failed: 0, Skipped: 0, Time: 9.464s
```

## Stop all the containers
You can then stop all the containers with:
```bash
$ ./killAll
```

that should list the containers ids:
```
9e1812087905a03708c508b3106ad22969e9a7592e24970e1e8c55b83d2c902e
4b4c4d3bf90c0a7be273719c94678a3b855670bb7e1c342e113ea9c7983edb0e
af624defb197981fc09ed2a7dbb5697192f512d80205ff738a57f17b2b19ba3e
57778f96ae00e9183def627306f4cc626884401e5018ef6bb0c30bcb38de3070
530314a5051e8d105111f0d70600c82f110dfb13ef12694718ffb41a22b4a228
58207df4f31c4a0af69ea08959dd5543250d3998780b03599b1f471b61716d1b
f1c6dca14da91f590b27ee435dc8014335b7a04a7055c66450123430d8403512
0f6f572c7ded93427ff7e942cad3fa6389faf5a3298a28023217540b2254aa66
```
