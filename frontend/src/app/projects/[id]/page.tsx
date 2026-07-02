"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchAPI } from "@/lib/api";
import { Project, Issue } from "@/types";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Github, AlertCircle, Coins } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [project, setProject] = useState<Project | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchProjectDetails = async () => {
      try {
        const [projectData, issuesData] = await Promise.all([
          fetchAPI<Project>(`/api/v1/projects/${id}`),
          fetchAPI<Issue[]>(`/api/v1/issues?project_id=${id}`)
        ]);
        setProject(projectData);
        setIssues(issuesData);
      } catch (err) {
        console.error("Error fetching project details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted w-32 rounded"></div>
          <div className="h-48 bg-muted rounded-xl"></div>
          <div className="h-8 bg-muted w-48 rounded"></div>
          <div className="space-y-4">
            <div className="h-24 bg-muted rounded-xl"></div>
            <div className="h-24 bg-muted rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
        <p className="text-muted-foreground mb-6">The project you are looking for does not exist.</p>
        <Button onClick={() => router.push("/projects")}>Back to Projects</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to projects
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-4xl font-bold">{project.name}</h1>
              <Badge variant={project.difficulty_level === 'beginner' ? 'default' : 'secondary'}>
                {project.difficulty_level}
              </Badge>
            </div>
            <p className="text-lg text-muted-foreground mb-6">{project.description}</p>
            
            <div className="flex items-center gap-2 mb-8">
              <a href={project.repo_url} target="_blank" rel="noreferrer">
                <Button variant="outline" className="gap-2">
                  <Github className="h-4 w-4" /> View Repository
                </Button>
              </a>
            </div>

            <h2 className="text-2xl font-bold mb-4 border-b pb-2">Open Issues</h2>
            <div className="space-y-4">
              {issues.length === 0 ? (
                <div className="p-8 text-center border rounded-lg bg-muted/20">
                  <p className="text-muted-foreground">No issues found for this project.</p>
                </div>
              ) : (
                issues.map(issue => (
                  <Card key={issue.id} className="transition-shadow hover:shadow-md">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start gap-4">
                        <CardTitle className="text-lg">{issue.title}</CardTitle>
                        <Badge variant="outline" className="shrink-0 flex items-center gap-1 bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-500">
                          <Coins className="h-3 w-3" /> {issue.points} pts
                        </Badge>
                      </div>
                      <CardDescription>
                        <Badge variant="secondary" className="mr-2 text-xs">{issue.label}</Badge>
                        <span className="text-xs text-muted-foreground">Created {new Date(issue.created_at).toLocaleDateString()}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm">
                      {issue.description}
                    </CardContent>
                    <CardFooter className="pt-2 border-t mt-4 flex justify-between items-center bg-muted/10 rounded-b-xl">
                      <span className="text-sm">
                        Status: <strong className={issue.status === 'open' ? 'text-green-500' : 'text-muted-foreground'}>{issue.status}</strong>
                      </span>
                      {issue.status === 'open' && (
                        user ? (
                          <Button size="sm">Contribute</Button>
                        ) : (
                          <Link href={`/login?redirect=/projects/${project.id}`}>
                            <Button size="sm" variant="outline">Login to Contribute</Button>
                          </Link>
                        )
                      )}
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <strong className="block text-muted-foreground mb-1">Status</strong>
                <Badge variant="outline" className="capitalize">{project.status}</Badge>
              </div>
              <div>
                <strong className="block text-muted-foreground mb-1">Tech Stack</strong>
                <div className="flex flex-wrap gap-2">
                  {project.tech_stack.map(tech => (
                    <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <strong className="block text-muted-foreground mb-1">Tags</strong>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
