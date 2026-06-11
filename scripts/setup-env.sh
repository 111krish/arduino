#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

ENVIRONMENT="${1:-staging}"
REGION="${AWS_REGION:-us-east-1}"
TF_DIR="${ROOT_DIR}/terraform/environments/${ENVIRONMENT}"

echo "==> Setting up environment: ${ENVIRONMENT}"

# Validate required tools
for tool in terraform aws kubectl; do
  if ! command -v "${tool}" &>/dev/null; then
    echo "ERROR: Required tool '${tool}' is not installed." >&2
    exit 1
  fi
done

# Bootstrap Terraform state backend (S3 + DynamoDB)
BUCKET="researcher-app-tfstate-${ENVIRONMENT}"
TABLE="researcher-app-tflock-${ENVIRONMENT}"

echo "==> Creating Terraform state bucket: ${BUCKET}"
aws s3api create-bucket --bucket "${BUCKET}" --region "${REGION}" \
  --create-bucket-configuration LocationConstraint="${REGION}" 2>/dev/null || true
aws s3api put-bucket-versioning --bucket "${BUCKET}" \
  --versioning-configuration Status=Enabled
aws s3api put-bucket-encryption --bucket "${BUCKET}" \
  --server-side-encryption-configuration \
  '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]}'

echo "==> Creating DynamoDB lock table: ${TABLE}"
aws dynamodb create-table \
  --table-name "${TABLE}" \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region "${REGION}" 2>/dev/null || true

# Initialize and apply Terraform
echo "==> Initializing Terraform in ${TF_DIR}"
cd "${TF_DIR}"
terraform init -backend-config="bucket=${BUCKET}" \
               -backend-config="key=terraform.tfstate" \
               -backend-config="region=${REGION}" \
               -backend-config="dynamodb_table=${TABLE}"

echo "==> Applying Terraform configuration"
terraform apply -var-file="terraform.tfvars" -auto-approve

echo "==> Environment ${ENVIRONMENT} setup complete."
