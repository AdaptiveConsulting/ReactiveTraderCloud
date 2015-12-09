# Reactive-Trader

[![Circle CI](https://circleci.com/gh/AdaptiveConsulting/AdaptiveTrader.svg?style=svg&circle-token=801547883329d22e505634493b58b26fbb742e46)](https://circleci.com/gh/AdaptiveConsulting/AdaptiveTrader)

## Overview

Reactive Trader is a real-time FX trading platform demo showcasing reactive programming principles applied across the full application stack.

The backend services are written in .NET leveraging the cross-platform capabilities provided by DNX. The services are distributed and can be deployed in Docker containers. This enables the use of tools such as Kubernetes to facilitate cluster management for resiliency purposes, as well as ease of deployment.

Client-side implementations are available for all major platforms, including desktop browser, OpenFin, Android, iOS, Apple Watch and WPF.



## Running with Visual Studio 2015 in Windows

Install Visual Studio 2015 - this will provide the tools required to run DNX.

Grab a clr image by running `dnvm upgrade` from the command line. Running `dnvm list` should then give you something like the following:

```
Active Version           Runtime Architecture Location                      Alias
------ -------           ------- ------------ --------                      -----
  *    1.0.0-rc1-update1 clr     x86          C:\Users\qiming\.dnx\runtimes default
```

Navigate to the `server` folder and restore the nuget packages by running `dnu restore`



## Run on docker

### Install docker on windows/mac:
- go to [toolbox download page](https://www.docker.com/docker-toolbox) and click on your OS (version 1.9.1c on writing moment)
- install
- select virtualbox/docker, kitematic and git are optional
- then launch `Docker Quickstart Terminal`
- run `docker ps` and control that it match the following
```
$ docker ps
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS

```
- fine your docker installation is done.

###  Run ReactiveTrader

- `cp sample.config config`
- `cd deploy/docker`
- `./runAll BUILD_NUMBER`(ie: ./runAll 294) 
