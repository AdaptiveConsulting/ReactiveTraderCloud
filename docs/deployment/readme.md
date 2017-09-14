# AdaptiveTrader.deploy

The deploy folder let you build and deploy locally `RTC` (ReactiveTraderCloud) and the kubernetes clusters.

Please start by reading the [Understand rtc build and deployments guide](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/blob/master/docs/deployment/understand-rtc-build-and-deployments.md)

## YOU WANT TO
### Environment managment
#### Build and run RTC locally
##### with docker (simpler way)
1) [Optional] Follow the [install and run docker instructions](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/blob/master/docs/deployment/docker-setup.md)
1) [Optional] Follow the [build instructions](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/blob/master/docs/deployment/build-rtc-locally.md)
1) Follow the [run rtc with docker instructions](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/blob/master/docs/deployment/run-rtc-with-docker.md)

##### with minikube (the closest to prod)
1) (TODO) Follow the [install and run minikube instructions](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/blob/master/docs/deployment/run-minikube.md)
1) Follow the [build instructions](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/blob/master/docs/deployment/build-rtc-locally.md)
1) Follow the [rtc deployment instructions](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/blob/master/docs/deployment/rtc-deployment.md)

#### See your code applied on Gcloud
1) Follow the [build with circleci instructions](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/blob/master/docs/deployment/circleci.md)
1) Follow the [gcloud instructions](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/blob/master/docs/deployment/gcloud.md)
1) Follow the [rtc deployment instructions](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/blob/master/docs/deployment/rtc-deployment.md)

#### Update a service running in kubernetes
go to the [update service documentation](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/blob/master/docs/deployment/updating-a-rtc-service-in-kubernetes)

#### See the logs of an environment
TODO

### Infrastructure managment
#### Deploy the kubernetes cluster on glcoud
TODO

### Concepts
#### Understand Nsgate, our gcloud cluster front loadbalancer
go to the [nsgate documentation](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/blob/master/docs/deployment/nsgate.md)

### Tooling
#### Setup your bash client
go to the [bash setup documentation](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/blob/master/docs/deployment/bash-setup.md)

#### Setup docker
go to the [docker setup page](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/blob/master/docs/deployment/docker-setup.md)

#### Setup minikube
go to the [minikube setup page](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/blob/master/docs/deployment/run-minikube.md)
