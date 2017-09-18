# You want to: Deploy Reactive Trader Cloud

## Do the deployment
- follow the [bash setup][bash-setup] and start a bash terminal
- choose your [environment name][environment-name]. For this example we will use `myenv`
- [identify your build_id][build-id]. Here we will use `buildid`
- deploy your environment:
    ```
    # /!\ Bash
    `./deploy/kubernetes/deploy myenv buildid`
    ```
- wait a moment and see the ressources :
    ```
    # /!\ bash
    `./deploy/kubernetes/describe myenv`
    ```

[environment-name]: ./environment-name.md
[build-id]: ./build_id.md
[bash-setup]: ./bash-setup.md
