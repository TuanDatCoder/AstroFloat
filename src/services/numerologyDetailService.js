import { supabase } from './supabase';
import { TABLES } from '../constants';

export const numerologyDetailService = {
  async getDetailsByNumber(number) {
    const { data, error } = await supabase.from(TABLES.NUMEROLOGY_DETAILS).select('*').eq('number', number);
    if (error) throw error;
    return data;
  }
};
