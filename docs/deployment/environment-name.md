# Understand: Environment name
In kubernetes, each container is defined in a namespace. We use these namespaces to regroup our docker containers for an environment.  
When we deploy in the cluster, we need to define a unique id that we name **environment name**.

## Cloud deployment
This **environment name** can be found with the uri to RTC. For example, <https://web-demo.adaptivecluster.com> is written in this pattern: **<PROTOCOL_NAME>://<SERVICE_NAME>-<ENVIRONMENT_NAME>.<CLUSTER_NAME>** where:
- <SERVICE_NAME> is **web**
- <ENVIRONMENT_NAME> is **demo**
- <CLUSTER_NAME>> is **adaptivecluster.com**

If you are going to [deploy a new environment][rtc-deployment], you need to define its name yourself.  
The criteria are:
- it's a string
- use letters and numbers only, no special characters
- it needs to be unique. You can see that by [listing already running environments][listing-environments]

## Minikube
For local deployment with minikube, use the environment name **test**. For now, minikube-gate that do the proxying to the local environment have the backend name hardcoded.

[rtc-deployment]: ./rtc-deployment.md
[listing-environments]: ./rtc-deployment-cli.md#listing-environments
