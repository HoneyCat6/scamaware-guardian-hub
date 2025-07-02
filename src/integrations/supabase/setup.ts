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