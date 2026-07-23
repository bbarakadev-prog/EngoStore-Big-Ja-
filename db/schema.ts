import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const user = sqliteTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: integer("email_verified", { mode: "boolean" }).notNull(),
    image: text("image"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
    // Custom fields to store access token and refresh token
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
});

export const session = sqliteTable("session", {
    id: text("id").primaryKey(),
    expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
    token: text("token").notNull().unique(),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp" }),
    refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: "timestamp" }),
    scope: text("scope"),
    password: text("password"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const components = sqliteTable("components", {
    id: text("id").primaryKey(),
    partNumber: text("part_number").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    category: text("category"),
    manufacturer: text("manufacturer"),
    type: text("type"),
    distributor: text("distributor"),
    availability: text("availability"),
    unitPrice: text("unit_price"),
    createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export type Component = typeof components.$inferSelect;

export const verification = sqliteTable("verification", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }),
    updatedAt: integer("updated_at", { mode: "timestamp" }),
});

export const projects = sqliteTable("projects", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const rfqItems = sqliteTable("rfq_items", {
    id: text("id").primaryKey(),
    projectId: text("project_id")
        .notNull()
        .references(() => projects.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    quantity: integer("quantity").notNull().default(1),
    unit: text("unit"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
}, (table) => ({
    projectIdIdx: index("rfq_items_project_id_idx").on(table.projectId),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
    user: one(user, {
        fields: [projects.userId],
        references: [user.id],
    }),
    rfqItems: many(rfqItems),
    aiChatSessions: many(aiChatSessions),
}));

export const rfqItemsRelations = relations(rfqItems, ({ one }) => ({
    project: one(projects, {
        fields: [rfqItems.projectId],
        references: [projects.id],
    }),
}));
export const batteryLimits = sqliteTable("battery_limits", {
    id: text("id").primaryKey(),
    projectId: text("project_id")
        .notNull()
        .references(() => projects.id, { onDelete: "cascade" }),
    code: text("code").notNull(),
    subsystem: text("subsystem").notNull(),
    description: text("description").notNull(),
    type: text("type").notNull(),
    locationPoint: text("location_point"),
    responsibleParty: text("responsible_party").notNull(),
    interfaceType: text("interface_type").notNull(),
    notes: text("notes"),
});

export const assumptionsRegister = sqliteTable("assumptions_register", {
    id: text("id").primaryKey(),
    projectId: text("project_id")
        .notNull()
        .references(() => projects.id, { onDelete: "cascade" }),
    refCode: text("ref_code"),
    parameter: text("parameter").notNull(),
    assumedValue: text("assumed_value").notNull(),
    category: text("category").notNull(),
    rationale: text("rationale").notNull(),
    impactIfFalse: text("impact_if_false").notNull(),
    status: text("status").notNull(),
});

export const riskRegister = sqliteTable("risk_register", {
    id: text("id").primaryKey(),
    projectId: text("project_id")
        .notNull()
        .references(() => projects.id, { onDelete: "cascade" }),
    flagCode: text("flag_code").notNull(),
    detectedBy: text("detected_by").notNull(),
    itemType: text("item_type").notNull(),
    affectedComponentTag: text("affected_component_tag"),
    description: text("description").notNull(),
    severity: text("severity").notNull(),
    mitigationStrategy: text("mitigation_strategy").notNull(),
    status: text("status").notNull(),
});

export const rfis = sqliteTable("rfis", {
    id: text("id").primaryKey(),
    projectId: text("project_id")
        .notNull()
        .references(() => projects.id, { onDelete: "cascade" }),
    rfiNumber: integer("rfi_number").notNull(),
    topic: text("topic").notNull(),
    question: text("question").notNull(),
    importance: text("importance").notNull(),
});

// Types Drizzle inférés
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type RfqItem = typeof rfqItems.$inferSelect;
export type NewRfqItem = typeof rfqItems.$inferInsert;
export type BatteryLimit = typeof batteryLimits.$inferSelect;
export type Assumption = typeof assumptionsRegister.$inferSelect;
export type RiskRegisterItem = typeof riskRegister.$inferSelect;
export type RfiItem = typeof rfis.$inferSelect;

export const emails = sqliteTable("emails", {
    id: text("id").primaryKey(),
    sender: text("sender").notNull(),
    subject: text("subject").notNull(),
    message: text("message").notNull(),
    time: text("time").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export type Email = typeof emails.$inferSelect;

export const aiChatSessions = sqliteTable("ai_chat_sessions", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    projectId: text("project_id")
        .references(() => projects.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const aiMessages = sqliteTable("ai_messages", {
    id: text("id").primaryKey(),
    sessionId: text("session_id")
        .notNull()
        .references(() => aiChatSessions.id, { onDelete: "cascade" }),
    role: text("role", { enum: ["user", "assistant", "system"] }).notNull(),
    content: text("content").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const aiChatSessionsRelations = relations(aiChatSessions, ({ one, many }) => ({
    user: one(user, {
        fields: [aiChatSessions.userId],
        references: [user.id],
    }),
    project: one(projects, {
        fields: [aiChatSessions.projectId],
        references: [projects.id],
    }),
    messages: many(aiMessages),
}));

export const aiMessagesRelations = relations(aiMessages, ({ one }) => ({
    session: one(aiChatSessions, {
        fields: [aiMessages.sessionId],
        references: [aiChatSessions.id],
    }),
}));

export type AiChatSession = typeof aiChatSessions.$inferSelect;
export type NewAiChatSession = typeof aiChatSessions.$inferInsert;
export type AiMessage = typeof aiMessages.$inferSelect;
export type NewAiMessage = typeof aiMessages.$inferInsert;