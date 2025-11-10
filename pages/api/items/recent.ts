
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // A real implementation would get the user from the request
        const user_id = '12345678-1234-1234-1234-1234567890ab'; // Replace with actual user ID

        const { data, error } = await supabase
            .from('user_items')
            .select('id, title, description, type, created_at')
            .eq('user_id', user_id)
            .order('created_at', { ascending: false })
            .limit(12);

        if (error) {
            throw error;
        }

        res.status(200).json({ ok: true, items: data });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
