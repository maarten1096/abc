
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { OpenAI } from 'openai';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY;

if (!supabaseUrl || !supabaseAnonKey || !openaiApiKey) {
    throw new Error('Missing environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const openai = new OpenAI({ apiKey: openaiApiKey });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { query, type_filter, limit } = req.body;

        // A real implementation would get the user from the request
        const user_id = '12345678-1234-1234-1234-1234567890ab'; // Replace with actual user ID

        // Generate embedding for the query
        const embeddingResponse = await openai.embeddings.create({
            model: 'text-embedding-ada-002',
            input: query,
        });

        const query_embedding = embeddingResponse.data[0].embedding;

        const { data, error } = await supabase.rpc('search_items', {
            query_embedding,
            match_threshold: 0.55,
            match_count: limit || 5,
            p_user_id: user_id,
            p_type_filter: type_filter,
        });


        if (error) {
            throw error;
        }

        res.status(200).json({ ok: true, matches: data });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
