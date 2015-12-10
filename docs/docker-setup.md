## Running on Docker

Install Docker from their [toolbox download page](https://www.docker.com/docker-toolbox) for your OS 

Launch `Docker Quickstart Terminal` - this will start a default virtual machine on which your containers will run. On Windows you'll see something like

```bash
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

To run the app you'll need to first build the docker containers and provide a `BUILD_NUMBER`, e.g. 1

Change your working directory to `cd deploy/docker`, then run the following. This pulls base containers and builds the app containers so may take a while. 

```bash
$ ./prepare build services BUILD_NUMBER
```

You can then run the built containers

TODO: populate ES

```bash
$ ./runAll BUILD_NUMBER
```

Inspect the running containers

```
docker ps
```

Should give you something like the following:

```bash
$ docker ps
CONTAINER ID        IMAGE                             COMMAND                  CREATED             STATUS              PORTS               NAMES
ba36323ecc73        adaptivetrader/servers:0.0.1      "bash -c 'dnx -p Adap"   29 seconds ago      Up 23 seconds                           analytics
e116fa85abdb        adaptivetrader/servers:0.0.1      "bash -c 'dnx -p Adap"   30 seconds ago      Up 24 seconds                           blotter
b69e619c1059        adaptivetrader/servers:0.0.1      "bash -c 'dnx -p Adap"   31 seconds ago      Up 25 seconds                           tradeexecution
fa50bfc6a88a        adaptivetrader/servers:0.0.1      "bash -c 'dnx -p Adap"   32 seconds ago      Up 26 seconds                           pricing
93f19b26ee0f        adaptivetrader/servers:0.0.1      "bash -c 'dnx -p Adap"   33 seconds ago      Up 27 seconds                           reference
86d3f0ce7e9e        adaptivetrader/broker:0.0.1       "/bin/sh -c 'crossbar"   34 seconds ago      Up 28 seconds                           broker
8cea2e5eceec        adaptivetrader/eventstore:0.0.1   "/bin/sh -c './run-no"   35 seconds ago      Up 29 seconds                           eventstore
05c18462d3c5        adaptivetrader/web:0.0.1          "bash -c 'cp /localho"   35 seconds ago      Up 30 seconds                           web
```

Then open a browser, navigate to the docker virtual machine address in the example above and the web client should load.