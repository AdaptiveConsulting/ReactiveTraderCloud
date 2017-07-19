FROM        __UBUNTU_CONTAINER__
MAINTAINER 	weareadaptive <thibault@weareadaptive.com>

COPY        install.sh /install/install.sh
RUN         /install/install.sh

ENV         PATH   $PATH:/opt/crossbar/bin

WORKDIR     /server
CMD         /bin/bash
