"use client"

import { ReactNode } from "react"
import { GoogleOAuthProvider } from "@react-oauth/google"

interface GoogleAuthProviderProps {
  children: ReactNode
}

export function GoogleAuthProvider({ children }: GoogleAuthProviderProps) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""

  if (!clientId) {
    console.warn(
      "Google Client ID is not configured. Google OAuth will not work. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID in .env.local"
    )
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  )
}
