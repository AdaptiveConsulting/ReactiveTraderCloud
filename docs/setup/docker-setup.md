## Running on Docker

The following instructions have been tested on: 
- Windows 7
- Ubuntu 14.04.3

#### Install docker for your OS

Follow the steps [here](https://docs.docker.com/engine/installation/) for instructions for your specific OS/distribution.

#### Start toolbox for Windows/Mac user:
launch `Docker Quickstart Terminal` - this will start a default virtual machine on which your containers will run. You'll see something like

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

Some help can be found in our documentation [here](../../deploy/docker/readme.md)

Docker toolbox run an ubuntu VM. That virtual machine automatically share your users folders. Building ReactiveTrader need to share some code with the containers inside the VM. So make sure that your cloned project is under your user folder. ie: `c:\Users\myname\repository\reactivetradercloud` is perfect. 

### Linux users
Just control that docker is running with:

```bash
docker ps
```
Should output

```bash
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES

```

#### Run Reactive Trader

You can run the app by using our prebuilt containers.
The containers are hosted on docker hub for each successfull [master build](https://circleci.com/gh/AdaptiveConsulting/ReactiveTraderCloud/tree/master).

Here, we will deploy the build 628.

```bash
$ ./runAll 628
```

Inspect the running containers

```bash
$ docker ps
```

Should give you something like the following:

```bash
$ docker ps
CONTAINER ID        IMAGE                             COMMAND                  CREATED             STATUS              PORTS               NAMES
ba36323ecc73        adaptivetrader/servers:0.0.628    "bash -c 'dnx -p Adap"   29 seconds ago      Up 23 seconds                           analytics
e116fa85abdb        adaptivetrader/servers:0.0.628    "bash -c 'dnx -p Adap"   30 seconds ago      Up 24 seconds                           blotter
b69e619c1059        adaptivetrader/servers:0.0.628    "bash -c 'dnx -p Adap"   31 seconds ago      Up 25 seconds                           tradeexecution
fa50bfc6a88a        adaptivetrader/servers:0.0.628    "bash -c 'dnx -p Adap"   32 seconds ago      Up 26 seconds                           pricing
93f19b26ee0f        adaptivetrader/servers:0.0.628    "bash -c 'dnx -p Adap"   33 seconds ago      Up 27 seconds                           reference
86d3f0ce7e9e        adaptivetrader/broker:0.0.628     "/bin/sh -c 'crossbar"   34 seconds ago      Up 28 seconds                           broker
8cea2e5eceec        adaptivetrader/eventstore:0.0.628 "/bin/sh -c './run-no"   35 seconds ago      Up 29 seconds                           eventstore
05c18462d3c5        adaptivetrader/web:0.0.628        "bash -c 'cp /localho"   35 seconds ago      Up 30 seconds                           web
```

Then open a browser, navigate to the docker address (localhost for linux users and something like 192.168.99.100 for windows/mac users) and the web client should load.

#### Build Reactive Trader

If you prefer to run your own containers, you can build them easily.

First, define a `BUILD_ID`. It's a string that will tag your containers. `mytest` or `1` are good choices. Here we will use `localtest`. 

Change your working directory to `cd deploy/docker`, then run the following. This pulls base containers and builds the app containers so may take a while. 

```bash
$ BUILD_ID="localtest"
$ ./prepare build services $BUILD_ID
```

You can then run the built containers with 

```bash
$ ./runAll $BUILD_ID
```
