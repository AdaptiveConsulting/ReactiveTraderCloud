FROM        weareadaptive/node

MAINTAINER  weareadaptive <thibault@weareadaptive.com>

COPY        client    /client

WORKDIR     /client/
RUN         npm install
RUN         npm run compile
#RUN         npm test
