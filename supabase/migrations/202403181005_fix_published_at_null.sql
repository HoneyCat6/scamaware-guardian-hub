-- Drop the not-null constraint from published_at
ALTER TABLE public.articles 
ALTER COLUMN published_at DROP NOT NULL;

-- Update any existing null values to have a timestamp if status is approved
UPDATE public.articles 
SET published_at = created_at 
WHERE status = 'approved' AND published_at IS NULL; 