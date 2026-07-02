"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchAPI } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/dashboard";
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    role: "participant",
    college: ""
  });
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Sign up
      await fetchAPI<any>("/api/v1/auth/signup", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      
      // 2. Automatically login
      const data = await fetchAPI<any>("/api/v1/auth/login-json", {
        method: "POST",
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      
      login(data.access_token, data.user);
      router.push(redirectUrl);
    } catch (err: any) {
      setError(err.message || "Failed to sign up.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center">
      <Card className="w-full max-w-md shadow-lg border-secondary/20">
        <CardHeader className="text-center space-y-2 pb-6">
          <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Join GSSOC
          </CardTitle>
          <CardDescription>Create an account to start contributing</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input 
                  name="name"
                  placeholder="Jane Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Username</label>
                <Input 
                  name="username"
                  placeholder="janedoe"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input 
                type="email" 
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input 
                type="password" 
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <select 
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="participant">Participant</option>
                <option value="mentor">Mentor</option>
                <option value="project_admin">Project Admin</option>
              </select>
            </div>
            {error && (
              <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md font-medium border border-destructive/20">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full mt-4" disabled={loading}>
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center border-t p-6 text-sm">
          <span className="text-muted-foreground mr-1">Already have an account?</span>
          <Link href={`/login?redirect=${redirectUrl}`} className="text-primary hover:underline font-medium">
            Log in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
