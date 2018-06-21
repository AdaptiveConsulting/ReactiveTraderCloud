#!/bin/bash

mkdir ~/.npm-global

npm config set prefix '~/.npm-global'

echo "" >> ~/.profile
echo "export PATH=~/.npm-global/bin:$PATH" >> ~/.profile

source ~/.profile
