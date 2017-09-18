# You want to: run minikube, the local kubernetes

## What is minikube
TODO

## Use minikube with rtc
### Windows
- Setup and start
    - follow the [docker setup documentation](docs/deployment/docker-setup.md)
    - start an `admin powershell`
    - install network interface, download and run the vm:
        ```powershell
        # /!\ admin powershell
        .\deploy\minikube\Start-Minikube.ps1
        ```
    - follow [bash setup](docs/deployment/bash-setup.md)
    - in a bash console, run the following to connect to the docker daemon inside the minikube (read [this paragraph](docs/deployment/understand-rtc-build-and-deployments#Minikube-docker-daemon) for explanation):
        ```bash
        # /!\ bash
        . .\deploy\minikube\minikube_data\docker-env.sh
        ```
    - setup rtc deployer to use minikube:
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
No rtc script implementation exist for now.
