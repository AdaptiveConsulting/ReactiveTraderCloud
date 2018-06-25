# How to: use RTC deployment commands

- [How to: use RTC deployment commands](#how-to-use-rtc-deployment-commands)
    - [Commands](#commands)
        - [More used Commands](#more-used-commands)
        - [Command descriptions](#command-descriptions)
            - [gcloud init](#gcloud-init)
            - [use-cluser](#use-cluser)
            - [listing-environments](#listing-environments)

## Commands
### More used Commands
- Common
    - ./deploy/clis/gcloud
    - ./deploy/clis/kubectl
- Kubernetes
    - ./deploy/kubernetes/use-cluster <CLUSTER_NAME>
    - ./deploy/kubernetes/deploy <ENVIRONMENT_NAME> [<BUILD_ID>]
    - ./deploy/kubernetes/list_environments
    - ./deploy/kubernetes/describe <ENVIRONMENT_NAME>
    - ./deploy/kubernetes/scale <ENVIRONMENT_NAME> <SERVICE_NAME> <NEW_SCALE_COUNT>
### Command descriptions
#### gcloud init
- requirements:
    - [setup docker][docker-setup]
    - [setup and start bash][bash-setup]
    - ask RTC administrators for a google RTC project access
- run **./deploy/clis/gcloud init** in *bash* and follow the different steps.
    - *NB: The cloud project is adaptive-trader*
    ```
    ./deploy/clis/gcloud init
    Welcome! This command will take you through the configuration of gcloud.

    [...]
    You must log in to continue. Would you like to log in (Y/n)?  y

    Go to the following link in your browser:

        https://accounts.google.com/o/oauth2/auth?redirect_uri=...


    Enter verification code: 4/IDtkh88Mz_njNqYUbHtO-IeDcLonT9MF7h1HlaZD83w


    [...]
    You are logged in as: [foo@weareadaptive.com].

    Pick cloud project to use:
    [1] adaptive-trader
    [2] Create a new project
    Please enter numeric choice or text value (must exactly match list
    item):  1

    Your current project has been set to: [adaptive-trader].

    [...]
    ```

#### use-cluser
- requirements:
    - [setup docker][docker-setup]
    - [setup and start bash][bash-setup]
    - [authenticate with gcloud][gcloud-init]
- run **./deploy/kubernetes/user-cluster <CLUSTER_NAME>** in *bash*
    ```
    $ ./deploy/kubernetes/use-cluster cluster
    Fetching cluster endpoint and auth data.
    kubeconfig entry generated for cluster.
    Switched to context "gke_adaptive-trader_europe-west1-c_cluster".
    ```
- you can run without <CLUSTER_NAME> to see available clusters:
    ```
    $ ./deploy/kubernetes/use-cluster
    Usage:
      ./deploy/kubernetes/use-cluster minikube|cluster|dev

    existing cluster names:
     - minikube: local kubernetes
     - cluster:  where we do service level update. demo/dev/... environments are in this cluster. Present on gcloud
     - dev:      where we do infrastructure updates. Only Devops and Admin should use this cluster. Present on gcloud

    ```

#### listing-environments
- requirements:
    - [setup docker][docker-setup]
    - [setup and start bash][bash-setup]
    - [authenticate with gcloud][gcloud-init]
    - [select cluster][use-cluster]
- run **./deploy/kubernetes/list_environments** in *bash*
    ```
    $ ./deploy/kubernetes/list_environments
    CURRENT CLUSTER
    current-context: gke_adaptive-trader_europe-west1-c_cluster

    NAMESPACES:
    NAME          STATUS    AGE
    default       Active    1y
    demo          Active    9d
    dev           Active    26d
    kube-public   Active    39d
    kube-system   Active    1y
    myenv         Active    11d
    nsgate        Active    39d
    vs2017        Active    23d
    ```
*NB: for now, kubernetes namespace are shown and environments are a subset of the namespaces. Just concidere default, kube-public, kube-system and nsgate as cluster specific environments*

[bash-setup]: ./bash-setup.md
[docker-setup]: ./docker-setup.md
[use-cluster]: ./rtc-deployment-cli.md#use-cluster
[gcloud-init]: ./rtc-deployment-cli.md#gcloud-init
