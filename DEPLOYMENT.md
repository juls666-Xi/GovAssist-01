# Deployment Guide

## Deploying to Vercel

### Step 1: Prepare Your Repository

```bash
# Initialize git (if not already)
git init
git add .
git commit -m "Initial commit"

# Create a new repository on GitHub and push
git remote add origin https://github.com/yourusername/gov-assist-pro.git
git branch -M main
git push -u origin main
```

### Step 2: Set Up Vercel Project

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `.next`

> The project includes `vercel.json` and a `vercel-build` script so Vercel can build with Prisma client generation before Next.js compilation.

### Step 3: Configure Environment Variables

Add these environment variables in Vercel Dashboard → Settings → Environment Variables:

```
DATABASE_URL=postgresql://user:pass@host:port/db?schema=public
NEXTAUTH_URL=https://your-project.vercel.app
NEXTAUTH_SECRET=your-super-secret-production-key
UPLOADTHING_SECRET=your-uploadthing-secret
UPLOADTHING_APP_ID=your-uploadthing-app-id
```

Generate a secure `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### Step 4: Database Setup

For PostgreSQL, you can use:
- **Vercel Postgres** (recommended - integrates seamlessly)
- **Supabase**
- **Neon**
- **Railway**
- **AWS RDS**

#### Using Vercel Postgres:
1. In Vercel Dashboard, go to Storage → Create Database → Vercel Postgres
2. Connect it to your project
3. The `POSTGRES_URL` will be automatically added as an environment variable
4. Update `DATABASE_URL` to use this value

### Step 5: Run Migrations

You need to run migrations on your production database. Options:

**Option A: Local with production DB**
```bash
# Temporarily set DATABASE_URL to production
export DATABASE_URL="your-production-db-url"
npx prisma migrate deploy
```

**Option B: Vercel CLI**
```bash
npm i -g vercel
vercel env pull .env.production
# Then run migrations locally with that env
```

**Option C: GitHub Actions (Recommended)**
Create `.github/workflows/migrate.yml`:

```yaml
name: Database Migration
on:
  push:
    branches: [main]
jobs:
  migrate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm ci
      - run: npx prisma migrate deploy
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

### Step 6: Deploy

1. Push to main branch
2. Vercel will automatically deploy
3. Visit your deployed URL

### Step 7: Seed Production Database (First Time Only)

```bash
# Connect to production DB and seed
export DATABASE_URL="your-production-db-url"
npx prisma db seed
```

## Post-Deployment Checklist

- [ ] Verify all environment variables are set
- [ ] Run database migrations
- [ ] Seed initial data (admin account, programs)
- [ ] Test login with demo credentials
- [ ] Verify file uploads work (UploadThing configured)
- [ ] Check email notifications (if configured)
- [ ] Test all user roles (citizen, staff, admin)
- [ ] Verify audit logs are recording
- [ ] Test report exports

## Troubleshooting

### Build Failures
- Ensure `prisma generate` runs before build
- Check Node.js version (18+)
- Verify all dependencies are in `package.json`

### Database Connection Issues
- Verify `DATABASE_URL` format
- Check if IP is allowlisted (for external DBs)
- Ensure SSL is configured for production DBs

### Auth Issues
- Verify `NEXTAUTH_URL` matches your domain
- Ensure `NEXTAUTH_SECRET` is set and secure
- Check cookie settings for cross-domain

### File Upload Issues
- Verify UploadThing credentials
- Check file size limits
- Ensure CORS is configured
