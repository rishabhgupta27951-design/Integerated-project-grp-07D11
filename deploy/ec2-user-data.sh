#!/bin/bash

# EC2 user-data script to bootstrap Docker and run the app
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y ca-certificates curl gnupg lsb-release git
mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
  | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
usermod -aG docker ubuntu
newgrp docker

cd /home/ubuntu
if [ ! -d "app" ]; then
  git clone https://github.com/<your-repo-owner>/<your-repo-name>.git app
fi
cd app
cp backend/.env.template backend/.env || true
# If you want to automatically deploy with a preconfigured GROQ_API_KEY, add it here.
# sed -i "s|your_api_key_here|${GROQ_API_KEY}|" backend/.env

docker compose up -d --build
