FROM        __CROSSBAR_CONTAINER__
MAINTAINER 	weareadaptive <thibault@weareadaptive.com>

COPY        .crossbar  /server/.crossbar

WORKDIR     /server
CMD         crossbar start
