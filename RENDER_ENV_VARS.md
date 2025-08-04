# 🔧 Environment Variables for Render Deployment

## Add these in Render's Environment Variables section:

| Variable Name | Variable Value |
|---------------|----------------|
| `DATABASE_URL` | `postgresql://postgres:[salmaaN_20]@db.juulbplyppgklawlxwjd.supabase.co:5432/postgres` |
| `SPRING_PROFILES_ACTIVE` | `render` |
| `PORT` | `8080` |

## Step-by-Step:

### Variable 1:
- **Name**: `DATABASE_URL`
- **Value**: `postgresql://postgres:[salmaaN_20]@db.juulbplyppgklawlxwjd.supabase.co:5432/postgres`

### Variable 2:
- **Name**: `SPRING_PROFILES_ACTIVE` 
- **Value**: `render`

### Variable 3:
- **Name**: `PORT`
- **Value**: `8080`

## How to Add:
1. Click "Add Environment Variable"
2. Enter the Name in first field
3. Enter the Value in second field
4. Click "Add" or "Save"
5. Repeat for all 3 variables

## Important Notes:
- Copy-paste the DATABASE_URL exactly as shown
- Make sure there are no extra spaces
- The password in brackets should be: [salmaaN_20]
