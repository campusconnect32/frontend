import { createClient } from '@supabase/supabase-js';

//const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
//const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

const SUPABASE_URL = "https://rqhktqlensnshysxqyax.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxaGt0cWxlbnNuc2h5c3hxeWF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1MTkzMzIsImV4cCI6MjA5NzA5NTMzMn0.fjKzjg3MNAQ2XWwefLV2GPn_b3rZ8oII4veZelhqpl8";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);