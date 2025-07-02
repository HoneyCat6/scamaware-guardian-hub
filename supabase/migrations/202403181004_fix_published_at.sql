-- Allow null values for published_at
ALTER TABLE public.articles 
ALTER COLUMN published_at DROP NOT NULL; 