import { supabase } from './client';

export async function setupDatabase() {
  // Check post_likes table
  const { error: likesError } = await supabase.from('post_likes').select('*').limit(1);

  if (likesError) {
    console.error('Error checking post_likes table:', likesError);
    // Try to create the table
    const { error: createLikesError } = await supabase.from('post_likes').insert({
      post_id: -1, // Dummy data to test table creation
      user_id: '00000000-0000-0000-0000-000000000000',
      created_at: new Date().toISOString()
    });

    if (createLikesError) {
      console.error('Error creating post_likes table:', createLikesError);
    }
  }

  // Check post_reports table
  const { error: reportsError } = await supabase.from('post_reports').select('*').limit(1);

  if (reportsError) {
    console.error('Error checking post_reports table:', reportsError);
    // Try to create the table
    const { error: createReportsError } = await supabase.from('post_reports').insert({
      post_id: -1, // Dummy data to test table creation
      user_id: '00000000-0000-0000-0000-000000000000',
      reason: 'Test',
      created_at: new Date().toISOString()
    });

    if (createReportsError) {
      console.error('Error creating post_reports table:', createReportsError);
    }
  }
}

import { supabase } from './client';

export async function checkTables() {
  // Check post_likes table
  const { error: likesError } = await supabase.from('post_likes').select('*').limit(1);

  if (likesError) {
    console.error('Error checking post_likes table:', likesError);
  }

  // Check post_reports table
  const { error: reportsError } = await supabase.from('post_reports').select('*').limit(1);

  if (reportsError) {
    console.error('Error checking post_reports table:', reportsError);
  }
}

// Call this function when the app starts
checkTables();

// Call this function when the app starts
setupDatabase();

export const setupThreadModeration = async () => {
  try {
    // Add audit columns to threads table
    const { error: alterError } = await supabase
      .from('threads')
      .select('id')
      .limit(1)
      .single();

    if (alterError) {
      // Table doesn't exist or no access, let's try to create it
      const { error: createError } = await supabase.rpc('run_sql', {
        sql_query: `
          -- Add audit columns to threads table if they don't exist
          DO $$ 
          BEGIN
            BEGIN
              ALTER TABLE public.threads
              ADD COLUMN locked_at timestamp with time zone,
              ADD COLUMN locked_by uuid REFERENCES auth.users(id),
              ADD COLUMN pinned_at timestamp with time zone,
              ADD COLUMN pinned_by uuid REFERENCES auth.users(id);
            EXCEPTION
              WHEN duplicate_column THEN
                -- Do nothing, columns already exist
            END;

            -- Add RLS policies for moderators if they don't exist
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
        `
      });

      if (createError) {
        throw createError;
      }
    }

    console.log('Thread moderation setup completed successfully');
    return true;
  } catch (error) {
    console.error('Error setting up thread moderation:', error);
    return false;
  }
}; 