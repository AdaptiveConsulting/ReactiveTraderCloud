FROM ubuntu:__VUBUNTU__

COPY install.sh /prog/install.sh
RUN  /prog/install.sh

