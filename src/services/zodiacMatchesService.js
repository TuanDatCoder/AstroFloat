import { supabase } from './supabase';
import { TABLES } from '../constants';

export const zodiacMatchesService = {
  async getZodiacMatch(zodiac1Id, zodiac2Id) {
    if (!zodiac1Id || !zodiac2Id) return null;
    
    // Tìm match dựa vào 2 ID. Do thứ tự có thể xuôi hoặc ngược nên dùng OR.
    const { data, error } = await supabase
      .from(TABLES.ZODIAC_MATCHES)
      .select('*')
      .or(`and(zodiac_sign_1_id.eq.${zodiac1Id},zodiac_sign_2_id.eq.${zodiac2Id}),and(zodiac_sign_1_id.eq.${zodiac2Id},zodiac_sign_2_id.eq.${zodiac1Id})`)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching zodiac match:', error);
      return null;
    }
    
    return data;
  }
};
