# Debug/Run RTC (Reactive Trader Cloud) with docker (without kubernetes)

- [Debug/Run RTC (Reactive Trader Cloud) with docker (without kubernetes)](#debug-/-run-rtc-(-reactive-trader-cloud-)-with-docker-(-without-kubernetes-)-)
    - [Setup notes](#setup-notes)
    - [Setup and validate docker](#setup-and-validate-docker)
    - [Preparing / Running images](#preparing-/-running-images)
        - [Building images](#building-images)
        - [Running all local images](#running-all-local-images)
        - [View RTC running](#view-rtc-running)
        - [Running / Debugging RTC](#running-/-debugging-rtc)
    - [Stop all the running containers](#stop-all-the-running-containers)

## Setup notes
This setup was tested and executed on *Windows 10* using [docker for windows](https://docs.docker.com/docker-for-windows/), Git Bash (windows `command` or `powershell` can be normally used as well) and [Rider](https://www.jetbrains.com/rider/). It also consider you have no images in your docker installation.
- To check your docker images:
   ```bash
   $ docker images
   ```
- To remove one or more docker images:
   ```bash
   $ docker image rm <image_id_1> <image_id_2> <image_id_3> ... <image_id_n>
   ```
- To force remove any docker image:
   ```bash
   $ docker image rm --force <image_id>
   ```
- To check running containers:
   ```bash
   $ docker ps
   ```
- To remove one or more containers:
   ```bash
   $ docker container rm --force <image_id_1> <image_id_2> <image_id_3> ... <image_id_n>
   ```
**Note:** Any non named image in your set of images can be sucessfully deleted. Some of the scripts are creating unecessary copy of existing images.

## Setup and validate docker
Follow the [docker setup instructions](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/blob/master/docs/deployment/docker-setup.md)

## Preparing / Running images
### Building images
- You have to start with those [basic images needed for RTC](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/blob/master/docs/deployment/build-rtc-locally.md#docker-images):
    - Use the `prepare` script availabe in the `./ReactiveTraderCloud/deploy/docker` folder. Ex.: from the `./ReactiveTraderCloud` folder run:
    ```bash
    amq@DESKTOP-P3O36K8 MINGW64 /c/projects/ReactiveTraderCloud (develop)
    $ ./deploy/docker/prepare build crossbar <build_id>
    $ ./deploy/docker/prepare build dotnet <build_id>
    $ ./deploy/docker/prepare build nginx <build_id>
    $ ./deploy/docker/prepare build node <build_id>
    $ ./deploy/docker/prepare build rtc <build_id>
    $ ./deploy/docker/prepare build populatedEventstore <build_id>
    ```
    **Where:** *build_id* is any build_id name necessary to *tag* each docker image that will be created.    

    - After all that, you should have images like in the bellow example with images tagged as `artp`:
    ```bash
    amq@DESKTOP-P3O36K8 MINGW64 /c/projects/ReactiveTraderCloud (develop)
    $ docker images
    REPOSITORY                  TAG                 IMAGE ID            CREATED             SIZE
    reactivetrader/eventstore   0.0                 79ae92649b7c        18 hours ago        562MB
    reactivetrader/eventstore   0.0.artp            79ae92649b7c        18 hours ago        562MB
    reactivetrader/web          0.0                 4a25a3d45062        23 hours ago        138MB
    reactivetrader/web          0.0.artp            4a25a3d45062        23 hours ago        138MB
    reactivetrader/broker       0.0                 1701787ce681        23 hours ago        853MB
    reactivetrader/broker       0.0.artp            1701787ce681        23 hours ago        853MB
    reactivetrader/servers      0.1.artp            2516b1a9ad22        23 hours ago        1.61GB
    weareadaptive/serverssrc    artp                2516b1a9ad22        23 hours ago        1.61GB
    weareadaptive/nginx         1.12                e7e951eb7717        24 hours ago        107MB
    weareadaptive/nginx         1.12.artp           e7e951eb7717        24 hours ago        107MB
    weareadaptive/dotnet        2.0                 8495321b0034        24 hours ago        1.6GB
    weareadaptive/dotnet        2.0.artp            8495321b0034        24 hours ago        1.6GB
    weareadaptive/crossbar      17.5                0db7e7105392        24 hours ago        853MB
    weareadaptive/crossbar      17.5.artp           0db7e7105392        24 hours ago        853MB
    node                        8                   82c0936c46c1        3 weeks ago         670MB
    nginx                       1.12.0              313ec0a602bc        16 months ago       107MB
    weareadaptive/eventstore    0.0                 e2cbb26040c9        2 years ago         294MB
    ubuntu                      14.04.2             44ae5d2a191e        3 years ago         188MB
    ```
    **Note:** If you are missing any image, you can build those manually by running `build.sh` from within `./ReactiveTraderCloud/deploy/docker/build/<module_name>` as in the following example:
    ```bash
    amq@DESKTOP-P3O36K8 MINGW64 /c/projects/ReactiveTraderCloud (develop)
    $ ./deploy/docker/build/broker/build.sh artp
    ```

### Running all local images
- You will need to modify `./ReactiveTraderCloud/deploy/docker/runAll` script to include a *port* for the *brocker* image. You script should look like the following:
    ```
    #! /bin/bash
    
    build=$1
    if [[ "${1}" != "" ]]
    then build=".${build}"
    else build=""
    fi
    
    release="release"
    
    # fail fast
    set -euo pipefail
    
    # load configuration
    root_directory="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/../.."
    . ${root_directory}/deploy/config
    
    # create file
    cat <<EOF > ${docker_compose_file}
    version: '2'
    services:
        web:
            image: "${webContainer}${build}"
            command: "/web/start.sh"
            ports:
                - "80:80"
    
        broker:
            image: "${brokerContainer}${build}"
            ports:
                - "8000:8000"
    
        eventstore:
            image: "${populatedEventstoreContainer}${build}"
            ports:
                - "1113:1113"
                - "2113:2113"
    
        analytics:
            image: "${serversContainer}${build}"
            command: "dotnet run --configuration Release -p Adaptive.ReactiveTrader.Server.Analytics config.prod.json && while true; do echo ping; sleep 60; done"
            depends_on:
                - broker
                - eventstore
        pricing:
            image: "${serversContainer}${build}"
            command: "dotnet run --configuration Release -p Adaptive.ReactiveTrader.Server.Pricing config.prod.json && while true; do echo ping; sleep 60; done"
            depends_on:
                - broker
                - eventstore
                - analytics
        referencedataread:
            image: "${serversContainer}${build}"
            command: "dotnet run --configuration Release -p Adaptive.ReactiveTrader.Server.ReferenceDataRead config.prod.json && while true; do echo ping; sleep 60; done"
            depends_on:
                - broker
                - eventstore
                - pricing
        tradeexecution:
            image: "${serversContainer}${build}"
            command: "dotnet run --configuration Release -p Adaptive.ReactiveTrader.Server.TradeExecution config.prod.json && while true; do echo ping; sleep 60; done"
            depends_on:
                - broker
                - eventstore
                - referencedataread
        blotter:
            image: "${serversContainer}${build}"
            command: "dotnet run --configuration Release -p Adaptive.ReactiveTrader.Server.Blotter config.prod.json && while true; do echo ping; sleep 60; done"
            depends_on:
                - broker
                - eventstore
                - tradeexecution
    EOF
    
    # start containers
    docker-compose up
    ```
    **Note:** Please do not git push changes to the `runAll` script unless you know what you are doing.

- Once you have all required images as described in the previous [Building images](#building-images) step and your script modified, you are ready to run your local images. 
    ```bash
    ./deploy/docker/runAll <build_id>
    ```
    **Where:** *build_id* is the build_id name defined when building all needed images mentioned in the previous step.
- You will have [docker-compose](https://docs.docker.com/compose/) starting your containers and printing logs in your console.
**Note**: If you are running Linux you will need to install docker-compose if it wasn't done previously. Refer to the [docker official documentation](https://docs.docker.com/compose/install/).

### View RTC running
- In order to check RTC images are correctly *setup* and running, you can run the client web application. **Note** that you must have a `web` image that might not be running. If the `web` image by any chance is normally running you can directly access the web client using the url `http://localhost:3000`.    
    - In the `./ReactiveTraderCloud/src/client` folder you have to perform the `npm install` command to build the client, if you not yet have done so.
    ```bash
    amq@DESKTOP-P3O36K8 MINGW64 /c/projects/ReactiveTraderCloud/src/client (develop)
    $ npm install
    ```
    - And then you can run the client that will automatically open a tab in your browser, pointing to the url `http://localhost:3000`.
    ```bash
    amq@DESKTOP-P3O36K8 MINGW64 /c/projects/ReactiveTraderCloud/src/client (develop)
    $ npm run start:local
    ```
    ![RTC running locally](../docs/rtc_localhost.png?raw=true)
### Running / Debugging RTC
- If you have applied changes in RTC you can check those out by running / debugging *server modules* before rebuilding images. The easier way to so is by commenting those images you don't want to use leaving only those images that are really required by all server modules.   
    ```
    #! /bin/bash
    
    build=$1
    if [[ "${1}" != "" ]]
    then build=".${build}"
    else build=""
    fi
    
    release="release"
    
    # fail fast
    set -euo pipefail
    
    # load configuration
    root_directory="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/../.."
    . ${root_directory}/deploy/config
    
    # create file
    cat <<EOF > ${docker_compose_file}
    version: '2'
    services:
        # web:
        #     image: "${webContainer}${build}"
        #     command: "/web/start.sh"
        #     ports:
        #         - "80:80"
    
        broker:
            image: "${brokerContainer}${build}"
            ports:
                - "8000:8000"
    
        eventstore:
            image: "${populatedEventstoreContainer}${build}"
            ports:
                - "1113:1113"
                - "2113:2113"
    
        # analytics:
        #     image: "${serversContainer}${build}"
        #     command: "dotnet run --configuration Release -p Adaptive.ReactiveTrader.Server.Analytics config.prod.json && while true; do echo ping; sleep 60; done"
        #     depends_on:
        #         - broker
        #         - eventstore
        # pricing:
        #     image: "${serversContainer}${build}"
        #     command: "dotnet run --configuration Release -p Adaptive.ReactiveTrader.Server.Pricing config.prod.json && while true; do echo ping; sleep 60; done"
        #     depends_on:
        #         - broker
        #         - eventstore
        #         - analytics
        # referencedataread:
        #     image: "${serversContainer}${build}"
        #     command: "dotnet run --configuration Release -p Adaptive.ReactiveTrader.Server.ReferenceDataRead config.prod.json && while true; do echo ping; sleep 60; done"
        #     depends_on:
        #         - broker
        #         - eventstore
        #         - pricing
        # tradeexecution:
        #     image: "${serversContainer}${build}"
        #     command: "dotnet run --configuration Release -p Adaptive.ReactiveTrader.Server.TradeExecution config.prod.json && while true; do echo ping; sleep 60; done"
        #     depends_on:
        #         - broker
        #         - eventstore
        #         - referencedataread
        # blotter:
        #     image: "${serversContainer}${build}"
        #     command: "dotnet run --configuration Release -p Adaptive.ReactiveTrader.Server.Blotter config.prod.json && while true; do echo ping; sleep 60; done"
        #     depends_on:
        #         - broker
        #         - eventstore
        #         - tradeexecution
    EOF
    
    # start containers
    docker-compose up
    ```
    - And then you can run modules from `command line` or run/debug inside `Rider`. The following show the setup of a module execution inside `Rider`. You must do the same for all modules that will be manually executed.
    ![Rider module setup](../docs/rtc_rider_setup.png?raw=true) 
    
    **Note:** Please do not git push changes to the `runAll` script unless you know what you are doing.

## Stop all the running containers
You can stop all the containers by hitting ctrl+c on the runAll process or by running:
```bash
./deploy/docker/killAll
```
