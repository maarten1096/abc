// lib/providers/anthropic.ts
import axios from "axios";

export async function runProvider(prompt: string, opts: any = {}) {
  const key = process.env.AI_API_KEY;
  const model = opts.model || "claude-sonnet-4";
  const resp = await axios.post(`https://api.anthropic.com/v1/complete`, {
    model,
    prompt,
    max_tokens: opts.maxTokens || 800,
    temperature: opts.temperature ?? 0.0,
  }, { headers: { Authorization: `Bearer ${key}` }});
  return resp.data?.completion ?? "";
}
