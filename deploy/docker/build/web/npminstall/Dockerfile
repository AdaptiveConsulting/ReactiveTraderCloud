FROM        __NODE_CONTAINER__
MAINTAINER  weareadaptive <thibault@weareadaptive.com>

COPY        client /client

COPY        npminstall.sh /opt/npminstall.sh
RUN         chmod 755 /opt/npminstall.sh
WORKDIR     /opt
CMD         ./npminstall.sh
