# EC2 Deployment Guide

This guide explains how to deploy the EnergyAI app to an AWS EC2 free-tier instance using Docker Compose.

## 1. Choose a Free Tier Instance

- Use **Ubuntu 24.04 LTS** or **Amazon Linux 2024**.
- For the free tier, choose **t3.micro** or **t2.micro** if available.

## 2. Create a Security Group

Open inbound ports:
- **22** (SSH)
- **80** (HTTP)
- **8000** (optional for direct backend access)

## 3. Launch the Instance

1. Create an EC2 instance from the AWS console.
2. Attach a key pair you control.
3. Attach the security group from step 2.

## 4. Install Docker on the EC2 Instance

SSH into the instance and run:

```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg lsb-release
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo usermod -aG docker $USER
newgrp docker
```

## 5. Deploy the App

From the EC2 instance:

```bash
sudo apt install -y git
git clone https://github.com/<your-repo-owner>/<your-repo-name>.git
cd <your-repo-name>
cp backend/.env.template backend/.env
# Edit backend/.env and set GROQ_API_KEY
nano backend/.env

docker compose up -d --build
```

If you prefer to copy the repo from your local machine, upload the repository files instead of cloning.

## 6. Access the App

- Frontend: `http://<EC2_PUBLIC_IP>/`
- Backend health: `http://<EC2_PUBLIC_IP>:8000/`

## 7. Notes

- The frontend Docker service proxies `/chat` and `/calculate` to the backend.
- Keep your `GROQ_API_KEY` secret and never commit `.env`.
- If you want HTTPS, place an Nginx reverse proxy or AWS Load Balancer in front of the app.
