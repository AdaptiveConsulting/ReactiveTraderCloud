# Understand RTC build and deployments

- [Understand RTC build and deployments](#understand-rtc-build-and-deployments)
    - [Docker or No Docker](#docker-or-no-docker)
        - [Demo](#demo)
        - [Development](#development)
    - [Docker as the only mandatory dependency](#docker-as-the-only-mandatory-dependency)

There are a lot of solutions when you choose to run Reactive Trader Cloud locally:
- Installing every part locally without docker
  - [frontend](../client.md)
  - [backend](../server.md)
- [Locally on docker without kubernetes](./run-rtc-with-docker.md)

## Docker or No Docker
### Demo
Running RTC for a demo is definitely easier to do with the help of docker as docker becomes the only dependency to install. You then just have to run the good commands and fill the authentication for gcloud.  

### Development
If you want to do development, docker add a layer that can be difficult to understand. And most of the time, developer will go in the traditional way by installing all dependencies (that are anyway needed to do the development).  
But you can still use docker for other services where you don't want to do development. Backends can be running on docker while you'll install and work on the front-end.

## Docker as the only mandatory dependency
To build or deploy RTC, the only mandatory dependency is docker.  
With docker installed, you can:
- **run without build**:
    - ./deploy/docker/runAll
    - This would use [all RTC docker images from docker hub][dockerhub]

- **build**:
    - ./deploy/docker/prepare build RTC MyVersion
    - This would use docker images to build all artifacts and generate all RTC images

- **run your local build**
    - ./deploy/docker/runAll MyVersion

- **publish your local build**
    - ./deploy/docker/prepare push RTC MyVersion
    - This would push all RTC docker images to [docker hub][dockerhub]

- **deploy on a kubernetes cluster**
    - ./deploy/kubernetes/use-cluster selected_cluster
    - ./deploy/kubernetes/deploy MyVersion

[dockerhub]: https://hub.docker.com/u/reactivetradercloud/
