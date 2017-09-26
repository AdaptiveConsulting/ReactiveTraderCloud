# You want to: use CI server to build RTC

- [You want to: use CI server to build RTC](#you-want-to-use-ci-server-to-build-rtc)
        - [1 - Ignored branches](#1---ignored-branches)
        - [2 - Build dependencies](#2---build-dependencies)
        - [3 - Cache between builds](#3---cache-between-builds)
        - [4 - Build steps](#4---build-steps)
        - [5 - Validation steps](#5---validation-steps)
        - [6 - Deployment](#6---deployment)
        - [7 - Build number](#7---build-number)

CircleCi read it's configuration in the circle.yml file defined at the ReactiveTraderCloud root directory.

Here is the file:

```yaml
general:
  branches:
    ignore: # (1)
        [...]

machine:
    services: # (2) build dependencies
        [...]

dependencies:
    cache_directories: # (3) cache between builds
        [...]

    override: # (4) build steps
        [...]

test:
    override: # (5) validation steps
        [...]

deployment:
    hub: # (6) deployment
        [...]
```

### 1 - Ignored branches
This let use ignore some branches.  
For now only documentation is skipped

### 2 - Build dependencies
We only have a dependency to docker at the moment

### 3 - Cache between builds
There is 2 states that circleci use to build RTC:
- base images downloaded from [hub.docker][docker-hub] if newer
- base images saved in a tar between builds (usefull only if build use same base images as previous build)

This section define the cache between the builds

### 4 - Build steps
This defines the procedure that we have to build RTC:
- load base images: "dotnet" "crossbar" "eventstore" "nginx"
- build new RTC docker images
- run the containers from images freshly built
- put the base images in a tar for cache

### 5 - Validation steps
Here we have simple basic tests:
- a curl to validate eventstore is running
- a test container plugged on RTC that do a smoke test

### 6 - Deployment
Finally, on git branches defined in this list, we push the RTC images to [hub.docker][docker-hub] to let us do a deployment.  
You can add your branch in this list to be able to do a deployment of your code. Note that only the merge are taken in account and a PR won't have its images pushed.  

### 7 - Build number
CircleCi build RTC and use its build number to tag all docker images.  
This build number is the one that you need to use for deployments

[docker-hub]: https://store.docker.com/profiles/reactivetrader/
