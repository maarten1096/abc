// lib/progressLog.ts
import fs from "fs/promises";
import path from "path";
// import { supabaseAdmin } from "./supabase";

const LOG_PATH = process.env.PROGRESS_FILE_PATH || null;

type ProgressEntry = {
  ts?: string;
  userId: string;
  conversationId?: string;
  prompt: string;
  assistant: string;
  meta?: any;
};

const queue: ProgressEntry[] = [];
let flushing = false;

export async function appendProgress(entry: ProgressEntry) {
  entry.ts = new Date().toISOString();
  queue.push(entry);
  if (!flushing) await flushQueue();
}

async function flushQueue() {
  flushing = true;
  while (queue.length) {
    const entry = queue.shift();
    const line = JSON.stringify(entry) + "\n";
    // write to local file if available (self-hosted)
    if (LOG_PATH) {
      try {
        await fs.appendFile(LOG_PATH, line, "utf8");
      } catch (e) {
        console.warn("Failed to append local progress log:", e);
      }
    }
    // write to Supabase dev logs
    /*
    try {
      await supabaseAdmin.from("developer_progress_logs").insert({
        user_id: entry.userId,
        conversation_id: entry.conversationId,
        prompt: entry.prompt,
        assistant: entry.assistant,
        meta: entry.meta ?? {}
      });
    } catch (e) {
      console.error("Failed to insert developer_progress_logs:", e);
    }
    */
  }
  flushing = false;
}