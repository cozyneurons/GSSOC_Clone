"use client";

import { useEffect, useState } from "react";
import { fetchAPI } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings, Users, CircleDot, Code2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ProjectStats {
  id: string;
  name: string;
  issues_count: number;
  mentors_count: number;
}

export default function ProjectAdminDashboardPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<ProjectStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "project_admin") return;
    
    const fetchProjects = async () => {
      try {
        const data = await fetchAPI<ProjectStats[]>("/api/v1/dashboard/project-admin/projects");
        setProjects(data);
      } catch (err) {
        console.error("Error fetching project admin projects", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  if (!user || user.role !== "project_admin") {
    return <div className="p-8 text-center text-destructive font-medium">Access Denied. Project Admins only.</div>;
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Projects</h1>
        <p className="text-muted-foreground mt-1">Overview of the projects you administrate in GSSOC.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map(i => <div key={i} className="h-48 bg-muted animate-pulse rounded-xl"></div>)}
        </div>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent className="p-16 text-center flex flex-col items-center">
            <Code2 className="h-12 w-12 text-muted-foreground opacity-50 mb-4" />
            <p className="text-lg font-medium text-foreground mb-1">No Projects Found</p>
            <p className="text-muted-foreground mb-6">You are not administrating any projects yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <Card key={project.id} className="shadow-sm border-t-4 border-t-primary hover:shadow-md transition-all">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl truncate" title={project.name}>{project.name}</CardTitle>
                <CardDescription className="font-mono text-xs mt-1">ID: {project.id.slice(0, 8)}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/30 p-3 rounded-lg border text-center">
                    <CircleDot className="h-5 w-5 mx-auto mb-1 text-primary" />
                    <p className="text-2xl font-bold">{project.issues_count}</p>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Issues</p>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg border text-center">
                    <Users className="h-5 w-5 mx-auto mb-1 text-secondary" />
                    <p className="text-2xl font-bold">{project.mentors_count}</p>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Mentors</p>
                  </div>
                </div>
                
                <div className="pt-2">
                  <Link href={`/projects/${project.id}`} className="w-full">
                    <Button variant="outline" className="w-full gap-2 text-primary hover:text-primary hover:bg-primary/5">
                      <Settings className="h-4 w-4" /> Manage Project View
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
