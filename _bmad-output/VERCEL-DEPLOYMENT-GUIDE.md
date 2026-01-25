# Vercel Deployment Guide - Teachers Tools Hub

## Quick Deployment Steps

### Option 1: Vercel CLI (Recommended)

1. **Navigate to the web directory**:

   ```bash
   cd web
   ```

2. **Login to Vercel** (if not already logged in):

   ```bash
   vercel login
   ```

3. **Deploy to production**:

   ```bash
   vercel --prod
   ```

4. **Follow the prompts**:
   - Set up and deploy? → **Yes**
   - Which scope? → Select **Ahmed Tawfik's projects**
   - Link to existing project? → **No** (first time)
   - Project name? → **teachers-tools-hub** (or your preferred name)
   - Directory? → **./web** (or just press Enter if already in web directory)
   - Override settings? → **No** (Next.js auto-detected)

### Option 2: Vercel Dashboard (Git Integration)

1. **Push to GitHub** (if not already done):

   ```bash
   git add .
   git commit -m "Add Arabic translations and prepare for deployment"
   git push origin main
   ```

2. **Go to Vercel Dashboard**:
   - Visit: https://vercel.com/dashboard
   - Click "Add New Project"
   - Import your GitHub repository
   - Select the `web` directory as the root directory
   - Framework Preset: **Next.js** (auto-detected)
   - Click "Deploy"

### Option 3: Vercel GitHub Integration (Automatic)

1. **Connect Repository to Vercel**:
   - Go to https://vercel.com/new
   - Import your repository
   - Configure:
     - Root Directory: `web`
     - Framework: Next.js (auto-detected)
     - Build Command: `npm run build`
     - Output Directory: `.next`
     - Install Command: `npm install`

2. **Enable Automatic Deployments**:
   - Every push to `main` branch will auto-deploy
   - Pull requests will get preview deployments

## Project Configuration

### vercel.json (Already Created)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "npm install"
}
```

### Environment Variables (If Needed)

Currently, the project doesn't require any environment variables. If you add API keys or secrets later:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add variables for:
   - Production
   - Preview
   - Development

## Build Configuration

- **Framework**: Next.js 16.1.4
- **Node Version**: 18.x or higher (auto-detected)
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

## Post-Deployment Checklist

After deployment, verify:

1. ✅ **Homepage loads correctly**
   - English version displays all 25 tools
   - Arabic version displays with RTL layout

2. ✅ **Language toggle works**
   - Switch between English and Arabic
   - Translations display correctly

3. ✅ **Theme toggle works**
   - Light mode displays properly
   - Dark mode displays properly

4. ✅ **Mobile responsiveness**
   - Test on mobile devices
   - Check breakpoints (375px, 768px, 1024px+)

5. ✅ **Tool cards display correctly**
   - English titles remain LTR in Arabic layout
   - Category badges translate properly
   - Descriptions, free tier, and limitations show Arabic translations

6. ✅ **Performance**
   - Check Lighthouse scores
   - Verify fast page load times

## Custom Domain (Optional)

To add a custom domain:

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain (e.g., `teacherstools.com`)
3. Configure DNS records as instructed by Vercel
4. Wait for DNS propagation (usually 24-48 hours)

## Deployment URLs

After deployment, you'll get:

- **Production URL**: `https://teachers-tools-hub.vercel.app` (or your custom domain)
- **Preview URLs**: Unique URL for each git branch/PR

## Troubleshooting

### Build Fails

- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node version compatibility

### 404 Errors

- Ensure `web` directory is set as root directory
- Check that `.next` folder is being generated

### Slow Build Times

- Next.js 16 with Turbopack should build in ~3-4 seconds
- If slower, check for large dependencies

### Arabic Text Not Displaying

- Verify `web/data/tools.json` is included in deployment
- Check that Cairo font is loading from Google Fonts

## Monitoring & Analytics

Consider adding:

- **Vercel Analytics**: Built-in performance monitoring
- **Google Analytics**: User behavior tracking
- **Sentry**: Error tracking and monitoring

## Continuous Deployment

Once connected to GitHub:

- Push to `main` → Automatic production deployment
- Push to other branches → Preview deployments
- Pull requests → Preview deployments with unique URLs

---

## Quick Command Reference

```bash
# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View deployment logs
vercel logs [deployment-url]

# Remove deployment
vercel rm [deployment-name]
```

---

**Status**: Ready for Deployment ✅
**Build**: Passing ✅
**Tests**: All Features Working ✅
