# You want to: Deploy and use gcloud cluster

- Follow the [setup docker][docker-setup]
- Follow the [bash setup instructions][bash-setup]
- Authenticate with gcloud:
    - Ask RTC administrators to be included in the rtc gcloud project
    - Run in bash:
        ```bash
        ./deploy/clis/gcloud init
        ```
    - Follow the authentication process by selecting **reactive-trader**
- Select your cluster
    - Run in bash:
        ```bash
        ./deploy/kubernetes/use-cluster cluster
        ```

[docker-setup]: ./docker-setup.md
[bash-setup]: ./bash-setup.md
