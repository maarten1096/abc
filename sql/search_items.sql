
-- Create the search_items RPC function
CREATE OR REPLACE FUNCTION search_items(
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  p_user_id uuid,
  p_type_filter text[]
)
RETURNS TABLE (
  item_id uuid,
  title text,
  description text,
  type text,
  similarity float,
  snippet text
)
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ie.item_id,
    ui.title,
    ui.description,
    ui.type,
    1 - (ie.embedding <=> query_embedding) AS similarity,
    LEFT(ui.content->>'text', 200) as snippet
  FROM item_embeddings AS ie
  JOIN user_items AS ui ON ie.item_id = ui.id
  WHERE ie.user_id = p_user_id
  AND (p_type_filter IS NULL OR ui.type = ANY(p_type_filter))
  AND (1 - (ie.embedding <=> query_embedding)) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$ LANGUAGE plpgsql;
