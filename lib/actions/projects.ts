"use server";

import { db } from "@/db";
import { 
    projects, 
    rfqItems, 
    batteryLimits, 
    assumptionsRegister, 
    riskRegister, 
    rfis 
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type ProjectInsert = typeof projects.$inferInsert;
export type RfqItemInsert = typeof rfqItems.$inferInsert;
export type BatteryLimitInsert = typeof batteryLimits.$inferInsert;
export type AssumptionInsert = typeof assumptionsRegister.$inferInsert;
export type RiskRegisterItemInsert = typeof riskRegister.$inferInsert;
export type RfiItemInsert = typeof rfis.$inferInsert;

export interface FullProjectData {
    project: Omit<ProjectInsert, "id" | "createdAt" | "updatedAt">;
    rfqItems?: Omit<RfqItemInsert, "id" | "projectId" | "createdAt" | "updatedAt">[];
    batteryLimits?: Omit<BatteryLimitInsert, "id" | "projectId">[];
    assumptions?: Omit<AssumptionInsert, "id" | "projectId">[];
    risks?: Omit<RiskRegisterItemInsert, "id" | "projectId">[];
    rfis?: Omit<RfiItemInsert, "id" | "projectId">[];
}

export async function createProject(data: FullProjectData) {
    try {
        const projectId = crypto.randomUUID();

        await db.transaction(async (tx) => {
            // 1. Create the project
            await tx.insert(projects).values({
                ...data.project,
                id: projectId,
            });

            // 2. Create related documents if they exist
            if (data.rfqItems && data.rfqItems.length > 0) {
                await tx.insert(rfqItems).values(
                    data.rfqItems.map(item => ({
                        ...item,
                        id: crypto.randomUUID(),
                        projectId,
                    }))
                );
            }

            if (data.batteryLimits && data.batteryLimits.length > 0) {
                await tx.insert(batteryLimits).values(
                    data.batteryLimits.map(item => ({
                        ...item,
                        id: crypto.randomUUID(),
                        projectId,
                    }))
                );
            }

            if (data.assumptions && data.assumptions.length > 0) {
                await tx.insert(assumptionsRegister).values(
                    data.assumptions.map(item => ({
                        ...item,
                        id: crypto.randomUUID(),
                        projectId,
                    }))
                );
            }

            if (data.risks && data.risks.length > 0) {
                await tx.insert(riskRegister).values(
                    data.risks.map(item => ({
                        ...item,
                        id: crypto.randomUUID(),
                        projectId,
                    }))
                );
            }

            if (data.rfis && data.rfis.length > 0) {
                await tx.insert(rfis).values(
                    data.rfis.map(item => ({
                        ...item,
                        id: crypto.randomUUID(),
                        projectId,
                    }))
                );
            }
        });

        revalidatePath("/ai");
        revalidatePath("/projects");
        
        return { success: true, projectId };
    } catch (error) {
        console.error("Failed to create project:", error);
        return { success: false, error: "Failed to create project" };
    }
}

export async function updateProject(projectId: string, data: Partial<FullProjectData>) {
    try {
        await db.transaction(async (tx) => {
            // 1. Update project details if provided
            if (data.project) {
                await tx.update(projects)
                    .set({
                        ...data.project,
                        updatedAt: new Date(),
                    })
                    .where(eq(projects.id, projectId));
            }

            // 2. Update related documents
            // For simplicity in this implementation, we'll replace existing related records with new ones if provided
            // Alternatively, we could do more complex diffing (upsert/delete)
            
            if (data.rfqItems) {
                await tx.delete(rfqItems).where(eq(rfqItems.projectId, projectId));
                if (data.rfqItems.length > 0) {
                    await tx.insert(rfqItems).values(
                        data.rfqItems.map(item => ({
                            ...item,
                            id: crypto.randomUUID(),
                            projectId,
                        }))
                    );
                }
            }

            if (data.batteryLimits) {
                await tx.delete(batteryLimits).where(eq(batteryLimits.projectId, projectId));
                if (data.batteryLimits.length > 0) {
                    await tx.insert(batteryLimits).values(
                        data.batteryLimits.map(item => ({
                            ...item,
                            id: crypto.randomUUID(),
                            projectId,
                        }))
                    );
                }
            }

            if (data.assumptions) {
                await tx.delete(assumptionsRegister).where(eq(assumptionsRegister.projectId, projectId));
                if (data.assumptions.length > 0) {
                    await tx.insert(assumptionsRegister).values(
                        data.assumptions.map(item => ({
                            ...item,
                            id: crypto.randomUUID(),
                            projectId,
                        }))
                    );
                }
            }

            if (data.risks) {
                await tx.delete(riskRegister).where(eq(riskRegister.projectId, projectId));
                if (data.risks.length > 0) {
                    await tx.insert(riskRegister).values(
                        data.risks.map(item => ({
                            ...item,
                            id: crypto.randomUUID(),
                            projectId,
                        }))
                    );
                }
            }

            if (data.rfis) {
                await tx.delete(rfis).where(eq(rfis.projectId, projectId));
                if (data.rfis.length > 0) {
                    await tx.insert(rfis).values(
                        data.rfis.map(item => ({
                            ...item,
                            id: crypto.randomUUID(),
                            projectId,
                        }))
                    );
                }
            }
        });

        revalidatePath("/ai");
        revalidatePath("/projects");
        revalidatePath(`/projects/${projectId}`);
        
        return { success: true };
    } catch (error) {
        console.error("Failed to update project:", error);
        return { success: false, error: "Failed to update project" };
    }
}

export async function deleteProject(projectId: string) {
    try {
        // Since we have ON DELETE CASCADE in the schema, deleting the project will delete all related records
        await db.delete(projects).where(eq(projects.id, projectId));

        revalidatePath("/ai");
        revalidatePath("/projects");
        
        return { success: true };
    } catch (error) {
        console.error("Failed to delete project:", error);
        return { success: false, error: "Failed to delete project" };
    }
}
