import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hsqdkgbcfmndzktuhhvy.supabase.co';
const supabaseAnonKey =     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzcWRrZ2JjZm1uZHprdHVoaHZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxNjIzMTAsImV4cCI6MjA2MTczODMxMH0.xP-bNA-Ksl2oDJDCW5DNMubtQepjP9Hr63JDUHr3kWA'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

