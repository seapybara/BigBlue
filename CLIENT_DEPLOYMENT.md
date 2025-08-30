# Client Deployment Setup Guide

## Frontend Configuration for GitHub Pages

### Step 1: Update Environment Variables

After your Railway backend is deployed, you'll need to update your client `.env` file:

```bash
# Get your Railway URL from Railway dashboard
# It will look something like: https://bigblue-server-production.up.railway.app

# Update bigblue/client/.env
REACT_APP_API_URL=https://your-railway-url.railway.app/api
REACT_APP_MAPBOX_TOKEN=your_actual_mapbox_token
```

### Step 2: Build for Production

```bash
cd bigblue/client
npm run build
```

### Step 3: Deploy to GitHub Pages

Since your `package.json` already has the homepage configured, you can deploy using GitHub Pages:

**Option A: Manual Deployment**
1. Copy contents of `build/` folder to `docs/` folder (if using docs for GitHub Pages)
2. Commit and push to main branch

**Option B: GitHub Actions (Recommended)**
Create `.github/workflows/deploy.yml` for automatic deployment on push to main.

### Step 4: Verify Configuration

After deployment, check:
1. ✅ Frontend loads on `https://seapybara.github.io/BigBlue`
2. ✅ API calls work (check browser dev tools Network tab)
3. ✅ Authentication flows work
4. ✅ Maps load with Mapbox token
5. ✅ No CORS errors in browser console

### Important Notes:

- Your GitHub Pages URL: `https://seapybara.github.io/BigBlue`
- Make sure Railway backend is deployed first
- Test API connectivity before going live
- Ensure Mapbox token is valid for your domain

### If you encounter CORS errors:

The server CORS has been updated to allow `https://seapybara.github.io`, but if you still see CORS errors:
1. Check your Railway backend URL is correct
2. Verify Railway environment variables are set
3. Check browser developer tools for specific error messages