# 🚀 **Deploy to Heroku via GitHub Integration**

Since Heroku CLI login is having IP issues, let's use GitHub integration instead!

## **Step 1: Create Heroku Account & App**

1. **Go to**: https://heroku.com → Sign up / Login
2. **Create New App**: 
   - Click "New" → "Create new app"
   - App name: `college-queries-api` (or any available name)
   - Region: Choose closest to you
   - Click "Create app"

## **Step 2: Connect to GitHub**

1. **In your Heroku app dashboard** → Go to "Deploy" tab
2. **Deployment method** → Choose "GitHub"
3. **Connect to GitHub** → Authorize Heroku
4. **Search for repository**: `Query_Management_System`
5. **Connect** to your repository

## **Step 3: Set Environment Variables**

1. Go to **"Settings"** tab in your Heroku app
2. Click **"Reveal Config Vars"**
3. Add these variables:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | `postgresql://postgres:[salmaaN_20]@db.juulbplyppgklawlxwjd.supabase.co:5432/postgres` |
| `SPRING_PROFILES_ACTIVE` | `heroku` |

## **Step 4: Deploy Backend Only**

Since your backend is in the `loginapp` folder, we need to configure Heroku to deploy only that folder:

1. **In Settings tab** → **Buildpacks** → **Add buildpack**
2. Add: `https://github.com/timanovsky/subdir-heroku-buildpack.git`
3. Add: `heroku/java` (this should be second)

4. **In Config Vars**, add:
   - `PROJECT_PATH` = `loginapp`

## **Step 5: Deploy**

1. **Go to Deploy tab**
2. **Manual deploy** → Choose `main` branch
3. **Click "Deploy Branch"**
4. **Wait for build to complete** (5-10 minutes)

## **Step 6: Test Deployment**

Visit: `https://your-app-name.herokuapp.com/api/health`

You should see: `{"status": "UP", "message": "Application is running"}`

---

## 🎯 **Quick Alternative: Use Web Interface**

If the above doesn't work, try this simpler approach:

1. **Push your latest code to GitHub first**
2. **Use Heroku's web interface** for everything
3. **No CLI needed** - all done through browser

Would you like to try this GitHub integration method?
