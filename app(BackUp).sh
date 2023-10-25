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

# Installing node server
sudo apt install -y nodejs npm
# Installing unzip
sudo apt install -y unzip

sudo groupadd csye6225
sudo useradd -s /bin/false -g csye6225 -d /opt/csye6225 -m csye6225
sudo chown -R csye6225:csye6225 /opt/webapp

cd /opt
unzip webapp.zip
rm webapp.zip
cd webapp
mv user.csv /opt/webapp

rm -rf node_modules
rm package-lock.json
npm install mariadb
npm install

sudo apt-get remove --purge -y git

# Starting the service
sudo sh -c "echo '[Unit]
Description=My NPM Service
Requires=cloud-init.target
After=cloud-final.service
ConditionPathExists=/opt/webapp
 
[Service]
EnvironmentFile=/etc/environment
Type=simple
User=csye6225
WorkingDirectory=/opt/webapp
ExecStart=/opt/webapp/npm run start
Restart=always
RestartSec=10
 
[Install]
WantedBy=cloud-init.target' | sudo tee /etc/systemd/system/webapp.service"

 
sudo systemctl daemon-reload
sudo systemctl enable webapp
sudo systemctl start webapp
sudo systemctl status webapp

 



