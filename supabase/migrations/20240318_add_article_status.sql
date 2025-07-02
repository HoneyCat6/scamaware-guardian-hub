-- Add status column with default value
ALTER TABLE public.articles 
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'approved';

-- Add constraint to status column
ALTER TABLE public.articles 
ADD CONSTRAINT articles_status_check 
CHECK (status IN ('pending', 'approved', 'rejected'));

-- Add reviewer columns
ALTER TABLE public.articles 
ADD COLUMN IF NOT EXISTS reviewer_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE;

-- Add author_id column and link to users
ALTER TABLE public.articles 
ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES auth.users(id);

-- Update existing articles to have author_id if missing
UPDATE public.articles 
SET status = 'approved' 
WHERE status IS NULL;

-- Create or update RLS policies
DROP POLICY IF EXISTS "Anyone can read approved articles" ON public.articles;
DROP POLICY IF EXISTS "Authenticated users can create articles" ON public.articles;
DROP POLICY IF EXISTS "Users can update their own articles" ON public.articles;
DROP POLICY IF EXISTS "Moderators and admins have full access" ON public.articles;

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

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
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND (auth.users.role = 'moderator' OR auth.users.role = 'admin')
        )
    ); 