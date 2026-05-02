import OpenAI from "openai";

let cachedClient: OpenAI | null = null;

export function getOpenAI(): OpenAI | null {
  if (cachedClient) return cachedClient;
  const baseURL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;
  const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
  if (!baseURL || !apiKey) return null;
  cachedClient = new OpenAI({ baseURL, apiKey });
  return cachedClient;
}
