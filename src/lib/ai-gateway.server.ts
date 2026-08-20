import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export function createLovableAiGatewayProvider(lovableApiKey: string) {
  return createOpenAICompatible({
    name: "lovable",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    headers: {
      "Lovable-API-Key": lovableApiKey,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
  });
}

export function getGatewayModel() {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured. Missing LOVABLE_API_KEY.");
  return createLovableAiGatewayProvider(key)("google/gemini-3.7-flash");
}

export function toFriendlyAiError(error: unknown): Error {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes("429")) {
    return new Error("The AI service is busy right now. Please wait a moment and try again.");
  }
  if (message.includes("402")) {
    return new Error("AI credits have run out. Please add credits to continue using AI features.");
  }
  if (message.includes("403")) {
    return new Error("AI access is currently blocked for this workspace.");
  }
  return new Error(message || "Something went wrong while generating. Please try again.");
}
