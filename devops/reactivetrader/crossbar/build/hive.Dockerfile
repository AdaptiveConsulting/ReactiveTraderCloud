FROM        <% os %>
MAINTAINER 	<% maintainer %>

COPY        install.sh /install/install.sh
RUN         /install/install.sh

ENV         PATH   $PATH:/opt/crossbar/bin

WORKDIR     /server
CMD         /bin/bash
