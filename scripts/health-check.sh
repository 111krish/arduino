#!/usr/bin/env bash
set -euo pipefail

ENVIRONMENT="${1:-staging}"
MAX_RETRIES="${2:-10}"
RETRY_INTERVAL="${3:-10}"

declare -A ENDPOINTS=(
  [staging]="https://staging-api.researcher-app.example.com"
  [production]="https://api.researcher-app.example.com"
)

BASE_URL="${ENDPOINTS[$ENVIRONMENT]:-}"
if [[ -z "${BASE_URL}" ]]; then
  echo "ERROR: Unknown environment '${ENVIRONMENT}'" >&2
  exit 1
fi

HEALTH_URL="${BASE_URL}/health"
echo "==> Running health check against: ${HEALTH_URL}"

for i in $(seq 1 "${MAX_RETRIES}"); do
  HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "${HEALTH_URL}" || echo "000")

  if [[ "${HTTP_STATUS}" == "200" ]]; then
    echo "==> Health check passed (attempt ${i}/${MAX_RETRIES}): HTTP ${HTTP_STATUS}"
    exit 0
  fi

  echo "    Attempt ${i}/${MAX_RETRIES}: HTTP ${HTTP_STATUS} — retrying in ${RETRY_INTERVAL}s..."
  sleep "${RETRY_INTERVAL}"
done

echo "ERROR: Health check failed after ${MAX_RETRIES} attempts." >&2
exit 1
