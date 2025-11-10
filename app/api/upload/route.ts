
import { createClient } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  // For now, we'll use a hardcoded user_id. 
  // In the future, we'll get this from the user's session.
  const user_id = 'f5c6b6a0-5b16-4f33-8299-4782b3a9d0a0'; 
  const fileName = `${user_id}/${uuidv4()}-${file.name}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('user_files') // The name of your storage bucket
    .upload(fileName, file);

  if (uploadError) {
    console.error('Error uploading file:', uploadError);
    return NextResponse.json({ error: 'Error uploading file' }, { status: 500 });
  }

  const { data: fileData, error: dbError } = await supabase
    .from('user_files')
    .insert({
      user_id,
      filename: file.name,
      mime: file.type,
      storage_path: uploadData.path,
      // In a real app, you'd calculate a proper hash
      file_hash: 'dummy_hash', 
    })
    .select('id')
    .single();

  if (dbError) {
    console.error('Error saving file metadata:', dbError);
    return NextResponse.json({ error: 'Error saving file metadata' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, file_id: fileData.id }, { status: 200 });
}
