## Running on Docker

The following instructions have been tested on: 
- Windows 7
- Ubuntu 14.04.3
- OS X 10.11.2 (15C50) / kernel 15.2.0

#### Install docker for your OS

Follow the steps [here](https://docs.docker.com/engine/installation/) for instructions for your specific OS/distribution.
If you have any issues with the docker installation, please have a look [here](docker-issues.md). We have list some of the known problems that may occur with the installation..

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

Docker toolbox runs an Ubuntu virtual machine. This VM automatically shares your user folders. Building ReactiveTrader needs to share some code with the containers inside the VM. Please make sure that your cloned project is under your user folder. E.g.: `c:\Users\myname\repository\reactivetradercloud` is perfect. 

### Linux users
Just check that docker is running with:

```bash
docker ps
```
This should output:

```bash
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES

```

#### Run Reactive Trader

You can run the app by using our pre-built containers.
In order to run the latest one, execute:
```bash
$ cd deploy/docker
$ ./runAll
```

Inspect the running containers:

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

Open a browser, navigate to the docker address (localhost for linux users and something like 192.168.99.100 for windows/mac users) and the web client will load.

You can then stop all the containers with:
```bash
$ ./killAll
```

#### Build Reactive Trader

If you prefer to run your own containers, you can build them easily.

First, define a `BUILD_ID`. It's a string that will tag your containers. `mytest` or `1` are good choices. Here we will use `localtest`. 

Change your working directory to `cd deploy/docker`, and stop any reactiveTrader containers that are running by executing:
`./killAll`.  
 
After this execute the following to prepare and build the containers: 
```bash
$ BUILD_ID="localtest"
$ ./prepare build services $BUILD_ID
```
This pulls base containers and builds the app containers so will take a while.

You can then run the built containers with: 

```bash
$ ./runAll $BUILD_ID
```

Finally stop all ReactiveTrader containers with:

```bash
$ ./killAll
```
