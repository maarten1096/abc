// lib/providers/local.ts
import axios from "axios";

export async function run(prompt: string, opts: any = {}) {
  const url = process.env.LOCAL_LM_URL || "http://localhost:1234/v1/generate";
  const model = opts.model || "codellama-7b";
  const resp = await axios.post(url, { model, input: prompt, max_tokens: opts.maxTokens || 800 });
  if (resp.data.output_text) {
    return resp.data.output_text;
  }
  if (resp.data.choices && resp.data.choices[0]) {
    return resp.data.choices[0].text;
  }
  return JSON.stringify(resp.data);
}

export async function stream(prompt: string, opts: any = {}, onToken: (token: string) => void) {
  // streaming would be implemented using the streaming features of the SDK or manual SSE
  // For brevity, provide a simple non-streaming fallback
  const txt = await run(prompt, opts);
  onToken(txt);
  return;
}
