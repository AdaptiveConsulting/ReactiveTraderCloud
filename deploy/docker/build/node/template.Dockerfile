FROM          ubuntu:__VUBUNTU__
MAINTAINER 	  weareadaptive <thibault@weareadaptive.com>

COPY    install.sh /install/install.sh
RUN     /install/install.sh

ENV     PATH   $PATH:/node/bin

CMD     /bin/sh
