"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchAPI } from "@/lib/api";
import { User } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar, MapPin, AlignLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UserProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  
  // Extend User type to match UserResponse from backend which has total_points and joined_at
  const [userProfile, setUserProfile] = useState<(User & { total_points: number; joined_at: string }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchUserProfile = async () => {
      try {
        const data = await fetchAPI<any>(`/api/v1/users/${id}`);
        setUserProfile(data);
      } catch (err) {
        console.error("Error fetching user profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl animate-pulse space-y-6">
        <div className="h-48 bg-muted rounded-xl"></div>
        <div className="h-64 bg-muted rounded-xl"></div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">User Not Found</h2>
        <p className="text-muted-foreground mb-6">The profile you are looking for does not exist.</p>
        <Button onClick={() => router.push("/leaderboard")}>Back to Leaderboard</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="overflow-hidden border-primary/10 shadow-lg mb-8">
        <div className="h-32 bg-gradient-to-r from-primary/80 to-secondary/80"></div>
        <CardContent className="p-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 mb-6">
            <Avatar 
              src={userProfile.avatar_url} 
              fallback={userProfile.username} 
              className="h-32 w-32 border-4 border-background shadow-md bg-white text-4xl" 
            />
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-3xl font-bold">{userProfile.name}</h1>
              <p className="text-muted-foreground text-lg">@{userProfile.username}</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="default" className="text-sm px-3 py-1 capitalize">
                {userProfile.role.replace('_', ' ')}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="space-y-4">
              {userProfile.bio && (
                <div className="flex items-start gap-3">
                  <AlignLeft className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground leading-relaxed">{userProfile.bio}</p>
                </div>
              )}
              {userProfile.college && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">{userProfile.college}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">Joined {new Date(userProfile.joined_at).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="bg-muted/30 p-6 rounded-xl border flex flex-col items-center justify-center text-center">
              <Trophy className="h-12 w-12 text-primary mb-3" />
              <h3 className="text-4xl font-black text-primary">{userProfile.total_points}</h3>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mt-1">Total Points</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* We could potentially fetch /api/v1/pull-requests and filter by this user in the frontend,
          but the API doesn't expose a clean way to do that publicly unless we pull all PRs. 
          For now, this serves as a solid user profile. */}
    </div>
  );
}
