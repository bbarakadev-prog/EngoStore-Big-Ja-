import Headers from "@/components/headers";
import { CreateProjectDialog } from "@/components/projects/create-project-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getProjects } from "@/app/actions/projects";
import { Badge } from "@/components/ui/badge";
import { getRandomColor, cn } from "@/lib/utils";

export default async function ProjectsPage() {
  const result = await getProjects();
  const projectsList = result.success ? result.data : [];

  return (
    <div className="p-6">
      <Headers 
        title="Projects" 
        description="Manage your engineering projects and components."
        trigger={
          <CreateProjectDialog 
            trigger={
              <Button className="gap-2">
                <Plus className="size-4" />
                Create Project
              </Button>
            }
          />
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {projectsList && projectsList.length > 0 ? (
          projectsList.map((project) => (
            <div key={project.id} className="border rounded-lg p-6 flex flex-col gap-2 hover:border-primary/50 transition-colors">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold text-lg">{project.name}</h3>
                <Badge 
                  variant="outline" 
                  className={cn("text-[10px] px-1.5 py-0 h-4 font-mono border-none", getRandomColor())}
                >
                  {project.slug}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {project.description || "No description provided."}
              </p>
              <div className="text-xs text-muted-foreground mt-2">
                Created: {new Date(project.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 border rounded-lg border-dashed">
            <p className="text-muted-foreground">No projects found. Create your first project to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
