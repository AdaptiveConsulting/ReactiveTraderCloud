#!/bin/bash

# script to run on a VM in order to install docker 
#   and run jenkins and an nginx.
# Note: the script as not been run directly 
#   but is constructed on the command done on the server
# To Run:
#   - ssh in machine
#   - copy the content of the file
#   - cat <<EOF > /tmp/install.sh
#   - (coller)
#   - ctrl+c
#   - chmod 755 /tmp/install.sh
#   - cd /tmp
#   - sudo ./install.sh

# fail fast
set -euo pipefail

# INSTALL DOCKER
#============================
sudo apt-get purge lxc-docker* || true
sudo apt-get purge docker.io*  || true
sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates
apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 \
   --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
echo "deb https://apt.dockerproject.org/repo debian-jessie main" > /tmp/docker.list
sudo cp /tmp/docker.list /etc/apt/sources.list.d/docker.list
rm /tmp/docker.list
sudo apt-get update
sudo apt-get install -y docker-engine
sudo systemctl start docker
sudo systemctl enable docker
sudo gpasswd -a ${USER} docker

# COPY FILES
mkdir -p /home/${USER}/installation/jenkins
mkdir -p /home/${USER}/installation/nginx

# JENKINS
#============================
cat <<EOF > /home/${USER}/installation/jenkins/jenkins.service
[Unit]
Description=jenkins
Requires=docker.service
After=docker.service

[Service]
Restart=always
ExecStart=/usr/bin/docker run \
  -p 9000:8080 \
  -v jenkins_home_cache:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  tdeheurles/jenkins:latest

[Install]
WantedBy=multi-user.target
EOF

# NGINX
#===========================
cat <<EOF > /home/${USER}/installation/nginx/nginx.service
[Unit]
Description=nginx
Requires=docker.service
After=docker.service

[Service]
Restart=always
ExecStart=/usr/bin/docker run \
  --net=host \
  jenkins-nginx

[Install]
WantedBy=multi-user.target
EOF

#===========================
cat <<EOF > /home/${USER}/installation/nginx/Dockerfile
FROM nginx
COPY nginx.conf /etc/nginx/nginx.conf

RUN mkdir -p /etc/ssl
COPY server.pem /etc/ssl/server.pem
COPY server.key /etc/ssl/server.key

CMD ["nginx", "-g", "daemon off;"]
EOF

#===========================
cat <<EOF > /home/${USER}/installation/nginx/nginx.conf
worker_processes  1;

pid  /var/run/nginx.pid;

events {
    worker_connections  1024;
}

http {
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    include         /etc/nginx/mime.types;
    sendfile        on;
    default_type    application/octet-stream;

    server_names_hash_bucket_size   128;

    server {
        listen      443;
        
        ssl                    on;
        ssl_certificate        /etc/ssl/server.pem;
        ssl_certificate_key    /etc/ssl/server.key;
        
        location / {
            proxy_set_header        Host              \$host;
            proxy_set_header        X-Real-IP         \$remote_addr;
            proxy_set_header        X-Forwarded-Proto \$scheme;
            proxy_set_header        X-Forwarded-For   \$proxy_add_x_forwarded_for;
            
            proxy_pass http://localhost:9000;
        }
    }
}
EOF

#============================
cat <<EOF > /home/${USER}/installation/nginx/build.sh
#!/bin/bash

docker build --no-cache -t jenkins-nginx .
EOF

#===========================
cat <<EOF > /home/${USER}/installation/nginx/generateCertificates.sh
#! /bin/bash

set -euo pipefail

if [[ \$# != 1 ]];then
  echo "usage:"
  echo "  \$0 DOMAIN_NAME"
  exit 1
fi
domainName=\$1

openssl=\$(which openssl)
if [[ \$? == 1 ]];then
  echo "openssl is needed, exiting"
  echo " "
  exit 1
fi

key="server.key"
csr="server.csr"
crt="server.crt"
pem="server.pem"

openssl genrsa -out \$key 2048
openssl rsa -in \$key -out \$key
openssl req -sha256 -new -key \$key -out \$csr -subj "//CN=\$domainName"
openssl x509 -req -days 365 -in \$csr -signkey \$key -out \$crt
cat \$crt \$key > \$pem
EOF

# BUILD
#============================
sudo chmod 755 /home/${USER}/installation/nginx/build.sh
sudo chmod 755 /home/${USER}/installation/nginx/generateCertificates.sh

cd /home/${USER}/installation/nginx
sudo ./generateCertificates.sh doesntmatter
sudo ./build.sh

sudo cp /home/${USER}/installation/jenkins/jenkins.service /etc/systemd/system/
sudo cp /home/${USER}/installation/nginx/nginx.service     /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable jenkins
sudo systemctl enable nginx
sudo systemctl stop jenkins || true
sudo systemctl stop nginx   || true
sudo systemctl start jenkins
sudo systemctl start nginx

# INSTALL COMMON TOOLS
#===========================
sudo apt-get install -y git zsh
sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
cat <<EOF >> ~/.bashrc

zsh
EOF
