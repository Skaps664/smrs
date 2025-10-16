# 🚀 Vercel Deployment Guide

## Important: Environment Variables for Production

### What You Need to Know About `NEXTAUTH_URL`

**For Local Development:**
```env
NEXTAUTH_URL="http://localhost:3000"
```

**For Vercel Production:**
```env
NEXTAUTH_URL="https://your-app-name.vercel.app"
```

**Good News:** On Vercel, you **DON'T need to set `NEXTAUTH_URL` manually!** 

Vercel automatically sets it based on your deployment URL. However, you can manually set it if needed.

---

## 📋 Step-by-Step Vercel Deployment

### Step 1: Prepare Your Repository

Your code is already on GitHub at: `Skaps664/smrs`

Make sure all files are committed:
```bash
cd /home/skaps/autoStart/startup-mgmt-system
git add .
git commit -m "Ready for production deployment"
git push origin master
```

---

### Step 2: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel:**
   - Visit: https://vercel.com/
   - Sign in with GitHub

2. **Import Project:**
   - Click "Add New" → "Project"
   - Select your repository: `Skaps664/smrs`
   - Click "Import"

3. **Configure Project:**
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (leave as default)
   - **Build Command:** `npm run build` (auto-filled)
   - **Output Directory:** `.next` (auto-filled)

4. **Add Environment Variables:**
   Click "Environment Variables" and add:

   ```
   DATABASE_URL=mongodb+srv://sudaisskaps_db_user:galHiSuo4LamfM07@cluster0.cmuozdq.mongodb.net/startup-mgmt
   
   NEXTAUTH_SECRET=KnO+vhZ16hX+AEmDdPNFbJWg0eiRz0Q41J7qMjyIcdo=
   ```

   **Note:** `NEXTAUTH_URL` is NOT needed - Vercel sets it automatically!

5. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - Your app will be live at: `https://your-app-name.vercel.app`

#### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: smrs (or your choice)
# - Directory: ./ (current)
# - Override settings? No

# Add environment variables
vercel env add DATABASE_URL
# Paste: mongodb+srv://sudaisskaps_db_user:galHiSuo4LamfM07@cluster0.cmuozdq.mongodb.net/startup-mgmt

vercel env add NEXTAUTH_SECRET
# Paste: KnO+vhZ16hX+AEmDdPNFbJWg0eiRz0Q41J7qMjyIcdo=

# Deploy to production
vercel --prod
```

---

## 🔐 Security: Environment Variables

### ✅ What Gets Deployed:
- All your code
- Public files
- Build output

### ❌ What NEVER Gets Deployed:
- `.env` file (ignored by `.gitignore`)
- Sensitive credentials
- API keys

### 📝 Environment Variables to Set on Vercel:

| Variable | Value | Required |
|----------|-------|----------|
| `DATABASE_URL` | Your MongoDB connection string | ✅ Yes |
| `NEXTAUTH_SECRET` | Your NextAuth secret key | ✅ Yes |
| `NEXTAUTH_URL` | Auto-set by Vercel | ❌ No (optional) |

---

## 🔧 Post-Deployment Configuration

### 1. Update MongoDB Atlas Network Access

After deployment, Vercel will connect from different IP addresses.

**Option A: Allow All IPs (Easiest for Vercel)**
1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere"
4. Enter: `0.0.0.0/0`
5. Click "Confirm"

**Option B: Add Vercel IP Ranges (More Secure)**
Get Vercel IPs from: https://vercel.com/docs/concepts/solutions/domains#dns-records

### 2. Test Your Production App

1. Visit your Vercel URL: `https://your-app-name.vercel.app`
2. Test registration: Create a new account
3. Test login: Sign in with your account
4. Test all features: Create startup, add weekly tracker, etc.

### 3. Custom Domain (Optional)

If you have a custom domain:

1. **In Vercel Dashboard:**
   - Go to Project Settings → Domains
   - Add your domain (e.g., `dekord-tracker.com`)
   - Follow DNS configuration instructions

2. **Update MongoDB Atlas:**
   - No changes needed (IP whitelist covers all)

