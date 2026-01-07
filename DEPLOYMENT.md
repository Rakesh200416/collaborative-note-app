# Deployment Guide

Complete guide for deploying the Collaborative Notes application to production.

## Pre-Deployment Checklist

- [ ] MongoDB Atlas cluster created and configured
- [ ] Environment variables documented
- [ ] Code tested locally
- [ ] Security best practices reviewed
- [ ] CORS origins configured for production
- [ ] Database indexed properly
- [ ] Error handling implemented
- [ ] Logging configured

## Option 1: Vercel (Frontend) + Render (Backend)

### Step 1: Deploy Backend to Render

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure service:
     - **Name**: `collaborative-notes-backend`
     - **Root Directory**: `backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`

3. **Add Environment Variables**
   ```
   MONGO_URI=mongodb+srv://...
   JWT_SECRET=your_production_secret
   NODE_ENV=production
   FRONTEND_URL=https://your-app.vercel.app
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment
   - Note your backend URL: `https://collaborative-notes-backend.onrender.com`

### Step 2: Deploy Frontend to Vercel

1. **Install Vercel CLI** (optional)
   ```bash
   npm install -g vercel
   ```

2. **Deploy via Vercel Dashboard**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Next.js
     - **Root Directory**: `./` (project root)
     - **Build Command**: `npm run build`
     - **Output Directory**: `.next`

3. **Add Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://collaborative-notes-backend.onrender.com
   NEXT_PUBLIC_SOCKET_URL=https://collaborative-notes-backend.onrender.com
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at: `https://your-app.vercel.app`

### Step 3: Update Backend CORS

Update `backend/server.js` to allow your Vercel domain:
```javascript
origin: process.env.NODE_ENV === 'production'
  ? process.env.FRONTEND_URL
  : ['http://localhost:3000', 'http://localhost:3001'],
```

Redeploy backend after this change.

## Option 2: Railway (Full Stack)

### Deploy Backend

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Backend Service**
   - Root directory: `backend`
   - Add environment variables:
     ```
     MONGO_URI=mongodb+srv://...
     JWT_SECRET=your_secret
     NODE_ENV=production
     PORT=5000
     ```

4. **Generate Domain**
   - Go to Settings → Generate Domain
   - Note your backend URL

### Deploy Frontend

1. **Add Frontend Service**
   - In the same project, click "New"
   - Select "GitHub Repo" (same repo)

2. **Configure Frontend Service**
   - Root directory: `./` (project root)
   - Add environment variables:
     ```
     NEXT_PUBLIC_API_URL=https://your-backend.railway.app
     NEXT_PUBLIC_SOCKET_URL=https://your-backend.railway.app
     ```

3. **Generate Domain**
   - Settings → Generate Domain
   - Your frontend will be live

## Option 3: Cyclic (Backend) + Vercel (Frontend)

### Deploy Backend to Cyclic

