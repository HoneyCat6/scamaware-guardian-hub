-- First, drop existing foreign key constraint if it exists
ALTER TABLE public.posts
DROP CONSTRAINT IF EXISTS posts_thread_id_fkey;

-- Add cascade delete foreign key constraint
ALTER TABLE public.posts
ADD CONSTRAINT posts_thread_id_fkey
FOREIGN KEY (thread_id)
REFERENCES public.threads(id)
ON DELETE CASCADE;

-- Add RLS policy for thread deletion
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'threads' 
    AND policyname = 'Moderators can delete threads'
  ) THEN
    CREATE POLICY "Moderators can delete threads"
    ON public.threads
    FOR DELETE
    USING (
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role IN ('moderator', 'admin')
      )
    );
  END IF;
END $$;

-- Add RLS policy for post deletion (needed for cascade)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'posts' 
    AND policyname = 'Moderators can delete posts'
  ) THEN
    CREATE POLICY "Moderators can delete posts"
    ON public.posts
    FOR DELETE
    USING (
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role IN ('moderator', 'admin')
      )
    );
  END IF;
END $$; 