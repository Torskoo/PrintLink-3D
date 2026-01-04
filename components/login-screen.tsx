"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Lock, Eye, EyeOff, Printer, Github } from "lucide-react"

interface LoginScreenProps {
  onLogin: (password: string) => boolean
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isShaking, setIsShaking] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const success = onLogin(password)

    if (!success) {
      setError("Mot de passe incorrect")
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500)
      setPassword("")
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <Card className={`w-full max-w-md relative ${isShaking ? "animate-shake" : ""}`}>
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
            <Printer className="w-8 h-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">PrintLink 3D</CardTitle>
            <CardDescription className="mt-2">Entrez le mot de passe pour accéder au tableau de bord</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Entrez le mot de passe"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError("")
                  }}
                  className="pl-10 pr-10"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <Button type="submit" className="w-full">
              Accéder au tableau de bord
            </Button>
          </form>

          <div className="text-center space-y-3">
            <p className="text-xs text-muted-foreground">
              Mot de passe par défaut : <code className="px-1 py-0.5 rounded bg-secondary">printlink</code>
            </p>
            <a
              href="https://github.com/Torskoo/PrintLink-3D"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-3.5 w-3.5" />
              Projet opensource sur GitHub
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
