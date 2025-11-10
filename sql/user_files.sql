-- Create the user_files table
CREATE TABLE user_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    filename TEXT NOT NULL,
    mime TEXT,
    storage_path TEXT NOT NULL, -- The path to the file in Supabase Storage
    file_hash TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create an index on user_id for faster queries
CREATE INDEX ON user_files(user_id);
