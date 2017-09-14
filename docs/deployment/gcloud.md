# You want to: Deploy and use gcloud cluster

### Setup docker
- Follow steps on [docker setup page](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/blob/master/docs/deployment/docker-setup.md)

### Setup bash
- Follow [bash setup instructions](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/blob/master/docs/deployment/bash-setup.md)

### Authenticate with gcloud
- Ask RTC administrators to be included in the rtc gcloud project
- Run in bash:
    ```bash
    ./deploy/clis/gcloud init
    ```
- Follow the authentication process by selecting **reactive-trader**

### Select your cluster
- Run in bash:
    ```bash
    ./deploy/kubernetes/use-cluster cluster
    ```
