# Deployment with Containers

In this article, we will have a look to the deployment process.

We build every services as a [LXC container](https://linuxcontainers.org/). These containers runs on the Cloud. A container manager is used too simplify all the process.

## Our stack choices

##### Here is our stack choice

- [docker container](https://www.docker.com/)
- [Kubernetes](http://Kubernetes.io/)
- [Google Cloud Engine](https://cloud.google.com/compute/)

##### Each one of these solutions can be switched by a competitor solution.

ie:
- docker: [rkt](https://coreos.com/rkt/docs/latest/)
- Kubernetes: [EC2 container service](http://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html) / [Docker swarm](https://docs.docker.com/swarm/)
- Google Cloud Engine: Baremetal / [AWS](https://aws.amazon.com/) 

##### why

- `Docker` is the main solution in the industry.
- `Kubernetes` is open source and can run everywhere.
- `Google Cloud Engine` propose an already ready to deploy Kubernetes cluster [Google Container Engine](https://cloud.google.com/container-engine/). 

## What is

#### What is docker

The idea behind docker is to pack your executable with all its dependencies in one artifact.   
That artifact can then run on any docker daemon. Docker daemon can run on linux or inside virtual machine on windows or MAC.

The only thing that you need to deploy is that artifact.  
The artifact, when deployed, is started with only one command.

Docker solves most of the deployment problematics, but there are still lots of things to manage manually to make things re-start/stop. It does not solve any scaling issues as you need to have multiple host for that.  
A container manager can od all this work for you.

#### What is Kubernetes

Kubernetes is a tool to manage LXC Containers (like docker) on a cluster.

Here are some of the Kubernetes main features:
- Start/Stop containers on one node is the same as on a cluster of 100 nodes.
- Communication between your containers is done by a Kubernetes service abstraction. This abstraction gives a DNS to each service running in the cluster. ie, I can define a `backend` service and reach it easily on, for example: `http://backend`.
- You can horizontally scale your containers and benefit of the Kubernetes service load balancer system. Just say: `I want 5 of these` and it's done.
- Resiliency is automatically done if your service is resilient by nature. If the node where your container is running stop for any reason, Kubernetes will automatically schedule the restart of that service on a different node.
- To easily start and stop new environments, Kubernetes comes with the namespace abstraction. A Kubernetes service `frontend` can talk to a Kubernetes service `backend` on http://backend only if the `frontend` and `backend` services are on the same namespace. A `backend` on another namespace can't be accessed the same way.
- Cross Environments capabilities. ie: Kubernetes service `monitoring` on namespace `admin` can talk to a Kubernetes service `frontend` defined on namespace `development` with http://frontend.development. If the `monitoring` service try to reach http://frontend, it will implicitly resolve to http://frontend.admin. 
- Kubernetes does not manage directly a repository for your images. There are private and public solutions (like [dockerhub](http://hub.docker.com), [Quay](http://quay.io), etc). You can define it directly on your Kubernetes cluster but it's not the default.

#### What is Google Cloud

`Google Cloud Engine` 
- gives you the capability to start and stop a cluster in a few commands and minutes.  
- comes with node autoscaling, giving you the opportunity to only pay for what you need when you need it.  

`Google Container Engine`:
- Kubernetes is automatically installed and updated.
- comes with a default log system to easily look at what is going on. 
- have a dockerhub mirror that accelerate the download of the docker images 

## Workflow

`Build workflow`:
- git push
- CI trigger a build and generate new docker images
- CI run some tests on these docker images.
- CI push the docker images to [DockerHub](https://hub.docker.com/u/adaptivetrader/dashboard/)

`Deployment workflow`:
- You run a deploy command telling which image to run, how many, which services, which namespace, etc. The format is `declarative`.
- Kubernetes get the docker images from docker hub.
- Kubernetes start a new environment if needed (just by instantly creating a new namespace).
- Kubernetes start the different services (after a few seconds of download depending where is your repository (private/dockerhub/...)).
- If the cluster capacity is insufficient, Google Cloud Engine start new nodes in a few minutes.
- A service running on the Kubernetes cluster generate a new `nginx reverse proxy` for the new services asking for public availability. The service are joinable on `<service>-<namespace>.<yourdomain>`.

#### Preparing the service artifacts as docker images

Our service need first to be added into the different docker images.

On our workflow, that part is done by Ci. But one of the good feature of docker is that it can be run from any system that have docker installed without any other dependencies.

If the code need to be compiled, we start a docker container that comes with all the needed dependencies. That container produce the binaries/artifact/... and share it with the host. Then a new docker image is generated with the binaries/artifact and all the dependencies to run the code copied inside.

In this project. The code to build and run all the different containers is defined in the [`deploy/docker`](../../deploy/docker) folder. Refer to that folder readme in order to have a better comprehension of the build and local run process.


#### Starting the Google Container Engine cluster

We need to setup the cluster the first time we want to deploy our environment.  

That process is simple but require some dependencies. As usual, depencencies are packed in a docker image.    
So we use the gcloud docker image to authenticate to google cloud and start a new cluster.  
The command to create the cluster define some parameters like the name for the cluster, the data-center we want to use, the kind of machine architecture and finally the number of nodes.  

After a few minutes, the cluster is started.

If you want to have a better understanding of this step, you can find more informations in the [`deploy/googleCloudEngine`](../../deploy/googleCloudEngine) folder.

#### Deploy your application

First, we generate some manifests from templates in order to describe our application.  
This manifests are transmitted to Kubernetes with different command in order to choose the kind of update you want:

- New deployment
- Canary
- Fast update
- ...

These process are really simple as they are already defined in Kubernetes. 

#### Access from the outside world

In order to access the different services in the cluster, you have different kind of solutions:

- Ask Kubernetes/googleCloud to generate an `externalIP` for each public services.
- Use only one public service to proxy the traffic using virtualhost

We use the virtualhost solution:

- `NsGate`, a proxy service, is running on our cluster in a specific environment to not interfere with others
- NsGate listens to the cluster services and proxy traffic to each service `asking for public visibility`
- NsGate get the name of the service and the namespace where it is running. It then generate a `proxy configured on virtualhost`.
- For now we are using this pattern: `<service>-<namespace>.<domain>`. As an example, `web`-`demo`.`adaptivecluster.com` is proxying to the service `web` in the namespace `demo`. Our domain `adaptivecluster.com` is redirected to the `NsGate` static IP maintained by google services.  
- `SSL` terminate by design at `NsGate`. The service asking for public is responsible for defining the `PORT`, the kind of proxy (`HTTP`, `HTTPS`, `WS`, `WSS`). 

## Summary

- write some code
- `$ git push`
- get the `<BUILD_NUMBER>` while waiting it to pass green on CI. 
- `$ deploy <NAMESPACE> <BUILD_NUMBER>`
- go to `http(s)://<SERVICE>-<NAMESPACE>.<DOMAIN>` 
