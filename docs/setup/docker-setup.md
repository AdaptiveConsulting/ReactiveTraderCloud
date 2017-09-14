# Running on Docker

You will updated documentation here:
- [docker setup page](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/blob/master/docs/deployment/docker-setup.md)
- [build locally with docker](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/blob/master/docs/deployment/build-rtc-locally.md)
- [run with docker](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/blob/master/docs/deployment/run-rtc-with-docker.md)


The following instructions have been tested on: 
- Windows 7 / 10
- Ubuntu 14.04.3 / 15.10
- OS X 10.11.2 (15C50) / kernel 15.2.0

If you have any issues with this process, please have a look [here](docker-issues.md) where we have listed some of the known problems that may occur.

## Install docker for your OS

Follow the steps [here](https://docs.docker.com/engine/installation/) for instructions for your specific OS/distribution.

### Check your docker installation
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


#### Linux users
Just check that docker is running with:

```bash
docker ps
```
This should output:

```bash
CONTAINER ID     IMAGE            COMMAND          CREATED          STATUS           PORTS            NAMES

```


## Clone the repository

Clone the repository by running `git clone https://github.com/AdaptiveConsulting/ReactiveTraderCloud.git`

#### Note for Windows

If you are running on Windows, note that the OS line ending is `CRLF`. Since scripts we will run are written in bash and will run inside Linux containers, the required line ending is `LF`.
Therefore ensure that your checkout maintains `LF` line endings when cloning the repository.

Before cloning :
```bash
git config --global core.autocrlf false
```

Also for Windows, ensure that your cloned project is under your user folder. E.g.: `c:\Users\myname\repository\reactivetradercloud`. This is because on Docker on Windows uses a Linux Docker host running on VirtualBox, which needs folder sharing with Windows for which the User folder is shared by default.
