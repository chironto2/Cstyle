# ⚡ Quick Start Guide - Cstyle

Get Cstyle running on localhost in 5 minutes!

## Step 1: Install Dependencies (2 min)

```bash
npm install
```

## Step 2: Start MongoDB

### Option A: Local MongoDB (Recommended)

```bash
# Windows: MongoDB should auto-start
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# Verify it's running:
mongosh
```

### Option B: Skip this step if using MongoDB Atlas

If you have a cloud MongoDB URI, it's already in `.env.local`

## Step 3: Seed Database (1 min)

```bash
npm run seed
```

**This creates:**

- ✅ Admin account: admin@cstyle.com / admin123
- ✅ Regular user: user@example.com / user123
- ✅ 4 Product categories
- ✅ 4 Sample products

## Step 4: Start Development Server (2 min)

```bash
npm run dev
```

**Server starts at:** http://localhost:3000

## ✅ You're Done!

### Try These:

1. **Browse as Customer**:

   - Go to http://localhost:3000/shop
   - View products, add to cart

2. **Login as Admin**:

   - Go to http://localhost:3000/login
   - Email: `admin@cstyle.com`
   - Password: `admin123`
   - Access admin dashboard: http://localhost:3000/admin/dashboard

3. **Login as User**:
   - Go to http://localhost:3000/login
   - Email: `user@example.com`
   - Password: `user123`
   - Go to dashboard: http://localhost:3000/dashboard

---

## 🆘 Troubleshooting

### "MongoDB Connection Failed"

```bash
# Check if MongoDB is running
mongosh

# If not found, install it:
# Windows: Download from mongodb.com/download
# Mac: brew install mongodb-community
# Linux: sudo apt-get install mongodb
```

### "npm install fails"

```bash
# Clear cache and retry
npm cache clean --force
npm install
```

### "Port 3000 already in use"

```bash
# Windows (PowerShell as Admin):
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess

# Mac/Linux:
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### "Seed script fails"

1. Ensure MongoDB is running: `mongosh`
2. Check `.env.local` exists with `MONGODB_URI`
3. Clear database: `mongosh` → `db.dropDatabase()`
4. Retry: `npm run seed`

---

## 📚 Next Steps

- Read full [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed information
- Explore admin features at `/admin`
- Check API documentation at `/api` endpoints
- Review type definitions in `src/types/index.ts`

---

## 🚀 One-Command Setup (Requires Bash)

```bash
# Linux/Mac:
chmod +x scripts/quickstart.sh && ./scripts/quickstart.sh

# Windows PowerShell:
.\scripts\quickstart.bat
```

---

**Happy Coding! 🎉**
