# 🚀 QUICK START GUIDE - Manual Setup

## ⚠️ Bash temporarily restricted - Follow these manual steps instead

---

## **STEP 1: Create `.env` File**

### Windows (Easy Method):

1. **Open File Explorer**
   - Navigate to: `D:\Dev\Projects\Personal\portfolio`

2. **Create new file**
   - Right-click in empty space
   - Select "New" → "Text Document"
   - Name it: `.env`
   - When it says "keep .txt extension?", click "No"

3. **Edit the file**
   - Right-click `.env`
   - Select "Open with" → "Notepad"
   - Paste this content:

```
NODE_ENV=development
PORT=3000
APP_ORIGIN=http://localhost:3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/karachi_cinematic
SESSION_SECRET=super-secret-key-change-this-in-production-12345
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin123!
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=noreply@karachi-cinematic.local
CSRF_TOKEN_LENGTH=32
```

4. **Save and close**

---

## **STEP 2: Start Docker PostgreSQL**

### Open PowerShell as Administrator:

1. **Right-click on PowerShell icon**
   - Select "Run as Administrator"

2. **Navigate to project**
   ```
   cd D:\Dev\Projects\Personal\portfolio
   ```

3. **Start Docker Compose**
   ```
   docker compose up -d
   ```

4. **Verify it's running**
   ```
   docker compose ps
   ```

   **Should show:**
   ```
   CONTAINER ID   IMAGE                    STATUS
   xxxxxx         postgres:16-alpine       Up X seconds
   ```

---

## **STEP 3: Install Dependencies**

### In the same PowerShell window:

```
npm install
```

**Wait for it to finish (1-2 minutes)**

You'll see:
```
added XX packages in XXs
```

---

## **STEP 4: Setup Database**

### Run migrations:

```
npm run db:migrate
```

**Wait for completion. You'll see:**
```
✓ Your database is now in sync with your schema
```

### Seed database with initial data:

```
npm run db:seed
```

**Wait for completion. You'll see:**
```
✓ Admin user created: admin@example.com
✓ Created 5 sources
✓ Created 5 landmarks
✨ Database seeded successfully!
```

---

## **STEP 5: Start the Server**

### In same PowerShell:

```
npm run dev
```

**You should see:**
```
✓ Database connected

🚀 Server running on http://localhost:3000
   Environment: development
```

**KEEP THIS TERMINAL OPEN**

---

## **STEP 6: Open Website**

### In your web browser:

1. **Click this link or copy-paste into address bar:**
   ```
   http://localhost:3000
   ```

2. **You should see:**
   - ✅ "KARACHI, PAKISTAN" logo
   - ✅ "KARACHI" hero title
   - ✅ Mazar-e-Quaid image (or placeholder)
   - ✅ Three colored buttons
   - ✅ Navigation menu (INTRO, MAZAR, HERITAGE, COAST, SIGHTS)

---

## **✅ TEST IT WORKS**

### **Test 1: Try Registration**

1. Click **"LOGIN"** button (top right)
2. Click **"Create account"** link
3. Fill form:
   - Display Name: `Test User`
   - Email: `test@example.com`
   - Password: `TestPass123!`
   - Confirm: `TestPass123!`
4. Click **"Create Account"**
5. Should go to account page showing your profile ✅

---

### **Test 2: Try Admin Login**

1. Click **"LOGIN"**
2. Enter:
   - Email: `admin@example.com`
   - Password: `Admin123!`
3. Click **"Sign In"**
4. Should see account page ✅
5. Look for **"ADMIN"** button in top right (only shows for admin)
6. Click **"ADMIN"** to see admin dashboard ✅

---

### **Test 3: Try Navigation**

1. Click "MAZAR" → scrolls to mazar section ✅
2. Click "HERITAGE" → scrolls to heritage section ✅
3. Click "COAST" → scrolls to coast section ✅
4. Click "SIGHTS" → scrolls to sights slider ✅

---

### **Test 4: Try Slider**

1. Scroll down to "SIGHTS" section
2. Should see 5 landmark cards
3. Click **"→"** button (next) - slides right ✅
4. Click **"←"** button (prev) - slides left ✅

---

## **🛑 TROUBLESHOOTING**

### **Problem: Can't access http://localhost:3000**

**Solution:**
- Check terminal still shows "🚀 Server running on http://localhost:3000"
- If not, run `npm run dev` again
- Wait 2-3 seconds for server to start

---

### **Problem: "Cannot find module" error**

**Solution:**
```
npm install
```

---

### **Problem: Database error**

**Solution:**
```
docker compose ps
```

If PostgreSQL isn't running:
```
docker compose up -d
```

Then run:
```
npm run db:migrate
npm run db:seed
```

---

### **Problem: Port 3000 already in use**

**Solution:** Use different port:
```
$env:PORT=3001
npm run dev
```

Then visit: `http://localhost:3001`

---

### **Problem: Images not showing**

**Normal!** Images link to Wikimedia Commons online. If you're offline, they won't show but site still works.

---

## **📋 QUICK COMMANDS REFERENCE**

| Action | Command |
|--------|---------|
| Start server | `npm run dev` |
| Stop server | Press `Ctrl + C` in terminal |
| Stop database | `docker compose down` |
| Start database again | `docker compose up -d` |
| Restart everything | `docker compose down && docker compose up -d && npm run dev` |

---

## **✨ YOUR SITE IS NOW RUNNING!**

**Public Website:**
- Home: http://localhost:3000
- Login: http://localhost:3000/login
- Register: http://localhost:3000/register
- Admin: http://localhost:3000/admin (only when logged in as admin)
- Privacy: http://localhost:3000/privacy
- Terms: http://localhost:3000/terms
- Sources: http://localhost:3000/sources

---

## **🔐 Default Admin Account**

```
Email: admin@example.com
Password: Admin123!
```

**⚠️ Change this in production!**

---

## **📁 Project Structure**

```
✅ server/             - Backend code
✅ public/             - Website files (HTML, CSS, JS)
✅ prisma/             - Database setup
✅ docs/               - Documentation
✅ .env                - Your configuration (you created this)
✅ package.json        - Dependencies
✅ docker-compose.yml  - PostgreSQL setup
```

---

## **Need Help?**

1. **Check terminal** - error messages tell you what's wrong
2. **Restart server** - often fixes issues
3. **Check firewall** - make sure port 3000 isn't blocked
4. **Check Docker** - make sure PostgreSQL container is running

---

## **What's Running Now?**

- ✅ **Website** on http://localhost:3000
- ✅ **PostgreSQL Database** (Docker container)
- ✅ **Admin account** ready to use
- ✅ **5 landmarks** loaded in database
- ✅ **Authentication system** working
- ✅ **All pages** accessible

---

**🎉 Congratulations! Your Karachi cinematic website is LIVE!**

