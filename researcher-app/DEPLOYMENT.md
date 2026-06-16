# Deployment Guide

## Prerequisites

| Tool       | Minimum version |
|------------|----------------|
| AWS CLI    | 2.x             |
| Terraform  | 1.7.0           |
| kubectl    | 1.28            |
| Docker     | 24.x            |

Ensure your AWS credentials have the following permissions:
- `eks:*`, `ec2:*`, `rds:*`, `s3:*`, `iam:PassRole`, `cloudwatch:*`, `apigateway:*`

---

## 1. Bootstrap a New Environment

Run once per environment to create the Terraform state bucket, DynamoDB lock table, and provision all infrastructure:

```bash
export AWS_REGION=us-east-1
bash scripts/setup-env.sh <environment>   # staging | production
```

This will:
1. Create an S3 bucket for Terraform state (`researcher-app-tfstate-<env>`).
2. Create a DynamoDB table for state locking (`researcher-app-tflock-<env>`).
3. Run `terraform init` and `terraform apply` for the target environment.

---

## 2. Deploy Application

```bash
bash scripts/deploy.sh <environment> <image-tag>
```

**Example:**
```bash
bash scripts/deploy.sh staging abc1234
```

The script will:
1. Update kubeconfig for the target EKS cluster.
2. Apply Kubernetes manifests (namespace, configmap, deployment, service, ingress).
3. Wait for the rollout to complete (5 min timeout).
4. Run a health check.

---

## 3. Rollback

To roll back to the previous deployment revision:

```bash
bash scripts/rollback.sh <environment>
```

To roll back to a specific revision:

```bash
bash scripts/rollback.sh <environment> <revision-number>
```

Check available revisions with:
```bash
kubectl rollout history deployment/researcher-app -n researcher-app
```

---

## 4. Health Check

```bash
bash scripts/health-check.sh <environment> [max-retries] [retry-interval-seconds]
```

**Example — 20 retries, 15 s apart:**
```bash
bash scripts/health-check.sh production 20 15
```

---

## 5. Terraform Infrastructure Changes

Changes to `terraform/` are applied via the `Terraform` GitHub Actions workflow. To apply manually:

```bash
cd terraform/environments/<environment>
terraform init
terraform plan -out=tfplan
terraform apply tfplan
```

---

## 6. Secrets Management

Sensitive values (DB passwords, API keys) are stored in AWS Secrets Manager and injected into the application at runtime via the EKS pod identity. Never commit secrets to the repository.

Required GitHub Actions secrets per environment:

| Secret                        | Description                     |
|-------------------------------|---------------------------------|
| `AWS_ACCESS_KEY_ID_STAGING`   | Staging deploy IAM key ID       |
| `AWS_SECRET_ACCESS_KEY_STAGING` | Staging deploy IAM secret key |
| `AWS_ACCESS_KEY_ID_PROD`      | Production deploy IAM key ID    |
| `AWS_SECRET_ACCESS_KEY_PROD`  | Production deploy IAM secret key|

---

## 7. Monitoring

After deployment, check dashboards and alarms in CloudWatch:

- **Dashboard:** `researcher-app-<env>-dashboard`
- **Log group:** `/researcher-app/<env>`
- **Alerts:** SNS topic `researcher-app-<env>-alerts`
