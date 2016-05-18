FROM          <% os %>
MAINTAINER 	  <% maintainer %>

COPY    install.sh /install/install.sh
RUN     /install/install.sh

CMD    /bin/bash
