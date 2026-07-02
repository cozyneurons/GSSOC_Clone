"use client";

import { useEffect, useState } from "react";
import { fetchAPI } from "@/lib/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Users, Code, GitMerge, Megaphone, Calendar, ArrowRight } from "lucide-react";
import { Announcement } from "@/types";

export default function Home() {
  const [stats, setStats] = useState({ participants: 0, projects: 0, prs_merged: 0 });
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, announcementsData] = await Promise.all([
          fetchAPI<any>("/api/v1/stats"),
          fetchAPI<Announcement[]>("/api/v1/announcements")
        ]);
        setStats(statsData);
        setAnnouncements(announcementsData);
      } catch (err) {
        console.error("Error fetching home data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background pt-24 pb-32 text-center">
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            GirlScript Summer of Code
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-10">
            A three-month-long open-source program designed to help beginners start their open-source journey.
          </p>
          <div className="flex gap-4">
            <Link href="/projects">
              <Button size="lg" className="gap-2">
                Explore Projects <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Login / Register
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Live Stats */}
      <section className="container mx-auto px-4 -mt-24 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-lg border-primary/20 bg-background/95 backdrop-blur">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-4 bg-primary/10 rounded-full text-primary">
                <Users className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Participants</p>
                <h3 className="text-3xl font-bold">{loading ? "..." : stats.participants}</h3>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-secondary/20 bg-background/95 backdrop-blur">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-4 bg-secondary/10 rounded-full text-secondary">
                <Code className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Projects</p>
                <h3 className="text-3xl font-bold">{loading ? "..." : stats.projects}</h3>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-primary/20 bg-background/95 backdrop-blur">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-4 bg-primary/10 rounded-full text-primary">
                <GitMerge className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">PRs Merged</p>
                <h3 className="text-3xl font-bold">{loading ? "..." : stats.prs_merged}</h3>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12 mt-8">
        {/* Timeline */}
        <section className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold">Program Timeline</h2>
          </div>
          <div className="relative border-l-2 border-primary/30 ml-3 space-y-8 pb-4">
            <div className="relative pl-8">
              <span className="absolute left-[-9px] top-1 h-4 w-4 rounded-full bg-primary ring-4 ring-background" />
              <h3 className="font-semibold text-lg">Application Phase</h3>
              <p className="text-sm text-muted-foreground">May 1 - May 20</p>
              <p className="mt-2 text-sm">Mentors and participants register for the program.</p>
            </div>
            <div className="relative pl-8">
              <span className="absolute left-[-9px] top-1 h-4 w-4 rounded-full bg-secondary ring-4 ring-background" />
              <h3 className="font-semibold text-lg">Community Bonding</h3>
              <p className="text-sm text-muted-foreground">May 21 - May 31</p>
              <p className="mt-2 text-sm">Participants get to know mentors and explore projects.</p>
            </div>
            <div className="relative pl-8">
              <span className="absolute left-[-9px] top-1 h-4 w-4 rounded-full bg-primary/50 ring-4 ring-background" />
              <h3 className="font-semibold text-lg">Coding Period</h3>
              <p className="text-sm text-muted-foreground">June 1 - August 31</p>
              <p className="mt-2 text-sm">Participants contribute to projects and earn points.</p>
            </div>
            <div className="relative pl-8">
              <span className="absolute left-[-9px] top-1 h-4 w-4 rounded-full bg-muted-foreground/30 ring-4 ring-background" />
              <h3 className="font-semibold text-lg">Results Announced</h3>
              <p className="text-sm text-muted-foreground">September 15</p>
              <p className="mt-2 text-sm">Top performers are recognized and awarded.</p>
            </div>
          </div>
        </section>

        {/* Announcements */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-6">
            <Megaphone className="h-6 w-6 text-secondary" />
            <h2 className="text-3xl font-bold">Announcements</h2>
          </div>
          
          <div className="space-y-4">
            {loading ? (
              <p className="text-sm text-muted-foreground animate-pulse">Loading announcements...</p>
            ) : announcements.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-sm text-muted-foreground">
                  No announcements yet.
                </CardContent>
              </Card>
            ) : (
              announcements.map((announcement) => (
                <Card key={announcement.id} className="shadow-sm border-l-4 border-l-secondary">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-lg">{announcement.title}</CardTitle>
                    <CardDescription className="text-xs">
                      {new Date(announcement.created_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 text-sm">
                    {announcement.content}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
