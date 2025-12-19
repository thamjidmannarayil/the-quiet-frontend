# Google OAuth2 Frontend Configuration Guide

This guide explains how to set up and use Google OAuth2 for signup and signin in the Azure Horizon Frontend.

## Prerequisites Completed ✅

- ✅ `@react-oauth/google` package installed in dependencies
- ✅ Google Auth Provider wrapper created
- ✅ Google Sign-In button component created
- ✅ Google Auth utility service created
- ✅ Login and Register forms updated with Google OAuth
- ✅ Environment configuration set up

## Setup Steps

### 1. Get Google OAuth2 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Select **Web application**
6. Add authorized JavaScript origins:
   - `http://localhost:3000` (development)
   - `https://yourdomain.com` (production)
7. Add authorized redirect URIs:
   - `http://localhost:3000` (development - required for Google SDK)
   - `https://yourdomain.com` (production)
8. Copy the **Client ID**

### 2. Configure Environment Variables

Edit [.env.local](.env.local):

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
```

Replace `your_google_client_id_here` with your actual Google Client ID from step 1.

### 3. Install Dependencies

Run the following command to install the Google OAuth package:

```bash
npm install
# or
pnpm install
# or
yarn install
```

### 4. Start the Application

```bash
npm run dev
# or
pnpm dev
```

## How It Works

### Sign-In Flow

1. **Frontend**: User clicks the Google sign-in button
2. **Google SDK**: Opens Google authentication dialog
3. **User**: Authenticates with Google and grants permissions
4. **Google SDK**: Returns an ID token to the frontend
5. **Frontend**: Sends ID token to your backend via `googleSignin()`
6. **Backend**: Verifies the token and checks if user exists
7. **Backend**: Returns JWT tokens (access & refresh) if successful
8. **Frontend**: Stores tokens, updates auth state, and redirects to dashboard

### Sign-Up Flow

1. **Frontend**: User clicks the Google sign-up button
2. **Google SDK**: Opens Google authentication dialog
3. **User**: Authenticates with Google and grants permissions
4. **Google SDK**: Returns an ID token to the frontend
5. **Frontend**: Sends ID token to your backend via `googleSignup()`
6. **Backend**: Verifies the token and creates a new user if email doesn't exist
7. **Backend**: Returns JWT tokens (access & refresh)
8. **Frontend**: Stores tokens, updates auth state, and redirects to dashboard

## File Structure

```
lib/
├── google-auth.ts              # Google OAuth utility functions
├── cart-api.ts
├── booking-api.ts
└── ...

components/
├── google-auth-provider.tsx    # Provider wrapper for Google SDK
├── google-signin-button.tsx    # Reusable Google sign-in button
├── login-form.tsx              # Updated with Google button
├── register-form.tsx           # Updated with Google button
└── ...

app/
├── layout.tsx                  # Updated with GoogleAuthProvider
└── ...

.env.local                       # Environment variables (add locally)
```

## Available Components

### GoogleAuthProvider

Wraps the application with Google OAuth SDK initialization. 

**Location**: [components/google-auth-provider.tsx](components/google-auth-provider.tsx)

**Usage**:
```tsx
// Already included in app/layout.tsx
<GoogleAuthProvider>
  {children}
</GoogleAuthProvider>
```

### GoogleSignInButton

Reusable button for Google authentication.

**Location**: [components/google-signin-button.tsx](components/google-signin-button.tsx)

**Props**:
- `mode?: "signin" | "signup"` - Sign-in or sign-up mode (default: "signin")
- `redirectUrl?: string` - URL to redirect after success (default: "/")
- `onSuccess?: () => void` - Optional callback after success
- `onError?: (error: Error) => void` - Optional callback on error

**Usage**:
```tsx
import { GoogleSignInButton } from '@/components/google-signin-button'

