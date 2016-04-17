FROM        jenkins:1.625.3

# DOCKER
# Install docker binary (instead of sharing the binary from the kubernetes node)
# The container will still use the docker daemon from the node
# Docker is 1.11 at this moment but the kubernetes cluster use docker 1.9.
USER        root
RUN         apt-get update
RUN         apt-get install wget -y
RUN         wget -O /usr/bin/docker https://get.docker.com/builds/Linux/x86_64/docker-1.9.1
RUN         chmod 755 /usr/bin/docker

# JENKINS PLUGINS
# The jenkins plugins can be defined in the plugins.txt file
COPY        plugins.txt /usr/share/jenkins/plugins.txt
RUN         /usr/local/bin/plugins.sh /usr/share/jenkins/plugins.txt

# RUN
WORKDIR     /var/jenkins_home
ENTRYPOINT  ["/bin/tini", "--", "/usr/local/bin/jenkins.sh"]