1. **Create Account**
   - Go to [cyclic.sh](https://cyclic.sh)
   - Sign in with GitHub

2. **Deploy App**
   - Click "Link Your Own"
   - Select repository
   - Set environment variables:
     ```
     MONGO_URI=mongodb+srv://...
     JWT_SECRET=your_secret
     NODE_ENV=production
     ```

3. **Configure**
   - Cyclic auto-detects Node.js apps
   - Entry point: `backend/server.js`
   - Note your backend URL

4. **Deploy Frontend to Vercel**
   - Follow Vercel steps from Option 1

## MongoDB Atlas Configuration for Production

1. **Network Access**
   - Go to Network Access in MongoDB Atlas
   - Add IP: `0.0.0.0/0` (allow all) for simplicity
   - Or add specific IPs of your hosting services

2. **Database User**
   - Ensure you have a database user with read/write permissions
   - Use a strong password
   - Update your `MONGO_URI` with the correct credentials

3. **Connection String**
   - Use the connection string with retry writes enabled
   - Format: `mongodb+srv://user:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`

## Security Checklist for Production

### Backend
- [ ] Environment variables properly set
- [ ] CORS configured with specific origins (not wildcard)
- [ ] MongoDB connection string doesn't contain plain-text password in code
- [ ] Rate limiting implemented (optional but recommended)
- [ ] Helmet.js added for security headers
- [ ] Input validation on all endpoints
- [ ] Error messages don't expose system details

### Frontend
- [ ] API URLs use HTTPS
- [ ] No sensitive data in client-side code
- [ ] Environment variables use NEXT_PUBLIC_ prefix only for public values
- [ ] XSS protection enabled
- [ ] Content Security Policy configured

### Database
- [ ] IP whitelist configured
- [ ] Strong password used
- [ ] Indexes created for performance
- [ ] Backup strategy in place

## Performance Optimization for Production

### Frontend
1. **Enable Static Generation where possible**
   ```javascript
   export const dynamic = 'force-dynamic' // for real-time pages
   export const revalidate = 60 // for dashboard
   ```

2. **Add Image Optimization**
   - Use Next.js Image component
   - Configure image domains in next.config.js

3. **Enable Compression**
   - Vercel handles this automatically
   - For other hosts, use compression middleware

### Backend
1. **Enable Compression**
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```

2. **Add Rate Limiting**
   ```javascript
   const rateLimit = require('express-rate-limit');
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000,
     max: 100
   });
   app.use('/api/', limiter);
   ```

3. **Connection Pooling**
   ```javascript
   mongoose.connect(process.env.MONGO_URI, {
     maxPoolSize: 10,
     minPoolSize: 5
   });
   ```

## Monitoring Setup

### Vercel Analytics
- Enable in Vercel dashboard
- Provides Web Vitals metrics
- No code changes needed

### Backend Monitoring
1. **Add Morgan for HTTP Logs**
   ```javascript
   const morgan = require('morgan');
   app.use(morgan('combined'));
   ```

2. **Add Error Tracking** (Sentry)
   ```javascript
   const Sentry = require('@sentry/node');
   Sentry.init({ dsn: process.env.SENTRY_DSN });
   ```

3. **MongoDB Atlas Monitoring**
   - Built-in monitoring dashboard
   - Set up alerts for performance issues

## CI/CD Pipeline

### GitHub Actions (Example)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        run: curl ${{ secrets.RENDER_DEPLOY_HOOK }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## Post-Deployment Testing

1. **Functionality Tests**
   - [ ] Can create notes
   - [ ] Can edit notes
   - [ ] Auto-save works
   - [ ] Real-time sync works
   - [ ] Version history works
   - [ ] Delete works

2. **Performance Tests**
   - [ ] Page load time < 3s
   - [ ] Time to interactive < 5s
   - [ ] Socket connection establishes quickly
   - [ ] No console errors

3. **Security Tests**
   - [ ] HTTPS enabled
   - [ ] CORS working correctly
   - [ ] No exposed secrets
   - [ ] Rate limiting working (if implemented)

## Troubleshooting Production Issues

### Frontend Not Loading
- Check browser console for errors
- Verify environment variables in Vercel
- Check build logs for errors
- Ensure API URLs are correct (HTTPS)

### Backend Not Connecting
- Check Render/Railway logs
- Verify MongoDB Atlas connection
- Check network access in MongoDB
- Verify environment variables

### WebSocket Issues
- Ensure WebSocket connections allowed by host
- Check CORS configuration
- Verify Socket.IO client connecting to correct URL
- Check for proxy/firewall issues

### Database Connection Fails
- Verify IP whitelist in MongoDB Atlas
- Check connection string format
- Ensure database user has correct permissions
- Check for special characters in password (URL encode them)

## Rollback Strategy

### Vercel
- Go to Deployments
- Find previous working deployment
- Click "..." → "Promote to Production"

### Render/Railway
- Go to deployment history
- Select previous deployment
- Click "Redeploy"

### Database Rollback
- MongoDB Atlas automatic backups (Pro tier)
- Manual exports recommended before major changes

## Cost Estimates

### Free Tier (Suitable for testing)
- **Vercel**: Free (Hobby plan)
- **Render**: Free (limited hours)
- **MongoDB Atlas**: Free (M0 tier, 512MB)
- **Total**: $0/month

### Production Tier
- **Vercel Pro**: $20/month
- **Render Starter**: $7/month
- **MongoDB Atlas M10**: $57/month
- **Total**: ~$84/month

### Scaling Tier
- **Vercel Enterprise**: Custom pricing
- **Render Standard**: $25/month
- **MongoDB Atlas M30**: $210/month
- **Total**: ~$235/month+

## Support and Maintenance

- Monitor error logs daily
- Set up uptime monitoring (UptimeRobot, etc.)
- Regular security updates
- Database backup verification
- Performance monitoring
- User feedback collection

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

Your application is now production-ready! Monitor performance and user feedback to continuously improve the experience.
