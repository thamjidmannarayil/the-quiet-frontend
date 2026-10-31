"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { GoogleSignInButton } from "@/components/google-signin-button"

interface LoginFormProps {
  onForgotPassword: () => void
  onRegister: () => void
}

export default function LoginForm({ onForgotPassword, onRegister }: LoginFormProps) {
  const [form, setForm] = useState({ username: "", password: "" })
  const [errors, setErrors] = useState({ username: "", password: "" })
  const [touched, setTouched] = useState({ username: false, password: false })
  const [loading, setLoading] = useState(false)
  const [remember, setRemember] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { checkAuth } = useAuth()
  const redirectUrl = searchParams.get('redirect') || '/'

  const validate = (name: string, value: string) => {
    if (!value.trim()) {
      return "This field is required"
    }
    return ""
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))

    if (touched[name as keyof typeof touched] || errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: validate(name, value) }))
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    setErrors(prev => ({ ...prev, [name]: validate(name, value) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const usernameError = validate("username", form.username)
    const passwordError = validate("password", form.password)

    setErrors({ username: usernameError, password: passwordError })
    setTouched({ username: true, password: true })

    if (usernameError || passwordError) {
      return
    }

    setLoading(true)
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
      credentials: "include"
    })
    if (res.ok) {
      const data = await res.json()
      localStorage.setItem("access_token", data.access)
      localStorage.setItem("refresh_token", data.refresh)
      await checkAuth()

      // Show success message from API response
      toast({
        title: "Success",
        description: data.message || "Login successful! Welcome back!",
        variant: "success",
        duration: 3000
      })

      // Small delay to ensure auth state propagates before redirecting
      await new Promise(resolve => setTimeout(resolve, 100))
      router.push(redirectUrl)
    } else {
      const err = await res.json()

      // Show error message from API response
      toast({
        title: "Login failed",
        description: err.error || err.message || err.detail || "Invalid credentials.",
        variant: "destructive",
        duration: 3000
      })
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="space-y-0.5">
        <Label htmlFor="username" className="text-sm font-medium">Username/Email</Label>
        <Input
          id="username"
          name="username"
          type="text"
          value={form.username}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.username ? "border-red-500 focus-visible:ring-red-500" : ""}
          autoFocus
        />
        {errors.username && (
          <p className="text-xs text-red-500 mt-1">{errors.username}</p>
        )}
      </div>
      <div className="space-y-0.5">
        <Label htmlFor="password" className="text-sm font-medium">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
        />
        {errors.password && (
          <p className="text-xs text-red-500 mt-1">{errors.password}</p>
        )}
      </div>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="accent-teal-500" />
          Remember Me
        </label>
        <button type="button" className="hover:underline text-teal-600" onClick={onForgotPassword}>
          Forgot password?
        </button>
      </div>
      <Button type="submit" className="w-full rounded py-2 text-base font-semibold mt-2" disabled={loading}>
        {loading ? "Logging in..." : "Log In"}
      </Button>
      <div className="flex items-center gap-2 my-2">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">or</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
      <div className="w-full flex justify-center">
        <GoogleSignInButton mode="signin" redirectUrl={redirectUrl} />
      </div>
      <div className="text-center text-sm mt-6">
        Don't have an account? <button type="button" className="text-teal-600 hover:underline" onClick={onRegister}>Register</button>
      </div>
    </form>
  )
}
