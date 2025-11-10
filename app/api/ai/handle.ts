// app/api/ai/handle.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { runProvider, streamProvider } from "@/lib/providers/index";
import { appendProgress } from "@/lib/progressLog";
import { v4 as uuidv4 } from "uuid";

const service = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function mapAuthToUser(req: NextRequest) {
  // Accept Supabase access token via Authorization: Bearer <token>
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    // fallback: guest token in header or cookie
    const guestId = req.headers.get("x-guest-id");
    if (!guestId) throw new Error("No auth");
    // upsert guest user
    const { data } = await service
      .from("users")
      .upsert({ auth_uid: `guest:${guestId}`, guest: true }, { onConflict: "auth_uid" })
      .select()
      .single();
    return data;
  }
  const token = authHeader.replace("Bearer ", "");
  // Verify token with Supabase - use /auth API? We'''ll use service role to look up session
  // Simpler: call the userinfo endpoint - but here, for clarity, we assume token is JWT containing sub
  // In production, use supabase-js auth.getUser(token)
  const { data: userData, error } = await service.auth.getUser(token);
  if (error) throw error;
  // upsert into users table
  const authUid = userData.user?.id;
  const { data } = await service
    .from("users")
    .upsert({ auth_uid: authUid, email: userData.user?.email, name: userData.user?.user_metadata?.full_name }, { onConflict: "auth_uid" })
    .select()
    .single();
  return data;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, mode = "chat", conversationId, options } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Invalid prompt" }, { status: 400 });
    }

    const user = await mapAuthToUser(req);

    // create conversation if needed
    let convId = conversationId;
    if (!convId) {
      const title = prompt.slice(0, 120);
      const { data: conv } = await service.from("conversations").insert({
        user_id: user.id,
        title,
        mode,
      }).select().single();
      convId = conv.id;
    }

    // insert user message
    const { data: userMsg } = await service.from("messages").insert({
      conversation_id: convId,
      user_id: user.id,
      role: "user",
      content: prompt
    }).select().single();

    // Provider call (supports streaming)
    const provider = options?.modelProvider || process.env.AI_PROVIDER || "openai";

    // If provider supports streaming we should stream; else just runProvider.
    if (provider === "local" || provider === "openai_stream" || provider === "anthropic_stream") {
      // stream path
      await streamProvider(prompt, provider, options, (token: string) => {});

      // For simplicity in this example: get final text
      const assistantText = await runProvider(prompt, provider, options);

      // insert assistant message
      const { data: assistantMsg } = await service.from("messages").insert({
        conversation_id: convId,
        user_id: user.id,
        role: "assistant",
        content: assistantText
      }).select().single();

      // append logs
      await appendProgress({ userId: user.id, conversationId: convId, prompt, assistant: assistantText });
      await service.from("developer_progress_logs").insert({ user_id: user.id, conversation_id: convId, prompt, assistant: assistantText });

      return NextResponse.json({ assistant: assistantText, conversationId: convId });
    } else {
      // non-streaming provider
      const assistantText = await runProvider(prompt, provider, options);

      const { data: assistantMsg } = await service.from("messages").insert({
        conversation_id: convId,
        user_id: user.id,
        role: "assistant",
        content: assistantText
      }).select().single();

      await appendProgress({ userId: user.id, conversationId: convId, prompt, assistant: assistantText });
      await service.from("developer_progress_logs").insert({ user_id: user.id, conversation_id: convId, prompt, assistant: assistantText });

      return NextResponse.json({ assistant: assistantText, conversationId: convId });
    }
  } catch (err: any) {
    console.error("AI handle error:", err);
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}
