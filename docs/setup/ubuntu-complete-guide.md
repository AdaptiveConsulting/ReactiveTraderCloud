# Build and Run Reactive Trader CLoud on Ubuntu 

## dependencies

#### get Ubuntu up to date

```bash
sudo apt-get update 
sudo apt-get upgrade -y 
```

#### docker

```bash
# install docker
sudo apt-get install docker-engine

# add user to docker group
sudo gpasswd -a ${USER} docker

# activate it
sudo service docker start

# logout
sudo reboot
gnome-session-quit
pkill -u $USER
```

#### git

```bash
sudo apt-get install git -y
```

## clone

Here we copy the source code to `/home/${USER}/repository/reactivetradercloud`

```bash
mkdir ~/repository
cd ~/repository
git clone https://github.com/adaptiveconsulting/reactivetradercloud
cd reactivetradercloud
```

## then

You can now go back to the [main docker guide]() and follow from the e2e chapter.