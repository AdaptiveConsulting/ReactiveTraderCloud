# Docker Issues

You will find here some of the common issues we have had with docker.

# LINUX
### UBUNTU
Docker can complain of not having `permissions`. So the first reflex is to run everything as `sudo` but the real reason is that you need to be in the docker group in order to run docker commands.

To achieve that, just run
- `$ sudo gpasswd -a ${USER} docker`
- logout and login

# MAC

### The repository must be in user's home folder

The different scripts here will need to share code with the different containers. On Windows and Mac, the sharing is between the container and the virtual machine. The virtual machine is defined to share your home folder (c:\Users\ for windows or /Users for mac). If your git clone folder is a child folder of your home user, this is fine. Otherwise you need to open VirtualBox and share that specific folder.

### no space left on device
```
Error pulling image (0.0) from docker.io/reactivetrader/servers, 
endpoint: https://registry-1.docker.io/v1/, 
Untar re-exec error: 
exit status 1: 
output: 
write /usr/share/mime/packages/freedesktop.org.xml: 
no space left on device
```

try to stop and restart the docker virtual machine:
```bash
docker-machine stop default
docker-machine start default
```
Then close the `Docker Quick Start Terminal` and open a new once.

If the issue persists, try to remove the virtual machine and generate a new one:  
- open virtualbox Gui
- right click on the `default` machine and remove it with all its files
- close virtualbox Gui
- open a new docker Quick Start Terminal
- wait for the new VirtualMachine to be generated

# WINDOWS

### The repository must be in user's home folder

The different scripts here will need to share code with the different containers. On Windows and Mac, the sharing is between the container and the virtual machine. The virtual machine is defined to share your home folder (c:\Users\ for windows or /Users for mac). If your git clone folder is a child folder of your home user, this is fine. Otherwise you need to open VirtualBox and share that specific folder.

### docker toolbox version

The version `1.9.1h` have an issue and does not work with this project.
You should [install](https://github.com/docker/toolbox/releases) version `1.9.1g`

Version from `1.9.1i` have not been tested.
