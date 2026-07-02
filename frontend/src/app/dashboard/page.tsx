"use client";

import { useEffect, useState } from "react";
import { fetchAPI } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Issue, PullRequest } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CircleDot, GitPullRequestDraft, Trophy, AlertCircle, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [prs, setPrs] = useState<PullRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    // Only fetch these for participants, or maybe it returns empty for others
    const fetchDashboardData = async () => {
      try {
        if (user.role === "participant") {
          const [issuesData, prsData] = await Promise.all([
            fetchAPI<Issue[]>("/api/v1/dashboard/participant/issues"),
            fetchAPI<PullRequest[]>("/api/v1/dashboard/participant/prs")
          ]);
          setIssues(issuesData);
          setPrs(prsData);
        }
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (!user) return null;

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {user.name}</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your open-source journey.</p>
        </div>
        {user.role === "participant" && (
          <div className="flex items-center gap-4 p-4 rounded-xl border bg-muted/20">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Total Points</p>
              {/* Note: since total_points isn't in base User type, we default to 0 if missing */}
              <p className="text-2xl font-bold text-foreground">{(user as any).total_points || 0}</p>
            </div>
          </div>
        )}
      </div>

      {user.role === "participant" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Assigned Issues */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-xl flex items-center gap-2">
                <CircleDot className="h-5 w-5 text-green-500" /> Assigned Issues
              </CardTitle>
              <CardDescription>Issues currently assigned to you.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-6 text-center animate-pulse text-muted-foreground">Loading...</div>
              ) : issues.length === 0 ? (
                <div className="p-10 text-center flex flex-col items-center">
                  <AlertCircle className="h-10 w-10 text-muted-foreground opacity-50 mb-3" />
                  <p className="text-muted-foreground">You don't have any assigned issues yet.</p>
                  <Link href="/projects" className="text-primary hover:underline mt-2 text-sm font-medium">
                    Find projects to contribute to
                  </Link>
                </div>
              ) : (
                <div className="divide-y">
                  {issues.map(issue => (
                    <div key={issue.id} className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center hover:bg-muted/30 transition-colors">
                      <div>
                        <Link href={`/projects/${issue.project_id}`} className="font-semibold text-base hover:text-primary transition-colors block">
                          {issue.title}
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs font-normal bg-muted">{issue.label}</Badge>
                          <span className="text-xs text-muted-foreground">Points: <strong className="text-foreground">{issue.points}</strong></span>
                        </div>
                      </div>
                      <Badge variant={issue.status === 'open' ? 'default' : 'secondary'} className="capitalize shrink-0">
                        {issue.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* My Pull Requests */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-xl flex items-center gap-2">
                <GitPullRequestDraft className="h-5 w-5 text-primary" /> My Pull Requests
              </CardTitle>
              <CardDescription>Status of your submitted pull requests.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-6 text-center animate-pulse text-muted-foreground">Loading...</div>
              ) : prs.length === 0 ? (
                <div className="p-10 text-center flex flex-col items-center">
                  <GitPullRequestDraft className="h-10 w-10 text-muted-foreground opacity-50 mb-3" />
                  <p className="text-muted-foreground">You haven't submitted any pull requests yet.</p>
                </div>
              ) : (
                <div className="divide-y">
                  {prs.map(pr => (
                    <div key={pr.id} className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center hover:bg-muted/30 transition-colors">
                      <div className="min-w-0 flex-1 w-full">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-base truncate">{pr.title}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <a href={pr.github_pr_url} target="_blank" rel="noreferrer" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors truncate">
                            <ExternalLink className="h-3 w-3" /> View on GitHub
                          </a>
                          <span className="text-xs text-muted-foreground">Submitted {new Date(pr.submitted_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex flex-col sm:items-end gap-1 shrink-0 w-full sm:w-auto">
                        <Badge 
                          variant={pr.status === 'merged' ? 'default' : pr.status === 'rejected' ? 'destructive' : 'secondary'} 
                          className="capitalize w-max bg-opacity-10"
                        >
                          {pr.status}
                        </Badge>
                        {pr.status === 'merged' && (
                          <span className="text-xs font-medium text-green-600 dark:text-green-400">+{pr.points_awarded} pts</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <p className="mb-4">You are logged in as <strong>{user.role}</strong>.</p>
            <p>Use the sidebar navigation to access your specific tools.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
