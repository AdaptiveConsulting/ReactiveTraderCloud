FROM          <% os %>
MAINTAINER 	  <% maintainer %>

COPY          install.sh /install/install.sh
RUN           /install/install.sh

ENV           PATH   $PATH:/node/bin

CMD           /bin/sh
