#!/bin/bash

sleep 30

sudo apt-get update
sudo apt upgrade -y

# Install MariaDB server
#sudo apt install mariadb-server -y
# Start the MariaDB service
#sudo systemctl start mariadb
# Change the root password to 'root'
#sudo mysql -u root -e "CREATE DATABASE 'webapp';"

#sudo mysql -u root -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'root';"

# Install MariaDB server
#sudo apt install mariadb-server -y
# Start the MariaDB service
#sudo systemctl start mariadb
# Change the root password to 'root'

#sudo mysql -u root -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'root';"

# Install MariaDB server
#sudo apt install mariadb-server -y
# Start the MariaDB service
#sudo systemctl start mariadb
# Change the root password to 'root'
#sudo mysql -u root -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'root';"
#sudo mysql -u root -p='root' -e "CREATE DATABASE webapp;"

# Installing node server
sudo apt install -y nodejs npm
# Installing unzip
sudo apt install -y unzip

cd /opt
unzip webapp.zip
rm webapp.zip
cd webapp
mv user.csv /opt/webapp

rm -rf node_modules
rm package-lock.json
npm install

sudo apt-get remove --purge -y git



