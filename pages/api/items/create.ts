
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // A real implementation would get the user from the request, e.g., from a JWT
        const { title, description, type, content, file_id, save_embedding } = req.body;

        // A real implementation would validate the user
        // For now, we'll use a placeholder user_id
        const user_id = '12345678-1234-1234-1234-1234567890ab'; // Replace with actual user ID

        const { data, error } = await supabase
            .from('user_items')
            .insert([{ title, description, type, content, file_id, user_id }])
            .select()
            .single();

        if (error) {
            throw error;
        }

        // In a real implementation, you would trigger a background job for embeddings if save_embedding is true
        // For example:
        // if (save_embedding) {
        //   await fetch('/api/embeddings/generate', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ item_id: data.id }),
        //   });
        // }

        res.status(200).json({ ok: true, item: data });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
