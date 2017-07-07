FROM        __UBUNTU_CONTAINER__
MAINTAINER 	weareadaptive <thibault@weareadaptive.com>

# prerequisite
RUN sudo apt-get update
RUN sudo apt-get -y dist-upgrade
RUN sudo apt-get -y install build-essential libssl-dev libffi-dev \
   libreadline-dev libbz2-dev libsqlite3-dev libncurses5-dev wget

# python
WORKDIR /root
RUN wget https://www.python.org/ftp/python/2.7.13/Python-2.7.13.tar.xz
RUN tar xvf Python-2.7.13.tar.xz
WORKDIR Python-2.7.13
RUN ./configure --prefix=/root/python2713
RUN make
RUN make install

# pip
RUN /root/python2713/bin/python -m ensurepip
RUN /root/python2713/bin/python -m pip install -U pip

# crossbar
RUN /root/python2713/bin/pip install crossbar==__CROSSBAR_VERSION__
ENV PATH $PATH:/root/python2713/bin

# prepare as base image
WORKDIR /server
CMD /bin/bash
