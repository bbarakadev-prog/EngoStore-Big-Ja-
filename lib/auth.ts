import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "sqlite",
        schema,
    }),
    user: {
        additionalFields: {
            accessToken: {
                type: "string",
                required: false,
            },
            refreshToken: {
                type: "string",
                required: false,
            },
        },
    },
    databaseHooks: {
        account: {
            create: {
                after: async (account) => {
                    if (account.userId) {
                        await db.update(schema.user)
                            .set({
                                accessToken: account.accessToken || null,
                                refreshToken: account.refreshToken || null,
                            })
                            .where(eq(schema.user.id, account.userId));
                    }
                },
            },
            update: {
                after: async (account) => {
                    if (account.userId) {
                        await db.update(schema.user)
                            .set({
                                accessToken: account.accessToken || null,
                                refreshToken: account.refreshToken || null,
                            })
                            .where(eq(schema.user.id, account.userId));
                    }
                },
            },
        },
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            accessType: "offline",
            prompt: "consent",
            scope: [
                "openid",
                "https://www.googleapis.com/auth/userinfo.email",
                "https://www.googleapis.com/auth/userinfo.profile",
                "https://mail.google.com/",
            ],
        },
        microsoft: {
            clientId: process.env.MICROSOFT_CLIENT_ID || "",
            clientSecret: process.env.MICROSOFT_CLIENT_SECRET || "",
            tenantId: "common",
            scope: [
                "openid",
                "profile",
                "email",
                "offline_access",
                "https://outlook.office.com/IMAP.AccessAsUser.All",
            ],
        },
    },
});
