# Google OAuth2 Integration Examples

This file demonstrates how to use Google OAuth2 authentication in different scenarios.

## Basic Usage

### Sign-In Only (Login Page)

```tsx
import { GoogleSignInButton } from '@/components/google-signin-button'

export function LoginPage() {
  return (
    <div>
      <h1>Login</h1>
      <GoogleSignInButton 
        mode="signin"
        redirectUrl="/dashboard"
      />
    </div>
  )
}
```

### Sign-Up Only (Registration Page)

```tsx
import { GoogleSignInButton } from '@/components/google-signin-button'
import { useRouter } from 'next/navigation'

export function RegisterPage() {
  const router = useRouter()

  return (
    <div>
      <h1>Create Account</h1>
      <GoogleSignInButton 
        mode="signup"
        onSuccess={() => {
          console.log('Registration successful!')
          // Component will automatically redirect
        }}
      />
    </div>
  )
}
```

---

## Advanced Usage

### With Callbacks

```tsx
import { GoogleSignInButton } from '@/components/google-signin-button'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

export function AuthComponent() {
  const router = useRouter()
  const { toast } = useToast()

  const handleSuccess = () => {
    console.log('User authenticated successfully!')
    toast({
      title: 'Welcome!',
      description: 'You have been authenticated.',
      variant: 'success'
    })
    // Component automatically redirects, but you can perform additional actions
  }

  const handleError = (error: Error) => {
    console.error('Authentication error:', error.message)
    toast({
      title: 'Authentication Failed',
      description: error.message,
      variant: 'destructive'
    })
  }

  return (
    <GoogleSignInButton 
      mode="signin"
      redirectUrl="/profile"
      onSuccess={handleSuccess}
      onError={handleError}
    />
  )
}
```

### Custom Redirect Based on User Type

```tsx
import { GoogleSignInButton } from '@/components/google-signin-button'
import { useRouter } from 'next/navigation'

export function SmartAuthButton() {
  const router = useRouter()

  const handleSuccess = () => {
    // Fetch user data to determine role
    const userRole = localStorage.getItem('user_role')
    
    if (userRole === 'admin') {
      router.push('/admin/dashboard')
    } else if (userRole === 'moderator') {
      router.push('/moderator/dashboard')
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <GoogleSignInButton 
      mode="signin"
      onSuccess={handleSuccess}
    />
  )
}
```

---

## Using Utility Functions Directly

### Manual Google Sign-In

```tsx
"use client"

import { useState } from 'react'
import { CredentialResponse, GoogleLogin } from '@react-oauth/google'
import { googleSignin, storeAuthTokens } from '@/lib/google-auth'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'

export function CustomGoogleSignIn() {
  const [loading, setLoading] = useState(false)
  const { checkAuth } = useAuth()

  const handleGoogleResponse = async (credentialResponse: CredentialResponse) => {
    try {
      setLoading(true)
      const response = await googleSignin(credentialResponse.credential!)
      storeAuthTokens(response.access, response.refresh)
      await checkAuth()
      console.log('Sign in successful!')
    } catch (error) {
      console.error('Sign in failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <GoogleLogin
      onSuccess={handleGoogleResponse}
      onError={() => console.log('Login Failed')}
    />
  )
}
```

### Manual Google Sign-Up

```tsx
"use client"

import { useState } from 'react'
import { CredentialResponse, GoogleLogin } from '@react-oauth/google'
import { googleSignup, storeAuthTokens } from '@/lib/google-auth'
import { useAuth } from '@/hooks/useAuth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function CustomGoogleSignUp() {
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [phone, setPhone] = useState('')
  const { checkAuth } = useAuth()

  const handleGoogleResponse = async (credentialResponse: CredentialResponse) => {
    try {
      setLoading(true)
      const response = await googleSignup(
        credentialResponse.credential!,
        username || undefined,
        phone || undefined
      )
      storeAuthTokens(response.access, response.refresh)
      await checkAuth()
      console.log('Sign up successful!')
    } catch (error) {
      console.error('Sign up failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Username (optional)"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Input
        placeholder="Phone (optional)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <GoogleLogin
        onSuccess={handleGoogleResponse}
        onError={() => console.log('Sign up Failed')}
      />
    </div>
  )
}
```

---

## Token Management

### Access & Store Tokens

```tsx
import { storeAuthTokens, getTokenExpirationTime } from '@/lib/google-auth'

// Store tokens after authentication
storeAuthTokens(response.access, response.refresh)

// Get token expiration time
const expirationTime = getTokenExpirationTime(response.access)
console.log('Token expires at:', new Date(expirationTime))
```

### Check Token Expiration

