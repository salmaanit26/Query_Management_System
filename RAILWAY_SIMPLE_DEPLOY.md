# 🚀 **Deploy to Railway - Complete Guide**

## **Step-by-Step Railway Deployment:**

### **1. Create Railway Account**
- Go to: https://railway.app
- Click **"Login with GitHub"**
- Authorize Railway to access your repositories

### **2. Deploy Your Project**
- Click **"New Project"**
- Select **"Deploy from GitHub repo"**
- Choose: `salmaanit26/Query_Management_System`
- Railway will **automatically detect** it's a Java Spring Boot app!

### **3. Configure Environment Variables**
In Railway dashboard → **Variables** tab, add these:

| Variable Name | Variable Value |
|---------------|----------------|
| `DATABASE_URL` | `postgresql://postgres:[salmaaN_20]@db.juulbplyppgklawlxwjd.supabase.co:5432/postgres` |
| `SPRING_PROFILES_ACTIVE` | `railway` |
| `RAILWAY_SERVICE_ROOT` | `loginapp` |

### **4. Deploy & Test**
- Railway automatically builds and deploys
- Your app will be live at: `https://your-app-name.railway.app`
- Test: `https://your-app-name.railway.app/api/health`

### **5. Update Frontend**
Copy your Railway URL and update `login-frontend/.env.production`:
```
REACT_APP_API_URL=https://your-app-name.railway.app/api
```

## **🎯 Why Railway is Perfect:**
- ✅ **Auto-detects Java** Spring Boot
- ✅ **Zero configuration** needed
- ✅ **Free $5/month credit**
- ✅ **Fast deployment**
- ✅ **Reliable service**

## **🎉 Total Time: 10 minutes**
## **🎉 Total Cost: $0**
