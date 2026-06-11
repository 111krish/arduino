# Architecture

## High-Level Overview

```
Internet
   │
   ▼
┌─────────────────┐
│  API Gateway    │  (rate limiting, auth, TLS termination)
└────────┬────────┘
         │
         ▼
┌─────────────────┐       ┌──────────────────┐
│  EKS Cluster    │──────▶│  RDS PostgreSQL  │
│  (researcher-   │       │  (Multi-AZ)      │
│   app pods)     │       └──────────────────┘
└────────┬────────┘
         │
         ▼
┌─────────────────┐       ┌──────────────────┐
│  S3 Buckets     │       │  CloudWatch      │
│  (artefacts,    │       │  (logs, metrics, │
│   uploads)      │       │   alarms)        │
└─────────────────┘       └──────────────────┘
```

---

## AWS Components

### Networking — `terraform/modules/vpc`

- **VPC** with a `/16` CIDR split across 3 Availability Zones.
- **Public subnets** for load balancers (tagged `kubernetes.io/role/elb`).
- **Private subnets** for EKS nodes and RDS (tagged `kubernetes.io/role/internal-elb`).
- **NAT Gateways** (one per AZ) for private-subnet egress.
- **Internet Gateway** for public-subnet ingress.

### Kubernetes — `terraform/modules/eks`

- **EKS 1.29** with private API endpoint; public endpoint off by default.
- **Managed Node Group** with auto-scaling (min 1, desired 2, max 5).
- Add-ons: `coredns`, `kube-proxy`, `vpc-cni`.
- Control-plane logs forwarded to CloudWatch.

### Database — `terraform/modules/rds`

- **PostgreSQL 15** on `db.t3.medium` (configurable).
- Multi-AZ standby for production.
- Storage auto-scaling up to 100 GiB.
- Encrypted at rest; 7-day automated backups.
- Accessible only from EKS node security group.

### Object Storage — `terraform/modules/s3`

- Buckets for research artefacts, model outputs, and user uploads.
- Versioning enabled; public access fully blocked.
- AES-256 (or KMS) server-side encryption.
- Configurable lifecycle rules (transition to Glacier, expiry).

### IAM — `terraform/modules/iam`

- **EKS Cluster Role** — attached `AmazonEKSClusterPolicy`.
- **EKS Node Role** — attached `AmazonEKSWorkerNodePolicy`, `AmazonEKS_CNI_Policy`, `AmazonEC2ContainerRegistryReadOnly`.
- **App Role** — custom least-privilege policy for S3, Secrets Manager, and SQS access.

### API Gateway — `terraform/modules/api-gateway`

- Regional REST API with `{proxy+}` catch-all resource.
- Optional Lambda authorizer for JWT validation.
- Throttle: 1 000 req/s burst, 500 req/s sustained.
- Daily quota: 10 000 requests.
- Access logs to CloudWatch.

### Monitoring — `terraform/modules/monitoring`

- **Log Group** `/researcher-app/<env>` with configurable retention.
- **CPU alarm** at 80 % → SNS alert.
- **Memory alarm** at 80 % → SNS alert.
- **SNS Topic** with email subscriptions for on-call.
- **CloudWatch Dashboard** with CPU utilisation and tail-log widgets.

---

## CI/CD Pipeline

```
PR opened
  └─▶ CI workflow
        ├─ Lint (flake8, mypy)
        ├─ Unit + integration tests (pytest, PostgreSQL service container)
        └─ Build & push Docker image to GHCR

Merge to main
  └─▶ CD workflow
        ├─ Deploy to staging (automated)
        └─ Deploy to production (manual approval gate)

terraform/** changed
  └─▶ Terraform workflow
        ├─ fmt check + validate all modules
        ├─ Plan (uploaded as artifact)
        └─ Apply on merge to main
```

---

## Security Considerations

- All inter-service traffic stays within the VPC private subnets.
- RDS has no public endpoint; ingress restricted to EKS node SG.
- EKS API server has no public endpoint in production.
- S3 buckets block all public access at the account policy level.
- Secrets are stored in AWS Secrets Manager; pods access them via IRSA (IAM Roles for Service Accounts).
- Image scanning is enforced in the GHCR registry; the build fails if critical CVEs are detected.
