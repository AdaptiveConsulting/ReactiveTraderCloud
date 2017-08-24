FROM            __DEBIAN_CONTAINER__
MAINTAINER 	    weareadaptive <thibault@weareadaptive.com>

COPY    install.sh    /opt/install.sh
RUN     /opt/install.sh

ENV     PATH    /root/google-cloud-sdk/bin:$PATH        
CMD     /bin/sh
