FROM          ubuntu:14.04.2
MAINTAINER 	  weareadaptive <thibault@weareadaptive.com>
# Instructions from https://docs.asp.net/en/latest/getting-started/installing-on-linux.html

COPY    install.sh /install/install.sh
RUN     /install/install.sh

CMD    /bin/bash
