
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const { source_item_id, target_tool, options } = await request.json();
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse(
      JSON.stringify({ ok: false, message: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!source_item_id || !target_tool) {
    return new NextResponse(
        JSON.stringify({ ok: false, message: 'source_item_id and target_tool are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 1. Fetch the source item
  const { data: sourceItem, error: sourceError } = await supabase
    .from('user_items')
    .select('content, title, description')
    .eq('id', source_item_id)
    .eq('user_id', user.id)
    .single();

  if (sourceError || !sourceItem) {
    console.error('Error fetching source item:', sourceError);
    return new NextResponse(
        JSON.stringify({ ok: false, message: 'Source item not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 2. Call the AI handler to generate the new content
  // In a real app, this would be a more complex call to a streaming AI handler.
  // Here, we'll simulate the generation and then create the new item.
  // This is a placeholder for the actual AI generation logic.
  const newContent = {
    generated_from_item: source_item_id,
    ...options,
    // Placeholder for generated content
    questions: Array.from({ length: options.question_count || 10 }, (_, i) => ({
        id: `q-${i + 1}`,
        question: `Generated question ${i + 1}?`,
        options: ['A', 'B', 'C', 'D'],
        correctIndex: 0,
        explanation: 'This is a generated explanation.',
    })),
  };

  const newTitle = `Quiz from: ${sourceItem.title}`;
  const newDescription = `A quiz generated from the summary: ${sourceItem.description}`;

  // 3. Save the new item
  const { data: newItem, error: newItemError } = await supabase
    .from('user_items')
    .insert({
        user_id: user.id,
        title: newTitle,
        description: newDescription,
        type: target_tool,
        content: newContent,
        tool_version: 'import_v1',
    })
    .select('id, title, description, type, created_at')
    .single();

  if (newItemError) {
    console.error('Error creating new item:', newItemError);
    return new NextResponse(
        JSON.stringify({ ok: false, message: 'Failed to create new item' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return NextResponse.json({ ok: true, new_item_id: newItem.id, new_item_meta: newItem });
}
