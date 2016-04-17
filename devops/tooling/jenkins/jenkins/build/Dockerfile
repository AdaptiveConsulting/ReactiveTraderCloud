FROM        jenkins:1.625.3

# DOCKER
USER        root
RUN         apt-get update
RUN         apt-get install wget -y
RUN         wget -O /usr/bin/docker https://get.docker.com/builds/Linux/x86_64/docker-latest
RUN         chmod 755 /usr/bin/docker

# JENKINS PLUGINS
COPY        plugins.txt /usr/share/jenkins/plugins.txt
RUN         /usr/local/bin/plugins.sh /usr/share/jenkins/plugins.txt

# RUN
WORKDIR     /var/jenkins_home
ENTRYPOINT  ["/bin/tini", "--", "/usr/local/bin/jenkins.sh"]
