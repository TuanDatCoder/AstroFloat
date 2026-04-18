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
  },

  async getZodiacAttributes(zodiacId) {
    if (!zodiacId) return [];
    // Join dữ liệu từ bảng zodiac_criteria
    const { data, error } = await supabase
      .from(TABLES.ZODIAC_ATTRIBUTES)
      .select('*, criteria:zodiac_criteria(*)')
      .eq('zodiac_id', zodiacId);

    if (error) {
      console.error('Error fetching zodiac attributes:', error);
      return [];
    }
    return data;
  },

  async getTopMatches(zodiacId, limit = 3) {
    if (!zodiacId) return [];
    
    const { data, error } = await supabase
      .from(TABLES.ZODIAC_MATCHES)
      .select('*')
      .or(`zodiac_sign_1_id.eq.${zodiacId},zodiac_sign_2_id.eq.${zodiacId}`)
      .order('match_score', { ascending: false })
      .limit(limit);

    if (error || !data) return [];
    
    const { zodiacService } = await import('./zodiacService');
    const allZodiacs = await zodiacService.getAllZodiacs();
    
    return data.map(match => {
      const otherId = match.zodiac_sign_1_id === zodiacId ? match.zodiac_sign_2_id : match.zodiac_sign_1_id;
      const otherSign = allZodiacs.find(z => z.id === otherId);
      return {
        ...otherSign,
        match_score: match.match_score
      };
    });
  },

  async getAllAttributesMatrix() {
    // Lấy toàn bộ attributes của tất cả các cung hoàng đạo
    const { data, error } = await supabase
      .from(TABLES.ZODIAC_ATTRIBUTES)
      .select('*, criteria:zodiac_criteria(*)');
    if (error) {
      console.error('Error fetching all attributes matrix:', error);
      return [];
    }
    return data;
  }
};
