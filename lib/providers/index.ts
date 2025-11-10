
import { run as runOpenAI, stream as streamOpenAI } from './openai';
import { run as runAnthropic, stream as streamAnthropic } from './anthropic';
import { run as runLocal, stream as streamLocal } from './local';

const providers = {
  openai: { run: runOpenAI, stream: streamOpenAI },
  anthropic: { run: runAnthropic, stream: streamAnthropic },
  local: { run: runLocal, stream: streamLocal },
};

export async function runProvider(prompt: string, provider: string, opts: any) {
  if (!providers[provider as keyof typeof providers]) {
    throw new Error(`Unknown provider: ${provider}`);
  }
  return providers[provider as keyof typeof providers].run(prompt, opts);
}

export async function streamProvider(prompt: string, provider: string, opts: any, onToken: (token: string) => void) {
  if (!providers[provider as keyof typeof providers]) {
    throw new Error(`Unknown provider: ${provider}`);
  }
  return providers[provider as keyof typeof providers].stream(prompt, opts, onToken);
}
