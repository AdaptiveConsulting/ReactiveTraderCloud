FROM        __FROM_CONTAINER__
MAINTAINER  weareadaptive <evan@weareadaptive.com>

COPY        corporate_bonds               /corporate_bonds

RUN         mkdir -p                      /custom
RUN         cp -r /corporate_bonds/custom /custom
RUN         cp -r /corporate_bonds        /custom

CMD         ["sleep","3600"]
