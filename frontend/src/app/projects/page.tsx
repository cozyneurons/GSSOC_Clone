"use client";

import { useState, useEffect } from "react";
import { fetchAPI } from "@/lib/api";
import { Project } from "@/types";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Github, Code2, Tag } from "lucide-react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await fetchAPI<Project[]>("/api/v1/projects");
        setProjects(data);
        setFilteredProjects(data);
      } catch (err) {
        console.error("Error fetching projects", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    let filtered = projects;
    if (search) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (difficultyFilter !== "all") {
      filtered = filtered.filter((p) => p.difficulty_level === difficultyFilter);
    }
    setFilteredProjects(filtered);
  }, [search, difficultyFilter, projects]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Projects</h1>
          <p className="text-muted-foreground">Find an open-source project to contribute to.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="sticky top-24 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="h-4 w-4" /> Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search projects..."
                    className="pl-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Difficulty</label>
                <div className="flex flex-col gap-2">
                  {["all", "beginner", "intermediate", "advanced"].map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setDifficultyFilter(diff)}
                      className={`text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        difficultyFilter === diff
                          ? "bg-primary text-primary-foreground font-medium"
                          : "hover:bg-muted text-muted-foreground"
                      }`}
                    >
                      {diff.charAt(0).toUpperCase() + diff.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="animate-pulse h-64 bg-muted/20" />
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-24 border rounded-xl border-dashed">
              <Code2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No projects found</h3>
              <p className="text-muted-foreground">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="flex flex-col hover:shadow-md transition-shadow group">
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {project.name}
                      </CardTitle>
                      <Badge variant={project.difficulty_level === 'beginner' ? 'default' : 'secondary'}>
                        {project.difficulty_level}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2 min-h-[2.5rem]">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Github className="h-4 w-4" />
                      <a href={project.repo_url} target="_blank" rel="noreferrer" className="hover:underline truncate">
                        {project.repo_url.replace("https://github.com/", "")}
                      </a>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {project.tech_stack.slice(0, 3).map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {project.tech_stack.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.tech_stack.length - 3}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4 border-t border-muted/50">
                    <Link href={`/projects/${project.id}`} className="w-full">
                      <Button className="w-full" variant="outline">View Project</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