```tsx
import { useEffect } from 'react'
import { getTokenExpirationTime } from '@/lib/google-auth'
import { useRouter } from 'next/navigation'

export function TokenExpirationChecker() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) return

    const expirationTime = getTokenExpirationTime(token)
    if (!expirationTime) return

    const timeUntilExpiry = expirationTime - Date.now()
    
    // Redirect to login 5 minutes before expiry
    const redirectTimeout = setTimeout(() => {
      console.log('Token expired, redirecting to login...')
      router.push('/login')
    }, timeUntilExpiry - 5 * 60 * 1000)

    return () => clearTimeout(redirectTimeout)
  }, [router])

  return null
}
```

---

## Integration with Existing Auth System

### Using with useAuth Hook

```tsx
import { useAuth } from '@/hooks/useAuth'
import { GoogleSignInButton } from '@/components/google-signin-button'

export function ProtectedComponent() {
  const { user, isAuthenticated, loading, logout } = useAuth()

  if (loading) return <div>Loading...</div>

  if (!isAuthenticated) {
    return (
      <div>
        <h1>Please Sign In</h1>
        <GoogleSignInButton mode="signin" />
      </div>
    )
  }

  return (
    <div>
      <h1>Welcome, {user?.full_name || user?.username}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

---

## Error Handling

### Comprehensive Error Handling

```tsx
"use client"

import { useState } from 'react'
import { GoogleSignInButton } from '@/components/google-signin-button'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function AuthWithErrorHandling() {
  const [error, setError] = useState<string | null>(null)

  const handleError = (error: Error) => {
    // Parse error message
    if (error.message.includes('already exists')) {
      setError('This email is already registered. Please sign in instead.')
    } else if (error.message.includes('does not exist')) {
      setError('This email is not registered. Please sign up first.')
    } else if (error.message.includes('cancelled')) {
      setError('Authentication was cancelled.')
    } else {
      setError(`Authentication failed: ${error.message}`)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <GoogleSignInButton 
        mode="signin"
        onError={handleError}
      />
    </div>
  )
}
```

---

## Combined Sign-In/Sign-Up Component

```tsx
"use client"

import { useState } from 'react'
import { GoogleSignInButton } from '@/components/google-signin-button'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function CombinedAuthComponent() {
  const [activeTab, setActiveTab] = useState('signin')

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="signin">Sign In</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>

      <TabsContent value="signin" className="space-y-4">
        <h2>Welcome Back</h2>
        <GoogleSignInButton 
          mode="signin"
          redirectUrl="/dashboard"
        />
      </TabsContent>

      <TabsContent value="signup" className="space-y-4">
        <h2>Create Account</h2>
        <GoogleSignInButton 
          mode="signup"
          redirectUrl="/onboarding"
          onSuccess={() => setActiveTab('signin')}
        />
      </TabsContent>
    </Tabs>
  )
}
```

---

## Testing

### Test Sign-In

```bash
# Navigate to login page
http://localhost:3000/login

# Click Google button
# Authenticate with test account
# Should redirect to dashboard
```

### Test Sign-Up

```bash
# Navigate to register page
http://localhost:3000/register

# Click Google button
# Use new or existing account
# Should create user and redirect
```

### Verify Tokens

In browser console:
```javascript
// Check if tokens are stored
console.log('Access token:', localStorage.getItem('access_token'))
console.log('Refresh token:', localStorage.getItem('refresh_token'))

// Decode token
const token = localStorage.getItem('access_token')
const decoded = JSON.parse(atob(token.split('.')[1]))
console.log('Token data:', decoded)
```

---

## Debugging

### Enable Debug Logging

```tsx
// In your component
import { GoogleSignInButton } from '@/components/google-signin-button'

export function DebugAuthButton() {
  const handleError = (error: Error) => {
    console.error('Auth Error Details:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    })
  }

  return (
    <GoogleSignInButton 
      mode="signin"
      onError={handleError}
    />
  )
}
```

### Check Environment Variables

```javascript
// In browser console
console.log('Google Client ID:', process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)
console.log('API Base URL:', process.env.NEXT_PUBLIC_API_BASE_URL)
```

---

## Environment-Specific Configuration

### Development

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_dev_client_id
```

### Production

```env
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_prod_client_id
```

---

## Best Practices

1. ✅ Always use the `GoogleSignInButton` component for consistency
2. ✅ Handle errors gracefully with user-friendly messages
3. ✅ Store tokens securely (consider HttpOnly cookies for production)
4. ✅ Implement token refresh logic
5. ✅ Validate tokens on backend
6. ✅ Use HTTPS in production
7. ✅ Test both sign-in and sign-up flows
8. ✅ Monitor authentication errors
9. ✅ Implement rate limiting on auth endpoints
10. ✅ Keep Google Client ID secure (never expose Secret)

---

## Support

For more information:
- [Frontend Setup Guide](GOOGLE_OAUTH2_FRONTEND_SETUP.md)
- [Backend API Documentation](docs/GOOGLE_OAUTH2_SETUP.md)
- [@react-oauth/google Documentation](https://www.npmjs.com/package/@react-oauth/google)
