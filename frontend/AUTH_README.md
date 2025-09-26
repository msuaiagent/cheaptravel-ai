# Authentication System

This document explains the authentication system  

## Auth Structure

```
src/
├── app/api/auth/           # Authentication API endpoints
│   ├── signin/route.ts     # POST /api/auth/signin
│   ├── signup/route.ts     # POST /api/auth/signup
│   ├── signout/route.ts    # POST /api/auth/signout
│   └── me/route.ts         # GET /api/auth/me
├── lib/
│   ├── supabase/           # Supabase client configuration
│   │   ├── client.ts       # Browser client
│   │   └── server.ts       # Server-side client
│   └── auth-helpers.ts     # Reusable auth utilities
└── types/
    └── auth.ts             # TypeScript interfaces for auth
```

## Setup

To make this work in development you wil need to set up a supabase project and add these to your `.env.local`:  
Project URL  
Anon (public) key  
Service role key  
These can be found in Settings -> Data API and Settings -> API Keys

Note that email confirmation is enabled by default, so you will need to
either turn this off in the supabase project settings, or use your own email that you can confirm.

Another option is to create a shared project that we can use

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

## Creating Protected Endpoints

Use the `getAuthenticatedUser` helper for protected routes:

```typescript
import { getAuthenticatedUser, createUnauthorizedResponse } from '@/lib/auth-helpers'

export async function GET(request: NextRequest) {
  const { user, error } = await getAuthenticatedUser(request)
  
  if (!user) {
    return createUnauthorizedResponse()
  }
  
  // Your protected logic here
  // user.id contains the authenticated user's ID
}
```

## Frontend Integration

When building React components, use the auth endpoints like this:

```typescript
// Login form handler
const handleLogin = async (email: string, password: string) => {
  const response = await fetch('/api/auth/signin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Important for cookies
    body: JSON.stringify({ email, password })
  })
  
  const result = await response.json()
  // Handle result...
}
```

## API Endpoints

### 1. User Registration
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "emailConfirmed": false
  }
}
```

### 2. User Login
```http
POST /api/auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Authentication successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe"
  },
  "session": {
    "accessToken": "jwt-token",
    "refreshToken": "refresh-token",
    "expiresAt": 1727367600
  }
}
```

### 3. Get Current User
```http
GET /api/auth/me
Cookie: sb-access-token=your-session-cookie
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe",
    "createdAt": "2025-09-26T18:31:33.231Z",
    "emailConfirmed": true
  }
}
```

### 4. User Logout
```http
POST /api/auth/signout
Cookie: sb-access-token=your-session-cookie
```






---

*Last updated: September 26, 2025*