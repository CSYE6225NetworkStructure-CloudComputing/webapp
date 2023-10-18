#!/bin/bash

sleep 30

sudo apt-get update
sudo apt upgrade -y

# Installing mySQL
echo_info "INSTALLING-DB"
sudo apt install mariadb-server
# sudo mysql_secure_installation
sudo systemctl start mariadb
sudo mysqladmin -u root password 'root'
sudo -u CREATE DATABASE webapp;


# - Set root password? [Y/n] y
# - Remove anonymous users? [Y/n] y
# - Disallow root login remotely? [Y/n] n
# - Remove test database and access to it? [Y/n] y
# - Reload privilege tables now? [Y/n] y
# Switch to unix_socket authentication [Y/n] y
# Change the root password? [Y/n] n
# Remove anonymous users? [Y/n] y
# Disallow root login remotely? [Y/n] n
# Remove test database and access to it? [Y/n] n
# Reload privilege tables now? [Y/n] y




# Installing node server
echo_info "INSTALLING-NODEJS"
sudo apt install -y nodejs npm

# Installing unzip
echo_info "INSTALLING-UNZIP"
sudo apt install -y unzip

cd /opt
unzip webapp.zip
rm webapp.zip
cd webapp
mv users.csv /opt/
npm i

rm -rf node_modules
rm package-lock.json
npm install



