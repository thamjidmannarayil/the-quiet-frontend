/**
 * Google OAuth2 Service
 * Handles Google signup and signin API calls
 */

export interface GoogleAuthResponse {
  user: {
    id: number
    username: string
    email: string
    full_name: string
    phone?: string
    avatar?: string
    is_active: boolean
  }
  refresh: string
  access: string
  message: string
}

export interface GoogleAuthError {
  detail?: string
  error?: string
  message?: string
}

/**
 * Handle Google Signup
 * @param token Google ID token from frontend
 * @param username Optional username
 * @param phone Optional phone number
 */
export async function googleSignup(
  token: string,
  username?: string,
  phone?: string
): Promise<GoogleAuthResponse> {
  const payload: Record<string, string> = { token }
  if (username) payload.username = username
  if (phone) payload.phone = phone

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/google/signup/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  )

  if (!response.ok) {
    const error: GoogleAuthError = await response.json()
    throw new Error(error.detail || error.message || "Google signup failed")
  }

  return response.json()
}

/**
 * Handle Google Signin
 * @param token Google ID token from frontend
 */
export async function googleSignin(token: string): Promise<GoogleAuthResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/google/signin/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    }
  )

  if (!response.ok) {
    const error: GoogleAuthError = await response.json()
    throw new Error(error.detail || error.message || "Google signin failed")
  }

  return response.json()
}

/**
 * Store auth tokens in localStorage
 */
export function storeAuthTokens(access: string, refresh: string): void {
  localStorage.setItem("access_token", access)
  localStorage.setItem("refresh_token", refresh)
}

/**
 * Decode JWT token to get expiration time
 */
export function getTokenExpirationTime(token: string): number | null {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null

    const decoded = JSON.parse(atob(parts[1]))
    return decoded.exp ? decoded.exp * 1000 : null
  } catch {
    return null
  }
}
