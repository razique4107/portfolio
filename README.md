# Karachi — City of Light
## Production-Quality Cinematic Scroll Website

A full-stack web application featuring Karachi's most iconic landmarks with secure authentication, PostgreSQL database, admin dashboard, and comprehensive source attribution.

### Project Overview

**Karachi — City of Light** is a premium cinematic experience that guides users through five of Karachi's most significant landmarks:
- Mazar-e-Quaid (National Landmark)
- Mohatta Palace (Clifton Heritage)
- Frere Hall (Colonial Heritage)
- Empress Market (Historic Commerce)
- Clifton Beach / Arabian Sea (Coastal Experience)

The experience features smooth scroll animations, proper media attribution, secure user authentication, and an admin dashboard for account management.

### Architecture

#### Frontend
- **Semantic HTML5** with accessibility-first approach
- **CSS3** with CSS custom properties for animation state
- **Vanilla JavaScript** with requestAnimationFrame for smooth motion
- **No framework dependencies** for maximum performance
- Responsive design for mobile, tablet, and desktop

#### Backend
- **Node.js + Express.js** REST API
- **PostgreSQL** database with Prisma ORM
- **Argon2id** password hashing
- **HTTP-only session cookies** with secure flags
- **Rate limiting** and CSRF protection
- **Comprehensive audit logging** for security events

### Quick Start

#### Prerequisites
- Node.js 22.0.0+
- npm 11.0.0+
- PostgreSQL 16+ (or Docker)
- 50MB free disk space

#### Installation

1. **Clone and install:**
```bash
cd karachi-cinematic
npm install
```

2. **Setup environment:**
```bash
cp .env.example .env
```

Edit `.env` and set:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/karachi_cinematic
SESSION_SECRET=your-random-secret-key-here
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=YourPassword123
```

3. **Start PostgreSQL (with Docker):**
```bash
docker compose up -d
```

Or use your local PostgreSQL installation and create the database:
```sql
CREATE DATABASE karachi_cinematic;
```

4. **Initialize database:**
```bash
npm run db:migrate
npm run db:seed
```

5. **Start development server:**
```bash
npm run dev
```

Server runs on `http://localhost:3000`

### Development Commands

```bash
npm run dev           # Start dev server with auto-reload
npm run db:migrate    # Run Prisma migrations
npm run db:seed       # Seed database with landmarks and admin user
npm test              # Run test suite
npm audit             # Check for security vulnerabilities
npm run lint:legacy   # Search for accidental legacy references
```

### Production Deployment

```bash
NODE_ENV=production npm run start
```

**Important:** Before deploying:
1. Set secure `SESSION_SECRET`
2. Update `APP_ORIGIN` to production domain
3. Enable HTTPS
4. Set `secure: true` in session cookie config
5. Run security audit: `npm audit`
6. Test on staging environment

### Project Structure

