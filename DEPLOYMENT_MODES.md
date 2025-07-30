# Query Management System - Deployment Modes

## 🎯 Available Modes

Your Query Management System now supports multiple deployment modes:

### 1. 📱 Demo Mode (SQLite) - CURRENT WORKING VERSION
- **Database:** SQLite (file-based)
- **Use Case:** Quick testing, development, demo purposes
- **Data Persistence:** Local file only
- **Deployment:** GitHub Pages frontend + Local/Codespaces backend

### 2. 🚀 Production Mode (MySQL) - FULL FEATURES
- **Database:** MySQL with persistent storage
- **Use Case:** Production deployment, multi-user environment
- **Data Persistence:** Full database with relationships
- **Deployment:** Vercel/Cloud hosting with database

### 3. ☁️ Cloud Mode (PlanetScale)
- **Database:** PlanetScale MySQL (cloud-hosted)
- **Use Case:** Scalable production deployment
- **Data Persistence:** Cloud database with automatic backups
- **Deployment:** Vercel with PlanetScale integration

## 🔧 How to Switch Modes

### For Local Development:

#### Start Demo Mode (SQLite):
```bash
./start-demo.sh
```

#### Start Full Features (MySQL):
```bash
./start-mysql.sh
```

### For Production Deployment:

#### GitHub Pages + Codespaces (Current):
- Frontend: https://salmaanit26.github.io/Query_Management_System
- Backend: Codespaces with MySQL container
- Status: ✅ **Currently Working**

#### Vercel Deployment (Full Features):
- Frontend + Backend: Single URL
- Database: PlanetScale MySQL
- Status: 🔧 **Ready to Deploy**

## 📊 Feature Comparison

| Feature | Demo Mode | MySQL Mode | Cloud Mode |
|---------|-----------|------------|------------|
| Google Sign-In | ✅ | ✅ | ✅ |
| User Management | ⚠️ Limited | ✅ Full | ✅ Full |
| Query Management | ⚠️ Local | ✅ Persistent | ✅ Persistent |
| File Uploads | ❌ | ✅ | ✅ |
| Multi-user Support | ❌ | ✅ | ✅ |
| Data Backup | ❌ | ✅ Manual | ✅ Automatic |
| Scalability | ❌ | ⚠️ Limited | ✅ High |

## 🛡️ Backup & Safety

### Current Backup Strategy:
- **demo-mode-backup** branch: Contains your current working version
- **main** branch: Enhanced version with MySQL support
- **GitHub Repository:** Full version history preserved

### To Restore Demo Mode:
```bash
git checkout demo-mode-backup
```

### To Return to Enhanced Version:
```bash
git checkout main
```

## ⚡ Quick Commands

### Check Backend Status:
```bash
curl http://localhost:8080/api/health
```

### View Database Type:
- Open frontend → Check notification banner color:
  - 🔵 Blue: Frontend only (no backend)
  - 🟡 Yellow: Backend + SQLite (demo mode)
  - 🟢 Green: Backend + MySQL (full features)

### Switch Database Mode:
1. Stop current backend (Ctrl+C)
2. Run desired startup script:
   - `./start-demo.sh` for SQLite
   - `./start-mysql.sh` for MySQL

## 🎯 Next Steps

1. **Current Working:** Demo mode with GitHub Pages ✅
2. **Enhanced Local:** MySQL mode for full features 🔧
3. **Production Ready:** Vercel deployment 🚀

Choose the mode that best fits your current needs!
