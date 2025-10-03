# GitHub Actions Deployment Setup

## Files Created/Modified

### ✅ Created: `.github/workflows/deploy-production.yml`
- Manual "push-button" deployment to production
- Requires typing "PRODUCTION" to confirm deployment
- Uses environment-specific secrets with `_PROD` suffix

### ✅ Updated: `.github/workflows/ci.yml`
- Updated to use environment-specific secrets with `_TEST` suffix
- Continues to deploy automatically on push/PR

## Required GitHub Secrets

You need to add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

### Test Environment
- `VITE_SUPABASE_PROJECT_URL_TEST`
- `VITE_SUPABASE_ANON_KEY_TEST`
- `VITE_STRIPE_API_PUBLISHABLE_KEY_TEST`
- `NETLIFY_SITE_ID_TEST`
- `NETLIFY_API_TOKEN_TEST`

### Production Environment
- `VITE_SUPABASE_PROJECT_URL_PROD`
- `VITE_SUPABASE_ANON_KEY_PROD`
- `VITE_STRIPE_API_PUBLISHABLE_KEY_PROD`
- `NETLIFY_SITE_ID_PROD`
- `NETLIFY_API_TOKEN_PROD`

## Environment Configuration Files

Public configuration values should be stored in `.env` files in your project:

### `.env.test` (for test builds)
```
VITE_PAGE_TITLE=Sirch Coin Test
VITE_IS_COMING_SOON=false
VITE_IS_OFFLINE=false
```

### `.env.production` (for production builds)
```
VITE_PAGE_TITLE=Sirch Coin
VITE_IS_COMING_SOON=false
VITE_IS_OFFLINE=false
```

## How to Use

### Test Deployments
- Happen automatically on push/PR to any branch
- Deploy to test alias on Netlify

### Production Deployments
1. Go to GitHub Actions tab
2. Select "Deploy Production" workflow
3. Click "Run workflow"
4. Type "PRODUCTION" in the confirmation field
5. Click "Run workflow"

## npm Scripts Required

Make sure you have these scripts in your `package.json`:
- `build-test` - Build for test environment
- `build-production` - Build for production environment
- `test` - Run your tests

## Next Steps

1. Add all the required secrets to GitHub
2. Test the workflows by pushing a commit (for test) and manually triggering production
3. Update your npm scripts if needed