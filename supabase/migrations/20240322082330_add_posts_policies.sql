-- Enable RLS on posts table if not already enabled
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Policy for users to delete their own posts
CREATE POLICY "Users can delete their own posts"
ON public.posts
FOR DELETE
USING (auth.uid() = user_id);

-- Policy for moderators and admins to delete any post
CREATE POLICY "Moderators and admins can delete any post"
ON public.posts
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND (profiles.role = 'moderator' OR profiles.role = 'admin')
  )
);

-- Add other necessary policies if they don't exist

-- Policy for users to read all posts
CREATE POLICY IF NOT EXISTS "Anyone can read posts"
ON public.posts
FOR SELECT
USING (true);

-- Policy for authenticated users to create posts
CREATE POLICY IF NOT EXISTS "Authenticated users can create posts"
ON public.posts
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Policy for users to update their own posts
CREATE POLICY IF NOT EXISTS "Users can update their own posts"
ON public.posts
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
