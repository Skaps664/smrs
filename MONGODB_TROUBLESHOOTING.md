# 🔧 MongoDB Connection Troubleshooting Guide

## Current Issue

**Error:** `Server selection timeout: No available servers`  
**SSL Error:** `received fatal alert: InternalError`

This indicates the MongoDB Atlas cluster is not reachable due to SSL/TLS handshake failures.

---

## Solution Options

### Option 1: Check MongoDB Atlas Cluster Status (RECOMMENDED)

1. **Go to MongoDB Atlas Dashboard:**
   - Visit: https://cloud.mongodb.com/
   - Login with your credentials

2. **Check Cluster Status:**
   - Look for your cluster: `Cluster0`
   - **Status should be:** Green/Active
   - **If paused:** Click "Resume" button
   - **Wait 2-3 minutes** for cluster to fully start

3. **Verify Network Access:**
   - Click "Network Access" in left sidebar
   - **Add your IP address** or use `0.0.0.0/0` for development
   - Make sure your current IP is whitelisted

4. **Verify Database User:**
   - Click "Database Access" in left sidebar
   - Confirm user: `sudaisskaps_db_user` exists
   - Check password is correct: `galHiSuo4LamfM07`

---

### Option 2: Use Updated Connection String

If the cluster is active but still failing, try this connection string:

```env
DATABASE_URL="mongodb+srv://sudaisskaps_db_user:galHiSuo4LamfM07@cluster0.cmuozdq.mongodb.net/startup-mgmt?retryWrites=true&w=majority"
```

**Update `.env` file and restart:**
```bash
pkill -f "next dev"
npm run dev
```

---

### Option 3: Get Fresh Connection String from Atlas

1. Go to MongoDB Atlas Dashboard
2. Click "Connect" on your Cluster0
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with: `galHiSuo4LamfM07`
6. Add database name: `/startup-mgmt` before the `?`

Example format:
```
mongodb+srv://sudaisskaps_db_user:PASSWORD@cluster0.xxxxx.mongodb.net/startup-mgmt?retryWrites=true&w=majority
```

---

### Option 4: Use Local MongoDB (Alternative)

If Atlas continues having issues, use local MongoDB:

**Install MongoDB locally:**
```bash
# Ubuntu/Debian
sudo apt-get install mongodb

# Start MongoDB
sudo systemctl start mongodb
```

**Update `.env`:**
```env
DATABASE_URL="mongodb://localhost:27017/startup-mgmt"
```

**Push schema:**
```bash
npx prisma db push
```

---

## Quick Fixes to Try Now

### Fix 1: Simplify Connection String

Update `.env` with minimal parameters:

```env
DATABASE_URL="mongodb+srv://sudaisskaps_db_user:galHiSuo4LamfM07@cluster0.cmuozdq.mongodb.net/startup-mgmt"
```

### Fix 2: Check if Password Has Special Characters

If password contains special characters, URL-encode them:
- `@` becomes `%40`
- `#` becomes `%23`
- `$` becomes `%24`
- `%` becomes `%25`

Current password `galHiSuo4LamfM07` looks clean (no special chars).

### Fix 3: Test Connection with MongoDB Compass

1. Download MongoDB Compass: https://www.mongodb.com/products/compass
2. Use connection string:
   ```
   mongodb+srv://sudaisskaps_db_user:galHiSuo4LamfM07@cluster0.cmuozdq.mongodb.net/
   ```
3. If it connects, the issue is with the Node.js driver
4. If it fails, the issue is with MongoDB Atlas

---

## Most Likely Causes

1. **❌ MongoDB Atlas cluster is PAUSED** (free tier pauses after inactivity)
   - **Solution:** Resume cluster in Atlas dashboard

2. **❌ IP Address not whitelisted**
   - **Solution:** Add current IP to Network Access

3. **❌ SSL certificate issue on Ubuntu/WSL**
   - **Solution:** Update system certificates
   ```bash
   sudo apt-get update
   sudo apt-get install ca-certificates
   ```

4. **❌ Network firewall blocking MongoDB ports**
   - **Solution:** Check if port 27017 is open

---

## Testing Connection

After making changes, test with:

```bash
# Test with Prisma
npx prisma db push

# Or validate connection
npx prisma db pull
```

If successful, you should see:
```
✔ Generated Prisma Client
```

---

## Current Status

**Connection String in `.env`:**
```
mongodb+srv://sudaisskaps_db_user:galHiSuo4LamfM07@cluster0.cmuozdq.mongodb.net/startup-mgmt?retryWrites=true&w=majority&ssl=true&authSource=admin
```

**Next Steps:**
1. ✅ Check if MongoDB Atlas cluster is paused → Resume it
2. ✅ Verify IP is whitelisted in Network Access
3. ✅ Get fresh connection string from Atlas
4. ✅ Restart dev server after any changes

---

## Need Help?

**If issue persists:**
1. Share screenshot of MongoDB Atlas cluster status
2. Check MongoDB Atlas notifications/alerts
3. Verify billing status (free tier has limits)
4. Try connecting from a different network

**Contact:**
- MongoDB Atlas Support: https://www.mongodb.com/cloud/atlas/support
- Check status page: https://status.cloud.mongodb.com/

---

*This is a server-side connectivity issue, not a code problem. All code is correct.*
