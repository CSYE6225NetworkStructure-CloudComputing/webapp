#!/bin/bash

# Sleep for a while (e.g., 30 seconds) to ensure other services are ready
sleep 30

# Update and upgrade packages
sudo apt-get update
sudo apt-get upgrade -y

# Download and install the CloudWatch Agent
#sudo wget https://amazoncloudwatch-agent.s3.amazonaws.com/debian/amd64/latest/amazon-cloudwatch-agent.deb
#sudo dpkg -i -E ./amazon-cloudwatch-agent.deb


sudo apt-get install -y gpg
wget https://s3.amazonaws.com/amazoncloudwatch-agent/debian/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i -E amazon-cloudwatch-agent.deb
sudo systemctl enable amazon-cloudwatch-agent
sudo systemctl start amazon-cloudwatch-agent

# Copy your custom configuration file to the agent directory
#sudo cp /opt/cloudwatch-config.json /opt/aws/amazon-cloudwatch-agent/etc/

# Run the CloudWatch Agent with the custom configuration file
#sudo /opt/aws/amazon-cloudwatch-agent/bin/start-amazon-cloudwatch-agent -c /opt/aws/amazon-cloudwatch-agent/etc/cloudwatch-config.json

# Start and enable the CloudWatch Agent
#sudo systemctl enable amazon-cloudwatch-agent
#sudo systemctl start amazon-cloudwatch-agent

# Install necessary packages
sudo apt-get install -y nodejs npm unzip

# Create a dedicated user and group for your application
sudo groupadd csye6225
sudo useradd -s /bin/false -g csye6225 -d /opt/csye6225 -m csye6225

# Extract your web application code
cd /opt
unzip webapp.zip
rm webapp.zip

# Change the ownership of the extracted directory
sudo chown -R csye6225:csye6225 /opt/

sudo chown -R csye6225:csye6225 /var/log
sudo chown csye6225:csye6225 /var/log/webapp.log
sudo chmod 664 /var/log/webapp.log

#sudo chmod u+w /var/log
#sudo touch /var/log/csye6225.log

# Remove any existing Node.js modules and lock file
rm -rf /opt/webapp/node_modules
rm /opt/webapp/package-lock.json

# Install the required Node.js modules
cd /opt/webapp
sudo npm install mariadb
sudo npm install


sudo apt-get remove --purge -y git

# Systemd service unit
sudo sh -c "echo '[Unit]
Description=My NPM Service
After=network.target

[Service]
EnvironmentFile=/etc/environment
StandardOutput=append:/var/log/webapp.log
User=csye6225
WorkingDirectory=/opt/webapp
ExecStart=/usr/bin/npm run start
Restart=always

[Install]
WantedBy=multi-user.target' | sudo tee /etc/systemd/system/webapp.service"

# Reload Systemd to read the new service unit
sudo systemctl daemon-reload

# Enable the service to start on boot
sudo systemctl enable webapp

# Start the service
sudo systemctl start webapp

# status of the service
sudo systemctl status webapp
sudo systemctl restart webapp

