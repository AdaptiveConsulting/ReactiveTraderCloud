# Understand: Build ids

- [Understand: Build ids](#understand-build-ids)
  - [Defined build ids](#defined-build-ids)
    - [CircleCi](#circleci)
    - [Local](#local)

We use a build id to define versions for _Reactive Trader Cloud_. This _build id_ is a string. It could be a number or a keyword. The _build id_ is first used when we _build_ to name the Reactive Trader Cloud docker images. It then can be used to run or deploy that specific Reactive Trader Cloud version.

## Defined build ids

### CircleCi

When [circle ci][circleci] runs a build, it generates docker images and uses the _circle ci build number_ as the _build id_. Then on specific branches like _master_, CircleCi pushes the docker images to [docker hub][dockerhub]

### Local

When you [build RTC locally][local-build], you have to define yourself the _build id_. It's just a string, so it can be _0_, _local_ or _mylocalbuild_. It doesn't really matter as far as it continues to be local. If you want to push to [docker hub][dockerhub], you will have to choose something different than a _number_ as they could be already used by RTC [pipeline with circleci][circleci].

- \*ie: **issues599build0\***

[dockerhub]: https://hub.docker.com/u/reactivetradercloud/
[circleci]: ./circleci.md
[local-build]: ./build-rtc-locally.md
