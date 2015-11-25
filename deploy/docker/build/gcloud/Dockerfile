#FROM            alpine:3.2
#FROM            ubuntu:14.04.2
FROM            debian:8.2 
MAINTAINER 	    weareadaptive <thibault@weareadaptive.com>

COPY    install.sh    /opt/install.sh
RUN     /opt/install.sh

ENV     PATH    /root/google-cloud-sdk/bin:$PATH        
CMD     /bin/sh
