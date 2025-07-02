-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can read approved articles" ON public.articles;
DROP POLICY IF EXISTS "Authenticated users can create articles" ON public.articles;
DROP POLICY IF EXISTS "Users can update their own articles" ON public.articles;
DROP POLICY IF EXISTS "Moderators and admins have full access" ON public.articles;

-- Create a function to check if a user is a moderator or admin
CREATE OR REPLACE FUNCTION is_moderator_or_admin(user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = user_id
    AND role IN ('moderator', 'admin')
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Policy for reading approved articles (public access)
CREATE POLICY "Anyone can read approved articles" ON public.articles
    FOR SELECT
    USING (status = 'approved');

-- Policy for creating articles (authenticated users)
CREATE POLICY "Authenticated users can create articles" ON public.articles
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Policy for updating own articles (authors)
CREATE POLICY "Users can update their own articles" ON public.articles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = author_id)
    WITH CHECK (auth.uid() = author_id);

-- Policy for moderators and admins (full access)
CREATE POLICY "Moderators and admins have full access" ON public.articles
    FOR ALL
    TO authenticated
    USING (is_moderator_or_admin(auth.uid())); 