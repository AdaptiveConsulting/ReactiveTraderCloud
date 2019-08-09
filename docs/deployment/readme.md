Please start by reading the [Understand rtc build and deployments guide](./understand-rtc-build-and-deployments.md)

## HOW TO
- Manage Environments
    - Build and/or run RTC locally
        - with docker (the simpler way)
            1) [Optional] Follow the [install and run docker instructions](./docker-setup.md)
            1) Follow the [run rtc with docker instructions](./run-rtc-with-docker.md)
        - without docker
            1) [server](../server.md)
            2) [client](../client.md)
    - See your code applied on Gcloud
        1) Follow the [build with circleci instructions](./circleci.md)
        1) Follow the [gcloud instructions](./gcloud.md)
        1) Follow the [rtc deployment instructions](./rtc-deployment.md)
    - [Update a service running in kubernetes](./updating-a-rtc-service-in-kubernetes.md)
    - See the [logs of an environment](./logs.md)
    - See a [list of the rtc management commands](./rtc-deployment-cli.md)
- Environment Infrastructure
    - [Deploy the kubernetes cluster on glcoud](./gcloud.md#Deploy-a-kubernetes-cluster-on-gcloud)
    - [Update cluster version](./gcloud.md#Update-cluster-instance-version)
- Understand Concepts
    - [Understand Nsgate, our gcloud cluster front loadbalancer](./nsgate.md)
    - [Understand rtc build and deployments guide](./understand-rtc-build-and-deployments.md)
- Set Up
    - [Setup your bash client](./bash-setup.md)
    - [Setup docker](./docker-setup.md)