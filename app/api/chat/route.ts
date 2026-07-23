import { tasks } from "@trigger.dev/sdk/v3";
import { NextResponse } from "next/server";
import { aiInteractionTask } from "@/src/trigger/ai-interaction";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { aiChatSessions, aiMessages } from "@/db/schema";

export async function POST(req: Request) {
  try {
   /* const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
*/
    const { messages, sessionId, projectId } = await req.json();

    /*let currentSessionId = sessionId;

    // If no sessionId is provided, create a new one
    if (!currentSessionId) {
      currentSessionId = crypto.randomUUID();
      await db.insert(aiChatSessions).values({
        id: currentSessionId,
        userId: session.user.id,
        projectId: projectId || null,
        title: messages[messages.length - 1].content.substring(0, 50) || "New Chat",
      });
    }

    // Store the user's message
    const lastMessage = messages[messages.length - 1];
    await db.insert(aiMessages).values({
      id: crypto.randomUUID(),
      sessionId: currentSessionId,
      role: lastMessage.role,
      content: lastMessage.content,
    });
*/
    // Trigger the background task
    const handle = await tasks.trigger<typeof aiInteractionTask>(
      "ai-interaction",
      { 
        userPrompt: messages,
      }
    );

    return NextResponse.json({ ...handle });
  } catch (error) {
    console.error("Error triggering AI task:", error);
    return NextResponse.json(
      { error: "Failed to trigger AI task" },
      { status: 500 }
    );
  }
}
