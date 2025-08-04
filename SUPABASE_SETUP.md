# Supabase Setup Guide

## Step 1: Create Supabase Account
1. Go to https://supabase.com/
2. Sign up with GitHub
3. Create a new project named "query-management-db"
4. Choose a region (closest to your users)
5. Set a strong database password

## Step 2: Get Database Connection Details
After project creation, go to Settings > Database:
- Host: db.[your-project-ref].supabase.co
- Database name: postgres
- Port: 5432
- User: postgres
- Password: [the password you set]

## Step 3: Connection URL Format
Your connection URL will look like:
```
postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
```

## Step 4: Enable Row Level Security (Optional)
In SQL Editor, run:
```sql
-- Enable RLS for security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
```
