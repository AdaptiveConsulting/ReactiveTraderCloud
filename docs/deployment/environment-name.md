# Understand: Environment name

- [Understand: Environment name](#understand-environment-name)
  - [Cloud deployment](#cloud-deployment)

In kubernetes, each container is defined in a namespace. We use these namespaces to regroup our docker containers for an environment.  
When we deploy in the cluster, we need to define a unique id that we name **environment name**.

## Cloud deployment

This **environment name** can be found with the uri to RTC. For example, <https://demo.lb.adaptivecluster.com> is written in this pattern: **<PROTOCOL_NAME>://<ENVIRONMENT_NAME>.lb.<CLUSTER_NAME>** where:

- <ENVIRONMENT_NAME> is **demo**
- <CLUSTER_NAME>> is **adaptivecluster.com**

In addition, we have specialized domains for our persistent deployments:

- www.reactivetrader.com -> demo.lb.adaptivecluster.com
- uat.reactivetrader.com -> uat.lb.adaptivecluster.com
- dev.reactivetrader.com -> dev.lb.adaptivecluster.com

If you are going to [deploy a new environment][rtc-deployment], you need to define its name yourself.  
The criteria are:

- it's a string
- use letters and numbers only, no special characters
- it needs to be unique. You can see that by [listing already running environments][listing-environments]

[rtc-deployment]: ./rtc-deployment.md
[listing-environments]: ./rtc-deployment-cli.md#listing-environments
