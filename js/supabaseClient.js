const SUPABASE_URL = 'https://gdwvaxnctfxxwwhbhmtl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdkd3ZheG5jdGZ4eHd3aGJobXRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4Njg2MzAsImV4cCI6MjA2MDQ0NDYzMH0.svXFtVsW3VM_Y4VzKKsE7Yt5V5PQcd0FLGlDf-aE3t8';

const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
window.supabaseClient = client;