3. **Update Environment Variable (if needed):**
   - In Vercel Dashboard → Settings → Environment Variables
   - Update `NEXTAUTH_URL` to your custom domain
   - Example: `https://dekord-tracker.com`
   - Redeploy: Vercel → Deployments → Click "..." → Redeploy

---

## 🎯 Vercel-Specific Features

### Automatic HTTPS
- ✅ Vercel automatically provides SSL certificates
- ✅ Your app will be `https://` by default
- ✅ No configuration needed!

### Automatic Deployments
- ✅ Every `git push` to `master` auto-deploys
- ✅ Preview deployments for pull requests
- ✅ Instant rollbacks if needed

### Environment Variables Per Environment
You can set different values for:
- **Production:** `master` branch
- **Preview:** Pull requests
- **Development:** Local `.env`

---

## 🐛 Troubleshooting

### Build Fails on Vercel

**Error:** `Module not found`
```bash
# Solution: Make sure all dependencies are in package.json
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

### Authentication Not Working

**Error:** `[next-auth][error][CLIENT_FETCH_ERROR]`

**Solution:** Check environment variables in Vercel:
1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify `NEXTAUTH_SECRET` is set correctly
3. Redeploy after adding/updating variables

### Database Connection Fails

**Error:** `P2010: Raw query failed`

**Solution:** 
1. Check MongoDB Atlas → Network Access
2. Add `0.0.0.0/0` to allow Vercel IPs
3. Verify `DATABASE_URL` in Vercel environment variables
4. Make sure MongoDB cluster is not paused

### 404 on Refresh

**Error:** Page works on first load but 404 on refresh

**Solution:** This shouldn't happen with Next.js App Router, but if it does:
1. Check `vercel.json` (create if needed):
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ]
}
```

---

## 📊 Monitoring Your Production App

### Vercel Analytics (Built-in)
1. Go to Vercel Dashboard → Your Project → Analytics
2. See:
   - Page views
   - Unique visitors
   - Performance metrics
   - Error rates

### Function Logs
1. Go to Vercel Dashboard → Your Project → Functions
2. Click on any function to see logs
3. Monitor API route performance

---

## 🔄 Updating Your Production App

### Quick Updates:
```bash
# Make changes locally
# Test thoroughly

# Commit and push
git add .
git commit -m "Update: description of changes"
git push origin master

# Vercel automatically deploys!
```

### Rollback if Needed:
1. Go to Vercel Dashboard → Deployments
2. Find last working deployment
3. Click "..." → "Promote to Production"

---

## 💡 Pro Tips for Production

### 1. Generate New NEXTAUTH_SECRET for Production
For better security, generate a new secret:
```bash
openssl rand -base64 32
```
Then update in Vercel environment variables.

### 2. Enable Vercel Password Protection (Optional)
For private beta testing:
1. Vercel Dashboard → Settings → Password Protection
2. Enable and set password
3. Share password with beta testers

### 3. Set Up Custom Error Pages (Optional)
Create `app/error.tsx` and `app/not-found.tsx` for better UX.

### 4. Monitor Database Usage
Check MongoDB Atlas → Metrics to ensure you're within free tier limits:
- Storage: 512 MB
- Connections: 500

---

## ✅ Pre-Deployment Checklist

- [ ] All code committed and pushed to GitHub
- [ ] MongoDB Atlas cluster is active
- [ ] MongoDB Atlas allows connections from anywhere (`0.0.0.0/0`)
- [ ] `.env` file is in `.gitignore` (already done)
- [ ] Database credentials are secure
- [ ] Ready to set environment variables in Vercel

---

## 🎉 After Deployment

**Your app will be live at:**
```
https://your-app-name.vercel.app
```

**Share it with:**
- Your incubation center mentors
- Potential investors
- Team members
- dekord stakeholders

---

## 📞 Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Vercel Support:** https://vercel.com/support
- **Next.js Deployment:** https://nextjs.org/docs/deployment

---

*Your app is production-ready! Just push to GitHub and deploy on Vercel.* 🚀
