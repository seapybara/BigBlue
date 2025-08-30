# BigBlue Deployment Checklist

## Pre-Deployment Checklist

### Backend (Railway)
- [ ] Railway project linked to `bigblue/server/`
- [ ] Environment variables set:
  - [ ] `MONGODB_URI` (Atlas connection string)
  - [ ] `JWT_SECRET` (32+ character random string)
  - [ ] `NODE_ENV=production`
  - [ ] `CLIENT_URL=https://seapybara.github.io/BigBlue`
  - [ ] `PORT=5000`
- [ ] CORS configuration includes GitHub Pages domain
- [ ] Backend deployed successfully

### Frontend (GitHub Pages)
- [ ] Mapbox token configured
- [ ] API URL points to Railway backend
- [ ] GitHub Pages configured in repository settings
- [ ] Build process works without errors

## Testing Checklist

### 1. Backend API Tests
```bash
# Test health endpoint
curl https://your-railway-url.railway.app/api/health

# Expected response:
# {"status":"OK","service":"BigBlue API","mongodb":"Connected"}
```

### 2. CORS Configuration Test
```bash
# Test CORS from GitHub Pages domain
curl -H "Origin: https://seapybara.github.io" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type,Authorization" \
     -X OPTIONS \
     https://your-railway-url.railway.app/api/test
```

### 3. Frontend Functionality Tests
Visit `https://seapybara.github.io/BigBlue` and verify:

#### Authentication
- [ ] Registration form works
- [ ] Login form works
- [ ] JWT tokens are stored properly
- [ ] Protected routes redirect when not authenticated
- [ ] Logout clears tokens

#### Core Features
- [ ] Map loads with dive sites
- [ ] Location search works
- [ ] Dive site details display
- [ ] Buddy finder shows requests
- [ ] Dive logging functionality works
- [ ] User profile updates

#### API Integration
- [ ] No CORS errors in browser console
- [ ] API calls return expected data
- [ ] Error handling works properly
- [ ] Loading states display correctly

### 4. Database Tests
- [ ] User registration creates records in Atlas
- [ ] Dive logs save to database
- [ ] Buddy requests are stored properly
- [ ] Location data loads correctly

## Common Issues & Solutions

### CORS Errors
- Check Railway backend URL is correct in client `.env`
- Verify CORS origin includes exact GitHub Pages URL
- Ensure no trailing slashes in URLs

### Authentication Issues
- Verify JWT_SECRET is same as used for existing tokens
- Check token expiration settings
- Ensure localStorage is accessible on HTTPS

### Map Not Loading
- Verify Mapbox token is valid for your domain
- Check for JavaScript errors in browser console
- Ensure Mapbox token has proper permissions

### API Connection Failed
- Verify Railway backend is running
- Check environment variables are set correctly
- Test API endpoints directly with curl/Postman

## Success Criteria
✅ All API endpoints respond correctly
✅ Frontend loads without errors
✅ Authentication flow works end-to-end
✅ Core features (buddy finding, dive logging) function
✅ No CORS or network errors
✅ Database operations complete successfully