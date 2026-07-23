"use server";

import { db } from "@/db";
import { projects } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";

export async function getProjects() {
  try {
    const allProjects = await db.select().from(projects).orderBy(desc(projects.createdAt));
    return { success: true, data: allProjects };
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return { success: false, error: "Failed to fetch projects" };
  }
}

export async function createProject(formData: { name: string; slug: string; description?: string }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const { name, slug, description } = formData;

    if (!name) {
      return { success: false, error: "Name is required" };
    }

    if (!slug) {
      return { success: false, error: "Slug is required" };
    }

    const newProject = await db.insert(projects).values({
      id: uuidv4(),
      name,
      slug,
      description,
      userId: session.user.id,
    }).returning();

    revalidatePath("/projects");
    
    return { success: true, data: newProject[0] };
  } catch (error) {
    console.error("Failed to create project:", error);
    return { success: false, error: "Failed to create project" };
  }
}
