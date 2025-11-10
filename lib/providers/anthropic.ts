// lib/providers/anthropic.ts
import axios from "axios";

export async function run(prompt: string, opts: any = {}) {
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

export async function stream(prompt: string, opts: any = {}, onToken: (token: string) => void) {
  // streaming would be implemented using the streaming features of the SDK or manual SSE
  // For brevity, provide a simple non-streaming fallback
  const txt = await run(prompt, opts);
  onToken(txt);
  return;
}
