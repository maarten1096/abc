// lib/providers/openai.ts
import OpenAI from "openai";
const client = new OpenAI({ apiKey: process.env.AI_API_KEY });

export async function runProvider(prompt: string, opts: any = {}) {
  const model = opts.model || "gpt-4o-mini";
  const response = await client.chat.completions.create({
    model,
    messages: [{ role: "user", content: prompt }],
    max_tokens: opts.maxTokens || 800,
    temperature: opts.temperature ?? 0.0
  });
  return response.choices?.[0]?.message?.content ?? "";
}

export async function streamProvider(prompt: string, opts: any = {}, onToken: (token: string) => void) {
  // streaming would be implemented using the streaming features of the SDK or manual SSE
  // For brevity, provide a simple non-streaming fallback
  const txt = await runProvider(prompt, opts);
  onToken(txt);
  return;
}
