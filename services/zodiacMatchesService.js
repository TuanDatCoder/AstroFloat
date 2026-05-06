import { supabase } from './supabase';
import { TABLES, FIELD_ZODIAC_MATCHES, FIELD_ZODIAC_ATTRIBUTES } from '../constants';

export const zodiacMatchesService = {
 async getZodiacMatch(zodiac1Id, zodiac2Id) {
 if (!zodiac1Id || !zodiac2Id) return null;
 
 // Tìm match dựa vào 2 ID. Do thứ tự có thể xuôi hoặc ngược nên dùng OR.
 const { data, error } = await supabase
 .from(TABLES.ZODIAC_MATCHES)
 .select('*')
 .or(`and(${FIELD_ZODIAC_MATCHES.ZODIAC_SIGN_1_ID}.eq.${zodiac1Id},${FIELD_ZODIAC_MATCHES.ZODIAC_SIGN_2_ID}.eq.${zodiac2Id}),and(${FIELD_ZODIAC_MATCHES.ZODIAC_SIGN_1_ID}.eq.${zodiac2Id},${FIELD_ZODIAC_MATCHES.ZODIAC_SIGN_2_ID}.eq.${zodiac1Id})`)
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
 .eq(FIELD_ZODIAC_ATTRIBUTES.ZODIAC_ID, zodiacId);

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
 .or(`${FIELD_ZODIAC_MATCHES.ZODIAC_SIGN_1_ID}.eq.${zodiacId},${FIELD_ZODIAC_MATCHES.ZODIAC_SIGN_2_ID}.eq.${zodiacId}`)
 .order(FIELD_ZODIAC_MATCHES.MATCH_SCORE, { ascending: false })
 .limit(limit);

 if (error || !data) return [];
 
 const { zodiacService } = await import('./zodiacService');
 const allZodiacs = await zodiacService.getAllZodiacs();
 
 return data.map(match => {
 const otherId = match[FIELD_ZODIAC_MATCHES.ZODIAC_SIGN_1_ID] === zodiacId ? match[FIELD_ZODIAC_MATCHES.ZODIAC_SIGN_2_ID] : match[FIELD_ZODIAC_MATCHES.ZODIAC_SIGN_1_ID];
 const otherSign = allZodiacs.find(z => z.id === otherId);
 return {
 ...otherSign,
 match_score: match[FIELD_ZODIAC_MATCHES.MATCH_SCORE]
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
 },

 async getAllMatches() {
 const { data, error } = await supabase.from(TABLES.ZODIAC_MATCHES).select('*, sign1:zodiac_signs!zodiac_sign_1_id(*), sign2:zodiac_signs!zodiac_sign_2_id(*)');
 if (error) throw error;
 return data;
 },

 async createMatch(matchData) {
 const { data, error } = await supabase.from(TABLES.ZODIAC_MATCHES).insert([matchData]).select().single();
 if (error) throw error;
 return data;
 },

 async updateMatch(id, matchData) {
 const { data, error } = await supabase.from(TABLES.ZODIAC_MATCHES).update(matchData).eq(FIELD_ZODIAC_MATCHES.ID, id).select().single();
 if (error) throw error;
 return data;
 },

 async deleteMatch(id) {
 const { error } = await supabase.from(TABLES.ZODIAC_MATCHES).delete().eq(FIELD_ZODIAC_MATCHES.ID, id);
 if (error) throw error;
 return true;
 }
};
