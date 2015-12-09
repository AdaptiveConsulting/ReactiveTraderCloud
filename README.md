# Reactive-Trader

[![Circle CI](https://circleci.com/gh/AdaptiveConsulting/AdaptiveTrader.svg?style=svg&circle-token=801547883329d22e505634493b58b26fbb742e46)](https://circleci.com/gh/AdaptiveConsulting/AdaptiveTrader)

# Run on docker

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

- `cd deploy/docker`
- `./runAll BUILD_NUMBER`(ie: ./runAll 294) 
