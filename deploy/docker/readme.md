# docker

You will find here:
- `build`: the src to generate the base container for the project
  - `gcloud`: container used to manage creation of googleCloudEngine cluster
  - `mono.net`: container that ship with mono and kestrel
- `run`: the src to run the test in a container

### Install docker on windows/mac:

- go to [toolbox download page](https://www.docker.com/docker-toolbox) and click on your OS (version 1.9.1c on writing moment)
- install
- select virtualbox/docker, kitematic is optional
- then launch `Docker Quickstart Terminal`
- run `docker ps` and control that it match the following
```
$ docker ps
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS

```

### Docker Quickstart Terminal tips

- go to `properties` (click on left top corner -> Properties)
- Check `QuickEdit Mode` and `Insert Mode`, 
- go to `layout` and enlarge width to you convenience 
- `copy`: select a zone with the mouse and right click
- `paste`: press `insert` or `right click` under a container
- `.bashrc` file is named `.bash_profile` and need to be placed in your user folder
- you can create file starting with dot like this: `.bash_profile.` will create `.bash_profile`
