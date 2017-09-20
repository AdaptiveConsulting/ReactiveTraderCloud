# You want to: Deploy and use gcloud cluster

## Deploy a kubernetes cluster on gcloud
- go to [google cloud console][gcloud-console]
- select a project or ceate a new one
- click the menu on the upper right (3 horizontal bars)
- go to **container engine** -> **container clusters**
- at the top, select **create cluster**
    - choose a name
    - a zone close to your users or dev
    - the cluster version, choose **default** or your specific requirements
    - the machine type depending on your needs
    - choose **Container-Optimised OS (cos)**
    - size (this will be the nodes, master count is managed by google)
    - leave other selection as it is or select the one that make sense for you

## Use an already running gcloud cluster
- Follow the [setup docker][docker-setup]
- Follow the [bash setup instructions][bash-setup]
- Authenticate with gcloud:
    - Ask RTC administrators to be included in the RTC gcloud project
    - Run in bash ([see gcloud init details][gcloud-init]):
        ```bash
        ./deploy/clis/gcloud init
        ```
    - Follow the authentication process by selecting **adaptive-trader** or your specific cluster name
- Select your cluster with the [use-cluster command][use-cluster]
    - Run in bash:
        ```bash
        ./deploy/kubernetes/use-cluster cluster
        ```
    - if you have a specific cluster, this part need to be rewritten

[docker-setup]: ./docker-setup.md
[bash-setup]: ./bash-setup.md
[gcloud-init]: ./rtc-deployment-cli.md#gcloud-init
[use-cluster]: ./rtc-deployment-cli.md#use-cluster
[gcloud-console]: https://console.cloud.google.com/home
