"use client";

import { useState, useEffect } from "react";
import { fetchAPI } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Trophy, Medal, Award } from "lucide-react";
import Link from "next/link";

interface BadgeMinimal {
  id: string;
  name: string;
  icon: string;
}

interface LeaderboardEntry {
  userId: string;
  name: string;
  username: string;
  avatarUrl?: string;
  totalPoints: number;
  rank: number;
  badges: BadgeMinimal[];
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await fetchAPI<LeaderboardEntry[]>("/api/v1/leaderboard");
        setLeaderboard(data);
      } catch (err) {
        console.error("Error fetching leaderboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2: return <Medal className="h-6 w-6 text-gray-400" />;
      case 3: return <Medal className="h-6 w-6 text-amber-700" />;
      default: return <span className="font-bold text-muted-foreground w-6 text-center">{rank}</span>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary inline-block">
          Global Leaderboard
        </h1>
        <p className="text-muted-foreground text-lg">Top contributors in the GirlScript Summer of Code.</p>
      </div>

      <Card className="shadow-lg border-primary/20">
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-4 p-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-muted/50 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No contributors found yet. Be the first to earn points!</p>
            </div>
          ) : (
            <div className="divide-y">
              {leaderboard.map((entry) => (
                <Link key={entry.userId} href={`/users/${entry.userId}`}>
                  <div className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors cursor-pointer group">
                    <div className="flex-none w-12 flex justify-center items-center">
                      {getRankIcon(entry.rank)}
                    </div>
                    
                    <Avatar src={entry.avatarUrl} fallback={entry.username} className="h-12 w-12 border-2 border-transparent group-hover:border-primary transition-colors" />
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-semibold truncate text-foreground group-hover:text-primary transition-colors">
                        {entry.name}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        @{entry.username}
                      </p>
                    </div>

                    <div className="hidden sm:flex items-center gap-2 flex-wrap">
                      {entry.badges.slice(0, 3).map(badge => (
                        <span key={badge.id} title={badge.name} className="text-xl">
                          {badge.icon}
                        </span>
                      ))}
                      {entry.badges.length > 3 && (
                        <span className="text-xs text-muted-foreground font-medium">+{entry.badges.length - 3}</span>
                      )}
                    </div>
                    
                    <div className="text-right flex-none w-24">
                      <p className="text-xl font-bold text-primary">{entry.totalPoints}</p>
                      <p className="text-xs text-muted-foreground uppercase font-semibold">Points</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
