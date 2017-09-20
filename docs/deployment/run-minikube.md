# You want to: run minikube, the local kubernetes

## What is minikube
TODO

## Use minikube with RTC
### Windows
- Setup and start
    - follow the [docker setup documentation][docker-setup]
    - start an `admin powershell`
    - install network interface, download and run the vm:
        ```powershell
        # /!\ admin powershell
        .\deploy\minikube\Start-Minikube.ps1
        ```
    - follow [bash setup][bash-setup]
    - in a bash console, run the following to connect to the docker daemon inside the minikube (read [this paragraph][minikube-docker-daemon] for explanation):
        ```bash
        # /!\ bash
        . .\deploy\minikube\minikube_data\docker-env.sh
        ```
    - configure RTC deployer to use minikube with [use-cluster command][use-cluster]:
        ```bash
        # /!\ bash
        ./deploy/kubernetes/use-cluster minikube
        ```
- Stop
    ```powershell
    # /!\ admin powershell
    .\deploy\minikube\Stop-Minikube.ps1
    ```
- Cleanup
    ```powershell
    # /!\ admin powershell
    .\deploy\minikube\Remove-Minikube.ps1
    ```

### Mac/Linux
No RTC script implementation exists for now.

[docker-setup]: ./docker-setup.md
[bash-setup]: ./bash-setup.md
[minikube-docker-daemon]: ./understand-rtc-build-and-deployments.md#Minikube-docker-daemon
[use-cluster]: ./rtc-deployment-cli.md#use-cluster
