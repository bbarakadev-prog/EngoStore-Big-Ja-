"use server";

import { googleModel, generateText, streamText } from "@/ai";

export async function generateComponentDescription(componentName: string) {
  const { text } = await generateText({
    model: googleModel,
    prompt: `Generate a brief, professional description for an engineering component named: ${componentName}`,
  });

  return text;
}

export async function streamComponentDescription(componentName: string) {
  const { textStream } = streamText({
    model: googleModel,
    prompt: `Generate a detailed, technical description for an engineering component named: ${componentName}`,
  });

  return { output: textStream };
}

export async function processEmailWithAI(email: { subject: string; text?: string; html?: string; from: string }) {
  const content = email.text || email.html || "";
  const { text } = await generateText({
    model: googleModel,
    prompt: `Analyze the following email and provide a summary and any actionable items.
    
Subject: ${email.subject}
From: ${email.from}
Content: ${content.substring(0, 4000)}`,
  });

  return text;
}
