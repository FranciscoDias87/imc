import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://qbrmtbqvxmqhkrfttcxm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFicm10YnF2eG1xaGtyZnR0Y3htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MzI5NTAsImV4cCI6MjA4NjQwODk1MH0.-HT3U40wbf3oKYwZU1KJL3dgd_3wQDanoyXH7B1IFh8"

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);