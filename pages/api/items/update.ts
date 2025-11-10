
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
        const { id, title, description, content, save_embedding } = req.body;

        // A real implementation would validate the user and ownership of the item

        const { data, error } = await supabase
            .from('user_items')
            .update({ title, description, content, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw error;
        }

        // In a real implementation, you would trigger a background job for embeddings if save_embedding is true
        // and the content has changed significantly.

        res.status(200).json({ ok: true, item: data });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
