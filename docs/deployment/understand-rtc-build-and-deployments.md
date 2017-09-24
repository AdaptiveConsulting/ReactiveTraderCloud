# You want to: Understand RTC build and deployments

- [You want to: Understand RTC build and deployments](#you-want-to-understand-rtc-build-and-deployments)
    - [docker or not docker](#docker-or-not-docker)
        - [Demo](#demo)
        - [Development](#development)
    - [Docker as the only mandatory dependency](#docker-as-the-only-mandatory-dependency)
    - [Minikube](#minikube)
        - [Why Minikube](#why-minikube)
            - [What is Minikube](#what-is-minikube)
            - [Added value](#added-value)
        - [New layer == New issues](#new-layer-new-issues)
            - [Understand Windows/Mac docker mechanism](#understand-windowsmac-docker-mechanism)
            - [Minikube docker daemon](#minikube-docker-daemon)

There are a lot of solutions when you choose to run Reactive Trader Cloud locally:
- Installing every part locally without docker
  - [frontend](../client.md)
  - [backend](../server.md)
- [Locally on docker without kubernetes](./run-rtc-with-docker.md)
- Locally on docker with the support of kubernetes: [run minikube](./run-minikube.md) and then do a [standard deployment](./rtc-deployment.md)

## docker or not docker
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
    - This would use [all RTC docker images from docker hub][hub-docker]

- **build**:
    - ./deploy/docker/prepare build RTC MyVersion
    - This would use docker images to build all artifacts and generate all RTC images

- **run your local build**
    - ./deploy/docker/runAll MyVersion

- **publish your local build**
    - ./deploy/docker/prepare push RTC MyVersion
    - This would push all RTC docker images to [docker hub][hub-docker]

- **deploy on a kubernetes cluster**
    - ./deploy/kubernetes/use-cluster selected_cluster
    - ./deploy/kubernetes/deploy MyVersion

## Minikube
### Why Minikube
#### What is Minikube
[Minikube](https://github.com/kubernetes/Minikube) is the local kubernetes cluster supported by the kubernetes team.  

#### Added value
We have added the Minikube feature to RTC in order to be able to deploy locally in the same way we deploy to gcloud.  
This let us use the same [deployment code and mechanism](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/blob/master/docs/deployment/rtc-deployment.md).  

Docker lets us run RTC locally without kubernetes but that code is custom and requires maintenance as docker is in a constant evolution with constant breaking changes (mainly for windows/Mac).

For developers, it's a great solution to be really confident on how will run the code without pushing/merging/reviewing. It also result in a quicker feedback as you suffer the circleci pipeline slowness.

### New layer == New issues
#### Understand Windows/Mac docker mechanism
On Mac and Windows, Minikube comes inside a Linux virtual machine from different supported providers (VBox, Hyper-V, etc).  
Installing docker result in:
- Installing the docker client on your OS
- Setting up the docker daemon inside a virtual machine in order to access a Linux kernel (We will name it MobyLinuxVM)

#### Minikube docker daemon
Minikube is built on top of this kind of virtual machine with the docker daemon. Kubernetes services run as containers inside.

By default, the docker client is configured to connect to the docker daemon inside MobyLinuxVM. To deploy on Minikube, the Minikube-docker-daemon will require to access the images but there is no link between the 2 virtual machines.  
*Solutions:*
- we could publish the images to docker hub but that would take a lot of additional time.
- We could configure kubernetes to use the docker repository inside the MobyLinuxVM. But that would require to run both VM and would take quite a lot of memory
- We did choose to simply connect the docker client to the docker daemon inside Minikube. This just requires to update a few environment variables.

[hub-docker]: https://store.docker.com/profiles/reactivetrader/
