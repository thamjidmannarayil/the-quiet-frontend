"use client"

import { useCallback } from "react"
import { useRouter } from "next/navigation"
import { GoogleLogin, CredentialResponse } from "@react-oauth/google"
import { useToast } from "@/components/ui/use-toast"
import { googleSignin, googleSignup, storeAuthTokens } from "@/lib/google-auth"
import { useAuth } from "@/hooks/useAuth"

interface GoogleSignInButtonProps {
  mode?: "signin" | "signup"
  onSuccess?: () => void
  onError?: (error: Error) => void
  redirectUrl?: string
}

export function GoogleSignInButton({
  mode = "signin",
  onSuccess,
  onError,
  redirectUrl = "/",
}: GoogleSignInButtonProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { checkAuth } = useAuth()

  const handleGoogleResponse = useCallback(
    async (credentialResponse: CredentialResponse) => {
      try {
        if (!credentialResponse.credential) {
          throw new Error("No credential received from Google")
        }

        let response
        if (mode === "signup") {
          response = await googleSignup(credentialResponse.credential)
        } else {
          response = await googleSignin(credentialResponse.credential)
        }

        // Store tokens
        storeAuthTokens(response.access, response.refresh)

        // Update auth state
        await checkAuth()

        // Show success toast
        toast({
          title: "Success",
          description:
            response.message || `Google ${mode} successful! Welcome!`,
          variant: "success",
          duration: 2000,
        })

        // Call optional callback
        if (onSuccess) {
          onSuccess()
        }

        // Small delay to ensure auth state propagates
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Redirect
        router.push(redirectUrl)
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An error occurred"

        toast({
          title: `Google ${mode} failed`,
          description: errorMessage,
          variant: "destructive",
          duration: 3000,
        })

        if (onError && error instanceof Error) {
          onError(error)
        }
      }
    },
    [mode, router, toast, checkAuth, onSuccess, onError, redirectUrl]
  )

  const handleError = useCallback(() => {
    const error = new Error(
      `Google ${mode} was cancelled or failed. Please try again.`
    )
    toast({
      title: `Google ${mode} failed`,
      description: error.message,
      variant: "destructive",
      duration: 3000,
    })
    if (onError) {
      onError(error)
    }
  }, [mode, toast, onError])

  return (
    <GoogleLogin
      onSuccess={handleGoogleResponse}
      onError={handleError}
      text={mode === "signup" ? "signup_with" : "signin_with"}
      size="large"
      locale="en"
      logo_alignment="left"
    />
  )
}
