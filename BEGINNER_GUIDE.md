# 📖 STEP-BY-STEP VISUAL GUIDE

## **For Complete Beginners - Follow Exactly**

---

## **STEP 1️⃣: Create `.env` Configuration File**

### **Windows Users:**

**1. Open File Explorer**
   - Press: `Windows Key + E`
   - Navigate to: `D:\Dev\Projects\Personal\portfolio`

**2. Create .env file**
   - Right-click empty space
   - Select: `New` → `Text Document`
   - Name it: `.env` (IMPORTANT: remove .txt extension)
   - If it asks "Are you sure?", click `Yes`

**3. Open and edit .env**
   - Right-click the `.env` file
   - Select: `Open with` → `Notepad`
   - **DELETE everything inside**
   - **PASTE this exactly:**

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

**4. Save**
   - Press: `Ctrl + S`
   - Close Notepad

✅ **Done! .env file is ready**

---

## **STEP 2️⃣: Start Docker Database**

### **Important: Docker must be installed!**

**1. Open PowerShell as Administrator**
   - Right-click `PowerShell` app
   - Select: `Run as administrator`

**2. Navigate to project folder**
   - Copy-paste this:
   ```
   cd D:\Dev\Projects\Personal\portfolio
   ```
   - Press `Enter`

**3. Start PostgreSQL database**
   - Copy-paste this:
   ```
   docker compose up -d
   ```
   - Press `Enter`
   - Wait 5-10 seconds

**4. Verify it's running**
   - Copy-paste this:
   ```
   docker compose ps
   ```
   - Press `Enter`

**✅ You should see a container running (status: "Up")**

---

## **STEP 3️⃣: Install Project Dependencies**

### **In same PowerShell window:**

**Copy-paste this:**
```
npm install
```

**Press `Enter`**

**⏳ Wait 1-2 minutes...**

You'll see lots of text. **At the end, it should say:**
```
added XX packages
```

✅ **Dependencies installed!**

---

## **STEP 4️⃣: Initialize Database**

### **In same PowerShell window:**

**Run migrations (set up database structure):**
```
npm run db:migrate
```
Press `Enter` → Wait for completion

**Seed database (add initial data):**
```
npm run db:seed
```
Press `Enter` → Wait for completion

**You should see:**
```
✓ Admin user created: admin@example.com
✓ Created 5 sources
✓ Created 5 landmarks
✨ Database seeded successfully!
```

✅ **Database is ready!**

---

## **STEP 5️⃣: Start the Website Server**

### **In same PowerShell window:**

**Copy-paste this:**
```
npm run dev
```

**Press `Enter`**

**You should see:**
```
✓ Database connected

🚀 Server running on http://localhost:3000
   Environment: development
```

✅ **Server is running!**

⚠️ **KEEP THIS TERMINAL OPEN** - Don't close it!

---

## **STEP 6️⃣: Open Website in Browser**

### **Open your web browser (Chrome, Firefox, etc.)**

**Go to this address:**
```
http://localhost:3000
```

Or **click this link:** http://localhost:3000

**You should see:**
- 📝 "KARACHI, PAKISTAN" at top
- 🏛️ Large "KARACHI" title
- 🖼️ Mazar-e-Quaid image
- 3️⃣ Colored buttons
- 🗺️ Navigation menu (INTRO, MAZAR, HERITAGE, COAST, SIGHTS)

✅ **WEBSITE IS LIVE!**

---

## **🧪 QUICK TESTS**

### **Test 1: Try Creating Account**

1. Click **LOGIN** (top right)
2. Click **Create account**
3. Fill form:
   - Name: `John Doe`
   - Email: `john@example.com`
   - Password: `Test123!`
   - Confirm: `Test123!`
4. Click **Create Account**
5. ✅ Should see your profile page

---

### **Test 2: Try Admin Login**

1. Click **LOGIN**
2. Fill form:
   - Email: `admin@example.com`
   - Password: `Admin123!`
3. Click **Sign In**
4. ✅ Should see **ADMIN** button in top right
5. Click **ADMIN** to see admin dashboard

---

### **Test 3: Try Navigation**

1. Click **MAZAR** → ✅ Scrolls to mazar
2. Click **HERITAGE** → ✅ Scrolls to heritage
3. Click **COAST** → ✅ Scrolls to coast
4. Click **SIGHTS** → ✅ Scrolls to sights

---

### **Test 4: Try Slider**

1. Scroll to SIGHTS section
2. See 5 landmark cards
3. Click **→** → ✅ Slides right
4. Click **←** → ✅ Slides left

---

## **❌ PROBLEMS & SOLUTIONS**

### **Problem 1: "Connection refused" error**

**Cause:** Docker database not running

**Fix:**
```
docker compose up -d
```

Then try again.

---

### **Problem 2: "Cannot find module" error**

**Cause:** Dependencies not installed

**Fix:**
```
npm install
```

---

### **Problem 3: "Port 3000 already in use"**

**Cause:** Another app using port 3000

**Fix:** Use different port:
```
$env:PORT=3001
npm run dev
```

Then visit: `http://localhost:3001`

---

### **Problem 4: Website won't load**

**Cause:** Server not running

**Fix:**
- Check if PowerShell terminal shows "🚀 Server running"
- If not, run: `npm run dev`
- Wait 3 seconds
- Refresh browser (F5)

---

### **Problem 5: Images not showing**

**Normal!** Images are from internet. If offline, they won't display. Site still works!

---

## **📍 IMPORTANT URLS**

| Page | URL |
|------|-----|
| 🏠 Home | http://localhost:3000 |
| 🔐 Login | http://localhost:3000/login |
| 📝 Register | http://localhost:3000/register |
| 👤 Account | http://localhost:3000/account |
| 👨‍💼 Admin | http://localhost:3000/admin |
| 🔒 Privacy | http://localhost:3000/privacy |
| 📋 Terms | http://localhost:3000/terms |
| 📚 Sources | http://localhost:3000/sources |

---

## **🔑 DEFAULT ACCOUNTS**

### **Admin Account** (has extra powers)
- Email: `admin@example.com`
- Password: `Admin123!`

### **Create New Account**
- Use registration page to create your own

---

## **⏹️ HOW TO STOP**

### **Stop the website:**
- Go to PowerShell terminal
- Press: `Ctrl + C`
- Type: `y` and press Enter

### **Stop database:**
```
docker compose down
```

### **Start again:**
```
docker compose up -d
npm run dev
```

---

## **📱 WHAT TO TEST**

- ✅ Navigate between sections
- ✅ Create new account
- ✅ Login with admin
- ✅ View admin dashboard
- ✅ View account page
- ✅ Use slider (click → and ← buttons)
- ✅ Click all buttons in header
- ✅ Click footer links (Privacy, Terms, Sources)

---

## **🎉 YOU'RE DONE!**

Your complete Karachi cinematic website is now:
- ✅ Running locally
- ✅ Accessible in browser
- ✅ Connected to PostgreSQL database
- ✅ Authentication working
- ✅ Admin dashboard functional

**Everything you built is now LIVE and working!**

---

## **📞 IF STUCK**

1. **Check PowerShell terminal** - error messages are helpful
2. **Restart:** Close terminal, run `npm run dev` again
3. **Refresh browser:** Press `F5` or `Ctrl+R`
4. **Clear cache:** Press `Ctrl+Shift+Delete`

---

**That's it! Follow these steps and you'll have the website running. 🚀**

