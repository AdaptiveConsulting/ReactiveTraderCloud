FROM        <% container.official.jenkins %>
MAINTAINER  weareadaptive <thibault@weareadaptive.com>

USER jenkins
COPY plugins.txt /usr/share/jenkins/plugins.txt
RUN /usr/local/bin/plugins.sh /usr/share/jenkins/plugins.txt

USER root

# gosu
RUN gpg --keyserver pool.sks-keyservers.net --recv-keys B42F6819007F00F88E364FD4036A9C25BF357DD4 \
  && curl -sSL -o /usr/local/bin/gosu "https://github.com/tianon/gosu/releases/download/1.2/gosu-$(dpkg --print-architecture)" \
  && curl -sSL -o /usr/local/bin/gosu.asc "https://github.com/tianon/gosu/releases/download/1.2/gosu-$(dpkg --print-architecture).asc" \
  && gpg --verify /usr/local/bin/gosu.asc \
  && rm /usr/local/bin/gosu.asc \
  && chmod +x /usr/local/bin/gosu

RUN groupdel ssh
RUN groupadd -g 107 docker 
RUN usermod -a -G docker jenkins 

COPY volume-permissions.sh /usr/local/bin/volume-permissions.sh
ENTRYPOINT ["/bin/tini", "--", "/usr/local/bin/volume-permissions.sh"]