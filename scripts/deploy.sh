#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

ENVIRONMENT="${1:-staging}"
IMAGE_TAG="${2:-latest}"
REGION="${AWS_REGION:-us-east-1}"
CLUSTER_NAME="researcher-app-${ENVIRONMENT}"

echo "==> Deploying researcher-app to environment: ${ENVIRONMENT} (image: ${IMAGE_TAG})"

# Authenticate kubectl with the EKS cluster
echo "==> Configuring kubectl for cluster: ${CLUSTER_NAME}"
aws eks update-kubeconfig --region "${REGION}" --name "${CLUSTER_NAME}"

# Apply namespace and config maps first
kubectl apply -f "${ROOT_DIR}/k8s/namespace.yml"
kubectl apply -f "${ROOT_DIR}/k8s/configmap.yml"

# Update image tag in deployment manifests
sed -i "s|IMAGE_TAG|${IMAGE_TAG}|g" "${ROOT_DIR}/k8s/deployment.yml"

# Apply workloads
kubectl apply -f "${ROOT_DIR}/k8s/deployment.yml"
kubectl apply -f "${ROOT_DIR}/k8s/service.yml"
kubectl apply -f "${ROOT_DIR}/k8s/ingress.yml"

# Wait for rollout to complete
echo "==> Waiting for deployment rollout..."
kubectl rollout status deployment/researcher-app -n researcher-app --timeout=300s

echo "==> Deployment complete. Running health check..."
"${SCRIPT_DIR}/health-check.sh" "${ENVIRONMENT}"
