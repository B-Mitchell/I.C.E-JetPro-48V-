import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://qjsxbwdcqxfdimkplrej.supabase.co";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqc3hid2RjcXhmZGlta3BscmVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNDA4NDAsImV4cCI6MjA4MDkxNjg0MH0.iPnPD6mKjX262_uJ3_WzmSdFkT0bySR0e9S3XvQmsoU";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
