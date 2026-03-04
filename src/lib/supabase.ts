import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize the Supabase client
// Note: This will only work if the environment variables are set in the AI Studio secrets panel.
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
