#!/usr/bin/env bash
set -euo pipefail

ENVIRONMENT="${1:-staging}"
REVISION="${2:-}"
REGION="${AWS_REGION:-us-east-1}"
CLUSTER_NAME="researcher-app-${ENVIRONMENT}"

echo "==> Rolling back researcher-app in environment: ${ENVIRONMENT}"

aws eks update-kubeconfig --region "${REGION}" --name "${CLUSTER_NAME}"

if [[ -n "${REVISION}" ]]; then
  echo "==> Rolling back to revision: ${REVISION}"
  kubectl rollout undo deployment/researcher-app -n researcher-app --to-revision="${REVISION}"
else
  echo "==> Rolling back to previous revision"
  kubectl rollout undo deployment/researcher-app -n researcher-app
fi

echo "==> Waiting for rollback to complete..."
kubectl rollout status deployment/researcher-app -n researcher-app --timeout=300s

CURRENT_IMAGE=$(kubectl get deployment researcher-app -n researcher-app \
  -o jsonpath='{.spec.template.spec.containers[0].image}')
echo "==> Rollback complete. Current image: ${CURRENT_IMAGE}"
