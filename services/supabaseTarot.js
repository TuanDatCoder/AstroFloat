import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_TAROT_SUPABASE_URL || 'https://vmnuwravgdeqlniuvtgo.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_TAROT_SUPABASE_KEY;

if (!supabaseKey || supabaseKey === 'YOUR_TAROT_SUPABASE_ANON_KEY_HERE') {
  console.warn(
    "Cảnh báo: Thiếu hoặc chưa cấu hình NEXT_PUBLIC_TAROT_SUPABASE_KEY trong file .env. Hãy cập nhật để kết nối Tarot DB."
  );
}

export const supabaseTarot = createClient(
  supabaseUrl,
  supabaseKey && supabaseKey !== 'YOUR_TAROT_SUPABASE_ANON_KEY_HERE' 
    ? supabaseKey 
    : 'dummy-anon-key-prevent-crash'
);
