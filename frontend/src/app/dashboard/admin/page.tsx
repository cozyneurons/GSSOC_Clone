"use client";

import { useEffect, useState } from "react";
import { fetchAPI } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { User } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, ShieldCheck, Mail, Calendar } from "lucide-react";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "admin") return;
    
    const fetchAllUsers = async () => {
      try {
        const data = await fetchAPI<User[]>("/api/v1/dashboard/admin/users");
        setUsers(data);
      } catch (err) {
        console.error("Error fetching admin users", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, [user]);

  if (!user || user.role !== "admin") {
    return <div className="p-8 text-center text-destructive font-medium">Access Denied. Global Admins only.</div>;
  }

  // Calculate simple stats
  const roleStats = users.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Global Admin Panel</h1>
        <p className="text-muted-foreground mt-1">Manage the GSSOC platform users and program-wide analytics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-primary text-primary-foreground shadow-md">
          <CardContent className="p-6 flex flex-col justify-center items-center text-center">
            <Users className="h-8 w-8 mb-2 opacity-80" />
            <p className="text-3xl font-bold">{users.length}</p>
            <p className="text-sm font-medium uppercase tracking-wider opacity-80">Total Users</p>
          </CardContent>
        </Card>
        
        {Object.entries(roleStats).map(([role, count]) => (
          <Card key={role} className="shadow-sm">
            <CardContent className="p-6 flex flex-col justify-center items-center text-center">
              <p className="text-3xl font-bold text-foreground">{count}</p>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mt-1">{role.replace('_', ' ')}s</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-xl flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" /> User Management
          </CardTitle>
          <CardDescription>View and manage all registered platform users.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-10 text-center animate-pulse text-muted-foreground">Loading users...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                  <tr>
                    <th className="px-6 py-3">User</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3">Joined</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.map(u => (
                    <tr key={u.id} className="bg-background hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground">{u.name}</span>
                          <span className="text-muted-foreground text-xs flex items-center gap-1 mt-0.5">
                            <Mail className="h-3 w-3" /> {u.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge 
                          variant={
                            u.role === 'admin' ? 'destructive' : 
                            u.role === 'mentor' ? 'default' : 
                            u.role === 'project_admin' ? 'secondary' : 'outline'
                          } 
                          className="capitalize"
                        >
                          {u.role.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {new Date(u.joined_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-primary hover:underline text-xs font-medium">Edit Role</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
