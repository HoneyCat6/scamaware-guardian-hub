-- Drop existing foreign key constraints if they exist
ALTER TABLE public.articles 
DROP CONSTRAINT IF EXISTS articles_author_id_fkey,
DROP CONSTRAINT IF EXISTS articles_reviewer_id_fkey;

-- Add foreign key constraints with proper references
ALTER TABLE public.articles
ADD CONSTRAINT articles_author_id_fkey 
FOREIGN KEY (author_id) 
REFERENCES auth.users(id)
ON DELETE SET NULL;

ALTER TABLE public.articles
ADD CONSTRAINT articles_reviewer_id_fkey 
FOREIGN KEY (reviewer_id) 
REFERENCES auth.users(id)
ON DELETE SET NULL; 