-- Create the item_embeddings table
CREATE TABLE item_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID REFERENCES user_items(id) ON DELETE CASCADE,
    user_id UUID, -- Redundant for faster filtering
    embedding vector(1536), -- pgvector with 1536 dimensions
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create an index for efficient similarity search
CREATE INDEX ON item_embeddings USING ivfflat (embedding vector_l2_ops) WITH (lists = 100);
