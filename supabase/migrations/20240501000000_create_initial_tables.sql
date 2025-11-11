
CREATE TABLE IF NOT EXISTS public.users (
    id uuid NOT NULL,
    email text,
    username text,
    tier text DEFAULT 'free',
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS public.user_files (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    filename text,
    mime text,
    storage_path text,
    file_hash text,
    pages integer,
    uploaded_at timestamp with time zone DEFAULT now(),
    CONSTRAINT user_files_pkey PRIMARY KEY (id),
    CONSTRAINT user_files_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.user_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    title text NOT NULL,
    description text,
    type text NOT NULL,
    tool_version text,
    content jsonb NOT NULL,
    tags text[] DEFAULT '{}'::text[],
    visibility text DEFAULT 'private'::text,
    file_id uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    content_hash text,
    embedding_vector real[],
    embedding_id uuid,
    CONSTRAINT user_items_pkey PRIMARY KEY (id),
    CONSTRAINT user_items_file_id_fkey FOREIGN KEY (file_id) REFERENCES public.user_files(id),
    CONSTRAINT user_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS user_items_user_id_created_at_idx ON public.user_items USING btree (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.item_embeddings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    item_id uuid,
    user_id uuid,
    embedding vector(1536),
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT item_embeddings_pkey PRIMARY KEY (id),
    CONSTRAINT item_embeddings_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.user_items(id) ON DELETE CASCADE
);