export function MyComponent() {
  return (
    <GoogleSignInButton 
      mode="signin"
      redirectUrl="/dashboard"
      onSuccess={() => console.log('Signed in!')}
    />
  )
}
```

## Utility Functions

### googleSignup

Signs up a new user with Google OAuth.

**File**: [lib/google-auth.ts](lib/google-auth.ts)

```typescript
async function googleSignup(
  token: string,
  username?: string,
  phone?: string
): Promise<GoogleAuthResponse>
```

**Parameters**:
- `token` (required): Google ID token from `@react-oauth/google`
- `username` (optional): Desired username
- `phone` (optional): User's phone number

**Returns**: User data with JWT tokens

### googleSignin

Signs in an existing user with Google OAuth.

**File**: [lib/google-auth.ts](lib/google-auth.ts)

```typescript
async function googleSignin(token: string): Promise<GoogleAuthResponse>
```

**Parameters**:
- `token` (required): Google ID token from `@react-oauth/google`

**Returns**: User data with JWT tokens

### storeAuthTokens

Stores JWT tokens in localStorage.

```typescript
function storeAuthTokens(access: string, refresh: string): void
```

## Testing

### Test Sign-In

1. Navigate to http://localhost:3000/login
2. Click the Google sign-in button
3. Authenticate with a Google account
4. Should redirect to dashboard after success

### Test Sign-Up

1. Navigate to http://localhost:3000/register
2. Click the Google sign-up button
3. Authenticate with a new or existing Google account
4. Should redirect to dashboard after success

## Troubleshooting

### "Google Client ID is not configured"

**Issue**: Warning appears in console

**Solution**: 
- Add `NEXT_PUBLIC_GOOGLE_CLIENT_ID` to `.env.local`
- Make sure the value is not empty
- Restart the dev server

### "Invalid Client ID" Error

**Issue**: Google SDK fails to initialize

**Solution**:
- Verify the Client ID matches your Google Cloud credentials
- Ensure the domain is authorized in Google Cloud Console
- Check that redirects are configured for http://localhost:3000 (dev)

### "User with this email already exists. Please use login."

**Issue**: During sign-up, user gets this error

**Solution**:
- This is expected behavior - the email is already registered
- Direct the user to use sign-in instead
- The error is handled and displayed to the user

### "User with this email does not exist. Please sign up first."

**Issue**: During sign-in, user gets this error

**Solution**:
- This is expected behavior - the email is not registered
- Direct the user to sign up first
- The error is handled and displayed to the user

### CORS Errors

**Issue**: Network request fails with CORS error

**Solution**:
- Verify `NEXT_PUBLIC_API_BASE_URL` points to your backend
- Ensure backend has CORS configured for http://localhost:3000
- Check backend logs for CORS issues

### Token Storage Issues

**Issue**: Tokens not persisting after page refresh

**Solution**:
- Check that localStorage is not being cleared
- Verify tokens are being stored with correct keys (`access_token`, `refresh_token`)
- Check browser's Application tab in DevTools

## Production Deployment

### Before Going Live

- [ ] Set up Google OAuth credentials for production domain
- [ ] Update `NEXT_PUBLIC_GOOGLE_CLIENT_ID` for production
- [ ] Update `NEXT_PUBLIC_API_BASE_URL` to production backend
- [ ] Configure HTTPS/SSL certificates
- [ ] Update authorized origins in Google Cloud Console
- [ ] Update authorized redirect URIs in Google Cloud Console
- [ ] Test sign-up and sign-in flows with production credentials
- [ ] Set up error logging and monitoring
- [ ] Test token refresh flow
- [ ] Verify email verification if applicable

### Environment Configuration

```env
# Production
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_production_client_id
```

## Security Considerations

1. **Token Security**:
   - Tokens are stored in localStorage (accessible to JavaScript)
   - Consider using HttpOnly cookies for better security
   - Implement token rotation and refresh logic

2. **HTTPS Only**:
   - Always use HTTPS in production
   - Google will not allow HTTP origins in production

3. **Token Validation**:
   - Backend validates all tokens
   - Frontend should not rely on tokens for sensitive operations

4. **CORS**:
   - Whitelist specific origins
   - Never use wildcard (*) in production CORS

## Additional Features

You can extend this implementation with:

- **Social Login Linking**: Link Google account to existing user accounts
- **Multiple Providers**: Add Facebook, GitHub, etc.
- **User Profile Sync**: Sync additional user data from Google
- **Auto Sign-Out**: Implement automatic session expiration
- **Remember Me**: Persist login state across sessions

## API Endpoints Used

These endpoints are called by the frontend (requires backend to be running):

- `POST /api/v1/auth/google/signup/` - Google sign-up
- `POST /api/auth/google/signin/` - Google sign-in

See [GOOGLE_OAUTH2_SETUP.md](GOOGLE_OAUTH2_SETUP.md) for backend API documentation.

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Get Google Client ID from Google Cloud Console
3. ✅ Add Client ID to `.env.local`
4. ✅ Start backend: `npm run fullstack` (from repo root)
5. ✅ Start frontend: `npm run dev`
6. ✅ Test sign-up at http://localhost:3000/register
7. ✅ Test sign-in at http://localhost:3000/login

## Support

For issues or questions:
- Check the backend API documentation: [GOOGLE_OAUTH2_SETUP.md](GOOGLE_OAUTH2_SETUP.md)
- Review error messages in browser console
- Check backend API logs
- Verify Google Cloud Console configuration
