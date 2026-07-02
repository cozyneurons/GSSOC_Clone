"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              GSSOC
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/projects" className="transition-colors hover:text-primary">
              Projects
            </Link>
            <Link href="/leaderboard" className="transition-colors hover:text-primary">
              Leaderboard
            </Link>
          </nav>
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <div className="flex items-center gap-2 border-l pl-4">
                <Avatar fallback={user.username} />
                <span className="text-sm font-medium">{user.username}</span>
                <Button variant="ghost" size="icon" onClick={logout} title="Logout">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign up</Button>
              </Link>
            </div>
          )}
        </div>

        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-b p-4 bg-background">
          <div className="flex flex-col space-y-4">
            <Link href="/projects" className="text-sm font-medium">Projects</Link>
            <Link href="/leaderboard" className="text-sm font-medium">Leaderboard</Link>
            {user ? (
              <>
                <Link href="/dashboard" className="text-sm font-medium">Dashboard</Link>
                <button onClick={logout} className="text-sm font-medium text-left text-red-500">Logout</button>
              </>
            ) : (
              <div className="flex flex-col gap-2 mt-4">
                <Link href="/login">
                  <Button variant="outline" className="w-full">Log in</Button>
                </Link>
                <Link href="/signup">
                  <Button className="w-full">Sign up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
