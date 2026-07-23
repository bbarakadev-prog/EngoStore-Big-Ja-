import { task } from "@trigger.dev/sdk/v3";
import { convertToModelMessages, generateObject, UIMessage } from "ai";
import { googleModel } from "../../ai/index";
import { engineeringAiOutputSchema } from "../../ai/schema";
import { PROMPT } from "../../ai/prompt";
import { db } from "../../db/index";
import { aiMessages } from "../../db/schema";

/**
 * Task for AI interaction using Vercel AI SDK and Trigger.dev.
 * It uses generateObject with system and user messages.
 */
export const aiInteractionTask = task({
  id: "ai-interaction",
  run: async (payload: { userPrompt: UIMessage[] }) => {
    const { userPrompt } = payload;

    // Use generateObject for structured output in a background task
    const { object } = await generateObject({
      model: googleModel,
      system: PROMPT,
      schema: engineeringAiOutputSchema,
      messages: await convertToModelMessages(userPrompt),
    });

    // Store the assistant's response in the database
    // Note: Since we use generateObject, the response is structured. 
    // We might want to store the stringified version or a summary.
    // For now, let's store the stringified JSON or a simple message.
   /* await db.insert(aiMessages).values({
      id: crypto.randomUUID(),
      sessionId: sessionId,
      role: "assistant",
      content: JSON.stringify(object),
    });
*/
    return {
      success: true,
      data: object,
    };
  },
});
