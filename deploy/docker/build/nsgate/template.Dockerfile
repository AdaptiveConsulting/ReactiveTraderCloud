FROM        weareadaptive/nginx:__VNGINX__
MAINTAINER  weareadaptive <thibault@weareadaptive.com>

COPY        updateServers.sh   /opt/updateServers.sh
COPY        writeFunctions.sh  /opt/writeFunctions.sh

COPY        install.sh /tmp/
RUN         tmp/install.sh

COPY        nginx.conf /etc/nginx/nginx.conf

COPY        bootstrap.sh /opt/
CMD         /opt/bootstrap.sh
