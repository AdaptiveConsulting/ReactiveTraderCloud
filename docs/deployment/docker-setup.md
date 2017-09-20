# Docker
## Docker in really short
In really short, docker is like a virtual machine but without the kernel emulation. Every container share the host kernel. For rtc, we use linux containers that require a linux kernel.

On Windows or Mac, linux containers run inside a virtual machine. This Virtual machine provides the linux kernel. On linux, it's the host kernel that is shared with the containers.

## Why docker
One of the biggest benefits is time. A container starts in less than one second. This let's us use a multiple of them for tiny tasks. It also provides a really short restart for services.

As it's a virtual machine implementation, it comes with all the benefits of portability and reusability. A container that runs on a windows host will run on a Mac host.

## Installation
Docker comes in 2 parts:
- docker client
- docker daemon

The containers run on the daemon. The client let you manipulate the docker daemon. Client and daemon doesn't require to be on the same host.  

The installation procedure is different on each OS. Plase follow the installation instructions for **docker-ce** on the [docker official website for your OS][docker] in the **Get Docker* section at the top of the page. When you see the docker helloworld, you're good.

## Configuration
### windows specifics
- follow the [bash setup instructions][bash-setup]

### standard
- just confirm that you run linux containers by:
    - right clicking on docker icon
    - confirm that **Switch to windows containers** is present, showing you are running **linux containers**
- when you run rtc script, answer yes to sharing the rtc folder

### minikube
Minikube comes with a different linux virtual machine than the official docker one. That one runs kubernetes inside containers. For rtc to run smoothly, you need to configure your docker client to point to the docker daemon inside the minikube. This will let you build the images directly on the good daemon.

You can do that by running a script generated when you start the minikube. Just follow [the run minikube instructions][run-minikube].

[docker]: https://www.docker.com/
[bash-setup]: ./bash-setup.md
[run-minikube]: ./run-minikube.md
