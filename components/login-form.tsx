"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShieldCheck, Loader2, Boxes, Mail, Zap } from "lucide-react";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSocialLogin = async (provider: "google" | "microsoft") => {
    setIsLoading(provider);
    setError(null);
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "/dashboard",
      });
    } catch {
      setError(`Failed to sign in with ${provider}. Please try again.`);
      setIsLoading(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      {/* Ambient background glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-60 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-primary/4 blur-[120px]" />
        <div className="absolute -bottom-40 right-1/4 h-[400px] w-[600px] rounded-full bg-primary/3 blur-[100px]" />
      </div>

      <div className="relative z-10 flex w-full max-w-[400px] flex-col items-center gap-10">
        {/* Logo & Branding */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            {/* Shimmer ring */}
            <div
              className="absolute -inset-1.5 rounded-2xl bg-gradient-to-br from-primary/40 via-primary/10 to-primary/40 blur-sm"
              style={{ animation: "shimmer 3s ease-in-out infinite" }}
            />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-card ring-1 ring-primary/20">
              <ShieldCheck className="size-8 text-primary" />
            </div>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <h1 className="font-heading text-2xl font-bold tracking-[0.2em] text-foreground">
              ENGSTORE
            </h1>
            <p className="text-xs text-muted-foreground">
              Engineering Component Catalog
            </p>
          </div>
        </div>

        {/* Main Login Card */}
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-base">Sign in to continue</CardTitle>
            <CardDescription>
              Choose your account to get started
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-3">
            {/* Google Button */}
            <Button
              variant="outline"
              size="lg"
              className="h-11 w-full gap-3 text-sm font-medium transition-all duration-200 hover:bg-accent/80 hover:ring-1 hover:ring-primary/20"
              onClick={() => handleSocialLogin("google")}
              disabled={isLoading !== null}
            >
              {isLoading === "google" ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <svg className="size-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              Continue with Google
            </Button>

            {/* Microsoft Button */}
            <Button
              variant="outline"
              size="lg"
              className="h-11 w-full gap-3 text-sm font-medium transition-all duration-200 hover:bg-accent/80 hover:ring-1 hover:ring-primary/20"
              onClick={() => handleSocialLogin("microsoft")}
              disabled={isLoading !== null}
            >
              {isLoading === "microsoft" ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <svg className="size-5" viewBox="0 0 23 23">
                  <rect x="1" y="1" width="10" height="10" fill="#F25022" />
                  <rect x="12" y="1" width="10" height="10" fill="#7FBA00" />
                  <rect x="1" y="12" width="10" height="10" fill="#00A4EF" />
                  <rect x="12" y="12" width="10" height="10" fill="#FFB900" />
                </svg>
              )}
              Continue with Microsoft
            </Button>

            {/* Error message */}
            {error && (
              <div className="rounded-md bg-destructive/10 px-3 py-2.5 text-xs text-destructive text-center">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Feature highlights */}
        <div className="flex w-full flex-col items-center gap-4">
          <Separator className="w-16" />
          <div className="flex items-center gap-6 text-muted-foreground/60">
            <div className="flex flex-col items-center gap-1.5">
              <Boxes className="size-4" />
              <span className="text-[10px] font-medium tracking-wide">Catalog</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <Mail className="size-4" />
              <span className="text-[10px] font-medium tracking-wide">Inbox</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <Zap className="size-4" />
              <span className="text-[10px] font-medium tracking-wide">AI Search</span>
            </div>
          </div>
          <p className="text-center text-[10px] text-muted-foreground/40">
            Secure access powered by OAuth 2.0
          </p>
        </div>
      </div>
    </div>
  );
}
