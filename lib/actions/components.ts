"use server";

import { db } from "@/db";
import { components } from "@/db/schema";

export type ComponentInsert = typeof components.$inferInsert;

export async function bulkInsertComponents(data: Omit<ComponentInsert, "id" | "createdAt" | "updatedAt">[]) {
    try {
        const insertData = data.map((item) => ({
            ...item,
            id: crypto.randomUUID(),
        }));

        // Drizzle better-sqlite3 handles bulk inserts well
        await db.insert(components).values(insertData);
        return { success: true, count: insertData.length };
    } catch (error) {
        console.error("Failed to bulk insert components:", error);
        return { success: false, error: "Failed to save components to database" };
    }
}

export async function getComponents() {
    try {
        const data = await db.select().from(components);
        return { success: true, data };
    } catch (error) {
        console.error("Failed to fetch components:", error);
        return { success: false, error: "Failed to fetch components" };
    }
}
