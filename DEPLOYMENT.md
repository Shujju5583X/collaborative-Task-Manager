# Deployment Guide - Collaborative Task Manager 🚀

This guide walks you through deploying the Collaborative Task Manager application to production. The frontend will be deployed to **Netlify** and the backend to **Render** (or your preferred platform).

## 📋 Prerequisites

- Git repository with your code (GitHub, GitLab, or Bitbucket)
- Netlify account (sign up at [netlify.com](https://netlify.com))
- Render account (sign up at [render.com](https://render.com)) or another backend hosting service
- PostgreSQL database (Render provides free PostgreSQL)

---

## 🎯 Deployment Overview

```
┌─────────────────┐         ┌─────────────────┐
│   Netlify       │ ◄─────► │   Render        │
│   (Frontend)    │  HTTPS  │   (Backend)     │
│   React + Vite  │         │   Express API   │
└─────────────────┘         └────────┬────────┘
                                     │
                            ┌────────▼────────┐
                            │   PostgreSQL     │
                            │   Database      │
                            └─────────────────┘
```

---

## Part 1: Deploy Backend to Render

### Step 1: Create PostgreSQL Database

1. **Login to Render Dashboard**
   - Go to [render.com](https://render.com) and sign in
   
2. **Create New PostgreSQL Database**
   - Click "New" → "PostgreSQL"
   - **Name**: `task-manager-db`
   - **Database**: `task_manager`
   - **User**: `task_manager_user` (auto-generated)
   - **Region**: Choose closest to your users
   - **Plan**: Free tier is sufficient for testing
   - Click "Create Database"

3. **Save Database Credentials**
   - After creation, copy the **Internal Database URL**
   - It looks like: `postgresql://user:password@hostname:5432/database`
   - You'll need this for the backend service

### Step 2: Deploy Backend Service

1. **Create New Web Service**
   - Click "New" → "Web Service"
   - Connect your Git repository
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Region**: Same as your database
   - **Branch**: `main` (or your default branch)

2. **Configure Build & Start Commands**
   ```
   Build Command: npm install --production=false && npx prisma generate && npm run build
   Start Command: npx prisma migrate deploy && npm start
   ```
   
   > **Important**: The `--production=false` flag ensures TypeScript and other devDependencies are installed for the build process.

3. **Set Environment Variables**
   
   Click "Advanced" → "Add Environment Variable" and add these:

   | Variable Name | Value | Notes |
   |--------------|-------|-------|
   | `DATABASE_URL` | `<your-internal-database-url>` | From Step 1 |
   | `JWT_SECRET` | `<random-secure-string>` | Generate a strong secret ([randomkeygen.com](https://randomkeygen.com)) |
   | `JWT_EXPIRES_IN` | `7d` | Token expiration time |
   | `NODE_ENV` | `production` | Environment mode |
   | `PORT` | `10000` | Default Render port (auto-set) |
   | `CLIENT_URL` | `https://your-app.netlify.app` | You'll update this after frontend deployment |

   > **Generate JWT_SECRET**: Use a secure random string, at least 32 characters
   > ```bash
   > # Generate on your local machine
   > node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   > ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete (5-10 minutes)
   - Once deployed, copy your backend URL: `https://your-app-name.onrender.com`

5. **Update CLIENT_URL**
   - After you deploy the frontend (Part 2), return here
   - Edit the `CLIENT_URL` environment variable with your Netlify URL
   - Service will auto-redeploy

### Step 3: Verify Backend Deployment

Test your backend API:

```bash
# Check health (replace with your URL)
curl https://your-app-name.onrender.com/api/auth/me

# Should return 401 Unauthorized (means API is working)
```

---

## Part 2: Deploy Frontend to Netlify

### Step 1: Prepare the Frontend

The frontend is already configured with `netlify.toml` in the `client` directory.

### Step 2: Deploy to Netlify

#### Option A: Deploy via Git (Recommended)

1. **Login to Netlify Dashboard**
   - Go to [netlify.com](https://netlify.com) and sign in

2. **Create New Site**
   - Click "Add new site" → "Import an existing project"
   - Choose your Git provider (GitHub, GitLab, Bitbucket)
   - Authorize Netlify to access your repository
   - Select your repository

3. **Configure Build Settings**
   
   Netlify should auto-detect settings from `netlify.toml`, but verify:
   
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/dist`
   - **Node version**: `18`

4. **Set Environment Variables**
   
   Before deploying, click "Show advanced" → "New variable":
   
   | Variable Name | Value |
   |--------------|-------|
   | `VITE_API_URL` | `https://your-backend-name.onrender.com/api` |
   
   > ⚠️ **Important**: Replace with your actual Render backend URL from Part 1

5. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete (2-5 minutes)
   - Your site will be live at `https://random-name-12345.netlify.app`

6. **Custom Domain (Optional)**
   - Click "Site settings" → "Domain management"
   - Click "Add custom domain" to use your own domain

#### Option B: Deploy via Netlify CLI

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Navigate to client directory
cd client

# Build the project
npm run build

# Deploy to Netlify
netlify deploy --prod

# Follow the prompts:
# - Authorize your account
# - Create new site or link existing
# - Set publish directory to: dist

# After deployment, configure environment variables in Netlify UI
```

### Step 3: Configure Environment Variables in Netlify UI

1. Go to your site's dashboard on Netlify
2. Click "Site configuration" → "Environment variables"
3. Add `VITE_API_URL` with your Render backend URL
4. Click "Trigger deploy" → "Deploy site" to rebuild with new env vars

### Step 4: Update Backend CLIENT_URL

Now that you have your Netlify URL:

1. Go back to Render dashboard
2. Select your backend service
3. Go to "Environment" tab
4. Update `CLIENT_URL` to your Netlify URL: `https://your-app-name.netlify.app`
5. Service will auto-redeploy

---

## Part 3: Post-Deployment Testing

### 1. Test Basic Functionality

1. **Visit Your Netlify URL**
   - Should see the login/register page

2. **Register a New User**
   - Click "Create Account"
   - Fill in name, email, password
   - Should successfully register and login

3. **Create a Task**
   - Click "Create Task"
   - Add title, description, priority, due date
   - Click "Create"
   - Task should appear in the list

4. **Test Real-time Updates**
   - Open your app in two different browser tabs
   - Create/edit/delete a task in one tab
   - Verify changes appear instantly in the other tab

5. **Test Filtering**
   - Navigate to "My Tasks", "Created By Me", "Overdue"
   - Verify correct tasks appear in each view

### 2. Test on Different Devices

- Desktop browser
- Mobile browser (iOS/Android)
- Tablet

### 3. Check Browser Console

- Open DevTools (F12)
- Look for any errors in Console
- Check Network tab for failed API calls

---

## 🔧 Troubleshooting

### Frontend Issues

#### "Failed to fetch" or CORS errors

**Problem**: Backend not allowing requests from frontend domain

**Solution**: 
1. Check backend `CLIENT_URL` environment variable matches your Netlify URL exactly
2. Ensure there's no trailing slash in `CLIENT_URL`
3. Check Render logs for CORS errors

#### "401 Unauthorized" on all requests

**Problem**: Cookies not being sent/received

**Solution**:
1. Ensure backend `CLIENT_URL` is set correctly
2. Check that both frontend and backend are using HTTPS
3. Verify `withCredentials: true` in axios config (already set)

#### Blank page after deployment

**Problem**: React Router not configured properly

**Solution**:
1. Verify `_redirects` file exists in `client/public/`
2. Check Netlify deploy logs for errors
3. Ensure `netlify.toml` has the redirect rule

### Backend Issues

#### Database connection failed

**Problem**: Backend can't connect to PostgreSQL

**Solution**:
1. Verify `DATABASE_URL` environment variable is correct
2. Check database status in Render dashboard
3. Ensure using **Internal Database URL** not External

#### "Prisma Client not generated"

**Problem**: Prisma client wasn't generated during build

**Solution**:
Update build command to include:
```
npm install && npx prisma generate && npm run build
```

#### Migrations failing

**Problem**: Database schema not up to date

**Solution**:
1. Check migration files in `server/prisma/migrations/`
2. Manually run migrations via Render shell:
   ```bash
   npx prisma migrate deploy
   ```

### Performance Issues

#### Slow first load (Render free tier)

**Problem**: Render free tier spins down after 15 minutes of inactivity

**Solution**:
- First request after idle takes 30-60 seconds
- Consider upgrading to paid tier, or
- Use a service like [cron-job.org](https://cron-job.org) to ping your backend every 10 minutes

---

## 🔐 Security Checklist

- [ ] JWT_SECRET is a strong random string (not the default)
- [ ] DATABASE_URL is not exposed in frontend code
- [ ] CLIENT_URL exactly matches your Netlify domain
- [ ] Using HTTPS for both frontend and backend
- [ ] Environment variables set in hosting platforms (not in code)
- [ ] `.env` files are in `.gitignore`

---

## 🔄 Continuous Deployment

Both Netlify and Render support automatic deployments:

- **Netlify**: Automatically rebuilds frontend on every push to your main branch
- **Render**: Automatically rebuilds backend on every push to your main branch

To disable auto-deploy:
- **Netlify**: Site settings → Build & deploy → Continuous deployment → Edit settings
- **Render**: Service → Settings → Build & deploy → Auto-deploy

---

## 📊 Monitoring

### Netlify Analytics

- Click "Analytics" in Netlify dashboard
- View traffic, performance, and bandwidth usage

### Render Logs

- Click your service → "Logs" tab
- View real-time application logs
- Monitor errors and warnings

---

## 💰 Cost Breakdown

### Free Tier Limits

| Service | Free Tier Includes |
|---------|-------------------|
| **Netlify** | 100GB bandwidth/month, 300 build minutes/month |
| **Render** | 750 hours/month, 512MB RAM, Spins down after 15min idle |
| **Render PostgreSQL** | 90 days retention, 1GB storage |

> ⚠️ **Note**: Render free PostgreSQL databases expire after 90 days. You'll need to upgrade to a paid plan or export/import your data.

---

## 🚀 Next Steps

After successful deployment:

1. **Custom Domain**: Set up a custom domain on Netlify
2. **SSL Certificate**: Netlify provides free SSL automatically
3. **Monitoring**: Set up error tracking (Sentry, LogRocket)
4. **Analytics**: Add Google Analytics or Plausible
5. **Backup**: Set up automated database backups
6. **Testing**: Set up staging environment for testing changes

---

## 🆘 Need Help?

If you encounter issues:

1. Check the [Netlify Docs](https://docs.netlify.com)
2. Check the [Render Docs](https://render.com/docs)
3. Review application logs in both platforms
4. Open an issue in your repository

---

## 📝 Deployment URLs

After deployment, update these:

- **Frontend URL**: `https://_____.netlify.app`
- **Backend URL**: `https://_____.onrender.com`
- **Database**: `Render PostgreSQL`

---

**Congratulations! Your Collaborative Task Manager is now live! 🎉**
