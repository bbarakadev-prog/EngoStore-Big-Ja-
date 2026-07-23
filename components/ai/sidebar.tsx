"use client";

import * as React from "react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Folder, Inbox, Plus } from "lucide-react";
import { cn, getRandomColor } from "@/lib/utils";
import { CreateProjectDialog } from "@/components/projects/create-project-dialog";

interface Project {
  id: string;
  name: string;
  slug: string;
}

export function ProjectSidebar() {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/projects");
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const isEmpty = !loading && projects.length === 0;

  return (
    <Sidebar 
      side="left" 
      className="border-r w-80 mt-14" 
      collapsible="offcanvas"
      style={{ "--sidebar-width": "20rem" } as React.CSSProperties}
    >
      <SidebarHeader className="border-b p-2">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 font-semibold">
            <Folder className="h-4 w-4" />
            <span className="text-sm">AI Generated Projects</span>
          </div>
          <CreateProjectDialog 
            trigger={
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Plus className="h-4 w-4" />
              </Button>
            }
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-full">
          <div className="flex flex-col h-[calc(100vh-112px)]">
            {loading ? (
              <div className="flex items-center justify-center h-20">
                <span className="text-xs text-muted-foreground">Loading projects...</span>
              </div>
            ) : isEmpty ? (
              <div className="flex flex-col items-center justify-center flex-1 gap-2 p-4 text-center">
                <Inbox className="h-8 w-8 text-muted-foreground opacity-20" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">No projects</p>
                  <p className="text-xs text-muted-foreground">AI generated projects will appear here.</p>
                </div>
              </div>
            ) : (
            <SidebarGroup>
              <SidebarGroupLabel>Recent Projects</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {projects.map((project) => (
                    <SidebarMenuItem key={project.id} className="px-2 py-1">
                      <Item className="cursor-pointer hover:bg-sidebar-accent transition-colors  p-2"  size="default">
                        <ItemHeader className="mb-0">
                          <ItemTitle className="text-xs font-medium leading-none">
                            {project.name}
                          </ItemTitle>
                          <Badge variant="secondary" className="text-[9px] px-1 py-0 h-3.5 shrink-0">
                            AI
                          </Badge>
                        </ItemHeader>
                        <ItemContent className="gap-0">
                          <ItemDescription>
                            <Badge 
                              variant="outline" 
                              className={cn("text-[8px] px-1 py-0 h-3.5 font-mono border-none", getRandomColor())}
                            >
                              {project.slug}
                            </Badge>
                          </ItemDescription>
                        </ItemContent>
                      </Item>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </div>
      </ScrollArea>
      </SidebarContent>
    </Sidebar>
  );
}
