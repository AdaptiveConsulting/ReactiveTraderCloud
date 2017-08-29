# You want to: Deploy and use gcloud cluster

### 1 - Install docker client and daemon
Go to [docker.com](https://www.docker.com/) and install docker-ce for your distribution

### 2 - Connect to a docker daemon with one of those options
- Linux:
    - connect using local docker daemon (Linux)
- Windows/Mac:
    - connect using Docker VM
    - connect using minikube

### 3 - Authenticate with gcloud
- Ask RTC administrators to be included in the rtc gcloud project
- Start bash
- run `./deploy/clis/gcloud init`
- follow the authentication process

### 4 - Select your cluster
- Start bash
- run `./deploy/kubernetes/use-cluster cluster`
