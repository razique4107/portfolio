# 🎬 SIMPLE WALKTHROUGH - Like Following a Recipe

## **Copy-Paste Instructions (No Thinking Needed)**

---

## **⏰ TIME: 10-15 minutes total**

---

## **PART 1: Setup Configuration (2 minutes)**

### **Action 1: Create `.env` file**

**What to do:**
1. Open Notepad (search "Notepad" in Windows)
2. **Paste this entire text:**

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

3. **Save As:**
   - Click: File → Save As
   - Location: `D:\Dev\Projects\Personal\portfolio`
   - Filename: `.env`
   - File type: "All Files (*.*)"
   - Click: Save

**✅ Done! Close Notepad**

---

## **PART 2: Start Services (5 minutes)**

### **Action 2: Open PowerShell as Admin**

1. Press: `Windows Key`
2. Type: `PowerShell`
3. Right-click: `Windows PowerShell`
4. Click: `Run as administrator`

### **Action 3: Navigate to folder**

**Copy this and paste in PowerShell:**
```
cd D:\Dev\Projects\Personal\portfolio
```

**Press:** `Enter`

### **Action 4: Start Database**

**Copy this and paste:**
```
docker compose up -d
```

**Press:** `Enter`

**Wait 5 seconds...**

✅ **Database started!**

### **Action 5: Install dependencies**

**Copy this and paste:**
```
npm install
```

**Press:** `Enter`

**⏳ Wait 1-2 minutes for this to complete...**

Screen will show lots of green text. Wait until you see:
```
added XX packages
```

✅ **Dependencies installed!**

---

## **PART 3: Setup Database (3 minutes)**

### **Action 6: Run database migrations**

**Copy this and paste:**
```
npm run db:migrate
```

**Press:** `Enter`

**Wait for completion...**

✅ **Database structure created!**

### **Action 7: Seed database with data**

**Copy this and paste:**
```
npm run db:seed
```

**Press:** `Enter`

**Wait for completion...**

You should see:
```
✓ Admin user created: admin@example.com
✓ Created 5 sources
✓ Created 5 landmarks
✨ Database seeded successfully!
```

✅ **Database filled with data!**

---

## **PART 4: Start Website (1 minute)**

### **Action 8: Start the server**

**Copy this and paste:**
```
npm run dev
```

**Press:** `Enter`

**Wait 2-3 seconds...**

You should see:
```
✓ Database connected

🚀 Server running on http://localhost:3000
   Environment: development
```

✅ **WEBSITE IS RUNNING!**

**⚠️ DO NOT CLOSE THIS TERMINAL WINDOW!**

---

## **PART 5: View Website (1 minute)**

### **Action 9: Open website**

**Open ANY web browser** (Chrome, Firefox, Edge, etc.)

**Go to:**
```
http://localhost:3000
```

**You should see:**
- Top: "KARACHI, PAKISTAN"
- Middle: Large "KARACHI" text
- Image of Mazar-e-Quaid
- Buttons and navigation menu

✅ **WEBSITE LOADED!**

---

## **PART 6: Test It Works (2 minutes)**

### **Test 1: Create Account**

1. Click **LOGIN** button (top right)
2. Click **Create account** link
3. Fill in:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `Test123!`
   - Confirm: `Test123!`
4. Click **Create Account**

✅ **Should redirect to account page**

---

### **Test 2: Login as Admin**

1. Click **LOGOUT** (if you see it)
2. Click **LOGIN**
3. Fill in:
   - Email: `admin@example.com`
   - Password: `Admin123!`
4. Click **Sign In**

✅ **Should show account page AND an ADMIN button**

---

### **Test 3: Visit Admin Dashboard**

1. Click **ADMIN** button (top right, only visible when logged in as admin)

✅ **Should show admin dashboard with metrics and user list**

---

### **Test 4: Try Navigation**

1. Click **MAZAR** → ✅ Page scrolls
2. Click **HERITAGE** → ✅ Page scrolls
3. Click **COAST** → ✅ Page scrolls
4. Click **SIGHTS** → ✅ Page scrolls

---

## **🎉 THAT'S IT! YOU'RE DONE!**

---

## **📊 What You Now Have**

| Component | Status |
|-----------|--------|
| Website running | ✅ YES |
| Database connected | ✅ YES |
| Admin account created | ✅ YES |
| Landmarks loaded | ✅ YES |
| Authentication working | ✅ YES |
| Admin dashboard | ✅ YES |

---

## **🛑 TO STOP EVERYTHING**

### **Stop website:**
- Go to PowerShell terminal
- Press: `Ctrl + C`
- Type: `y` and press Enter

### **Stop database:**
```
docker compose down
```

---

## **🔄 TO START AGAIN TOMORROW**

**Just do this:**
1. Open PowerShell as admin
2. Navigate: `cd D:\Dev\Projects\Personal\portfolio`
3. Start database: `docker compose up -d`
4. Start server: `npm run dev`
5. Visit: `http://localhost:3000`

Done!

---

## **📋 COPY-PASTE QUICK REFERENCE**

**Setup (first time only):**
```
cd D:\Dev\Projects\Personal\portfolio
docker compose up -d
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

**Run website (every time):**
```
cd D:\Dev\Projects\Personal\portfolio
docker compose up -d
npm run dev
```

---

## **🆘 MOST COMMON ERRORS & FIXES**

### **Error: "Cannot find module"**
```
npm install
```

### **Error: "Connection refused"**
```
docker compose up -d
```

### **Error: "Port already in use"**
```
$env:PORT=3001
npm run dev
```
Then visit: `http://localhost:3001`

### **Error: "Cannot open file .env"**
Make sure file is named exactly `.env` (not `.env.txt`)

### **Nothing works**
Close terminal and start over from top

---

## **✨ YOU NOW HAVE A COMPLETE WEBSITE!**

- 🎬 Cinematic scroll experience
- 🏛️ Five beautiful landmark scenes
- 🔐 Secure authentication
- 👨‍💼 Admin dashboard
- 📱 Mobile responsive
- ♿ Accessible design

**All running locally on your computer!**

---

**Follow these steps exactly and it will work. Good luck! 🚀**

