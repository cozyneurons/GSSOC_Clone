"use client";

import { useEffect, useState } from "react";
import { fetchAPI } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { PullRequest } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GitPullRequest, Check, X, ExternalLink } from "lucide-react";

export default function MentorDashboardPage() {
  const { user } = useAuth();
  const [pendingPrs, setPendingPrs] = useState<PullRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [pointsInput, setPointsInput] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!user || user.role !== "mentor") return;
    
    const fetchPendingPrs = async () => {
      try {
        const data = await fetchAPI<PullRequest[]>("/api/v1/dashboard/mentor/prs/pending");
        setPendingPrs(data);
        
        // Initialize points input with 0
        const initialPoints: Record<string, number> = {};
        data.forEach(pr => {
          initialPoints[pr.id] = 0;
        });
        setPointsInput(initialPoints);
      } catch (err) {
        console.error("Error fetching mentor pending PRs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingPrs();
  }, [user]);

  const handleUpdatePr = async (prId: string, status: "merged" | "rejected") => {
    setProcessingId(prId);
    try {
      const points = status === "merged" ? (pointsInput[prId] || 0) : 0;
      
      const updatedPr = await fetchAPI<PullRequest>(`/api/v1/pull-requests/${prId}`, {
        method: "PATCH",
        body: JSON.stringify({
          status: status,
          points_awarded: points
        })
      });
      
      // Remove PR from list on success
      setPendingPrs(prev => prev.filter(pr => pr.id !== prId));
    } catch (err) {
      console.error("Error updating PR", err);
      alert("Failed to update Pull Request. Check console for details.");
    } finally {
      setProcessingId(null);
    }
  };

  const handlePointsChange = (prId: string, val: string) => {
    const num = parseInt(val, 10);
    setPointsInput(prev => ({
      ...prev,
      [prId]: isNaN(num) ? 0 : num
    }));
  };

  if (!user || user.role !== "mentor") {
    return <div className="p-8 text-center text-destructive font-medium">Access Denied. Mentors only.</div>;
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Review Pull Requests</h1>
        <p className="text-muted-foreground mt-1">Manage and assign points to pending PRs for your mentored projects.</p>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-xl flex items-center gap-2">
            <GitPullRequest className="h-5 w-5 text-primary" /> Pending Reviews ({pendingPrs.length})
          </CardTitle>
          <CardDescription>Review submissions, verify code, and award points accordingly.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-10 text-center animate-pulse text-muted-foreground">Loading pending reviews...</div>
          ) : pendingPrs.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center">
              <Check className="h-12 w-12 text-green-500 opacity-50 mb-4" />
              <p className="text-lg font-medium text-foreground">You're all caught up!</p>
              <p className="text-muted-foreground">No pending pull requests for your projects.</p>
            </div>
          ) : (
            <div className="divide-y">
              {pendingPrs.map(pr => (
                <div key={pr.id} className="p-6 flex flex-col md:flex-row gap-6 justify-between items-start hover:bg-muted/10 transition-colors">
                  <div className="flex-1 space-y-2 w-full">
                    <h3 className="font-semibold text-lg">{pr.title}</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                      <span className="text-muted-foreground">
                        Contributor ID: <span className="text-foreground font-mono bg-muted px-1.5 py-0.5 rounded text-xs">{pr.contributor_id.slice(0,8)}</span>
                      </span>
                      <span className="text-muted-foreground">
                        Project ID: <span className="text-foreground font-mono bg-muted px-1.5 py-0.5 rounded text-xs">{pr.project_id.slice(0,8)}</span>
                      </span>
                      <span className="text-muted-foreground">
                        Submitted: <span className="text-foreground">{new Date(pr.submitted_at).toLocaleDateString()}</span>
                      </span>
                    </div>
                    <a href={pr.github_pr_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium pt-2">
                      <ExternalLink className="h-4 w-4" /> View PR on GitHub
                    </a>
                  </div>
                  
                  <div className="flex flex-col gap-3 w-full md:w-auto bg-muted/30 p-4 rounded-xl border shrink-0">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Award Points</label>
                      <Input 
                        type="number" 
                        min="0"
                        className="w-full md:w-40 bg-background"
                        value={pointsInput[pr.id] || 0}
                        onChange={(e) => handlePointsChange(pr.id, e.target.value)}
                        disabled={processingId === pr.id}
                      />
                    </div>
                    <div className="flex gap-2 mt-1">
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700 text-white" 
                        onClick={() => handleUpdatePr(pr.id, "merged")}
                        disabled={processingId === pr.id}
                      >
                        {processingId === pr.id ? "Processing..." : "Merge & Award"}
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={() => handleUpdatePr(pr.id, "rejected")}
                        disabled={processingId === pr.id}
                        title="Reject PR"
                        className="px-3"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
