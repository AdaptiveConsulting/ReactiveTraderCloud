FROM       <% os %>
MAINTAINER <% maintainer %>

COPY       install.sh   /install/install.sh
RUN        /install/install.sh

WORKDIR    /opt/EventStore-OSS-Ubuntu-v<% base.eventstore.official_version %>

CMD        ./run-node.sh            \
             --db /eventstore/db    \
             --log /eventstore/logs \
             --ext-tcp-port=1113    \
             --ext-http-port=2113   \
             --ext-ip=0.0.0.0
