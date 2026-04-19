import { supabase } from './supabase';
import { TABLES, FIELD_ZODIAC_SIGNS } from '../constants';

export const zodiacService = {
 async getAllZodiacs() {
 const { data, error } = await supabase.from(TABLES.ZODIAC_SIGNS).select('*');
 if (error) throw error;
 return data;
 },

 async getZodiacById(id) {
 const { data, error } = await supabase.from(TABLES.ZODIAC_SIGNS).select('*').eq(FIELD_ZODIAC_SIGNS.ID, id).single();
 if (error) throw error;
 return data;
 },

 async getZodiacIdByDate(dateString) {
 if (!dateString) return null;
 const zodiacs = await this.getAllZodiacs();
 if (!zodiacs || zodiacs.length === 0) return null;

 const date = new Date(dateString);
 if (isNaN(date)) return null;

 const m = date.getMonth() + 1; // 1 -> 12
 const d = date.getDate();

 for (const z of zodiacs) {
 if (!z[FIELD_ZODIAC_SIGNS.START_MONTH] || !z[FIELD_ZODIAC_SIGNS.END_MONTH] || !z[FIELD_ZODIAC_SIGNS.START_DAY] || !z[FIELD_ZODIAC_SIGNS.END_DAY]) continue;
 
 // Nếu cùng trong 1 năm (VD: 3/21 -> 4/19)
 if (z[FIELD_ZODIAC_SIGNS.START_MONTH] <= z[FIELD_ZODIAC_SIGNS.END_MONTH]) {
 if ((m === z[FIELD_ZODIAC_SIGNS.START_MONTH] && d >= z[FIELD_ZODIAC_SIGNS.START_DAY]) || (m === z[FIELD_ZODIAC_SIGNS.END_MONTH] && d <= z[FIELD_ZODIAC_SIGNS.END_DAY]) || (m > z[FIELD_ZODIAC_SIGNS.START_MONTH] && m < z[FIELD_ZODIAC_SIGNS.END_MONTH])) {
 return z[FIELD_ZODIAC_SIGNS.ID];
 }
 } else {
 // Vắt qua năm tiếp theo (VD Ma Kết: 12/22 -> 1/19)
 if ((m === z[FIELD_ZODIAC_SIGNS.START_MONTH] && d >= z[FIELD_ZODIAC_SIGNS.START_DAY]) || (m === z[FIELD_ZODIAC_SIGNS.END_MONTH] && d <= z[FIELD_ZODIAC_SIGNS.END_DAY]) || (m > z[FIELD_ZODIAC_SIGNS.START_MONTH]) || (m < z[FIELD_ZODIAC_SIGNS.END_MONTH])) {
 return z[FIELD_ZODIAC_SIGNS.ID];
 }
 }
 }
 return null;
  },

  async createZodiac(zodiacData) {
    const { data, error } = await supabase.from(TABLES.ZODIAC_SIGNS).insert([zodiacData]).select().single();
    if (error) throw error;
    return data;
  },

  async updateZodiac(id, zodiacData) {
    const { data, error } = await supabase.from(TABLES.ZODIAC_SIGNS).update(zodiacData).eq(FIELD_ZODIAC_SIGNS.ID, id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteZodiac(id) {
    const { error } = await supabase.from(TABLES.ZODIAC_SIGNS).delete().eq(FIELD_ZODIAC_SIGNS.ID, id);
    if (error) throw error;
    return true;
  }
};
