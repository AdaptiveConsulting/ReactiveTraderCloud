FROM          ubuntu:__VUBUNTU__
MAINTAINER 	  weareadaptive <thibault@weareadaptive.com>

COPY    install.sh /install/install.sh
RUN     /install/install.sh

CMD    /bin/bash