```
├── server/
│   ├── index.js                 # Server entry point
│   ├── app.js                   # Express app factory
│   ├── config.js                # Configuration management
│   ├── db.js                    # Prisma client
│   ├── middleware/              # Express middleware
│   │   ├── auth.js              # Authentication checks
│   │   ├── security.js          # Security headers
│   │   ├── rateLimit.js         # Rate limiting
│   │   ├── errorHandler.js      # Error handling
│   │   └── validation.js        # Request validation
│   ├── routes/                  # API routes
│   │   ├── auth.js              # Auth endpoints
│   │   ├── users.js             # User endpoints
│   │   ├── admin.js             # Admin endpoints
│   │   ├── content.js           # Content endpoints
│   │   └── health.js            # Health check
│   ├── services/                # Business logic
│   │   ├── auth.js              # Auth service
│   │   ├── audit.js             # Audit logging
│   │   └── admin.js             # Admin service
│   └── utils/                   # Utilities
│       ├── crypto.js            # Encryption/hashing
│       ├── normalize.js         # Data normalization
│       └── validation.js        # Validation helpers
│
├── public/
│   ├── index.html               # Main cinematic page
│   ├── login.html               # Login page
│   ├── register.html            # Registration page
│   ├── account.html             # User account page
│   ├── admin.html               # Admin dashboard
│   ├── privacy.html             # Privacy policy
│   ├── terms.html               # Terms of service
│   ├── sources.html             # Sources & attribution
│   ├── css/
│   │   ├── styles.css           # Main styles
│   │   └── auth.css             # Auth & legal pages
│   └── js/
│       ├── app.js               # Main app
│       ├── animation.js         # Animation engine
│       ├── scenes.js            # Scene management
│       ├── slider.js            # Slider component
│       ├── navigation.js        # Navigation
│       └── auth.js              # Auth page scripts
│
├── prisma/
│   ├── schema.prisma            # Database schema
│   ├── seed.js                  # Seed entry point
│   └── seed-data.js             # Seed data
│
├── docs/
│   ├── SOURCES.md               # Source documentation
│   ├── SECURITY.md              # Security details
│   ├── ACCESSIBILITY.md         # A11y documentation
│   ├── IMAGE-LICENSING.md       # Image licenses
│   └── QA.md                    # QA report
│
├── tests/                       # Test files
├── docker-compose.yml           # Docker Compose config
├── package.json                 # Dependencies
├── .env.example                 # Environment template
└── README.md                    # This file
```

### Environment Variables

```
# Application
NODE_ENV=development              # development or production
PORT=3000                         # Server port
APP_ORIGIN=http://localhost:3000  # Application URL

# Database
DATABASE_URL=postgresql://...     # PostgreSQL connection string

# Session
SESSION_SECRET=change-me          # Session encryption key

# Admin Bootstrap
ADMIN_EMAIL=admin@example.com     # Initial admin email
ADMIN_PASSWORD=ChangeMe123!       # Initial admin password

# Email (optional)
SMTP_HOST=                        # Email server host
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=noreply@karachi-cinematic.local
```

### API Routes

#### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Sign in
- `POST /api/auth/logout` - Sign out
- `POST /api/auth/request-reset` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/change-password` - Change password (requires auth)

#### Users
- `GET /api/users` - Get current user (requires auth)
- `PATCH /api/users` - Update profile (requires auth)

#### Content
- `GET /api/content/landmarks` - List all landmarks
- `GET /api/content/landmarks/:slug` - Get landmark details
- `GET /api/content/sources` - List all sources

#### Admin
- `GET /api/admin/overview` - Dashboard overview (requires admin)
- `GET /api/admin/users` - List users (requires admin)
- `PATCH /api/admin/users/:id/disable` - Disable user (requires admin)
- `PATCH /api/admin/users/:id/enable` - Enable user (requires admin)
- `PATCH /api/admin/users/:id/role` - Change user role (requires admin)
- `GET /api/admin/auth-events` - List auth events (requires admin)

#### Health
- `GET /api/health` - Health check

### Database Schema

#### User
```
- id (string, primary key)
- email (string, unique)
- displayName (string)
- passwordHash (string)
- role (string: USER | ADMIN)
- createdAt (datetime)
- updatedAt (datetime)
- lastLoginAt (datetime, nullable)
- loginCount (integer)
- isActive (boolean)
- emailVerifiedAt (datetime, nullable)
```

#### AuthEvent
```
- id (string, primary key)
- userId (string, nullable, foreign key)
- eventType (string)
- success (boolean)
- createdAt (datetime)
- ipHash (string, nullable)
- userAgentSummary (string, nullable)
- metadataJson (string, nullable)
```

#### Session
```
- id (string, primary key)
- userId (string, foreign key)
- sessionData (string)
- expiresAt (datetime)
- createdAt (datetime)
- updatedAt (datetime)
```

#### PasswordResetToken
```
- id (string, primary key)
- userId (string, foreign key)
- tokenHash (string, unique)
- expiresAt (datetime)
- usedAt (datetime, nullable)
- createdAt (datetime)
```

#### Landmark
```
- id (string, primary key)
- slug (string, unique)
- title (string)
- kicker (string)
- description (string)
- imageKey (string)
- sectionId (string)
- createdAt (datetime)
- updatedAt (datetime)
```

#### Source
```
- id (string, primary key)
- url (string, unique)
- title (string)
- publisher (string, nullable)
- license (string, nullable)
- licenseUrl (string, nullable)
- attributionRequired (boolean)
- attributionText (string, nullable)
- verifiedAt (datetime, nullable)
- createdAt (datetime)
```

### Security Features

✅ **Password Security**
- Passwords hashed with Argon2id (not plaintext)
- 8+ characters, uppercase, lowercase, numbers required
- Passwords never logged or exposed

✅ **Session Security**
- HTTP-only cookies (JavaScript cannot access)
- Secure flag in production (HTTPS only)
- SameSite=Lax to prevent CSRF
- Session invalidation on logout
- 7-day expiration

✅ **API Security**
- Rate limiting on login/register (5 attempts per 15 min)
- CSRF protection for state-changing requests
- Request body size limits (10KB)
- Parameterized queries (Prisma ORM)
- Input validation on all endpoints

✅ **Authentication**
- Session fixation protection (new session on login)
- Constant-time password comparison
- Generic error messages (don't reveal account existence)

✅ **Authorization**
- Server-side role verification
- Never trust client-supplied roles
- Admin actions audited and logged

✅ **Headers**
- Content-Security-Policy (CSP)
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- Strict-Transport-Security (HSTS in prod)
- Referrer-Policy: strict-origin-when-cross-origin

✅ **Audit Logging**
- All auth events recorded (login, register, password change)
- Event metadata without sensitive data
- Hashed IP addresses for privacy
- Admin actions tracked with timestamps

✅ **Data Protection**
- No third-party password collection
- No credential harvesting
- IP addresses hashed (not stored raw)
- User agent truncated to 256 chars

### Accessibility

- **Semantic HTML** with proper heading hierarchy
- **ARIA labels** on all interactive elements
- **Keyboard navigation** throughout
- **Focus management** in modals
- **Skip links** for keyboard users
- **Reduced motion** support
- **Color contrast** meets WCAG AA standards
- **Form labels** properly associated
- **Error messages** accessible and visible

### Performance

- No CSS framework bloat
- Minimal JavaScript (vanilla, no dependencies)
- CSS custom properties for efficient animations
- requestAnimationFrame for smooth 60fps motion
- Images lazy-loaded below the fold
- Compression middleware enabled
- Static files cached by browser

### Image Attribution

All images sourced from Wikimedia Commons under Creative Commons licenses:

1. **Mazar-e-Quaid** — CC BY-SA 4.0
2. **Mohatta Palace** — CC BY-SA 4.0
3. **Frere Hall** — CC BY-SA 4.0
4. **Empress Market** — CC BY-SA 3.0
5. **Clifton Beach** — CC BY-SA 4.0

See `docs/IMAGE-LICENSING.md` and `/sources` page for full attribution details.

### Troubleshooting

**Database connection failed**
```bash
# Check PostgreSQL is running
docker compose ps

# Restart if needed
docker compose restart postgres
```

**Port 3000 already in use**
```bash
# Use different port
PORT=3001 npm run dev
```

**Migrations failed**
```bash
# Reset database (development only!)
npm run db:migrate reset

# Re-seed
npm run db:seed
```

**Prisma client issues**
```bash
# Regenerate client
npx prisma generate
```

### Support & Deployment

This is a development/reference implementation. For production deployment:

1. Use a process manager (PM2, systemd)
2. Set up reverse proxy (nginx, Apache)
3. Enable HTTPS/SSL
4. Configure database backups
5. Set up monitoring and logging
6. Run security audit regularly
7. Keep dependencies updated

### License

See LICENSE file.

---

**Built with respect for Karachi's heritage and commitment to open-source principles.**
