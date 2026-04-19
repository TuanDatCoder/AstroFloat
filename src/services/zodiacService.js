import { supabase } from './supabase';
import { TABLES } from '../constants';

export const zodiacService = {
 async getAllZodiacs() {
 const { data, error } = await supabase.from(TABLES.ZODIAC_SIGNS).select('*');
 if (error) throw error;
 return data;
 },

 async getZodiacById(id) {
 const { data, error } = await supabase.from(TABLES.ZODIAC_SIGNS).select('*').eq('id', id).single();
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
 if (!z.start_month || !z.end_month || !z.start_day || !z.end_day) continue;
 
 // Nếu cùng trong 1 năm (VD: 3/21 -> 4/19)
 if (z.start_month <= z.end_month) {
 if ((m === z.start_month && d >= z.start_day) || (m === z.end_month && d <= z.end_day) || (m > z.start_month && m < z.end_month)) {
 return z.id;
 }
 } else {
 // Vắt qua năm tiếp theo (VD Ma Kết: 12/22 -> 1/19)
 if ((m === z.start_month && d >= z.start_day) || (m === z.end_month && d <= z.end_day) || (m > z.start_month) || (m < z.end_month)) {
 return z.id;
 }
 }
 }
 return null;
 }
};
