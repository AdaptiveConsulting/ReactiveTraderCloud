FROM        node:5
MAINTAINER  weareadaptive <thibault@weareadaptive.com>

RUN        apt-get update
RUN        apt-get install -y python \
                              git

COPY        client    /client

WORKDIR     /client/
RUN         npm install
RUN         npm run compile
#RUN         npm test
