# CI/CD Artifact Retention Policy

This document outlines the artifact retention strategy for the Sirch Coin project's CI/CD pipeline.

## Overview

Our CI/CD pipeline generates various types of artifacts during different stages of the development and deployment process. Each artifact type has a specific retention period based on its purpose, compliance requirements, and storage considerations.

## Artifact Types and Retention Periods

### CI Workflow (`ci.yml`)

| Artifact Type | Retention | Purpose | Files Included |
|---------------|-----------|---------|----------------|
| **CI Builds** | 7 days | Development/debugging | `dist/` build output |
| **Test Results** | 14 days | QA analysis & debugging | `coverage/`, `test-results.xml`, `junit.xml` |
| **Preview Deployment Logs** | 14 days | Preview debugging | `deploy_output_branch.json` |
| **Build Logs** | 7 days | Build troubleshooting | `npm-debug.log*`, `yarn-debug.log*`, `.npm/_logs/` |

### Deploy to TEST Workflow (`deploy-to-test.yml`)

| Artifact Type | Retention | Purpose | Files Included |
|---------------|-----------|---------|----------------|
| **TEST Builds** | 30 days | QA period & rollback | `dist/` production-ready build |
| **TEST Deployment Logs** | 90 days | Compliance & debugging | `deploy_test_output.json` |

### Deploy to Production Workflow (`deploy-to-production.yml`)

| Artifact Type | Retention | Purpose | Files Included |
|---------------|-----------|---------|----------------|
| **Production Builds** | 365 days | Long-term rollback & compliance | `dist/` production build |
| **Production Deployment Logs** | 365 days | Audit trail & compliance | `deploy_prod_output.json` |

## Naming Conventions

### CI Artifacts
- **Builds**: `ci-build-{event}-{commit-hash}`
- **Test Results**: `test-results-{commit-hash}`
- **Preview Logs**: `preview-deployment-logs-{commit-hash}`
- **Build Logs**: `ci-logs-{commit-hash}`

### TEST Artifacts
- **Builds**: `test-build-{commit-hash}`
- **Deployment Logs**: `test-deployment-logs-{commit-hash}`

### Production Artifacts
- **Builds**: `production-build-v{version-tag}`
- **Deployment Logs**: `production-deployment-logs-v{version-tag}`

## Retention Rationale

### Short-term (7-14 days)
- **CI builds and logs**: Primarily for immediate development feedback and debugging
- **Test results**: Needed during active PR review and QA cycles
- **Preview logs**: Useful for troubleshooting preview deployments during development

### Medium-term (30-90 days)
- **TEST builds**: Cover typical QA cycles and provide rollback capability during testing phases
- **TEST deployment logs**: Support debugging and compliance requirements for test environment

### Long-term (365 days)
- **Production builds**: Enable rollbacks for up to one year, supporting compliance and stability requirements
- **Production deployment logs**: Meet audit trail requirements and support long-term troubleshooting

## Access and Usage

### Artifact Links
All workflows provide direct links to artifacts in:
- PR comments (for CI artifacts)
- Deployment summaries (for deployment artifacts)
- GitHub releases (for production artifacts)
- Workflow step summaries

### Manual Access
Artifacts can be accessed via:
1. GitHub Actions workflow run pages
2. GitHub CLI: `gh run download {run-id}`
3. GitHub API for programmatic access

## Storage Considerations

- **Total estimated storage**: ~50GB/month for active development
- **Cost optimization**: Shorter retention for frequent CI artifacts, longer for critical production artifacts
- **Automatic cleanup**: GitHub automatically removes artifacts after retention period expires

## Compliance Notes

- **Audit requirements**: Production artifacts retained for 365 days to meet compliance needs
- **Rollback capability**: All production deployments can be rolled back using archived builds
- **Test traceability**: Test results linked to specific commits and deployments

## Review and Updates

This policy should be reviewed quarterly or when:
- Storage costs become a concern
- Compliance requirements change
- Development workflow changes significantly
- New artifact types are introduced

---

**Last updated**: October 2025  
**Next review**: January 2026