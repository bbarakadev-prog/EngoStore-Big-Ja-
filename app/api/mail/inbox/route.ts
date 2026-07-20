import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import { fetchInboxMails } from "@/lib/mail";

export async function GET() {
  try {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({
      headers: reqHeaders,
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the linked OAuth account to know which provider (Google/Microsoft) is active
    const userAccounts = await db
      .select()
      .from(schema.account)
      .where(eq(schema.account.userId, session.user.id))
      .limit(1);

    const userAccount = userAccounts[0];

    if (!userAccount) {
      return NextResponse.json(
        { error: "No social login account linked to this user." },
        { status: 400 }
      );
    }

    const providerId = userAccount.providerId;

    // Get a fresh access token using Better Auth's token management (handles refreshing automatically)
    let accessToken: string | null = null;
    try {
      const tokenResult = await auth.api.getAccessToken({
        headers: reqHeaders,
        body: {
          providerId,
        },
      });
      accessToken = tokenResult?.accessToken || null;
    } catch (tokenError) {
      console.error("Failed to fetch fresh access token via Better Auth api:", tokenError);
    }

    // Fallback to database access tokens if Better Auth api call returned null/undefined
    if (!accessToken) {
      const sessionUserWithToken = session.user as typeof session.user & {
        accessToken?: string | null;
      };
      accessToken = userAccount.accessToken || sessionUserWithToken.accessToken || null;
    }

    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token is missing or expired. Please sign in again." },
        { status: 401 }
      );
    }

    // Fetch the last 10 emails from the provider's inbox
    const emails = await fetchInboxMails(
      providerId,
      session.user.email,
      accessToken
    );

    return NextResponse.json({ emails });
  } catch (error: unknown) {
    console.error("Error fetching inbox emails:", error);

    const errorMessage = error instanceof Error ? error.message : String(error);

    // Provide helpful error responses for authentication or connection failure cases
    if (
      errorMessage.toLowerCase().includes("authentication") ||
      errorMessage.toLowerCase().includes("login") ||
      errorMessage.toLowerCase().includes("invalid credentials")
    ) {
      return NextResponse.json(
        {
          error:
            "Authentication failed with the email provider. The access token might be invalid or revoked. Please try signing out and signing in again.",
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: `Failed to fetch emails: ${errorMessage || "Unknown error occurred"}` },
      { status: 500 }
    );
  }
}
