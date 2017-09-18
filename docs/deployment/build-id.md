# Understand: Build ids

We use a build id to define versions for *Reactive Trader Cloud*. This *build id* is a string. It could be a number or a keyword. The *build id* is first used when we *build* to name the docker images. It then can be used to run or deploy that specific reactive trader cloud version.

## Defined build ids
### CircleCi
When [circle ci][circleci] runs a build, it generates docker images and uses the *circle ci build number* as the *build id*. Then on specific branches like *master*, CircleCi push the docker images to [docker hub][dockerhub]

### Local
When you [build rtc locally](./build-rtc-locally.md), you have to define yourself the *build id*. It's just a string, so it can be *0*, *local* or *mylocalbuild*. It doesn't really matter as far as it continues to be local. If you want to push to [docker hub][dockerhub], you will have to choose something different than a *number* as they could be already used by rtc [pipeline with circleci][circleci]

[dockerhub]: https://hub.docker.com/u/reactivetrader/dashboard/
[circleci]: ./circleci.md
