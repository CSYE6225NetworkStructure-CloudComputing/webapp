
packer {
  required_plugins {
    amazon = {
      source  = "github.com/hashicorp/amazon"
      version = "1.1.0"
    }
  }
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "source_ami" {
  type    = string
  default = "ami-06db4d78cb1d3bbf9"
}

variable "ssh_username" {
  type    = string
  default = "admin"
}

variable "subnet_id" {
  type    = string
  default = "subnet-03288ef4a4300dd1e"
}

variable "ami_users" {
  type    = list(string)
  default = ["214910345944", "294410349781"]
}


source "amazon-ebs" "webapp-debian" {
  region          = "${var.aws_region}"
  ami_name        = "cloud_webapp_${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  ami_users       = "${var.ami_users}"
  ami_description = "AMI for webapp"
  ami_regions     = ["us-east-1"]


  aws_polling {
    delay_seconds = 30
    max_attempts  = 50
  }

  instance_type = "t2.micro"
  source_ami    = "${var.source_ami}"
  ssh_username  = "${var.ssh_username}"
  subnet_id     = "${var.subnet_id}"

  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = "/dev/xvda"
    volume_size           = 8
    volume_type           = "gp2"
  }
}


build {
  sources = ["source.amazon-ebs.webapp-debian"]

  provisioner "shell" {
    environment_vars = [
      "CHECKPOINT_DISABLE=1",
      "DEBIAN_FRONTEND=noninteractive"
    ]
    inline = [
      "sudo chown admin:admin /opt"
    ]
  }

  provisioner "file" {
    source      = "webapp.zip"
    destination = "/opt/"
  }

  provisioner "shell" {
    environment_vars = [
      "CHECKPOINT_DISABLE=1",
      "DEBIAN_FRONTEND=noninteractive"
    ]
    scripts = [
      "app.sh"
    ]
  }
}


