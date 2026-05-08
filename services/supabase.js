import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn("Cảnh báo: Thiếu Supabase URL hoặc Key. Hãy kiểm tra file .env");
}

export const supabase = createClient(supabaseUrl, supabaseKey)
