"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  GitPullRequest, 
  CheckCircle, 
  Users, 
  Settings,
  ShieldCheck,
  Megaphone
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/dashboard");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="p-8 text-center animate-pulse">Loading dashboard...</div>;
  }

  const getNavLinks = () => {
    const links = [
      { href: "/dashboard", label: "Overview", icon: <LayoutDashboard className="w-5 h-5" />, roles: ["participant", "mentor", "project_admin", "admin"] },
    ];

    if (user.role === "participant") {
      // no additional yet, all in overview
    }
    
    if (user.role === "mentor") {
      links.push({ href: "/dashboard/mentor", label: "Review PRs", icon: <GitPullRequest className="w-5 h-5" />, roles: ["mentor"] });
    }

    if (user.role === "project_admin") {
      links.push({ href: "/dashboard/project-admin", label: "Manage Projects", icon: <Settings className="w-5 h-5" />, roles: ["project_admin"] });
    }

    if (user.role === "admin") {
      links.push(
        { href: "/dashboard/admin", label: "Admin Panel", icon: <ShieldCheck className="w-5 h-5" />, roles: ["admin"] }
      );
    }

    return links;
  };

  const navLinks = getNavLinks();

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      <aside className="w-full md:w-64 border-r bg-muted/20 md:min-h-full flex-shrink-0">
        <div className="p-6">
          <h2 className="text-lg font-bold tracking-tight mb-6">Dashboard</h2>
          <nav className="space-y-2">
            {navLinks.map(link => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.href} href={link.href}>
                  <div className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    isActive 
                      ? "bg-primary text-primary-foreground font-medium shadow-sm" 
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}>
                    {link.icon}
                    {link.label}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
