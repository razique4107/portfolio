# Security Implementation

## Password Hashing

**Algorithm:** Argon2id (NIST-recommended)

Configured with:
- Memory cost: 19456 KiB
- Time cost: 2 iterations
- Parallelism: 1

Passwords are:
- ✅ Never stored in plaintext
- ✅ Never logged
- ✅ Never exposed to admin
- ✅ Verified using constant-time comparison

## Session Management

**Storage:** Server-side (PostgreSQL)

**Cookie Configuration:**
- `httpOnly: true` — Prevents JavaScript access
- `secure: true` (production) — HTTPS only
- `sameSite: 'lax'` — CSRF protection
- `maxAge: 7 days` — Expiration

**Session Lifecycle:**
1. User logs in
2. New session ID generated (session fixation prevention)
3. Session stored server-side with user ID
4. Session cookie sent to browser
5. On logout: session deleted server-side
6. Session validates on each request

## Rate Limiting

**Login:** 5 attempts per 15 minutes per IP
**Registration:** 5 registrations per 1 hour per IP
**Password Reset:** 3 requests per 1 hour per IP
**API:** 100 requests per minute per IP

Bypass in development/test mode.

## CSRF Protection

All state-changing requests (POST, PATCH, DELETE) include:
- CSRF token validation
- Session binding
- SameSite cookie flags

## Input Validation

All endpoints validate:
- Email format
- Password strength
- Display name length (2-100 chars)
- URLs (valid scheme)
- IDs (valid format)
- Unexpected fields (rejected)

## Authentication Events Audit

All authentication events recorded:
- `REGISTER` — Account creation
- `LOGIN_SUCCESS` — Successful login
- `LOGIN_FAILURE` — Failed login attempt
- `LOGOUT` — Session ended
- `PASSWORD_RESET_REQUEST` — Reset requested
- `PASSWORD_RESET_COMPLETED` — Reset done
- `PASSWORD_CHANGE` — Password changed

Events include:
- Event type
- Success/failure
- Timestamp
- Hashed IP (last octet visible)
- User agent summary (truncated)
- User ID (nullable for failed attempts)

Events do NOT include:
- Plaintext IP
- Full user agent
- Password or token
- Session cookie
- Sensitive metadata

## Admin Authorization

**Access Control:**
- Server-side role verification required
- Role from session data, never from request
- All admin actions logged in AdminAction table

**Admin Capabilities:**
- View user list with metadata only
- Disable/enable user accounts
- Change user roles
- View authentication audit log
- View account activity

**Admin Cannot See:**
- Passwords or hashes
- Session cookies
- Reset tokens
- Private user data

## Error Handling

**Development:** Detailed error messages with stack traces
**Production:** Generic "Something went wrong" messages

Logs never contain:
- Passwords
- Tokens
- Session IDs
- Database credentials
- Full stack traces (in response)

## Security Headers

```
Content-Security-Policy:
  default-src: 'self'
  style-src: 'self' 'unsafe-inline' https://fonts.googleapis.com
  script-src: 'self'
  img-src: 'self' https: data:
  font-src: 'self' https://fonts.gstatic.com

X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
Strict-Transport-Security: max-age=31536000 (production)
```

## IP & User Agent Handling

**Privacy-First Approach:**

IPs:
- Hashed with server-side salt
- Last octet visible for debugging
- Retained 90 days
- Used only for abuse detection

User Agent:
- Truncated to 256 chars
- Platform/browser extracted
- Full string never exposed
- Helps detect browser-based anomalies

## Database Security

- All queries parameterized (Prisma ORM)
- No raw SQL from user input
- Connection pooling with limits
- Transactions for atomic operations
- Foreign key constraints enabled
- Cascade deletes configured safely

## Dependency Security

- Regularly audited with `npm audit`
- Only maintained packages used
- Pinned versions in package-lock.json
- No eval() or Function() constructors
- XSS prevention through template literals

## No Credential Collection

This system:
- ✅ Does NOT collect Google passwords
- ✅ Does NOT collect Instagram passwords
- ✅ Does NOT collect Facebook passwords
- ✅ Does NOT collect banking credentials
- ✅ Does NOT send credentials to external services

This is a **legitimate first-party account system only**.

## Deployment Checklist

Before production:

- [ ] Set secure `SESSION_SECRET` (use `openssl rand -hex 32`)
- [ ] Update `APP_ORIGIN` to production domain
- [ ] Enable HTTPS/SSL certificates
- [ ] Set `secure: true` in session cookie
- [ ] Update HSTS header
- [ ] Configure database backups
- [ ] Set up log rotation
- [ ] Run `npm audit` and fix vulnerabilities
- [ ] Test on staging environment
- [ ] Review all environment variables
- [ ] Disable debug logging
- [ ] Set `NODE_ENV=production`
- [ ] Configure monitoring/alerting
- [ ] Document incident response

---

**This implementation prioritizes user security and data privacy.**
