import { supabase } from './supabase';
import { TABLES } from '../constants';

export const zodiacDetailService = {
 async getDetailsByZodiacId(zodiacId) {
 const { data, error } = await supabase.from(TABLES.ZODIAC_DETAILS).select('*').eq('zodiac_id', zodiacId);
 if (error) throw error;
 return data;
 }
};
