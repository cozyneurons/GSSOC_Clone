"use client";

import { useEffect, useState } from "react";
import { fetchAPI } from "@/lib/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Users, Code, GitMerge, Megaphone, Calendar, ArrowRight, Trophy, Gift, Sparkles, BookOpen, MessageSquare } from "lucide-react";
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
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/20 via-background to-background pt-32 pb-40 text-center">
        {/* Decorative background shapes */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-pulse dark:mix-blend-lighten"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary/20 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-pulse delay-1000 dark:mix-blend-lighten"></div>

        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            GSSoC 2026 is Here!
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-orange-400 to-secondary drop-shadow-sm">
            GirlScript Summer of Code
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-10 font-medium">
            A three-month-long open-source program designed to help beginners start their open-source journey and make a global impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/projects">
              <Button size="lg" className="gap-2 hover:scale-105 transition-transform shadow-lg shadow-primary/20">
                Explore Projects <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="hover:scale-105 transition-transform bg-background/50 backdrop-blur-sm border-primary/20 hover:bg-primary/5 hover:text-primary">
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

      {/* Why Participate Section */}
      <section className="container mx-auto px-4 mt-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Participate in GSSoC?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Whether you are a beginner looking for your first pull request or a mentor wanting to guide the next generation, there is something for everyone.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-primary/10 hover:border-primary/30 transition-colors bg-gradient-to-br from-background to-primary/5">
            <CardHeader>
              <div className="p-3 bg-primary/10 w-fit rounded-lg mb-4 text-primary">
                <BookOpen className="h-6 w-6" />
              </div>
              <CardTitle>Learn & Grow</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Gain hands-on experience by working on real-world projects with experienced mentors.
            </CardContent>
          </Card>

          <Card className="border-secondary/10 hover:border-secondary/30 transition-colors bg-gradient-to-br from-background to-secondary/5">
            <CardHeader>
              <div className="p-3 bg-secondary/10 w-fit rounded-lg mb-4 text-secondary">
                <Gift className="h-6 w-6" />
              </div>
              <CardTitle>Swags & Prizes</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Top contributors and mentors receive exclusive GSSoC swags, certificates, and prizes.
            </CardContent>
          </Card>

          <Card className="border-primary/10 hover:border-primary/30 transition-colors bg-gradient-to-br from-background to-primary/5">
            <CardHeader>
              <div className="p-3 bg-primary/10 w-fit rounded-lg mb-4 text-primary">
                <Users className="h-6 w-6" />
              </div>
              <CardTitle>Networking</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Connect with like-minded developers, industry experts, and build a strong professional network.
            </CardContent>
          </Card>

          <Card className="border-secondary/10 hover:border-secondary/30 transition-colors bg-gradient-to-br from-background to-secondary/5">
            <CardHeader>
              <div className="p-3 bg-secondary/10 w-fit rounded-lg mb-4 text-secondary">
                <Trophy className="h-6 w-6" />
              </div>
              <CardTitle>Stand Out</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Build a strong GitHub profile and resume that will help you stand out to recruiters.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-muted/30 py-20 mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How it Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your journey from a beginner to an open-source contributor in 4 simple steps.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-[2px] bg-border z-0"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-full bg-background border-4 border-primary/20 flex items-center justify-center mb-6 group-hover:border-primary transition-colors shadow-sm">
                <span className="text-3xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Register</h3>
              <p className="text-sm text-muted-foreground">Sign up as a participant or a mentor for the program.</p>
            </div>
            
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-full bg-background border-4 border-secondary/20 flex items-center justify-center mb-6 group-hover:border-secondary transition-colors shadow-sm">
                <span className="text-3xl font-bold text-secondary">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Explore</h3>
              <p className="text-sm text-muted-foreground">Browse through hundreds of participating open-source projects.</p>
            </div>
            
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-full bg-background border-4 border-primary/20 flex items-center justify-center mb-6 group-hover:border-primary transition-colors shadow-sm">
                <span className="text-3xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Contribute</h3>
              <p className="text-sm text-muted-foreground">Claim issues, write code, and submit pull requests.</p>
            </div>
            
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-full bg-background border-4 border-secondary/20 flex items-center justify-center mb-6 group-hover:border-secondary transition-colors shadow-sm">
                <span className="text-3xl font-bold text-secondary">4</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Win</h3>
              <p className="text-sm text-muted-foreground">Earn points, climb the leaderboard, and win exciting swags.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 mt-20">
        <div className="flex flex-col md:flex-row gap-12 items-start">
          <div className="md:w-1/3">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground mb-6">
              Have a question that is not answered here? Reach out to us on our community channels.
            </p>
            <Button variant="outline" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              Join Discord
            </Button>
          </div>
          
          <div className="md:w-2/3 space-y-4">
            <details className="group bg-card border rounded-lg p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer shadow-sm">
              <summary className="flex items-center justify-between font-semibold text-lg">
                Who can participate in GSSoC?
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <p className="text-muted-foreground mt-4 leading-relaxed">
                Anyone! Whether you are a beginner or a seasoned professional, as long as you have the enthusiasm to learn and contribute to open-source, you are welcome to join. There are no age or demographic restrictions.
              </p>
            </details>
            
            <details className="group bg-card border rounded-lg p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer shadow-sm">
              <summary className="flex items-center justify-between font-semibold text-lg">
                Is there any registration fee?
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <p className="text-muted-foreground mt-4 leading-relaxed">
                No, participation in GirlScript Summer of Code is absolutely free of cost. We believe in providing equal opportunities for everyone to learn and grow without any financial barriers.
              </p>
            </details>
            
            <details className="group bg-card border rounded-lg p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer shadow-sm">
              <summary className="flex items-center justify-between font-semibold text-lg">
                I am a beginner, can I participate?
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <p className="text-muted-foreground mt-4 leading-relaxed">
                Absolutely! GSSoC is specifically designed to help beginners start their open-source journey. Our mentors are extremely helpful and will guide you through your first pull request and beyond.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 mt-20 mb-8">
        <div className="bg-gradient-to-r from-primary via-orange-400 to-secondary rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-20">
            <Sparkles className="w-32 h-32" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to start your open-source journey?</h2>
            <p className="text-white/90 text-lg md:text-xl mb-10">
              Join thousands of developers worldwide and make your mark in the open-source community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto text-primary font-bold hover:scale-105 transition-transform">
                  Register as Participant
                </Button>
              </Link>
              <Link href="/register/mentor">
                <Button size="lg" className="w-full sm:w-auto bg-black/20 hover:bg-black/30 text-white border-none hover:scale-105 transition-transform">
                  Apply as Mentor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
