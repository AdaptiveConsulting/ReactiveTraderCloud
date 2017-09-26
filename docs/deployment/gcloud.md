# You want to: Deploy and use gcloud cluster

- [You want to: Deploy and use gcloud cluster](#you-want-to-deploy-and-use-gcloud-cluster)
    - [Deploy a kubernetes cluster on gcloud](#deploy-a-kubernetes-cluster-on-gcloud)
    - [Use an already running gcloud cluster](#use-an-already-running-gcloud-cluster)
    - [Update cluster instance version](#update-cluster-instance-version)

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

## Update cluster instance version
It's easy to update the gcloud cluster to a new version with the console. But before processing, be sure that your environment will run on the new kubernetes version. For **Reactive Trader Cloud**, try to update **dev** before updating **cluster**.  
- go to [Reactive Trader Cloud project in gcloud][gcloud-console]
- click the menu on the upper right (3 horizontal bars)
- go to **container engine** -> **container clusters**
- click on the cluster to update
- click on **upgrade available** on **Cluster** or **Node Pools**
- select the **wanted version**
- click on **change**

Changing the version deletes and recreates all nodes in the node pool:

- Only pods managed by a replication controller are restored.
- Boot and local disks are deleted.
- Other persistent disks will be retained.
- Nodes will be drained and replaced one at a time.
- If you have small number of nodes, during the update your application will be more likely to experience downtime.
- You will be unable to edit this cluster until the upgrade is finished.
- This operation starts immediately, and may be not reversible.

[docker-setup]: ./docker-setup.md
[bash-setup]: ./bash-setup.md
[gcloud-init]: ./rtc-deployment-cli.md#gcloud-init
[use-cluster]: ./rtc-deployment-cli.md#use-cluster
[gcloud-console]: https://console.cloud.google.com/home
