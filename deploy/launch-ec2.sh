#!/usr/bin/env bash

# Launch a free-tier EC2 instance for the EnergyAI app.
# Requires AWS CLI configured with credentials and region.

set -euo pipefail

KEY_NAME="my-ec2-key"
SEC_GROUP_NAME="energyai-sg"
INSTANCE_TYPE="t3.micro"
AMI_ID="ami-0ac80df6eff0e70b5" # Ubuntu 22.04 LTS, update as needed for region
TAG_NAME="EnergyAI-Instance"

if [[ -z "${AWS_PROFILE:-}" ]]; then
  echo "Using default AWS profile. Set AWS_PROFILE if needed."
fi

echo "Creating security group ${SEC_GROUP_NAME}..."
SEC_GROUP_ID=$(aws ec2 describe-security-groups --filters Name=group-name,Values=${SEC_GROUP_NAME} --query 'SecurityGroups[0].GroupId' --output text || true)
if [[ "$SEC_GROUP_ID" == "None" ]]; then
  SEC_GROUP_ID=$(aws ec2 create-security-group --group-name ${SEC_GROUP_NAME} --description "Security group for EnergyAI" --query 'GroupId' --output text)
  aws ec2 authorize-security-group-ingress --group-id ${SEC_GROUP_ID} --protocol tcp --port 22 --cidr 0.0.0.0/0
  aws ec2 authorize-security-group-ingress --group-id ${SEC_GROUP_ID} --protocol tcp --port 80 --cidr 0.0.0.0/0
  aws ec2 authorize-security-group-ingress --group-id ${SEC_GROUP_ID} --protocol tcp --port 8000 --cidr 0.0.0.0/0
fi

echo "Launching instance..."
INSTANCE_ID=$(aws ec2 run-instances \
  --image-id ${AMI_ID} \
  --count 1 \
  --instance-type ${INSTANCE_TYPE} \
  --key-name ${KEY_NAME} \
  --security-group-ids ${SEC_GROUP_ID} \
  --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=${TAG_NAME}}]" \
  --query 'Instances[0].InstanceId' \
  --output text)

echo "Instance launched: ${INSTANCE_ID}"
aws ec2 describe-instances --instance-ids ${INSTANCE_ID} --query 'Reservations[0].Instances[0].PublicIpAddress' --output text

echo "Run the deploy user-data script after SSHing into the instance, or use the EC2 user data to bootstrap the instance."
