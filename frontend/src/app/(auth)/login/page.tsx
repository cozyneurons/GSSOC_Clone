"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchAPI } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/dashboard";
  const { login } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await fetchAPI<any>("/api/v1/auth/login-json", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      
      login(data.access_token, data.user);
      router.push(redirectUrl);
    } catch (err: any) {
      setError(err.message || "Failed to login. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-24 flex items-center justify-center">
      <Card className="w-full max-w-md shadow-lg border-primary/20">
        <CardHeader className="text-center space-y-2 pb-6">
          <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Welcome Back
          </CardTitle>
          <CardDescription>Login to manage your open-source journey</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input 
                type="email" 
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Password</label>
                <span className="text-xs text-primary cursor-pointer hover:underline">Forgot password?</span>
              </div>
              <Input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md font-medium border border-destructive/20">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full mt-4" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center border-t p-6 text-sm">
          <span className="text-muted-foreground mr-1">Don't have an account?</span>
          <Link href={`/signup?redirect=${redirectUrl}`} className="text-primary hover:underline font-medium">
            Sign up here
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
