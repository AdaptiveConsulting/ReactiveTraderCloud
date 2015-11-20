#FROM        weareadaptive/node
FROM        node:5
MAINTAINER  weareadaptive <thibault@weareadaptive.com>

#RUN         apk add --update git

COPY        client    /client

WORKDIR     /client/
RUN         npm install
RUN         npm test
