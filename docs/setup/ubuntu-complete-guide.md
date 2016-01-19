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
sudo apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D

packageFile=/etc/apt/sources.list.d/docker.list
if [[ -f packageFile ]];then
  cp $packageFile /tmp/packageFile
fi

echo "deb https://apt.dockerproject.org/repo ubuntu-trusty main" >> /tmp/packageFile
sudo cp /tmp/packageFile /etc/apt/sources.list.d/docker.list 
sudo apt-get update
sudo apt-get install docker-engine -y
sudo apt-get install linux-image-extra-$(uname -r)

# add user to docker group
sudo gpasswd -a ${USER} docker

# activate it
sudo service docker start

# logout
gnome-session-quit
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

You can now go back to the [main docker guide](docker-setup.md#e2e) and follow from the e2e chapter.
