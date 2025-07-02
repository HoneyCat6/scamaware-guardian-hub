import { supabase } from '../src/integrations/supabase/client';

async function checkTables() {
  // Check post_likes table
  const { error: likesError } = await supabase.from('post_likes').select('*').limit(1);

  if (likesError) {
    console.error('Error checking post_likes table:', likesError);
  } else {
    console.log('post_likes table exists');
  }

  // Check post_reports table
  const { error: reportsError } = await supabase.from('post_reports').select('*').limit(1);

  if (reportsError) {
    console.error('Error checking post_reports table:', reportsError);
  } else {
    console.log('post_reports table exists');
  }
}

checkTables(); 