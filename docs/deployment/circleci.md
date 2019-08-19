# Use CI server to build RTC

- [Ignored branches](#ignored-branches)
- [Build dependencies](#build-dependencies)
- [Cache between builds](#cache-between-builds)
- [Build steps](#build-steps)
- [Validation steps](#validation-steps)
- [Deployment](#deployment)
- [Build number](#build-number)

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

### Ignored branches
This allows us to ignore some branches.  
For now only documentation is skipped

### Build dependencies
We only have a dependency on docker at the moment

### Cache between builds
There is 2 states that circleci use to build RTC:
- base images downloaded from [hub.docker][dockerhub] if newer
- base images saved in a tar between builds (usefull only if build use same base images as previous build)

This section define the cache between the builds

### Build steps
This defines the procedure that we have to build RTC:
- load base images: "dotnet" "crossbar" "eventstore" "nginx"
- build new RTC docker images
- run the containers from images freshly built
- put the base images in a tar for cache

### Validation steps
Here we have simple basic tests:
- a curl to validate eventstore is running
- a test container plugged on RTC that do a smoke test

### Deployment
Finally, on git branches defined in this list, we push the RTC images to [hub.docker][dockerhub] to let us do a deployment.  
You can add your branch in this list to be able to do a deployment of your code. Note that only the merge are taken in account and a PR won't have its images pushed.  

### Build number
CircleCi build RTC and use its build number to tag all docker images.  
This build number is the one that you need to use for deployments

[dockerhub]: https://hub.docker.com/u/reactivetradercloud/
