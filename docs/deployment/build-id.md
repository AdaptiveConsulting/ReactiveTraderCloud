# Understand: Build ids

- [Understand: Build ids](#understand-build-ids)
    - [Defined build ids](#defined-build-ids)
        - [CircleCi](#circleci)
        - [Local](#local)

We use a build id to define versions for *Reactive Trader Cloud*. This *build id* is a string. It could be a number or a keyword. The *build id* is first used when we *build* to name the Reactive Trader Cloud docker images. It then can be used to run or deploy that specific Reactive Trader Cloud version.

## Defined build ids
### CircleCi
When [circle ci][circleci] runs a build, it generates docker images and uses the *circle ci build number* as the *build id*. Then on specific branches like *master*, CircleCi pushes the docker images to [docker hub][dockerhub]

### Local
When you [build RTC locally][local-build], you have to define yourself the *build id*. It's just a string, so it can be *0*, *local* or *mylocalbuild*. It doesn't really matter as far as it continues to be local. If you want to push to [docker hub][dockerhub], you will have to choose something different than a *number* as they could be already used by RTC [pipeline with circleci][circleci].  
- *ie: **issues599build0***

[dockerhub]: https://store.docker.com/profiles/reactivetrader/
[circleci]: ./circleci.md
[local-build]: ./build-rtc-locally.md
