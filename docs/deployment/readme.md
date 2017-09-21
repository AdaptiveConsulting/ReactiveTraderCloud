# AdaptiveTrader.deploy

The deploy folder let you build and deploy locally `RTC` (ReactiveTraderCloud) and the kubernetes clusters.

Please start by reading the [Understand rtc build and deployments guide](./understand-rtc-build-and-deployments.md)

## YOU WANT TO
- Environment managment
    - Build and/or run RTC locally
        - with docker (the simpler way)
            1) [Optional] Follow the [install and run docker instructions](./docker-setup.md)
            1) [Optional] Follow the [build instructions](./build-rtc-locally.md)
            1) Follow the [run rtc with docker instructions](./run-rtc-with-docker.md)
        - with minikube (the closest to prod)
            1) Follow the [install and run minikube instructions](deployment/run-minikube.md)
            1) [Optional] Follow the [build instructions](./build-rtc-locally.md)
            1) Follow the [rtc deployment instructions](./rtc-deployment.md)
    - See your code applied on Gcloud
        1) Follow the [build with circleci instructions](./circleci.md)
        1) Follow the [gcloud instructions](./gcloud.md)
        1) Follow the [rtc deployment instructions](./rtc-deployment.md)
    - [Update a service running in kubernetes](./updating-a-rtc-service-in-kubernetes.md)
    - See the [logs of an environment](./logs.md)
    - See a [list of the rtc managment commands](./rtc-deployment-cli.md)
- Infrastructure managment
    - [Deploy the kubernetes cluster on glcoud](./gcloud.md#Deploy-a-kubernetes-cluster-on-gcloud)
- Concepts
    - [Understand Nsgate, our gcloud cluster front loadbalancer](./nsgate.md)
    - [Understand rtc build and deployments guide](./understand-rtc-build-and-deployments.md)
- Tooling
    - [Setup your bash client](./bash-setup.md)
    - [Setup docker](./docker-setup.md)
    - [Setup minikube](./run-minikube.md)
