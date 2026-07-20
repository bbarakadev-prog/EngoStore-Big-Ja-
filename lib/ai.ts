import { google } from "@ai-sdk/google";
import { generateText, streamText } from "ai";

export const googleModel = google("gemini-1.5-flash");
