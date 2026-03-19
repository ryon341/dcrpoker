Taskcard 005 — Phone-First Authentication (OTP-Ready Backend)

This is the foundation of everything:

users

invites

messaging

player linking

host relationships

Do this cleanly and everything else will plug in smoothly.

Goal

Build a phone-first authentication system scaffold that supports:

phone-based login (OTP-ready, even if OTP is mocked for now)

optional email

user creation

login session via JWT

Do NOT integrate real SMS OTP yet — just structure for it.

Scope
Build:

user registration (phone required)

login (phone-based)

JWT auth

protected route middleware

Do NOT build yet:

real OTP provider (Twilio)

password reset

email verification

UI

Requirements
1. Install dependencies

In server:

npm install jsonwebtoken bcryptjs uuid
2. Environment variables

Update .env:

JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d

Add to .env.example.

3. Folder structure

Add:

src/
  auth/
    authController.js
    authRoutes.js
    authMiddleware.js
    authService.js
4. Authentication model (IMPORTANT)

We are doing phone-first auth, but without real OTP yet.

Temporary approach (MVP scaffold):

user enters phone

system:

creates user if not exists

logs them in immediately

⚠️ This is NOT secure — but acceptable for scaffold phase

Later:

replace with OTP verification

5. Auth endpoints
POST /api/auth/register

Input:

{
  "phone": "string",
  "display_name": "string",
  "email": "optional"
}

Behavior:

create user if not exists

assign default role = player

return JWT

POST /api/auth/login

Input:

{
  "phone": "string"
}

Behavior:

find user by phone

if not found → return error

if found → return JWT

6. JWT payload

Include:

{
  "userId": 1,
  "phone": "...",
  "roles": ["player"]
}
7. Auth middleware

Create:

authMiddleware.js

Function:

read Authorization: Bearer <token>

verify JWT

attach req.user

If invalid:

return 401

8. Protected test route

Add:

GET /api/auth/me

Returns:

{
  "ok": true,
  "user": {
    "id": ...,
    "phone": "...",
    "roles": [...]
  }
}

Requires auth middleware.

9. Role loading

When logging in:

query user_roles + roles

attach role names to JWT

10. Data validation

Use basic validation:

phone required

normalize phone (strip spaces, dashes)

Do not overbuild validation yet.

Validation Criteria

Task complete when:

Auth works

can register user

can login user

JWT is returned

Protected route works

/api/auth/me returns user

fails without token

Database

new users inserted correctly

roles assigned

Constraints

no OTP yet

no SMS integration

no frontend

no refresh tokens

no password auth

Deliverable

Return:

updated folder tree

contents of:

authController.js

authService.js

authMiddleware.js

authRoutes.js

updated server.js

sample requests:

register

login

protected route