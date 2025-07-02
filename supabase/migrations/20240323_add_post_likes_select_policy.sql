-- Enable RLS on post_likes
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

-- Allow users to select their own post_likes
CREATE POLICY "Users can select their own post_likes" ON public.post_likes
FOR SELECT
USING (auth.uid() = user_id); 