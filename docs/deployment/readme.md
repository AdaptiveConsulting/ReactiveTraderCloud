# Deployment

We practice _Continous Delivery_. Every merge to master triggers a build and publishing of the application's images.
The commit will be tagged with the latest version, the published docker images will be similarly tagged with the same version, and there will  be a version number published in the application's UI. The new version will be automatically deployed to the [`dev`](https://web-dev.adaptivecluster.com/) environment.

## Versioning

When [`git describe`](https://git-scm.com/docs/git-describe) is invoked on a commit with a tag, it will generate a descriptor matching that tag, e.g. if the current HEAD is tagged `v1.1.0`, that is what the descriptor will also be.

If the current commit is ahead of the most recent tag, a descriptor of the form `<tag>-<count>-<hash>` will be produced, e.g. `v1.1.0-9-g87eecd82`, which is 9 commits ahead of tag `v1.1.0`, at the abbreviated commit hash `g87eecd82`.

We can use this feature very effectively for versioning releases. Once a particular release is ready, we can tag
the code with the version (e.g. `v1.1.1` or `v1.2.0-rc`) and our release will be versioned to match. If we do a build not referencing a particular tag, it will be expressed in relation to the most recent one, which is accurate, since it is effectively an interrim build.

## Environments

To deploy a version into a specific environment, create a [lightweight tag](https://git-scm.com/book/en/v2/Git-Basics-Tagging) at the commit the version with `env-<environment_name>` e.g. for `env-demo`:

```bash
# Create a new lightweight tag at the current HEAD (the force option will overwrite the tag if it exists)
git tag -f env-demo

# You can also tag a specific release tag to push to an environment 
git tag -f env-demo v1.1.0

# push the updated tag
git push origin :env-demo
```

Note: We use lightweight tags for environments, as they are ignored by default when using `git describe`.

Currently supported environments are `env-uat` and `env-demo`.

## Patching

There are times when an existing version will need a bug fix.
A new branch should be taken from the version to patch:

```bash
git checkout -b release/1.1 1.1.0
git push origin release/1.1
```

Then your fix PR should target this `release/1.1` branch.

If the bug also exists in another environment, it will be expected that either more PRs should be raised to other environments (and master), `cherry-pick`ing the fix commit. Or, if there has been little code change, it may be possible to merge the `release/1.1` branch into master, but be careful with this approach.

Patches are not automatically deployed at this stage, so this will have to be done by manually creating the `env-<environment_name>` tag.

## How to
- Manage Environments
    - Build and/or run RTC locally
        - with docker (the simpler way)
            1) [Optional] Follow the [install and run docker instructions](./docker-setup.md)
            1) Follow the [run rtc with docker instructions](./run-rtc-with-docker.md)
        - without docker
            1) [server](../server.md)
            2) [client](../client.md)
    - See your code deployed to an emvironment in cloud
        1) Follow the [build with circleci instructions](./circleci.md)
        1) Follow the [gcloud instructions](./gcloud.md)
    - See the [logs of an environment](./logs.md)
- Environment Infrastructure
    - [Deploy the kubernetes cluster on glcoud](./gcloud.md#Deploy-a-kubernetes-cluster-on-gcloud)
    - [Update cluster version](./gcloud.md#Update-cluster-instance-version)
- Understand Concepts
    - [Understand Nsgate, our gcloud cluster front loadbalancer](./nsgate.md)
- Set Up
    - [Setup your bash client](./bash-setup.md)
    - [Setup docker](./docker-setup.md)
