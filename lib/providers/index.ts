
import { run as runOpenAI, stream as streamOpenAI } from './openai';
import { run as runAnthropic, stream as streamAnthropic } from './anthropic';
import { run as runLocal, stream as streamLocal } from './local';

const providers = {
  openai: { run: runOpenAI, stream: streamOpenAI },
  anthropic: { run: runAnthropic, stream: streamAnthropic },
  local: { run: runLocal, stream: streamLocal },
};

export async function runProvider(prompt: string, provider: string, opts: any) {
  if (!providers[provider]) {
    throw new Error(`Unknown provider: ${provider}`);
  }
  return providers[provider].run(prompt, opts);
}

export async function streamProvider(prompt: string, provider: string, opts: any) {
  if (!providers[provider]) {
    throw new Error(`Unknown provider: ${provider}`);
  }
  return providers[provider].stream(prompt, opts);
}
