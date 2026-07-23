import { google } from "@ai-sdk/google";
import { generateText, streamText, streamObject, generateObject } from "ai";

/**
 * Google Gemini model configuration.
 * Uses the API key from the GOOGLE_GENERATIVE_AI_API_KEY environment variable.
 */
export const googleModel = google("gemini-3.5-flash");

// Re-export common AI SDK functions for convenience
export { generateText, streamText, streamObject, generateObject };
