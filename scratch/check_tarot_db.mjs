import { createClient } from '@supabase/supabase-js';
const NEXT_PUBLIC_TAROT_SUPABASE_URL="https://vmnuwravgdeqlniuvtgo.supabase.co"
const NEXT_PUBLIC_TAROT_SUPABASE_KEY="sb_publishable_xA6MfYv1wAarcwaShxk_sw_rnszT_VF"
const supabase = createClient(NEXT_PUBLIC_TAROT_SUPABASE_URL, NEXT_PUBLIC_TAROT_SUPABASE_KEY);
async function checkData() {
  const tpl = await supabase.from('tarot_templates').select('*', { count: 'exact', head: true });
  console.log("Templates count:", tpl.count, tpl.error);
  const mn = await supabase.from('tarot_meanings').select('*', { count: 'exact', head: true });
  console.log("Meanings count:", mn.count, mn.error);
  const cards = await supabase.from('tarot_cards').select('*', { count: 'exact', head: true });
  console.log("Cards count:", cards.count, cards.error);
  const pos = await supabase.from('tarot_topic_positions').select('*', { count: 'exact', head: true });
  console.log("Positions count:", pos.count, pos.error);
}
checkData();
