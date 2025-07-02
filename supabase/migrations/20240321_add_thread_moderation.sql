-- Add moderation columns to threads table
ALTER TABLE public.threads
ADD COLUMN IF NOT EXISTS is_pinned boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_locked boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS locked_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS locked_by uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS pinned_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS pinned_by uuid REFERENCES auth.users(id);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_threads_is_pinned ON public.threads(is_pinned);
CREATE INDEX IF NOT EXISTS idx_threads_is_locked ON public.threads(is_locked);

-- Add RLS policies for moderators
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'threads' 
    AND policyname = 'Moderators can update thread moderation status'
  ) THEN
    CREATE POLICY "Moderators can update thread moderation status"
    ON public.threads
    FOR UPDATE
    USING (
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role IN ('moderator', 'admin')
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role IN ('moderator', 'admin')
      )
    );
  END IF;
END $$; 