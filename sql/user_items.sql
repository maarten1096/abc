-- Create the user_items table
CREATE TABLE user_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL, -- 'summary'|'quiz'|'flashcards'|'note'|'other'
    tool_version TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    content JSONB, -- { text: "...", questions: [...], meta: {...} }
    tags TEXT[],
    visibility TEXT DEFAULT 'private', -- 'private'|'shared'|'class'
    file_id UUID NULL, -- This will be a foreign key to a user_files table
    embedding_id UUID NULL -- This will be a foreign key to an item_embeddings table
);

-- Create an index on user_id and created_at for faster queries
CREATE INDEX ON user_items(user_id, created_at DESC);
