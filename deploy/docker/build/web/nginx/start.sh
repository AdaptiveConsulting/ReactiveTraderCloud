#! /bin/bash

if [[ ${1} == "local" ]]
then cp /localhost/nginx.conf /etc/nginx/nginx.conf
fi

nginx -g 'daemon off;'
