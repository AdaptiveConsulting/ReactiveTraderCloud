# How to deploy on local kubernetes instance

- [How to deploy on local kubernetes instance](#how-to-deploy-on-local-kubernetes-instance)
  - [Microk8s](#microk8s)
  - [Setup](#Setup)
    - [Installation](#installation)
    - [Add a namespace](#add-a-namespace)
    - [Add config maps](#add-config-maps)
    - [Deployment](#deployment)


## Microk8s

Microk8s is a fully-conformant Kubernetes application that allows you to simulate the deployment locally.

## Setup
### Installation
Follow the instructions on [microk8s website](https://microk8s.io/docs), after that, enable the registry add-on.
```shell script
microk8s enable registry
```
In some versions of docker you can have issues while pushing to the built-in registry. You can add an exception in the daemon configuration file `/etc/docker/daemon.json`.
```json
{
  "insecure-registries" : ["localhost:32000"]
}
```
Then restart docker
```
sudo systemctl restart docker
```

### Add a namespace
The deployment script we provide uses the namespace "reactive-trader-local". You can create it using this command:
```shell script
microk8s kubectl create namespace reactive-trader-local
```

### Add config maps
We currently need 2 config-maps in order have a working environment. You can generate them with these commands:
```shell script
microk8s kubectl -n reactive-trader-local create configmap client-config --from-literal=environment-name=local
microk8s kubectl -n reactive-trader-local create configmap bot-config --from-literal=bot-address=rt-bot-local@weareadaptive.com --from-literal=bot-name=rt-bot-local
```

### Deployment
You can now run the script `deploy_locally.sh` under `src/services/kubernetes/per-deployment`
