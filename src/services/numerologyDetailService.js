import { supabase } from './supabase';
import { TABLES, FIELD_NUMEROLOGY_DETAILS } from '../constants';

export const numerologyDetailService = {
 async getDetailsByNumber(number) {
 const { data, error } = await supabase.from(TABLES.NUMEROLOGY_DETAILS).select('*').eq(FIELD_NUMEROLOGY_DETAILS.NUMBER, number);
 if (error) throw error;
 return data;
 }
};
