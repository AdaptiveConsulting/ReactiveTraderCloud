# You want to: Deploy Reactive Trader Cloud

### 1 - Select RTC version to deploy
CircleCi build RTC and use its build number to tag all docker images.  
This build number is the one that you need to use for deployments.  
For the example we will use `2084`

### 2 - Do the deployment
- Start bash
- Choose your environment name. For this example we will use `myenv`
- run `./deploy/kubernetes/deploy myenv 2084`
- wait a moment and run `./deploy/kubernetes/describe myenv`
