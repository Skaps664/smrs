# 🚀 Quick Start Guide - SMRS

## Setup Instructions (5 minutes)

### Step 1: Setup MongoDB Database

You need a MongoDB database. Choose one option:

#### Option A: MongoDB Atlas (Easiest - Free Cloud Database)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up for a free account
3. Create a **FREE M0 Cluster** (512MB)
4. Click **"Connect"** on your cluster
5. Create a database user:
   - Username: `admin`
   - Password: (create a secure password)
   - Save this password!
6. Choose **"Connect your application"**
7. Copy the connection string (looks like: `mongodb+srv://admin:<password>@...`)
8. Replace `<password>` with your actual password

#### Option B: Local MongoDB (If you have MongoDB installed)

If MongoDB is already running locally:
```bash
# Your connection string:
mongodb://localhost:27017/startup-mgmt
```

### Step 2: Configure Environment

Edit the `.env` file in the project root:

```bash
# Replace this with YOUR MongoDB connection string from Step 1
DATABASE_URL="mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/startup-mgmt?retryWrites=true&w=majority"

# These are already set correctly:
NEXTAUTH_SECRET="KnO+vhZ16hX+AEmDdPNFbJWg0eiRz0Q41J7qMjyIcdo="
NEXTAUTH_URL="http://localhost:3000"
```

⚠️ **IMPORTANT**: Replace the entire `DATABASE_URL` with your connection string from MongoDB Atlas!

### Step 3: Push Database Schema

```bash
cd /home/skaps/autoStart/startup-mgmt-system

# Push the schema to your database
npx prisma db push
```

You should see: ✔ "Your database is now in sync with your Prisma schema."

### Step 4: Run the App

```bash
npm run dev
```

### Step 5: Open in Browser

Go to http://localhost:3000

You should see the landing page!

## First Time Usage

1. Click **"Get Started Free"**
2. Register with:
   - Name: Your Name
   - Email: test@example.com
   - Password: password123

3. Login with your credentials

4. Create your startup profile:
   - Startup Name: dekord
   - Founders: M. Sudais Khan
   - Industry: Technology
   - Niche: Hardware/Electronics
   - Current Stage: Incubation

5. Explore the features:
   - Dashboard - See overview
   - Startup Profile - Edit details
   - Weekly Tracker - Log progress

## Troubleshooting

### Error: "no record found for Query"
- Your MongoDB connection string is incorrect
- Make sure you replaced `DATABASE_URL` in `.env` with your actual MongoDB Atlas connection string

### Error: "Authentication failed"
- Check your MongoDB username and password in the connection string
- Make sure you copied the password correctly (no spaces)

### Error: "Prisma Client Not Found"
```bash
npx prisma generate
npm run dev
```

### Can't connect to database
- **MongoDB Atlas**: 
  - Go to Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
  - Or add your current IP address

## Need Help?

1. Check `.env` file has correct DATABASE_URL
2. Verify MongoDB Atlas cluster is running
3. Check Network Access allows your IP
4. Try local MongoDB if Atlas doesn't work

## What's Working Now?

✅ User Registration & Login
✅ Startup Profile Creation & Editing
✅ Weekly Progress Tracking
✅ Dashboard Overview
✅ Responsive Navigation

## What Needs to be Built?

🔧 Monthly Tracker
🔧 KPI Dashboard with Charts
🔧 Timeline/Milestone Tracker
🔧 Document Management
🔧 Mentor Feedback System
🔧 PDF Report Generation

See README.md for full documentation!
