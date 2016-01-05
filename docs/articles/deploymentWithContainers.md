# Deployment with Containers

In this article, we will have a look to the deployment process.

We build every services as a [LXC container](https://linuxcontainers.org/). These containers runs on the Cloud. A container manager is used too simplify all the process.

## Our stack choices

##### Here is our stack choice

- [docker container](https://www.docker.com/)
- [Kubernetes](http://kubernetes.io/)
- [Google Cloud Engine](https://cloud.google.com/compute/)

##### Each one of these solutions can be switched by a concurrent solution.

ie:
- docker: [rkt](https://coreos.com/rkt/docs/latest/)
- kubernetes: [EC2 container service](http://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html) / [Docker swarm](https://docs.docker.com/swarm/)
- Google Cloud Engine: Baremetal / [AWS](https://aws.amazon.com/fr/) 

##### why

- `Docker` is the main solution in the industry.
- `kubernetes` is open source and can run everywhere.
- `Google Cloud Engine` propose an already ready to deploy kubernetes cluster [Google Container Engine](https://cloud.google.com/container-engine/). 

## What is

#### What is docker

The idea behind docker is to pack your executable with all its dependencies in one artifact.   
That artifact can then run on any docker daemon. Docker daemon can run on linux or inside virtual machine on windows or MAC.

The only things you need to deploy is that container for most of the case.  
The container, when deployed, is started with only one command.

Docker solves lost of the deployment problematics, but there are still lots of things to manage manually to make things re-start/stop. It does not solve any scaling issues as you need to have multiple host for that.

#### What is kubernetes

Kubernetes is a tool to manage LXC Containers on a cluster.

Here are some of the kubernetes main features:
- Start/Stop `containers` on one node is the same as on a cluster of 100 nodes.
- Communication between your `containers` is done by a `kubernetes service` abstraction. This abstraction gives a DNS to each service running in the cluster. ie, I can define `backend` and join it easily on http://backend.
- You can horizontally scale your `containers` and benefit of the `kubernetes service` load balancer system. Just say `I want 5 of these` and it's done.
- Resiliency is automatically done if your service is resilient by nature. If the node where your `container` is running stop for any reason, kubernetes will automatically schedule the restart of that service on a different node.
- You can really easily start and stop new environments. kubernetes comes with the `namespace` abstraction. A kubernetes service `frontend` can talk to a kubernetes service `backend` on http://backend only if the `frontend` and `backend` services are on the same namespace.
- Cross Environments capabilities. ie: kubernetes service `monitoring` on namespace `admin` can talk to a kubernetes service `frontend` defined on namespace `development` with http://frontend.development.

#### What is Google Cloud Engine

`Google Cloud Engine` 
- gives you the capability to start and stop a cluster in a few commands and minutes.  
- comes with node autoscaling, giving you the opportunity to only pay for what you need when you need it.  

`Google Container Engine`:
- kubernetes is automatically installed and updated.
- comes with a default log system to easily look at what is going on. 
- have a dockerhub mirror that accelerate the download of the docker images 

## Workflow

`Build workflow`:
- git push
- [CircleCi](https://circleci.com/gh/AdaptiveConsulting/ReactiveTraderCloud) trigger a build and generate new docker images
- CircleCi run some tests on these docker images.
- CircleCi push the docker images to [DockerHub](https://hub.docker.com/u/adaptivetrader/dashboard/)

`Deployment workflow`:
- You run a deploy command
- Kubernetes get the docker images from docker hub
- Kubernetes start a new environment if needed (just by instantly creating a new namespace)
- kubernetes start the different services (after a few seconds of download).
- If the cluster capacity is insufficient, Google Cloud Engine start new nodes in a few minutes
- A service running on the kubernetes cluster generate a new `nginx reverse proxy` for the new services asking for public availability. The service are joinable on `<service>-<namespace>.<yourdomain>`

#### Preparing the service artifacts as docker images

Our service need first to be added into the different docker image.

On our workflow, that part is done by CircleCi. But one of the good feature of docker is that it can be run from any system that have docker installed without any other dependencies.

If the code need to be compiled, we start a docker container that comes with all the dependencies. That container produce the binaries/artifact/... and share it with the host. Then a docker image is generated with the binaries/artifact and all the dependencies to run the code copied inside. An exemple is the `web service`.

In this project. The code to build and run all the different containers is defined in the [`deploy/docker`](../../deploy/docker) folder. Refer to that folder readme in order to have a better comprehension of the build and local run process.


#### Starting the Google Container Engine cluster

We need to setup the cluster the first time we want to deploy our environment.  

That process is simple but require some dependencies. As usual, depencencies are packed in a docker image.    
So we use the gcloud docker image to authenticate to google cloud and start a new cluster.  
The command to create the cluster define a name for the cluster, a zone (the data-center) we want to use, the kind of machine architecture and finally the number of nodes.  

After a few minutes, the cluster is started.

If you want to do this step, you can find more informations in the [`deploy/googleCloudEngine`](../../deploy/googleCloudEngine) folder.

#### Generate the manifest to deploy our application

todo

#### Deploy your application

todo

#### Access from the outside world

todo
