# Railway Deployment Setup Guide

## Environment Variables for Railway

Set these environment variables in your Railway dashboard:

### Required Variables

```bash
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secure_random_string_at_least_32_characters
NODE_ENV=production
CLIENT_URL=https://seapybara.github.io/BigBlue
PORT=5000
```

### How to Set Environment Variables in Railway:

1. Go to your Railway dashboard
2. Select your BigBlue server project
3. Go to "Variables" tab
4. Add each variable with its value

### Getting Your Values:

**MONGODB_URI**: 
- From your MongoDB Atlas dashboard
- Should look like: `mongodb+srv://username:password@cluster.mongodb.net/bigblue?retryWrites=true&w=majority`

**JWT_SECRET**: 
- Generate a secure random string (32+ characters)
- You can use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

**CLIENT_URL**: 
- Your GitHub Pages URL: `https://seapybara.github.io/BigBlue`

### After Setting Variables:

1. Railway will automatically redeploy your backend
2. Note your Railway backend URL (something like: `https://your-app-name.railway.app`)
3. You'll need this URL for the frontend configuration

## Next Steps:

1. Set the environment variables above in Railway
2. Get your Railway backend URL after deployment
3. Update the frontend configuration with this URL