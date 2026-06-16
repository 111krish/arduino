# Researcher App

A cloud-native research platform deployed on AWS EKS with Terraform-managed infrastructure.

## Overview

The Researcher App provides a scalable API and data-processing backend for research workflows. It runs on Kubernetes (EKS), uses PostgreSQL (RDS) for persistence, S3 for artefact storage, and API Gateway as the public ingress.

## Repository Structure

```
.
├── .github/workflows/     # CI/CD pipelines
│   ├── ci.yml             # Lint, test, build image
│   ├── cd.yml             # Deploy to staging / production
│   └── terraform.yml      # Infrastructure plan & apply
├── scripts/               # Deployment automation
│   ├── deploy.sh          # Deploy a tagged image to EKS
│   ├── rollback.sh        # Roll back to a previous revision
│   ├── setup-env.sh       # Bootstrap Terraform state + apply infra
│   └── health-check.sh    # Probe the /health endpoint
├── terraform/
│   └── modules/           # Reusable Terraform modules
│       ├── vpc/           # VPC, subnets, NAT gateways
│       ├── eks/           # EKS cluster + managed node groups
│       ├── rds/           # PostgreSQL RDS instance
│       ├── s3/            # S3 buckets with encryption & lifecycle
│       ├── iam/           # IAM roles for EKS and the app
│       ├── monitoring/    # CloudWatch alarms, dashboards, SNS
│       └── api-gateway/   # REST API Gateway with usage plans
└── researcher-app/
    ├── README.md          # This file
    ├── DEPLOYMENT.md      # Step-by-step deployment guide
    └── ARCHITECTURE.md    # System design and component overview
```

## Quick Start

### Prerequisites

- AWS CLI ≥ 2.x configured with appropriate credentials
- Terraform ≥ 1.7
- `kubectl` ≥ 1.28
- Docker (for local builds)

### Bootstrap infrastructure

```bash
bash scripts/setup-env.sh staging
```

### Deploy the application

```bash
bash scripts/deploy.sh staging <IMAGE_TAG>
```

### Check health

```bash
bash scripts/health-check.sh staging
```

## CI/CD

Every pull request triggers the `CI` workflow (lint → test → build). Merging to `main` triggers `CD`, which deploys automatically to staging. Production deployments are manual via `workflow_dispatch`.

Infrastructure changes under `terraform/` trigger the `Terraform` workflow, which plans on PRs and applies on merge to `main`.

## Contributing

1. Branch from `develop`.
2. Open a PR — CI runs automatically.
3. Request review; merge after approval.
