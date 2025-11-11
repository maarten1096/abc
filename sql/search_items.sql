
create or replace function search_items(
  query_embedding vector(1536),
  type_filter text[],
  match_limit int
)
returns table (
  id uuid,
  title text,
  description text,
  type text,
  created_at timestamptz,
  similarity float
)
as $$
begin
  return query
  select
    ui.id,
    ui.title,
    ui.description,
    ui.type,
    ui.created_at,
    1 - (ie.embedding <=> query_embedding) as similarity
  from item_embeddings as ie
  join user_items as ui on ie.item_id = ui.id
  where
    (type_filter is null or ui.type = any(type_filter))
  order by
    ie.embedding <=> query_embedding
  limit
    match_limit;
end;
$$ language plpgsql;
