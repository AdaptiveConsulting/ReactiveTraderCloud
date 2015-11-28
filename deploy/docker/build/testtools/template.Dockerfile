FROM            ubuntu:__VUBUNTU__
MAINTAINER 	    weareadaptive <thibault@weareadaptive.com>

RUN     apt-get update && apt-get install curl -y

CMD     curl
